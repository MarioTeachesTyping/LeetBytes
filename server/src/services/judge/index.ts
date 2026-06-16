// =========== //
// Judge Service //
// =========== //

import { getProblem } from "../../problems/index.js";
import type { ProblemDefinition } from "../../problems/types.js";
import { runSubmission } from "../code-runner/index.js";
import type { CodeRunnerResult } from "../code-runner/types.js";
import { buildHarness, RESULT_SENTINEL } from "./harness.js";
import type {
  JudgeSubmissionRequest,
  JudgeSubmissionResponse,
  JudgeVerdict,
  TestCaseResult,
} from "../../../../shared/submissions.js";

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
};

// Runs a submission against a problem's hidden test cases and grades it.
export async function judgeSubmission(request: JudgeSubmissionRequest): Promise<JudgeSubmissionResponse>
{
  const problem = getProblem(request.problemSlug);

  if (!problem)
  {
    return failure(request, 0, "error", `No judged test cases for "${request.problemSlug}" yet.`);
  }

  const startedAt = performance.now();

  const run = await runSubmission({
    problemSlug: request.problemSlug,
    language: request.language,
    code: buildHarness(request.code),
    stdin: JSON.stringify({
      functionName: problem.functionName,
      compare: problem.compare,
      tests: problem.tests,
    }),
  });

  const runtimeMs = Math.round(performance.now() - startedAt);
  const payload = extractPayload(run.stdout);

  // No sentinel means the harness never finished: a crash, timeout, or syntax error.
  if (!payload)
  {
    return inferFailure(request, problem, run, runtimeMs);
  }

  const inputs = problem.tests.map((test) => formatInput(test.args, problem.paramNames));

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

  return {
    status: payload.status,
    problemSlug: request.problemSlug,
    language: request.language,
    passed: payload.passed,
    total: payload.total,
    results,
    runtimeMs,
  };
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
  problem: ProblemDefinition,
  run: CodeRunnerResult,
  runtimeMs: number,
): JudgeSubmissionResponse
{
  const total = problem.tests.length;
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
