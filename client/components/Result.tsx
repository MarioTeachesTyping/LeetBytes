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
  expected?: string;
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

// A LeetCode-style row of "Case 1 / Case 2 / …" pills.
function CaseTabs({ count, active, onSelect }: { count: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
            i === active
              ? "bg-white text-black"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          Case {i + 1}
        </button>
      ))}
    </div>
  );
}

// Test Cases view: the example inputs, always visible (even before a run) and
// editable. Each parameter gets its own field, pre-filled with the JSON of its
// default value — the raw JSON is what the run sends back to the server.
export function TestCasesEditor({
  paramNames,
  values,
  onChange,
  loading,
}: {
  paramNames: string[];
  values: string[][];
  onChange: (caseIndex: number, argIndex: number, value: string) => void;
  loading?: boolean;
}) {
  const [active, setActive] = useState(0);

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/50">
        Loading test cases…
      </div>
    );
  }

  if (values.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/50">
        No test cases for this problem yet.
      </div>
    );
  }

  const safeIndex = Math.min(active, values.length - 1);
  const current = values[safeIndex];

  return (
    <div className="space-y-3">
      <CaseTabs count={values.length} active={safeIndex} onSelect={setActive} />
      <div className="space-y-3">
        {current.map((value, argIndex) => (
          <div key={argIndex}>
            <div className="mb-1 font-mono text-xs font-medium text-white/40">
              {paramNames[argIndex] ?? `arg ${argIndex + 1}`}
            </div>
            <textarea
              value={value}
              onChange={(event) => onChange(safeIndex, argIndex, event.target.value)}
              spellCheck={false}
              rows={1}
              className="w-full resize-y rounded-md border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white/90
                         focus:border-white/30 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// A few error types read better with a friendlier title than their Python name.
const FRIENDLY_ERROR_TITLES: Record<string, string> = {
  IndentationError: "Indentation Error",
  TabError: "Indentation Error",
};

// Pulls a clean error type + message out of a Python traceback. The final line
// of a traceback is "ErrorType: message"; the frames above it only hold sandbox
// file paths and line numbers that are offset by the injected harness, so we drop
// them and keep just the type (as a title) and the human-readable message.
function cleanError(raw: string): { title: string; body: string } {
  const lines = raw
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .filter((line) => line.trim().length > 0);
  const last = lines[lines.length - 1] ?? raw.trim();

  const colon = last.indexOf(": ");
  if (colon > 0) {
    const type = last.slice(0, colon);
    if (/^[A-Za-z_][\w.]*$/.test(type)) {
      return { title: FRIENDLY_ERROR_TITLES[type] ?? type, body: last.slice(colon + 2).trim() };
    }
  }

  // A bare exception name with no message (e.g. "ValueError").
  if (/^[A-Za-z_][\w.]*$/.test(last)) {
    return { title: FRIENDLY_ERROR_TITLES[last] ?? last, body: "" };
  }

  return { title: "Error", body: last };
}

// Renders a case's error as a red type title above a clean message box.
function ErrorDisplay({ stderr }: { stderr: string }) {
  const { title, body } = cleanError(stderr);
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-red-400">{title}</div>
      {body && (
        <pre className="whitespace-pre-wrap break-all rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 font-mono text-xs text-red-300/90">
          {body}
        </pre>
      )}
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
      <CaseTabs count={cases.length} active={safeIndex} onSelect={setActive} />

      {message && <p className="px-1 text-xs text-red-300">{message}</p>}

      {current && (
        <div className="space-y-2">
          <Block label="Input" value={current.input} />
          <Block label="Output" value={current.actual ?? "—"} />
          {current.expected !== undefined && <Block label="Expected" value={current.expected} />}
          {current.stdout && <Block label="Stdout" value={current.stdout} />}
          {current.stderr && <ErrorDisplay stderr={current.stderr} />}
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

// Judge verdict styling. "almost" = some but not all cases passed; "failed" =
// none passed (or the run errored). Runtime/memory show only on a full accept.
const VERDICT_STYLES = {
  accepted: { label: "Accepted", palette: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dot: "bg-emerald-400" },
  almost: { label: "Almost", palette: "border-amber-500/40 bg-amber-500/10 text-amber-200", dot: "bg-amber-400" },
  failed: { label: "Failed", palette: "border-red-500/40 bg-red-500/10 text-red-300", dot: "bg-red-400" },
} as const;

// Judge view: the submit-style verdict over the full hidden suite.
function JudgeResult({
  passed,
  total,
  status,
  runtimeMs,
  memoryKb,
}: {
  passed: number;
  total: number;
  status: string;
  runtimeMs?: number;
  memoryKb?: number;
}) {
  const verdict = status === "accepted" ? "accepted" : passed > 0 ? "almost" : "failed";
  const style = VERDICT_STYLES[verdict];

  const runtime = formatRuntime(runtimeMs);
  const memory = formatMemory(memoryKb);

  return (
    <div className="space-y-2">
      <div className={`rounded-lg border px-4 py-3 ${style.palette}`}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
          <span className="text-xs text-white/60">{passed}/{total} Test Cases Passed</span>
        </div>
      </div>

      {verdict !== "failed" && (runtime || memory) && (
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
export default function Result({ panel, idleMessage }: { panel: Panel; idleMessage?: string }) {
  if (panel.kind === "idle") {
    return (
      <div className="flex h-full items-center justify-center px-4 py-6 text-center text-sm text-white/50">
        {idleMessage ?? "Run against the examples, or judge against every test case."}
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
    // Compile-time failures (syntax/indentation errors) arrive here as a full
    // traceback — clean those the same way per-case errors are cleaned. Plain
    // app messages ("Could not reach the server.") stay as a simple box.
    const isTraceback = /Traceback \(most recent call last\)|File "/.test(panel.detail);

    if (isTraceback) {
      return <ErrorDisplay stderr={panel.detail} />;
    }

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
    />
  );
}
