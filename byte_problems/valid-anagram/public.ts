// ============= //
// Valid Anagram //
// ============= //

import type { SolutionEntry } from "../types.ts";

export const validAnagram: SolutionEntry =
{
  title: "242. Valid Anagram",

  link: "https://leetcode.com/problems/valid-anagram/",

  difficulty: "Easy",

  description: [
    "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
  ],

  examples: [
    {
      input: "`s = \"anagram\", t = \"nagaram\"`",
      output: "`true`",
    },
    {
      input: "`s = \"rat\", t = \"car\"`",
      output: "`false`",
    },
  ],

  constraints: [
    "`1 <= s.length, t.length <= 5 * 10⁴`.",
    "`s` and `t` consist of lowercase English letters.",
  ],

  topics: [
    "Hash Table", "String", "Sorting",
  ],

  companies: [
    "Google", "Meta", "Amazon", "Bloomberg",
  ],

  hints: [
    "An anagram is just the same letters in a different order — is there a quick length check you could do up front to rule out obviously invalid pairs before comparing letters?",
    "If two strings contain exactly the same letters, what would happen to both of them if you rearranged their characters into a consistent, predictable order?",
    "Return False early if the lengths differ, otherwise compare `sorted(s) == sorted(t)` — if they match once sorted, they must be anagrams of each other.",
  ],

  starterCode: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        `,

  code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:

        '''
        easy solution but not optimal
        sort both strings and check if equal
        base cases: if lengths are diff, false. if one or other is 0 length, false.
        '''
        if len(s) is None or len(t) is None:
            return False
        if len(s) != len(t):
            return False

        # sort both strings
        ss = sorted(s)
        st = sorted(t)

        if ss == st:
            return True

        return False`,
};
