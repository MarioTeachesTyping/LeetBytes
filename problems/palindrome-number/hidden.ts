// =============================== //
// Palindrome Number: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const palindromeNumberHidden: HiddenProblem =
{
  functionName: "isPalindrome",
  language: "python",
  examples: [
    { args: [121], expected: true },
    { args: [-121], expected: false },
    { args: [10], expected: false },
  ],
  compare: "exact",
  paramNames: ["x"],
  // Covers: even/odd-length palindromes, all negatives (always false),
  // trailing-zero non-palindromes, single digits, and a long palindrome.
  tests: [
    { args: [121], expected: true },
    { args: [-121], expected: false },
    { args: [10], expected: false },
    { args: [0], expected: true },
    { args: [11], expected: true },
    { args: [1221], expected: true },
    { args: [12321], expected: true },
    { args: [-101], expected: false },
    { args: [100], expected: false },
    { args: [7], expected: true },
    { args: [1000000001], expected: true },
    { args: [1234567899], expected: false },
  ],
};
