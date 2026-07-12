// =============== //
// Public Registry //
// =============== //

// Everything here is safe to ship to the browser. The Record is keyed by the
// full ProblemSlug union, so a slug added to PROBLEM_SLUGS without a public
// entry (or vice versa) fails to typecheck.

import type { ProblemSlug, SolutionEntry } from "./types.ts";
import { twoSum } from "./two-sum/public.ts";
import { addTwoNumbers } from "./add-two-numbers/public.ts";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters/public.ts";
import { longestPalindromicSubstring } from "./longest-palindromic-substring/public.ts";
import { palindromeNumber } from "./palindrome-number/public.ts";
import { maximumSubarray } from "./maximum-subarray/public.ts";
import { mergeIntervals } from "./merge-intervals/public.ts";
import { validParentheses } from "./valid-parentheses/public.ts";
import { mergeTwoSortedLists } from "./merge-two-sorted-lists/public.ts";
import { generateParentheses } from "./generate-parentheses/public.ts";
import { trappingRainWater } from "./trapping-rain-water/public.ts";
import { groupAnagrams } from "./group-anagrams/public.ts";
import { subsets } from "./subsets/public.ts";
import { wordSearch } from "./word-search/public.ts";
import { sameTree } from "./same-tree/public.ts";
import { symmetricTree } from "./symmetric-tree/public.ts";

export const PROBLEMS: Record<ProblemSlug, SolutionEntry> =
{
  "two-sum": twoSum,
  "add-two-numbers": addTwoNumbers,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharacters,
  "longest-palindromic-substring": longestPalindromicSubstring,
  "palindrome-number": palindromeNumber,
  "valid-parentheses": validParentheses,
  "merge-two-sorted-lists": mergeTwoSortedLists,
  "generate-parentheses": generateParentheses,
  "group-anagrams": groupAnagrams,
  "maximum-subarray": maximumSubarray,
  "merge-intervals": mergeIntervals,
  "trapping-rain-water": trappingRainWater,
  "subsets": subsets,
  "word-search": wordSearch,
  "same-tree": sameTree,
  "symmetric-tree": symmetricTree,
};

// Slug-indexed lookup for route params and other untyped strings.
export function getPublicProblem(slug: string): SolutionEntry | undefined
{
  return (PROBLEMS as Record<string, SolutionEntry>)[slug];
}

export { PROBLEM_SLUGS } from "./types.ts";
export type { ProblemSlug, SolutionEntry, ProblemExample, ProblemStat, SpoilerSolution } from "./types.ts";
