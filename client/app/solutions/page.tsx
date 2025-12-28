// ============== //
// Solutions Page //
// ============== //

"use client";

import { useMemo, useState } from "react";
import Balatro from "@/components/react-bits/Balatro";
import PillNav from "@/components/react-bits/PillNav";

const items = [
  "Two Sum - E - Array, Hash Table",
  "Add Two Numbers - M - Linked List, Math",
  "Longest Substring Without Repeating Characters - M - String, Sliding Window",
  "Median of Two Sorted Arrays - H - Array, Binary Search",
  "Valid Parentheses - E - Stack, String",
  "Merge Intervals - M - Array, Sorting",
  "Best Time to Buy and Sell Stock - E - Array, Dynamic Programming",
  "Maximum Subarray - M - Array, Dynamic Programming",
  "Climbing Stairs - E - Dynamic Programming",
  "Container With Most Water - M - Array, Two Pointers",
];

const difficultyTextClass: Record<string, string> = {
  E: "text-emerald-400",
  M: "text-amber-400",
  H: "text-rose-400",
};

const navItems = [
  { label: "All", href: "" },
  { label: "Array", href: "" },
  { label: "String", href: "" },
  { label: "Hash Table", href: "" },
  { label: "Two Pointers", href: "" },
  { label: "Stack", href: "" },
  { label: "Queue", href: "" },
  { label: "Linked List", href: "" },
  { label: "Dynamic Programming", href: "" },
];

export default function Solutions() 
{
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const filtered = useMemo(() => {
    if (selectedTopic === "All") return items;

    return items.filter((row) => {
      const parts = row.split(" - ");
      const topics = parts[2] ?? "";
      const tags = topics.split(",").map((t) => t.trim());
      return tags.includes(selectedTopic);
    });
  }, [selectedTopic]);

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 border-b border-white/20 bg-black relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <PillNav
            logo="/icon-dark.png"
            items={navItems}
            activeHref="/solutions"
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
          <Balatro
            isRotate={false}
            mouseInteraction={true}
            pixelFilter={700}
          />
        </div>

        {/* Foreground */}
        <div className="w-full h-full max-w-6xl mx-auto relative z-10">
          <div className="w-full h-full bg-black/80 backdrop-blur-sm border-2 border-white/20 rounded-lg overflow-hidden">
            <div className="w-full h-full overflow-y-auto pr-2">
              {filtered.map((item, index) => {
                const [title, difficulty, topics] = item.split(" - ");
                const diffColor =
                  difficultyTextClass[difficulty] ?? "text-white/70";

                return (
                  <div
                    key={`${title}-${index}`}
                    className="grid grid-cols-[48px_1fr_56px_300px] border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-center border-r border-white/10">
                      <span className="text-white/40 text-sm font-mono">
                        {index + 1}
                      </span>
                    </div>

                    <div className="p-6 border-r border-white/10">
                      <p className="text-white text-lg font-medium">{title}</p>
                    </div>

                    <div className="border-r border-white/10 flex items-center justify-center">
                      <span
                        className={`text-sm font-bold tracking-wide ${diffColor}`}
                      >
                        {difficulty}
                      </span>
                    </div>

                    <div className="p-6 flex items-center justify-center">
                      <p className="text-white/60 text-sm">{topics}</p>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-10 text-center text-white/60">
                  No solutions match{" "}
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
