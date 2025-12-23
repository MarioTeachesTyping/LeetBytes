// ============== //
// Solutions Page //
// ============== //

"use client";

import Link from "next/link";
import AnimatedList from '@/components/react-bits/AnimatedList';

const items = [
  'Two Sum - Easy - Array, Hash Table',
  'Add Two Numbers - Medium - Linked List, Math',
  'Longest Substring Without Repeating Characters - Medium - String, Sliding Window',
  'Median of Two Sorted Arrays - Hard - Array, Binary Search',
  'Valid Parentheses - Easy - Stack, String',
  'Merge Intervals - Medium - Array, Sorting',
  'Best Time to Buy and Sell Stock - Easy - Array, Dynamic Programming',
  'Maximum Subarray - Medium - Array, Dynamic Programming',
  'Climbing Stairs - Easy - Dynamic Programming',
  'Container With Most Water - Medium - Array, Two Pointers'
];

export default function Solutions() {
  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="pt-4 pb-4 px-4 md:px-8 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-center relative">
          <Link href="/" className="absolute left-0 text-white hover:text-gray-300 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Solutions
          </h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 md:px-8 pb-8 overflow-hidden">
        <div className="h-full w-full max-w-6xl mx-auto">
          <AnimatedList
            items={items}
            onItemSelect={(item, index) => console.log(item, index)}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </div>
      </div>
    </div>
  );
}