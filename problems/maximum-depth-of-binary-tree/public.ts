// ============================ //
// Maximum Depth of Binary Tree //
// ============================ //

import type { SolutionEntry } from "../types.ts";

export const maximumDepthOfBinaryTree: SolutionEntry =
{
  title: "104. Maximum Depth of Binary Tree",

  link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",

  difficulty: "Easy",

  description: [
    "Given the `root` of a binary tree, return its maximum depth.",
    "A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
  ],

  examples: [
    {
      image: "/problem-images/max-depth-bin-tree.jpg",
      input: "`root = [3,9,20,null,null,15,7]`",
      output: "`3`",
    },
    {
      input: "`root = [1,null,2]`",
      output: "`2`",
    },
  ],

  constraints: [
    "The number of nodes in the tree is in the range `[0, 10⁴]`.",
    "`-100 <= Node.val <= 100`.",
  ],

  topics: [
    "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree",
  ],

  companies: [
    "Meta", "Microsoft", "Bloomberg",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:

        '''
        first instinct is to use recursion on left and right
        we need to return an int, so using max() will make this easy
        for our base case(s) we might just need to check for if root is null
        '''
        if not root:
            return 0

        # we recursively go through the tree for left and right sides
        left = self.maxDepth(root.left)
        right = self.maxDepth(root.right)

        '''
        use max() to return the farthest depth between left and right
        since it always returns an int. we do + 1 at the end to
        account for the root
        '''
        return max(left, right) + 1`,
};
