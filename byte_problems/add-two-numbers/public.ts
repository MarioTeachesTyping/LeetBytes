// =============== //
// Add Two Numbers //
// =============== //

import type { SolutionEntry } from "../types.ts";

export const addTwoNumbers: SolutionEntry = 
{
  title: "2. Add Two Numbers",

  link: "https://leetcode.com/problems/add-two-numbers/",

  difficulty: "Medium",

  description: [
    "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    "You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
  ],

  examples: [
    {
      image: "/problem-images/addtwonumber1.jpg",
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

  companies: [
    "Google", "Microsoft", "Meta", "Bloomberg", "Amazon",
  ],

  hints: [
    "You don't need to reverse anything — the lists are already stored least-significant-digit first, so you can add them the same way you'd line up digits on paper.",
    "Walk both lists at the same time with a single loop, treating a missing node as a value of 0 so lists of different lengths still work.",
    "Keep a running carry variable, and remember it can still be 1 even after both lists run out — that's what produces an extra leading digit.",
  ],

  starterCode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        `,

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

  explanation: {
    intuition: [
      "The digits are stored in reverse order, which actually makes this easier: the head of each list is the ones digit, so walking both lists from the front is exactly how you'd add two numbers by hand, right to left.",
      "At each step we add the two digits plus any `carry` from the step before. The ones digit of that sum (`val % 10`) becomes the next node of the answer, and the tens digit (`val // 10`) carries into the next step. A list that has already run out just counts as `0`, so the two lists can be different lengths.",
      "A dummy node (`l3`) sits in front of the answer so the first real node needs no special case, and the loop keeps going while `carry` is non-zero so a final carry (like 5 + 5 = 10) still gets its own node.",
    ],
    algorithm: [
      "Create a dummy node `l3`, a `curr` pointer to it, and set `carry = 0`.",
      "Loop while `l1`, `l2`, or `carry` still has something left.",
      "Read each list's digit (`0` if that list is finished) and compute `val = v1 + v2 + carry`.",
      "Split it: `carry = val // 10` and `val = val % 10`.",
      "Attach a new node holding `val`, then advance `curr`, `l1`, and `l2`.",
      "Return `l3.next`, skipping the dummy node.",
    ],
    complexity: {
      time: { bigO: "O(max(m, n))", reason: "Where m and n are the two list lengths: the loop runs once per digit of the longer list, plus at most one extra step for a final carry." },
      space: { bigO: "O(max(m, n))", reason: "That's the size of the answer list being built. Besides it, only a few variables are used." },
    },
  },
};
