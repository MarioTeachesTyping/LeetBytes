import { SolutionEntry } from "../solutions";

export const maximumSubarray: SolutionEntry = {
  title: "53. Maximum Subarray",
  link: "https://leetcode.com/problems/maximum-subarray/",
  difficulty: "Medium",
  description: [
    "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "Subarray- A subarray is a contiguous non-empty sequence of elements within an array.",
  ],
  examples: [
    {
      input: "`nums = [-2,1,-3,4,-1,2,1,-5,4]`",
      output: "`6`",
      explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
    },
    {
      input: "`nums = [1]`",
      output: "`1`",
      explanation: "The subarray [1] has the largest sum 1.",
    },
    {
      input: "`nums = [5,4,-1,7,8]`",
      output: "`23`",
      explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
    },
  ],
  constraints: [
    "`1 <= nums.length <= 10^5`",
    "`-10^4 <= nums[i] <= 10^4`",
  ],
  topics: [
    "Array", "Divide and Conquer", "Dynamic Programming",
  ],
  companies: [
    "Microsoft", "Amazon", "Apple", "Google",
  ],
  code: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        '''
        dp question, oooooo scaryyyy.
        we can have a subarray that checks for the max and the current
        current will see if it can extend the subarray for higher sum or trash it
        max will keep the max sum subarray and we will return that
        max() is gonna do all the work.
        '''
        curr_subarray = nums[0]
        max_subarray = nums[0]

        # both subarrays already start at 0 so the loop will continue from 1
        for num in nums[1:]:
            # curr_subarray will take the current number, or extend from prev
            curr_subarray = max(num, curr_subarray + num)

            # max_subarray will take the best sum from whatever current is
            max_subarray = max(max_subarray, curr_subarray)

        return max_subarray`,
  stats: {
    runtime: { label: "Runtime", value: "37 ms", beats: "68.42%" },
    memory: { label: "Memory", value: "31.55 MB", beats: "39.09%" },
  },
};