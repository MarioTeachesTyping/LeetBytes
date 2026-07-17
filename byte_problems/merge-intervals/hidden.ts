// ============================= //
// Merge Intervals: Hidden Tests //
// ============================= //

import type { HiddenProblem } from "../types.ts";

export const mergeIntervalsHidden: HiddenProblem =
{
  functionName: "merge",
  language: "python",
  examples: [
    { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
  ],
  compare: "exact",
  paramNames: ["intervals"],
  // Output must be sorted by start. Covers: the canonical example, touching
  // endpoints, an unsorted input (catches solutions that forget to sort), a
  // fully-contained interval, disjoint intervals, a single interval, an
  // interval that swallows several, and a partial chain merge.
  tests: [
    { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
    { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
    { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
    { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
    { args: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
    { args: [[[1, 1]]], expected: [[1, 1]] },
    { args: [[[1, 4], [0, 0]]], expected: [[0, 0], [1, 4]] },
    { args: [[[2, 3], [4, 5], [6, 7], [1, 10]]], expected: [[1, 10]] },
    { args: [[[1, 3], [2, 6], [8, 10], [9, 18]]], expected: [[1, 6], [8, 18]] },
  ],
};
