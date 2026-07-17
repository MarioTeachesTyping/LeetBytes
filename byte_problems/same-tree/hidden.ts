// ======================= //
// Same Tree: Hidden Tests //
// ======================= //

import type { HiddenProblem } from "../types.ts";

export const sameTreeHidden: HiddenProblem =
{
  functionName: "isSameTree",
  language: "python",
  argTypes: ["TreeNode", "TreeNode"],
  examples: [
    { args: [[1, 2, 3], [1, 2, 3]], expected: true },
    { args: [[1, 2], [1, null, 2]], expected: false },
    { args: [[1, 2, 1], [1, 1, 2]], expected: false },
  ],
  compare: "exact",
  paramNames: ["p", "q"],
  // Covers: the three canonical examples, both trees empty, one empty and one
  // not, single matching and mismatched nodes, two trees built from the same
  // values but a different left/right shape (catches value-only comparisons
  // that ignore structure), negative values, and a full 7-node tree.
  tests: [
    { args: [[1, 2, 3], [1, 2, 3]], expected: true },
    { args: [[1, 2], [1, null, 2]], expected: false },
    { args: [[1, 2, 1], [1, 1, 2]], expected: false },
    { args: [[], []], expected: true },
    { args: [[1], []], expected: false },
    { args: [[5], [5]], expected: true },
    { args: [[5], [6]], expected: false },
    { args: [[1, 2, null, 3], [1, 2, null, null, 3]], expected: false },
    { args: [[-1, -2, -3], [-1, -2, -3]], expected: true },
    { args: [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7]], expected: true },
  ],
};
