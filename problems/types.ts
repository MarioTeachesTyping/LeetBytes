// ============= //
// Problem Types //
// ============= //

// The single source of truth for problem typing. Every problem lives in its
// own `problems/<slug>/` folder split into two files:
//   - public.ts: everything the client may ship to the browser.
//   - hidden.ts: the server-owned answer key (judged tests, compare mode).
// A public.ts file must NEVER import from a hidden.ts file, or the hidden
// suite would leak into the client bundle.

import type { SubmissionLanguage } from "@leetbytes/shared";

// Every implemented problem, in LeetCode-number order. Both registries are
// keyed by this union, so adding a slug here forces public content to exist
// (public.ts fails to typecheck until its entry is added).
export const PROBLEM_SLUGS = [
  "two-sum",
  "add-two-numbers",
  "longest-substring-without-repeating-characters",
  "longest-palindromic-substring",
  "palindrome-number",
  "valid-parentheses",
  "merge-two-sorted-lists",
  "generate-parentheses",
  "group-anagrams",
  "maximum-subarray",
  "merge-intervals",
  "trapping-rain-water",
  "subsets",
  "word-search",
  "same-tree",
  "symmetric-tree",
  "maximum-depth-of-binary-tree",
  "best-time-to-buy-and-sell-stock",
  "linked-list-cycle",
  "lru-cache",
  "min-stack",
  "majority-element",
  "number-of-islands",
  "isomorphic-strings",
  "reverse-linked-list",
  "kth-largest-element-in-an-array",
  "contains-duplicate",
  "contains-duplicate-ii",
  "invert-binary-tree",
  "valid-anagram",
  "meeting-rooms",
  "binary-tree-vertical-order-traversal",
  "minimum-remove-to-make-valid-parentheses",
  "sequential-digits",
  "check-if-all-1s-are-at-least-length-k-places-away",
] as const;

export type ProblemSlug = (typeof PROBLEM_SLUGS)[number];

// ============== //
// Public Content //
// ============== //

export type ProblemExample =
{
  input: string;
  output: string;
  explanation?: string;
  image?: string;
};

export type ProblemStat =
{
  label: "Runtime" | "Memory";
  value: string;
  beats?: string;
};

// One spoiler entry: a titled, optionally-described approach whose code is
// hidden behind the spoiler overlay. A problem may list several (e.g. brute
// force vs. optimal) and each reveals independently.
export type SpoilerSolution =
{
  title: string;
  description?: string;
  code: string;
};

export type SolutionEntry =
{
  title: string;
  link?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: ProblemExample[];
  constraints?: string[];
  topics?: string[];
  companies?: string[];
  // Up to 3 hints pointing toward this problem's `code` approach. Written now
  // so the minigame-unlock feature can just reveal them later — the panel
  // currently renders every slot locked regardless of this content.
  hints?: string[];
  starterCode: string;
  code: string;
  // Spoiler approaches shown in the Spoiler view. When omitted, the Spoiler view
  // falls back to a single untitled block built from `code`.
  solutions?: SpoilerSolution[];
  stats?: {
    runtime?: ProblemStat;
    memory?: ProblemStat;
  };
};

// ============== //
// Hidden Content //
// ============== //

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
//   - "ListNodeCycle": input-only, `{ values: [...], pos: number }`, LeetCode's
//                      own cycle notation — `pos` is the 0-indexed node the
//                      tail's `next` connects back to, or -1 for no cycle
//                      (e.g. linked-list-cycle). Never used as a return type,
//                      since a cyclic list can't be serialized back to JSON.
export type IOType = "json" | "ListNode" | "ListNode[]" | "TreeNode" | "TreeNode[]" | "ListNodeCycle";

export type TestCase =
{
  args: unknown[];
  expected: unknown;
};

// A "design" problem's test case: LeetCode's own notation for a class with a
// constructor and a sequence of method calls, e.g.
//   operations: ["LRUCache", "put", "put", "get"]
//   args:       [[2],        [1,1], [2,2], [1]]
//   expected:   [null,       null,  null,  1]
// `operations[0]` is always the class name (the constructor call) and its
// expected slot is always null. Every other index calls that method on the
// same instance, args-aligned, and records its return value.
export type DesignTestCase =
{
  operations: string[];
  args: unknown[][];
  expected: unknown[];
};

// The server-owned "answer key" for a problem. The client never imports these,
// which keeps the judged path honest the same way the real site does. The slug
// is not repeated here — the registry in hidden.ts keys each entry by slug.
// Most problems are a single graded function (`kind` omitted); a "design"
// problem (e.g. LRUCache) grades a constructor + sequence of method calls
// instead, since there is no single function to call.
export type HiddenProblem = FunctionHiddenProblem | DesignHiddenProblem;

export type FunctionHiddenProblem =
{
  kind?: "function";
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
  // The public example cases shown on the problem (the "Run" path grades against
  // just these). A subset/restatement of the problem's published examples, kept
  // structured so the harness can run them. Distinct from `tests`, the full
  // hidden suite used by the judge.
  examples?: TestCase[];
  tests: TestCase[];
};

export type DesignHiddenProblem =
{
  kind: "design";
  // The class to instantiate, e.g. "LRUCache". Matches operations[0] in every test case.
  className: string;
  language: SubmissionLanguage;
  examples?: DesignTestCase[];
  tests: DesignTestCase[];
};
