// =========================== //
// Median of Two Sorted Arrays //
// =========================== //

import type { SolutionEntry } from "../types.ts";

export const medianOfTwoSortedArrays: SolutionEntry =
{
  title: "4. Median of Two Sorted Arrays",

  link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",

  difficulty: "Hard",

  description: [
    "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.",
    "The overall run time complexity should be `O(log (m+n))`.",
  ],

  examples: [
    {
      input: "`nums1 = [1,3], nums2 = [2]`",
      output: "`2.00000`",
      explanation: "merged array = `[1,2,3]` and median is `2`.",
    },
    {
      input: "`nums1 = [1,2], nums2 = [3,4]`",
      output: "`2.50000`",
      explanation: "merged array = `[1,2,3,4]` and median is `(2 + 3) / 2 = 2.5`.",
    },
  ],

  constraints: [
    "`nums1.length == m`",
    "`nums2.length == n`",
    "`0 <= m <= 1000`",
    "`0 <= n <= 1000`",
    "`1 <= m + n <= 2000`",
    "`-10⁶ <= nums1[i], nums2[i] <= 10⁶`",
  ],

  topics: [
    "Array", "Binary Search", "Divide and Conquer",
  ],

  companies: [
    "Google", "Amazon", "Meta", "Microsoft", "Bloomberg", "Rippling",
  ],

  hints: [
    "Merging the arrays would work but takes O(m + n). The median is just the element (or two elements) at a known position in the merged order, so think about finding the k-th smallest element without building the merged array.",
    "Look at the middle element of each array's remaining range. Comparing them, plus whether `k` falls before or after their combined position, tells you a whole half of one array that can't contain the answer.",
    "Write `findKth(k, left1, right1, left2, right2)`: if one range is empty, the answer is in the other one at `k` minus that empty range's start. Otherwise, if `mid1 + mid2 < k`, drop the left half of whichever array has the smaller middle; if not, drop the right half of whichever has the larger one. Call it once for an odd total, or twice for an even one and average the results.",
  ],

  starterCode: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        `,

  code: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        '''
        for this problem at first I thought 2 pointer would be best, but due to
        the elimination aspect, divide and conquer might be the best. find the
        total length of the 2 array's combined and then have another function
        figure out whether the left or right section should be eliminated.
        doing this will allow us to recursively check each time and get our
        median in the time complexity needed.
        '''
        total_length = len(nums1) + len(nums2)

        # target_index is the hypothetical mid for our merged array. t_l / 2.
        def findKth(target_index, left1, right1, left2, right2):
            # get the answer from the other array if one is done.
            if left1 > right1:
                return nums2[target_index - left1]
            if left2 > right2:
                return nums1[target_index - left2]

            mid1 = (left1 + right1) // 2
            mid2 = (left2 + right2) // 2

            mid_value1 = nums1[mid1]
            mid_value2 = nums2[mid2]

            # eliminate the left section or the right section.
            if mid1 + mid2 < target_index:
                if mid_value1 < mid_value2:
                    return findKth(target_index, mid1 + 1, right1, left2, right2)
                else:
                    return findKth(target_index, left1, right1, mid2 + 1, right2)
            else:
                if mid_value1 > mid_value2:
                    return findKth(target_index, left1, mid1 - 1, left2, right2)
                else:
                    return findKth(target_index, left1, right1, left2, mid2 - 1)

        # find the answer if odd length or if it's even length.
        if total_length % 2 == 1:
            return findKth(total_length // 2, 0, len(nums1) - 1, 0, len(nums2) - 1)

        left_middle = findKth(total_length // 2 - 1, 0, len(nums1) -1, 0, len(nums2) - 1)
        right_middle = findKth(total_length // 2, 0, len(nums1) -1, 0, len(nums2) - 1)

        return (left_middle + right_middle) / 2`,

  explanation: {
    intuition: [
      "The median is the value at a known position in the merged array: index `total // 2` for an odd total, or the average of indexes `total // 2 - 1` and `total // 2` for an even one. So the real task is finding the k-th smallest value (0-indexed) across both arrays without merging them.",
      "`findKth` keeps a shrinking range in each array and looks at the middle of each. Everything left of `mid1` and `mid2` adds up to `mid1 + mid2` elements. If that's less than `k`, the answer is further right, and the left half of the array with the smaller middle value can be dropped, since every value there sits below both middles and too early in the merged order. Otherwise the answer is at or before those middles, so the right half of the array with the larger middle value can be dropped.",
      "The ranges keep their real indexes into `nums1` and `nums2` instead of being re-sliced, which is why `k` never changes. Once one range is empty, every element dropped from it came before the answer, so the answer is directly in the other array at `k` minus where the empty range started.",
    ],
    algorithm: [
      "Let `total_length = len(nums1) + len(nums2)`.",
      "In `findKth(k, left1, right1, left2, right2)`, if `nums1`'s range is empty return `nums2[k - left1]`, and if `nums2`'s range is empty return `nums1[k - left2]`.",
      "Otherwise take `mid1` and `mid2`, the middles of each range.",
      "If `mid1 + mid2 < k`, drop the left half (through the middle) of the array with the smaller middle value.",
      "Otherwise, drop the right half (from the middle) of the array with the larger middle value, and recurse.",
      "For an odd `total_length`, return `findKth(total_length // 2, ...)`. For an even one, return the average of `findKth` at `total_length // 2 - 1` and `total_length // 2`.",
    ],
    complexity: {
      time: { bigO: "O(log m + log n)", reason: "Each call drops half of one array's remaining range, so there are at most about log m + log n calls, and the median takes one or two searches." },
      space: { bigO: "O(log m + log n)", reason: "The recursion goes as deep as the number of halvings." },
    },
  },
};
