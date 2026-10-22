// ========================== //
// Travel Distance on Scooters //
// ========================== //

import type { SolutionEntry } from "../types.ts";

export const pinterestTravelDistanceOnScooters: SolutionEntry =
{
  title: "Travel Distance on Scooters",

  link: "https://www.fastprep.io/problems/pinterest-travel-distance-on-scooters",

  source: "FastPrep",

  difficulty: "Easy",

  description: [
    "Imagine that you are standing at the starting point of a straight street and are trying to reach the end of the street. The street is represented by a number line starting at `0` and ending at `finish`, where `finish > 0`.",
    "Electric scooters are scattered along the street. The array `scooters` stores their locations, where `scooters[i]` is the position of the `i`-th scooter. Each scooter can travel at most `10` points to the right before its battery is exhausted.",
    "You must follow this exact algorithm:",
    "1. From your current position, walk to the nearest scooter to your right. If there is no scooter to your right, walk directly to `finish`.",
    "2. Ride that scooter as far as possible toward `finish`, using all of its remaining range.",
    "3. If you have still not reached `finish`, repeat from step 1.",
    "Return the total distance that you travel while riding scooters.",
  ],

  examples: [
    {
      input: "`finish = 23, scooters = [7, 4, 14]`",
      output: "`19`",
      explanation: "From position `0`, the nearest scooter to the right is at `4`, so you ride from `4` to `14` for `10` scooter-distance. From `14`, the next scooter to the right is at `14` itself, so you ride from `14` to `23` for `9` more. The total scooter distance is `19`.",
    },
    {
      input: "`finish = 27, scooters = [15, 7, 3, 10]`",
      output: "`20`",
      explanation: "You first walk to the scooter at `3` and ride it to `13`. Then the nearest scooter to the right is at `15`, which takes you to `25`. After that, there are no more scooters to the right, so you finish on foot. The scooter distance is `10 + 10 = 20`.",
    },
    {
      input: "`finish = 10, scooters = []`",
      output: "`0`",
      explanation: "There are no scooters on the street, so you travel the entire route on foot and accumulate no scooter distance.",
    },
  ],

  constraints: [
    "`1 <= finish <= 1000`",
    "All scooter locations are distinct integers on the street.",
  ],

  topics: [
    "Array", "Sorting", "Assessment",
  ],

  companies: [
    "Pinterest",
  ],

  hints: [
    "Walking costs nothing toward the answer — only the distance you actually ride counts, so focus on tracking where you are and how much scooter distance you've added up.",
    "The scooters come in no particular order. If you put them in sorted order, finding the nearest one to your right becomes a simple left-to-right scan.",
    "Loop while your position is short of `finish`: jump to the first scooter at or past your position, ride `min(position + 10, finish)`, add the distance covered, and if no scooter is left to your right, just move to `finish`.",
  ],

  starterCode: `class Solution:
    def travelDistanceOnScooters(self, finish: int, scooters: List[int]) -> int:
        `,

  code: `class Solution:
  def travelDistanceOnScooters(self, finish: int, scooters: List[int]) -> int:
    '''
    we need to keep track of 2 things in this problem being our current
    position and the travel distance of our scooters for our final answer.
    sorting the scooters would make checking it easier too.
    while position is less than final, go through the scooters list and
    check how far it is from our position. afterwards, jump to it and see
    how far we can travel. add 10 to our travel count or finish.
    '''
    position = 0
    travel_count = 0

    scooters.sort()

    while position < finish:
      for i in range(len(scooters)):
        if position <= scooters[i]:
          # sc=[4,10,17], p=4, op=4 then p=14, op=4.
          position = scooters[i]
          old_position = scooters[i]
          position = min(position + 10, finish)
          travel_count += position - old_position
          break
      # if there are no scooters on or right of us, move right.
      else:
        position = finish

    return travel_count`,

  explanation: {
    intuition: [
      "This follows the problem's algorithm step by step. Walking is free, since only the distance ridden counts, so we track two things: where we are (`position`) and how far we've ridden (`travel_count`).",
      "Sorting `scooters` first means the nearest scooter to our right is simply the first one in the list at or past our position. We jump to it, ride it as far as it goes (up to 10 more, without passing `finish`), and add the distance ridden. If no scooter is left to our right, we walk the rest of the way to `finish`.",
      "That last case uses Python's `for ... else`: the `else` only runs when the loop finishes without hitting `break`, which here means no scooter was found.",
    ],
    algorithm: [
      "Sort `scooters` and set `position` and `travel_count` to `0`.",
      "While `position < finish`, scan for the first scooter at or past `position`.",
      "If one is found, move to it, ride to `min(scooter + 10, finish)`, and add the distance ridden to `travel_count`.",
      "If none is found, set `position` to `finish`.",
      "Return `travel_count`.",
    ],
    complexity: {
      time: { bigO: "O(s²)", reason: "Where s is the number of scooters. Sorting takes O(s log s), but each ride rescans the list from the start (O(s)), and there can be up to s rides. Remembering where the last scan stopped would make the riding part O(s)." },
      space: { bigO: "O(s)", reason: "Python's sort can use up to O(s) extra space. Besides that, only a couple of variables are used." },
    },
  },
};
