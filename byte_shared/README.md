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
  - `ProblemCasesResponse` — the `GET /problems/:slug/cases` response: a union of
    `FunctionProblemCases` (`kind: "function"`, `paramNames` + per-case `args`/
    `expected`) and `DesignProblemCases` (`kind: "design"` — a class with a
    constructor + method calls, e.g. LRUCache, so each case is an `operations`/
    `args`/`expected` sequence instead of one args list).

- `schemas.ts`
  - Zod schemas for the bodies the server accepts: `judgeSubmissionRequestSchema`
    (shared by `POST /submissions/run` and `POST /submissions/judge`),
    `customCasesSchema` (user-edited run cases for function problems), and
    `designCustomCasesSchema` (the same, for design problems' operations/args
    notation). Each schema `satisfies` its hand-written type, so the runtime
    validation and the types can't drift apart.
  - `MAX_SUBMISSION_CODE_LENGTH` (50,000 chars) and `MAX_CUSTOM_CASES` (20) — the
    limits `judgeSubmissionRequestSchema`/`customCasesSchema` enforce.

Both the client (`ResultPanel.tsx`, via `transpilePackages`) and the server import
these types directly, so a change here typechecks against both sides at once.
