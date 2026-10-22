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

  hints: [
    "Since you need every possible subset, not just one valid answer, what technique lets you explore every combination of 'include this element or don't' and backs out of dead ends?",
    "At every point in your recursion, the subset built so far is already a valid answer on its own — when should you be adding it to your results list?",
    "Recurse with a `start` index so you never reconsider earlier elements: at each call, append the current subset to your output, then loop from `start` to the end, appending `nums[i]`, recursing with `i + 1`, and popping it back off afterward.",
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

  explanation: {
    intuition: [
      "Every subset can be built by picking elements in increasing index order. Backtracking does this from a `start` index: it records the current subset, then tries adding each element from `start` onward, recursing to keep building, and removing it again afterward to try the next option.",
      "Every partial subset along the way is a valid answer, including the empty one, which is why it's recorded at the top of every call. Recursing with `i + 1` means an element is never reused and the same subset never shows up in a different order (like `[1, 2]` and `[2, 1]`). The subset is saved as a copy, `subset[:]`, because the original list keeps changing as the search goes on.",
    ],
    algorithm: [
      "Call `backtrack(0, [], nums)`.",
      "In each call, append a copy of `subset` to `self.output`.",
      "For each index `i` from `start` to the end, append `nums[i]`, recurse with `i + 1`, then pop `nums[i]` off.",
      "Return `self.output` once the first call finishes.",
    ],
    complexity: {
      time: { bigO: "O(n · 2ⁿ)", reason: "There are 2ⁿ subsets, and copying each one into the output takes up to O(n)." },
      space: { bigO: "O(n)", reason: "The recursion and the current `subset` go at most n deep (not counting the output)." },
    },
  },
};
