// =============================== //
// Linked List Cycle: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const linkedListCycleHidden: HiddenProblem =
{
  functionName: "hasCycle",
  language: "python",
  argTypes: ["ListNodeCycle"],
  examples: [
    { args: [{ values: [3, 2, 0, -4], pos: 1 }], expected: true },
    { args: [{ values: [1, 2], pos: 0 }], expected: true },
    { args: [{ values: [1], pos: -1 }], expected: false },
  ],
  compare: "exact",
  paramNames: ["head"],
  // Covers: the three canonical examples, an empty list, a single node that
  // cycles back to itself, two nodes with no cycle, a longer list with no
  // cycle, a longer list whose tail cycles back partway through (not to the
  // head), and a full loop back to the head.
  tests: [
    { args: [{ values: [3, 2, 0, -4], pos: 1 }], expected: true },
    { args: [{ values: [1, 2], pos: 0 }], expected: true },
    { args: [{ values: [1], pos: -1 }], expected: false },
    { args: [{ values: [], pos: -1 }], expected: false },
    { args: [{ values: [1], pos: 0 }], expected: true },
    { args: [{ values: [1, 2], pos: -1 }], expected: false },
    { args: [{ values: [1, 2, 3, 4, 5], pos: -1 }], expected: false },
    { args: [{ values: [1, 2, 3, 4, 5], pos: 3 }], expected: true },
    { args: [{ values: [1, 2, 3], pos: 0 }], expected: true },
  ],
};
