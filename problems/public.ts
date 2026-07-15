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
import { maximumDepthOfBinaryTree } from "./maximum-depth-of-binary-tree/public.ts";
import { bestTimeToBuyAndSellStock } from "./best-time-to-buy-and-sell-stock/public.ts";
import { linkedListCycle } from "./linked-list-cycle/public.ts";
import { lruCache } from "./lru-cache/public.ts";
import { minStack } from "./min-stack/public.ts";
import { majorityElement } from "./majority-element/public.ts";
import { numberOfIslands } from "./number-of-islands/public.ts";
import { isomorphicStrings } from "./isomorphic-strings/public.ts";
import { reverseLinkedList } from "./reverse-linked-list/public.ts";
import { kthLargestElementInAnArray } from "./kth-largest-element-in-an-array/public.ts";
import { containsDuplicate } from "./contains-duplicate/public.ts";
import { containsDuplicateIi } from "./contains-duplicate-ii/public.ts";
import { invertBinaryTree } from "./invert-binary-tree/public.ts";
import { validAnagram } from "./valid-anagram/public.ts";
import { meetingRooms } from "./meeting-rooms/public.ts";
import { binaryTreeVerticalOrderTraversal } from "./binary-tree-vertical-order-traversal/public.ts";
import { minimumRemoveToMakeValidParentheses } from "./minimum-remove-to-make-valid-parentheses/public.ts";
import { sequentialDigits } from "./sequential-digits/public.ts";
import { checkIfAll1SAreAtLeastLengthKPlacesAway } from "./check-if-all-1s-are-at-least-length-k-places-away/public.ts";

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
  "maximum-depth-of-binary-tree": maximumDepthOfBinaryTree,
  "best-time-to-buy-and-sell-stock": bestTimeToBuyAndSellStock,
  "linked-list-cycle": linkedListCycle,
  "lru-cache": lruCache,
  "min-stack": minStack,
  "majority-element": majorityElement,
  "number-of-islands": numberOfIslands,
  "isomorphic-strings": isomorphicStrings,
  "reverse-linked-list": reverseLinkedList,
  "kth-largest-element-in-an-array": kthLargestElementInAnArray,
  "contains-duplicate": containsDuplicate,
  "contains-duplicate-ii": containsDuplicateIi,
  "invert-binary-tree": invertBinaryTree,
  "valid-anagram": validAnagram,
  "meeting-rooms": meetingRooms,
  "binary-tree-vertical-order-traversal": binaryTreeVerticalOrderTraversal,
  "minimum-remove-to-make-valid-parentheses": minimumRemoveToMakeValidParentheses,
  "sequential-digits": sequentialDigits,
  "check-if-all-1s-are-at-least-length-k-places-away": checkIfAll1SAreAtLeastLengthKPlacesAway,
};

// Slug-indexed lookup for route params and other untyped strings.
export function getPublicProblem(slug: string): SolutionEntry | undefined
{
  return (PROBLEMS as Record<string, SolutionEntry>)[slug];
}

export { PROBLEM_SLUGS } from "./types.ts";
export type { ProblemSlug, SolutionEntry, ProblemExample, ProblemStat, SpoilerSolution } from "./types.ts";
