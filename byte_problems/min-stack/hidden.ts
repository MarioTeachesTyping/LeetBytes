// ======================= //
// Min Stack: Hidden Tests //
// ======================= //

import type { DesignHiddenProblem } from "../types.ts";

export const minStackHidden: DesignHiddenProblem =
{
  kind: "design",
  className: "MinStack",
  language: "python",
  examples: [
    {
      operations: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"],
      args: [[], [-2], [0], [-3], [], [], [], []],
      expected: [null, null, null, null, -3, null, 0, -2],
    },
  ],
  // Covers: the canonical example (min drops then recovers on pop), a single
  // element stack, pushing a new minimum on top of an existing one, pushing a
  // duplicate of the current minimum (must survive a pop without losing the
  // min), and a stack whose values only ever increase (min never changes).
  tests: [
    {
      operations: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"],
      args: [[], [-2], [0], [-3], [], [], [], []],
      expected: [null, null, null, null, -3, null, 0, -2],
    },
    {
      operations: ["MinStack", "push", "top", "getMin"],
      args: [[], [5], [], []],
      expected: [null, null, 5, 5],
    },
    {
      operations: ["MinStack", "push", "push", "getMin", "push", "getMin", "pop", "getMin"],
      args: [[], [1], [2], [], [0], [], [], []],
      expected: [null, null, null, 1, null, 0, null, 1],
    },
    {
      operations: ["MinStack", "push", "push", "getMin", "pop", "getMin", "pop", "getMin"],
      args: [[], [1], [1], [], [], [], [], []],
      expected: [null, null, null, 1, null, 1, null, 1],
    },
    {
      operations: ["MinStack", "push", "push", "push", "getMin", "top"],
      args: [[], [3], [5], [7], [], []],
      expected: [null, null, null, null, 3, 7],
    },
  ],
};
