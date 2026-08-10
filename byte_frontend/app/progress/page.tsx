// ============= //
// Progress Page //
// ============= //

"use client";

import { useMemo, useSyncExternalStore } from "react";
import Balatro from "@/components/react-bits/Balatro";
import PixelHoverButton from "@/components/PixelHoverButton";
import ContributionCalendar from "@/components/ContributionCalendar";
import { PROBLEM_ROWS, PROBLEMS_BY_SLUG, type ProblemListRow } from "@/lib/problem-list";
import
{
  getProgressServerSnapshot,
  getProgressSnapshot,
  solvedSlugs,
  subscribeToProgress,
} from "@/lib/progress";
import type { JudgeVerdict } from "@leetbytes/shared";

const BACK_BUTTON_FRAMES = ["/base/button-back.png", "/base/button-back-2.png", "/base/button-back-3.png"];

type Difficulty = ProblemListRow["difficulty"];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

const difficultyColor: Record<Difficulty, string> = {
  Easy: "border-emerald-400 text-emerald-400 bg-emerald-400/10",
  Medium: "border-amber-400 text-amber-400 bg-amber-400/10",
  Hard: "border-rose-400 text-rose-400 bg-rose-400/10",
};

const difficultyBar: Record<Difficulty, string> = {
  Easy: "bg-emerald-400",
  Medium: "bg-amber-400",
  Hard: "bg-rose-400",
};

const difficultyAbbreviation: Record<Difficulty, string> = {
  Easy: "E",
  Medium: "M",
  Hard: "H",
};

// Short verdict tags — the history table has no room for the full status text.
const verdictLabel: Record<JudgeVerdict, string> = {
  accepted: "AC",
  wrong_answer: "WA",
  runtime_error: "RE",
  time_limit_exceeded: "TLE",
  compile_error: "CE",
  error: "ERR",
};

const verdictColor: Record<JudgeVerdict, string> = {
  accepted: "text-emerald-400",
  wrong_answer: "text-rose-400",
  runtime_error: "text-amber-400",
  time_limit_exceeded: "text-amber-400",
  compile_error: "text-amber-400",
  error: "text-white/40",
};

const historyGrid = "grid-cols-[minmax(0,1fr)_48px_64px_160px]";

