// ================== //
// Solutions Database //
// ================== //

export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type SolutionEntry = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: Example[];
  constraints?: string[];
  code: string; // python only for now
};

export const SOLUTIONS: Record<string, SolutionEntry> = {
  "two-sum": {
    title: "1. Two Sum",
    difficulty: "Easy",
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0,1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    code: `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            need = target - x
            if need in seen:
                return [seen[need], i]
            seen[x] = i`,
  },
};
