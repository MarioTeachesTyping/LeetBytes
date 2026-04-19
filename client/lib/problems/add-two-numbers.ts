import { SolutionEntry } from "../solutions";

export const addTwoNumbers: SolutionEntry = {
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
};