import { SolutionEntry } from "../solutions";

export const longestPalindromicSubstring: SolutionEntry = {
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
    "Two Pointers", "String", "Dynammic Programming"
  ],
  companies: [
    "Microsoft", "Google", "tcs", "Amazon",
  ],
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
  stats: {
    runtime: { label: "Runtime", value: "2896 ms", beats: "18.76%" },
    memory: { label: "Memory", value: "17.76 MB", beats: "68.52%" },
  },
};