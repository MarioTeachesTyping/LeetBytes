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

# Memory is read from getrusage (peak process RSS, LeetCode-like) when available.
# resource is Unix-only, so on Windows (the local dev runner) we fall back to the
# stdlib tracemalloc peak — a smaller Python-allocation figure, but cross-platform
# so a value still shows during local development.
try:
    import resource as _resource
except Exception:
    _resource = None

try:
    import tracemalloc as _tracemalloc
except Exception:
    _tracemalloc = None

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

def _to_listnode_cycle(value):
    spec = value or {}
    values = list(spec.get("values") or [])
    pos = spec.get("pos", -1)
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if nodes and 0 <= pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0] if nodes else None

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
    "ListNodeCycle": _to_listnode_cycle,
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

# Peak memory in kilobytes. ru_maxrss is already KB on Linux; tracemalloc
# reports bytes, so convert. Both are the unit the server/client expect.
def _peak_memory_kb():
    if _resource is not None:
        try:
            return _resource.getrusage(_resource.RUSAGE_SELF).ru_maxrss
        except Exception:
            return None
    if _tracemalloc is not None:
        try:
            return round(_tracemalloc.get_traced_memory()[1] / 1024)
        except Exception:
            return None
    return None

def _overall_status(results):
    if any(r["status"] == "runtime_error" for r in results):
        return "runtime_error"
    if any(r["status"] == "wrong_answer" for r in results):
        return "wrong_answer"
    return "accepted"

def _payload(results):
    return {
        "status": _overall_status(results),
        "passed": sum(1 for r in results if r["status"] == "accepted"),
        "total": len(results),
        "results": results,
        "memoryKb": _peak_memory_kb(),
    }

# A regular problem: one Solution method is called per test case.
def _run_function(spec):
    fn = spec["functionName"]
    mode = spec.get("compare", "exact")
    arg_types = spec.get("argTypes") or []
    return_type = spec.get("returnType")
    tests = spec.get("tests", [])
    results = []

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

    print(_SENTINEL + _json.dumps(_payload(results)))

# A "design" problem: each test case instantiates class_name (operations[0])
# then calls the rest of operations in sequence on that one instance,
# args-aligned, comparing the whole per-operation output list against expected.
def _run_design(spec, class_name):
    tests = spec.get("tests", [])
    results = []

    for i, test in enumerate(tests):
        operations = test.get("operations", [])
        args_list = test.get("args", [])
        expected = test.get("expected", [])
        buf = _io.StringIO()
        start = _time.perf_counter()
        try:
            cls = globals().get(class_name)
            instance = None
            actual = []
            with _ctx.redirect_stdout(buf):
                for j, op in enumerate(operations):
                    call_args = _copy.deepcopy(args_list[j]) if j < len(args_list) else []
                    if j == 0:
                        instance = cls(*call_args)
                        actual.append(None)
                    else:
                        actual.append(getattr(instance, op)(*call_args))
            elapsed = (_time.perf_counter() - start) * 1000
            passed = _equal(actual, expected, "exact")
            results.append({
                "index": i,
                "status": "accepted" if passed else "wrong_answer",
                "expected": _serialize(expected),
                "actual": _serialize(actual),
                "stdout": buf.getvalue(),
                "runtimeMs": round(elapsed, 3),
            })
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

    print(_SENTINEL + _json.dumps(_payload(results)))

def _run():
    spec = _json.load(_sys.stdin)

    # Without getrusage, track Python allocations so memory still has a value.
    if _resource is None and _tracemalloc is not None:
        _tracemalloc.start()

    class_name = spec.get("className")
    if class_name:
        _run_design(spec, class_name)
    else:
        _run_function(spec)

_run()
`;

// Wraps user code with the preamble and driver into a single runnable file.
export function buildHarness(userCode: string): string
{
  return `${PREAMBLE}\n${userCode}\n${DRIVER}`;
}
