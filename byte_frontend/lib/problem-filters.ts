// =============== //
// Problem Filters //
// =============== //

// The questions list filters the same way LeetCode's does: every tag is a
// three-state token — off, "is" (must match), or "is not" (must not match) —
// and the modal just cycles tokens through those states.

import type { ProblemListRow } from "@/lib/problem-list";

export type TokenState = "include" | "exclude";

// Only tokens the user has touched are present; anything missing is "off".
export type TokenMap = Record<string, TokenState>;

export type ProblemStatus = "Solved" | "Attempted" | "Untouched";

export const PROBLEM_STATUSES: ProblemStatus[] = ["Solved", "Attempted", "Untouched"];

export const DIFFICULTIES: ProblemListRow["difficulty"][] = ["Easy", "Medium", "Hard"];

export interface ProblemFilters
{
  search: string;
  topics: TokenMap;
  companies: TokenMap;
  difficulties: TokenMap;
  statuses: TokenMap;
}

export const EMPTY_FILTERS: ProblemFilters = {
  search: "",
  topics: {},
  companies: {},
  difficulties: {},
  statuses: {},
};

// off → is → is not → off.
export function cycleToken(map: TokenMap, token: string): TokenMap
{
  const next = { ...map };

  if (next[token] === undefined)
  {
    next[token] = "include";
  }
  else if (next[token] === "include")
  {
    next[token] = "exclude";
  }
  else
  {
    delete next[token];
  }

  return next;
}

export function countTokens(map: TokenMap): number
{
  return Object.keys(map).length;
}

export function countActiveFilters(filters: ProblemFilters): number
{
  return (
    (filters.search.trim() === "" ? 0 : 1)
    + countTokens(filters.topics)
    + countTokens(filters.companies)
    + countTokens(filters.difficulties)
    + countTokens(filters.statuses)
  );
}

// Within a group: any "is not" match rejects the row outright, and if there's
// at least one "is" the row has to match one of them. Groups then AND together.
function matchesGroup(values: string[], map: TokenMap): boolean
{
  let hasInclude = false;
  let matchedInclude = false;

  for (const [token, state] of Object.entries(map))
  {
    const present = values.includes(token);

    if (state === "exclude")
    {
      if (present)
      {
        return false;
      }
      continue;
    }

    hasInclude = true;
    if (present)
    {
      matchedInclude = true;
    }
  }

  return !hasInclude || matchedInclude;
}

export function filterProblems(
  rows: ProblemListRow[],
  filters: ProblemFilters,
  statusOf: (row: ProblemListRow) => ProblemStatus,
): ProblemListRow[]
{
  const search = filters.search.trim().toLowerCase();

  return rows.filter((row) =>
  {
    if (search !== "")
    {
      const haystack = [row.title, ...row.topics, ...row.companies].join(" ").toLowerCase();
      if (!haystack.includes(search))
      {
        return false;
      }
    }

    return (
      matchesGroup([row.difficulty], filters.difficulties)
      && matchesGroup([statusOf(row)], filters.statuses)
      && matchesGroup(row.topics, filters.topics)
      && matchesGroup(row.companies, filters.companies)
    );
  });
}
