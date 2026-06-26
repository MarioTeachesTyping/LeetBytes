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

### `POST /submissions/run`

Runs a Python submission and returns its raw stdout/stderr. This is the "Run"
scratchpad path — it does not grade anything.

```json
{
  "language": "python",
  "code": "print('hello from LeetBytes')",
  "stdin": ""
}
```

### `POST /submissions/judge`

The "Submit" path. Runs a `class Solution` submission against the problem's
server-owned test cases and grades it.

```json
{
  "problemSlug": "two-sum",
  "language": "python",
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        ..."
}
```

Returns `200` when the verdict is `accepted`, otherwise `422`. The response
reports an overall `status` (`accepted` / `wrong_answer` / `runtime_error` /
`time_limit_exceeded` / `compile_error` / `error`), `passed`/`total`, and a
per-case `results` array with the input, expected, and actual values.

The server wraps the submitted code in a Python harness (see
`src/services/judge/harness.ts`) that calls the method named in the problem
definition for each test case. Test cases and the method name live server-side
in `src/problems/`, so the client never sees the answer key. Linked-list and
tree problems are not judged yet — they need `ListNode`/`TreeNode` argument
adapters in the harness.

Judging reuses the same runner switch as `/submissions/run`, so it works
against Piston or, for local development, `CODE_RUNNER=local-python`.

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

Environment variables:

- `PORT`: server port, defaults to `4000`
- `CLIENT_ORIGIN`: allowed browser origin, defaults to `http://localhost:3000`
- `CODE_RUNNER`: `piston` or `local-python`, defaults to `piston`
- `PISTON_API_URL`: Piston base URL, defaults to `https://emkc.org/api/v2/piston`
- `PISTON_PYTHON_VERSION`: optional fixed Python runtime version
- `LOCAL_PYTHON_COMMAND`: Python executable for local dev runner, defaults to `python`
