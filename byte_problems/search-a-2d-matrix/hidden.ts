// ================================ //
// Search a 2D Matrix: Hidden Tests //
// ================================ //

import type { HiddenProblem } from "../types.ts";

export const searchA2dMatrixHidden: HiddenProblem =
{
  functionName: "searchMatrix",
  language: "python",
  examples: [
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
  ],
  compare: "exact",
  paramNames: ["matrix", "target"],
  // Expected values come from checking every row for the target, not the
  // reference solution. Covers: the two published examples, a 1x1 matrix (hit
  // and miss), a single row and a single column, the first and last values, the
  // last value of one row and the first of the next, targets below and above
  // everything, a miss that falls between two rows, duplicate values inside a
  // row, negative numbers, the ±10⁴ limits, and a full 100x100 matrix.
  tests: [
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
    { args: [[[1]], 1], expected: true },
    { args: [[[1]], 2], expected: false },
    { args: [[[5]], -5], expected: false },
    { args: [[[1, 3]], 3], expected: true },
    { args: [[[1, 3]], 2], expected: false },
    { args: [[[1], [3]], 3], expected: true },
    { args: [[[1], [3]], 2], expected: false },
    { args: [[[1], [3], [5], [7]], 7], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 1], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 60], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 0], expected: false },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 61], expected: false },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 20], expected: true },
    { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 23], expected: true },
    { args: [[[1, 1, 2, 2], [3, 3, 4, 4]], 2], expected: true },
    { args: [[[1, 1, 2, 2], [3, 3, 4, 4]], 5], expected: false },
    { args: [[[-10000, -5], [0, 9999]], -10000], expected: true },
    { args: [[[-10000, -5], [0, 9999]], 9999], expected: true },
    { args: [[[-10000, -5], [0, 9999]], -4], expected: false },
    { args: [[[-9, -7, -5], [-3, -1, 0]], -1], expected: true },
    { args: [[[-9, -7, -5], [-3, -1, 0]], -4], expected: false },
    // 100x100 matrix of the even numbers from -10000 to 9998.
    { args: [Array.from({ length: 100 }, (_, r) => Array.from({ length: 100 }, (_, c) => (r * 100 + c) * 2 - 10000)), 0], expected: true },
    { args: [Array.from({ length: 100 }, (_, r) => Array.from({ length: 100 }, (_, c) => (r * 100 + c) * 2 - 10000)), -10000], expected: true },
    { args: [Array.from({ length: 100 }, (_, r) => Array.from({ length: 100 }, (_, c) => (r * 100 + c) * 2 - 10000)), 9998], expected: true },
    { args: [Array.from({ length: 100 }, (_, r) => Array.from({ length: 100 }, (_, c) => (r * 100 + c) * 2 - 10000)), 1], expected: false },
    { args: [Array.from({ length: 100 }, (_, r) => Array.from({ length: 100 }, (_, c) => (r * 100 + c) * 2 - 10000)), 10000], expected: false },
  ],
};
