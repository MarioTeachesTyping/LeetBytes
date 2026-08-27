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

// How many of our problems each company shows up on — "notable" here means
// frequently-tagged across our own set, not a global fame ranking.
const companyAppearances = new Map<string, number>();
for (const row of PROBLEM_ROWS)
{
  for (const company of row.companies)
  {
    companyAppearances.set(company, (companyAppearances.get(company) ?? 0) + 1);
  }
}

// Capped so the filter chip list stays a short, scannable "notable companies"
// set instead of ballooning back out to every company that's ever matched a
// single problem once (which is most of tracked-companies.ts).
const MAX_FILTERABLE_COMPANIES = 20;

export const PROBLEM_COMPANIES = Array.from(companyAppearances.entries())
  // Pick the most-tagged companies first...
  .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
  .slice(0, MAX_FILTERABLE_COMPANIES)
  .map(([company]) => company)
  // ...then display that selection alphabetically.
  .sort();
