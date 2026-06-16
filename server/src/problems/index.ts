// ================ //
// Problem Registry //
// ================ //

import type { ProblemDefinition } from "./types.js";

// Test cases are seeded from each problem's published examples. Linked-list and
// tree problems (add-two-numbers, merge-two-sorted-lists) are intentionally left
// out until the harness gains ListNode/TreeNode adapters.
const DEFINITIONS: ProblemDefinition[] =
[
  {
    slug: "two-sum",
    functionName: "twoSum",
    language: "python",
    compare: "exact",
    paramNames: ["nums", "target"],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    slug: "palindrome-number",
    functionName: "isPalindrome",
    language: "python",
    compare: "exact",
    paramNames: ["x"],
    tests: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [0], expected: true },
    ],
  },
  {
    slug: "valid-parentheses",
    functionName: "isValid",
    language: "python",
    compare: "exact",
    paramNames: ["s"],
    tests: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([])"], expected: true },
      { args: ["([)]"], expected: false },
    ],
  },
  {
    slug: "maximum-subarray",
    functionName: "maxSubArray",
    language: "python",
    compare: "exact",
    paramNames: ["nums"],
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1]], expected: -1 },
    ],
  },
  {
    slug: "longest-substring-without-repeating-characters",
    functionName: "lengthOfLongestSubstring",
    language: "python",
    compare: "exact",
    paramNames: ["s"],
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 },
    ],
  },
  {
    slug: "trapping-rain-water",
    functionName: "trap",
    language: "python",
    compare: "exact",
    paramNames: ["height"],
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[0]], expected: 0 },
    ],
  },
  {
    slug: "merge-intervals",
    functionName: "merge",
    language: "python",
    compare: "exact",
    paramNames: ["intervals"],
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[4, 7], [1, 4]]], expected: [[1, 7]] },
    ],
  },
  {
    slug: "generate-parentheses",
    functionName: "generateParenthesis",
    language: "python",
    // The set of strings is fixed but the order they are produced is not graded.
    compare: "unordered",
    paramNames: ["n"],
    tests: [
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
      { args: [1], expected: ["()"] },
    ],
  },
  {
    slug: "group-anagrams",
    functionName: "groupAnagrams",
    language: "python",
    // Neither the order of groups nor the order within a group is graded.
    compare: "unordered_deep",
    paramNames: ["strs"],
    tests: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { args: [[""]], expected: [[""]] },
      { args: [["a"]], expected: [["a"]] },
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
