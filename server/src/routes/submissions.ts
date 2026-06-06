// ================= //
// Submission Routes //
// ================= //

import type { IncomingMessage, ServerResponse } from "node:http";
import { config } from "../config.js";
import { httpError, readJsonBody, sendJson } from "../http.js";
import { runSubmission } from "../services/code-runner/index.js";
import { isSupportedLanguage, type CodeRunnerSubmission } from "../services/code-runner/types.js";

type SubmissionBody =
{
  problemSlug?: unknown;
  language?: unknown;
  code?: unknown;
  stdin?: unknown;
};

// Handles POST /submissions/run by validating input, running code, and returning output.
export async function handleRunSubmission(request: IncomingMessage, response: ServerResponse)
{
  const body = await readJsonBody(request, config.requestBodyLimitBytes);
  const submission = parseSubmission(body);
  const result = await runSubmission(submission);

  sendJson(response, result.status === "success" ? 200 : 422, result);
}

// Converts unknown JSON into the narrow submission shape the runner expects.
function parseSubmission(body: unknown): CodeRunnerSubmission
{
  if (!body || typeof body !== "object")
  {
    throw httpError(400, "Request body is required.");
  }

  const submission = body as SubmissionBody;

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

  if (submission.stdin !== undefined && typeof submission.stdin !== "string")
  {
    throw httpError(400, "stdin must be a string when provided.");
  }

  if (submission.problemSlug !== undefined && typeof submission.problemSlug !== "string")
  {
    throw httpError(400, "problemSlug must be a string when provided.");
  }

  return {
    problemSlug: submission.problemSlug,
    language: submission.language,
    code: submission.code,
    stdin: submission.stdin,
  };
}
