// =================== //
// Problem Definitions //
// =================== //

import type { SubmissionLanguage } from "../../../shared/submissions.js";

// How a returned value is compared against the expected answer:
// - "exact":          deep equality, order matters
// - "unordered":      a single list whose order does not matter (sorted, then compared)
// - "unordered_deep": a list of lists where neither inner nor outer order matters
export type CompareMode = "exact" | "unordered" | "unordered_deep";

// How a JSON test value maps to/from the Python object the method actually
// expects. Tests are always written as plain JSON; the harness decodes JSON ->
// node objects before the call and encodes the return back to JSON afterward.
//   - "json"       (default): passed through unchanged
//   - "ListNode":   flat array, e.g. [1,2,4] <-> a linked list
//   - "TreeNode":   level-order array with null for missing children, LeetCode
//                   style, e.g. [3,9,20,null,null,15,7] <-> a binary tree
//   - "ListNode[]" / "TreeNode[]": an array of the above (e.g. merge-k-lists)
export type IOType = "json" | "ListNode" | "ListNode[]" | "TreeNode" | "TreeNode[]";

export type TestCase =
{
  args: unknown[];
  expected: unknown;
};

// The server-owned "answer key" for a problem. The client never sees these,
// which keeps the judged path honest the same way the real site does.
export type ProblemDefinition =
{
  slug: string;
  // The method to call on the user's `Solution` class, e.g. "twoSum".
  functionName: string;
  language: SubmissionLanguage;
  compare: CompareMode;
  // Optional parameter names, only used to format readable test input strings.
  paramNames?: string[];
  // Per-positional-argument I/O types. Omitted entries default to "json", so a
  // problem only declares the slots that are linked lists or trees.
  argTypes?: IOType[];
  // I/O type of the method's return value. Defaults to "json".
  returnType?: IOType;
  tests: TestCase[];
};
