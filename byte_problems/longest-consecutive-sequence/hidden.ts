// ========================================== //
// Longest Consecutive Sequence: Hidden Tests //
// ========================================== //

import type { HiddenProblem } from "../types.ts";

export const longestConsecutiveSequenceHidden: HiddenProblem =
{
  functionName: "longestConsecutive",
  language: "python",
  examples: [
    { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
    { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    { args: [[1, 0, 1, 2]], expected: 3 },
  ],
  compare: "exact",
  paramNames: ["nums"],
  // Expected values come from sorting and counting runs, not the reference
  // solution. Covers: the three published examples, an empty array, a single
  // number, all duplicates, no two numbers consecutive, a run crossing from
  // negative to positive, a run of four hidden among other numbers, the ±10⁹
  // limits, duplicates inside a run, two runs where the later one is longer, a
  // random mix with repeats, and two 10⁵-length arrays: one full run listed in
  // reverse, and only even numbers (no run longer than 1). The full run is
  // O(n²) for an approach that walks up from every number, not just from the
  // start of each run.
  tests: [
    { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
    { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    { args: [[1, 0, 1, 2]], expected: 3 },
    { args: [[]], expected: 0 },
    { args: [[7]], expected: 1 },
    { args: [[5, 5, 5]], expected: 1 },
    { args: [[1, 3, 5, 7]], expected: 1 },
    { args: [[-1, -2, -3, 0, 1]], expected: 5 },
    { args: [[10, 5, 12, 3, 55, 30, 4, 11, 2]], expected: 4 },
    { args: [[1000000000, -1000000000, 999999999]], expected: 2 },
    { args: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7 },
    { args: [[1, 2, 0, 1]], expected: 3 },
    { args: [[-5, -4, 10, 11, 12, -3]], expected: 3 },
    {
      args: [[-15, 7, 4, -22, -7, 28, 8, 0, 10, 7, -26, 8, -30, 28, 23, 0, -14, 5, -16, -18, 15, 0, 4, 23, 5, 0, -5, 10, 25, -21, -16, 10, -21, 25, 29, 3, -6, 17, -30, 12]],
      expected: 3,
    },
    { args: [Array.from({ length: 100000 }, (_, i) => 99999 - i)], expected: 100000 },
    { args: [Array.from({ length: 100000 }, (_, i) => 2 * i)], expected: 1 },
  ],
};
