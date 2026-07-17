// =================== //
// Local Python Runner //
// =================== //

import { spawn } from "node:child_process";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { config } from "../../config.js";
import type { CodeRunnerResult, CodeRunnerSubmission } from "./types.js";

type LocalPythonProcessResult =
{
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};

type NodeProcessError = Error &
{
  code?: string;
};

// Runs trusted local Python code by writing it to a temp file and spawning Python.
export async function runWithLocalPython(submission: CodeRunnerSubmission): Promise<CodeRunnerResult>
{
  const startedAt = performance.now();
  const directory = await mkdtemp(join(tmpdir(), "leetbytes-python-"));
  const filePath = join(directory, "main.py");

  try
  {
    await writeFile(filePath, submission.code, "utf8");
    const result = await runPythonProcess(filePath, submission.stdin ?? "");

    return {
      status: result.exitCode === 0 && !result.signal ? "success" : "error",
      language: submission.language,
      stdout: result.stdout,
      stderr: result.stderr,
      runtimeMs: Math.round(performance.now() - startedAt),
      message: result.signal ? `Process stopped with signal ${result.signal}.` : undefined,
    };
  }
  catch (error)
  {
    const processError = error as NodeProcessError;

    return {
      status: "error",
      language: submission.language,
      stdout: "",
      stderr: "",
      runtimeMs: Math.round(performance.now() - startedAt),
      message: formatProcessError(processError),
    };
  }
  finally
  {
    await rm(directory, { recursive: true, force: true });
  }
}

// Turns low-level process errors into messages that make sense in API responses.
function formatProcessError(error: NodeProcessError)
{
  if (error.code === "ENOENT")
  {
    return `Could not find local Python command "${config.localPythonCommand}".`;
  }

  if (error.code === "EPERM")
  {
    return `Could not start local Python command "${config.localPythonCommand}". Check sandbox permissions or local execution policy.`;
  }

  return error.message;
}

// Spawns the Python process, captures stdout/stderr, and kills it after timeout.
function runPythonProcess(filePath: string, stdin: string): Promise<LocalPythonProcessResult>
{
  return new Promise((resolve, reject) =>
  {
    const child: ChildProcessWithoutNullStreams = spawn(config.localPythonCommand, [filePath], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() =>
    {
      child.kill();
    }, config.runTimeoutMs);

    child.stdout.on("data", (chunk) =>
    {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) =>
    {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) =>
    {
      clearTimeout(timeout);
      settled = true;
      reject(error);
    });

    child.on("close", (exitCode, signal) =>
    {
      clearTimeout(timeout);

      if (settled) return;

      resolve({
        exitCode,
        signal,
        stdout,
        stderr,
      });
    });

    child.stdin.end(stdin);
  });
}
