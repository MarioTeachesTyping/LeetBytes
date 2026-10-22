// ========= //
// Same Tree //
// ========= //

import type { SolutionEntry } from "../types.ts";

export const sameTree: SolutionEntry =
{
  title: "100. Same Tree",

  link: "https://leetcode.com/problems/same-tree/",

  difficulty: "Easy",

  description: [
    "Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.",
    "Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
  ],

  examples: [
    {
      image: "/problem-images/same-tree-1.jpg",
      input: "`p = [1,2,3], q = [1,2,3]`",
      output: "`true`",
    },
    {
      image: "/problem-images/same-tree-2.jpg",
      input: "`p = [1,2], q = [1,null,2]`",
      output: "`false`",
    },
    {
      image: "/problem-images/same-tree-3.jpg",
      input: "`p = [1,2,1], q = [1,1,2]`",
      output: "`false`",
    },
  ],

  constraints: [
    "The number of nodes in both trees is in the range `[0, 100]`.",
    "`-10⁴ <= Node.val <= 10⁴`.",
  ],

  topics: [
    "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree",
  ],

  companies: [
    "Google", "Amazon", "Meta",
  ],

  hints: [
    "Two trees only match if every corresponding pair of nodes matches — what would it mean if you compared `p` and `q` at the root, then made the exact same comparison one level down?",
    "Before you can compare values, you need to handle the shape mismatches first — what should happen if one node is null and the other isn't, versus if they're both null?",
    "Check the base cases first (`if not p and not q: return True`, `if not p or not q: return False`, `if p.val != q.val: return False`), then return `isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`.",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:

        # base case: if p and q is null then return true
        if not p and not q:
            return True
        # 2nd base case: if p or q is null then return false
        if not p or not q:
            return False
        # 3rd base case: if p.val and q.val are not equal then return false
        if p.val != q.val:
            return False

        # isSameTree(p->left, q->left)
        left = self.isSameTree(p.left, q.left)
        # isSameTree(p->right, q->right)
        right = self.isSameTree(p.right, q.right)

        # return if left and right are true
        return left and right`,

  explanation: {
    intuition: [
      "Two trees are the same when their roots match, their left subtrees are the same, and their right subtrees are the same. That definition is already recursive, so the code follows it directly.",
      "The base cases handle the edges: two empty trees are the same, an empty tree never matches a non-empty one, and two nodes with different values can't match.",
    ],
    algorithm: [
      "If `p` and `q` are both empty, return `True`.",
      "If only one of them is empty, return `False`.",
      "If `p.val != q.val`, return `False`.",
      "Otherwise, compare the left subtrees and the right subtrees recursively, and return `True` only if both match.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Each pair of nodes is compared once, where n is the number of nodes." },
      space: { bigO: "O(h)", reason: "The recursion goes as deep as the tree's height h, which is O(log n) for a balanced tree and O(n) for one that's a single long chain." },
    },
  },
};
