// ==== //
// 3Sum //
// ==== //

import type { SolutionEntry } from "../types.ts";

export const threeSum: SolutionEntry =
{
  title: "15. 3Sum",

  link: "https://leetcode.com/problems/3sum/",

  difficulty: "Medium",

  description: [
    "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    "Notice that the solution set must not contain duplicate triplets.",
  ],

  examples: [
    {
      input: "`nums = [-1,0,1,2,-1,-4]`",
      output: "`[[-1,-1,2],[-1,0,1]]`",
      explanation: "`nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0`. `nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0`. `nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0`. The distinct triplets are `[-1,0,1]` and `[-1,-1,2]`. Notice that the order of the output and the order of the triplets does not matter.",
    },
    {
      input: "`nums = [0,1,1]`",
      output: "`[]`",
      explanation: "The only possible triplet does not sum up to `0`.",
    },
    {
      input: "`nums = [0,0,0]`",
      output: "`[[0,0,0]]`",
      explanation: "The only possible triplet sums up to `0`.",
    },
  ],

  constraints: [
    "`3 <= nums.length <= 3000`",
    "`-10⁵ <= nums[i] <= 10⁵`",
  ],

  topics: [
    "Array", "Two Pointers", "Sorting",
  ],

  companies: [
    "Google", "Amazon", "Meta", "Microsoft", "Bloomberg",
  ],

  hints: [
    "If you fix one number, the other two just need to add up to its negative. That's a problem you may have solved before, so how fast can you solve it when the array is sorted?",
    "Sorting also makes duplicates sit right next to each other. If the number you're fixing is the same as the one before it, every triplet it could make has already been found.",
    "Sort, then for each `i` (stopping once `nums[i] > 0`) run two pointers from `i + 1` and the end: move `low` right when the sum is too small, `high` left when it's too big, and after a match step both inward and skip any repeated `nums[low]`.",
  ],

  starterCode: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        `,

  code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        '''
        first thing that comes to mind is using 2 pointer. we stay on
        one index and use 2 pointer right after it and at the end of
        the array to find our triplet. to make finding duplicates
        easier, we can sort the array and then use another function
        to figure out how to move our 2 pointers properly.
        '''
        triplets = []
        nums.sort()

        for i in range(len(nums)):
            # if first index is greater than 0, there is no triplet.
            if nums[i] > 0:
                break

            # we don't need to check our next index, if it's the same num.
            if i == 0 or nums[i - 1] != nums[i]:
                self.twoSum(triplets, i, nums)

        return triplets

    def twoSum(self, triplets: List[List[int]], i: int, nums: List[int]):
        low = i + 1
        high = len(nums) - 1

        while low < high:
            if nums[i] + nums[low] + nums[high] < 0:
                low += 1
            elif nums[i] + nums[low] + nums[high] > 0:
                high -= 1
            else:
                triplets.append([nums[i], nums[low], nums[high]])
                low += 1
                high -= 1

                # skip duplicate values after finding a triplet.
                while low < high and nums[low] == nums[low - 1]:
                    low += 1`,

  explanation: {
    intuition: [
      "Fixing one number `nums[i]` turns the problem into Two Sum: find two other numbers that add up to `-nums[i]`. Once the array is sorted, that can be done with two pointers instead of a hash map, one starting just after `i` and one at the end.",
      "If the sum is too small, moving `low` right makes it bigger. If it's too big, moving `high` left makes it smaller. Since the array is sorted, each step rules out a value that can't be part of an answer, so one pass of the pointers finds every pair for that `i`.",
      "Sorting also handles duplicates. Equal values sit next to each other, so we skip an `i` that matches the number before it, and after a match we move `low` past any repeats. Since `high` only moves inward until it meets `low`, skipping repeats on just the `low` side is enough to keep every triplet unique. And once `nums[i] > 0`, every number after it is positive too, so nothing can sum to `0` and we stop.",
    ],
    algorithm: [
      "Sort `nums` and start an empty `triplets` list.",
      "For each index `i`, stop if `nums[i] > 0`, and skip it if it equals `nums[i - 1]`.",
      "Otherwise, set `low = i + 1` and `high = len(nums) - 1`, and while `low < high` compare the sum of the three values to `0`.",
      "Move `low` right if the sum is below `0`, or `high` left if it's above `0`.",
      "On a match, record the triplet, move both pointers inward, and keep moving `low` while it repeats the previous value.",
      "Return `triplets`.",
    ],
    complexity: {
      time: { bigO: "O(n²)", reason: "Sorting is O(n log n), and for each of the n fixed values the two pointers scan the rest of the array once in O(n)." },
      space: { bigO: "O(n)", reason: "Python's sort can use up to O(n) extra space (not counting the output)." },
    },
  },
};
