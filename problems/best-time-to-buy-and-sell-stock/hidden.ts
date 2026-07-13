// ============================================= //
// Best Time to Buy and Sell Stock: Hidden Tests //
// ============================================= //

import type { HiddenProblem } from "../types.ts";

export const bestTimeToBuyAndSellStockHidden: HiddenProblem =
{
  functionName: "maxProfit",
  language: "python",
  examples: [
    { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { args: [[7, 6, 4, 3, 1]], expected: 0 },
  ],
  compare: "exact",
  paramNames: ["prices"],
  // Covers: the two canonical examples, a single price (no valid transaction),
  // a two-day rise and a two-day drop, a constant price, purely monotonic
  // increasing/decreasing runs, a price of 0 (lower constraint bound), and a
  // dip-rise-dip-rise sequence where the best window isn't the last one.
  tests: [
    { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { args: [[7, 6, 4, 3, 1]], expected: 0 },
    { args: [[5]], expected: 0 },
    { args: [[1, 5]], expected: 4 },
    { args: [[5, 1]], expected: 0 },
    { args: [[3, 3, 3, 3]], expected: 0 },
    { args: [[1, 2, 3, 4, 5]], expected: 4 },
    { args: [[5, 4, 3, 2, 1]], expected: 0 },
    { args: [[0, 4]], expected: 4 },
    { args: [[3, 2, 6, 5, 0, 3]], expected: 4 },
  ],
};
