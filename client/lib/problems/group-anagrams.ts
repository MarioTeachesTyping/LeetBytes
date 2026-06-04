import type { SolutionEntry } from "./types";

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
    "`1 <= strs.length <= 10^4`",
    "`0 <= strs[i].length * 100`.",
    "`strs[i]` consists of lowercase English letters.",
  ],

  topics: [
    "Array", "Hash Table", "String", "Sorting",
  ],

  companies: [
    "Amazon", "Bloomberg", "Google",
  ],

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

  stats: {
    runtime: { label: "Runtime", value: "19 ms", beats: "22.40%" },
    memory: { label: "Memory", value: "22.76 MB", beats: "37.06%" },
  },
};
