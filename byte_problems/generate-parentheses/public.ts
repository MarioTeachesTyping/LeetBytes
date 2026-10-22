// ==================== //
// Generate Parentheses //
// ==================== //

import type { SolutionEntry } from "../types.ts";

export const generateParentheses: SolutionEntry = 
{
  title: "22. Generate Parentheses",

  link: "https://leetcode.com/problems/generate-parentheses/",

  difficulty: "Medium",

  description: [
    "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
  ],

  examples: [
    {
      input: "`n = 3`",
      output: "`[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]`",
    },
    {
      input: "`n = 1`",
      output: "`[\"()\"]`",
    },
    
  ],

  constraints: [
    "`1 <= n <= 8`.",
  ],

  topics: [
    "String", "Dynamic Programming", "Backtracking",
  ],

  companies: [
    "Amazon", "Google", "Meta",
  ],

  hints: [
    "Seeing 'all combinations' should point you away from iteration and toward exploring choices recursively — what problem-solving technique is built for trying every valid path and undoing bad ones?",
    "At each step in your recursion you're choosing to add either '(' or ')' — track how many of each you've placed so far so you know which choices are still legal.",
    "You can add '(' as long as you haven't used all n yet, and you can only add ')' when it wouldn't outnumber the '(' already placed — stop and record the string once its length hits 2n.",
  ],

  starterCode: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        `,

  code: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        '''
        u: generate as many pairs of n valid parentheses in one list as strings. this could "()()"
            or even "((((()))))()".
        p: seeing keywords like 'all combinations' immediately tells me to use backtracking for
            the solution. we can do this by creating an answer list to return at the end and then
            our backtracking function. we would need to know the current state of our string and
            then the, left count of parentheses we can do, and right count of parentheses.
            do a couple of if statements to check things so backtracking knows when to stop
        i: answer = []
            def backtrack(current, left_count, right_count):
                if current <= 2 * n:
                    soemthing
                if left_count < n:
                    add left
                if right_count < left_count:
                    add right
            return answer
        '''
        res = []

        def backtrack(cur_res, left_count, right_count):
            # check if length of current parentheses matches n ex: 3 so ()()()
            if len(cur_res) == 2 * n:
                # join the combination together then leave
                res.append("".join(cur_res))
                return
            # if left count is less than n (3) add a left parentheses
            if left_count < n:
                cur_res.append("(")
                backtrack(cur_res, left_count + 1, right_count)
                cur_res.pop()
            # if right count is less than left count add a right parentheses
            if right_count < left_count:
                cur_res.append(")")
                backtrack(cur_res, left_count, right_count + 1)
                cur_res.pop()
        
        backtrack([], 0, 0)

        return res`,

  explanation: {
    intuition: [
      "The question asks for all combinations, which points to backtracking: build each string one character at a time, explore every choice, and undo it afterward to try the next one.",
      "The trick is to only ever make choices that keep the string valid. A `(` can be added while fewer than `n` have been opened (`left_count < n`), and a `)` can only be added if it closes something that's open (`right_count < left_count`). Because of those two rules, every string that reaches length `2 * n` is already valid, so nothing has to be generated and then thrown away.",
    ],
    algorithm: [
      "Start backtracking from an empty `cur_res` with both counts at `0`.",
      "If `cur_res` has length `2 * n`, join it into a string, add it to `res`, and return.",
      "If `left_count < n`, append `(`, recurse with `left_count + 1`, then pop it off.",
      "If `right_count < left_count`, append `)`, recurse with `right_count + 1`, then pop it off.",
      "Return `res` once the first call finishes.",
    ],
    complexity: {
      time: { bigO: "O(4ⁿ / √n)", reason: "The number of valid strings is the nth Catalan number, which grows roughly like 4ⁿ / (n√n), and building each finished string takes O(n)." },
      space: { bigO: "O(n)", reason: "The recursion goes at most `2 * n` calls deep, and `cur_res` holds at most `2 * n` characters (not counting the output)." },
    },
  },
};
