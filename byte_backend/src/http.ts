// ============ //
// HTTP Helpers //
// ============ //

import type { IncomingMessage, ServerResponse } from "node:http";

export type HttpError = Error &
{
  statusCode: number;
};

// Reads and parses a JSON request body while enforcing a simple byte limit.
export async function readJsonBody(request: IncomingMessage, limitBytes: number): Promise<unknown>
{
  let size = 0;
  const chunks: Buffer[] = [];

  for await (const chunk of request)
  {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > limitBytes)
    {
      throw httpError(413, "Request body is too large.");
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0)
  {
    return {};
  }

  try
  {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  }
  catch
  {
    throw httpError(400, "Request body must be valid JSON.");
  }
}

// Sends a JSON response with the CORS headers the client needs during local dev.
export function sendJson(response: ServerResponse, statusCode: number, data: unknown)
{
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });

  response.end(JSON.stringify(data));
}

// Handles browser CORS preflight requests before they reach route handlers.
export function sendOptions(response: ServerResponse)
{
  response.writeHead(204, {
    "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  response.end();
}

// Creates an Error object that carries the HTTP status code to return.
export function httpError(statusCode: number, message: string): HttpError
{
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
}
