// ============== //
// Symmetric Tree //
// ============== //

import type { SolutionEntry } from "../types.ts";

export const symmetricTree: SolutionEntry =
{
  title: "101. Symmetric Tree",

  link: "https://leetcode.com/problems/symmetric-tree/",

  difficulty: "Easy",

  description: [
    "Given the `root` of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
  ],

  examples: [
    {
      image: "/problem-images/sym-tree-1.jpg",
      input: "`root = [1,2,2,3,4,4,3]`",
      output: "`true`",
    },
    {
      image: "/problem-images/sym-tree-2.jpg",
      input: "`root = [1,2,2,null,3,null,3]`",
      output: "`false`",
    },
  ],

  constraints: [
    "The number of nodes in the tree is in the range `[1, 1000]`.",
    "`-100 <= Node.val <= 100`.",
  ],

  topics: [
    "Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree",
  ],

  companies: [
    "Meta", "Google", "Bloomberg", "Amazon",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isSymmetric(self, root: Optional[TreeNode]) -> bool:

        '''
        my first thought is to use bfs or dfs for this problem and dfs might be the
        better choice because we can search both sides of the tree at the same time
        instead of going level by level
        this means we will make our own helper function and use recursion in and out
        of it for 2 roots
        2 roots because of the symmetricality. we need the opposite sides to be the
        same, not the same sides to be the same like leetcode 100
        '''
        def dfs(left_side, right_side):

            '''
            base cases
            we need to check to see if any part of our trees are null
            to continue on with our dfs and get a true outcome
            if both sides are null then its true they are symmetrical
            if one side is null then it's false
            '''
            if not left_side and not right_side:
                return True
            if not left_side or not right_side:
                return False

            '''
            we now know from this point both sides have a root
            we should now check if it's equal in a return statement
            that checks if they are equal and if the opposite sides are
            '''
            return (left_side.val == right_side.val and
                    dfs(left_side.left, right_side.right) and
                    dfs(left_side.right, right_side.left))

        return dfs(root.left, root.right)`,
};
