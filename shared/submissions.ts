// ================ //
// Submission Types //
// ================ //

export type SubmissionLanguage = "python";

export type RunSubmissionRequest =
{
  problemSlug?: string;
  language: SubmissionLanguage;
  code: string;
  stdin?: string;
};

export type RunSubmissionStatus = "success" | "error";

export type RunSubmissionResponse =
{
  status: RunSubmissionStatus;
  language: SubmissionLanguage;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  runtimeMs?: number;
  message?: string;
};
