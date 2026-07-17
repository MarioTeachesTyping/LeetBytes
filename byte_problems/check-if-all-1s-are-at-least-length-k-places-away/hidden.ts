// ======================================================================== //
// Check If All 1's Are at Least Length K Places Away: Hidden Tests //
// ======================================================================== //

import type { HiddenProblem } from "../types.ts";

export const checkIfAll1SAreAtLeastLengthKPlacesAwayHidden: HiddenProblem =
{
  functionName: "kLengthApart",
  language: "python",
  examples: [
    { args: [[1, 0, 0, 0, 1, 0, 0, 1], 2], expected: true },
    { args: [[1, 0, 0, 1, 0, 1], 2], expected: false },
  ],
  compare: "exact",
  paramNames: ["nums", "k"],
  // Covers: the two canonical examples, k=0 with 1's packed back to back (any
  // gap satisfies 0), a single 1 in the array (trivially true for any k), an
  // array with no 1's at all (vacuously true), a gap that lands exactly at the
  // k boundary (must pass, catches an off-by-one on <=), a gap exactly one
  // short of k (must fail), and the same boundary pass/fail pair at a larger k.
  tests: [
    { args: [[1, 0, 0, 0, 1, 0, 0, 1], 2], expected: true },
    { args: [[1, 0, 0, 1, 0, 1], 2], expected: false },
    { args: [[1, 1, 1, 1], 0], expected: true },
    { args: [[1], 5], expected: true },
    { args: [[0, 0, 0, 0], 3], expected: true },
    { args: [[1, 0, 0, 1], 2], expected: true },
    { args: [[1, 0, 1], 2], expected: false },
    { args: [[1, 0, 0, 0, 1], 3], expected: true },
    { args: [[1, 0, 0, 0, 1], 4], expected: false },
  ],
};
