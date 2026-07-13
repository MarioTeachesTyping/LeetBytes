// ================ //
// Submission Types //
// ================ //

export type SubmissionLanguage = "python";

export type RunSubmissionRequest =
{
  problemSlug?: string;
  language: SubmissionLanguage;
  code: string;
  stdin?: string;
};

export type RunSubmissionStatus = "success" | "error";

export type RunSubmissionResponse =
{
  status: RunSubmissionStatus;
  language: SubmissionLanguage;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  runtimeMs?: number;
  message?: string;
};

// ================== //
// Judged Submissions //
// ================== //

// The "Submit" path: code is run against per-problem test cases and graded.
// "accepted" means every case passed; the others describe how it failed.
export type JudgeVerdict =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "time_limit_exceeded"
  | "compile_error"
  | "error";

export type JudgeSubmissionRequest =
{
  problemSlug: string;
  language: SubmissionLanguage;
  code: string;
};

// One graded test case. Per-case status is always accepted, wrong_answer, or
// runtime_error; the broader verdicts only show up at the response level.
// `expected` is optional because the client clears it for user-edited inputs,
// whose expected answer is unknown; the server always fills it in.
export type TestCaseResult =
{
  index: number;
  status: JudgeVerdict;
  input: string;
  expected?: string;
  actual?: string;
  stdout?: string;
  stderr?: string;
  runtimeMs?: number;
};

export type JudgeSubmissionResponse =
{
  status: JudgeVerdict;
  problemSlug: string;
  language: SubmissionLanguage;
  passed: number;
  total: number;
  results: TestCaseResult[];
  // Total solution runtime (sum of per-case execution times), in milliseconds.
  runtimeMs?: number;
  // Peak resident memory of the run, in kilobytes. Absent when the runner's
  // platform can't measure it (e.g. local Windows dev).
  memoryKb?: number;
  message?: string;
};

// ============= //
// Problem Cases //
// ============= //

// GET /problems/:slug/cases — the public example inputs shown in the Test
// Cases editor. Most problems are a single graded function; a "design"
// problem (a class with a constructor + method calls, e.g. LRUCache) has no
// single function to call, so it gets its own shape: each case is a sequence
// of operations (LeetCode's own notation — operations[0] is the class name)
// instead of one args list.
export type FunctionProblemCases =
{
  kind: "function";
  paramNames: string[];
  cases: { args: unknown[]; expected: unknown }[];
};

export type DesignProblemCases =
{
  kind: "design";
  cases: { operations: string[]; args: unknown[][]; expected: unknown[] }[];
};

export type ProblemCasesResponse = FunctionProblemCases | DesignProblemCases;
