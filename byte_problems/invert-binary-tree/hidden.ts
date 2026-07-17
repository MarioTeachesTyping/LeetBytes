// ================================= //
// Invert Binary Tree: Hidden Tests //
// ================================= //

import type { HiddenProblem } from "../types.ts";

export const invertBinaryTreeHidden: HiddenProblem =
{
  functionName: "invertTree",
  language: "python",
  argTypes: ["TreeNode"],
  returnType: "TreeNode",
  examples: [
    { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
    { args: [[2, 1, 3]], expected: [2, 3, 1] },
    { args: [[]], expected: [] },
  ],
  compare: "exact",
  paramNames: ["root"],
  // Covers: the three canonical examples, a single node, a left-only skewed
  // tree becoming right-only and vice versa (catches a swap that only reads
  // one side), a full 7-node tree with a deeper swap, and negative values.
  tests: [
    { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
    { args: [[2, 1, 3]], expected: [2, 3, 1] },
    { args: [[]], expected: [] },
    { args: [[1]], expected: [1] },
    { args: [[1, 2]], expected: [1, null, 2] },
    { args: [[1, null, 2]], expected: [1, 2] },
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [1, 3, 2, 7, 6, 5, 4] },
    { args: [[-1, -2, -3]], expected: [-1, -3, -2] },
  ],
};
