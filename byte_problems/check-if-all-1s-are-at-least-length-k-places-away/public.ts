// ========================================================= //
// Check If All 1's Are at Least Length K Places Away //
// ========================================================= //

import type { SolutionEntry } from "../types.ts";

export const checkIfAll1SAreAtLeastLengthKPlacesAway: SolutionEntry =
{
  title: "1437. Check If All 1's Are at Least Length K Places Away",

  link: "https://leetcode.com/problems/check-if-all-1s-are-at-least-length-k-places-away/",

  difficulty: "Easy",

  description: [
    "Given an binary array `nums` and an integer `k`, return `true` if all `1`'s are at least `k` places away from each other, otherwise return `false`.",
  ],

  examples: [
    {
      image: "/problem-images/check-1s-length-k-away-1.png",
      input: "`nums = [1,0,0,0,1,0,0,1], k = 2`",
      output: "`true`",
      explanation: "Each of the 1s are at least 2 places away from each other.",
    },
    {
      image: "/problem-images/check-1s-length-k-away-2.png",
      input: "`nums = [1,0,0,1,0,1], k = 2`",
      output: "`false`",
      explanation: "The second 1 and third 1 are only one apart from each other.",
    },
  ],

  constraints: [
    "`1 <= nums.length <= 10⁵`.",
    "`0 <= k <= nums.length`.",
    "`nums[i]` is `0` or `1`.",
  ],

  topics: [
    "Array",
  ],

  companies: [
    "Google",
  ],

  hints: [
    "You only really care about the gap between consecutive 1s — what single counter could you maintain as you scan through the array to measure that gap?",
    "What should happen to your counter every time you pass a 0 versus every time you hit a 1 — and at what point does hitting a 1 tell you the array already fails?",
    "Keep a `count` starting at `k` (so the very first 1 never fails); increment it on every 0, and on every 1 check if `count < k` (return False if so) before resetting `count` back to 0.",
  ],

  starterCode: `class Solution:
    def kLengthApart(self, nums: List[int], k: int) -> bool:
        `,

  code: `class Solution:
    def kLengthApart(self, nums: List[int], k: int) -> bool:
        '''
        could we just go through the array and when we hit 1, we check how much further it was from the previous 1
        could we keep track using a count var, then reset it when we hit a 1 thats farther or equal to k then
        repeat the process?
        '''
        count = k

        for i in nums:
            if i == 1:
                if count < k:
                    return False
                count = 0
            else:
                count += 1

        return True`,
};
