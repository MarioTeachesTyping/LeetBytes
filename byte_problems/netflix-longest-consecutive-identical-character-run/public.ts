// =========================================== //
// Longest Consecutive Identical Character Run //
// =========================================== //

import type { SolutionEntry } from "../types.ts";

export const netflixLongestConsecutiveIdenticalCharacterRun: SolutionEntry =
{
  title: "Longest Consecutive Identical Character Run",

  link: "https://www.fastprep.io/problems/netflix-longest-consecutive-identical-character-run",

  source: "FastPrep",

  difficulty: "Easy",

  description: [
    "Given a string `s`, return the length of its longest nonempty consecutive run whose characters are all identical.",
    "Assume `s` contains only lowercase English letters and may be empty. Return `0` when `s` is empty.",
  ],

  examples: [
    {
      input: "`s = \"aaabbc\"`",
      output: "`3`",
      explanation: "The prefix `aaa` is the longest identical-character run, so the answer is `3`.",
    },
    {
      input: "`s = \"abbbbbaccc\"`",
      output: "`5`",
      explanation: "The run `bbbbb` has length `5`, longer than every other run.",
    },
    {
      input: "`s = \"\"`",
      output: "`0`",
      explanation: "The empty string contains no nonempty run.",
    },
  ],

  constraints: [
    "`s` contains only lowercase English letters.",
    "`s` may be empty.",
  ],

  topics: [
    "String", "Interview",
  ],

  companies: [
    "Netflix",
  ],

  hints: [
    "A run only ever continues or breaks at the boundary between two neighboring characters, so comparing each character to the one right before it tells you everything you need.",
    "You don't need a dict of counts per character. Keep a running count for the current run and a separate best-so-far, and update the best as you go.",
    "Handle the empty string up front, then start both counts at `1`. Walk from index `1`: if `s[i] == s[i - 1]` grow the count, otherwise reset it to `1`, and take the max each step.",
  ],

  starterCode: `class Solution:
    def longestIdenticalRun(self, s: str) -> int:
        `,

  code: `class Solution:
  def longestIdenticalRun(self, s: str) -> int:
    '''
    first thought is to use two pointer. i also thought
    about using a dict to keep track of the longest idential
    char. each char will get a key in the dict and its value
    would be the count. pull the count -- actually what if i
    just use max. old max and new max var, then compare and use YES.
    '''
    if not s:
      return 0

    longest = 1
    count = 1

    for i in range(1, len(s)):
      if s[i] == s[i - 1]:
        count += 1
      else:
        count = 1

      longest = max(longest, count)

    return longest`,

  explanation: {
    intuition: [
      "A run of identical characters can only continue or end where one character meets the next, so a single left-to-right pass comparing each character to its neighbor is enough.",
      "We keep two numbers: `count`, the length of the run we're currently in, and `longest`, the best run seen so far. When the current character matches the previous one the run grows; when it doesn't, a new run of length `1` starts. Taking the max after every step means a run that reaches the end of the string still gets counted.",
      "The empty string is the one special case. It has no run at all, so we return `0` before the loop, which also lets both counters safely start at `1`.",
    ],
    algorithm: [
      "If `s` is empty, return `0`.",
      "Set `longest` and `count` to `1`, covering the first character.",
      "For each index `i` from `1` onward, increment `count` if `s[i] == s[i - 1]`, otherwise reset it to `1`.",
      "Update `longest = max(longest, count)` after each step.",
      "Return `longest`.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Each character is visited once." },
      space: { bigO: "O(1)", reason: "Only two counters are kept, regardless of the input size." },
    },
  },
};
