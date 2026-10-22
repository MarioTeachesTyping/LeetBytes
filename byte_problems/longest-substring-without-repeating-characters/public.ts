// ============================================== //
// Longest Substring Without Repeating Characters //
// ============================================== //

import type { SolutionEntry } from "../types.ts";

export const longestSubstringWithoutRepeatingCharacters: SolutionEntry = 
{
  title: "3. Longest Substring Without Repeating Characters",

  link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",

  difficulty: "Medium",

  description: [
    "Given a string `s`, find the length of the longest substring without duplicate characters.",
  ],

  examples: [
    {
      input: "`s = \"abcabcbb\"`",
      output: "`3`",
      explanation: "The answer is \"abc\", with the length of 3. Note that `\"bca\"` and `\"cab\"` are also correct answers.",
    },
    {
      input: "`s = \"bbbbb\"`",
      output: "`1`",
      explanation: "The answer is \"b\", with the length of 1.",
    },
    {
      input: "`s = \"pwwkew\"`",
      output: "`3`",
      explanation: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
    },
  ],

  constraints: [
    "`0 <= s.length <= 5 * 10⁴`.",
    "`s` consists of English letters, digits, symbols and spaces.",
  ],

  topics: [
    "Hash Table", "String", "Sliding Window"
  ],

  companies: [
    "Amazon", "Google", "Microsoft",
  ],

  hints: [
    "Checking every possible substring is wasteful — think about tracking a window of characters that grows and shrinks as you scan through the string once.",
    "Keep a set of the characters currently in your window; hitting a duplicate is the signal to start shrinking the window from the left.",
    "Move the left edge forward (removing characters from the set as you go) until the duplicate is gone, then update your answer with the current window size.",
  ],

  starterCode: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,

  code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # first thought is sliding window and using a set due to:
        # no duplicates allowed and needing to check 2 spots potentially

        # need to create a left and right pointer, result, and set
        char_set = set()
        l = 0
        res = 0

        # our right pointer will be moved constantly so its used in our loop
        for r in range(len(s)):
            # we check if our right pointer is already in the set
            while s[r] in char_set:
                # remove the left pointer value from our window
                char_set.remove(s[l])
                # increment left pointer
                l += 1

            # add our right pointer to the set
            char_set.add(s[r])

            # update res with length of substring
            res = max(res, r - l + 1)
        
        return res`,

  explanation: {
    intuition: [
      "Think of a window sliding over the string, from `l` to `r`, that never contains a repeated character. A set (`char_set`) holds the characters currently in the window, so checking for a repeat is O(1).",
      "Each step moves `r` one character to the right. If `s[r]` is already in the window, we shrink it from the left, removing characters until that duplicate is gone. The window is valid again after that, so its length `r - l + 1` is a candidate for the answer.",
    ],
    algorithm: [
      "Start with an empty `char_set`, `l = 0`, and `res = 0`.",
      "Move `r` across the string one index at a time.",
      "While `s[r]` is already in `char_set`, remove `s[l]` from the set and move `l` right.",
      "Add `s[r]` to the set and update `res` with `r - l + 1` if it's bigger.",
      "Return `res`.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Each character is added to the set once (by `r`) and removed at most once (by `l`), so both pointers move at most n times in total." },
      space: { bigO: "O(min(n, k))", reason: "The set only holds the current window, which is limited by both the string length n and the number of distinct characters k." },
    },
  },
};
