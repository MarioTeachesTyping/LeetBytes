// =============== //
// Hidden Registry //
// =============== //

// The server-owned answer keys. Only the server may import this module (or any
// <slug>/hidden.ts file) — importing it from client code would bundle the
// hidden suites into the browser build. Partial because a problem can ship
// public content before its judged tests exist (the judge then reports
// "No judged test cases yet").

import type { HiddenProblem, ProblemSlug } from "./types.ts";
import { twoSumHidden } from "./two-sum/hidden.ts";
import { addTwoNumbersHidden } from "./add-two-numbers/hidden.ts";
import { longestSubstringWithoutRepeatingCharactersHidden } from "./longest-substring-without-repeating-characters/hidden.ts";
import { palindromeNumberHidden } from "./palindrome-number/hidden.ts";
import { validParenthesesHidden } from "./valid-parentheses/hidden.ts";
import { mergeTwoSortedListsHidden } from "./merge-two-sorted-lists/hidden.ts";
import { generateParenthesesHidden } from "./generate-parentheses/hidden.ts";
import { groupAnagramsHidden } from "./group-anagrams/hidden.ts";
import { maximumSubarrayHidden } from "./maximum-subarray/hidden.ts";
import { mergeIntervalsHidden } from "./merge-intervals/hidden.ts";
import { trappingRainWaterHidden } from "./trapping-rain-water/hidden.ts";
import { subsetsHidden } from "./subsets/hidden.ts";

export const HIDDEN_PROBLEMS: Partial<Record<ProblemSlug, HiddenProblem>> =
{
  "two-sum": twoSumHidden,
  "add-two-numbers": addTwoNumbersHidden,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharactersHidden,
  "palindrome-number": palindromeNumberHidden,
  "valid-parentheses": validParenthesesHidden,
  "merge-two-sorted-lists": mergeTwoSortedListsHidden,
  "generate-parentheses": generateParenthesesHidden,
  "group-anagrams": groupAnagramsHidden,
  "maximum-subarray": maximumSubarrayHidden,
  "merge-intervals": mergeIntervalsHidden,
  "trapping-rain-water": trappingRainWaterHidden,
  "subsets": subsetsHidden,
};

// Slug-indexed lookup for request payloads and other untyped strings.
export function getHiddenProblem(slug: string): HiddenProblem | undefined
{
  return (HIDDEN_PROBLEMS as Record<string, HiddenProblem | undefined>)[slug];
}

export type { HiddenProblem, CompareMode, IOType, TestCase, ProblemSlug } from "./types.ts";
