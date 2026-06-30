// ================= //
// Submission Routes //
// ================= //

import type { IncomingMessage, ServerResponse } from "node:http";
import { config } from "../config.js";
import { httpError, readJsonBody, sendJson } from "../http.js";
import { isSupportedLanguage } from "../services/code-runner/types.js";
import { judgeSubmission, runExamples } from "../services/judge/index.js";
import type { JudgeSubmissionRequest } from "../../../shared/submissions.js";

type SubmissionBody =
{
  problemSlug?: unknown;
  language?: unknown;
  code?: unknown;
  stdin?: unknown;
};

// Handles POST /submissions/run by executing code against a problem's public
// example cases (the "Run" path) and returning per-case output. This is a
// testbench, not a verdict — it returns 200 whenever the examples could be run
// (even if the output differs from expected); only a hard failure to run is an error.
export async function handleRunSubmission(request: IncomingMessage, response: ServerResponse)
{
  const body = await readJsonBody(request, config.requestBodyLimitBytes);
  const submission = parseJudgeSubmission(body);
  const result = await runExamples(submission);

  sendJson(response, result.results.length > 0 ? 200 : 422, result);
}

// Handles POST /submissions/judge by grading code against a problem's test cases.
export async function handleJudgeSubmission(request: IncomingMessage, response: ServerResponse)
{
  const body = await readJsonBody(request, config.requestBodyLimitBytes);
  const submission = parseJudgeSubmission(body);
  const result = await judgeSubmission(submission);

  sendJson(response, result.status === "accepted" ? 200 : 422, result);
}

// Converts unknown JSON into a graded submission: a problem slug is required so
// the server knows which test cases to grade against. Shared by run and judge.
function parseJudgeSubmission(body: unknown): JudgeSubmissionRequest
{
  if (!body || typeof body !== "object")
  {
    throw httpError(400, "Request body is required.");
  }

  const submission = body as SubmissionBody;

  if (typeof submission.problemSlug !== "string" || submission.problemSlug.trim().length === 0)
  {
    throw httpError(400, "problemSlug is required to judge a submission.");
  }

  if (!isSupportedLanguage(submission.language))
  {
    throw httpError(400, "Only Python submissions are supported right now.");
  }

  if (typeof submission.code !== "string" || submission.code.trim().length === 0)
  {
    throw httpError(400, "Submission code is required.");
  }

  if (submission.code.length > 50_000)
  {
    throw httpError(400, "Submission code is too large.");
  }

  return {
    problemSlug: submission.problemSlug,
    language: submission.language,
    code: submission.code,
  };
}
