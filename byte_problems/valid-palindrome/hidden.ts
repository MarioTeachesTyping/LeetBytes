// =========================== //
// Valid Palindrome: Hidden Tests //
// =========================== //

import type { HiddenProblem } from "../types.ts";

export const validPalindromeHidden: HiddenProblem =
{
  functionName: "isPalindrome",
  language: "python",
  examples: [
    { args: ["A man, a plan, a canal: Panama"], expected: true },
    { args: ["race a car"], expected: false },
    { args: [" "], expected: true },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Covers: the three published examples, an alnum-only mismatch ("0P" — a
  // classic edge case where every character counts but still isn't a
  // palindrome), a single character, a punctuation-only string (vacuously a
  // palindrome once every character is skipped), a plain letter mismatch, a
  // numeric palindrome, a short alnum mismatch, and a full palindromic
  // sentence mixing case, spaces, and punctuation.
  tests: [
    { args: ["A man, a plan, a canal: Panama"], expected: true },
    { args: ["race a car"], expected: false },
    { args: [" "], expected: true },
    { args: ["0P"], expected: false },
    { args: ["a"], expected: true },
    { args: [".,"], expected: true },
    { args: ["abcda"], expected: false },
    { args: ["12321"], expected: true },
    { args: ["1a2"], expected: false },
    { args: ["Was it a car or a cat I saw"], expected: true },
  ],
};
