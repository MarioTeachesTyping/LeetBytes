// ================== //
// Isomorphic Strings //
// ================== //

import type { SolutionEntry } from "../types.ts";

export const isomorphicStrings: SolutionEntry =
{
  title: "205. Isomorphic Strings",

  link: "https://leetcode.com/problems/isomorphic-strings/",

  difficulty: "Easy",

  description: [
    "Given two strings `s` and `t`, determine if they are isomorphic.",
    "Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`.",
    "All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.",
  ],

  examples: [
    {
      input: "`s = \"egg\", t = \"add\"`",
      output: "`true`",
      explanation: "The strings s and t can be made identical by: Mapping 'e' to 'a'. Mapping 'g' to 'd'.",
    },
    {
      input: "`s = \"f11\", t = \"b23\"`",
      output: "`false`",
      explanation: "The strings s and t can not be made identical as '1' needs to be mapped to both '2' and '3'.",
    },
    {
      input: "`s = \"paper\", t = \"title\"`",
      output: "`true`",
    },
  ],

  constraints: [
    "`1 <= s.length <= 5 * 10⁴`.",
    "`t.length == s.length`.",
    "`s` and `t` consist of any valid ascii character.",
  ],

  topics: [
    "Hash Table", "String",
  ],

  companies: [
    "Amazon", "Google", "Microsoft", "Bloomberg",
  ],

  hints: [
    "Mapping characters from one string to another is a hint toward a hash map — but is a mapping in just one direction (s to t) enough to catch every invalid case?",
    "Think about what goes wrong if two different characters in `s` both try to map to the same character in `t` — a single dictionary from `s` to `t` wouldn't catch that on its own.",
    "Keep two dictionaries, one mapping s→t and one mapping t→s, and walk both strings together with `zip(s, t)`; if a character pair hasn't been mapped yet, record it in both, otherwise check the existing mappings agree — return False on any mismatch.",
  ],

  starterCode: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        `,

  code: `class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:

        '''
        the problem tells us to use a hashmap, making that the easiest solution
        since the strings need to be replaceable we need to check that for both ways
        meaning we need 2 dicts so we can check from s to t, and t to s
        zip function from python will also make this easy since it automatically
        iterates through 2 things in parallel
        '''
        dict_st = {}
        dict_ts = {}

        # iterate through both strings in parallel using zip
        for char1, char2 in zip(s, t):

            # check if s and t are in mapped in the dicts
            if (char1 not in dict_st) and (char2 not in dict_ts):
                # if not, append them
                dict_st[char1] = char2
                dict_ts[char2] = char1
            # if the mappings of s and t don't match return false
            elif dict_st.get(char1) != char2 or dict_ts.get(char2) != char1:
                return False

        return True`,

  explanation: {
    intuition: [
      "The strings are isomorphic if each character in `s` can be swapped for exactly one character in `t`, and no two characters in `s` turn into the same character in `t`. In other words, the mapping has to be one-to-one in both directions.",
      "That's why there are two dicts: `dict_st` maps characters of `s` to `t`, and `dict_ts` maps them back. Walking both strings together with `zip`, a pair of brand new characters gets recorded in both directions. Any pair where either character is already mapped has to agree with what's been recorded, or the strings aren't isomorphic.",
    ],
    algorithm: [
      "Create two empty dicts, `dict_st` and `dict_ts`.",
      "Walk through `s` and `t` together with `zip`, one pair of characters at a time.",
      "If neither character has been mapped yet, map `char1` to `char2` in `dict_st` and `char2` to `char1` in `dict_ts`.",
      "Otherwise, if `dict_st.get(char1) != char2` or `dict_ts.get(char2) != char1`, return `False`.",
      "If every pair agrees, return `True`.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "One pass over both strings, with O(1) dict operations." },
      space: { bigO: "O(k)", reason: "Where k is the number of distinct characters. That's at most 128 for ASCII, so it's effectively constant." },
    },
  },
};
