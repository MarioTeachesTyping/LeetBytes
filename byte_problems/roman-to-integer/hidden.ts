// ============================== //
// Roman to Integer: Hidden Tests //
// ============================== //

import type { HiddenProblem } from "../types.ts";

export const romanToIntegerHidden: HiddenProblem =
{
  functionName: "romanToInt",
  language: "python",
  examples: [
    { args: ["III"], expected: 3 },
    { args: ["LVIII"], expected: 58 },
    { args: ["MCMXCIV"], expected: 1994 },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Numerals come from an independent integer-to-roman converter, not the
  // reference solution. Covers: the three published examples, a lone symbol
  // (smallest and largest), every one of the six subtraction pairs on its own,
  // subtraction pairs back to back (XLIX, CDXLIV), subtraction at the end of an
  // otherwise additive numeral (XIV), purely additive numerals, the largest
  // value 3999, and the longest possible numeral (MMMDCCCLXXXVIII, 15 symbols).
  tests: [
    { args: ["III"], expected: 3 },
    { args: ["LVIII"], expected: 58 },
    { args: ["MCMXCIV"], expected: 1994 },
    { args: ["I"], expected: 1 },
    { args: ["M"], expected: 1000 },
    { args: ["IV"], expected: 4 },
    { args: ["IX"], expected: 9 },
    { args: ["XL"], expected: 40 },
    { args: ["XC"], expected: 90 },
    { args: ["CD"], expected: 400 },
    { args: ["CM"], expected: 900 },
    { args: ["XLIX"], expected: 49 },
    { args: ["CDXLIV"], expected: 444 },
    { args: ["XIV"], expected: 14 },
    { args: ["LXXX"], expected: 80 },
    { args: ["DCXXI"], expected: 621 },
    { args: ["MMXXVI"], expected: 2026 },
    { args: ["MMM"], expected: 3000 },
    { args: ["MMMCMXCIX"], expected: 3999 },
    { args: ["MMMDCCCLXXXVIII"], expected: 3888 },
  ],
};
