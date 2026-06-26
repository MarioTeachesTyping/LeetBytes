// ============= //
// Server Config //
// ============= //

type CodeRunner = "piston" | "local-python";

// Chooses which code execution backend the submissions route should use.
const codeRunner = process.env.CODE_RUNNER === "local-python" ? "local-python" : "piston";

// Centralizes environment-backed settings so route files stay boring.
export const config =
{
  port: Number(process.env.PORT ?? 4000),
  codeRunner: codeRunner satisfies CodeRunner,
  pistonApiUrl: process.env.PISTON_API_URL ?? "https://emkc.org/api/v2/piston",
  pistonPythonVersion: process.env.PISTON_PYTHON_VERSION,
  localPythonCommand: process.env.LOCAL_PYTHON_COMMAND ?? "python",
  requestBodyLimitBytes: 64 * 1024,
  runTimeoutMs: 3000,
  compileTimeoutMs: 3000,
};
