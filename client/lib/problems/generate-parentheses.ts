import { SolutionEntry } from "../solutions";

export const generateParentheses: SolutionEntry = {
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
  stats: {
    runtime: { label: "Runtime", value: "0 ms", beats: "100.00%" },
    memory: { label: "Memory", value: "18.01 MB", beats: "66.30%" },
  },
};