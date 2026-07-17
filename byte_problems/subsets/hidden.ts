// ===================== //
// Subsets: Hidden Tests //
// ===================== //

import type { HiddenProblem } from "../types.ts";

export const subsetsHidden: HiddenProblem =
{
  functionName: "subsets",
  language: "python",
  examples: [
    { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
    { args: [[0]], expected: [[], [0]] },
  ],
  // Neither the order of subsets nor the order of elements within a subset is graded.
  compare: "unordered_deep",
  paramNames: ["nums"],
  // Covers: a single element, two elements, the canonical 3-element example, the
  // single-zero example, negative numbers mixed with positive, two negatives, a
  // larger 4-element array (16 subsets), and a lone negative value.
  tests: [
    { args: [[1]], expected: [[], [1]] },
    { args: [[0]], expected: [[], [0]] },
    { args: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
    { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
    { args: [[-1, 0, 1]], expected: [[], [-1], [0], [-1, 0], [1], [-1, 1], [0, 1], [-1, 0, 1]] },
    { args: [[5, -5]], expected: [[], [5], [-5], [5, -5]] },
    { args: [[1, 2, 3, 4]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3], [4], [1, 4], [2, 4], [1, 2, 4], [3, 4], [1, 3, 4], [2, 3, 4], [1, 2, 3, 4]] },
    { args: [[-10]], expected: [[], [-10]] },
  ],
};
