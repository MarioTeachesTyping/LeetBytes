// ================== //
// Code Runner Switch //
// ================== //

import { config } from "../../config.js";
import { runWithLocalPython } from "./local-python-runner.js";
import { runWithPiston } from "./piston-runner.js";
import type { CodeRunnerResult, CodeRunnerSubmission } from "./types.js";

// Sends a validated submission to whichever runner is selected in config.
export async function runSubmission(submission: CodeRunnerSubmission): Promise<CodeRunnerResult>
{
  if (config.codeRunner === "local-python")
  {
    return runWithLocalPython(submission);
  }

  if (config.codeRunner === "piston")
  {
    return runWithPiston(submission);
  }

  return {
    status: "error",
    language: submission.language,
    stdout: "",
    stderr: "",
    message: `Unknown CODE_RUNNER "${config.codeRunner}". Use "piston" or "local-python".`,
  };
}
