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

export type SolutionEntry = {
  title: string;
  link?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: ProblemExample[];
  constraints?: string[];
  topics?: string[];
  companies?: string[];
  starterCode: string;
  code: string;
  stats?: {
    runtime?: ProblemStat;
    memory?: ProblemStat;
  };
};
