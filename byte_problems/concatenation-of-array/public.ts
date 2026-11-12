// ====================== //
// Concatenation of Array //
// ====================== //

import type { SolutionEntry } from "../types.ts";

export const concatenationOfArray: SolutionEntry =
{
  title: "1929. Concatenation of Array",

  link: "https://leetcode.com/problems/concatenation-of-array/",

  difficulty: "Easy",

  description: [
    "Given an integer array `nums` of length `n`, you want to create an array `ans` of length `2n` where `ans[i] == nums[i]` and `ans[i + n] == nums[i]` for `0 <= i < n` (0-indexed).",
    "Specifically, `ans` is the concatenation of two `nums` arrays.",
    "Return the array `ans`.",
  ],

  examples: [
    {
      input: "`nums = [1,2,1]`",
      output: "`[1,2,1,1,2,1]`",
      explanation: "The array `ans` is formed as follows: `ans = [nums[0],nums[1],nums[2],nums[0],nums[1],nums[2]]`, so `ans = [1,2,1,1,2,1]`.",
    },
    {
      input: "`nums = [1,3,2,1]`",
      output: "`[1,3,2,1,1,3,2,1]`",
      explanation: "The array `ans` is formed as follows: `ans = [nums[0],nums[1],nums[2],nums[3],nums[0],nums[1],nums[2],nums[3]]`, so `ans = [1,3,2,1,1,3,2,1]`.",
    },
  ],

  constraints: [
    "`n == nums.length`",
    "`1 <= n <= 1000`",
    "`1 <= nums[i] <= 1000`",
  ],

  topics: [
    "Array", "Simulation",
  ],

  companies: [
    "Google", "Amazon", "Bloomberg", "Microsoft",
  ],

  hints: [
    "The answer is just `nums` written out twice in a row. You don't need to work out any values, only copy them.",
    "Python lists support `+` and `*`, which build a new list out of existing ones.",
    "`nums * 2` (or `nums + nums`) returns a new list with every element of `nums` followed by every element again.",
  ],

  starterCode: `class Solution:
    def getConcatenation(self, nums: List[int]) -> List[int]:
        `,

  code: `class Solution:
    def getConcatenation(self, nums: list[int]) -> list[int]:
        '''
        we can just multiply the list by two.
        '''
        return nums * 2`,

  explanation: {
    intuition: [
      "`ans` is `nums` followed by `nums` again, so there's nothing to calculate. Multiplying a Python list by an integer repeats its elements that many times in a new list, so `nums * 2` builds exactly that.",
      "Doing it by hand would mean making a list of length `2n` and filling `ans[i]` and `ans[i + n]` from `nums[i]`. List multiplication does the same copying for us in one step.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Every element is copied into the new list twice." },
      space: { bigO: "O(n)", reason: "The returned list holds 2n elements." },
    },
  },
};
