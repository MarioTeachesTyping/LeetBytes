// ================== //
// Problem Definitions //
// ================== //

import type { SubmissionLanguage } from "../../../shared/submissions.js";

// How a returned value is compared against the expected answer:
// - "exact":          deep equality, order matters
// - "unordered":      a single list whose order does not matter (sorted, then compared)
// - "unordered_deep": a list of lists where neither inner nor outer order matters
export type CompareMode = "exact" | "unordered" | "unordered_deep";

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
  tests: TestCase[];
};
