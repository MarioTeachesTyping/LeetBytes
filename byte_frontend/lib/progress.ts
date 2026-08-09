// ============== //
// Progress Store //
// ============== //

// Every judged submission is appended here (localStorage, per-browser) so the
// /progress page can show a history table, a summary, and a contribution
// calendar without the server having to keep any per-user state.

import type { JudgeVerdict } from "@leetbytes/shared";

export const PROGRESS_STORAGE_KEY = "leetbytes-progress";

// Oldest entries are dropped past this so the blob can't grow without bound.
const MAX_SUBMISSIONS = 1000;

export interface SubmissionRecord
{
  slug: string;
  status: JudgeVerdict;
  passed: number;
  total: number;
  // Epoch ms — formatted for display at read time, so the stored value stays
  // timezone-agnostic.
  at: number;
}

interface ProgressStore
{
  version: 1;
  submissions: SubmissionRecord[];
}

const EMPTY: ProgressStore = { version: 1, submissions: [] };

export function readProgress(): ProgressStore
{
  if (typeof window === "undefined")
  {
    return EMPTY;
  }

  try
  {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw)
    {
      return EMPTY;
    }

    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    if (!Array.isArray(parsed.submissions))
    {
      return EMPTY;
    }

    return { version: 1, submissions: parsed.submissions };
  }
  catch
  {
    // Corrupt or unreadable storage shouldn't take the page down.
    return EMPTY;
  }
}

export function recordSubmission(entry: Omit<SubmissionRecord, "at">)
{
  if (typeof window === "undefined")
  {
    return;
  }

  try
  {
    const store = readProgress();
    const submissions = [...store.submissions, { ...entry, at: Date.now() }];
    const trimmed = submissions.slice(-MAX_SUBMISSIONS);

    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: 1, submissions: trimmed } satisfies ProgressStore),
    );
  }
  catch
  {
    // Private mode / quota exceeded — recording progress is best-effort.
  }
}

export function clearProgress()
{
  if (typeof window === "undefined")
  {
    return;
  }

  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

// ======== //
// Calendar //
// ======== //

// Local-time YYYY-MM-DD. Deliberately not toISOString(), which would shift days
// across the UTC boundary and put evening submissions on tomorrow's square.
export function dayKey(date: Date): string
{
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function countsByDay(submissions: SubmissionRecord[]): Record<string, number>
{
  const counts: Record<string, number> = {};

  for (const submission of submissions)
  {
    const key = dayKey(new Date(submission.at));
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

export interface CalendarDay
{
  key: string;
  date: Date;
  count: number;
}

export interface CalendarMonth
{
  label: string;
  // Columns of 7 (Sun..Sat). Slots outside the month — or outside the year
  // window — are null so the column still lines up on the right weekday row.
  weeks: (CalendarDay | null)[][];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The trailing 365 days, grouped into month blocks the way LeetCode draws them:
// each month is its own little grid of week-columns with a gap between months,
// rather than one continuous 53-column strip.
export function buildYearCalendar(
  counts: Record<string, number>,
  today: Date = new Date(),
): CalendarMonth[]
{
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(start.getDate() - 364);

  const months: CalendarMonth[] = [];

  let weeks: (CalendarDay | null)[][] = [];
  let column: (CalendarDay | null)[] = new Array(7).fill(null);
  let currentMonth = start.getMonth();

  const flushColumn = () =>
  {
    if (column.some(Boolean))
    {
      weeks.push(column);
    }
    column = new Array(7).fill(null);
  };

  const flushMonth = (monthIndex: number) =>
  {
    flushColumn();
    if (weeks.length > 0)
    {
      months.push({ label: MONTH_LABELS[monthIndex], weeks });
    }
    weeks = [];
  };

  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1))
  {
    if (cursor.getMonth() !== currentMonth)
    {
      flushMonth(currentMonth);
      currentMonth = cursor.getMonth();
    }

    const key = dayKey(cursor);
    column[cursor.getDay()] = { key, date: new Date(cursor), count: counts[key] ?? 0 };

    // Saturday closes the week column.
    if (cursor.getDay() === 6)
    {
      flushColumn();
    }
  }

  flushMonth(currentMonth);

  return months;
}

// ======= //
// Summary //
// ======= //

export interface StreakStats
{
  totalInWindow: number;
  activeDays: number;
  maxStreak: number;
}

export function streakStats(counts: Record<string, number>, today: Date = new Date()): StreakStats
{
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const cursor = new Date(end);
  cursor.setDate(cursor.getDate() - 364);

  let totalInWindow = 0;
  let activeDays = 0;
  let maxStreak = 0;
  let streak = 0;

  for (; cursor <= end; cursor.setDate(cursor.getDate() + 1))
  {
    const count = counts[dayKey(cursor)] ?? 0;

    if (count > 0)
    {
      totalInWindow += count;
      activeDays += 1;
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    }
    else
    {
      streak = 0;
    }
  }

  return { totalInWindow, activeDays, maxStreak };
}

// Slugs the user has at least one accepted submission for.
export function solvedSlugs(submissions: SubmissionRecord[]): Set<string>
{
  return new Set(
    submissions.filter((entry) => entry.status === "accepted").map((entry) => entry.slug),
  );
}
