// =================== //
// Trapping Rain Water //
// =================== //

import type { SolutionEntry } from "../types.ts";

export const trappingRainWater: SolutionEntry = 
{
  title: "42. Trapping Rain Water",

  link: "https://leetcode.com/problems/trapping-rain-water/",

  difficulty: "Hard",

  description: [
    "Given `n`, non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
  ],

  examples: [
    {
      image: "/problem-images/rainwatertrap.png",
      input: "`height = [0,1,0,2,1,0,1,3,2,1,2,1]`",
      output: "`6`",
      explanation: "The above elevation map (black section) is represented by array `[0,1,0,2,1,0,1,3,2,1,2,1]`. In this case, `6` units of rain water (blue section) are being trapped.",
    },
    {
      input: "`height = [4,2,0,3,2,5]`",
      output: "`9`",
    },
  ],

  constraints: [
    "`n == height.length`.",
    "`1 <= n <= 2 * 10⁴`.",
    "`0 <= height[i] <= 10⁵`.",
  ],

  topics: [
    "Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack",
  ],

  companies: [
    "Amazon", "Google", "Microsoft",
  ],

  hints: [
    "The water trapped above any single bar depends on the tallest wall to its left and the tallest wall to its right — which of those two is the limiting factor?",
    "You don't need to precompute both the full left-max and right-max arrays up front — could two pointers starting at opposite ends, each tracking the max they've seen so far, get you the same answer in one pass?",
    "Move whichever pointer currently has the smaller max wall, since that side is the bottleneck: add `left_max - height[left]` (or the right equivalent) to your running total before advancing that pointer.",
  ],

  starterCode: `class Solution:
    def trap(self, height: List[int]) -> int:
        `,

  code: `class Solution:
    def trap(self, height: List[int]) -> int:

        # problem: get the number of water blocks that can be trapped in the list
        # solution: first thing that comes to mind is two pointer with min and max

        # we need a left, right pointer, left max, right max, and result
        size = len(height)
        left = 0 # starts at first index of list
        right = size - 1 # starts at end of list
        left_max = 0
        right_max = 0
        res = 0

        # we need a while loop so left and right go towards the middle and ends when they meet
        while left < right:
            # if left height is smaller than right height
            if height[left] < height[right]:
                # get the max of left max, add res, and increment left pointer
                left_max = max(left_max, height[left])
                res += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                res += right_max - height[right]
                right -= 1
            
        return res`,

  explanation: {
    intuition: [
      "The water above any bar is decided by the shorter of the two tallest walls around it: the smaller of (tallest bar to its left, tallest bar to its right), minus its own height.",
      "Two pointers start at both ends, each tracking the tallest bar seen on its side (`left_max` and `right_max`). The key insight is that whichever side currently has the shorter bar is the side whose water we can already settle. If `height[left] < height[right]`, there's a bar on the right at least that tall, so the water at `left` is limited only by `left_max`. The right side can't be the bottleneck. So we count that water, move `left` inward, and do the mirror image when the right side is shorter.",
    ],
    algorithm: [
      "Put `left` at the start and `right` at the end, with `left_max`, `right_max`, and `res` at `0`.",
      "While `left < right`, compare `height[left]` and `height[right]`.",
      "If the left bar is shorter, update `left_max`, add `left_max - height[left]` to `res`, and move `left` right.",
      "Otherwise, update `right_max`, add `right_max - height[right]` to `res`, and move `right` left.",
      "Return `res`. A bar that's the tallest so far adds `0`, since no water sits above it.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "The two pointers move toward each other, visiting each bar once." },
      space: { bigO: "O(1)", reason: "Only a handful of variables, no matter how many bars there are." },
    },
  },
};