function formatWhen(at: number): string
{
  const date = new Date(at);
  return `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${date.toLocaleTimeString(
    undefined,
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}

// A bordered black panel — same frame convention as the questions list.
function Panel({ title, children, className = "" }: {
  title: string;
  children: React.ReactNode;
  className?: string;
})
{
  return (
    <div className={`bg-white/25 p-[3px] ${className}`}>
      <div className="flex h-full w-full flex-col overflow-hidden bg-black/90 backdrop-blur-sm">
        <div className="shrink-0 border-b-2 border-white/15 px-4 py-2 text-[10px] tracking-[0.2em] text-white/40">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Progress()
{
  // Reads localStorage as an external store — the server snapshot is always
  // empty, so the first client render matches the SSR'd HTML with no
  // hydration mismatch, and the real numbers land as soon as this runs client-side.
  const submissions = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const summary = useMemo(() =>
  {
    const solved = solvedSlugs(submissions);

    const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 } as Record<Difficulty, number>;
    const totalByDifficulty = { Easy: 0, Medium: 0, Hard: 0 } as Record<Difficulty, number>;

    for (const row of PROBLEM_ROWS)
    {
      totalByDifficulty[row.difficulty] += 1;
      if (row.slug && solved.has(row.slug))
      {
        solvedByDifficulty[row.difficulty] += 1;
      }
    }

    const accepted = submissions.filter((entry) => entry.status === "accepted").length;

    return {
      solved: solved.size,
      totalProblems: PROBLEM_ROWS.length,
      judgedRuns: submissions.length,
      accepted,
      solvedByDifficulty,
      totalByDifficulty,
    };
  }, [submissions]);

  // Newest first.
  const history = useMemo(() => [...submissions].reverse(), [submissions]);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Balatro background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-center px-4 py-3 md:px-8">
        <PixelHoverButton href="/" frames={BACK_BUTTON_FRAMES} alt="Back" width={140} height={52} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-hidden px-4 pb-6 pt-2 md:px-8">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
          {/* Top row — history on the left, summary on the right */}
          <div className="flex min-h-0 flex-1 gap-4">
            <Panel title="PRACTICE HISTORY" className="min-w-0 flex-1">
              <div className={`shrink-0 grid ${historyGrid} border-b border-white/10 pr-2 text-[10px] tracking-[0.2em] text-white/30`}>
                <div className="py-1.5 pl-4">PROBLEM</div>
                <div className="border-l border-white/10 py-1.5 text-center">LVL</div>
                <div className="border-l border-white/10 py-1.5 text-center">RESULT</div>
                <div className="border-l border-white/10 py-1.5 text-center">SUBMITTED</div>
              </div>

              <div className="pixel-scrollbar flex-1 overflow-y-scroll">
                {history.length === 0 ? (
                  <p className="px-4 py-6 text-xs tracking-wide text-white/30">
                    No submissions yet! Judge a problem and it shows up here.
                  </p>
                ) : (
                  history.map((entry, index) =>
                  {
                    const problem = PROBLEMS_BY_SLUG.get(entry.slug);
                    const difficulty = problem?.difficulty;

                    return (
                      <div
                        key={`${entry.slug}-${entry.at}-${index}`}
                        className={`grid ${historyGrid} border-b border-white/10 last:border-b-0 transition-colors hover:bg-white/5`}
                      >
                        <div className="flex items-center py-3 pl-4 pr-2">
                          <p className="truncate text-sm tracking-wide text-white">
                            {problem?.title ?? entry.slug}
                          </p>
                        </div>

                        <div className="flex items-center justify-center border-l border-white/10">
                          {difficulty && (
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center border-2 text-[10px] font-bold ${difficultyColor[difficulty]}`}
                            >
                              {difficultyAbbreviation[difficulty]}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-center justify-center border-l border-white/10">
                          <span className={`text-[11px] font-bold ${verdictColor[entry.status]}`}>
                            {verdictLabel[entry.status]}
                          </span>
                          <span className="text-[9px] text-white/30">
                            {entry.passed}/{entry.total}
                          </span>
                        </div>

                        <div className="flex items-center justify-center border-l border-white/10">
                          <span className="text-[10px] tracking-wide text-white/40">
                            {formatWhen(entry.at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>

            <Panel title="SUMMARY" className="w-[300px] shrink-0">
              <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
                {/* Headline counters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-2xl text-white">{summary.solved}</p>
                    <p className="text-[9px] tracking-[0.2em] text-white/40">SOLVED</p>
                  </div>
                  <div className="border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-2xl text-white">{summary.judgedRuns}</p>
                    <p className="text-[9px] tracking-[0.2em] text-white/40">JUDGED RUNS</p>
                  </div>
                </div>

                <p className="text-[10px] tracking-[0.15em] text-white/30">
                  {summary.accepted} ACCEPTED · {summary.solved}/{summary.totalProblems} PROBLEMS
                </p>

                {/* Per-difficulty breakdown */}
                <div className="flex flex-col gap-3">
                  {DIFFICULTIES.map((difficulty) =>
                  {
                    const solved = summary.solvedByDifficulty[difficulty];
                    const total = summary.totalByDifficulty[difficulty];
                    const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

                    return (
                      <div key={difficulty} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] tracking-[0.2em]">
                          <span className="text-white/50">{difficulty.toUpperCase()}</span>
                          <span className="text-white/70">
                            {solved}
                            <span className="text-white/30"> / {total}</span>
                          </span>
                        </div>

                        {/* Chunky pixel meter — no rounding, matches the UI */}
                        <div className="h-2 w-full bg-white/10">
                          <div
                            className={`h-full ${difficultyBar[difficulty]}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Panel>
          </div>

          {/* Bottom — contribution calendar */}
          <div className="shrink-0 bg-white/25 p-[3px]">
            <div className="bg-black/90 backdrop-blur-sm">
              <ContributionCalendar submissions={submissions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
