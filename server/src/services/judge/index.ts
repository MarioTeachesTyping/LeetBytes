// =========== //
// Judge Service //
// =========== //

import { getProblem } from "../../problems/index.js";
import type { DesignHiddenProblem, DesignTestCase, FunctionHiddenProblem, TestCase } from "@leetbytes/problems/types";
import { runSubmission } from "../code-runner/index.js";
import type { CodeRunnerResult } from "../code-runner/types.js";
import { buildHarness, RESULT_SENTINEL } from "./harness.js";
import type {
  JudgeSubmissionRequest,
  JudgeSubmissionResponse,
  JudgeVerdict,
  TestCaseResult,
} from "@leetbytes/shared";

// The shape the Python harness prints after the sentinel.
type HarnessCaseResult =
{
  index: number;
  status: JudgeVerdict;
  expected: string;
  actual?: string;
  stdout?: string;
  stderr?: string;
  runtimeMs?: number;
};

type HarnessPayload =
{
  status: JudgeVerdict;
  passed: number;
  total: number;
  results: HarnessCaseResult[];
  // Peak resident memory in kilobytes, or null when the platform can't measure it.
  memoryKb?: number | null;
};

// Runs a submission against a problem's hidden test cases and grades it.
export async function judgeSubmission(request: JudgeSubmissionRequest): Promise<JudgeSubmissionResponse>
{
  const problem = getProblem(request.problemSlug);

  if (!problem)
  {
    return failure(request, 0, "error", `No judged test cases for "${request.problemSlug}" yet.`);
  }

  return problem.kind === "design"
    ? gradeDesign(request, problem, problem.tests)
    : gradeFunction(request, problem, problem.tests);
}

// Runs a submission against example cases (the "Run" path). Identical grading
// machinery to the judge, but on the handful of visible examples — so the user
// can sanity-check inputs/outputs before submitting. When `customTests` are
// supplied (the user edited the inputs), those are run instead of the defaults.
export async function runExamples(
  request: JudgeSubmissionRequest,
  customTests?: TestCase[] | DesignTestCase[],
): Promise<JudgeSubmissionResponse>
{
  const problem = getProblem(request.problemSlug);

  if (!problem)
  {
    return failure(request, 0, "error", `No example cases for "${request.problemSlug}" yet.`);
  }

  if (problem.kind === "design")
  {
    const custom = customTests as DesignTestCase[] | undefined;
    const tests = custom && custom.length > 0 ? custom : problem.examples;

    if (!tests || tests.length === 0)
    {
      return failure(request, 0, "error", `No example cases for "${request.problemSlug}" yet.`);
    }

    return gradeDesign(request, problem, tests);
  }

  const custom = customTests as TestCase[] | undefined;
  const tests = custom && custom.length > 0 ? custom : problem.examples;

  if (!tests || tests.length === 0)
  {
    return failure(request, 0, "error", `No example cases for "${request.problemSlug}" yet.`);
  }

  return gradeFunction(request, problem, tests);
}

// Shared core: builds the harness around `tests`, runs it, and maps the harness
// output into a graded, per-case response. Used by both grade variants below.
async function gradeCore<T>(
  request: JudgeSubmissionRequest,
  stdinPayload: object,
  tests: T[],
  formatCaseInput: (test: T) => string,
): Promise<JudgeSubmissionResponse>
{
  const wallStartedAt = performance.now();

  const run = await runSubmission({
    problemSlug: request.problemSlug,
    language: request.language,
    code: buildHarness(request.code),
    stdin: JSON.stringify(stdinPayload),
  });

  const wallRuntimeMs = Math.round(performance.now() - wallStartedAt);
  const payload = extractPayload(run.stdout);

  // No sentinel means the harness never finished: a crash, timeout, or syntax error.
  if (!payload)
  {
    return inferFailure(request, tests.length, run, wallRuntimeMs);
  }

  const inputs = tests.map(formatCaseInput);

  const results: TestCaseResult[] = payload.results.map((result) => ({
    index: result.index,
    status: result.status,
    input: inputs[result.index] ?? "",
    expected: result.expected,
    actual: result.actual,
    stdout: blankToUndefined(result.stdout),
    stderr: blankToUndefined(result.stderr),
    runtimeMs: result.runtimeMs,
  }));

  // The displayed runtime is the user's solution time across all cases, not the
  // server's wall-clock (which includes the Piston round-trip).
  const solutionRuntimeMs = Math.round(
    payload.results.reduce((sum, result) => sum + (result.runtimeMs ?? 0), 0),
  );

  return {
    status: payload.status,
    problemSlug: request.problemSlug,
    language: request.language,
    passed: payload.passed,
    total: payload.total,
    results,
    runtimeMs: solutionRuntimeMs,
    memoryKb: payload.memoryKb ?? undefined,
  };
}

