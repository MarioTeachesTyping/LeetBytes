// ================= //
// Sequential Digits //
// ================= //

import type { SolutionEntry } from "../types.ts";

export const sequentialDigits: SolutionEntry =
{
  title: "1291. Sequential Digits",

  link: "https://leetcode.com/problems/sequential-digits/",

  difficulty: "Medium",

  description: [
    "An integer has sequential digits if and only if each digit in the number is one more than the previous digit.",
    "Return a sorted list of all the integers in the range `[low, high]` inclusive that have sequential digits.",
  ],

  examples: [
    {
      input: "`low = 100, high = 300`",
      output: "`[123,234]`",
    },
    {
      input: "`low = 1000, high = 13000`",
      output: "`[1234,2345,3456,4567,5678,6789,12345]`",
    },
  ],

  constraints: [
    "`10 <= low <= high <= 10⁹`.",
  ],

  topics: [
    "Enumeration",
  ],

  companies: [
    "Google", "Amazon", "Bloomberg", "Meta",
  ],

  hints: [
    "Every sequential-digit number is just a contiguous run of digits from the fixed string `\"123456789\"` — so instead of generating and checking numbers one by one, could you slide a window across that one string?",
    "What determines the possible window lengths you need to try, and how does that relate to the number of digits in `low` and `high`?",
    "For each `length` from `len(str(low))` to `len(str(high))`, slide a window of that size across `\"123456789\"`, converting each slice to an int; keep it if it falls between `low` and `high` inclusive.",
  ],

  starterCode: `class Solution:
    def sequentialDigits(self, low: int, high: int) -> List[int]:
        `,

  code: `class Solution:
    def sequentialDigits(self, low: int, high: int) -> List[int]:
        '''
        u: return a list of numbers that are sequential in number order and fit between the low
            and high numbers given
        p: we could make a base number that is the highest possible sequential number being
            123456789. we can use it for the sliding window method. find parts of the integer to
            make into substrings that will then be converted to ints for our nums list
        i: window = 123456789, n = 10 # boundary for our sample, nums = []
            # find the length of where the num can fit
            for length in len(str(low), len(str(high))):
                # find the start of digits we can use for our sequentalitlittyyy
                for start in len(n - length):
                    # figure out the digits/nums we can use
                    num = int(sample[start : start + length])
                    if num >= low and num <= high:
                        nums.append[num]
            return nums
        '''
        sample = "123456789"
        n = 10
        nums = []

        for length in range(len(str(low)), len(str(high)) + 1):
            for start in range(n - length):
                num = int(sample[start : start + length])

                if num >= low and num <= high:
                    nums.append(num)

        return nums`,
};
