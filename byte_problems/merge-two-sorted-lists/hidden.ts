// ==================================== //
// Merge Two Sorted Lists: Hidden Tests //
// ==================================== //

import type { HiddenProblem } from "../types.ts";

export const mergeTwoSortedListsHidden: HiddenProblem =
{
  functionName: "mergeTwoLists",
  language: "python",
  examples: [
    { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { args: [[], []], expected: [] },
    { args: [[], [0]], expected: [0] },
  ],
  compare: "exact",
  paramNames: ["list1", "list2"],
  argTypes: ["ListNode", "ListNode"],
  returnType: "ListNode",
  // Most cases keep both lists non-empty so a solution that just attaches one
  // whole list onto the tail (a common partial implementation) can't pass by
  // luck. Covers: head taken from the other list, full interleave, unequal
  // lengths with a leftover tail on each side, duplicates across lists, and
  // negatives — plus the empty-list edges last.
  tests: [
    { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { args: [[2], [1]], expected: [1, 2] },
    { args: [[1, 3, 5, 7], [2, 4, 6, 8]], expected: [1, 2, 3, 4, 5, 6, 7, 8] },
    { args: [[5], [1, 2, 3, 4]], expected: [1, 2, 3, 4, 5] },
    { args: [[1, 2, 3, 4], [5]], expected: [1, 2, 3, 4, 5] },
    { args: [[-3, -1, 2], [-2, 0, 4]], expected: [-3, -2, -1, 0, 2, 4] },
    { args: [[1, 1, 2], [1, 1, 3]], expected: [1, 1, 1, 1, 2, 3] },
    { args: [[], [0]], expected: [0] },
    { args: [[5], []], expected: [5] },
    { args: [[], []], expected: [] },
  ],
};
