// ============ //
// Result Panel //
// ============ //

"use client";

import React, { useState } from "react";

// Mirrors the server's per-case TestCaseResult (kept local so the client does
// not import across the shared/ package boundary).
export type CaseResult = {
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
export type GradeResponse = {
  status: string;
  passed: number;
  total: number;
  results: CaseResult[];
  runtimeMs?: number;
  memoryKb?: number;
  message?: string;
};

// The result panel state. "run" is an output-only testbench over the visible
// example cases; "judge" is a single verdict over the full hidden suite.
export type Panel =
  | { kind: "idle" }
  | { kind: "running"; action: "run" | "judge" }
  | { kind: "judge"; passed: number; total: number; status: string; runtimeMs?: number; memoryKb?: number; message?: string }
  | { kind: "run"; cases: CaseResult[]; message?: string }
  | { kind: "error"; detail: string };

// Kilobytes → a LeetCode-style "16.4 MB" string.
function formatMemory(memoryKb?: number): string | null {
  if (memoryKb === undefined || memoryKb === null) return null;
  return `${(memoryKb / 1024).toFixed(1)} MB`;
}

function formatRuntime(runtimeMs?: number): string | null {
  if (runtimeMs === undefined || runtimeMs === null) return null;
  return `${runtimeMs} ms`;
}

// A labeled output block (Input / Output / Stdout / Error).
function Block({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "error" }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-white/40">{label}</div>
      <pre
        className={`whitespace-pre-wrap break-all rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs ${
          tone === "error" ? "text-red-300/90" : "text-white/90"
        }`}
      >
        {value}
      </pre>
    </div>
  );
}

// Run view: a LeetCode-style row of Case tabs. Each case shows the input it ran
// against and the output your code produced — a testbench, not a verdict, so
// there is no expected value or pass/fail here.
function RunResults({ cases, message }: { cases: CaseResult[]; message?: string }) {
  const [active, setActive] = useState(0);
  const safeIndex = Math.min(active, cases.length - 1);
  const current = cases[safeIndex];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {cases.map((c, i) => (
          <button
            key={c.index}
            onClick={() => setActive(i)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              i === safeIndex
                ? "bg-white text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Case {i + 1}
          </button>
        ))}
      </div>

      {message && <p className="px-1 text-xs text-red-300">{message}</p>}

      {current && (
        <div className="space-y-2">
          <Block label="Input" value={current.input} />
          <Block label="Output" value={current.actual ?? "—"} />
          {current.stdout && <Block label="Stdout" value={current.stdout} />}
          {current.stderr && <Block label="Error" value={current.stderr} tone="error" />}
        </div>
      )}
    </div>
  );
}

// One Judge stat chip (Runtime or Memory).
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

// Judge view: the submit-style verdict over the full hidden suite, with runtime
// and memory shown on an accepted run.
function JudgeResult({
  passed,
  total,
  status,
  runtimeMs,
  memoryKb,
  message,
}: {
  passed: number;
  total: number;
  status: string;
  runtimeMs?: number;
  memoryKb?: number;
  message?: string;
}) {
  const accepted = status === "accepted";
  const palette = accepted
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
    : "border-red-500/40 bg-red-500/10 text-red-300";
  const detail = message ?? `${passed}/${total} test cases · ${status.replace(/_/g, " ")}`;

  const runtime = formatRuntime(runtimeMs);
  const memory = formatMemory(memoryKb);

  return (
    <div className="space-y-2">
      <div className={`rounded-lg border px-4 py-3 ${palette}`}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${accepted ? "bg-emerald-400" : "bg-red-400"}`} />
            {accepted ? "Accepted" : "Failed"}
          </span>
          <span className="text-xs text-white/60">{accepted ? `${passed}/${total} test cases` : detail}</span>
        </div>
      </div>

      {accepted && (runtime || memory) && (
        <div className="flex gap-2">
          {runtime && <Stat label="Runtime" value={runtime} />}
          {memory && <Stat label="Memory" value={memory} />}
        </div>
      )}
    </div>
  );
}

// The bottom result area for the Solution panel. Renders whichever view the
// current panel state calls for.
export default function Result({ panel }: { panel: Panel }) {
  if (panel.kind === "idle") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/50">
        Run against the examples, or judge against every test case.
      </div>
    );
  }

  if (panel.kind === "running") {
    return (
      <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white/80">
        {panel.action === "run" ? "Running examples…" : "Judging…"}
      </div>
    );
  }

  if (panel.kind === "error") {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
        {panel.detail}
      </div>
    );
  }

  if (panel.kind === "run") {
    return <RunResults cases={panel.cases} message={panel.message} />;
  }

  return (
    <JudgeResult
      passed={panel.passed}
      total={panel.total}
      status={panel.status}
      runtimeMs={panel.runtimeMs}
      memoryKb={panel.memoryKb}
      message={panel.message}
    />
  );
}
