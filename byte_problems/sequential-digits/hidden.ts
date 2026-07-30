// ============================== //
// Sequential Digits: Hidden Tests //
// ============================== //

import type { HiddenProblem } from "../types.ts";

export const sequentialDigitsHidden: HiddenProblem =
{
  functionName: "sequentialDigits",
  language: "python",
  examples: [
    { args: [100, 300], expected: [123, 234] },
    { args: [1000, 13000], expected: [1234, 2345, 3456, 4567, 5678, 6789, 12345] },
  ],
  compare: "exact",
  paramNames: ["low", "high"],
  // Covers: the two canonical examples, an exhaustive 2-digit-only range, a
  // range entirely below the smallest sequential number of that length (no
  // matches), a range that falls in the gap between two sequential numbers (no
  // matches), an exact single-number match at both ends of the range, the
  // maximum-size range spanning every possible length (2 through 9 digits),
  // and a single 9-digit exact match.
  tests: [
    { args: [100, 300], expected: [123, 234] },
    { args: [1000, 13000], expected: [1234, 2345, 3456, 4567, 5678, 6789, 12345] },
    { args: [10, 99], expected: [12, 23, 34, 45, 56, 67, 78, 89] },
    { args: [90, 99], expected: [] },
    { args: [10, 11], expected: [] },
    { args: [123, 123], expected: [123] },
    {
      args: [10, 1000000000],
      expected: [
        12, 23, 34, 45, 56, 67, 78, 89,
        123, 234, 345, 456, 567, 678, 789,
        1234, 2345, 3456, 4567, 5678, 6789,
        12345, 23456, 34567, 45678, 56789,
        123456, 234567, 345678, 456789,
        1234567, 2345678, 3456789,
        12345678, 23456789,
        123456789,
      ],
    },
    { args: [123456789, 123456789], expected: [123456789] },
  ],
};
