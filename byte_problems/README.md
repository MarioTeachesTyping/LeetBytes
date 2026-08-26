# Problems

The single source of truth for problem content, shared by the client and server
as the `@leetbytes/problems` workspace package.

## Layout

Each problem is one folder named by its slug:

```txt
byte_problems/
    types.ts             Shared types + the PROBLEM_SLUGS union
    public.ts            Registry of every problem's public content (client-safe)
    hidden.ts            Registry of every problem's judged tests (server-only)
    <slug>/
        public.ts        Description, examples, starter code, hints, spoilers
        hidden.ts        The judged test suite and answer key
```

## Adding a Problem

1. Add the slug to `PROBLEM_SLUGS` in `types.ts`.
2. Create `byte_problems/<slug>/public.ts` exporting a `SolutionEntry`.
3. Register it in `public.ts` — the `Record<ProblemSlug, SolutionEntry>` type
   fails to compile until every slug has an entry.
4. When the judged suite is ready, add `byte_problems/<slug>/hidden.ts` and register
   it in `hidden.ts` (this registry is `Partial`, so a problem can ship without
   tests; the judge answers "No judged test cases yet" until then).

## "Design" Problems

Most problems grade a single function. A "design" problem (a class with a
constructor plus method calls, e.g. LRU Cache, Min Stack) has no single
function to call, so its `hidden.ts` exports a `DesignHiddenProblem` instead:
`kind: "design"`, `className` (matching the class the user's code defines),
and `tests`/`examples` as `DesignTestCase[]` — LeetCode's own notation, where
`operations[0]` is the class name (the constructor call) and every other
index calls that method on the same instance, args-aligned:

```ts
{
  operations: ["LRUCache", "put", "put", "get"],
  args:       [[2],        [1, 1], [2, 2], [1]],
  expected:   [null,       null,   null,   1],
}
```

The client's Test Cases tab detects `kind: "design"` from
`GET /problems/:slug/cases` and swaps in a two-field `operations`/`args`
editor automatically — no client changes needed per design problem.

## Company Tags

Company tags shown in the client (frequency numbers included) mostly come from
`company-tags.generated.ts` — a generated file, not hand-authored. It's built by
`scripts/sync-companies.ts`, which fetches one CSV per company listed in
`tracked-companies.ts` from a community-maintained aggregator
([liquidslr/leetcode-company-wise-problems](https://github.com/liquidslr/leetcode-company-wise-problems))
and matches rows to our own `PROBLEM_SLUGS` by the LeetCode slug in each row's
`Link` column — our slugs already are LeetCode's, so this is an exact match,
not fuzzy title-matching.

To refresh it:

```bash
pnpm --filter @leetbytes/problems run sync:companies
```

Then review the diff and commit if it looks right — nothing here runs on a
schedule or commits on its own. To track a new company, add its exact source-repo
folder name to `tracked-companies.ts` first, then rerun the sync.

A problem's hand-authored `companies` field in its `public.ts` still works —
the client unions it with the generated data (`companyTagsForSlug` in
`byte_frontend/lib/problem-list.ts`), so a company you typed in by hand that
isn't in the tracked list still shows up, just without a frequency number.

## The One rule

A `public.ts` file (and anything the client imports) must NEVER import from a
`hidden.ts` file. The client only imports `@leetbytes/problems/public`; the
hidden suites stay out of the browser bundle solely because no import chain
reaches them from there.
