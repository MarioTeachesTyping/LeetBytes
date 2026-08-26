import { PROBLEMS, type SolutionEntry } from "@leetbytes/problems/public";
import { COMPANY_TAGS, type CompanyTag } from "@leetbytes/problems/company-tags";
import type { ProblemSlug } from "@leetbytes/problems/types";

export type ProblemListRow =
{
  title: string;
  difficulty: SolutionEntry["difficulty"];
  topics: string[];
  companies: string[];
  slug?: string;
};

export type RankedCompanyTag = {
  name: string;
  // LeetCode's own "how often this company asks this problem" score, or null
  // for a hand-authored company that the scraped data doesn't cover — those
  // sort after every ranked one instead of claiming a fake number.
  frequency: number | null;
};

// Merges the generated (scraped, frequency-ranked) company tags for a slug
// with whatever's hand-authored on the problem itself, deduped by name.
// Ranked entries come first, highest frequency first; hand-authored-only
// entries follow with no number.
export function companyTagsForSlug(slug: string | undefined, handAuthored: string[] = []): RankedCompanyTag[]
{
  const ranked: CompanyTag[] = slug ? (COMPANY_TAGS[slug as ProblemSlug] ?? []) : [];
  const rankedNames = new Set(ranked.map((tag) => tag.company));

  const unranked = handAuthored.filter((name) => !rankedNames.has(name));

  return [
    ...ranked.map((tag) => ({ name: tag.company, frequency: tag.frequency })),
    ...unranked.map((name) => ({ name, frequency: null })),
  ];
}

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
    companies: companyTagsForSlug(slug, entry.companies).map((tag) => tag.name),
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
