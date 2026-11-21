// =============================== //
// Set Matrix Zeroes: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const setMatrixZeroesHidden: HiddenProblem =
{
  functionName: "setZeroes",
  language: "python",
  // The method returns nothing and edits `matrix` (argument 0) in place, so
  // the judge grades that argument's final state, not the return value.
  inPlaceArg: 0,
  examples: [
    { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
    { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
  ],
  compare: "exact",
  paramNames: ["matrix"],
  // Covers: the two canonical examples, 1x1 matrices with and without a zero,
  // a single row and a single column, zeros in the top-left and bottom-right
  // corners, several zeros sharing a row, an all-zero matrix, the "don't let
  // freshly written zeros spread" trap (a zeroed row must not trigger more),
  // a tall non-square matrix, and 32-bit extreme values.
  tests: [
    { args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
    { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    { args: [[[1]]], expected: [[1]] },
    { args: [[[0]]], expected: [[0]] },
    { args: [[[1, 2, 3]]], expected: [[1, 2, 3]] },
    { args: [[[1, 0, 3]]], expected: [[0, 0, 0]] },
    { args: [[[1], [0], [3]]], expected: [[0], [0], [0]] },
    { args: [[[0, 1], [1, 1]]], expected: [[0, 0], [0, 1]] },
    { args: [[[1, 1], [1, 0]]], expected: [[1, 0], [0, 0]] },
    { args: [[[1, 0, 0], [1, 1, 1], [1, 1, 1]]], expected: [[0, 0, 0], [1, 0, 0], [1, 0, 0]] },
    { args: [[[0, 0], [0, 0]]], expected: [[0, 0], [0, 0]] },
    { args: [[[1, 2, 3], [4, 0, 6], [7, 8, 0]]], expected: [[1, 0, 0], [0, 0, 0], [0, 0, 0]] },
    { args: [[[1, 1], [1, 1], [1, 0], [1, 1]]], expected: [[1, 0], [1, 0], [0, 0], [1, 0]] },
    { args: [[[-2147483648, 0], [2147483647, 5]]], expected: [[0, 0], [2147483647, 0]] },
  ],
};
