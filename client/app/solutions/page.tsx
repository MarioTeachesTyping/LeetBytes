// ============== //
// Solutions Page //
// ============== //

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Balatro from "@/components/react-bits/Balatro";
import PillNav from "@/components/react-bits/PillNav";

type ItemRow = {
  title: string;
  difficulty: "E" | "M" | "H";
  topics: string;
  slug?: string; // only rows with a slug are clickable
};

const items: ItemRow[] = [
  { title: "Two Sum", difficulty: "E", topics: "Array, Hash Table", slug: "two-sum" },
  { title: "Add Two Numbers", difficulty: "M", topics: "Linked List, Math, Recursion", slug: "add-two-numbers" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "M", topics: "Hash Table, Sliding Window", slug: "longest-substring-without-repeating-characters" },
  { title: "Longest Palindromic Substring", difficulty: "M", topics: "Two Pointers, DP" },
  { title: "Palindrome Number", difficulty: "E", topics: "Math" },
  { title: "Valid Parentheses", difficulty: "E", topics: "String, Stack" },
  { title: "Merge Two Sorted Lists", difficulty: "E", topics: "Linked Lists, Recursion" },
  { title: "Generate Parentheses", difficulty: "M", topics: "String, DP, Backtracking" },
  { title: "Trapping Rain Water", difficulty: "H", topics: "Array, Two Pointers, DP, Stack" },
  { title: "Group Anagrams", difficulty: "M", topics: "Array, Hash Table, String, Sorting" },
  { title: "Subsets", difficulty: "M", topics: "Array, Backtracking" },
  { title: "Word Search", difficulty: "M", topics: "Array, String, Backtracking, DFS, Matrix" },
  { title: "Same Tree", difficulty: "E", topics: "Tree, DFS, BFS, Binary Tree" },
  { title: "Symmetric Tree", difficulty: "E", topics: "Tree, DFS, BFS, Binary Tree" },
  { title: "Maximum Depth of Binary Tree", difficulty: "E", topics: "Tree, DFS, BFS, Binary Tree" },
  { title: "Best Time to Buy and Sell Stock", difficulty: "E", topics: "Array, DP" },
  { title: "Linked List Cycle", difficulty: "E", topics: "Hash Table, Linked List, Two Pointers" },
  { title: "LRU Cache", difficulty: "M", topics: "Hash Table, Linked List, Design" },
  { title: "Min Stack", difficulty: "M", topics: "Stack, Design" },
  { title: "Majority Element", difficulty: "E", topics: "Array, Hash Table, Divide & Conquer, Sorting, Counting" },
  { title: "Number of Islands", difficulty: "M", topics: "Array, DFS, BFS, Union Find, Matrix" },
  { title: "Isomorphic Strings", difficulty: "E", topics: "Hash Table, String" },
  { title: "Reverse Linked List", difficulty: "E", topics: "Linked List, Recursion" },
  { title: "Kth Largest Element in an Array", difficulty: "M", topics: "Array, Divide & Conquer, Sorting, Heap" },
  { title: "Contains Duplicate", difficulty: "E", topics: "Array, Hash Table, Sorting" },
  { title: "Contains Duplicate II", difficulty: "E", topics: "Array, Hash Table, Sliding Window" },
  { title: "Invert Binary Tree", difficulty: "E", topics: "Tree, BFS, DFS, Binary Tree" },
  { title: "Valid Anagram", difficulty: "E", topics: "Hash Table, String, Sorting" },
  { title: "Meeting Rooms", difficulty: "E", topics: "Array, Sorting" },
  { title: "Binary Tree Vertical Order Traversal", difficulty: "M", topics: "Hash Table, Tree, DFS, BFS, Sorting, Binary Tree" },
  { title: "Minimum Remove to Make Valid Parentheses", difficulty: "M", topics: "String, Stack" },
  { title: "Sequential Digits", difficulty: "M", topics: "Enumeration" },
  { title: "Check If All 1's Are at Least Length K Places Away", difficulty: "E", topics: "Array" },
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
  { label: "Sorting", href: "" },
  { label: "Two Pointers", href: "" },
  { label: "Sliding Window", href: "" },
  { label: "Stack", href: "" },
  { label: "Heap", href: "" },
  { label: "Linked List", href: "" },
  { label: "Tree", href: "" },
  { label: "DFS", href: "" },
  { label: "BFS", href: "" },
  { label: "Matrix", href: "" },
  { label: "Backtracking", href: "" },
  { label: "DP", href: "" },
  { label: "Design", href: "" },
];

export default function Solutions() {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const filtered = useMemo(() => {
    if (selectedTopic === "All") return items;

    return items.filter((row) => {
      const tags = row.topics.split(",").map((t) => t.trim());
      return tags.includes(selectedTopic);
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
          <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
        </div>

        {/* Foreground */}
        <div className="w-full h-full max-w-6xl mx-auto relative z-10">
          <div className="w-full h-full bg-black/80 backdrop-blur-sm border-2 border-white/20 rounded-lg overflow-hidden">
            <div className="w-full h-full overflow-y-auto pr-2">
              {filtered.map((row, index) => {
                const diffColor =
                  difficultyTextClass[row.difficulty] ?? "text-white/70";

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
                        {row.difficulty}
                      </span>
                    </div>

                    <div className="p-6 flex items-center justify-center">
                      <p className="text-white/60 text-sm">{row.topics}</p>
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
