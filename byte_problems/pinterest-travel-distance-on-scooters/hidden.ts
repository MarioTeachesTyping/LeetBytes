// ============================================ //
// Travel Distance on Scooters: Hidden Tests //
// ============================================ //

import type { HiddenProblem } from "../types.ts";

export const pinterestTravelDistanceOnScootersHidden: HiddenProblem =
{
  functionName: "travelDistanceOnScooters",
  language: "python",
  examples: [
    { args: [23, [7, 4, 14]], expected: 19 },
    { args: [27, [15, 7, 3, 10]], expected: 20 },
    { args: [10, []], expected: 0 },
  ],
  compare: "exact",
  paramNames: ["finish", "scooters"],
  // Expected values come from an independent spec-based simulation, not the
  // reference solution. Covers: the three published examples, the shortest
  // street with no scooters, a scooter at the very start (position 0) and one
  // sitting exactly on `finish` (ride of 0), a scooter that gets passed over
  // and so is never ridden ([1, 5] — the one at 5 is behind you after riding
  // 1 -> 11), landing exactly on another scooter ([2, 12]), a final ride cut
  // short by `finish`, unsorted input, a scooter every 10 points across the
  // longest street, and a lone scooter near the end of it.
  tests: [
    { args: [23, [7, 4, 14]], expected: 19 },
    { args: [27, [15, 7, 3, 10]], expected: 20 },
    { args: [10, []], expected: 0 },
    { args: [1, []], expected: 0 },
    { args: [5, [0]], expected: 5 },
    { args: [10, [10]], expected: 0 },
    { args: [100, [1, 5]], expected: 10 },
    { args: [14, [2, 12]], expected: 12 },
    { args: [20, [15]], expected: 5 },
    { args: [30, [5, 12, 18, 25]], expected: 20 },
    { args: [30, [25, 18, 5, 12]], expected: 20 },
    { args: [7, [3]], expected: 4 },
    { args: [50, [40, 30, 20, 10, 0]], expected: 50 },
    { args: [1000, [995]], expected: 5 },
    {
      args: [1000, Array.from({ length: 100 }, (_, i) => i * 10)],
      expected: 1000,
    },
  ],
};
