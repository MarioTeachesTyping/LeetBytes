// ================= //
// Set Matrix Zeroes //
// ================= //

import type { SolutionEntry } from "../types.ts";

export const setMatrixZeroes: SolutionEntry =
{
  title: "73. Set Matrix Zeroes",

  link: "https://leetcode.com/problems/set-matrix-zeroes/",

  difficulty: "Medium",

  description: [
    "Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s.",
    "You must do it in place.",
    "Follow up: a straightforward solution using `O(mn)` space is probably a bad idea, and a simple improvement uses `O(m + n)` space but is still not the best. Could you devise a constant space solution?",
  ],

  examples: [
    {
      image: "/problem-images/matrix-zeroes-1.jpg",
      input: "`matrix = [[1,1,1],[1,0,1],[1,1,1]]`",
      output: "`[[1,0,1],[0,0,0],[1,0,1]]`",
    },
    {
      image: "/problem-images/matrix-zeroes-2.jpg",
      input: "`matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]`",
      output: "`[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`",
    },
  ],

  constraints: [
    "`m == matrix.length`",
    "`n == matrix[0].length`",
    "`1 <= m, n <= 200`",
    "`-2³¹ <= matrix[i][j] <= 2³¹ - 1`",
  ],

  topics: [
    "Array", "Hash Table", "Matrix",
  ],

  companies: [
    "Google",
  ],

  hints: [
    "What goes wrong if you zero out a row and column the moment you find a `0` while you're still scanning? Think about whether the new zeros you just wrote can be told apart from the original ones.",
    "So don't change anything while you're still searching. What's the least you need to remember about each `0` you find in order to clear its row and column later?",
    "Make one pass to record which rows and which columns contain a `0` (a set for each gives you no duplicates and O(1) lookups), then a second pass that sets `matrix[row][col] = 0` whenever its row is in `rows` or its column is in `cols`.",
  ],

  starterCode: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        `,

  code: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        '''
        gonna brute force and use a double for loop. we can use the indexes
        for any number that's 0 since it will count as their row or column.
        using the indices we can go through the matrix again and apply our
        disease of making the row and col zeroes. we make a set to keep
        these indicies so there's no dupes and O(1) look up time.
        '''
        rows = set()
        cols = set()

        # loop through matrix first time.
        for row in range(len(matrix)):
            for col in range(len(matrix[0])):
                # if element is 0 then add the row and col to our sets.
                if matrix[row][col] == 0:
                    rows.add(row)
                    cols.add(col)

        # loop through matrix second time.
        for row in range(len(matrix)):
            for col in range(len(matrix[0])):
                # if row in rows or col in cols, make it 0.
                if row in rows or col in cols:
                    matrix[row][col] = 0`,

  explanation: {
    intuition: [
      "The catch is that we can't zero a row and column the moment we find a `0`: the zeros we write would be indistinguishable from the original ones, and we'd wipe out far more than we should. So we separate the work into two passes, finding first and changing second.",
      "On the first pass we only record which rows and which columns contain a `0`, in two sets (so there are no duplicates and every lookup is O(1)). On the second pass we visit every cell and set it to `0` if its row or its column was recorded. This uses O(m + n) extra space; the constant-space follow-up stores those same flags in the matrix's own first row and column instead.",
    ],
    algorithm: [
      "Create two empty sets, `rows` and `cols`.",
      "Loop through every cell, and when one is `0`, add its row index to `rows` and its column index to `cols`.",
      "Loop through every cell again, setting it to `0` if its row is in `rows` or its column is in `cols`.",
    ],
    complexity: {
      time: { bigO: "O(m · n)", reason: "We visit every cell twice, once to find the zeros and once to clear." },
      space: { bigO: "O(m + n)", reason: "The sets hold at most one entry per row and one per column." },
    },
  },
};
