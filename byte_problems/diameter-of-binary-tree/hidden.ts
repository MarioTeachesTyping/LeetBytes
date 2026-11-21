// ===================================== //
// Diameter of Binary Tree: Hidden Tests //
// ===================================== //

import type { HiddenProblem } from "../types.ts";

export const diameterOfBinaryTreeHidden: HiddenProblem =
{
  functionName: "diameterOfBinaryTree",
  language: "python",
  argTypes: ["TreeNode"],
  examples: [
    { args: [[1, 2, 3, 4, 5]], expected: 3 },
    { args: [[1, 2]], expected: 1 },
  ],
  compare: "exact",
  paramNames: ["root"],
  // Covers: the two canonical examples, a lone root (0 edges), a left-only
  // and a right-only chain, a diameter that does NOT pass through the root
  // (the classic trap: root with one child above a bushy subtree), a fully
  // packed tree, a lopsided tree whose longest path does cross the root, and
  // negative values.
  tests: [
    { args: [[1, 2, 3, 4, 5]], expected: 3 },
    { args: [[1, 2]], expected: 1 },
    { args: [[1]], expected: 0 },
    { args: [[1, 2, null, 3, null, 4, null]], expected: 3 },
    { args: [[1, null, 2, null, 3]], expected: 2 },
    { args: [[1, 2, null, 3, 4, 5, null, null, 6]], expected: 4 },
    { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 4 },
    { args: [[1, 2, 3, 4, 5, null, null, 6, null, null, 7]], expected: 4 },
    { args: [[-1, -2, -3]], expected: 2 },
  ],
};
