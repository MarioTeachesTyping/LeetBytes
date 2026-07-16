// ================== //
// Contains Duplicate //
// ================== //

import type { SolutionEntry } from "../types.ts";

export const containsDuplicate: SolutionEntry =
{
  title: "217. Contains Duplicate",

  link: "https://leetcode.com/problems/contains-duplicate/",

  difficulty: "Easy",

  description: [
    "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
  ],

  examples: [
    {
      input: "`nums = [1,2,3,1]`",
      output: "`true`",
      explanation: "The element 1 occurs at the indices 0 and 3.",
    },
    {
      input: "`nums = [1,2,3,4]`",
      output: "`false`",
      explanation: "All elements are distinct.",
    },
    {
      input: "`nums = [1,1,1,3,3,4,3,2,4,2]`",
      output: "`true`",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10⁵`.",
    "`-10⁹ <= nums[i] <= 10⁹`.",
  ],

  topics: [
    "Array", "Hash Table", "Sorting",
  ],

  companies: [
    "Google", "Amazon", "Meta", "Microsoft", "Bloomberg",
  ],

  hints: [
    "What data structure gives you constant-time membership checks and would let you tell instantly whether you've already come across a value?",
    "As you walk through the array, you only need to remember every value you've already seen — a lookup structure that discards duplicates automatically would fit nicely here.",
    "Keep a `set()`; for each number, check if it's already in the set (return True if so), otherwise add it and continue — return False once the loop finishes.",
  ],

  starterCode: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        `,

  code: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:

        '''
        return true if duplicate, and return false if not
        first instinct is using a set and return true if something is in it already
        '''
        values = set()

        # loop through nums and add each number to our set
        for i in range(len(nums)):

            # check if value is in our set
            if nums[i] in values:
                return True

            values.add(nums[i])

        return False`,
};
