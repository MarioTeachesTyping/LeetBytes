import { SolutionEntry } from "../solutions";
import { twoSum } from "./two-sum";
import { addTwoNumbers } from "./add-two-numbers";
import { longestSubstringWithoutRepeatingCharacters } from "./longest-substring-without-repeating-characters";

export const PROBLEMS: Record<string, SolutionEntry> = {
  "two-sum": twoSum,
  "add-two-numbers": addTwoNumbers,
  "longest-substring-without-repeating-characters": longestSubstringWithoutRepeatingCharacters,
};