import type { SolutionEntry } from "./types";

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
    "`1 <= n <= 2 * 10^4`.",
    "`0 <= height[i] <= 10^5`.",
  ],

  topics: [
    "Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack",
  ],

  companies: [
    "Amazon", "Google", "Microsoft",
  ],

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

  stats: {
    runtime: { label: "Runtime", value: "11 ms", beats: "45.81%" },
    memory: { label: "Memory", value: "19.33 MB", beats: "100.00%" },
  },
};
