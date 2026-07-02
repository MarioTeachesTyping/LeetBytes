# Server

Backend API for LeetBytes.

## Run locally

```bash
npm install
npm run dev
```

The server listens on `http://localhost:4000` by default.

## Scripts

- `npm run dev`: run the TypeScript server with watch mode
- `npm run typecheck`: check TypeScript without emitting files
- `npm run build`: compile TypeScript into `dist`
- `npm start`: run the compiled server from `dist`

## Routes

### `GET /health`

Returns `{ "ok": true }`.

### `GET /problems/:slug/cases`

Returns a problem's public example inputs for the Test Cases editor: the parameter
names and each case's `args`/`expected`. Only the published examples are exposed —
the hidden judged suite stays server-side.

```json
{
  "paramNames": ["nums", "target"],
  "cases": [{ "args": [[2, 7, 11, 15], 9], "expected": [0, 1] }]
}
```

### `POST /submissions/run`

The "Run" testbench. Executes a `class Solution` submission against the problem's
public example cases and returns per-case output. It optionally accepts user-edited
`cases` (from the Test Cases editor) to run custom inputs instead of the defaults;
each case only needs an `args` array. This path does not gate on correctness — it
returns `200` whenever the cases could be run.

```json
{
  "problemSlug": "two-sum",
  "language": "python",
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        ...",
  "cases": [{ "args": [[2, 7, 11, 15], 9] }]
}
```

The response shares the judge shape: a `results` array with each case's `input`,
`actual`, `stdout`, and any error. Custom inputs have no known expected answer, so
the client only shows Expected for unedited cases.

### `POST /submissions/judge`

The "Submit" path. Runs a `class Solution` submission against the problem's
server-owned hidden test cases and grades it.

```json
{
  "problemSlug": "two-sum",
  "language": "python",
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        ..."
}
```

Returns `200` when the verdict is `accepted`, otherwise `422`. The response reports
an overall `status` (`accepted` / `wrong_answer` / `runtime_error` /
`time_limit_exceeded` / `compile_error` / `error`), `passed`/`total`, a per-case
`results` array (input, expected, actual, per-case runtime), the total `runtimeMs`
(sum of per-case execution times), and `memoryKb` (peak memory).

The server wraps the submitted code in a Python harness (see
`src/services/judge/harness.ts`) that calls the method named in the problem
definition for each test case. Test cases and the method name live server-side in
`src/problems/`, so the client never sees the answer key. The harness includes JSON
adapters for `ListNode`/`TreeNode` arguments and return values, so linked-list and
tree problems are judged too.

Memory is measured inside the harness: peak RSS via `resource.getrusage` on Linux
(e.g. self-hosted Piston), falling back to `tracemalloc` on Windows where `resource`
is unavailable. The client shows runtime and memory on accepted or partial
("Almost") verdicts.

Judging reuses the same runner switch as `/submissions/run`, so it works against
Piston or, for local development, `CODE_RUNNER=local-python`.

## Runner options

The default runner is Piston:

```txt
CODE_RUNNER=piston
PISTON_API_URL=https://emkc.org/api/v2/piston
```

The public Piston API is whitelist-only as of February 15, 2026, so you will likely need to self-host Piston and point `PISTON_API_URL` at that instance.

For local development with trusted code only, you can run directly against a local Python install:

```txt
CODE_RUNNER=local-python
LOCAL_PYTHON_COMMAND=python
```

Note: memory is reported as full process RSS on Linux runners, but on Windows the
local runner falls back to `tracemalloc` (Python allocations only), so the numbers
run smaller there.

Environment variables:

- `PORT`: server port, defaults to `4000`
- `CLIENT_ORIGIN`: allowed browser origin, defaults to `http://localhost:3000`
- `CODE_RUNNER`: `piston` or `local-python`, defaults to `piston`
- `PISTON_API_URL`: Piston base URL, defaults to `https://emkc.org/api/v2/piston`
- `PISTON_PYTHON_VERSION`: optional fixed Python runtime version
- `LOCAL_PYTHON_COMMAND`: Python executable for local dev runner, defaults to `python`
