// ============================ //
// Symmetric Tree: Hidden Tests //
// ============================ //

import type { HiddenProblem } from "../types.ts";

export const symmetricTreeHidden: HiddenProblem =
{
  functionName: "isSymmetric",
  language: "python",
  argTypes: ["TreeNode"],
  examples: [
    { args: [[1, 2, 2, 3, 4, 4, 3]], expected: true },
    { args: [[1, 2, 2, null, 3, null, 3]], expected: false },
  ],
  compare: "exact",
  paramNames: ["root"],
  // Covers: the two canonical examples, a lone root, a shallow mirrored pair,
  // a shallow value mismatch, a deeper mirror that requires recursing past the
  // first level, a deeper value mismatch past the first level (catches checks
  // that only compare the immediate children), negative values, and a
  // structural asymmetry where one side has children and its mirror doesn't.
  tests: [
    { args: [[1, 2, 2, 3, 4, 4, 3]], expected: true },
    { args: [[1, 2, 2, null, 3, null, 3]], expected: false },
    { args: [[1]], expected: true },
    { args: [[1, 2, 2]], expected: true },
    { args: [[1, 2, 3]], expected: false },
    { args: [[1, 2, 2, 3, null, null, 3]], expected: true },
    { args: [[1, 2, 2, 3, 4, 3, 4]], expected: false },
    { args: [[0, -1, -1]], expected: true },
    { args: [[1, 2, 2, 3, 3]], expected: false },
  ],
};
