// ================ //
// Problem Registry //
// ================ //

// Thin wrapper over the workspace's single source of truth. Problem content
// lives in the @leetbytes/problems package: each problems/<slug>/ folder pairs
// the client-visible public.ts with the server-only hidden.ts judged here.

import { getHiddenProblem, HIDDEN_PROBLEMS } from "@leetbytes/problems/hidden";
import type { HiddenProblem } from "@leetbytes/problems/types";
import type { ProblemCasesResponse } from "@leetbytes/shared";

// Returns the answer key for a slug, or undefined when the problem is not judged yet.
export function getProblem(slug: string): HiddenProblem | undefined
{
  return getHiddenProblem(slug);
}

// The public example inputs a client may show and edit in the Test Cases tab.
// Only the published examples are exposed — the hidden judged suite stays server-side.
export function publicCases(slug: string): ProblemCasesResponse | undefined
{
  const problem = getHiddenProblem(slug);

  if (!problem)
  {
    return undefined;
  }

  if (problem.kind === "design")
  {
    const source = problem.examples ?? [];

    return {
      kind: "design",
      cases: source.map((test) => ({ operations: test.operations, args: test.args, expected: test.expected })),
    };
  }

  const source = problem.examples ?? [];

  return {
    kind: "function",
    paramNames: problem.paramNames ?? [],
    cases: source.map((test) => ({ args: test.args, expected: test.expected })),
  };
}

// Lists the slugs that currently support judged submissions.
export function judgedSlugs(): string[]
{
  return Object.keys(HIDDEN_PROBLEMS);
}
