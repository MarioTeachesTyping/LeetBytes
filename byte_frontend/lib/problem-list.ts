import { PROBLEMS, type SolutionEntry } from "@leetbytes/problems/public";

export type ProblemListRow =
{
  title: string;
  difficulty: SolutionEntry["difficulty"];
  topics: string[];
  companies: string[];
  slug?: string;
};

// For problems that will be added in the future.
const BACKLOG_ROWS: ProblemListRow[] = [
];

export const titleWithoutProblemNumber = (title: string) =>
  title.replace(/^\d+\.\s*/, "");

const problemNumber = (title: string) =>
{
  const match = title.match(/^(\d+)\./);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const questionRows: ProblemListRow[] = Object.entries(PROBLEMS)
  .map(([slug, entry]) => ({
    title: titleWithoutProblemNumber(entry.title),
    difficulty: entry.difficulty,
    topics: entry.topics ?? [],
    companies: entry.companies ?? [],
    slug,
    order: problemNumber(entry.title),
  }))
  .sort((a, b) => a.order - b.order)
  .map((row) => ({
    title: row.title,
    difficulty: row.difficulty,
    topics: row.topics,
    companies: row.companies,
    slug: row.slug,
  }));

export const PROBLEM_ROWS = [...questionRows, ...BACKLOG_ROWS];

// Slug → row, for anything that stores a bare slug (e.g. the progress store)
// and needs the title/difficulty back at render time.
export const PROBLEMS_BY_SLUG = new Map(
  questionRows.map((row) => [row.slug as string, row]),
);

// Every tag that actually appears on a problem, so the filter modal never
// offers an option that can't match anything.
export const PROBLEM_TOPICS = Array.from(
  new Set(PROBLEM_ROWS.flatMap((item) => item.topics)),
).sort();

export const PROBLEM_COMPANIES = Array.from(
  new Set(PROBLEM_ROWS.flatMap((item) => item.companies)),
).sort();
