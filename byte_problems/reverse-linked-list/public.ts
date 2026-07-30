// ==================== //
// Reverse Linked List //
// ==================== //

import type { SolutionEntry } from "../types.ts";

export const reverseLinkedList: SolutionEntry =
{
  title: "206. Reverse Linked List",

  link: "https://leetcode.com/problems/reverse-linked-list/",

  difficulty: "Easy",

  description: [
    "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
  ],

  examples: [
    {
      image: "/problem-images/rev-link-list-1.jpg",
      input: "`head = [1,2,3,4,5]`",
      output: "`[5,4,3,2,1]`",
    },
    {
      image: "/problem-images/rev-link-list-2.jpg",
      input: "`head = [1,2]`",
      output: "`[2,1]`",
    },
    {
      input: "`head = []`",
      output: "`[]`",
    },
  ],

  constraints: [
    "The number of nodes in the list is the range `[0, 5000]`.",
    "`-5000 <= Node.val <= 5000`",
  ],

  topics: [
    "Linked List", "Recursion",
  ],

  companies: [
    "Google", "Amazon", "Bloomberg", "Microsoft",
  ],

  hints: [
    "If you already had the rest of the list reversed starting from the second node, what single pointer change would attach the current node to the end of that reversed portion?",
    "Recursing all the way to the last node first, then working backwards as the calls return, means each node only needs to worry about pointing its old 'next' node back at itself — what would happen if you didn't also clear the original `next` pointer?",
    "Recurse to the base case (`head` is null or `head.next` is null, return `head`), then on the way back up set `head.next.next = head`, set `head.next = None` to break the old forward link, and return the same reversed head all the way up.",
  ],

  starterCode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,

  code: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:

        '''
        first instinct is to use recursion on this like alot of linked problems
        we can essentially use recursion to move the node, and do some operations
        to reverse the list during it, and check for base cases
        the base case checks if we're done reversing since head will be the tail
        '''
        if (not head) or (not head.next):
            return head

        # move our node through the list
        reverse = self.reverseList(head.next)

        '''
        this part is confusing but essentially we're having our head point back
        to our next node. think of head as 1 in this example
        1 -> 2
        2.next = head (1)
        2 -> 1
        '''
        head.next.next = head

        '''
        right now, head.next still points to next so we need to kill the cycle
        by making head.next = null so now it's only pointing in reverse
        '''
        head.next = None

        return reverse`,
};
