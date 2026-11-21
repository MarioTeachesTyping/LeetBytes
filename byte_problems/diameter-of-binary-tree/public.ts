// ======================= //
// Diameter of Binary Tree //
// ======================= //

import type { SolutionEntry } from "../types.ts";

export const diameterOfBinaryTree: SolutionEntry =
{
  title: "543. Diameter of Binary Tree",

  link: "https://leetcode.com/problems/diameter-of-binary-tree/",

  difficulty: "Easy",

  description: [
    "Given the `root` of a binary tree, return the length of the diameter of the tree.",
    "The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the `root`.",
    "The length of a path between two nodes is represented by the number of edges between them.",
  ],

  examples: [
    {
      image: "/problem-images/diameter-tree.jpg",
      input: "`root = [1,2,3,4,5]`",
      output: "`3`",
      explanation: "3 is the length of the path `[4,2,1,3]` or `[5,2,1,3]`.",
    },
    {
      input: "`root = [1,2]`",
      output: "`1`",
    },
  ],

  constraints: [
    "The number of nodes in the tree is in the range `[1, 10⁴]`.",
    "`-100 <= Node.val <= 100`.",
  ],

  topics: [
    "Tree", "Depth-First Search", "Binary Tree", "DP on Trees",
  ],

  companies: [
    "Roblox", "Google", "Amazon", "Meta", "Microsoft",
  ],

  hints: [
    "Every path has a highest node, the one where it stops going up and starts going down. If you picked a node to be that highest point, how would the heights of its left and right subtrees tell you the length of the longest path through it?",
    "Does the longest path have to go through the root? Picture a root with a single child that sits on top of a big, bushy subtree. You'll need to check every node as a possible highest point, not just the root.",
    "Write a DFS that returns the height of a subtree (0 for an empty one). At each node, `left + right` is the longest path through it, so keep the best one in a variable outside the recursion (`nonlocal`), then return `1 + max(left, right)` to the parent.",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        '''
        this question fucking sucks. we can use dfs to go through each
        path and when we do we need to keep track of the longest
        diameter found and return the left or right's longest diameter
        plus 1 to account for its first path. at the end we will call
        dfs and return the diameter. nonlocal makes a var global.
        '''
        diameter = 0

        def dfs(root):
            nonlocal diameter

            if not root:
                return 0

            left = dfs(root.left)
            right = dfs(root.right)

            diameter = max(diameter, left + right)

            return 1 + max(left, right)

        dfs(root)

        return diameter`,

  explanation: {
    intuition: [
      "Every path in a tree has a single highest node, where it stops going up and starts going down. If we treat each node as that highest point, the longest path through it is just the height of its left subtree plus the height of its right subtree, counted in edges. The diameter is the best of that number over every node, which is why it doesn't have to pass through the root.",
      "A DFS that returns each subtree's height gives us both pieces at once. At every node we compute `left + right` and keep the largest value seen in `diameter`, then hand `1 + max(left, right)` up to the parent, since a path coming from above can only continue down one side.",
    ],
    algorithm: [
      "Start `diameter` at `0`, and define `dfs(node)` to return the height of a subtree, with `0` for an empty one.",
      "In `dfs`, get the heights of the left and right subtrees recursively.",
      "Update `diameter = max(diameter, left + right)`, the longest path that turns at this node.",
      "Return `1 + max(left, right)` so the parent gets this subtree's height.",
      "Call `dfs(root)` and return `diameter`.",
    ],
    complexity: {
      time: { bigO: "O(n)", reason: "Every node is visited once." },
      space: { bigO: "O(h)", reason: "The recursion goes as deep as the tree's height h, up to O(n) for a tree that's one long chain." },
    },
  },
};
