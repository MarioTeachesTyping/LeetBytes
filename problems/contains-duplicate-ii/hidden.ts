// ================================== //
// Contains Duplicate II: Hidden Tests //
// ================================== //

import type { HiddenProblem } from "../types.ts";

export const containsDuplicateIiHidden: HiddenProblem =
{
  functionName: "containsNearbyDuplicate",
  language: "python",
  examples: [
    { args: [[1, 2, 3, 1], 3], expected: true },
    { args: [[1, 0, 1, 1], 1], expected: true },
    { args: [[1, 2, 3, 1, 2, 3], 2], expected: false },
  ],
  compare: "exact",
  paramNames: ["nums", "k"],
  // Covers: the three canonical examples, a single element (no pair possible),
  // k=0 with a duplicate present (distinct indices always exceed distance 0, so
  // must stay false), a duplicate exactly at the k boundary (must be true, off-
  // by-one check on <=), the same duplicate just past the boundary (must be
  // false), and negative-value duplicates within range.
  tests: [
    { args: [[1, 2, 3, 1], 3], expected: true },
    { args: [[1, 0, 1, 1], 1], expected: true },
    { args: [[1, 2, 3, 1, 2, 3], 2], expected: false },
    { args: [[1], 1], expected: false },
    { args: [[1, 1], 0], expected: false },
    { args: [[1, 2, 1], 2], expected: true },
    { args: [[1, 2, 1], 1], expected: false },
    { args: [[-5, 2, -5], 2], expected: true },
    { args: [[1, 2, 3, 4, 5], 5], expected: false },
    { args: [[99, 99], 1], expected: true },
  ],
};