function gradeFunction(
  request: JudgeSubmissionRequest,
  problem: FunctionHiddenProblem,
  tests: TestCase[],
): Promise<JudgeSubmissionResponse>
{
  return gradeCore(
    request,
    {
      functionName: problem.functionName,
      compare: problem.compare,
      argTypes: problem.argTypes,
      returnType: problem.returnType,
      tests,
    },
    tests,
    (test) => formatInput(test.args, problem.paramNames),
  );
}

function gradeDesign(
  request: JudgeSubmissionRequest,
  problem: DesignHiddenProblem,
  tests: DesignTestCase[],
): Promise<JudgeSubmissionResponse>
{
  return gradeCore(
    request,
    { className: problem.className, tests },
    tests,
    formatDesignInput,
  );
}

// Renders a design test case's operations/args the way LeetCode itself shows
// them: the operations list and the per-operation args list, stacked.
function formatDesignInput(test: DesignTestCase): string
{
  return `operations = ${JSON.stringify(test.operations)}\nargs = ${JSON.stringify(test.args)}`;
}

// Pulls the JSON payload out of the harness's sentinel-prefixed line.
function extractPayload(stdout: string): HarnessPayload | undefined
{
  const markerIndex = stdout.lastIndexOf(RESULT_SENTINEL);

  if (markerIndex === -1)
  {
    return undefined;
  }

  const json = stdout.slice(markerIndex + RESULT_SENTINEL.length).trim();

  try
  {
    return JSON.parse(json) as HarnessPayload;
  }
  catch
  {
    return undefined;
  }
}

// Classifies a run that produced no harness output into a single verdict.
function inferFailure(
  request: JudgeSubmissionRequest,
  total: number,
  run: CodeRunnerResult,
  runtimeMs: number,
): JudgeSubmissionResponse
{
  const detail = run.stderr || run.compileOutput || run.message || "";

  if (run.message?.toLowerCase().includes("signal"))
  {
    return failure(request, total, "time_limit_exceeded", "Time limit exceeded.", runtimeMs);
  }

  if (/SyntaxError|IndentationError|TabError/.test(detail))
  {
    return failure(request, total, "compile_error", detail.trim(), runtimeMs);
  }

  return failure(request, total, "runtime_error", detail.trim() || "Submission failed to run.", runtimeMs);
}

// Builds a graded response for a whole-submission failure (no per-case detail).
function failure(
  request: JudgeSubmissionRequest,
  total: number,
  status: JudgeVerdict,
  message: string,
  runtimeMs?: number,
): JudgeSubmissionResponse
{
  return {
    status,
    problemSlug: request.problemSlug,
    language: request.language,
    passed: 0,
    total,
    results: [],
    runtimeMs,
    message,
  };
}

// Renders test args into a readable string, e.g. `nums = [2,7,11,15], target = 9`.
function formatInput(args: unknown[], paramNames?: string[]): string
{
  return args
    .map((arg, index) =>
    {
      const value = JSON.stringify(arg);
      const name = paramNames?.[index];
      return name ? `${name} = ${value}` : value;
    })
    .join(", ");
}

function blankToUndefined(value?: string): string | undefined
{
  return value && value.length > 0 ? value : undefined;
}
