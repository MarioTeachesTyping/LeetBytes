// ============== //
// Questions Page //
// ============== //

"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Balatro from "@/components/react-bits/Balatro";
import PixelHoverButton from "@/components/PixelHoverButton";
import FilterModal from "@/components/FilterModal";
import { PROBLEM_ROWS, type ProblemListRow } from "@/lib/problem-list";
import
{
  EMPTY_FILTERS,
  countActiveFilters,
  filterProblems,
  type ProblemFilters,
  type ProblemStatus,
} from "@/lib/problem-filters";
import
{
  getProgressServerSnapshot,
  getProgressSnapshot,
  subscribeToProgress,
} from "@/lib/progress";

const BACK_BUTTON_FRAMES = ["/base/button-back.png", "/base/button-back-2.png", "/base/button-back-3.png"];
const OPTIONS_BUTTON_FRAMES = ["/base/button-options.png", "/base/button-options-2.png", "/base/button-options-3.png"];

const difficultyBadgeClass: Record<ProblemListRow["difficulty"], string> = {
  Easy: "border-emerald-400 text-emerald-400 bg-emerald-400/10",
  Medium: "border-amber-400 text-amber-400 bg-amber-400/10",
  Hard: "border-rose-400 text-rose-400 bg-rose-400/10",
};

const difficultyAbbreviation: Record<ProblemListRow["difficulty"], string> = {
  Easy: "E",
  Medium: "M",
  Hard: "H",
};

const columnGrid = "grid-cols-[48px_minmax(0,1fr)_56px_420px]";

export default function Questions()
{
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProblemFilters>(EMPTY_FILTERS);

  // Drives the Solved/Attempted/Untouched filter. The server snapshot is empty,
  // so the first paint matches the SSR'd HTML and the real statuses land as
  // soon as this runs client-side.
  const submissions = useSyncExternalStore(
    subscribeToProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const statusBySlug = useMemo(() =>
  {
    const statuses = new Map<string, ProblemStatus>();

    for (const entry of submissions)
    {
      // Accepted wins permanently — a later wrong answer doesn't un-solve it.
      if (entry.status === "accepted")
      {
        statuses.set(entry.slug, "Solved");
      }
      else if (statuses.get(entry.slug) !== "Solved")
      {
        statuses.set(entry.slug, "Attempted");
      }
    }

    return statuses;
  }, [submissions]);

  const filtered = useMemo(
    () => filterProblems(
      PROBLEM_ROWS,
      filters,
      (row) => (row.slug ? statusBySlug.get(row.slug) ?? "Untouched" : "Untouched"),
    ),
    [filters, statusBySlug],
  );

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Balatro background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      {/* Header */}
      <div className="px-4 md:px-8 py-3 relative z-20 flex items-center justify-center gap-6">
        <PixelHoverButton href="/" frames={BACK_BUTTON_FRAMES} alt="Back" width={140} height={52} />

        <div className="relative">
          <PixelHoverButton
            frames={OPTIONS_BUTTON_FRAMES}
            alt="Options"
            width={140}
            height={52}
            onClick={() => setFiltersOpen(true)}
          />

          {activeFilterCount > 0 && (
            <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border-2 border-black bg-white px-1 text-[10px] font-bold text-black">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 pt-2 pb-6 overflow-hidden relative z-10">
        <div className="w-full h-full max-w-6xl mx-auto relative">
          {/* Frame border layer */}
          <div className="bg-white/25 p-[3px] w-full h-full">
            {/* Panel body */}
            <div className="bg-black/90 backdrop-blur-sm w-full h-full flex flex-col overflow-hidden">
              {/* Filter readout — only while something is actually filtering */}
              {activeFilterCount > 0 && (
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 py-1.5 text-[10px] tracking-[0.2em]">
                  <span className="text-white/50">
                    SHOWING <span className="text-white">{filtered.length}</span> OF {PROBLEM_ROWS.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="border border-white/25 px-2 py-0.5 text-white/60 transition-colors hover:bg-white hover:text-black"
                  >
                    CLEAR
                  </button>
                </div>
              )}

              {/* Column header */}
              <div
                className={`shrink-0 grid ${columnGrid} border-b-2 border-white/15 text-[10px] tracking-[0.2em] text-white/40 pr-2`}
              >
                <div className="py-2 text-center">#</div>
                <div className="py-2 pl-6 border-l border-white/10">TITLE</div>
                <div className="py-2 text-center border-l border-white/10">LVL</div>
                <div className="py-2 text-center border-l border-white/10">TOPICS</div>
              </div>

              {/* Rows */}
              <div className="flex-1 overflow-y-scroll pixel-scrollbar">
                {filtered.length === 0 && (
                  <p className="px-6 py-8 text-xs tracking-wide text-white/30">
                    No problems match these filters. Try loosening one.
                  </p>
                )}

                {filtered.map((row, index) =>
                {
                  const badgeColor =
                    difficultyBadgeClass[row.difficulty] ?? "border-white/30 text-white/70";
                  const topicsText = row.topics.join(", ");

                  // Shared row markup used for both clickable and disabled rows.
                  const content = (
                    <div
                      className={`group relative grid ${columnGrid} border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors ${
                        row.slug ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-center border-r border-white/10 relative">
                        <span className="text-white/40 text-xs font-mono">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="px-6 py-4 border-r border-white/10 flex items-center">
                        <p className="text-white text-sm tracking-wide">
                          {row.title}
                        </p>
                      </div>

                      <div className="border-r border-white/10 flex items-center justify-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 border-2 text-[10px] font-bold ${badgeColor}`}
                        >
                          {difficultyAbbreviation[row.difficulty]}
                        </span>
                      </div>

                      <div className="px-6 py-4 flex items-center justify-center">
                        <p className="text-white/50 text-xs text-center tracking-wide">{topicsText}</p>
                      </div>
                    </div>
                  );

                  // Clickable only if slug exists
                  return row.slug ? (
                    <Link
                      key={`${row.title}-${index}`}
                      href={`/questions/${row.slug}`}
                      className="block"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={`${row.title}-${index}`}>{content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        matchCount={filtered.length}
        totalCount={PROBLEM_ROWS.length}
      />
    </div>
  );
}
