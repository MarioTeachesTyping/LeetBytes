// ================= //
// Majority Element //
// ================= //

import type { SolutionEntry } from "../types.ts";

export const majorityElement: SolutionEntry =
{
  title: "169. Majority Element",

  link: "https://leetcode.com/problems/majority-element/",

  difficulty: "Easy",

  description: [
    "Given an array `nums` of size `n`, return the majority element.",
    "The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
  ],

  examples: [
    {
      input: "`nums = [3,2,3]`",
      output: "`3`",
    },
    {
      input: "`nums = [2,2,1,1,1,2,2]`",
      output: "`2`",
    },
  ],

  constraints: [
    "`n == nums.length`",
    "`1 <= n <= 5 * 10⁴`",
    "`-10⁹ <= nums[i] <= 10⁹`",
    "The input is generated such that a majority element will exist in the array.",
  ],

  topics: [
    "Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting",
  ],

  companies: [
    "Google", "Amazon", "Bloomberg", "Meta", "Microsoft",
  ],

  hints: [
    "Since the majority element appears more than half the time, is there a way to track a 'current leading candidate' as you scan, without needing to count every value with a hash map?",
    "Imagine each occurrence of your candidate as a point in its favor, and every other value as a point against it — what should happen to your candidate if that score ever hits zero?",
    "Track a `candidate` and a `count` starting at 0; when `count` is 0, set `candidate` to the current number, then increment `count` if the current number matches `candidate`, otherwise decrement it — `candidate` at the end is your answer.",
  ],

  starterCode: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        `,

  code: `class Solution:
    def majorityElement(self, nums: List[int]) -> int:

        '''
        bro this the only question to do it but boyere voting algo is easy for this
        we need a majority variable to keep track of which elemenent has the most
        a balance variable for keeping count of whether the majority element has more
        '''
        majority = 0
        balance = 0

        # loop through the list of numbers
        for num in nums:
            # if our balance hits 0, this means we have a majority element new or not
            if balance == 0:
                # make our majority element the number in the list during this iter
                majority = num

            # increment our balance if we get same number, decrement if different
            balance += 1 if majority == num else -1

        return majority`,
};
