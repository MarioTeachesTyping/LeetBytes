// ================== //
// Request Validation //
// ================== //

// Zod schemas for the request bodies the server accepts. Each schema
// `satisfies` its hand-written type from submissions.ts, so the runtime
// validation and the shared types can never drift apart.

import { z } from "zod";
import type { JudgeSubmissionRequest } from "./submissions.ts";

export const MAX_SUBMISSION_CODE_LENGTH = 50_000;
export const MAX_CUSTOM_CASES = 20;

// The body shared by POST /submissions/run and POST /submissions/judge.
export const judgeSubmissionRequestSchema = z.object(
{
  problemSlug: z
    .string("problemSlug is required to judge a submission.")
    .trim()
    .min(1, "problemSlug is required to judge a submission."),
  language: z.literal("python"),
  code: z
    .string("Submission code is required.")
    .max(MAX_SUBMISSION_CODE_LENGTH, "Submission code is too large.")
    .refine((code) => code.trim().length > 0, "Submission code is required."),
}) satisfies z.ZodType<JudgeSubmissionRequest>;

// Optional user-edited cases on the run body. Each case only needs an `args`
// array; `expected` stays optional because the client owns expected display.
export const customCasesSchema = z
  .array(
    z.object(
    {
      args: z.array(z.unknown()),
      expected: z.unknown().optional(),
    }),
  )
  .max(MAX_CUSTOM_CASES, `A run may include at most ${MAX_CUSTOM_CASES} test cases.`);

export type CustomCases = z.infer<typeof customCasesSchema>;

// The run-body equivalent of customCasesSchema for "design" problems (a class
// with a constructor + method calls, e.g. LRUCache): each case is an
// operations/args sequence instead of a single args list.
export const designCustomCasesSchema = z
  .array(
    z.object(
    {
      operations: z.array(z.string()),
      args: z.array(z.array(z.unknown())),
    }),
  )
  .max(MAX_CUSTOM_CASES, `A run may include at most ${MAX_CUSTOM_CASES} test cases.`);

export type DesignCustomCases = z.infer<typeof designCustomCasesSchema>;
