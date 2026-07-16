// =========================================== //
// Longest Palindromic Substring: Hidden Tests //
// =========================================== //

import type { HiddenProblem } from "../types.ts";

export const longestPalindromicSubstringHidden: HiddenProblem =
{
  functionName: "longestPalindrome",
  language: "python",
  // The published examples, exactly as shown on the problem. "babad" has two
  // valid answers ("bab" or "aba"), same as on LeetCode itself — the Run tab
  // only displays this expected value alongside your actual output, it isn't
  // graded pass/fail, so a correct solution returning "aba" here is fine.
  examples: [
    { args: ["babad"], expected: "bab" },
    { args: ["cbbd"], expected: "bb" },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Every case below has a single unique longest palindromic substring (no
  // other substring of the same max length has different text), so exact
  // string comparison is fair to any correct algorithm, not just the
  // particular one this solution happens to use. Covers: a single character,
  // a run of identical characters, the whole string being a palindrome (both
  // odd and even length), a palindrome in the middle of the string, a
  // palindrome only at the start followed by unrelated characters, a tie
  // between two occurrences of the same short palindrome, and digits mixed
  // into the string.
  tests: [
    { args: ["cbbd"], expected: "bb" },
    { args: ["a"], expected: "a" },
    { args: ["aa"], expected: "aa" },
    { args: ["racecar"], expected: "racecar" },
    { args: ["abccba"], expected: "abccba" },
    { args: ["forgeeksskeegfor"], expected: "geeksskeeg" },
    { args: ["noonabcd"], expected: "noon" },
    { args: ["xyzyxabc"], expected: "xyzyx" },
    { args: ["abacdfgdcaba"], expected: "aba" },
    { args: ["aaaa"], expected: "aaaa" },
    { args: ["12321"], expected: "12321" },
    { args: ["abcdedcba9"], expected: "abcdedcba" },
    { args: ["tattarrattat"], expected: "tattarrattat" },
    { args: ["a1b2b1a"], expected: "a1b2b1a" },
  ],
};
