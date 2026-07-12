// ========================= //
// Word Search: Hidden Tests //
// ========================= //

import type { HiddenProblem } from "../types.ts";

export const wordSearchHidden: HiddenProblem =
{
  functionName: "exist",
  language: "python",
  examples: [
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true },
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"], expected: true },
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], expected: false },
  ],
  compare: "exact",
  paramNames: ["board", "word"],
  // Covers: the three canonical examples, a 1x1 board matched and unmatched, a
  // word that would need to reuse a cell (must fail), a valid diagonal-looking
  // but actually adjacent path, an adjacent-looking but not-actually-adjacent
  // path (catches diagonal-treated-as-adjacent bugs), case sensitivity for both
  // a valid and a reuse-blocked path, a direct single-letter match, and a word
  // whose first letter isn't on the board at all.
  tests: [
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true },
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"], expected: true },
    { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], expected: false },
    { args: [[["a"]], "a"], expected: true },
    { args: [[["a"]], "b"], expected: false },
    { args: [[["A", "A"]], "AAA"], expected: false },
    { args: [[["A", "B"], ["C", "D"]], "ABDC"], expected: true },
    { args: [[["A", "B"], ["C", "D"]], "ABCD"], expected: false },
    { args: [[["a", "A"]], "aA"], expected: true },
    { args: [[["a", "A"]], "AA"], expected: false },
    { args: [[["A", "B"], ["C", "D"]], "D"], expected: true },
    { args: [[["A", "B"], ["C", "D"]], "XYZ"], expected: false },
  ],
};
