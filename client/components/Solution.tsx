// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import CodeEditor from "./CodeEditor";
import Result, { TestCasesEditor, type CaseResult, type GradeResponse, type Panel } from "./Result";
import { useWorkspace } from "./WorkspaceContext";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

type Tab = "cases" | "results" | "submissions";

const TABS: { key: Tab; label: string }[] = [
  { key: "cases", label: "Test Cases" },
  { key: "results", label: "Test Results" },
  { key: "submissions", label: "Submissions" },
];

// Structured public cases returned by GET /problems/:slug/cases.
type CasesResponse = {
  paramNames: string[];
  cases: { args: unknown[]; expected: unknown }[];
};

interface SolutionProps {
  slug: string;
  starterCode: string;
}

export default function Solution({ slug, starterCode }: SolutionProps) {
  const [code, setCode] = useState(starterCode);
  // Run output ("Test Results") and judge output ("Submissions") are tracked
  // separately so switching tabs never discards the other's last result.
  const [runResult, setRunResult] = useState<Panel>({ kind: "idle" });
  const [judgeResult, setJudgeResult] = useState<Panel>({ kind: "idle" });
  const [tab, setTab] = useState<Tab>("cases");
  const [open, setOpen] = useState(false);
  // Height (px) of the test panel; the editor above takes the remaining space.
  // Dragging the handle between them adjusts this.
  const [panelHeight, setPanelHeight] = useState(240);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startHeight: number; maxHeight: number } | null>(null);

  // Editable test cases. Each arg is stored as its raw JSON string so the user can
  // freely type; `original`/`expected` let us show the known answer for unedited
  // cases (expected is unknown once an input changes).
  const [paramNames, setParamNames] = useState<string[]>([]);
  const [caseValues, setCaseValues] = useState<string[][]>([]);
  const [originalValues, setOriginalValues] = useState<string[][]>([]);
  const [caseExpected, setCaseExpected] = useState<unknown[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);

  const busy = runResult.kind === "running" || judgeResult.kind === "running";
  const running: "run" | "judge" | null =
    runResult.kind === "running" ? "run" : judgeResult.kind === "running" ? "judge" : null;

  // The Run/Judge buttons live on the Navbar; wire our handlers and status up to
  // the shared workspace context so they can drive this panel from up there.
  const { setActions, setStatus } = useWorkspace();

  // Re-register every render so the Navbar always calls our latest closures.
  // setActions only writes a ref, so this doesn't cause a re-render loop.
  useEffect(() => {
    setActions({ onRun: handleRunExamples, onJudge: handleJudge });
  });

  useEffect(() => {
    setStatus({ busy, running });
  }, [busy, running, setStatus]);

  const onResize = useCallback((event: MouseEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    // Dragging up (smaller clientY) grows the panel.
    const next = drag.startHeight + (drag.startY - event.clientY);
    setPanelHeight(Math.min(Math.max(next, 120), drag.maxHeight));
  }, []);

  const stopResize = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onResize);
    window.removeEventListener("mouseup", stopResize);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [onResize]);

  function startResize(event: React.MouseEvent) {
    event.preventDefault();
    const containerHeight = containerRef.current?.clientHeight ?? window.innerHeight;
    dragRef.current = {
      startY: event.clientY,
      startHeight: panelHeight,
      // Leave room for the toolbar and a usable slice of editor above.
      maxHeight: Math.max(160, containerHeight - 200),
    };
    window.addEventListener("mousemove", onResize);
    window.addEventListener("mouseup", stopResize);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
  }

  // Clean up listeners if the component unmounts mid-drag.
  useEffect(() => stopResize, [stopResize]);

  // Load the problem's default inputs into the editor once on mount.
  useEffect(() => {
    let active = true;

    fetch(`${SERVER_URL}/problems/${slug}/cases`)
      .then((response) => (response.ok ? (response.json() as Promise<CasesResponse>) : null))
      .then((data) => {
        if (!active || !data) {
          if (active) setCasesLoading(false);
          return;
        }

        const values = data.cases.map((c) => c.args.map((arg) => JSON.stringify(arg)));
        setParamNames(data.paramNames);
        setCaseValues(values);
        setOriginalValues(values.map((row) => [...row]));
        setCaseExpected(data.cases.map((c) => c.expected));
        setCasesLoading(false);
      })
      .catch(() => {
        if (active) setCasesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  function updateCase(caseIndex: number, argIndex: number, value: string) {
    setCaseValues((prev) =>
      prev.map((row, i) =>
        i === caseIndex ? row.map((v, j) => (j === argIndex ? value : v)) : row,
      ),
    );
  }

  // Runs the code against the (possibly edited) test cases and shows per-case output.
  async function handleRunExamples() {
    setOpen(true);
    setTab("results");

    // Turn each editable JSON field into args to send. Bail early on bad JSON.
    let cases: { args: unknown[] }[] | undefined;
    if (caseValues.length > 0) {
      try {
        cases = caseValues.map((row) => ({ args: row.map((text) => JSON.parse(text)) }));
      } catch {
        setRunResult({
          kind: "error",
          detail: "One of your inputs isn't valid JSON — check the Test Cases tab.",
        });
        return;
      }
    }

    setRunResult({ kind: "running", action: "run" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code, cases }),
      });

      const data = (await response.json()) as GradeResponse;

      if (data.results && data.results.length > 0) {
        setRunResult({ kind: "run", cases: withExpected(data.results, cases !== undefined), message: data.message });
      } else {
        setRunResult({ kind: "error", detail: data.message ?? "Could not run the examples." });
      }
    } catch {
      setRunResult({ kind: "error", detail: "Could not reach the server." });
    }
  }

  // Attaches the known expected answer to each result — but only for cases whose
  // inputs are unchanged from the defaults, since editing an input makes the
  // expected answer unknown. When defaults ran, the server's expected is kept.
  function withExpected(results: CaseResult[], sentCustom: boolean): CaseResult[] {
    if (!sentCustom) return results;

    return results.map((result) => {
      const i = result.index;
      const unchanged =
        originalValues[i] && caseValues[i]
          ? caseValues[i].every((text, j) => text === originalValues[i][j])
          : false;

      return { ...result, expected: unchanged ? JSON.stringify(caseExpected[i]) : undefined };
    });
  }

  // Grades the code against the full hidden test suite.
  async function handleJudge() {
    setOpen(true);
    setTab("submissions");
    setJudgeResult({ kind: "running", action: "judge" });

    try {
      const response = await fetch(`${SERVER_URL}/submissions/judge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemSlug: slug, language: "python", code }),
      });

      const data = (await response.json()) as GradeResponse;
      setJudgeResult({
        kind: "judge",
        passed: data.passed,
        total: data.total,
        status: data.status,
        runtimeMs: data.runtimeMs,
        memoryKb: data.memoryKb,
        message: data.message,
      });
    } catch {
      setJudgeResult({ kind: "error", detail: "Could not reach the server." });
    }
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col gap-2 min-h-0">
      {/* Editor panel */}
      <section className="flex-1 min-h-0 flex flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-3">
        <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
          <CodeEditor value={code} onChange={setCode} />
        </div>
      </section>

      {/* Drag handle — resize the editor/test split (only while the panel is open) */}
      {open && (
        <div
          onMouseDown={startResize}
          role="separator"
          aria-orientation="horizontal"
          className="group shrink-0 flex h-1 cursor-row-resize items-center justify-center"
        >
          <div className="h-0.5 w-8 rounded-full bg-zinc-700 transition-colors group-hover:bg-zinc-500" />
        </div>
      )}

      {/* Test panel — tabbed (Test Cases / Test Results / Submissions), collapsible + resizable */}
      <div
        className="shrink-0 flex flex-col min-h-0 rounded-lg border border-zinc-800 bg-zinc-950"
        style={open ? { height: panelHeight } : undefined}
      >
        <div className="shrink-0 flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-1">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key);
                  setOpen(true);
                }}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  tab === key ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? "Collapse test panel" : "Expand test panel"}
            className="p-1 text-white/60 hover:text-white"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="flex-1 min-h-0 overflow-y-auto border-t border-zinc-800 p-3">
            {tab === "cases" && (
              <TestCasesEditor
                paramNames={paramNames}
                values={caseValues}
                onChange={updateCase}
                loading={casesLoading}
              />
            )}
            {tab === "results" && (
              <Result panel={runResult} idleMessage="Run your code to see the output for each case." />
            )}
            {tab === "submissions" && (
              <Result panel={judgeResult} idleMessage="Judge your code to test it against every case." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
