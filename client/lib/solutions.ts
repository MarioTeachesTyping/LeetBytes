// ================== //
// Solutions Database //
// ================== //

export type Example = {
  input: string;
  output: string;
  explanation?: string;
  image?: string;
};

export type Stat = {
  label: "Runtime" | "Memory";
  value: string;      // "0 ms", "19.05 MB"
  beats?: string;     // "100.00%", "19.44%"
};

export type SolutionEntry = {
  title: string;
  link?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: Example[];
  constraints?: string[];
  topics?: string[];
  companies?: string[];
  code: string;
  stats?: {
    runtime?: Stat;
    memory?: Stat;
  };
};

// Re-export from the organized problems directory
export { PROBLEMS as SOLUTIONS } from "./problems";
