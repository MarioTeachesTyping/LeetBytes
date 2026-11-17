// ============= //
// Binary Search //
// ============= //

import type { SolutionEntry } from "../types.ts";

export const binarySearch: SolutionEntry =
{
  title: "704. Binary Search",

  link: "https://leetcode.com/problems/binary-search/",

  difficulty: "Easy",

  description: [
    "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    "You must write an algorithm with `O(log n)` runtime complexity.",
  ],

  examples: [
    {
      input: "`nums = [-1,0,3,5,9,12], target = 9`",
      output: "`4`",
      explanation: "`9` exists in `nums` and its index is `4`.",
    },
    {
      input: "`nums = [-1,0,3,5,9,12], target = 2`",
      output: "`-1`",
      explanation: "`2` does not exist in `nums` so return `-1`.",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10⁴`",
    "`-10⁴ < nums[i], target < 10⁴`",
    "All the integers in `nums` are unique.",
    "`nums` is sorted in ascending order.",
  ],

  topics: [
    "Array", "Binary Search",
  ],

  companies: [
    "Amazon", "Google", "Meta", "Microsoft", "Bloomberg",
  ],

  hints: [
    "The array is already sorted, so comparing your target to a single element tells you which side of it the target can be on. How could you use that to throw away a big chunk of the array at once?",
    "Keep two boundaries, `l` and `r`, around the part of the array where the target could still be, and look at the middle element each time. If it's too small, what does that say about everything to its left?",
    "Loop while `l <= r` with `mid = (l + r) // 2`. Return `mid` on a match, move `l` to `mid + 1` if `nums[mid] < target`, or move `r` to `mid - 1` if it's bigger. If the loop ends, return `-1`.",
  ],

  starterCode: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,

  code: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        '''
        with binary search the hint is usually the array we
        are looking into is already sorted and/or if one half
        can be ruled out due to being smaller or bigger than
        our mid, then you can use that as your searching algorithm.
        '''
        l = 0
        r = len(nums) - 1

        while l <= r:
            mid = (l + r) // 2

            if nums[mid] < target:
                l = mid + 1
            elif nums[mid] > target:
                r = mid - 1
            else:
                return mid

        return -1`,

  explanation: {
    intuition: [
      "Because `nums` is sorted, looking at one element tells us a lot. If the middle element is smaller than `target`, then everything to its left is smaller too, so the target can only be on the right. If it's bigger, the target can only be on the left. Either way, half of the remaining array is ruled out with a single comparison.",
      "`l` and `r` mark the part of the array where the target could still be. Each step looks at the middle, either returns it or moves one boundary just past it (`mid + 1` or `mid - 1`), and repeats on the half that's left. The boundaries move past `mid` because `mid` itself has already been checked.",
      "The loop uses `l <= r` so that a range with exactly one element left still gets checked. Once `l` passes `r`, nothing is left to look at, so the target isn't in the array and we return `-1`.",
    ],
    algorithm: [
      "Set `l = 0` and `r = len(nums) - 1`.",
      "While `l <= r`, take `mid = (l + r) // 2`.",
      "If `nums[mid] < target`, set `l = mid + 1`. If `nums[mid] > target`, set `r = mid - 1`.",
      "If `nums[mid] == target`, return `mid`.",
      "If the loop ends without a match, return `-1`.",
    ],
    complexity: {
      time: { bigO: "O(log n)", reason: "Each step cuts the remaining range in half, so there are at most about log₂ n steps." },
      space: { bigO: "O(1)", reason: "Only the `l`, `r` and `mid` variables are kept, no matter how big the array is." },
    },
  },
};
