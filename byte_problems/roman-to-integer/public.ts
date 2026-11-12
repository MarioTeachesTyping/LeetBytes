// ================ //
// Roman to Integer //
// ================ //

import type { SolutionEntry } from "../types.ts";

export const romanToInteger: SolutionEntry =
{
  title: "13. Roman to Integer",

  link: "https://leetcode.com/problems/roman-to-integer/",

  difficulty: "Easy",

  description: [
    "Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.",
    "`I` = `1`, `V` = `5`, `X` = `10`, `L` = `50`, `C` = `100`, `D` = `500`, `M` = `1000`.",
    "For example, `2` is written as `II` in Roman numeral, just two ones added together. `12` is written as `XII`, which is simply `X + II`. The number `27` is written as `XXVII`, which is `XX + V + II`.",
    "Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as `IX`. There are six instances where subtraction is used:",
    "1. `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.",
    "2. `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.",
    "3. `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.",
    "Given a roman numeral, convert it to an integer.",
  ],

  examples: [
    {
      input: "`s = \"III\"`",
      output: "`3`",
      explanation: "`III = 3`.",
    },
    {
      input: "`s = \"LVIII\"`",
      output: "`58`",
      explanation: "`L = 50`, `V = 5`, `III = 3`.",
    },
    {
      input: "`s = \"MCMXCIV\"`",
      output: "`1994`",
      explanation: "`M = 1000`, `CM = 900`, `XC = 90` and `IV = 4`.",
    },
  ],

  constraints: [
    "`1 <= s.length <= 15`",
    "`s` contains only the characters `('I', 'V', 'X', 'L', 'C', 'D', 'M')`.",
    "It is guaranteed that `s` is a valid roman numeral in the range `[1, 3999]`.",
  ],

  topics: [
    "Hash Table", "Math", "String",
  ],

  companies: [
    "Google", "Microsoft", "Amazon", "Meta", "tcs",
  ],

  hints: [
    "Start by storing each symbol's value somewhere you can look it up instantly. The real question is when a symbol should be added and when it should be subtracted.",
    "A symbol is subtracted only when a bigger symbol comes right after it. Reading the numeral from right to left means you've always just seen the symbol to its right.",
    "Start your total at the value of the last symbol, then walk backward from the second-to-last: add the current value if it's at least the value to its right, otherwise subtract it.",
  ],

  starterCode: `class Solution:
    def romanToInt(self, s: str) -> int:
        `,

  code: `class Solution:
    def romanToInt(self, s: str) -> int:
        '''
        this works well with a dict but the tricky part is
        going through the roman numeral backwards due to the
        subtraction rules. going through it backwards allows
        us to subtract the next roman numeral easily by
        checking it's value to the right of it and seeing if
        it's smaller or bigger.
        '''
        values = {"I": 1,
                  "V": 5,
                  "X": 10,
                  "L": 50,
                  "C": 100,
                  "D": 500,
                  "M": 1000}

        answer = values[s[-1]]

        for i in reversed(range(len(s) - 1)):
            current = values[s[i]]
            right = values[s[i + 1]]

            if current >= right:
                answer += current
            else:
                answer -= current

        return answer`,

  explanation: {
    intuition: [
      "A dict maps each symbol to its value, so the only real decision is whether a symbol adds or subtracts. A symbol subtracts only when it sits right before a bigger one, like the `I` in `IV` or the `C` in `CM`.",
      "Going from right to left makes that check easy, since the symbol to the right is the one we just looked at. The last symbol never has anything to its right, so it's always added, which is why `answer` starts at its value.",
      "From there, each symbol is compared to its right-hand neighbor. If it's at least as big, it adds, as in `VI` or `II`. If it's smaller, it's one of the six subtraction pairs and it subtracts.",
    ],
    algorithm: [
      "Build `values`, mapping each of the seven symbols to its value.",
      "Set `answer` to the value of the last symbol, `s[-1]`.",
      "Loop `i` from `len(s) - 2` down to `0`, comparing `values[s[i]]` to `values[s[i + 1]]`.",
      "Add the current value if it's greater than or equal to the one on its right, otherwise subtract it.",
      "Return `answer`.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Each symbol is visited once, and every dict lookup is O(1). Since `s` is at most 15 characters, this is effectively constant." },
      space: { bigO: "O(1)", reason: "The dict always holds the same seven symbols, no matter the input." },
    },
  },
};
