// ================= //
// Server Entrypoint //
// ================= //

import { createServer } from "node:http";
import { config } from "./config.js";
import { sendJson, sendOptions, type HttpError } from "./http.js";
import { handleRunSubmission } from "./routes/submissions.js";

// Creates the HTTP server and routes each request to the right handler.
const server = createServer(async (request, response) =>
{
  try
  {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

    if (request.method === "OPTIONS")
    {
      sendOptions(response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/health")
    {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "POST" && url.pathname === "/submissions/run")
    {
      await handleRunSubmission(request, response);
      return;
    }

    sendJson(response, 404, { message: "Route not found." });
  }
  catch (error)
  {
    const httpError = error as Partial<HttpError>;
    const statusCode = httpError.statusCode ?? 500;
    const message = statusCode === 500 ? "Unexpected server error." : httpError.message;

    console.error(error);
    sendJson(response, statusCode, { message });
  }
});

// Starts the API server on the configured local port.
server.listen(config.port, () =>
{
  console.log(`LeetBytes server listening on http://localhost:${config.port}`);
});
