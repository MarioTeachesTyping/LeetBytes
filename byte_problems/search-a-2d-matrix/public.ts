// ================== //
// Search a 2D Matrix //
// ================== //

import type { SolutionEntry } from "../types.ts";

export const searchA2dMatrix: SolutionEntry =
{
  title: "74. Search a 2D Matrix",

  link: "https://leetcode.com/problems/search-a-2d-matrix/",

  difficulty: "Medium",

  description: [
    "You are given an `m x n` integer matrix `matrix` with the following two properties:",
    "1. Each row is sorted in non-decreasing order.",
    "2. The first integer of each row is greater than the last integer of the previous row.",
    "Given an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.",
    "You must write a solution in `O(log(m * n))` time complexity.",
  ],

  examples: [
    {
      input: "`matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3`",
      output: "`true`",
    },
    {
      input: "`matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13`",
      output: "`false`",
    },
  ],

  constraints: [
    "`m == matrix.length`",
    "`n == matrix[i].length`",
    "`1 <= m, n <= 100`",
    "`-10⁴ <= matrix[i][j], target <= 10⁴`",
  ],

  topics: [
    "Array", "Binary Search", "Matrix",
  ],

  companies: [
    "Google", "Microsoft", "Amazon", "Bloomberg",
  ],

  hints: [
    "Each row is sorted, and each row starts higher than the previous one ended, so reading the matrix left to right and top to bottom gives one long sorted list. What search is built for a sorted list?",
    "You don't need to build that list. Pretend the matrix is flattened into `ROWS * COLS` positions, and run the search over those positions with `l = 0` and `r = ROWS * COLS - 1`.",
    "For any middle position `mid`, its row is `mid // COLS` and its column is `mid % COLS`. Compare that value to `target`, move `l` or `r` past `mid` like a normal binary search, and return `True` on a match or `False` if the loop ends.",
  ],

  starterCode: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        `,

  code: `class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        '''
        due to it's sorted order and a target, we should use binary search.
        by making the 2D array into a 1D array we can traverse it regularly
        by having our right pointer be the rows and cols combined. in terms
        of finding the specific row and col we need to be in. just give up
        on trying to remember how it works but remember how it's written...
        '''
        ROWS = len(matrix)
        COLS = len(matrix[0])

        l = 0
        r = (ROWS * COLS) - 1

        while l <= r:
            mid = (l + r) // 2

            row = mid // COLS
            col = mid % COLS

            if matrix[row][col] < target:
                l = mid + 1
            elif matrix[row][col] > target:
                r = mid - 1
            else:
                return True

        return False`,

  explanation: {
    intuition: [
      "Because every row is sorted and every row starts higher than the previous one ended, reading the matrix row by row gives one long sorted list of `ROWS * COLS` values. That's exactly the setup for a normal binary search.",
      "We don't need to actually build that list. We can run the search over the positions `0` to `ROWS * COLS - 1` and, for each middle position `mid`, work out where that value lives in the matrix. Each row holds `COLS` values, so `mid // COLS` counts how many full rows come before it (the row), and `mid % COLS` is how far into that row it is (the column).",
      "From there it's the usual binary search. If the value at `mid` is too small, move `l` past it. If it's too big, move `r` before it. If it matches, return `True`, and if the range runs out, the target isn't in the matrix.",
    ],
    algorithm: [
      "Set `ROWS` and `COLS`, then `l = 0` and `r = ROWS * COLS - 1`.",
      "While `l <= r`, take `mid = (l + r) // 2`.",
      "Convert it to a matrix position: `row = mid // COLS` and `col = mid % COLS`.",
      "If `matrix[row][col] < target`, set `l = mid + 1`. If it's greater, set `r = mid - 1`.",
      "If it equals `target`, return `True`.",
      "If the loop ends without a match, return `False`.",
    ],
    complexity: {
      time: { bigO: "O(log(m * n))", reason: "The search covers all m * n positions and cuts the remaining range in half each step. Turning a position into a row and column takes O(1)." },
      space: { bigO: "O(1)", reason: "Only a few variables are kept, and the matrix is never copied or flattened." },
    },
  },
};
