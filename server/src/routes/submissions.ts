// ================= //
// Submission Routes //
// ================= //

import type { IncomingMessage, ServerResponse } from "node:http";
import { config } from "../config.js";
import { httpError, readJsonBody, sendJson } from "../http.js";
import { judgeSubmission, runExamples } from "../services/judge/index.js";
import type { TestCase } from "@leetbytes/problems/types";
import {
  customCasesSchema,
  judgeSubmissionRequestSchema,
  type JudgeSubmissionRequest,
} from "@leetbytes/shared";

// Handles POST /submissions/run by executing code against a problem's public
// example cases (the "Run" path) and returning per-case output. This is a
// testbench, not a verdict — it returns 200 whenever the examples could be run
// (even if the output differs from expected); only a hard failure to run is an error.
export async function handleRunSubmission(request: IncomingMessage, response: ServerResponse)
{
  const body = await readJsonBody(request, config.requestBodyLimitBytes);
  const submission = parseJudgeSubmission(body);
  const customCases = parseCustomCases(body);
  const result = await runExamples(submission, customCases);

  sendJson(response, result.results.length > 0 ? 200 : 422, result);
}

// Reads optional user-edited test cases off the run body. Each case only needs
// an `args` array (its `expected` is optional — the client owns expected display
// for the testbench). Absent/empty means "use the problem's default examples".
function parseCustomCases(body: unknown): TestCase[] | undefined
{
  const raw = body && typeof body === "object" ? (body as { cases?: unknown }).cases : undefined;

  if (raw === undefined || (Array.isArray(raw) && raw.length === 0))
  {
    return undefined;
  }

  const parsed = customCasesSchema.safeParse(raw);

  if (!parsed.success)
  {
    throw httpError(400, parsed.error.issues[0]?.message ?? "Each test case must include an args array.");
  }

  // TestCase declares `expected` as a required unknown; an omitted expected
  // simply becomes undefined here.
  return parsed.data.map((testCase) => ({ args: testCase.args, expected: testCase.expected }));
}

// Handles POST /submissions/judge by grading code against a problem's test cases.
export async function handleJudgeSubmission(request: IncomingMessage, response: ServerResponse)
{
  const body = await readJsonBody(request, config.requestBodyLimitBytes);
  const submission = parseJudgeSubmission(body);
  const result = await judgeSubmission(submission);

  sendJson(response, result.status === "accepted" ? 200 : 422, result);
}

// Validates unknown JSON against the shared submission schema: a problem slug is
// required so the server knows which test cases to grade against. Shared by run
// and judge.
function parseJudgeSubmission(body: unknown): JudgeSubmissionRequest
{
  const parsed = judgeSubmissionRequestSchema.safeParse(body);

  if (!parsed.success)
  {
    const issue = parsed.error.issues[0];
    const message = issue?.path[0] === "language"
      ? "Only Python submissions are supported right now."
      : issue?.message ?? "Request body is required.";

    throw httpError(400, message);
  }

  return parsed.data;
}
