# Shared

Request/response types and Zod request schemas shared by the client and server,
as the `@leetbytes/shared` workspace package (both apps import it directly).

- `submissions.ts`
  - `RunSubmissionRequest` / `RunSubmissionResponse` — raw single-file execution
    (stdout/stderr, runtime).
  - `JudgeSubmissionRequest` / `JudgeSubmissionResponse` — graded submissions:
    overall `status`, `passed`/`total`, a per-case `results` array
    (`TestCaseResult`: input, expected, actual, stdout/stderr, per-case runtime),
    the total `runtimeMs` (sum of per-case execution times), and peak `memoryKb`.
  - `JudgeVerdict` — `accepted` / `wrong_answer` / `runtime_error` /
    `time_limit_exceeded` / `compile_error` / `error`.

- `schemas.ts`
  - Zod schemas for the bodies the server accepts (`judgeSubmissionRequestSchema`,
    `customCasesSchema`). Each schema `satisfies` its hand-written type, so the
    runtime validation and the types can't drift apart.

Both the client (`Result.tsx`, via `transpilePackages`) and the server import
these types directly, so a change here typechecks against both sides at once.
