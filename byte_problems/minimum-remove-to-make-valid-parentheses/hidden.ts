// ========================================================== //
// Minimum Remove to Make Valid Parentheses: Hidden Tests //
// ========================================================== //

import type { HiddenProblem } from "../types.ts";

export const minimumRemoveToMakeValidParenthesesHidden: HiddenProblem =
{
  functionName: "minRemoveToMakeValid",
  language: "python",
  examples: [
    { args: ["lee(t(c)o)de)"], expected: "lee(t(c)o)de" },
    { args: ["a)b(c)d"], expected: "ab(c)d" },
    { args: ["))(("], expected: "" },
  ],
  compare: "exact",
  paramNames: ["s"],
  // Covers: the three canonical examples, a lone unmatched '(' and a lone
  // unmatched ')', an already-valid string that must stay untouched, a string
  // with only letters and no parentheses, an unmatched '(' in the middle of an
  // otherwise-valid pair (only the extra one removed), a trailing unmatched
  // ')' after a valid pair, and a nested-valid string with letters interspersed.
  tests: [
    { args: ["lee(t(c)o)de)"], expected: "lee(t(c)o)de" },
    { args: ["a)b(c)d"], expected: "ab(c)d" },
    { args: ["))(("], expected: "" },
    { args: ["("], expected: "" },
    { args: [")"], expected: "" },
    { args: ["()"], expected: "()" },
    { args: ["abc"], expected: "abc" },
    { args: ["(()"], expected: "()" },
    { args: ["())"], expected: "()" },
    { args: ["(a(b)c)"], expected: "(a(b)c)" },
  ],
};
