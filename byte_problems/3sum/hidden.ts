// ================== //
// 3Sum: Hidden Tests //
// ================== //

import type { HiddenProblem } from "../types.ts";

export const threeSumHidden: HiddenProblem =
{
  functionName: "threeSum",
  language: "python",
  examples: [
    { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
    { args: [[0, 1, 1]], expected: [] },
    { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
  ],
  // Neither the order of triplets nor the order of numbers inside a triplet is graded.
  compare: "unordered_deep",
  paramNames: ["nums"],
  // Expected values come from a brute-force check of every combination, not the
  // reference solution. Covers: the three published examples, many repeated
  // zeros (only one [0,0,0] allowed), all positive and all negative arrays (no
  // answer), duplicates that would produce repeat triplets if not skipped on
  // either the fixed index or the `low` pointer, unsorted input, the value
  // limits of ±10⁵, a dense array full of repeats with many answers, and the
  // longest allowed array of all zeros.
  tests: [
    { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
    { args: [[0, 1, 1]], expected: [] },
    { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    { args: [[0, 0, 0, 0, 0]], expected: [[0, 0, 0]] },
    { args: [[1, 2, 3]], expected: [] },
    { args: [[-3, -2, -1]], expected: [] },
    { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
    { args: [[-1, 0, 1, 0]], expected: [[-1, 0, 1]] },
    { args: [[1, -1, -1, 0]], expected: [[-1, 0, 1]] },
    { args: [[-2, 1, 1, 1, 1, 1]], expected: [[-2, 1, 1]] },
    { args: [[3, 0, -2, -1, 1, 2]], expected: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]] },
    { args: [[-100000, 0, 100000]], expected: [[-100000, 0, 100000]] },
    { args: [[-100000, 50000, 50000, 1]], expected: [[-100000, 50000, 50000]] },
    {
      args: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]],
      expected: [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]],
    },
    {
      args: [[0, -6, 2, 10, -9, -8, 7, -7, 1, 8, -9, 6, -4, -9, -8, 3, 3, -8, -3, -8, 7, 3, -9, 8, -7, -3, 10, 10, 8, -9, 8, 8, 2, -9, -3, -9, 7, -6, -1, 3]],
      expected: [
        [-9, -1, 10], [-9, 1, 8], [-9, 2, 7], [-9, 3, 6], [-8, 0, 8], [-8, 1, 7], [-8, 2, 6],
        [-7, -3, 10], [-7, -1, 8], [-7, 0, 7], [-7, 1, 6], [-6, -4, 10], [-6, -1, 7], [-6, 0, 6],
        [-6, 3, 3], [-4, -3, 7], [-4, 1, 3], [-4, 2, 2], [-3, -3, 6], [-3, 0, 3], [-3, 1, 2], [-1, 0, 1],
      ],
    },
    { args: [Array.from({ length: 3000 }, () => 0)], expected: [[0, 0, 0]] },
  ],
};
