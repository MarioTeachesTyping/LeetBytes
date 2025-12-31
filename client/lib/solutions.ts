// ================== //
// Solutions Database //
// ================== //

export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type Stat = {
  label: "Runtime" | "Memory";
  value: string;      // "0 ms", "19.05 MB"
  beats?: string;     // "100.00%", "19.44%"
};

export type SolutionEntry = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: Example[];
  constraints?: string[];
  topics?: string[];
  code: string;
  stats?: {
    runtime?: Stat;
    memory?: Stat;
  };
};


export const SOLUTIONS: Record<string, SolutionEntry> = {
  "two-sum": {
    title: "1. Two Sum",
    difficulty: "Easy",
    description: [
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      "You can return the answer in any order.",
    ],
    examples: [
      {
        input: "`nums = [2,7,11,15], target = 9`",
        output: "`[0,1]`",
        explanation: "Because `nums[0] + nums[1] == 9`, we return `[0,1]`.",
      },
      {
        input: "`nums = [3,2,4], target = 6`",
        output: "`[1,2]`",
      },
      {
        input: "`nums = [3,3], target = 6`",
        output: "`[0,1]`",
      },
    ],
    constraints: [
      "`2 ≤ nums.length ≤ 10⁴`",
      "`-10⁹ ≤ nums[i] ≤ 10⁹`",
      "`-10⁹ ≤ target ≤ 10⁹`",
      "Only one valid answer exists.",
    ],
    topics: [
      "Array", "Hash Table"
    ],
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        '''
        brute force: loop through the list twice
        O(n^2) because double for loop
        '''
        # for i in range(len(nums)):
        #     for j in range(1, len(nums)):
        #         # check if adding i and j equals target
        #         if nums[i] + nums[j] == target:
        #             return [i, j]

        # return []
      
        '''
        optimal solution: dict with one pass
        we need to find the complement of each index for our target 
        complement = target - index value | ex: ??? = 9 - 2 --> 7 = 9 - 2
        '''
        # we need a dict to keep track of our complements
        dict = {}

        # loop through the list
        for i in range(len(nums)):
            # check for our complement through a simple equation
            complement = target - nums[i]
            '''
            if complement is in our dict, then we have a solution
            if target is 9 and 2 is in dict, and our num value rn is 7, we found our
            pair for the target and can return index of complement and curr num
            '''
            if complement in dict:
                return [dict[complement], i]
            
            # add index to dict
            # key = value
            dict[nums[i]] = i
        
        # return empty list if we dont find shit
        return []`,
    stats: {
      runtime: { label: "Runtime", value: "0 ms", beats: "100.00%" },
      memory: { label: "Memory", value: "19.05 MB", beats: "19.44%" },
    },
  },
};
