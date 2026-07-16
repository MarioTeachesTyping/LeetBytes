// ===================== //
// Contains Duplicate II //
// ===================== //

import type { SolutionEntry } from "../types.ts";

export const containsDuplicateIi: SolutionEntry =
{
  title: "219. Contains Duplicate II",

  link: "https://leetcode.com/problems/contains-duplicate-ii/",

  difficulty: "Easy",

  description: [
    "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` in the array such that `nums[i] == nums[j]` and `abs(i - j) <= k`.",
  ],

  examples: [
    {
      input: "`nums = [1,2,3,1], k = 3`",
      output: "`true`",
    },
    {
      input: "`nums = [1,0,1,1], k = 1`",
      output: "`true`",
    },
    {
      input: "`nums = [1,2,3,1,2,3], k = 2`",
      output: "`false`",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10⁵`.",
    "`-10⁹ <= nums[i] <= 10⁹`.",
    "`0 <= k <= 10⁵`.",
  ],

  topics: [
    "Array", "Hash Table", "Sliding Window",
  ],

  companies: [
    "Google", "Amazon",
  ],

  hints: [
    "Checking every pair of indices would work but is wasteful — what would you need to remember about a number's last position so you could answer 'have I seen this recently' in constant time?",
    "A hash map from value to its most recent index lets you instantly check both 'have I seen this number before' and 'how far away was it' — which built-in function would let you get both the index and value together as you loop?",
    "Iterate with `enumerate(nums)`; if `num` is already in your `last_seen` dict and `i - last_seen[num] <= k`, return True — otherwise update `last_seen[num] = i` and keep going.",
  ],

  starterCode: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:
        `,

  code: `class Solution:
    def containsNearbyDuplicate(self, nums: List[int], k: int) -> bool:

        '''
        instead of doing brute force which would work, using a dict would be best
        o(n) time and space, and o(1) look up time due to dict
        we would make a dict that holds the number as the key and the index as the value
        we would then enumerate through the list of nums to get both and then check
        if we seen any number in our dict then due the equation to return true
        '''
        last_seen = {}

        # we use enumerate to get index and number value at the same time
        for i, num in enumerate(nums):
            # if i is in last_seen (i = j) and i - last_seen then return true
            if num in last_seen and i - last_seen[num] <= k:
                return True

            # add the number to the dict as a key and it's index as it's value
            last_seen[num] = i

        return False`,
};
