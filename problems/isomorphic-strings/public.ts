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
};
