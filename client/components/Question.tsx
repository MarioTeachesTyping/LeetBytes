// ============== //
// Question Panel //
// ============== //

"use client";

import React, { useRef } from "react";

interface Example {
  input: string;
  output: string;
  explanation?: string;
  image?: string;
}

interface QuestionProps {
  title: string;
  link?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  description: string[];
  examples?: Example[];
  constraints?: string[];
  topics?: string[];
  companies?: string[];
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
  link,
  difficulty = "Easy",
  description,
  examples = [],
  constraints = [],
  topics = [],
  companies = [],
}: QuestionProps) {
  const topicsRef = useRef<HTMLDivElement | null>(null);
  const companiesRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToCompanies = () => {
    if (!companiesRef.current) return;
    companiesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="h-full overflow-y-auto px-3 py-4">
      {/* Title */}
      {link ? (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-2xl font-semibold text-white mb-3 hover:text-gray-400 transition-colors cursor-pointer inline-block"
        >
          {title}
        </a>
      ) : (
        <h1 className="text-2xl font-semibold text-white mb-3">{title}</h1>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center justify-center rounded-full border px-3 py-0.5 text-base font-semibold ${difficultyStyles}`}
        >
          {difficulty}
        </span>

        {topics.length > 0 && (
          <button
            type="button"
            onClick={scrollToTopics}
            className="inline-flex items-center justify-center rounded-full border border-orange-300/40 bg-orange-400/10 px-3 py-0.5 text-base font-medium text-orange-200
                       hover:bg-orange-400 hover:text-white transition-colors"
          >
            Topics
          </button>
        )}

        {companies.length > 0 && (
          <button
            type="button"
            onClick={scrollToCompanies}
            className="inline-flex items-center justify-center rounded-full border border-sky-300/40 bg-sky-400/10 px-3 py-0.5 text-base font-medium text-sky-200
                       hover:bg-sky-400 hover:text-white transition-colors"
          >
            Companies
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
              {ex.image && (
                  <div className="mt-3">
                    <img
                      src={ex.image}
                      alt={`Example ${i + 1} illustration`}
                      className="max-w-full h-auto rounded-lg border border-white/20 bg-white p-2"
                    />
                  </div>
                )}
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
          <details className="group rounded-lg border border-orange-300/40 bg-orange-400/10">
            <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-orange-200">Topics</span>
              <span className="text-orange-200/70 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>

            <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
              {topics.map((t) => (
                <span
                  key={`dropdown-${t}`}
                  className="inline-flex items-center justify-center rounded-full border border-orange-300/30 bg-orange-400/20 px-3 py-1 text-sm font-medium text-orange-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Companies dropdown */}
      {companies.length > 0 && (
        <div ref={companiesRef} className="mt-8 scroll-mt-24">
          <details className="group rounded-lg border border-sky-300/40 bg-sky-400/10">
            <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center justify-between">
              <span className="text-lg font-semibold text-sky-200">Companies</span>
              <span className="text-sky-200/70 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>

            <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
              {companies.map((c) => (
                <span
                  key={`company-${c}`}
                  className="inline-flex items-center justify-center rounded-full border border-sky-300/30 bg-sky-400/20 px-3 py-1 text-sm font-medium text-sky-100"
                >
                  {c}
                </span>
              ))}
            </div>
          </details>
        </div>
      )}

      <div>
        <p className="mt-10 text-xs text-white/40">
          Copyright © 2026 LeetCode. All rights reserved.
        </p>
      </div>
    </aside>
  );
}
