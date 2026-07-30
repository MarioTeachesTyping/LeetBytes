// =============================== //
// Isomorphic Strings: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const isomorphicStringsHidden: HiddenProblem =
{
  functionName: "isIsomorphic",
  language: "python",
  examples: [
    { args: ["egg", "add"], expected: true },
    { args: ["f11", "b23"], expected: false },
    { args: ["paper", "title"], expected: true },
  ],
  compare: "exact",
  paramNames: ["s", "t"],
  // Covers: the three canonical examples, a single-character pair, identical
  // strings (each char maps to itself), a case where s maps consistently but
  // two different s-chars would collapse onto the same t-char (must fail the
  // no-two-chars-map-to-same-char rule), a repeated-char string that maps to a
  // string with distinct chars (must fail), and a longer string with a mapping
  // that only breaks near the end (catches early-exit bugs).
  tests: [
    { args: ["egg", "add"], expected: true },
    { args: ["f11", "b23"], expected: false },
    { args: ["paper", "title"], expected: true },
    { args: ["a", "a"], expected: true },
    { args: ["a", "b"], expected: true },
    { args: ["abc", "abc"], expected: true },
    { args: ["ab", "aa"], expected: false },
    { args: ["aa", "ab"], expected: false },
    { args: ["badc", "baba"], expected: false },
    { args: ["foo", "bar"], expected: false },
    { args: ["abcabc", "xyzxyz"], expected: true },
    { args: ["abcabcx", "xyzxyzx"], expected: false },
  ],
};
