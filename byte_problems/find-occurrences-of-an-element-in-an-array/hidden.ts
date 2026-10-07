// ================================================ //
// Find Occurrences of an Element: Hidden Tests //
// ================================================ //

import type { HiddenProblem } from "../types.ts";

export const findOccurrencesOfAnElementInAnArrayHidden: HiddenProblem =
{
  functionName: "occurrencesOfElement",
  language: "python",
  examples: [
    { args: [[1, 3, 1, 7], [1, 3, 2, 4], 1], expected: [0, -1, 2, -1] },
    { args: [[1, 2, 3], [10], 5], expected: [-1] },
  ],
  compare: "exact",
  paramNames: ["nums", "queries", "x"],
  // Expected values come from an independent reference (positions of x, then a
  // lookup per query). Covers: the two published examples, every element equal
  // to x with one query past the end, a single-element array hit and missed,
  // repeated and unordered queries (answers must line up with query order, not
  // sorted order), x only at the very end, a query at the 10^5 upper bound, a
  // mixed array where x appears several times, and repeated identical queries.
  tests: [
    { args: [[1, 3, 1, 7], [1, 3, 2, 4], 1], expected: [0, -1, 2, -1] },
    { args: [[1, 2, 3], [10], 5], expected: [-1] },
    { args: [[2, 2, 2, 2], [1, 2, 3, 4, 5], 2], expected: [0, 1, 2, 3, -1] },
    { args: [[5], [1], 5], expected: [0] },
    { args: [[5], [2], 5], expected: [-1] },
    { args: [[1, 2, 1, 2, 1], [3, 3, 1, 2], 1], expected: [4, 4, 0, 2] },
    { args: [[4, 9, 4, 9, 4, 9], [3, 1, 2, 4], 9], expected: [5, 1, 3, -1] },
    { args: [[7, 8, 9], [100000, 1], 9], expected: [-1, 2] },
    { args: [[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5], [1, 2, 3, 4], 5], expected: [4, 8, 10, -1] },
    { args: [[1, 2, 3, 4], [1, 1, 1], 4], expected: [3, 3, 3] },
  ],
};
