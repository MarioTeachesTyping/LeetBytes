// ================= //
// Code Runner Types //
// ================= //

import type {
  RunSubmissionRequest,
  RunSubmissionResponse,
  SubmissionLanguage,
} from "@leetbytes/shared";

export type CodeRunnerSubmission = RunSubmissionRequest &
{
  language: SubmissionLanguage;
};

export type CodeRunnerResult = RunSubmissionResponse;

export const supportedLanguages = ["python"] as const;

// Narrows unknown request input to the languages this first runner supports.
export function isSupportedLanguage(language: unknown): language is SubmissionLanguage
{
  return supportedLanguages.includes(language as SubmissionLanguage);
}
