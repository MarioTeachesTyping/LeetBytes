// ================================= //
// Trapping Rain Water: Hidden Tests //
// ================================= //

import type { HiddenProblem } from "../types.ts";

export const trappingRainWaterHidden: HiddenProblem =
{
  functionName: "trap",
  language: "python",
  examples: [
    { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
    { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
  ],
  compare: "exact",
  paramNames: ["height"],
  // Covers: the two canonical examples, single/empty bars, flat terrain,
  // strictly descending and strictly ascending (no water in either), a deep
  // central basin, a simple valley, and an asymmetric dip.
  tests: [
    { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
    { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    { args: [[0]], expected: 0 },
    { args: [[]], expected: 0 },
    { args: [[1, 1, 1]], expected: 0 },
    { args: [[5, 4, 3, 2, 1]], expected: 0 },
    { args: [[1, 2, 3, 4, 5]], expected: 0 },
    { args: [[3, 0, 0, 2, 0, 4]], expected: 10 },
    { args: [[2, 0, 2]], expected: 2 },
    { args: [[4, 2, 3]], expected: 1 },
  ],
};
