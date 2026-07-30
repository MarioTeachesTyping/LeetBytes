// =================================================== //
// Binary Tree Vertical Order Traversal: Hidden Tests //
// =================================================== //

import type { HiddenProblem } from "../types.ts";

export const binaryTreeVerticalOrderTraversalHidden: HiddenProblem =
{
  functionName: "verticalOrder",
  language: "python",
  argTypes: ["TreeNode"],
  examples: [
    { args: [[3, 9, 20, null, null, 15, 7]], expected: [[9], [3, 15], [20], [7]] },
    { args: [[3, 9, 8, 4, 0, 1, 7]], expected: [[4], [9], [3, 0, 1], [8], [7]] },
    {
      args: [[1, 2, 3, 4, 10, 9, 11, null, 5, null, null, null, null, null, null, null, 6]],
      expected: [[4], [2, 5], [1, 10, 9, 6], [3], [11]],
    },
  ],
  compare: "exact",
  paramNames: ["root"],
  // Covers: the three canonical examples (the 2nd and 3rd exercise same-column
  // left-to-right ordering across different subtrees), an empty tree, a single
  // node, a purely left-skewed tree (columns only ever decrease), a purely
  // right-skewed tree (columns only ever increase), and negative values.
  tests: [
    { args: [[3, 9, 20, null, null, 15, 7]], expected: [[9], [3, 15], [20], [7]] },
    { args: [[3, 9, 8, 4, 0, 1, 7]], expected: [[4], [9], [3, 0, 1], [8], [7]] },
    {
      args: [[1, 2, 3, 4, 10, 9, 11, null, 5, null, null, null, null, null, null, null, 6]],
      expected: [[4], [2, 5], [1, 10, 9, 6], [3], [11]],
    },
    { args: [[]], expected: [] },
    { args: [[5]], expected: [[5]] },
    { args: [[1, 2, null, 3]], expected: [[3], [2], [1]] },
    { args: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] },
    { args: [[-1, -2, -3]], expected: [[-2], [-1], [-3]] },
  ],
};
