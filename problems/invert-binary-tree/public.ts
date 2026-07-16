// ==================== //
// Invert Binary Tree //
// ==================== //

import type { SolutionEntry } from "../types.ts";

export const invertBinaryTree: SolutionEntry =
{
  title: "226. Invert Binary Tree",

  link: "https://leetcode.com/problems/invert-binary-tree/",

  difficulty: "Easy",

  description: [
    "Given the `root` of a binary tree, invert the tree, and return its root.",
  ],

  examples: [
    {
      image: "/problem-images/invert-bin-tree-1.jpg",
      input: "`root = [4,2,7,1,3,6,9]`",
      output: "`[4,7,2,9,6,3,1]`",
    },
    {
      image: "/problem-images/invert-bin-tree-2.jpg",
      input: "`root = [2,1,3]`",
      output: "`[2,3,1]`",
    },
    {
      input: "`root = []`",
      output: "`[]`",
    },
  ],

  constraints: [
    "The number of nodes in the tree is in the range `[0, 100]`.",
    "`-100 <= Node.val <= 100`.",
  ],

  topics: [
    "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree",
  ],

  companies: [
    "Google", "Meta",
  ],

  hints: [
    "Inverting the whole tree is really just inverting every subtree the same way — what would happen if you assumed you already had the correctly inverted left and right subtrees in hand?",
    "What's the simplest base case that stops the recursion from going past the bottom of the tree?",
    "Recursively invert `root.left` and `root.right` first, storing each result, then swap them onto the root — `root.left, root.right = inverted_right, inverted_left` — before returning `root`.",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:

        '''
        first instinct is to use recursion for left and right
        we need base case(s) but it might not be much
        if not root then return None
        '''
        if not root:
            return None

        '''
        left and right recursion. they will move down and invert the
        tree when they execute the next steps
        '''
        left = self.invertTree(root.left)
        right = self.invertTree(root.right)

        # this is where we invert our left and right
        root.left = right
        root.right = left

        return root`,
};
