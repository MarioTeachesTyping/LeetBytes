// ============== //
// Question Panel //
// ============== //

"use client";

import React, { useRef } from "react";

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
  topics?: string[];
}

/**
 * Renders text with backtick-wrapped segments as inline code.
 * Example: "use `nums[i]` here" → nums[i] is styled like code
 */
function renderInlineCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") ? (
      <code
        key={i}
        className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-zinc-100"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Question({
  title,
  difficulty = "Easy",
  description,
  examples = [],
  constraints = [],
  topics = [],
}: QuestionProps) {
  const topicsRef = useRef<HTMLDivElement | null>(null);

  const difficultyStyles =
    difficulty === "Easy"
      ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
      : difficulty === "Medium"
      ? "border-amber-400/40 text-amber-300 bg-amber-500/10"
      : "border-rose-400/40 text-rose-300 bg-rose-500/10";

  const scrollToTopics = () => {
    if (!topicsRef.current) return;
    topicsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="h-full overflow-y-auto border-r border-white/10 bg-zinc-950 p-7">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white mb-3">{title}</h1>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center justify-center rounded-full border px-4 py-1 text-base font-semibold ${difficultyStyles}`}
        >
          {difficulty}
        </span>

        {topics.length > 0 && (
          <button
            type="button"
            onClick={scrollToTopics}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-base font-medium text-white/90
                       hover:bg-white hover:text-black transition-colors"
          >
            Topics
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mt-5 space-y-4 text-base text-zinc-200 leading-relaxed">
        {description.map((line, i) => (
          <p key={i}>{renderInlineCode(line)}</p>
        ))}
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="mt-8 space-y-7">
          {examples.map((ex, i) => (
            <div key={i} className="space-y-3 text-base text-zinc-200">
              <p className="text-lg font-semibold text-white">
                Example {i + 1}:
              </p>

              <div className="pl-5 space-y-2 border-l border-white/10">
                <p>
                  <span className="font-semibold text-white">Input:</span>{" "}
                  {renderInlineCode(ex.input)}
                </p>
                <p>
                  <span className="font-semibold text-white">Output:</span>{" "}
                  {renderInlineCode(ex.output)}
                </p>
                {ex.explanation && (
                  <p>
                    <span className="font-semibold text-white">
                      Explanation:
                    </span>{" "}
                    {renderInlineCode(ex.explanation)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {constraints.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-3">Constraints</h2>
          <ul className="list-disc list-inside text-base text-zinc-200 space-y-2">
            {constraints.map((c, i) => (
              <li key={i}>{renderInlineCode(c)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Topics dropdown */}
      {topics.length > 0 && (
        <div ref={topicsRef} className="mt-8 scroll-mt-24">
          <details className="group rounded-lg border border-white/10 bg-white/5">
            <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Topics</span>
              <span className="text-white/70 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>

            <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
              {topics.map((t) => (
                <span
                  key={`dropdown-${t}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm font-medium text-white/90"
                >
                  {t}
                </span>
              ))}
            </div>
          </details>
        </div>
      )}
    </aside>
  );
}
