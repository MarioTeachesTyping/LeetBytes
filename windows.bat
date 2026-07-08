@echo off
REM ============================================================
REM  LeetBytes local dev launcher (Windows)
REM  Opens two terminal windows:
REM    - Backend  on http://localhost:4000  (local-python runner)
REM    - Frontend on http://localhost:3000  (Next.js)
REM
REM  Requirements: pnpm, Node.js, and Python on PATH.
REM  First time only, install deps:  pnpm install  (once, at the repo root)
REM ============================================================

setlocal
set "ROOT=%~dp0"

REM Use the trusted local Python runner so no Piston/Docker is needed for dev.
set "CODE_RUNNER=local-python"

echo Starting LeetBytes...
echo   Backend:  http://localhost:4000
echo   Frontend: http://localhost:3000
echo.

start "LeetBytes Backend" /D "%ROOT%server" cmd /k "pnpm run dev"
start "LeetBytes Frontend" /D "%ROOT%client" cmd /k "pnpm run dev"

endlocal
