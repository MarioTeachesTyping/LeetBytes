// ============= //
// Piston Runner //
// ============= //

import { config } from "../../config.js";
import type { CodeRunnerResult, CodeRunnerSubmission } from "./types.js";

type PistonRuntime =
{
  language: string;
  version: string;
  aliases?: string[];
};

type PistonProcessOutput =
{
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number;
  signal?: string | null;
};

type PistonExecuteResponse =
{
  message?: string;
  compile?: PistonProcessOutput;
  run?: PistonProcessOutput;
};

let pythonRuntimePromise: Promise<PistonRuntime> | undefined;

// Executes a submission by forwarding it to the configured Piston API.
export async function runWithPiston(submission: CodeRunnerSubmission): Promise<CodeRunnerResult>
{
  const runtime = await getRuntime(submission.language);
  const startedAt = performance.now();

  const pistonResponse = await fetch(`${config.pistonApiUrl}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [
        {
          name: "main.py",
          content: submission.code,
        },
      ],
      stdin: submission.stdin ?? "",
      compile_timeout: config.compileTimeoutMs,
      run_timeout: config.runTimeoutMs,
    }),
  });

  const data = await pistonResponse.json().catch(() => undefined) as PistonExecuteResponse | undefined;

  if (!pistonResponse.ok || !data)
  {
    return {
      status: "error",
      language: submission.language,
      stdout: "",
      stderr: "",
      message: data?.message ?? "Piston failed to run the submission.",
    };
  }

  const compileOutput = joinOutput(data.compile);
  const stdout = data.run?.stdout ?? "";
  const stderr = data.run?.stderr ?? "";
  const runCode = data.run?.code ?? 0;
  const signal = data.run?.signal;

  return {
    status: compileOutput || stderr || runCode !== 0 || signal ? "error" : "success",
    language: submission.language,
    stdout,
    stderr,
    compileOutput,
    runtimeMs: Math.round(performance.now() - startedAt),
    message: signal ? `Process stopped with signal ${signal}.` : undefined,
  };
}

// Returns the cached runtime metadata Piston needs to execute Python code.
async function getRuntime(language: CodeRunnerSubmission["language"]): Promise<PistonRuntime>
{
  if (language !== "python")
  {
    throw new Error(`Unsupported language: ${language}`);
  }

  if (!pythonRuntimePromise)
  {
    pythonRuntimePromise = resolvePythonRuntime();
  }

  return pythonRuntimePromise;
}

// Finds the available Python runtime from Piston unless a fixed version is configured.
async function resolvePythonRuntime(): Promise<PistonRuntime>
{
  if (config.pistonPythonVersion)
  {
    return {
      language: "python",
      version: config.pistonPythonVersion,
    };
  }

  const response = await fetch(`${config.pistonApiUrl}/runtimes`);
  const runtimes = await response.json();

  if (!response.ok || !Array.isArray(runtimes)) {
    throw new Error("Could not load Piston runtimes.");
  }

  const pythonRuntime = (runtimes as PistonRuntime[]).find((runtime) =>
  {
    return (
      runtime.language === "python" ||
      runtime.aliases?.includes("python") ||
      runtime.aliases?.includes("python3")
    );
  });

  if (!pythonRuntime)
  {
    throw new Error("Piston did not report a Python runtime.");
  }

  return {
    language: pythonRuntime.language,
    version: pythonRuntime.version,
  };
}

// Normalizes Piston compile output fields into one displayable string.
function joinOutput(output?: PistonProcessOutput)
{
  if (!output) return "";

  return [output.stdout, output.stderr, output.output]
    .filter(Boolean)
    .join("\n");
}
