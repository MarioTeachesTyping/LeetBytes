// ========================== //
// Valid Anagram: Hidden Tests //
// ========================== //

import type { HiddenProblem } from "../types.ts";

export const validAnagramHidden: HiddenProblem =
{
  functionName: "isAnagram",
  language: "python",
  examples: [
    { args: ["anagram", "nagaram"], expected: true },
    { args: ["rat", "car"], expected: false },
  ],
  compare: "exact",
  paramNames: ["s", "t"],
  // Covers: the two canonical examples, identical strings, single matching and
  // mismatched characters, different lengths (must short-circuit to false, not
  // crash), same length and same letter set but different counts per letter
  // (catches a set-based check that ignores multiplicity), and repeated-letter
  // anagrams.
  tests: [
    { args: ["anagram", "nagaram"], expected: true },
    { args: ["rat", "car"], expected: false },
    { args: ["a", "a"], expected: true },
    { args: ["a", "b"], expected: false },
    { args: ["ab", "a"], expected: false },
    { args: ["aacc", "ccac"], expected: false },
    { args: ["aabbcc", "abcabc"], expected: true },
    { args: ["listen", "silent"], expected: true },
    { args: ["aaa", "aaa"], expected: true },
    { args: ["aaab", "aaba"], expected: true },
  ],
};
