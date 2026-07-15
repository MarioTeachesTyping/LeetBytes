import { PROBLEMS, type SolutionEntry } from "@leetbytes/problems/public";

export type ProblemListRow = {
  title: string;
  difficulty: SolutionEntry["difficulty"];
  topics: string[];
  slug?: string;
};

// For problems that will be added in the future.
const BACKLOG_ROWS: ProblemListRow[] = [
];

const titleWithoutProblemNumber = (title: string) =>
  title.replace(/^\d+\.\s*/, "");

const problemNumber = (title: string) => {
  const match = title.match(/^(\d+)\./);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const solutionRows: ProblemListRow[] = Object.entries(PROBLEMS)
  .map(([slug, entry]) => ({
    title: titleWithoutProblemNumber(entry.title),
    difficulty: entry.difficulty,
    topics: entry.topics ?? [],
    slug,
    order: problemNumber(entry.title),
  }))
  .sort((a, b) => a.order - b.order)
  .map((row) => ({
    title: row.title,
    difficulty: row.difficulty,
    topics: row.topics,
    slug: row.slug,
  }));

export const PROBLEM_ROWS = [...solutionRows, ...BACKLOG_ROWS];

export const PROBLEM_TOPICS = [
  "All",
  ...Array.from(new Set(PROBLEM_ROWS.flatMap((item) => item.topics))).sort(),
];
