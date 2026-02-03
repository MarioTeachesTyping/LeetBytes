import { SolutionEntry } from "../solutions";
import { twoSum } from "./two-sum";
import { addTwoNumbers } from "./add-two-numbers";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";
import { longestPalindromicSubstring } from "./longest-palindromic-substring";
import { palindromeNumber } from "./palindrome-number";
import { mergeIntervals } from "./merge-intervals";

export const PROBLEMS: Record<string, SolutionEntry> = {
  "two-sum": twoSum,
  "add-two-numbers": addTwoNumbers,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharacters,
  "longest-palindromic-substring": longestPalindromicSubstring,
  "palindrome-number": palindromeNumber,
  "merge-intervals": mergeIntervals,
};