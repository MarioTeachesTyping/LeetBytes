// ============ //
// Judge Harness //
// ============ //

// The harness is plain Python that we prepend/append around the user's code so a
// single file can be executed by any runner (Piston or local-python). It reads a
// JSON spec from stdin, calls the user's Solution method per test case, and prints
// one machine-readable line that starts with RESULT_SENTINEL. Anything the user
// prints is captured per case so it never collides with that line.

export const RESULT_SENTINEL = "__LEETBYTES_RESULT__";

// Imports and node definitions LeetCode provides for free, so pasted solutions
// that reference `List[int]`, `defaultdict`, `ListNode`, etc. still run.
const PREAMBLE = `from typing import List, Optional, Dict, Set, Tuple, Any
import collections
from collections import defaultdict, deque, Counter, OrderedDict
import math, heapq, bisect, functools, itertools, re, string

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
`;

const DRIVER = `
import sys as _sys
import json as _json
import io as _io
import time as _time
import traceback as _tb
import copy as _copy
import contextlib as _ctx

# Peak resident memory is read from getrusage after the run. Unix-only (Piston
# runs on Linux); absent on Windows (the local dev runner), where memory is
# reported as null and the client renders a dash.
try:
    import resource as _resource
except Exception:
    _resource = None

_SENTINEL = ${JSON.stringify(RESULT_SENTINEL)}

# ---- I/O adapters ----------------------------------------------------------
# Problems whose parameters or return value are linked lists or trees declare a
# logical type (e.g. "ListNode") in their spec. We decode JSON -> node objects
# before calling the user's method and encode node objects -> JSON afterward, so
# comparison, serialization, and the readable input string never touch live node
# instances. LeetCode's own serialization is used: linked lists are flat arrays;
# binary trees are level-order arrays with null for missing children and trailing
# nulls trimmed.

def _to_listnode(value):
    head = None
    for v in reversed(value or []):
        head = ListNode(v, head)
    return head

def _from_listnode(node):
    out = []
    while node is not None:
        out.append(node.val)
        node = node.next
    return out

def _to_treenode(value):
    values = list(value or [])
    if not values:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

def _from_treenode(node):
    out = []
    queue = deque([node])
    while queue:
        n = queue.popleft()
        if n is None:
            out.append(None)
            continue
        out.append(n.val)
        queue.append(n.left)
        queue.append(n.right)
    while out and out[-1] is None:
        out.pop()
    return out

def _array_of(fn):
    return lambda value: [fn(x) for x in (value or [])]

_DECODERS = {
    "ListNode": _to_listnode,
    "TreeNode": _to_treenode,
    "ListNode[]": _array_of(_to_listnode),
    "TreeNode[]": _array_of(_to_treenode),
}

_ENCODERS = {
    "ListNode": _from_listnode,
    "TreeNode": _from_treenode,
    "ListNode[]": _array_of(_from_listnode),
    "TreeNode[]": _array_of(_from_treenode),
}

def _decode(value, io_type):
    return _DECODERS.get(io_type, lambda v: v)(value)

def _encode(value, io_type):
    return _ENCODERS.get(io_type, lambda v: v)(value)

def _canon(value, mode):
    try:
        if mode == "unordered" and isinstance(value, list):
            return sorted(value)
        if mode == "unordered_deep" and isinstance(value, list):
            inner = [sorted(x) if isinstance(x, list) else x for x in value]
            return sorted(inner)
    except TypeError:
        return value
    return value

def _equal(actual, expected, mode):
    try:
        return _canon(actual, mode) == _canon(expected, mode)
    except Exception:
        return actual == expected

def _serialize(value):
    try:
        return _json.dumps(value, default=str)
    except Exception:
        return repr(value)

def _run():
    spec = _json.load(_sys.stdin)
    fn = spec["functionName"]
    mode = spec.get("compare", "exact")
    arg_types = spec.get("argTypes") or []
    return_type = spec.get("returnType")
    tests = spec.get("tests", [])
    results = []
    overall = "accepted"

    for i, test in enumerate(tests):
        args = test.get("args", [])
        expected = test.get("expected")
        buf = _io.StringIO()
        start = _time.perf_counter()
        try:
            solution = Solution()
            method = getattr(solution, fn)
            # Deep-copy the raw JSON first (isolating each case from in-place
            # mutation), then decode declared slots into fresh node objects.
            call_args = [
                _decode(_copy.deepcopy(a), arg_types[j]) if j < len(arg_types) else _copy.deepcopy(a)
                for j, a in enumerate(args)
            ]
            with _ctx.redirect_stdout(buf):
                actual = method(*call_args)
            if return_type:
                actual = _encode(actual, return_type)
            elapsed = (_time.perf_counter() - start) * 1000
            passed = _equal(actual, expected, mode)
            results.append({
                "index": i,
                "status": "accepted" if passed else "wrong_answer",
                "expected": _serialize(expected),
                "actual": _serialize(actual),
                "stdout": buf.getvalue(),
                "runtimeMs": round(elapsed, 3),
            })
            if not passed and overall == "accepted":
                overall = "wrong_answer"
        except Exception:
            elapsed = (_time.perf_counter() - start) * 1000
            results.append({
                "index": i,
                "status": "runtime_error",
                "expected": _serialize(expected),
                "stdout": buf.getvalue(),
                "stderr": _tb.format_exc(),
                "runtimeMs": round(elapsed, 3),
            })
            if overall in ("accepted", "wrong_answer"):
                overall = "runtime_error"

    # Peak resident set size of the whole process. ru_maxrss is kilobytes on
    # Linux, so the value already matches the unit the server expects.
    memory_kb = None
    if _resource is not None:
        try:
            memory_kb = _resource.getrusage(_resource.RUSAGE_SELF).ru_maxrss
        except Exception:
            memory_kb = None

    payload = {
        "status": overall,
        "passed": sum(1 for r in results if r["status"] == "accepted"),
        "total": len(results),
        "results": results,
        "memoryKb": memory_kb,
    }
    print(_SENTINEL + _json.dumps(payload))

_run()
`;

// Wraps user code with the preamble and driver into a single runnable file.
export function buildHarness(userCode: string): string
{
  return `${PREAMBLE}\n${userCode}\n${DRIVER}`;
}
