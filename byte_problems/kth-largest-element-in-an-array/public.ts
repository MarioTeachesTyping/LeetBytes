// ===================================== //
// Kth Largest Element in an Array //
// ===================================== //

import type { SolutionEntry } from "../types.ts";

export const kthLargestElementInAnArray: SolutionEntry =
{
  title: "215. Kth Largest Element in an Array",

  link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",

  difficulty: "Medium",

  description: [
    "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.",
    "Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.",
    "Can you solve it without sorting?",
  ],

  examples: [
    {
      input: "`nums = [3,2,1,5,6,4], k = 2`",
      output: "`5`",
    },
    {
      input: "`nums = [3,2,3,1,2,4,5,5,6], k = 4`",
      output: "`4`",
    },
  ],

  constraints: [
    "`1 <= k <= nums.length <= 10⁵`.",
    "`-10⁴ <= nums[i] <= 10⁴`.",
  ],

  topics: [
    "Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect",
  ],

  companies: [
    "Google", "Meta", "Amazon", "Spotify", "Bloomberg",
  ],

  hints: [
    "The problem hints that sorting the whole array might be overkill — since you only care about the top k values, what data structure is built to efficiently track 'the smallest of the largest values seen so far'?",
    "If you maintain a heap that never grows past size k, what would popping its smallest element represent, and what would be left in the heap once you're done?",
    "Push every number onto a min-heap, and whenever the heap's size exceeds `k`, pop the smallest — by the end the heap holds exactly the k largest values, and `heap[0]` is the kth largest.",
  ],

  starterCode: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        `,

  code: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:

        '''
        first instinct whenever it's find the kth largest/smallest
        of something it is always gonna use a heap
        [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
        [1, 2, 2, 3, 3, 4, 5, 5, 6], k = 4
        output is 4 cause it is 4th to last index in the sorted ver of the array
        quick sort or something else is probably faster but pythons heap
        functions make this easier (python heap is min-heap by default)
        '''
        heap = []

        # iterate through the numbers in nums and push into our heap
        for num in nums:

            heapq.heappush(heap, num)

            # if the length of our heap is longer than k, pop the smallest element
            if len(heap) > k:
                heapq.heappop(heap)

        # by this point, the heap only has k elements and the 1st one is our answer
        return heap[0]`,

  explanation: {
    intuition: [
      "Keep a min-heap that holds the k largest numbers seen so far. Python's `heapq` is a min-heap, so the smallest of those k numbers is always at `heap[0]`.",
      "Each number gets pushed in. If the heap grows past k, the smallest one is popped, since it can't be among the k largest anymore. After every number has gone through, the heap holds exactly the k largest, and the smallest of those, `heap[0]`, is the kth largest overall.",
    ],
    algorithm: [
      "Start with an empty `heap`.",
      "For each number, push it onto the heap with `heapq.heappush`.",
      "If the heap now has more than `k` items, pop the smallest with `heapq.heappop`.",
      "Return `heap[0]`.",
    ],
    complexity: {
      time: { bigO: "O(n log k)", reason: "Each of the n numbers is pushed (and maybe popped) on a heap that never grows past k + 1 items, so each operation is O(log k)." },
      space: { bigO: "O(k)", reason: "The heap holds at most k + 1 numbers." },
    },
  },
};
