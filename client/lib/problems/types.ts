export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string;
  image?: string;
};

export type ProblemStat = {
  label: "Runtime" | "Memory";
  value: string;
  beats?: string;
};

// One spoiler entry: a titled, optionally-described approach whose code is
// hidden behind the spoiler overlay. A problem may list several (e.g. brute
// force vs. optimal) and each reveals independently.
export type SpoilerSolution = {
  title: string;
  description?: string;
  code: string;
};

export type SolutionEntry = {
  title: string;
  link?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: ProblemExample[];
  constraints?: string[];
  topics?: string[];
  companies?: string[];
  // Up to 3 hints pointing toward this problem's `code` approach. Written now
  // so the minigame-unlock feature can just reveal them later — the panel
  // currently renders every slot locked regardless of this content.
  hints?: string[];
  starterCode: string;
  code: string;
  // Spoiler approaches shown in the Spoiler view. When omitted, the Spoiler view
  // falls back to a single untitled block built from `code`.
  solutions?: SpoilerSolution[];
  stats?: {
    runtime?: ProblemStat;
    memory?: ProblemStat;
  };
};
