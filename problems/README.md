# Problems

The single source of truth for problem content, shared by the client and server
as the `@leetbytes/problems` workspace package.

## Layout

Each problem is one folder named by its slug:

```txt
problems/
    types.ts             Shared types + the PROBLEM_SLUGS union
    public.ts            Registry of every problem's public content (client-safe)
    hidden.ts            Registry of every problem's judged tests (server-only)
    <slug>/
        public.ts        Description, examples, starter code, hints, spoilers
        hidden.ts        The judged test suite and answer key
```

## Adding a problem

1. Add the slug to `PROBLEM_SLUGS` in `types.ts`.
2. Create `problems/<slug>/public.ts` exporting a `SolutionEntry`.
3. Register it in `public.ts` — the `Record<ProblemSlug, SolutionEntry>` type
   fails to compile until every slug has an entry.
4. When the judged suite is ready, add `problems/<slug>/hidden.ts` and register
   it in `hidden.ts` (this registry is `Partial`, so a problem can ship without
   tests; the judge answers "No judged test cases yet" until then).

## The one rule

A `public.ts` file (and anything the client imports) must NEVER import from a
`hidden.ts` file. The client only imports `@leetbytes/problems/public`; the
hidden suites stay out of the browser bundle solely because no import chain
reaches them from there.
