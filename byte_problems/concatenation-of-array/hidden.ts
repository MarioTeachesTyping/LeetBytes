// ==================================== //
// Concatenation of Array: Hidden Tests //
// ==================================== //

import type { HiddenProblem } from "../types.ts";

export const concatenationOfArrayHidden: HiddenProblem =
{
  functionName: "getConcatenation",
  language: "python",
  examples: [
    { args: [[1, 2, 1]], expected: [1, 2, 1, 1, 2, 1] },
    { args: [[1, 3, 2, 1]], expected: [1, 3, 2, 1, 1, 3, 2, 1] },
  ],
  // Order matters: the second copy must come after the first, in the same order.
  compare: "exact",
  paramNames: ["nums"],
  // Covers: the two published examples, a single element, two elements in
  // descending order (catches a sorted answer), all equal values, the value
  // limits of 1 and 1000, a longer unsorted array, and the longest allowed array.
  tests: [
    { args: [[1, 2, 1]], expected: [1, 2, 1, 1, 2, 1] },
    { args: [[1, 3, 2, 1]], expected: [1, 3, 2, 1, 1, 3, 2, 1] },
    { args: [[1]], expected: [1, 1] },
    { args: [[1000]], expected: [1000, 1000] },
    { args: [[2, 1]], expected: [2, 1, 2, 1] },
    { args: [[7, 7, 7]], expected: [7, 7, 7, 7, 7, 7] },
    { args: [[1, 1000, 1]], expected: [1, 1000, 1, 1, 1000, 1] },
    { args: [[5, 9, 2, 8, 3, 6]], expected: [5, 9, 2, 8, 3, 6, 5, 9, 2, 8, 3, 6] },
    {
      args: [Array.from({ length: 1000 }, (_, i) => i + 1)],
      expected: [...Array.from({ length: 1000 }, (_, i) => i + 1), ...Array.from({ length: 1000 }, (_, i) => i + 1)],
    },
  ],
};
