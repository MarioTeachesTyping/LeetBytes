import { SolutionEntry } from "../solutions";

export const validParentheses: SolutionEntry = {
  title: "20. Valid Parentheses",
  link: "https://leetcode.com/problems/valid-parentheses/",
  difficulty: "Easy",
  description: [
    "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.",
    "An input string is valid if:",
    "1. Open brackets must be closed by the same type of brackets.",
    "2. Open brackets must be closed in the correct order.",
    "3. Every close bracket has a corresponding open bracket of the same type.",
  ],
  examples: [
    {
      input: "`s = \"()\"`",
      output: "`true`",
    },
    {
      input: "`s = \"()[]{}\"`",
      output: "`true`",
    },
    {
      input: "`s = \"(]\"`",
      output: "`false`",
    },
    {
      input: "`s = \"([])\"`",
      output: "`true`",
    },
    {
      input: "`s = \"([)]\"`",
      output: "`false`",
    },
  ],
  constraints: [
    "`1 <= s.length <= 10^4`.",
    "`s` consists of parentheses only `'()[]{}'`.",
  ],
  topics: [
    "String", "Stack",
  ],
  companies: [
    "Google", "Bloomberg", "Meta",
  ],
  code: `class Solution:
    def isValid(self, s: str) -> bool:
        '''
        first thought is that we can use a stack for the parentheses
        a dictionary (hashmap) would be good for determining if it's closed/open
        need a stack (list) and dict for if its closed to open
        we do close to open so we can use it to check if the last thing in is closing
        with the string so we can proceed to pop it
        '''
        stack = []
        close_to_open = { ')': '(', '}': '{', ']': '[' }

        # iterate through each character in the given string
        for c in s:
            # check if character is in one of our keys in the dict
            if c in close_to_open:
                '''
                check if closing parentheses in string is equal to our dict
                we do -1 cause in python that is the end of the list or in our case, top of stack
                we grab the key from our dict in the 2nd half
                '''
                if stack and stack[-1] == close_to_open[c]:
                    # if they are equal you can pop since it's the last in the list (lifo)
                    stack.pop()
                # return false if not cause it means its not in correct order
                else:
                    return False
            # now we add to our stack if we dont trigger the if condition
            else:
                stack.append(c)

        # we return true if stack is empty, and false if not
        return True if not stack else False`,
  stats: {
    runtime: { label: "Runtime", value: "0 ms", beats: "100.00%" },
    memory: { label: "Memory", value: "18.06 MB", beats: "62.77%" },
  },
};