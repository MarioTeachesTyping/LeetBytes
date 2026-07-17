// ============================= //
// Add Two Numbers: Hidden Tests //
// ============================= //

import type { HiddenProblem } from "../types.ts";

export const addTwoNumbersHidden: HiddenProblem =
{
  functionName: "addTwoNumbers",
  language: "python",
  examples: [
    { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
    { args: [[0], [0]], expected: [0] },
    { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
  ],
  compare: "exact",
  paramNames: ["l1", "l2"],
  argTypes: ["ListNode", "ListNode"],
  returnType: "ListNode",
  // Digits are stored least-significant-first. Covers: basic carry, unequal
  // lengths, a carry that propagates and grows the result past both inputs,
  // single-digit carry, and adding zero.
  tests: [
    { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
    { args: [[2, 4], [5, 6, 4]], expected: [7, 0, 5] },
    { args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
    { args: [[5], [5]], expected: [0, 1] },
    { args: [[1, 8], [0]], expected: [1, 8] },
    { args: [[0], [0]], expected: [0] },
    { args: [[9], [1]], expected: [0, 1] },
    { args: [[7, 2, 4, 3], [5, 6, 4]], expected: [2, 9, 8, 3] },
  ],
};
