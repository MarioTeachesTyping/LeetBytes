// =============================== //
// Valid Parentheses: Hidden Tests //
// =============================== //

import type { HiddenProblem } from "../types.ts";

export const validParenthesesHidden: HiddenProblem =
{
  functionName: "isValid",
  language: "python",
  examples: [
    { args: ["()"], expected: true },
    { args: ["()[]{}"], expected: true },
    { args: ["(]"], expected: false },
    { args: ["([])"], expected: true },
    { args: ["([)]"], expected: false },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Covers: matched/nested/mixed types, wrong-type close, crossed pairs,
  // unclosed openers, lone/leading closers, and the empty string (valid).
  tests: [
    { args: ["()"], expected: true },
    { args: ["()[]{}"], expected: true },
    { args: ["(]"], expected: false },
    { args: ["([])"], expected: true },
    { args: ["([)]"], expected: false },
    { args: ["{[]}"], expected: true },
    { args: ["((("], expected: false },
    { args: [")))"], expected: false },
    { args: ["(("], expected: false },
    { args: ["(])"], expected: false },
    { args: [""], expected: true },
    { args: ["]"], expected: false },
    { args: ["{[()]}"], expected: true },
    { args: ["([]{})"], expected: true },
  ],
};
