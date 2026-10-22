// =========== //
// Word Search //
// =========== //

import type { SolutionEntry } from "../types.ts";

export const wordSearch: SolutionEntry =
{
  title: "79. Word Search",

  link: "https://leetcode.com/problems/word-search/",

  difficulty: "Medium",

  description: [
    "Given an m x n grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    "The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
  ],

  examples: [
    {
      image: "/problem-images/word-1.jpg",
      input: "`board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"`",
      output: "`true`",
    },
    {
      image: "/problem-images/word-2.jpg",
      input: "`board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"`",
      output: "`true`",
    },
    {
      image: "/problem-images/word-3.jpg",
      input: "`board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"`",
      output: "`false`",
    },
  ],

  constraints: [
    "`m == board.length`.",
    "`n == board[i].length`.",
    "`1 <= m, n <= 6`.",
    "`1 <= word.length <= 15`.",
    "`board` and `word` consist of only lowercase and uppercase English letters.",
  ],

  topics: [
    "Array", "String", "Backtracking", "Depth-First Search", "Matrix",
  ],

  companies: [
    "Amazon", "Google", "Bloomberg", "Uber",
  ],

  hints: [
    "You'll have to try a path, and if it fails partway through, undo it and try a different direction — what technique is built around exploring a path and reversing course when it doesn't work out?",
    "You need to prevent revisiting a cell you're already using in the current path — how would you mark a cell as 'in use' and then unmark it once you're done exploring from there?",
    "Try starting the search from every cell on the board; recursively check up/down/left/right for the next matching letter, tracking visited cells in a set that you add to before recursing and remove from right after, so other starting points aren't affected.",
  ],

  starterCode: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        `,

  code: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:

        '''
        for this problem we will need to use backtracking becasue of instead of finding every
        letter that exists persay we need to try every path to find if the string is in our board
        to make sure we do backtracking rules we can use a set for any visited letter and remove
        it when we're done
        create backtrack function which has base case for finding word, base case for not finding
        letter, and returning our result
        '''
        ROWS = len(board)
        COLS = len(board[0])
        path = set()

        # rows, cols, and char for keeping track of letter we are on
        def backtrack(r, c, char):
            # base case if we find the word in our board: char is as long as word
            if char == len(word):
                return True

            # check if our current letter is out of bounds, visited, or not on the board
            if (r < 0 or c < 0 or r >= ROWS or c >= COLS or word[char] != board[r][c] or (r, c) in path):
                return False

            '''
            add the cell we're on to the set. tuple for row and col for that reason
            important its tuple cause board[r][c] would be letter but we just need the box
            '''
            path.add((r, c))

            # create a result var that will move one of four directions if the next letter
            # in our word is found
            res = (backtrack(r + 1, c, char + 1) or
                   backtrack(r - 1, c, char + 1) or
                   backtrack(r, c + 1, char + 1) or
                   backtrack(r, c - 1, char + 1))

            # undo last choice (backtracking)
            path.remove((r, c))

            return res

        for r in range(ROWS):
            for c in range(COLS):
                # if our backtrack function works, return true
                if backtrack(r, c, 0):
                    return True

        return False`,

  explanation: {
    intuition: [
      "The word could start at any cell and wind in any direction, so this tries every path with backtracking. `backtrack(r, c, char)` asks whether the rest of the word, starting from `word[char]`, can be spelled from cell `(r, c)`.",
      "A cell fails right away if it's off the board, holds the wrong letter, or is already part of the current path (tracked in the `path` set, since a cell can't be reused). Otherwise it's added to `path`, the four neighbors are tried for the next letter, and then it's removed from `path` again. That removal is the backtracking step: it frees the cell up for other paths to use.",
      "Once `char == len(word)`, every letter has been matched, so the word exists.",
    ],
    algorithm: [
      "For every cell on the board, call `backtrack(r, c, 0)` and return `True` if any call succeeds.",
      "In `backtrack`, return `True` if `char == len(word)`.",
      "Return `False` if `(r, c)` is out of bounds, doesn't match `word[char]`, or is already in `path`.",
      "Add `(r, c)` to `path`, try all four neighbors with `char + 1`, then remove `(r, c)` and return whether any neighbor worked.",
      "If no starting cell works, return `False`.",
    ],
    complexity: {
      time: { bigO: "O(m · n · 3^L)", reason: "Where the board is m × n and L is the word length. A search can start from every cell, and after the first letter each step branches at most 3 ways, since the cell it came from is already in `path`." },
      space: { bigO: "O(L)", reason: "The recursion and the `path` set hold at most L cells at a time." },
    },
  },
};
