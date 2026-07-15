// =============================== //
// Contains Duplicate: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const containsDuplicateHidden: HiddenProblem =
{
  functionName: "containsDuplicate",
  language: "python",
  examples: [
    { args: [[1, 2, 3, 1]], expected: true },
    { args: [[1, 2, 3, 4]], expected: false },
    { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
  ],
  compare: "exact",
  paramNames: ["nums"],
  // Covers: the three canonical examples, a single element (trivially no
  // duplicate), a duplicate at the very end (catches an early-return-only-for-
  // first-pair bug on solutions that don't scan the whole array), negative
  // numbers, and a duplicate involving large values near the constraint bounds.
  tests: [
    { args: [[1, 2, 3, 1]], expected: true },
    { args: [[1, 2, 3, 4]], expected: false },
    { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    { args: [[1]], expected: false },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 9]], expected: true },
    { args: [[-1, -2, -3, -2]], expected: true },
    { args: [[-1, -2, -3, -4]], expected: false },
    { args: [[0, 0]], expected: true },
    { args: [[1000000000, -1000000000, 1000000000]], expected: true },
  ],
};
