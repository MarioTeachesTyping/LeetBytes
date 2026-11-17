// =========================== //
// Binary Search: Hidden Tests //
// =========================== //

import type { HiddenProblem } from "../types.ts";

export const binarySearchHidden: HiddenProblem =
{
  functionName: "search",
  language: "python",
  examples: [
    { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
  ],
  compare: "exact",
  paramNames: ["nums", "target"],
  // Expected values come from a plain list lookup, not the reference solution.
  // Covers: the two published examples, a single element (found and not found),
  // two elements (either one, and a miss between them), the first and last
  // index, targets below and above every element, a miss between elements,
  // negative numbers, the ±9999 limits, an even and an odd length, and the
  // longest allowed array (10,000 elements) searched for its first, middle and
  // last elements and for values just outside it.
  tests: [
    { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { args: [[5], 5], expected: 0 },
    { args: [[5], -5], expected: -1 },
    { args: [[5], 9999], expected: -1 },
    { args: [[2, 5], 2], expected: 0 },
    { args: [[2, 5], 5], expected: 1 },
    { args: [[2, 5], 3], expected: -1 },
    { args: [[1, 3, 5, 7, 9], 1], expected: 0 },
    { args: [[1, 3, 5, 7, 9], 9], expected: 4 },
    { args: [[1, 3, 5, 7, 9], -100], expected: -1 },
    { args: [[1, 3, 5, 7, 9], 100], expected: -1 },
    { args: [[1, 3, 5, 7, 9], 4], expected: -1 },
    { args: [[-9999, -5, 0, 12, 9999], -9999], expected: 0 },
    { args: [[-9999, -5, 0, 12, 9999], 9999], expected: 4 },
    { args: [[-9999, -5, 0, 12, 9999], 0], expected: 2 },
    { args: [[-10, -8, -6, -4, -2, 0], -4], expected: 3 },
    { args: [[-10, -8, -6, -4, -2, 0], -3], expected: -1 },
    { args: [Array.from({ length: 10000 }, (_, i) => i - 5000), -5000], expected: 0 },
    { args: [Array.from({ length: 10000 }, (_, i) => i - 5000), 1234], expected: 6234 },
    { args: [Array.from({ length: 10000 }, (_, i) => i - 5000), 4999], expected: 9999 },
    { args: [Array.from({ length: 10000 }, (_, i) => i - 5000), 5000], expected: -1 },
    { args: [Array.from({ length: 10000 }, (_, i) => i - 5000), -5001], expected: -1 },
  ],
};
