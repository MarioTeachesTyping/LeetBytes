// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";
import { ChevronDown, Gavel, Play } from "lucide-react";
import CodeEditor from "./CodeEditor";
import Result, { type GradeResponse, type Panel } from "./Result";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

interface SolutionProps {
  slug: string;
  starterCode: string;
}

export default function Solution({ slug, starterCode }: SolutionProps) {
  const [code, setCode] = useState(starterCode);
  const [panel, setPanel] = useState<Panel>({ kind: "idle" });
  // The testing area starts collapsed and opens itself when results arrive.
  const [resultsOpen, setResultsOpen] = useState(false);

  const busy = panel.kind === "running";

  // Runs the code against the visible example cases and shows per-case output.
  async function handleRunExamples() {
    setResultsOpen(true);
    setPanel({ kind: "running", action: "run" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as GradeResponse;

      if (data.results && data.results.length > 0) {
        setPanel({ kind: "run", cases: data.results, message: data.message });
      } else {
        setPanel({ kind: "error", detail: data.message ?? "Could not run the examples." });
      }
    } catch {
      setPanel({ kind: "error", detail: "Could not reach the server." });
    }
  }

  // Grades the code against the full hidden test suite.
  async function handleJudge() {
    setResultsOpen(true);
    setPanel({ kind: "running", action: "judge" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as GradeResponse;
      setPanel({
        kind: "judge",
        passed: data.passed,
        total: data.total,
        status: data.status,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        message: data.message,
      });
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

      {/* Editor panel */}
      <section className="flex-1 min-h-0 flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
          <CodeEditor value={code} onChange={setCode} />
        </div>
      </section>

      {/* Testing area panel — collapsed to a header until results arrive */}
      <div className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-950">
        <button
          type="button"
          onClick={() => setResultsOpen((open) => !open)}
          aria-expanded={resultsOpen}
          className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold text-white"
        >
          Testing Area
          <ChevronDown
            className={`h-4 w-4 text-white/60 transition-transform ${resultsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {resultsOpen && (
          <div className="max-h-72 overflow-y-auto border-t border-zinc-800 p-3">
            <Result panel={panel} />
          </div>
        )}
      </div>
    </div>
  );
}
