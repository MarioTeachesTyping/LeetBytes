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
import { longestPalindromicSubstringHidden } from "./longest-palindromic-substring/hidden.ts";
import { palindromeNumberHidden } from "./palindrome-number/hidden.ts";
import { validParenthesesHidden } from "./valid-parentheses/hidden.ts";
import { mergeTwoSortedListsHidden } from "./merge-two-sorted-lists/hidden.ts";
import { generateParenthesesHidden } from "./generate-parentheses/hidden.ts";
import { groupAnagramsHidden } from "./group-anagrams/hidden.ts";
import { maximumSubarrayHidden } from "./maximum-subarray/hidden.ts";
import { mergeIntervalsHidden } from "./merge-intervals/hidden.ts";
import { trappingRainWaterHidden } from "./trapping-rain-water/hidden.ts";
import { subsetsHidden } from "./subsets/hidden.ts";
import { wordSearchHidden } from "./word-search/hidden.ts";
import { sameTreeHidden } from "./same-tree/hidden.ts";
import { symmetricTreeHidden } from "./symmetric-tree/hidden.ts";
import { maximumDepthOfBinaryTreeHidden } from "./maximum-depth-of-binary-tree/hidden.ts";
import { bestTimeToBuyAndSellStockHidden } from "./best-time-to-buy-and-sell-stock/hidden.ts";
import { linkedListCycleHidden } from "./linked-list-cycle/hidden.ts";
import { lruCacheHidden } from "./lru-cache/hidden.ts";
import { minStackHidden } from "./min-stack/hidden.ts";
import { majorityElementHidden } from "./majority-element/hidden.ts";
import { numberOfIslandsHidden } from "./number-of-islands/hidden.ts";
import { isomorphicStringsHidden } from "./isomorphic-strings/hidden.ts";
import { reverseLinkedListHidden } from "./reverse-linked-list/hidden.ts";
import { kthLargestElementInAnArrayHidden } from "./kth-largest-element-in-an-array/hidden.ts";
import { containsDuplicateHidden } from "./contains-duplicate/hidden.ts";
import { containsDuplicateIiHidden } from "./contains-duplicate-ii/hidden.ts";
import { invertBinaryTreeHidden } from "./invert-binary-tree/hidden.ts";
import { validAnagramHidden } from "./valid-anagram/hidden.ts";
import { meetingRoomsHidden } from "./meeting-rooms/hidden.ts";
import { binaryTreeVerticalOrderTraversalHidden } from "./binary-tree-vertical-order-traversal/hidden.ts";
import { minimumRemoveToMakeValidParenthesesHidden } from "./minimum-remove-to-make-valid-parentheses/hidden.ts";
import { sequentialDigitsHidden } from "./sequential-digits/hidden.ts";
import { checkIfAll1SAreAtLeastLengthKPlacesAwayHidden } from "./check-if-all-1s-are-at-least-length-k-places-away/hidden.ts";

export const HIDDEN_PROBLEMS: Partial<Record<ProblemSlug, HiddenProblem>> =
{
  "two-sum": twoSumHidden,
  "add-two-numbers": addTwoNumbersHidden,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharactersHidden,
  "longest-palindromic-substring": longestPalindromicSubstringHidden,
  "palindrome-number": palindromeNumberHidden,
  "valid-parentheses": validParenthesesHidden,
  "merge-two-sorted-lists": mergeTwoSortedListsHidden,
  "generate-parentheses": generateParenthesesHidden,
  "group-anagrams": groupAnagramsHidden,
  "maximum-subarray": maximumSubarrayHidden,
  "merge-intervals": mergeIntervalsHidden,
  "trapping-rain-water": trappingRainWaterHidden,
  "subsets": subsetsHidden,
  "word-search": wordSearchHidden,
  "same-tree": sameTreeHidden,
  "symmetric-tree": symmetricTreeHidden,
  "maximum-depth-of-binary-tree": maximumDepthOfBinaryTreeHidden,
  "best-time-to-buy-and-sell-stock": bestTimeToBuyAndSellStockHidden,
  "linked-list-cycle": linkedListCycleHidden,
  "lru-cache": lruCacheHidden,
  "min-stack": minStackHidden,
  "majority-element": majorityElementHidden,
  "number-of-islands": numberOfIslandsHidden,
  "isomorphic-strings": isomorphicStringsHidden,
  "reverse-linked-list": reverseLinkedListHidden,
  "kth-largest-element-in-an-array": kthLargestElementInAnArrayHidden,
  "contains-duplicate": containsDuplicateHidden,
  "contains-duplicate-ii": containsDuplicateIiHidden,
  "invert-binary-tree": invertBinaryTreeHidden,
  "valid-anagram": validAnagramHidden,
  "meeting-rooms": meetingRoomsHidden,
  "binary-tree-vertical-order-traversal": binaryTreeVerticalOrderTraversalHidden,
  "minimum-remove-to-make-valid-parentheses": minimumRemoveToMakeValidParenthesesHidden,
  "sequential-digits": sequentialDigitsHidden,
  "check-if-all-1s-are-at-least-length-k-places-away": checkIfAll1SAreAtLeastLengthKPlacesAwayHidden,
};

// Slug-indexed lookup for request payloads and other untyped strings.
export function getHiddenProblem(slug: string): HiddenProblem | undefined
{
  return (HIDDEN_PROBLEMS as Record<string, HiddenProblem | undefined>)[slug];
}

export type { HiddenProblem, CompareMode, IOType, TestCase, ProblemSlug } from "./types.ts";
