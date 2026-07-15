// ================================================== //
// Kth Largest Element in an Array: Hidden Tests //
// ================================================== //

import type { HiddenProblem } from "../types.ts";

export const kthLargestElementInAnArrayHidden: HiddenProblem =
{
  functionName: "findKthLargest",
  language: "python",
  examples: [
    { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
    { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
  ],
  compare: "exact",
  paramNames: ["nums", "k"],
  // Covers: the two canonical examples, a single-element array (k=1), k=1 on a
  // larger array (the max), k equal to the array length (the min), duplicate
  // values where the kth largest lands on a repeated value, an already-sorted
  // array, a reverse-sorted array, and negative numbers.
  tests: [
    { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
    { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
    { args: [[1], 1], expected: 1 },
    { args: [[9, 3, 7, 1, 8], 1], expected: 9 },
    { args: [[9, 3, 7, 1, 8], 5], expected: 1 },
    { args: [[5, 5, 5, 5], 2], expected: 5 },
    { args: [[1, 2, 3, 4, 5], 3], expected: 3 },
    { args: [[5, 4, 3, 2, 1], 3], expected: 3 },
    { args: [[-1, -2, -3, -4], 2], expected: -2 },
    { args: [[2, 1], 2], expected: 1 },
  ],
};
