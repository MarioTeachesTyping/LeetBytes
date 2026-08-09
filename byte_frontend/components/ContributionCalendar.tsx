// ==================== //
// Contribution Calendar //
// ==================== //

"use client";

import { useMemo, useState } from "react";
import
{
  buildYearCalendar,
  countsByDay,
  streakStats,
  type CalendarDay,
  type SubmissionRecord,
} from "@/lib/progress";

// Buckets, brightest last. Index 0 is an empty day — kept visible (like
// LeetCode's grey squares) so the grid still reads as a calendar when empty.
const LEVEL_CLASS = [
  "bg-white/10",
  "bg-emerald-400/30",
  "bg-emerald-400/55",
  "bg-emerald-400/80",
  "bg-emerald-300",
];

function level(count: number): number
{
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

const DAY_FORMAT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

interface ContributionCalendarProps
{
  submissions: SubmissionRecord[];
}

export default function ContributionCalendar({ submissions }: ContributionCalendarProps)
{
  const [hovered, setHovered] = useState<CalendarDay | null>(null);

  const { months, stats } = useMemo(() =>
  {
    const counts = countsByDay(submissions);
    return { months: buildYearCalendar(counts), stats: streakStats(counts) };
  }, [submissions]);

  const hoverText = hovered
    ? `${hovered.count === 0 ? "No" : hovered.count} submission${hovered.count === 1 ? "" : "s"} on ${hovered.date.toLocaleDateString(undefined, DAY_FORMAT)}`
    : null;

  return (
    <div className="flex flex-col">
      {/* Panel header — totals on the left, hovered-day readout on the right */}
      <div className="shrink-0 flex items-center justify-between gap-4 border-b-2 border-white/15 px-4 py-2">
        <div className="text-[10px] tracking-[0.2em] text-white/40">
          <span className="text-sm text-white">{stats.totalInWindow}</span> SUBMISSIONS IN THE PAST YEAR
        </div>

        <div className="flex items-center gap-5 text-[10px] tracking-[0.2em] text-white/40">
          {hoverText ? (
            <span className="text-emerald-400">{hoverText.toUpperCase()}</span>
          ) : (
            <>
              <span>
                ACTIVE DAYS <span className="text-white">{stats.activeDays}</span>
              </span>
              <span>
                MAX STREAK <span className="text-white">{stats.maxStreak}</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Grid — one block per month, each block a row of week columns */}
      <div className="flex-1 overflow-x-auto pixel-scrollbar px-4 py-3">
        <div className="mx-auto flex w-max gap-[6px]">
          {months.map((month, monthIndex) => (
            <div key={`${month.label}-${monthIndex}`} className="flex flex-col gap-[4px]">
              <div className="flex gap-[3px]">
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dayIndex) =>
                      day ? (
                        <div
                          key={day.key}
                          onMouseEnter={() => setHovered(day)}
                          onMouseLeave={() => setHovered(null)}
                          className={`h-[10px] w-[10px] ${LEVEL_CLASS[level(day.count)]} ${
                            hovered?.key === day.key ? "outline outline-1 outline-white" : ""
                          }`}
                        />
                      ) : (
                        // Keeps the weekday rows aligned across partial weeks.
                        <div key={dayIndex} className="h-[10px] w-[10px]" />
                      ),
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center text-[9px] tracking-[0.15em] text-white/40">
                {month.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
