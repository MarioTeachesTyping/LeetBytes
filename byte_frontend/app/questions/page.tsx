// ============== //
// Questions Page //
// ============== //

"use client";

import Link from "next/link";
import Balatro from "@/components/react-bits/Balatro";
import PixelHoverButton from "@/components/PixelHoverButton";
import { PROBLEM_ROWS, type ProblemListRow } from "@/lib/problem-list";

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
  const filtered = PROBLEM_ROWS;

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Balatro background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      {/* Header */}
      <div className="px-4 md:px-8 py-3 relative z-20 flex items-center justify-center gap-6">
        <PixelHoverButton href="/" frames={BACK_BUTTON_FRAMES} alt="Back" width={140} height={52} />

        <PixelHoverButton frames={OPTIONS_BUTTON_FRAMES} alt="Options" width={140} height={52} />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 pt-2 pb-6 overflow-hidden relative z-10">
        <div className="w-full h-full max-w-6xl mx-auto relative">
          {/* Frame border layer */}
          <div className="bg-white/25 p-[3px] w-full h-full">
            {/* Panel body */}
            <div className="bg-black/90 backdrop-blur-sm w-full h-full flex flex-col overflow-hidden">
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
                        <span className="absolute left-1.5 text-emerald-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          ▸
                        </span>
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
    </div>
  );
}
