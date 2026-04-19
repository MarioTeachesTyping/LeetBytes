import { SolutionEntry } from "../solutions";

export const mergeIntervals: SolutionEntry = {
  title: "56. Merge Intervals",
  link: "https://leetcode.com/problems/merge-intervals/",
  difficulty: "Medium",
  description: [
    "Given an array `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
  ],
  examples: [
    {
      input: "`intervals = [[1,3],[2,6],[8,10],[15,18]]`",
      output: "`[[1,6],[8,10],[15,18]]`",
      explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
    },
    {
      input: "`intervals = [[1,4],[4,5]]`",
      output: "`[[1,5]]`",
      explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
    },
    {
      input: "`intervals = [[4,7],[1,4]]`",
      output: "`[[1,7]]`",
      explanation: "Intervals [1,4] and [4,7] are considered overlapping.",
    },
  ],
  constraints: [
    "`1 <= intervals.length <= 1000`.",
    "`intervals[i].length == 2`.",
    "`0 <= starti <= endi <= 1000`.",
  ],
  topics: [
    "Array", "Sorting",
  ],
  companies: [
    "Google", "Bloomberg", "Amazon", "CleverTap",
  ],
  code: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        '''
        since our answer is specific with it's order, it'd be best to do sorting
        we can sort the intervals list by the 1st index of each interval
        after we go through it and just check if it's overlapping by checking if
        the previous interval's last index is bigger than the current interval's
        first index.
        for the lambda function, x is our interval and we're sorting by each
        interval's first index.
        '''
        intervals.sort(key=lambda x: x[0])

        merged = []

        # go through each interval and check for our cases
        for interval in intervals:
            # if merged is null, or prev of merged is less than curr interval
            # checking prev interval at its start
            if not merged or merged[-1][1] < interval[0]:
                # append cause its not overlapping
                merged.append(interval)
            # anything else means it's overlapping
            else:
                # we check interval[1] for its end
                merged[-1][1] = max(merged[-1][1], interval[1])

        return merged`,
  stats: {
    runtime: { label: "Runtime", value: "11 ms", beats: "28.81%" },
    memory: { label: "Memory", value: "22.46 MB", beats: "41.88%" },
  },
};