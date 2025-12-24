// ============== //
// Solutions Page //
// ============== //

"use client";

import Link from "next/link";
import Image from "next/image";
import Cubes from '@/components/react-bits/Cubes';

const items = 
[
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

export default function Solutions() 
{
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <div className="pt-4 pb-4 px-4 md:px-8 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icon.png"
              alt="LeetBytes"
              width={60}
              height={60}
            />
          </Link>
        </div>
      </div>
      
      <div className="flex-1 px-4 md:px-8 py-8 overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full">
          <Cubes />
        </div>
        <div className="w-full h-full max-w-6xl mx-auto relative z-10">
          <div className="w-full h-full bg-black border-2 border-white/20 rounded-lg overflow-hidden">
            <div className="w-full h-full overflow-y-auto pr-2">
              {items.map((item, index) => {
                const parts = item.split(' - ');
                const title = parts[0];
                const difficulty = parts[1];
                const topics = parts[2];
                
                return (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto_auto] border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => console.log(item, index)}
                  >
                    <div className="p-6 border-r border-white/10">
                      <p className="text-white text-lg font-medium">{title}</p>
                    </div>
                    <div className="p-6 border-r border-white/10 min-w-[180px] flex items-center justify-center">
                      <p className="text-white/80 text-base">{difficulty}</p>
                    </div>
                    <div className="p-6 min-w-[300px] flex items-center justify-center">
                      <p className="text-white/60 text-sm">{topics}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}