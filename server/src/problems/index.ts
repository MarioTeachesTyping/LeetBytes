// ================ //
// Problem Registry //
// ================ //

import type { ProblemDefinition } from "./types.js";

// Test cases are seeded from each problem's published examples. Linked-list and
// tree problems declare argTypes/returnType so the harness can adapt the JSON
// test data to/from ListNode/TreeNode objects (see judge/harness.ts).
const DEFINITIONS: ProblemDefinition[] =
[
  {
    slug: "merge-two-sorted-lists",
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
  },
  {
    slug: "add-two-numbers",
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
  },
  {
    slug: "two-sum",
    functionName: "twoSum",
    language: "python",
    examples: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
    // LeetCode accepts the two indices in either order, so the pair is graded
    // order-independently rather than as an exact match.
    compare: "unordered",
    paramNames: ["nums", "target"],
    // Each input has exactly one valid pair (LeetCode's guarantee). Covers:
    // adjacent answer, answer not at index 0, duplicate values, all-negatives,
    // a zero-sum pair including a 0, and answers buried mid-array.
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
      { args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
      { args: [[1, 5, 8, 3, 9, 2], 7], expected: [1, 5] },
      { args: [[2, 5, 5, 11], 10], expected: [1, 2] },
      { args: [[-10, 7, 19, 15], 9], expected: [0, 2] },
      { args: [[5, 75, 25], 100], expected: [1, 2] },
    ],
  },
  {
    slug: "palindrome-number",
    functionName: "isPalindrome",
    language: "python",
    examples: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
    ],
    compare: "exact",
    paramNames: ["x"],
    // Covers: even/odd-length palindromes, all negatives (always false),
    // trailing-zero non-palindromes, single digits, and a long palindrome.
    tests: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [0], expected: true },
      { args: [11], expected: true },
      { args: [1221], expected: true },
      { args: [12321], expected: true },
      { args: [-101], expected: false },
      { args: [100], expected: false },
      { args: [7], expected: true },
      { args: [1000000001], expected: true },
      { args: [1234567899], expected: false },
    ],
  },
  {
    slug: "valid-parentheses",
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
  },
  {
    slug: "maximum-subarray",
    functionName: "maxSubArray",
    language: "python",
    examples: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
    compare: "exact",
    paramNames: ["nums"],
    // Covers: the classic mixed array, single element, no-negatives, all-negatives
    // (answer is the largest single element, not 0 — catches a common bug), a
    // two-negative case, and arrays containing zeros.
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1]], expected: -1 },
      { args: [[-3, -1, -2]], expected: -1 },
      { args: [[-2, -1]], expected: -1 },
      { args: [[8]], expected: 8 },
      { args: [[1, 2, 3, 4, 5]], expected: 15 },
      { args: [[5, -9, 6, -2, 3]], expected: 7 },
      { args: [[-2, -3, 4, -1, -2, 1, 5, -3]], expected: 7 },
      { args: [[0, 0, 0]], expected: 0 },
      { args: [[-1, 0, -2]], expected: 0 },
    ],
  },
  {
    slug: "longest-substring-without-repeating-characters",
    functionName: "lengthOfLongestSubstring",
    language: "python",
    examples: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
    ],
    compare: "exact",
    paramNames: ["s"],
    // Covers: classic, all-same, the pwwkew window-reset trap, a single space,
    // empty string, repeat-after-gap cases (dvdf, abba) that catch a window
    // start that doesn't move forward, and an all-unique string.
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
      { args: [" "], expected: 1 },
      { args: [""], expected: 0 },
      { args: ["au"], expected: 2 },
      { args: ["dvdf"], expected: 3 },
      { args: ["abba"], expected: 2 },
      { args: ["tmmzuxt"], expected: 5 },
      { args: ["anviaj"], expected: 5 },
      { args: ["abcdef"], expected: 6 },
    ],
  },
  {
    slug: "trapping-rain-water",
    functionName: "trap",
    language: "python",
    examples: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    compare: "exact",
    paramNames: ["height"],
    // Covers: the two canonical examples, single/empty bars, flat terrain,
    // strictly descending and strictly ascending (no water in either), a deep
    // central basin, a simple valley, and an asymmetric dip.
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[0]], expected: 0 },
      { args: [[]], expected: 0 },
      { args: [[1, 1, 1]], expected: 0 },
      { args: [[5, 4, 3, 2, 1]], expected: 0 },
      { args: [[1, 2, 3, 4, 5]], expected: 0 },
      { args: [[3, 0, 0, 2, 0, 4]], expected: 10 },
      { args: [[2, 0, 2]], expected: 2 },
      { args: [[4, 2, 3]], expected: 1 },
    ],
  },
  {
    slug: "merge-intervals",
    functionName: "merge",
    language: "python",
    examples: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
    ],
    compare: "exact",
    paramNames: ["intervals"],
    // Output must be sorted by start. Covers: the canonical example, touching
    // endpoints, an unsorted input (catches solutions that forget to sort), a
    // fully-contained interval, disjoint intervals, a single interval, an
    // interval that swallows several, and a partial chain merge.
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      { args: [[[1, 4], [5, 6]]], expected: [[1, 4], [5, 6]] },
      { args: [[[1, 1]]], expected: [[1, 1]] },
      { args: [[[1, 4], [0, 0]]], expected: [[0, 0], [1, 4]] },
      { args: [[[2, 3], [4, 5], [6, 7], [1, 10]]], expected: [[1, 10]] },
      { args: [[[1, 3], [2, 6], [8, 10], [9, 18]]], expected: [[1, 6], [8, 18]] },
    ],
  },
  {
    slug: "generate-parentheses",
    functionName: "generateParenthesis",
    language: "python",
    examples: [
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
      { args: [1], expected: ["()"] },
    ],
    // The set of strings is fixed but the order they are produced is not graded.
    compare: "unordered",
    paramNames: ["n"],
    // The full set of well-formed combinations for n = 1..5 (Catalan numbers
    // 1, 2, 5, 14, 42). Generation order is not graded.
    tests: [
      { args: [1], expected: ["()"] },
      { args: [2], expected: ["(())", "()()"] },
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
      { args: [4], expected: ["(((())))", "((()()))", "((())())", "((()))()", "(()(()))", "(()()())", "(()())()", "(())(())", "(())()()", "()((()))", "()(()())", "()(())()", "()()(())", "()()()()"] },
      { args: [5], expected: ["((((()))))", "(((()())))", "(((())()))", "(((()))())", "(((())))()", "((()(())))", "((()()()))", "((()())())", "((()()))()", "((())(()))", "((())()())", "((())())()", "((()))(())", "((()))()()", "(()((())))", "(()(()()))", "(()(())())", "(()(()))()", "(()()(()))", "(()()()())", "(()()())()", "(()())(())", "(()())()()", "(())((()))", "(())(()())", "(())(())()", "(())()(())", "(())()()()", "()(((())))", "()((()()))", "()((())())", "()((()))()", "()(()(()))", "()(()()())", "()(()())()", "()(())(())", "()(())()()", "()()((()))", "()()(()())", "()()(())()", "()()()(())", "()()()()()"] },
    ],
  },
  {
    slug: "group-anagrams",
    functionName: "groupAnagrams",
    language: "python",
    examples: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { args: [[""]], expected: [[""]] },
      { args: [["a"]], expected: [["a"]] },
    ],
    // Neither the order of groups nor the order within a group is graded.
    compare: "unordered_deep",
    paramNames: ["strs"],
    // Neither group order nor within-group order is graded. Covers: the canonical
    // example, a single empty string, a single char, several multi-member groups,
    // two identical empty strings (one group), all-distinct singletons, and same
    // letters in different counts (distinct groups — catches set-vs-multiset bugs).
    tests: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
      { args: [[""]], expected: [[""]] },
      { args: [["a"]], expected: [["a"]] },
      { args: [["abc", "bca", "cab", "xyz", "zyx"]], expected: [["abc", "bca", "cab"], ["xyz", "zyx"]] },
      { args: [["", ""]], expected: [["", ""]] },
      { args: [["a", "b", "c"]], expected: [["a"], ["b"], ["c"]] },
      { args: [["ddddddddddg", "dgggggggggg"]], expected: [["ddddddddddg"], ["dgggggggggg"]] },
      { args: [["listen", "silent", "enlist", "google", "gogole"]], expected: [["listen", "silent", "enlist"], ["google", "gogole"]] },
    ],
  },
];

const REGISTRY: Map<string, ProblemDefinition> = new Map(
  DEFINITIONS.map((definition) => [definition.slug, definition]),
);

// Returns the answer key for a slug, or undefined when the problem is not judged yet.
export function getProblem(slug: string): ProblemDefinition | undefined
{
  return REGISTRY.get(slug);
}

// Lists the slugs that currently support judged submissions.
export function judgedSlugs(): string[]
{
  return [...REGISTRY.keys()];
}
