// ================================ //
// Majority Element: Hidden Tests //
// ================================ //

import type { HiddenProblem } from "../types.ts";

export const majorityElementHidden: HiddenProblem =
{
  functionName: "majorityElement",
  language: "python",
  examples: [
    { args: [[3, 2, 3]], expected: 3 },
    { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
  ],
  compare: "exact",
  paramNames: ["nums"],
  // Covers: the classic examples, a single-element array, an array with the
  // majority element first vs. last (catches an off-by-reset bug in Boyer-Moore),
  // negative numbers, an exact-majority-by-one case, and a majority element that
  // is briefly outvoted mid-array before recovering.
  tests: [
    { args: [[3, 2, 3]], expected: 3 },
    { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
    { args: [[1]], expected: 1 },
    { args: [[1, 1, 1, 2, 2]], expected: 1 },
    { args: [[2, 2, 1, 1, 1]], expected: 1 },
    { args: [[-1, -1, -1, 2, 2]], expected: -1 },
    { args: [[5, 5, 5, 5, 5, 1, 2, 3]], expected: 5 },
    { args: [[6, 5, 5]], expected: 5 },
    { args: [[1, 2, 1, 3, 1, 4, 1]], expected: 1 },
    { args: [[0, 0, 0, 0]], expected: 0 },
  ],
};
