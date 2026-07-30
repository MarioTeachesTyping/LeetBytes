// ================================= //
// Number of Islands: Hidden Tests //
// ================================= //

import type { HiddenProblem } from "../types.ts";

export const numberOfIslandsHidden: HiddenProblem =
{
  functionName: "numIslands",
  language: "python",
  examples: [
    {
      args: [[
        ["1", "1", "1", "1", "0"],
        ["1", "1", "0", "1", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
      ]],
      expected: 1,
    },
    {
      args: [[
        ["1", "1", "0", "0", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "0", "1", "1"],
      ]],
      expected: 3,
    },
  ],
  compare: "exact",
  paramNames: ["grid"],
  // Covers: the two canonical examples, a 1x1 land grid, a 1x1 water grid, an
  // all-water grid, an all-land grid, a single row and a single column, and a
  // grid where two islands touch only diagonally (must count as 2, catches an
  // 8-directional-flood-fill bug).
  tests: [
    {
      args: [[
        ["1", "1", "1", "1", "0"],
        ["1", "1", "0", "1", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "0", "0", "0"],
      ]],
      expected: 1,
    },
    {
      args: [[
        ["1", "1", "0", "0", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "0", "1", "1"],
      ]],
      expected: 3,
    },
    { args: [[["1"]]], expected: 1 },
    { args: [[["0"]]], expected: 0 },
    {
      args: [[
        ["0", "0", "0"],
        ["0", "0", "0"],
      ]],
      expected: 0,
    },
    {
      args: [[
        ["1", "1", "1"],
        ["1", "1", "1"],
      ]],
      expected: 1,
    },
    { args: [[["1", "0", "1", "0", "1"]]], expected: 3 },
    { args: [[["1"], ["0"], ["1"], ["0"], ["1"]]], expected: 3 },
    {
      args: [[
        ["1", "0"],
        ["0", "1"],
      ]],
      expected: 2,
    },
  ],
};
