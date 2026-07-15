// =========================================== //
// Minimum Remove to Make Valid Parentheses //
// =========================================== //

import type { SolutionEntry } from "../types.ts";

export const minimumRemoveToMakeValidParentheses: SolutionEntry =
{
  title: "1249. Minimum Remove to Make Valid Parentheses",

  link: "https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/",

  difficulty: "Medium",

  description: [
    "Given a string s of `'('` , `')'` and lowercase English characters.",
    "Your task is to remove the minimum number of parentheses ( `'('` or `')'`, in any positions ) so that the resulting parentheses string is valid and return any valid string.",
    "Formally, a parentheses string is valid if and only if:",
    "It is the empty string, contains only lowercase characters, or",
    "It can be written as `AB` (`A` concatenated with `B`), where `A` and `B` are valid strings, or",
    "It can be written as `(A)`, where `A` is a valid string.",
  ],

  examples: [
    {
      input: "`s = \"lee(t(c)o)de)\"`",
      output: "`\"lee(t(c)o)de\"`",
      explanation: "\"lee(t(co)de)\" , \"lee(t(c)ode)\" would also be accepted.",
    },
    {
      input: "`s = \"a)b(c)d\"`",
      output: "`\"ab(c)d\"`",
    },
    {
      input: "`s = \"))((\"`",
      output: "`\"\"`",
      explanation: "An empty string is also valid.",
    },
  ],

  constraints: [
    "`1 <= s.length <= 10⁵`.",
    "`s[i]` is either `'('` , `')'`, or lowercase English letter.",
  ],

  topics: [
    "String", "Stack",
  ],

  companies: [
    "Meta",
  ],

  starterCode: `class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        `,

  code: `class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        '''
        u: remove any parentheses that make the string invalid. show the final string after doing so
        p: stack. we need to look out for any extra parentheses. to do this we can keep track of their index
            and use a set to put their index in there so we know which ones to delete
            we have 3 cases to look out for: if ( then push to stack.  if char then continue. if ) then
            pop if theres a (. if not then add to our set. if there are extra (, add to set after
            once we do that make a new list with the correct shit and then turn it into a string
        i: stack = [], indexes_to_remove = set()
            for index, char in enumerate(s):
                if not "()":
                    continue
                elif "(":
                    stack.append(index)
                else:
                    stack.pop()
            indexes_to_remove = indexes_to_remove.union(stack)
            answer = []
            for index, char in enumerate(s):
                answer.append()
        '''
        stack = []
        indexes_to_remove = set()

        for i, c in enumerate(s):
            if c not in "()":
                continue

            if c == "(":
                stack.append(i)
            # if stack is empty and it's ")" add to set
            elif not stack:
                indexes_to_remove.add(i)
            # stack has "(" and the index is ")"
            else:
                stack.pop()

        # add any extra "(" to the set
        indexes_to_remove = indexes_to_remove.union(set(stack))
        new_string = []

        for i, c in enumerate(s):
            if i not in indexes_to_remove:
                new_string.append(c)

        # make final answer back into a string
        return "".join(new_string)`,
};
