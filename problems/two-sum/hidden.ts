// ===================== //
// Two Sum: Hidden Tests //
// ===================== //

import type { HiddenProblem } from "../types.ts";

export const twoSumHidden: HiddenProblem =
{
  functionName: "twoSum",
  language: "python",
  examples: [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { args: [[3, 2, 4], 6], expected: [1, 2] },
    { args: [[3, 3], 6], expected: [0, 1] },
  ],
  // LeetCode accepts the two indices in either order, so the pair is graded
  // order-independently rather than as an exact match.
  compare: "unordered",
  paramNames: ["nums", "target"],
  // Each input has exactly one valid pair (LeetCode's guarantee). Covers:
  // adjacent answer, answer not at index 0, duplicate values, all-negatives,
  // a zero-sum pair including a 0, and answers buried mid-array.
  tests: [
    { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { args: [[3, 2, 4], 6], expected: [1, 2] },
    { args: [[3, 3], 6], expected: [0, 1] },
    { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
    { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    { args: [[1, 5, 8, 3, 9, 2], 7], expected: [1, 5] },
    { args: [[2, 5, 5, 11], 10], expected: [1, 2] },
    { args: [[-10, 7, 19, 15], 9], expected: [0, 2] },
    { args: [[5, 75, 25], 100], expected: [1, 2] },
  ],
};
