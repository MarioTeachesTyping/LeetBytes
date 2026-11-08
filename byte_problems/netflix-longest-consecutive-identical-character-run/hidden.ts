// ========================================================= //
// Longest Consecutive Identical Character Run: Hidden Tests //
// ========================================================= //

import type { HiddenProblem } from "../types.ts";

export const netflixLongestConsecutiveIdenticalCharacterRunHidden: HiddenProblem =
{
  functionName: "longestIdenticalRun",
  language: "python",
  examples: [
    { args: ["aaabbc"], expected: 3 },
    { args: ["abbbbbaccc"], expected: 5 },
    { args: [""], expected: 0 },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Covers: the three published examples, a single character, no repeats at
  // all, one run spanning the whole string, the longest run sitting at the very
  // end (only caught if the max is taken every step), the same letter split
  // into two runs that must not be added together, tied runs, a long run in
  // the middle, and the long all-same / all-alternating extremes.
  tests: [
    { args: ["aaabbc"], expected: 3 },
    { args: ["abbbbbaccc"], expected: 5 },
    { args: [""], expected: 0 },
    { args: ["a"], expected: 1 },
    { args: ["abc"], expected: 1 },
    { args: ["zzzz"], expected: 4 },
    { args: ["abbb"], expected: 3 },
    { args: ["abab"], expected: 1 },
    { args: ["aaabaaaa"], expected: 4 },
    { args: ["aabbcc"], expected: 2 },
    { args: ["aaabbbbbbbaaaaa"], expected: 7 },
    { args: ["a".repeat(1000)], expected: 1000 },
    { args: ["ab".repeat(500)], expected: 1 },
  ],
};
