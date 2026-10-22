// ============= //
// Meeting Rooms //
// ============= //

import type { SolutionEntry } from "../types.ts";

export const meetingRooms: SolutionEntry =
{
  title: "252. Meeting Rooms",

  link: "https://leetcode.com/problems/meeting-rooms/",

  difficulty: "Easy",

  description: [
    "You are given an array of meeting times `intervals` where `intervals[i] = [starti, endi]`.",
    "A person can attend all meetings if no two meeting intervals overlap. Meetings ending at time `t` and starting at time `t` do not overlap.",
    "Return `true` if a person can attend all meetings. Otherwise, return `false`.",
  ],

  examples: [
    {
      input: "`intervals = [[0,30],[5,10],[15,20]]`",
      output: "`false`",
    },
    {
      input: "`intervals = [[7,10],[2,4]]`",
      output: "`true`",
    },
  ],

  constraints: [
    "`0 <= intervals.length <= 10⁴`.",
    "`intervals[i].length == 2`.",
    "`0 <= start_i < end_i <= 10⁶`.",
  ],

  topics: [
    "Array", "Sorting",
  ],

  companies: [
    "Amazon",
  ],

  hints: [
    "Overlaps are easiest to spot when meetings are in a predictable order — what would you do to the list first so that any conflict would only ever appear between two meetings sitting right next to each other?",
    "Once sorted by start time, what relationship between one meeting's end time and the very next meeting's start time would tell you they overlap?",
    "Sort `intervals` by start time, then loop through adjacent pairs checking if `intervals[i][1] > intervals[i + 1][0]` — if that's ever true, return False; otherwise return True after the loop.",
  ],

  starterCode: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        `,

  code: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        '''
        stop overthinking. for this solution, we can do sorting
        sort the intervals and then just check to see if the end time for the next one
        interferes with the start time of the next one
        ex: [1, 10], [5, 20]  return false
        ex: [1, 10], [15, 30] return true
        '''
        intervals.sort()

        # loop through, - 1 since we're looking ahead
        for i in range(len(intervals) - 1):
            # check if the end time is bigger than the start time for the next interval
            if intervals[i][1] > intervals[i + 1][0]:
                return False

        return True`,

  explanation: {
    intuition: [
      "You can attend every meeting only if none of them overlap. Once the meetings are sorted by start time, any overlap has to be between two neighbors, so each meeting only needs to be compared with the one right after it.",
      "If a meeting ends after the next one starts (`intervals[i][1] > intervals[i + 1][0]`), they clash. Meetings that just touch, like one ending at 10 and the next starting at 10, are fine.",
    ],
    algorithm: [
      "Sort `intervals` by start time.",
      "For each meeting except the last, compare its end with the next meeting's start.",
      "If it ends later than the next one starts, return `False`.",
      "If no neighbors overlap, return `True`.",
    ],
    complexity: {
      time: { bigO: "O(n log n)", reason: "Sorting dominates. The check afterward is a single O(n) pass." },
      space: { bigO: "O(n)", reason: "Python's sort can use up to O(n) extra space. The check itself uses constant space." },
    },
  },
};
