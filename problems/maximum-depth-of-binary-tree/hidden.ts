// ========================================== //
// Maximum Depth of Binary Tree: Hidden Tests //
// ========================================== //

import type { HiddenProblem } from "../types.ts";

export const maximumDepthOfBinaryTreeHidden: HiddenProblem =
{
  functionName: "maxDepth",
  language: "python",
  argTypes: ["TreeNode"],
  examples: [
    { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
    { args: [[1, null, 2]], expected: 2 },
  ],
  compare: "exact",
  paramNames: ["root"],
  // Covers: the two canonical examples, an empty tree, a lone root, a
  // left-only skewed chain, a right-only skewed chain, a fully packed 8-node
  // tree (checks depth counts nodes, not just balanced levels), and negative
  // values.
  tests: [
    { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
    { args: [[1, null, 2]], expected: 2 },
    { args: [[]], expected: 0 },
    { args: [[1]], expected: 1 },
    { args: [[1, 2, null, 3, null, 4, null]], expected: 4 },
    { args: [[1, null, 2, null, 3]], expected: 3 },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8]], expected: 4 },
    { args: [[-1, -2, -3]], expected: 2 },
  ],
};
