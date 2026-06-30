// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";
import { Gavel, Play } from "lucide-react";
import CodeEditor from "./CodeEditor";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

// Mirrors the server's per-case TestCaseResult (kept local so the client does
// not import across the shared/ package boundary).
type CaseResult = {
  index: number;
  status: string;
  input: string;
  expected: string;
  actual?: string;
  stdout?: string;
  stderr?: string;
  runtimeMs?: number;
};

// Mirrors the server's JudgeSubmissionResponse. Both /run and /judge return it.
type GradeResponse = {
  status: string;
  passed: number;
  total: number;
  results: CaseResult[];
  message?: string;
};

// The bottom result panel. "run" shows per-example detail; "judge" shows a
// single pass/fail verdict (the hidden suite stays hidden).
type Panel =
  | { kind: "idle" }
  | { kind: "running"; action: "run" | "judge" }
  | { kind: "judge"; passed: number; total: number; status: string; message?: string }
  | { kind: "run"; passed: number; total: number; cases: CaseResult[]; message?: string }
  | { kind: "error"; detail: string };

interface SolutionProps {
  slug: string;
  starterCode: string;
}

// Per-case status → label + color, shared by the example cards.
function caseStyle(status: string) {
  if (status === "accepted") {
    return { label: "Passed", className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-400" };
  }
  if (status === "runtime_error") {
    return { label: "Runtime Error", className: "border-red-500/40 bg-red-500/10 text-red-300", dot: "bg-red-400" };
  }
  return { label: "Wrong Answer", className: "border-red-500/40 bg-red-500/10 text-red-300", dot: "bg-red-400" };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-white/40">{label}</span>
      <span className="break-all text-white/90">{value}</span>
    </div>
  );
}

// Renders the result of a "Run": each visible example with its input, your
// output, the expected output, plus any printed/error output.
function RunResults({ passed, total, cases, message }: { passed: number; total: number; cases: CaseResult[]; message?: string }) {
  const allPassed = passed === total;

  return (
    <div className="space-y-2">
      <div className={`rounded-lg border px-4 py-2 ${allPassed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-amber-500/40 bg-amber-500/10 text-amber-200"}`}>
        <span className="text-lg font-semibold">
          {allPassed ? "All examples passed" : "Some examples failed"}
        </span>
        <span className="ml-2 text-xs text-white/60">{passed}/{total} examples</span>
      </div>

      {message && <p className="px-1 text-xs text-red-300">{message}</p>}

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {cases.map((c) => {
          const style = caseStyle(c.status);
          return (
            <div key={c.index} className={`rounded-lg border px-3 py-2 ${style.className}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`inline-block h-2 w-2 rounded-full ${style.dot}`} />
                  Example {c.index + 1}
                </span>
                <span className="text-xs text-white/50">{style.label}</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <Field label="Input" value={c.input} />
                <Field label="Output" value={c.actual ?? "—"} />
                <Field label="Expected" value={c.expected} />
                {c.stdout && (
                  <div className="pt-1">
                    <span className="text-white/40">Stdout</span>
                    <pre className="mt-1 whitespace-pre-wrap break-all text-white/70">{c.stdout}</pre>
                  </div>
                )}
                {c.stderr && (
                  <div className="pt-1">
                    <span className="text-white/40">Error</span>
                    <pre className="mt-1 whitespace-pre-wrap break-all text-red-300/90">{c.stderr}</pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Renders the result of a "Judge": just the verdict and pass count.
function JudgeResult({ passed, total, status, message }: { passed: number; total: number; status: string; message?: string }) {
  const accepted = status === "accepted";
  const palette = accepted
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
    : "border-red-500/40 bg-red-500/10 text-red-300";
  const detail = message ?? `${passed}/${total} test cases · ${status.replace(/_/g, " ")}`;

  return (
    <div className={`rounded-lg border px-4 py-3 ${palette}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${accepted ? "bg-emerald-400" : "bg-red-400"}`} />
          {accepted ? "Accepted" : "Failed"}
        </span>
        <span className="text-xs text-white/60">{accepted ? `${passed}/${total} test cases` : detail}</span>
      </div>
    </div>
  );
}

export default function Solution({ slug, starterCode }: SolutionProps) {
  const [code, setCode] = useState(starterCode);
  const [panel, setPanel] = useState<Panel>({ kind: "idle" });

  const busy = panel.kind === "running";

  // Runs the code against the visible example cases and shows per-case detail.
  async function handleRunExamples() {
    setPanel({ kind: "running", action: "run" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as GradeResponse;

      if (data.results && data.results.length > 0) {
        setPanel({ kind: "run", passed: data.passed, total: data.total, cases: data.results, message: data.message });
      } else {
        setPanel({ kind: "error", detail: data.message ?? "Could not run the examples." });
      }
    } catch {
      setPanel({ kind: "error", detail: "Could not reach the server." });
    }
  }

  // Grades the code against the full hidden test suite.
  async function handleJudge() {
    setPanel({ kind: "running", action: "judge" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as GradeResponse;
      setPanel({ kind: "judge", passed: data.passed, total: data.total, status: data.status, message: data.message });
    } catch {
      setPanel({ kind: "error", detail: "Could not reach the server." });
    }
  }

  return (
    <div className="h-full flex flex-col gap-2 min-h-0">
      {/* Toolbar panel — stays put while the content below scrolls */}
      <div className="shrink-0 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
        <button
          onClick={handleRunExamples}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-0.5 text-sm font-semibold leading-tight rounded-md border border-white transition-colors
                     bg-black text-white hover:bg-white hover:text-black
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4" />
          {panel.kind === "running" && panel.action === "run" ? "Running…" : "Run"}
        </button>
        <button
          onClick={handleJudge}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-0.5 text-sm font-semibold leading-tight rounded-md border border-white transition-colors
                     bg-black text-white hover:bg-white hover:text-black
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gavel className="h-4 w-4" />
          {panel.kind === "running" && panel.action === "judge" ? "Judging…" : "Judge"}
        </button>
      </div>

      {/* Content panel */}
      <section className="flex-1 min-h-0 flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        {/* Editor */}
        <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
          <CodeEditor value={code} onChange={setCode} />
        </div>

        {/* Result */}
        <div className="mt-4">
          {panel.kind === "idle" && (
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/50">
              Run against the examples, or judge against every test case.
            </div>
          )}

          {panel.kind === "running" && (
            <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/80">
              {panel.action === "run" ? "Running examples…" : "Judging…"}
            </div>
          )}

          {panel.kind === "error" && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
              {panel.detail}
            </div>
          )}

          {panel.kind === "run" && (
            <RunResults passed={panel.passed} total={panel.total} cases={panel.cases} message={panel.message} />
          )}

          {panel.kind === "judge" && (
            <JudgeResult passed={panel.passed} total={panel.total} status={panel.status} message={panel.message} />
          )}
        </div>
      </section>
    </div>
  );
}
