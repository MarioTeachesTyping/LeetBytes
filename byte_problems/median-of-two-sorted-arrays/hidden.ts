// ========================================= //
// Median of Two Sorted Arrays: Hidden Tests //
// ========================================= //

import type { HiddenProblem } from "../types.ts";

export const medianOfTwoSortedArraysHidden: HiddenProblem =
{
  functionName: "findMedianSortedArrays",
  language: "python",
  examples: [
    { args: [[1, 3], [2]], expected: 2 },
    { args: [[1, 2], [3, 4]], expected: 2.5 },
  ],
  // Every median is a whole number or a half, both exact in floating point, and
  // Python treats 2 == 2.0 as equal, so exact comparison is safe here.
  compare: "exact",
  paramNames: ["nums1", "nums2"],
  // Expected values come from merging and sorting both arrays, not the reference
  // solution. Covers: the two published examples, either array empty (odd and
  // even totals), all-equal values, one array entirely before or after the
  // other, perfectly interleaved arrays, very different lengths, all-negative
  // values, the ±10⁶ limits, duplicates shared between the arrays, and two
  // 1000-element arrays at the maximum total length.
  tests: [
    { args: [[1, 3], [2]], expected: 2 },
    { args: [[1, 2], [3, 4]], expected: 2.5 },
    { args: [[], [1]], expected: 1 },
    { args: [[2], []], expected: 2 },
    { args: [[], [2, 3]], expected: 2.5 },
    { args: [[0, 0], [0, 0]], expected: 0 },
    { args: [[1, 1, 1], [1, 1, 1]], expected: 1 },
    { args: [[1, 2, 3], [4, 5, 6]], expected: 3.5 },
    { args: [[4, 5, 6], [1, 2, 3]], expected: 3.5 },
    { args: [[1, 3, 5, 7], [2, 4, 6, 8]], expected: 4.5 },
    { args: [[1], [2, 3, 4, 5, 6]], expected: 3.5 },
    { args: [[3], [-2, -1]], expected: -1 },
    { args: [[-5, -3, -1], [-2]], expected: -2.5 },
    { args: [[-1000000, 1000000], [0]], expected: 0 },
    { args: [[-1000000], [1000000]], expected: 0 },
    { args: [[1, 2], [1, 2]], expected: 1.5 },
    { args: [[2, 2, 2, 4], [1, 3, 3, 3]], expected: 2.5 },
    {
      args: [
        Array.from({ length: 1000 }, (_, i) => -1000000 + 2 * i),
        Array.from({ length: 1000 }, (_, i) => -999999 + 2 * i),
      ],
      expected: -999000.5,
    },
  ],
};
