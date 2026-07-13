import { PROBLEMS, type SolutionEntry } from "@leetbytes/problems/public";

export type ProblemListRow = {
  title: string;
  difficulty: SolutionEntry["difficulty"];
  topics: string[];
  slug?: string;
};

const BACKLOG_ROWS: ProblemListRow[] = [
  { title: "Min Stack", difficulty: "Medium", topics: ["Stack", "Design"] },
  { title: "Majority Element", difficulty: "Easy", topics: ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"] },
  { title: "Number of Islands", difficulty: "Medium", topics: ["Array", "DFS", "BFS", "Union Find", "Matrix"] },
  { title: "Isomorphic Strings", difficulty: "Easy", topics: ["Hash Table", "String"] },
  { title: "Reverse Linked List", difficulty: "Easy", topics: ["Linked List", "Recursion"] },
  { title: "Kth Largest Element in an Array", difficulty: "Medium", topics: ["Array", "Divide and Conquer", "Sorting", "Heap"] },
  { title: "Contains Duplicate", difficulty: "Easy", topics: ["Array", "Hash Table", "Sorting"] },
  { title: "Contains Duplicate II", difficulty: "Easy", topics: ["Array", "Hash Table", "Sliding Window"] },
  { title: "Invert Binary Tree", difficulty: "Easy", topics: ["Tree", "BFS", "DFS", "Binary Tree"] },
  { title: "Valid Anagram", difficulty: "Easy", topics: ["Hash Table", "String", "Sorting"] },
  { title: "Meeting Rooms", difficulty: "Easy", topics: ["Array", "Sorting"] },
  { title: "Binary Tree Vertical Order Traversal", difficulty: "Medium", topics: ["Hash Table", "Tree", "DFS", "BFS", "Sorting", "Binary Tree"] },
  { title: "Minimum Remove to Make Valid Parentheses", difficulty: "Medium", topics: ["String", "Stack"] },
  { title: "Sequential Digits", difficulty: "Medium", topics: ["Enumeration"] },
  { title: "Check If All 1's Are at Least Length K Places Away", difficulty: "Easy", topics: ["Array"] },
];

const titleWithoutProblemNumber = (title: string) =>
  title.replace(/^\d+\.\s*/, "");

const problemNumber = (title: string) => {
  const match = title.match(/^(\d+)\./);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const solutionRows: ProblemListRow[] = Object.entries(PROBLEMS)
  .map(([slug, entry]) => ({
    title: titleWithoutProblemNumber(entry.title),
    difficulty: entry.difficulty,
    topics: entry.topics ?? [],
    slug,
    order: problemNumber(entry.title),
  }))
  .sort((a, b) => a.order - b.order)
  .map((row) => ({
    title: row.title,
    difficulty: row.difficulty,
    topics: row.topics,
    slug: row.slug,
  }));

export const PROBLEM_ROWS = [...solutionRows, ...BACKLOG_ROWS];

export const PROBLEM_TOPICS = [
  "All",
  ...Array.from(new Set(PROBLEM_ROWS.flatMap((item) => item.topics))).sort(),
];
