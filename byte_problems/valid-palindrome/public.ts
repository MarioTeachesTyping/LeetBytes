// ================ //
// Valid Palindrome //
// ================ //

import type { SolutionEntry } from "../types.ts";

export const validPalindrome: SolutionEntry =
{
  title: "125. Valid Palindrome",

  link: "https://leetcode.com/problems/valid-palindrome/",

  difficulty: "Easy",

  description: [
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
    "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
  ],

  examples: [
    {
      input: "`s = \"A man, a plan, a canal: Panama\"`",
      output: "`true`",
      explanation: "\"amanaplanacanalpanama\" is a palindrome.",
    },
    {
      input: "`s = \"race a car\"`",
      output: "`false`",
      explanation: "\"raceacar\" is not a palindrome.",
    },
    {
      input: "`s = \" \"`",
      output: "`true`",
      explanation: "s is an empty string \"\" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.",
    },
  ],

  constraints: [
    "`1 <= s.length <= 2 * 10⁵`.",
    "`s` consists only of printable ASCII characters.",
  ],

  topics: [
    "Two Pointers", "String",
  ],

  hints: [
    "Think about comparing the string from both ends inward instead of building a cleaned-up copy first — what would two pointers, one starting at each end, let you check as they move toward each other?",
    "Not every character counts — when a pointer lands on something that isn't a letter or digit, what should happen before you compare it to the other side?",
    "Move the left pointer right and the right pointer left, skipping any non-alphanumeric characters as you go, and compare the lowercase version of each side — return False the moment a mismatch occurs.",
  ],

  starterCode: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        `,

  code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        '''
        two pointers. one at the start and one at the end.
        if it's not a letter, move right and/or left.
        if it's not the same after, return false.
        '''
        l = 0
        r = len(s) - 1

        while l < r:

            while l < r and not s[l].isalnum():
                l += 1
            while l < r and not s[r].isalnum():
                r -= 1

            if s[l].lower() != s[r].lower():
                return False

            l += 1
            r -= 1

        return True`,

  explanation: {
    intuition: [
      "Instead of building a cleaned-up copy of the string, two pointers compare it in place from both ends. Only letters and digits count, so each pointer skips past anything that isn't alphanumeric (`isalnum()`) before comparing.",
      "Characters are compared lowercased, so `A` and `a` match. The first mismatch means it isn't a palindrome. If the pointers meet without one, it is.",
    ],
    algorithm: [
      "Put `l` at the start and `r` at the end of `s`.",
      "While `l < r`, move `l` right past non-alphanumeric characters and `r` left past them too.",
      "If `s[l].lower() != s[r].lower()`, return `False`.",
      "Otherwise move both pointers inward and continue.",
      "Return `True` once the pointers meet.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Each character is visited at most once by one of the pointers." },
      space: { bigO: "O(1)", reason: "Only the two pointers are stored. No cleaned copy of the string is made." },
    },
  },
};
