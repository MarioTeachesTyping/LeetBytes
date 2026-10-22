// ============================= //
// Longest Palindromic Substring //
// ============================= //

import type { SolutionEntry } from "../types.ts";

export const longestPalindromicSubstring: SolutionEntry = 
{
  title: "5. Longest Palindromic Substring",

  link: "https://leetcode.com/problems/longest-palindromic-substring/",

  difficulty: "Medium",

  description: [
    "Given a string `s`, return the longest palindromic substring in `s`.",
    "Palindromic- a string is palindromic if it reads the same forwards and backwards.",
    "Substring- a substring is a contiguous non-empty sequence of characters within a string.",
  ],

  examples: [
    {
      input: "`s = \"babad\"`",
      output: "`\"bab\"`",
      explanation: "\"aba\" is also a valid answer.",
    },
    {
      input: "`s = \"cbbd\"`",
      output: "`\"bb\"`",
    },
  ],

  constraints: [
    "`1 <= s.length <= 1000`.",
    "`s` consist of only digits and English letters.",
  ],

  topics: [
    "Two Pointers", "String", "Dynamic Programming"
  ],

  companies: [
    "Microsoft", "Google", "tcs", "Amazon",
  ],

  hints: [
    "Since we want the longest match, would it be worth checking candidate substrings starting from the biggest possible length down to the smallest, so you can return as soon as one works?",
    "You'll need a helper that can tell you whether a given substring reads the same forwards and backwards — how would two pointers moving toward each other from both ends answer that?",
    "Loop over every possible substring length from longest to shortest, and within that every possible starting index, calling your palindrome checker on each — the first one that passes is your answer.",
  ],

  starterCode: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        `,

  code: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        '''
        first thought is 2 pointer even if it's not most optimal
        left will be at the start and right will be at the end
        they will both move towards the center, checking if it's a palindrome at
        every step. we can do this by making a helper function
        we can then brute force with double for loop for checking our shit
        '''
        def palindrome(i, j):
            # left at start, right at end
            left = i
            right = j - 1

            # usual 2 pointer stuff
            while left < right:
                # we check if its not a palindrome
                if s[left] != s[right]:
                    return False

                # increment both pointers
                left += 1
                right -= 1
                    
            return True

        # we start at the end of string so we find our palindrome immediately
        for length in range(len(s), 0, -1):
            # this is the start of the substring itself
            for start in range(len(s) - length + 1):
                # call palindrome and check if it's palindromic
                if palindrome(start, start + length):
                    # start + length because start = 2, length = 3 then s[2 : 5]
                    return s[start : start + length]

        return ""`,

  explanation: {
    intuition: [
      "This is a brute force solution with one smart twist: it checks substring lengths from longest to shortest. That means the very first palindrome it finds is guaranteed to be the longest one, so it can return right away instead of checking every substring.",
      "The helper `palindrome(i, j)` checks whether `s[i:j]` is a palindrome using two pointers that start at both ends and walk toward the middle, stopping at the first mismatch.",
    ],
    algorithm: [
      "Try every substring length, starting at `len(s)` and counting down to `1`.",
      "For each length, slide a `start` index over every position where a substring of that length fits.",
      "Check `s[start : start + length]` with the `palindrome` helper.",
      "Return the first substring that passes, since nothing longer is left to check.",
    ],
    complexity: {
      time: { bigO: "O(n³)", reason: "There are O(n²) substrings and checking one takes up to O(n). Returning early often helps, but a string with no long palindromes still forces almost every check, which is why this solution is slow. Expanding outward from each possible center brings it down to O(n²)." },
      space: { bigO: "O(1)", reason: "The helper only uses two pointers, so no extra space grows with the input (not counting the returned substring)." },
    },
  },
};
