// ============== //
// Question Panel //
// ============== //

import React from "react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface QuestionProps {
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: Example[];
  constraints?: string[];
}

export default function Question({
  title,
  difficulty = "Easy",
  description,
  examples = [],
  constraints = [],
}: QuestionProps) {
  const difficultyColor =
    difficulty === "Easy"
      ? "text-emerald-400"
      : difficulty === "Medium"
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <aside className="h-full overflow-y-auto border-r border-white/10 bg-zinc-950 p-6">
      {/* Title */}
      <h1 className="text-xl font-semibold text-white mb-2">
        {title}
      </h1>

      {/* Difficulty */}
      <span
        className={`inline-block mb-4 text-sm font-medium ${difficultyColor}`}
      >
        {difficulty}
      </span>

      {/* Description */}
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        {description.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Examples</h2>

          {examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-md bg-zinc-900 p-4 text-sm text-zinc-300"
            >
              <p>
                <span className="font-semibold text-white">Input:</span>{" "}
                {ex.input}
              </p>
              <p>
                <span className="font-semibold text-white">Output:</span>{" "}
                {ex.output}
              </p>
              {ex.explanation && (
                <p className="mt-2">
                  <span className="font-semibold text-white">
                    Explanation:
                  </span>{" "}
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {constraints.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-white mb-2">
            Constraints
          </h2>
          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            {constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
