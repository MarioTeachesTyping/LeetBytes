// ============================ //
// Longest Consecutive Sequence //
// ============================ //

import type { SolutionEntry } from "../types.ts";

export const longestConsecutiveSequence: SolutionEntry =
{
  title: "128. Longest Consecutive Sequence",

  link: "https://leetcode.com/problems/longest-consecutive-sequence/",

  difficulty: "Medium",

  description: [
    "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.",
    "You must write an algorithm that runs in `O(n)` time.",
  ],

  examples: [
    {
      input: "`nums = [100,4,200,1,3,2]`",
      output: "`4`",
      explanation: "The longest consecutive elements sequence is `[1, 2, 3, 4]`. Therefore its length is `4`.",
    },
    {
      input: "`nums = [0,3,7,2,5,8,4,6,0,1]`",
      output: "`9`",
    },
    {
      input: "`nums = [1,0,1,2]`",
      output: "`3`",
    },
  ],

  constraints: [
    "`0 <= nums.length <= 10⁵`",
    "`-10⁹ <= nums[i] <= 10⁹`",
  ],

  topics: [
    "Array", "Hash Table", "Union-Find",
  ],

  companies: [
    "Google", "Amazon", "Microsoft", "Bloomberg",
  ],

  hints: [
    "Sorting would make this easy, but sorting is O(n log n). What data structure lets you check whether a specific number exists in O(1)?",
    "With every number in a set, you could count upward from any number. To avoid recounting the same sequence over and over, only start counting from a number that begins a sequence. How can you tell a number is the start?",
    "Loop over the set. If `num - 1` isn't in it, `num` starts a sequence: keep checking `num + 1`, `num + 2`, … while they're in the set, counting as you go, and keep the longest count.",
  ],

  starterCode: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        `,

  code: `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        '''
        sorting and brute forcing would be easiest but to abide by
        the o(n) runtime, we can use something else. a set has
        o(1) look up due to it's hashing capabilities, and using
        that with 2 variables to check the max streak, and check if
        a number exists before our current one to start a streak.
        '''
        longest_sequence = 0
        nums_set = set(nums)

        for num in nums_set:
            if (num - 1) not in nums_set:
                current_num = num
                current_sequence = 1

                while current_num + 1 in nums_set:
                    current_num += 1
                    current_sequence += 1

                longest_sequence = max(longest_sequence, current_sequence)

        return longest_sequence`,

  explanation: {
    intuition: [
      "Sorting would line up consecutive numbers, but it costs O(n log n). A set gives O(1) lookups instead, so for any number we can ask whether `num + 1` exists and walk up a sequence one step at a time.",
      "Walking up from every number would recount the same sequence many times. The trick is to only start from a number whose `num - 1` isn't in the set, since that number has to be the start of its sequence. Every other number gets skipped right away.",
      "Building the set also removes duplicates, so a repeated number like the `0` in Example 2 doesn't start the same sequence twice or get counted twice.",
    ],
    algorithm: [
      "Put every number into `nums_set` and set `longest_sequence` to `0`.",
      "For each `num` in the set, skip it if `num - 1` is also in the set.",
      "Otherwise, count upward from `num` while `current_num + 1` is in the set.",
      "Update `longest_sequence` with that count.",
      "Return `longest_sequence`, which stays `0` for an empty array.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Building the set is O(n). The inner `while` only runs from the start of a sequence, so every number is stepped over at most once across all sequences, plus one O(1) check per number." },
      space: { bigO: "O(n)", reason: "The set holds up to n distinct numbers." },
    },
  },
};
