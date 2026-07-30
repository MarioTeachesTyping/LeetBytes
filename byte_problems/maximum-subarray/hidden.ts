// ============================== //
// Maximum Subarray: Hidden Tests //
// ============================== //

import type { HiddenProblem } from "../types.ts";

export const maximumSubarrayHidden: HiddenProblem =
{
  functionName: "maxSubArray",
  language: "python",
  examples: [
    { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
    { args: [[1]], expected: 1 },
    { args: [[5, 4, -1, 7, 8]], expected: 23 },
  ],
  compare: "exact",
  paramNames: ["nums"],
  // Covers: the classic mixed array, single element, no-negatives, all-negatives
  // (answer is the largest single element, not 0 — catches a common bug), a
  // two-negative case, and arrays containing zeros.
  tests: [
    { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
    { args: [[1]], expected: 1 },
    { args: [[5, 4, -1, 7, 8]], expected: 23 },
    { args: [[-1]], expected: -1 },
    { args: [[-3, -1, -2]], expected: -1 },
    { args: [[-2, -1]], expected: -1 },
    { args: [[8]], expected: 8 },
    { args: [[1, 2, 3, 4, 5]], expected: 15 },
    { args: [[5, -9, 6, -2, 3]], expected: 7 },
    { args: [[-2, -3, 4, -1, -2, 1, 5, -3]], expected: 7 },
    { args: [[0, 0, 0]], expected: 0 },
    { args: [[-1, 0, -2]], expected: 0 },
  ],
};
