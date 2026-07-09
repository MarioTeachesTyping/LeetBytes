// ======= //
// Subsets //
// ======= //

import type { SolutionEntry } from "../types.ts";

export const subsets: SolutionEntry =
{
  title: "78. Subsets",

  link: "https://leetcode.com/problems/subsets/",

  difficulty: "Medium",

  description: [
    "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
    "The solution set must not contain duplicate subsets. Return the solution in any order.",
  ],

  examples: [
    {
      input: "`nums = [1,2,3]`",
      output: "`[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]`",
    },
    {
      input: "`nums = [0]`",
      output: "`[[],[0]]`",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10`.",
    "`-10 <= nums[i] <= 10`.",
    "All the numbers of `nums` are unique.",
  ],

  topics: [
    "Array", "Backtracking", "Bit Manipulation",
  ],

  companies: [
    "Amazon", "Google", "Meta",
  ],

  starterCode: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        `,

  code: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        '''
        the question asks for ALL POSSIBLE subsets so this makes think of
        backtracking as a good answer
        we need a backtrack function for our recursion call
        initialize variables for our output which would be a list []
        length of the nums list, and for backtrack, our subset, first index variable
        '''
        self.output = []
        self.length = len(nums)

        '''
        0 is gonna be first, index variable keeping track of our iteration spot
        output will be our subset list we're making
        length will be the length of nums we need for our loop
        dont need to pass output or length cause they're global
        '''
        self.backtrack(0, [], nums)

        return self.output

    # need first, since we cant start at 0 = infinite backtracking
    # subset is the subset list we're making and length is self explanatory
    def backtrack(self, start, subset, nums):

        # add the current subset to the output each call
        self.output.append(subset[:])

        # loop through and find all paths
        for i in range(start, self.length):
            # append what we have right now
            subset.append(nums[i])
            # backtrack for all paths at this index
            self.backtrack(i + 1, subset, nums)
            # remove path once we explored it fully
            subset.pop()`,
};
