// =============== //
// Sync Companies  //
// =============== //

// Pulls company tags (and how often each company asks each problem) from a
// community-maintained aggregator repo and matches them against our own
// problem set. LeetCode's own company tags are Premium-only, so we can't
// scrape LeetCode directly — instead we read a repo that already did that
// scraping and publishes it as one CSV per company:
//   https://github.com/liquidslr/leetcode-company-wise-problems
//
// Matching is by LeetCode slug, not title: every row's `Link` column is a
// leetcode.com/problems/<slug> URL, and our own ProblemSlug values already
// ARE LeetCode's slugs (that's where they came from), so we just compare the
// slug straight off the URL instead of fuzzy-matching titles.
//
// Only fetches the companies listed in tracked-companies.ts — one plain HTTPS
// request per company (no git clone, no GitHub API, so no rate limit to
// worry about even with a long tracked list).
//
// Run it by hand whenever you want fresher data:
//   pnpm --filter @leetbytes/problems run sync:companies
// then review the diff to company-tags.generated.ts before committing —
// nothing here runs on a schedule or commits on its own.

import { setDefaultResultOrder } from "node:dns";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { PROBLEM_SLUGS, type ProblemSlug } from "../types.ts";
import { TRACKED_COMPANIES } from "../tracked-companies.ts";

// Some Windows setups resolve raw.githubusercontent.com's IPv6 address first
// and stall for ~10s per request before falling back — this makes IPv4 the
// first attempt instead, which is the address curl and browsers land on here.
setDefaultResultOrder("ipv4first");

const REPO_RAW_BASE =
  "https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main";

// Each company folder has five time-windowed CSVs (30/90/180/180+ days, and
// All). We want recent activity, not all-time history, so this tracks
// "Thirty Days" — swap to one of the others if you want a wider window.
const CSV_FILENAME = "1. Thirty Days.csv";

const OUTPUT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "company-tags.generated.ts");

const OUR_SLUGS = new Set<string>(PROBLEM_SLUGS);

export interface CompanyTag
{
  company: string;
  // LeetCode's own 0-100 "how often this company asks this problem" score,
  // straight from the CSV's Frequency column.
  frequency: number;
}

// -------------------------------------------------------------------------
// Minimal RFC4180 CSV line parser — handles quoted fields with embedded
// commas (the Topics column has these), which a naive split(",") would break.
// -------------------------------------------------------------------------
function parseCsvLine(line: string): string[]
{
  const fields: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++)
  {
    const char = line[i];

    if (inQuotes)
    {
      if (char === "\"" && line[i + 1] === "\"")
      {
        field += "\"";
        i++;
      }
      else if (char === "\"")
      {
        inQuotes = false;
      }
      else
      {
        field += char;
      }
      continue;
    }

    if (char === "\"")
    {
      inQuotes = true;
    }
    else if (char === ",")
    {
      fields.push(field);
      field = "";
    }
    else
    {
      field += char;
    }
  }

  fields.push(field);
  return fields;
}

// "https://leetcode.com/problems/two-sum" -> "two-sum"
function slugFromLink(link: string): string | null
{
  try
  {
    const match = new URL(link).pathname.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
  }
  catch
  {
    return null;
  }
}

async function fetchCompanyCsv(company: string): Promise<string | null>
{
  const url = `${REPO_RAW_BASE}/${encodeURIComponent(company)}/${encodeURIComponent(CSV_FILENAME)}`;
  const response = await fetch(url);

  if (!response.ok)
  {
    console.warn(`  ! ${company}: ${response.status} — check the spelling in tracked-companies.ts`);
    return null;
  }

  return response.text();
}

function extractTags(company: string, csv: string): Map<ProblemSlug, number>
{
  const matches = new Map<ProblemSlug, number>();

  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
  const header = lines[0]?.split(",") ?? [];
  const linkIndex = header.indexOf("Link");
  const frequencyIndex = header.indexOf("Frequency");

  if (linkIndex === -1 || frequencyIndex === -1)
  {
    console.warn(`  ! ${company}: missing Link/Frequency column, skipping`);
    return matches;
  }

  for (const line of lines.slice(1))
  {
    const fields = parseCsvLine(line);
    const slug = slugFromLink(fields[linkIndex] ?? "");

    if (slug && OUR_SLUGS.has(slug))
    {
      matches.set(slug as ProblemSlug, Number.parseFloat(fields[frequencyIndex] ?? "0"));
    }
  }

  return matches;
}

async function collectCompanyTags(): Promise<Record<string, CompanyTag[]>>
{
  const bySlug: Record<string, CompanyTag[]> = {};

  console.log(`Fetching ${TRACKED_COMPANIES.length} tracked companies...`);

  for (const company of TRACKED_COMPANIES)
  {
    const csv = await fetchCompanyCsv(company);
    if (!csv)
    {
      continue;
    }

    const matches = extractTags(company, csv);
    for (const [slug, frequency] of matches)
    {
      (bySlug[slug] ??= []).push({ company, frequency });
    }
  }

  // Biggest number first, per problem — matches how the source ranks relevance.
  for (const tags of Object.values(bySlug))
  {
    tags.sort((a, b) => b.frequency - a.frequency);
  }

  return bySlug;
}

function writeOutput(tags: Record<string, CompanyTag[]>)
{
  const matched = Object.keys(tags).length;
  console.log(`Matched company tags for ${matched} / ${OUR_SLUGS.size} problems.`);

  const sortedEntries = Object.keys(tags)
    .sort()
    .map((slug) => [slug, tags[slug]] as const);
  const sortedTags = Object.fromEntries(sortedEntries);

  const body = `// ========================== //
// Company Tags — GENERATED //
// ========================== //

// Do not hand-edit. Regenerate with:
//   pnpm --filter @leetbytes/problems run sync:companies
//
// Source: https://github.com/liquidslr/leetcode-company-wise-problems
// Tracked companies: tracked-companies.ts
// Generated: ${new Date().toISOString()}

import type { ProblemSlug } from "./types.ts";

export interface CompanyTag
{
  company: string;
  // LeetCode's own 0-100 "how often this company asks this problem" score.
  frequency: number;
}

// Sorted by frequency, highest first, within each problem.
export const COMPANY_TAGS: Partial<Record<ProblemSlug, CompanyTag[]>> = ${JSON.stringify(sortedTags, null, 2)};
`;

  writeFileSync(OUTPUT_PATH, body);
  console.log(`Wrote ${OUTPUT_PATH}`);
}

async function main()
{
  const tags = await collectCompanyTags();
  writeOutput(tags);
}

main();
