// ================= //
// Linked List Cycle //
// ================= //

import type { SolutionEntry } from "../types.ts";

export const linkedListCycle: SolutionEntry =
{
  title: "141. Linked List Cycle",

  link: "https://leetcode.com/problems/linked-list-cycle/",

  difficulty: "Easy",

  description: [
    "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.",
    "There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. Note that `pos` is not passed as a parameter.",
    "Return `true` if there is a cycle in the linked list. Otherwise, return `false`.",
  ],

  examples: [
    {
      image: "/problem-images/link-list-cycle-1.png",
      input: "`head = [3,2,0,-4], pos = 1`",
      output: "`true`",
      explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
    },
    {
      image: "/problem-images/link-list-cycle-2.png",
      input: "`head = [1,2], pos = 0`",
      output: "`true`",
      explanation: "There is a cycle in the linked list, where the tail connects to the 0th node.",
    },
    {
      image: "/problem-images/link-list-cycle-3.png",
      input: "`head = [1], pos = -1`",
      output: "`false`",
      explanation: "There is no cycle in the linked list.",
    },
  ],

  constraints: [
    "The number of the nodes in the list is in the range `[0, 10⁴]`.",
    "`-10⁵ <= Node.val <= 10⁵`.",
    "`pos` is `-1` or a valid index in the linked-list.",
  ],

  topics: [
    "Hash Table", "Linked List", "Two Pointers",
  ],

  companies: [
    "Google", "Meta", "Microsoft", "Amazon",
  ],

  hints: [
    "You could track every node you've visited in a set and check for repeats, but that costs extra memory — is there a way to detect a cycle using just two pointers and no extra storage?",
    "If one pointer moves through the list twice as fast as another, what has to happen eventually if the list loops back on itself — and what happens instead if it doesn't?",
    "Move a `slow` pointer one step and a `fast` pointer two steps each iteration (guarding against `fast` or `fast.next` being null); if `slow` and `fast` are ever the same node, there's a cycle.",
  ],

  starterCode: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        `,

  code: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:

        '''
        this is one of the few questions to utilize it but we can use the slow fast method
        essentially if slow moves once and fast moves twice, they will end up meeting
        at some point. we can implement this in code using a while loop and 2 head nodes
        '''
        slow = head
        fast = head

        '''
        keep looping while fast and next fast are not null. we do both since if fast is null
        then there is no cycle and fat next is used to make sure we can move by 2 in general
        '''
        while fast and fast.next:
            # move slow once and fast twice
            slow = slow.next
            fast = fast.next.next

            # if they meet, then there is a cycle
            if slow == fast:
                return True

        return False`,
};
