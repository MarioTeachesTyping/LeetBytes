import { SolutionEntry } from "../solutions";
import { twoSum } from "./two-sum";
import { addTwoNumbers } from "./add-two-numbers";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";
import { longestPalindromicSubstring } from "./longest-palindromic-substring";
import { palindromeNumber } from "./palindrome-number";
import { maximumSubarray } from "./maximum-subarray";
import { mergeIntervals } from "./merge-intervals";
import { validParentheses } from "./valid-parentheses";
import { mergeTwoSortedLists } from "./merge-two-sorted-lists";
import { generateParentheses } from "./generate-parentheses";

export const PROBLEMS: Record<string, SolutionEntry> = {
  "two-sum": twoSum,
  "add-two-numbers": addTwoNumbers,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharacters,
  "longest-palindromic-substring": longestPalindromicSubstring,
  "palindrome-number": palindromeNumber,
  "maximum-subarray": maximumSubarray,
  "merge-intervals": mergeIntervals,
  "valid-parentheses": validParentheses,
  "merge-two-sorted-lists": mergeTwoSortedLists,
  "generate-parentheses": generateParentheses,
};