// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";
import { Gavel } from "lucide-react";
import Iridescence from "./react-bits/Iridescence";
import CodeEditor from "./CodeEditor";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

// Mirrors the server's JudgeSubmissionResponse (kept local so the client does
// not import across the shared/ package boundary).
type JudgeResponse = {
  status: string;
  passed: number;
  total: number;
  message?: string;
};

type RunState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "passed"; detail: string }
  | { status: "failed"; detail: string };

interface SolutionProps {
  slug: string;
  code: string;
}

function ResultBox({ state }: { state: RunState }) {
  const palette = {
    idle: "border-white/10 bg-white/5 text-white/50",
    running: "border-white/20 bg-white/5 text-white/80",
    passed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    failed: "border-red-500/40 bg-red-500/10 text-red-300",
  }[state.status];

  const label = {
    idle: "Run your code to see the result",
    running: "Running…",
    passed: "Passed",
    failed: "Failed",
  }[state.status];

  return (
    <div className={`rounded-lg border px-4 py-3 ${palette}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-lg font-semibold">
          {state.status === "passed" && <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />}
          {state.status === "failed" && <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-400" />}
          {label}
        </span>
        {"detail" in state && state.detail && (
          <span className="text-xs text-white/60">{state.detail}</span>
        )}
      </div>
    </div>
  );
}

export default function Solution({ slug, code: initialCode }: SolutionProps) {
  const [revealed, setRevealed] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [runState, setRunState] = useState<RunState>({ status: "idle" });

  async function handleRun() {
    setRunState({ status: "running" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as JudgeResponse;

      if (data.status === "accepted") {
        setRunState({ status: "passed", detail: `${data.passed}/${data.total} test cases` });
      } else {
        const detail = data.message ?? `${data.passed}/${data.total} test cases · ${data.status.replace(/_/g, " ")}`;
        setRunState({ status: "failed", detail });
      }
    } catch {
      setRunState({ status: "failed", detail: "Could not reach the server." });
    }
  }

  return (
    <section className="h-full p-3 flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={runState.status === "running"}
          className="inline-flex items-center gap-1.5 px-4 py-0.5 text-sm font-semibold leading-tight rounded-md border border-white transition-colors
                     bg-black text-white hover:bg-white hover:text-black
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Gavel className="h-4 w-4" />
          {runState.status === "running" ? "Judging…" : "Judge"}
        </button>
      </div>

      {/* Divider */}
      <div className="mb-3 border-t border-zinc-700" />

      {/* Editor */}
      <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
        <CodeEditor value={code} onChange={setCode} />

        {/* Iridescence spoiler overlay (fade out) */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-500 ease-out
            ${revealed ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <Iridescence
            color={[1, 1, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={1.0}
          />

          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="absolute px-12 py-3 bg-black text-white font-semibold rounded-lg border border-white
                         hover:bg-white hover:text-black transition-colors"
            >
              Spoiler
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      <div className="mt-4">
        <ResultBox state={runState} />
      </div>
    </section>
  );
}
