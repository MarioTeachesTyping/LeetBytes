import { SolutionEntry } from "../solutions";

export const palindromeNumber: SolutionEntry = {
  title: "9. Palindrome Number",
  link: "https://leetcode.com/problems/palindrome-number/",
  difficulty: "Easy",
  description: [
    "Given an integer `x`, return `true` if `x` is a palindrome integer.",
    "An integer is a palindrome when it reads the same backward as forward.",
    "For example, `121` is a palindrome while `123` is not.",
  ],
  examples: [
    {
      input: "`x = 121`",
      output: "`true`",
      explanation: "121 reads as 121 from left to right and from right to left.",
    },
    {
      input: "`x = -121`",
      output: "`false`",
      explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
    },
    {
      input: "`x = 10`",
      output: "`false`",
      explanation: "Reads 01 from right to left. Therefore it is not a palindrome.",
    },
  ],
  constraints: [
    "`-2³¹ <= x <= 2³¹ - 1`.",
  ],
  topics: [
    "Math",
  ],
  companies: [
    "Google", "Amazon", "Microsoft", "Bloomberg",
  ],
  code: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        '''
        u: return true if the integer can be read backwards
            and forward. if theres a negative its just wrong everytime
        p: simplest way to do this that I can think of is using two pointers. left 
            at start and right at end. then have a while loop that moves everytime
            each side is the same number then when both collide, return true 
            since it's the same return false if different at any point
        '''
        # make the int a string so we can increment
        nums = str(x)
        
        l = 0
        r = len(nums) - 1
        
        # stop when right and left meet
        while r > l:
            # if l and r are different, return false
            if nums[l] != nums[r]:
                return False
            
            # move both pointers towards each other
            l += 1
            r -= 1

        return True`,
  stats: {
    runtime: { label: "Runtime", value: "0 ms", beats: "100.00%" },
    memory: { label: "Memory", value: "17.69 MB", beats: "65.41%" },
  },
};