// ============== //
// Solutions Page //
// ============== //

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Balatro from "@/components/react-bits/Balatro";
import PillNav from "@/components/react-bits/PillNav";
import { PROBLEM_ROWS, PROBLEM_TOPICS, type ProblemListRow } from "@/lib/problem-list";

const difficultyTextClass: Record<ProblemListRow["difficulty"], string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-rose-400",
};

const difficultyAbbreviation: Record<ProblemListRow["difficulty"], string> = {
  Easy: "E",
  Medium: "M",
  Hard: "H",
};

// Builds a stable hash-like value for PillNav active state comparisons.
const topicHref = (topic: string) =>
  `#${topic.toLowerCase().replaceAll(" ", "-")}`;

// Converts the topic list into the item format expected by PillNav.
const navItems = PROBLEM_TOPICS.map((topic) => ({
  label: topic,
  href: topicHref(topic),
}));

export default function Solutions() {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  // Recomputes visible rows whenever the selected topic changes.
  const filtered = useMemo(() => {
    if (selectedTopic === "All") return PROBLEM_ROWS;

    return PROBLEM_ROWS.filter((row) => {
      return row.topics.includes(selectedTopic);
    });
  }, [selectedTopic]);

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-3 border-b border-white/20 bg-black relative z-20">
        <div className="w-full flex items-center justify-center">
          <PillNav
            logo="/icon-dark.png"
            items={navItems}
            activeHref={topicHref(selectedTopic)}
            onSelect={(item) => setSelectedTopic(item.label)}
            baseColor="#ffffff"
            pillColor="#000000"
            pillTextColor="#ffffff"
            hoveredPillTextColor="#000000"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-8 py-8 overflow-hidden relative">
        {/* Balatro background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
        </div>

        {/* Foreground */}
        <div className="w-full h-full max-w-6xl mx-auto relative z-10">
          <div className="w-full h-full bg-black/80 backdrop-blur-sm border-2 border-white/20 rounded-lg overflow-hidden">
            <div className="w-full h-full overflow-y-auto pr-2">
              {filtered.map((row, index) => {
                const diffColor =
                  difficultyTextClass[row.difficulty] ?? "text-white/70";
                const topicsText = row.topics.join(", ");

                // Shared row markup used for both clickable and disabled rows.
                const content = (
                  <div
                    className={`grid grid-cols-[48px_minmax(0,1fr)_56px_420px] border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all ${
                      row.slug ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-center border-r border-white/10">
                      <span className="text-white/40 text-sm font-mono">
                        {index + 1}
                      </span>
                    </div>

                    <div className="p-6 border-r border-white/10">
                      <p className="text-white text-lg font-medium">
                        {row.title}
                      </p>
                    </div>

                    <div className="border-r border-white/10 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold tracking-wide ${diffColor}`}
                      >
                        {difficultyAbbreviation[row.difficulty]}
                      </span>
                    </div>

                    <div className="p-6 flex items-center justify-center">
                      <p className="text-white/60 text-sm">{topicsText}</p>
                    </div>
                  </div>
                );

                // Clickable only if slug exists
                return row.slug ? (
                  <Link
                    key={`${row.title}-${index}`}
                    href={`/solutions/${row.slug}`}
                    className="block"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={`${row.title}-${index}`}>{content}</div>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-10 text-center text-white/60">
                  No Solutions Match{" "}
                  <span className="text-white">{selectedTopic}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
