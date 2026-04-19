import { SolutionEntry } from "../solutions";

export const mergeTwoSortedLists: SolutionEntry = {
  title: "21. Merge Two Sorted Lists",
  link: "https://leetcode.com/problems/merge-two-sorted-lists/",
  difficulty: "Easy",
  description: [
    "You are given the head of two sorted linked lists.",
    "Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.",
    "Return the head of the merged linked list.",
  ],
  examples: [
    {
      image: "/problem-images/merge_ex1.jpg",
      input: "`list1 = [1,2,4], list2 = [1,3,4]`",
      output: "`[1,1,2,3,4,4]`",
    },
    {
      input: "`list1 = [], list2 = []`",
      output: "`[]`",
    },
    {
      input: "`list1 = [], list2 = [0]`",
      output: "`[0]`",
    },
  ],
  constraints: [
    "The number of nodes in both lists is in the range `[0, 50]`.",
    "`-100 <= Node.val <= 100`",
    "Both `list1` and `list2` are sorted in non-decreasing order.",
  ],
  topics: [
    "Linked List", "Recursion",
  ],
  companies: [
    "Google", "Amazon", "Udemy",
  ],
  code: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        '''
        first thought is using iteration and if else statement to check for which value is bigger
        we need to create a new node and then give it value properties
        '''
        merged = ListNode()
        tail = merged

        # keep looping while both lists are not null
        while list1 and list2:
            # if list1.val is bigger than list2.val
            if list1.val <= list2.val:
                # put it into our merged list and move list1 node
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            
            # update tail pointer
            tail = tail.next
            
        # check if either list has nodes still while the other is done
        if list1:
            tail.next = list1
        elif list2:
            tail.next = list2
        
        # its merged.next cause merged and tail at first were null nodes at the start of the list
        # doing this makes it point it to the 1st node in our new sorted merged list
        return merged.next`,
  stats: {
    runtime: { label: "Runtime", value: "0 ms", beats: "100.00%" },
    memory: { label: "Memory", value: "17.74 MB", beats: "67.49%" },
  },
};