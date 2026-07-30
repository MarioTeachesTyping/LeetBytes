// ================================= //
// Reverse Linked List: Hidden Tests //
// ================================= //

import type { HiddenProblem } from "../types.ts";

export const reverseLinkedListHidden: HiddenProblem =
{
  functionName: "reverseList",
  language: "python",
  examples: [
    { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[]], expected: [] },
  ],
  compare: "exact",
  paramNames: ["head"],
  argTypes: ["ListNode"],
  returnType: "ListNode",
  // Covers: the three canonical examples, a single node (must return itself,
  // not None), negative and duplicate values (catches a bug where only unique
  // values happen to reverse correctly), and a longer list to catch recursion
  // depth or cycle-cleanup bugs (head.next not nulled out) that short lists hide.
  tests: [
    { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { args: [[1, 2]], expected: [2, 1] },
    { args: [[]], expected: [] },
    { args: [[1]], expected: [1] },
    { args: [[-1, -2, -3]], expected: [-3, -2, -1] },
    { args: [[7, 7, 7]], expected: [7, 7, 7] },
    { args: [[0, -5, 5]], expected: [5, -5, 0] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], expected: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  ],
};
