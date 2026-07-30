// ============== //
// Problem Routes //
// ============== //

import type { IncomingMessage, ServerResponse } from "node:http";
import { sendJson } from "../http.js";
import { publicCases } from "../problems/index.js";

// Handles GET /problems/:slug/cases by returning the problem's public example
// inputs (parameter names + per-case args/expected) for the Test Cases editor.
export function handleProblemCases(_request: IncomingMessage, response: ServerResponse, slug: string)
{
  const data = publicCases(slug);

  if (!data)
  {
    sendJson(response, 404, { message: `No test cases for "${slug}" yet.` });
    return;
  }

  sendJson(response, 200, data);
}
