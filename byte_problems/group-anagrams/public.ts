// ============== //
// Group Anagrams //
// ============== //

import type { SolutionEntry } from "../types.ts";

export const groupAnagrams: SolutionEntry = 
{
  title: "49. Group Anagrams",

  link: "https://leetcode.com/problems/group-anagrams/",

  difficulty: "Medium",

  description: [
    "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
  ],

  examples: [
    {
      input: "`strs = ['eat','tea','tan','ate','nat','bat']`",
      output: "`[['bat'],['nat','tan'],['ate','eat','tea']]`",
      explanation: "There is no string in strs that can be rearranged to form `'bat'`.",
    },
    {
      input: "`strs = ['']`",
      output: "`[['']]`",
    },
    {
      input: "`strs = ['a']`",
      output: "`[['a']]`",
    },
  ],

  constraints: [
    "`1 <= strs.length <= 10⁴`",
    "`0 <= strs[i].length <= 100`.",
    "`strs[i]` consists of lowercase English letters.",
  ],

  topics: [
    "Array", "Hash Table", "String", "Sorting",
  ],

  companies: [
    "Amazon", "Bloomberg", "Google",
  ],

  hints: [
    "Anagrams share something in common even though the letters are in a different order — what property of a word stays identical no matter how you rearrange its characters?",
    "You need a way to group words by that shared property, which usually means picking a key you can hash and look up — what would you use as the key in a dictionary of groups?",
    "Instead of sorting each word into a key (which costs extra time), try counting how many of each of the 26 letters appear and using that fixed-size count as an immutable key, like a tuple, in a hash map.",
  ],

  starterCode: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        `,

  code: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        '''
        for this problem  it tells us to group together already made strings that could be anagrams
        of each other. grouping most likely means to do hashmapping (dict)
        for this we can make a dict res = defaultdict(list) with our key as the letters and
        values as the words. 
        '''
        res = defaultdict(list)

        # loop through the words in strings
        for word in strs:
            # let each word have a count list which is the letters a - z
            count = [0] * 26

            # go through each word and increment the letters they hit through a - z
            for char in word:
                count[ord(char) - ord("a")] += 1
            
            # append the words as the values and the count as keys in the dict
            # can't append lists as keys in python, so we use a tuple
            res[tuple(count)].append(word)

        # return only the words
        return list(res.values())`,

  explanation: {
    intuition: [
      "Two words are anagrams exactly when they use the same letters the same number of times. So if each word is described by its letter counts, all of its anagrams get the same description.",
      "Each word is counted into a list of 26 slots, one per letter (`count[ord(char) - ord(\"a\")]` turns `a` into slot 0, `b` into slot 1, and so on). That count becomes the key in a `defaultdict(list)`, so every anagram lands in the same group. The list is turned into a tuple first, because lists can't be dict keys in Python.",
    ],
    algorithm: [
      "Create `res = defaultdict(list)`.",
      "For each word, build a 26-slot `count` of how many times each letter appears.",
      "Append the word to `res[tuple(count)]`.",
      "Return `list(res.values())`, the groups themselves.",
    ],
    complexity: {
      time: { bigO: "O(n · k)", reason: "Where n is the number of words and k is the longest word's length: each word's letters are counted once, and building its 26-slot key is constant work." },
      space: { bigO: "O(n · k)", reason: "Every word ends up stored in a group, plus one 26-slot key per group." },
    },
  },
};
