// =========================== //
// Meeting Rooms: Hidden Tests //
// =========================== //

import type { HiddenProblem } from "../types.ts";

export const meetingRoomsHidden: HiddenProblem =
{
  functionName: "canAttendMeetings",
  language: "python",
  examples: [
    { args: [[[0, 30], [5, 10], [15, 20]]], expected: false },
    { args: [[[7, 10], [2, 4]]], expected: true },
  ],
  compare: "exact",
  paramNames: ["intervals"],
  // Covers: the two canonical examples, an empty list (vacuously attendable), a
  // single meeting, meetings that touch exactly at the boundary (end == next
  // start, must NOT count as overlap), meetings overlapping by a single unit,
  // and intervals given already out of order (exercises the required sort).
  tests: [
    { args: [[[0, 30], [5, 10], [15, 20]]], expected: false },
    { args: [[[7, 10], [2, 4]]], expected: true },
    { args: [[]], expected: true },
    { args: [[[5, 10]]], expected: true },
    { args: [[[1, 5], [5, 10]]], expected: true },
    { args: [[[1, 5], [4, 10]]], expected: false },
    { args: [[[13, 15], [1, 5], [8, 9]]], expected: true },
    { args: [[[0, 5], [0, 10]]], expected: false },
  ],
};
