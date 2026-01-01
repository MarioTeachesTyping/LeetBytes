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
  "add-two-numbers": {
    title: "2. Add Two Numbers",
    difficulty: "Medium",
    description: [
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
      "You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    ],
    examples: [
      {
        input: "`l1 = [2,4,3], l2 = [5,6,4]`",
        output: "`[7,0,8]`",
        explanation: "342 + 465 = 807.",
      },
      {
        input: "`l1 = [0], l2 = [0]`",
        output: "`[0]`",
      },
      {
        input: "`l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]`",
        output: "`[8,9,9,9,0,0,0,1]`",
      },
    ],
    constraints: [
      "The number of nodes in each linked list is in the range `[1, 100]`.",
      "`0 <= Node.val <= 9`",
      "It is guaranteed that the list represents a number that does not have leading zeros.",
    ],
    topics: [
      "Linked List", "Math", "Recursion"
    ],
    code: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        
        '''
        the output itself is in regular order. the whole reverse part is kind of making it sound
        harder than it is
        it's like regular addiiton except we need to worry about the value and carry number alot
        we can implement this sort of math with a while loop making sure list1 or list2 is not null
        then making a dummy node for our new linked list and a carry variable for that operation
        '''
        l3 = ListNode()
        curr = l3

        # imagine 8 + 7. you need to carry over a 1 to complete the operation
        carry = 0

        # while list1, list2, or our carry number is not null
        while l1 or l2 or carry:

            # get our values from the 2 lists if they arent empty
            v1 = l1.val if l1 else 0
            v2 = l2.val if l2 else 0
            
            # regular addition
            val = v1 + v2 + carry

            '''
            for our carry we only need the top digit (tens)
            for example if its 17 and we integer divide by 10 we get 1
            we do the opposite with our val and we get the remainder or ones digit so 7
            '''
            carry = val // 10
            val = val % 10

            # add the new value to a node
            curr.next = ListNode(val)
        
            # update pointers
            curr = curr.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        
        return l3.next`,
    stats: {
      runtime: { label: "Runtime", value: "3 ms", beats: "72.91%" },
      memory: { label: "Memory", value: "17.98 MB", beats: "28.17%" },
    },
  },
  "longest-substring-without-repeating-characters": {
    title: "3. Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: [
      "Given a string `s`, find the length of the longest substring without duplicate characters.",
    ],
    examples: [
      {
        input: "`s = \"abcabcbb\"`",
        output: "`3`",
        explanation: "The answer is \"abc\", with the length of 3. Note that `\"bca\"` and `\"cab\"` are also correct answers.",
      },
      {
        input: "`s = \"bbbbb\"`",
        output: "`1`",
        explanation: "The answer is \"b\", with the length of 1.",
      },
      {
        input: "`s = \"pwwkew\"`",
        output: "`3`",
        explanation: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      },
    ],
    constraints: [
      "`0 <= s.length <= 5 * 10⁴`.",
      "`s` consists of English letters, digits, symbols and spaces.",
    ],
    topics: [
      "Hash Table", "String", "Sliding Window"
    ],
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:

        # first thought is sliding window and using a set due to:
        # no duplicates allowed and needing to check 2 spots potentially

        # need to create a left and right pointer, result, and set
        char_set = set()
        l = 0
        res = 0

        # our right pointer will be moved constantly so its used in our loop
        for r in range(len(s)):
            # we check if our right pointer is already in the set
            while s[r] in char_set:
                # remove the left pointer value from our window
                char_set.remove(s[l])
                # increment left pointer
                l += 1

            # add our right pointer to the set
            char_set.add(s[r])

            # update res with length of substring
            res = max(res, r - l + 1)
        
        return res`,
    stats: {
      runtime: { label: "Runtime", value: "18 ms", beats: "57.85%" },
      memory: { label: "Memory", value: "17.94 MB", beats: "27.39%" },
    },
  },
};
