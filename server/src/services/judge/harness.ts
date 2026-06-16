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

_SENTINEL = ${JSON.stringify(RESULT_SENTINEL)}

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
            with _ctx.redirect_stdout(buf):
                actual = method(*_copy.deepcopy(args))
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

    payload = {
        "status": overall,
        "passed": sum(1 for r in results if r["status"] == "accepted"),
        "total": len(results),
        "results": results,
    }
    print(_SENTINEL + _json.dumps(payload))

_run()
`;

// Wraps user code with the preamble and driver into a single runnable file.
export function buildHarness(userCode: string): string
{
  return `${PREAMBLE}\n${userCode}\n${DRIVER}`;
}
