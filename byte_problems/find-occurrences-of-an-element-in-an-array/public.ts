// =============================================== //
// Find Occurrences of an Element in an Array //
// =============================================== //

import type { SolutionEntry } from "../types.ts";

export const findOccurrencesOfAnElementInAnArray: SolutionEntry =
{
  title: "3159. Find Occurrences of an Element in an Array",

  link: "https://leetcode.com/problems/find-occurrences-of-an-element-in-an-array/",

  difficulty: "Medium",

  description: [
    "You are given an integer array `nums`, an integer array `queries`, and an integer `x`.",
    "For each `queries[i]`, you need to find the index of the `queries[i]th` occurrence of `x` in the `nums` array. If there are fewer than `queries[i]` occurrences of `x`, the answer should be -1 for that query.",
    "Return an integer array `answer` containing the answers to all queries.",
  ],

  examples: [
    {
      input: "`nums = [1,3,1,7], queries = [1,3,2,4], x = 1`",
      output: "`[0,-1,2,-1]`",
      explanation: "For the 1st query, the first occurrence of 1 is at index 0. For the 2nd query, there are only two occurrences of 1 in `nums`, so the answer is -1. For the 3rd query, the second occurrence of 1 is at index 2. For the 4th query, there are only two occurrences of 1 in `nums`, so the answer is -1.",
    },
    {
      input: "`nums = [1,2,3], queries = [10], x = 5`",
      output: "`[-1]`",
      explanation: "For the 1st query, 5 doesn't exist in `nums`, so the answer is -1.",
    },
  ],

  constraints: [
    "`1 <= nums.length, queries.length <= 10⁵`",
    "`1 <= queries[i] <= 10⁵`",
    "`1 <= nums[i], x <= 10⁴`",
  ],

  topics: [
    "Array", "Hash Table",
  ],

  companies: [
    "Amazon", "JPMorgan Chase", "IBM",
  ],

  hints: [
    "Answering each query by rescanning `nums` from the start is wasteful when there can be up to 10⁵ queries — think about what you could work out once, up front, and reuse for every query.",
    "Only the positions where `nums[i] == x` matter. If you record those positions in the order you meet them, the k-th occurrence is simply the k-th thing you recorded.",
    "Walk `nums` once, storing each index of `x` against its occurrence number (a dict, or just a list). Then answer each query with a lookup, returning -1 when that occurrence number was never recorded.",
  ],

  starterCode: `class Solution:
    def occurrencesOfElement(self, nums: List[int], queries: List[int], x: int) -> List[int]:
        `,

  code: `class Solution:
    def occurrencesOfElement(self, nums: List[int], queries: List[int], x: int) -> List[int]:
        '''
        we check nums to see how many times x appears in it. we use queries to see where
        x occurs in the nums array. so for [1,2,2,4] and [1,6] x=1 we would get [0, -1]
        because 1 appears occurs one time at 0 index and 1 doesnt appear a 6th time in nums.
        we can use a dict for this since our key can be the query num (1,2,3,4) and the
        value will be the index it appears at in nums. we can go through nums first and find
        all its occurrences. afterwards check if theres none and make the answer -1 but if
        there is some, go through queries and replace its occurence number with the dict
        value if it exists.
        '''
        occurrence_to_index = {}
        occurrence_count = 1

        for i in range(len(nums)):
            if nums[i] == x:
                occurrence_to_index[occurrence_count] = i
                occurrence_count += 1

        if not occurrence_to_index:
            return [-1] * len(queries)

        for j in range(len(queries)):
            if queries[j] in occurrence_to_index:
                queries[j] = occurrence_to_index[queries[j]]
            else:
                queries[j] = -1

        return queries`,

  explanation: {
    intuition: [
      "Rescanning `nums` for every query would be slow with up to 10⁵ queries. Instead, one pass through `nums` records where each occurrence of `x` is: `occurrence_to_index` maps the occurrence number (1st, 2nd, 3rd, …) to its index.",
      "After that, every query is a single dict lookup. If that occurrence was recorded, the answer is its index. Otherwise there aren't that many occurrences, and the answer is `-1`. If `x` never appears at all, every answer is `-1`, so that case returns early.",
    ],
    algorithm: [
      "Walk through `nums`. Each time `nums[i] == x`, store `i` under the current `occurrence_count` and add 1 to the count.",
      "If nothing was stored, return `-1` for every query.",
      "For each query, replace it with its recorded index, or `-1` if that occurrence doesn't exist.",
      "Return `queries`, which now holds the answers.",
    ],
    complexity: {
      time: { bigO: "O(n + q)", reason: "Where n is the length of `nums` and q is the number of queries: one pass over each, with O(1) dict lookups." },
      space: { bigO: "O(n)", reason: "The dict can hold an entry for every index in `nums`. The answers reuse the `queries` list instead of making a new one." },
    },
  },
};
