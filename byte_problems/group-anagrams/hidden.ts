// ============================ //
// Group Anagrams: Hidden Tests //
// ============================ //

import type { HiddenProblem } from "../types.ts";

export const groupAnagramsHidden: HiddenProblem =
{
  functionName: "groupAnagrams",
  language: "python",
  examples: [
    { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
    { args: [[""]], expected: [[""]] },
    { args: [["a"]], expected: [["a"]] },
  ],
  // Neither the order of groups nor the order within a group is graded.
  compare: "unordered_deep",
  paramNames: ["strs"],
  // Neither group order nor within-group order is graded. Covers: the canonical
  // example, a single empty string, a single char, several multi-member groups,
  // two identical empty strings (one group), all-distinct singletons, and same
  // letters in different counts (distinct groups — catches set-vs-multiset bugs).
  tests: [
    { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
    { args: [[""]], expected: [[""]] },
    { args: [["a"]], expected: [["a"]] },
    { args: [["abc", "bca", "cab", "xyz", "zyx"]], expected: [["abc", "bca", "cab"], ["xyz", "zyx"]] },
    { args: [["", ""]], expected: [["", ""]] },
    { args: [["a", "b", "c"]], expected: [["a"], ["b"], ["c"]] },
    { args: [["ddddddddddg", "dgggggggggg"]], expected: [["ddddddddddg"], ["dgggggggggg"]] },
    { args: [["listen", "silent", "enlist", "google", "gogole"]], expected: [["listen", "silent", "enlist"], ["google", "gogole"]] },
  ],
};
