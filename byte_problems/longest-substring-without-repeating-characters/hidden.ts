// ============================================================ //
// Longest Substring Without Repeating Characters: Hidden Tests //
// ============================================================ //

import type { HiddenProblem } from "../types.ts";

export const longestSubstringWithoutRepeatingCharactersHidden: HiddenProblem =
{
  functionName: "lengthOfLongestSubstring",
  language: "python",
  examples: [
    { args: ["abcabcbb"], expected: 3 },
    { args: ["bbbbb"], expected: 1 },
    { args: ["pwwkew"], expected: 3 },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Covers: classic, all-same, the pwwkew window-reset trap, a single space,
  // empty string, repeat-after-gap cases (dvdf, abba) that catch a window
  // start that doesn't move forward, and an all-unique string.
  tests: [
    { args: ["abcabcbb"], expected: 3 },
    { args: ["bbbbb"], expected: 1 },
    { args: ["pwwkew"], expected: 3 },
    { args: [" "], expected: 1 },
    { args: [""], expected: 0 },
    { args: ["au"], expected: 2 },
    { args: ["dvdf"], expected: 3 },
    { args: ["abba"], expected: 2 },
    { args: ["tmmzuxt"], expected: 5 },
    { args: ["anviaj"], expected: 5 },
    { args: ["abcdef"], expected: 6 },
  ],
};
