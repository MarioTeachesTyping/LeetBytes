# Shared

Request and response types shared by the client and server.

- `submissions.ts`
  - `RunSubmissionRequest` / `RunSubmissionResponse` — raw single-file execution
    (stdout/stderr, runtime).
  - `JudgeSubmissionRequest` / `JudgeSubmissionResponse` — graded submissions:
    overall `status`, `passed`/`total`, a per-case `results` array
    (`TestCaseResult`: input, expected, actual, stdout/stderr, per-case runtime),
    the total `runtimeMs` (sum of per-case execution times), and peak `memoryKb`.
  - `JudgeVerdict` — `accepted` / `wrong_answer` / `runtime_error` /
    `time_limit_exceeded` / `compile_error` / `error`.

The client mirrors these shapes locally (see `client/components/Result.tsx`) rather
than importing across the package boundary, so keep the two in sync when changing a
type here.
