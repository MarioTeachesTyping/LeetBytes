// =================== //
// Number of Islands //
// =================== //

import type { SolutionEntry } from "../types.ts";

export const numberOfIslands: SolutionEntry =
{
  title: "200. Number of Islands",

  link: "https://leetcode.com/problems/number-of-islands/",

  difficulty: "Medium",

  description: [
    "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.",
    "An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
  ],

  examples: [
    {
      input: "`grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]`",
      output: "`1`",
    },
    {
      input: "`grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]`",
      output: "`3`",
    },
  ],

  constraints: [
    "`m == grid.length`.",
    "`n == grid[i].length`.",
    "`1 <= m, n <= 300`.",
    "`grid[i][j]` is `'0'` or `'1'`.",
  ],

  topics: [
    "Array", "Depth-First Search", "Breadth-First Search", "Union-Find", "Matrix",
  ],

  companies: [
    "Amazon", "Google", "Bloomberg", "TikTok", "Microsoft", "Meta",
  ],

  starterCode: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        `,

  code: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:

        '''
        first approach that comes to mind is using bfs or dfs since this is a graph (like a tree)
        we know if it's island horizontally (rows) and vertically (cols) so diagonal does not matter
        dfs is either to think about for this and we would go through both rows and cols and call dfs
        if the r and c is 1. if its 1 we then make it become 0 to say its been visited and inside dfs
        call it for every other direction. this will count as us checking for that 1 island still
        '''
        if not grid:
            return 0

        num_islands = 0

        # increment through each row and column
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                # if the row and col is on a 1, call dfs and increment island counter
                if grid[i][j] == '1':
                    self.dfs(grid, i, j)
                    num_islands += 1

        return num_islands

    # needs grid and i and j from before as rows and cols
    def dfs(self, grid, r, c):

        # if statement to check if we're out of bounds or on a 0. return if so
        if (r < 0 or c < 0 or r >= len(grid) or c >= len(grid[0]) or grid[r][c] != '1'):
            return

        # make the 1 (land) we're on a 0 (water) so we don't revisit it in later calls
        grid[r][c] = '0'

        # call dfs in each direction to get the entire island
        self.dfs(grid, r - 1, c)
        self.dfs(grid, r + 1, c)
        self.dfs(grid, r, c - 1)
        self.dfs(grid, r, c + 1)`,
};
