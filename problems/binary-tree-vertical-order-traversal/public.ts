// ==================================== //
// Binary Tree Vertical Order Traversal //
// ==================================== //

import type { SolutionEntry } from "../types.ts";

export const binaryTreeVerticalOrderTraversal: SolutionEntry =
{
  title: "314. Binary Tree Vertical Order Traversal",

  link: "https://leetcode.com/problems/binary-tree-vertical-order-traversal/",

  difficulty: "Medium",

  description: [
    "Given the `root` of a binary tree, return the vertical order traversal of its nodes' values. (i.e., from top to bottom, column by column).",
    "If two nodes are in the same row and column, the order should be from left to right.",
  ],

  examples: [
    {
      image: "/problem-images/bin-tree-vert-order-trav-1.png",
      input: "`root = [3,9,20,null,null,15,7]`",
      output: "`[[9],[3,15],[20],[7]]`",
    },
    {
      image: "/problem-images/bin-tree-vert-order-trav-2.png",
      input: "`root = [3,9,8,4,0,1,7]`",
      output: "`[[4],[9],[3,0,1],[8],[7]]`",
    },
    {
      image: "/problem-images/bin-tree-vert-order-trav-3.png",
      input: "`root = [1,2,3,4,10,9,11,null,5,null,null,null,null,null,null,null,6]`",
      output: "`[[4],[2,5],[1,10,9,6],[3],[11]]`",
    },
  ],

  constraints: [
    "The number of nodes in the tree is in the range `[0, 100]`.",
    "`-100 <= Node.val <= 100`.",
  ],

  topics: [
    "Hash Table", "Tree", "Depth-First Search", "Breadth-First Search", "Sorting", "Binary Tree",
  ],

  companies: [
    "Meta", "Bloomberg", "Apple",
  ],

  starterCode: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def verticalOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        `,

  code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def verticalOrder(self, root: Optional[TreeNode]) -> List[List[int]]:

        '''
        tree so bfs or dfs. for this problem bfs would be easier since keeping track of the
        column aspect sounds more difficult in dfs. just like in cs1 or cs2 keeping track of
        tree columns is like decrementing left side and incrementing right side.
        we would need to make a queue with a tuple inside to keep track of the node and column
        we are at. then while queue is not null, pop our queue by updating node and column,
        then go through each left and right side
        '''
        if root is None:
            return []

        # tuple inside our queue to keep track of node and column it's in. rn 3, 0
        queue = deque([(root, 0)])
        # create a dictionary to keep track of our key being column and value being node.val
        columnTable = defaultdict(list)
        # min and max column to make it easier to return our final statement in order
        min_column = 0
        max_column = 0

        # while queue is not null
        while queue:
            # pop left side (FIFO) of queue to get newest info on node and col we're on
            node, column = queue.popleft()

            # making sure node isnt null
            if node is not None:
                # add our popped node and column to our dictionary
                columnTable[column].append(node.val)

                # update our min and max column
                min_column = min(min_column, column)
                max_column = max(max_column, column)

                # enqueue left and right side to our queue
                queue.append((node.left, column - 1))
                queue.append((node.right, column + 1))

        # return list of lists in order of min to max
        return [columnTable[col] for col in range(min_column, max_column + 1)]`,
};
