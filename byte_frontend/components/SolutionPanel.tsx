// =============== //
// Solution Panel  //
// =============== //

"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlightPython } from "@/lib/highlight";
import { renderInlineCode } from "@/lib/inline-code";
import type { ComplexityNote, SolutionExplanation, SpoilerSolution } from "@leetbytes/problems/types";
import Balatro from "./react-bits/Balatro";
import PixelHoverButton from "./PixelHoverButton";

const SOLUTION_BUTTON_FRAMES = ["/base/button-solution.png", "/base/button-solution-2.png", "/base/button-solution-3.png"];

interface SolutionPanelProps
{
  solutions: SpoilerSolution[];
}

// Copies the solution's code to the clipboard, flashing a checkmark for a
// moment as confirmation before reverting back to the copy icon.
function CopyButton({ code }: { code: string })
{
  const [copied, setCopied] = useState(false);

  useEffect(() =>
  {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() =>
      {
        navigator.clipboard.writeText(code);
        setCopied(true);
      }}
      aria-label="Copy code"
      className="absolute right-2 top-2 z-20 flex items-center gap-1 border border-white/10 bg-black/60 px-2 py-1 text-xs text-white/70 transition-colors hover:bg-black/80 hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// One read-only, syntax-highlighted code block hidden behind a Balatro overlay.
// Highlights with Shiki on the client and reveals independently of its siblings.
function SolutionBlock({ code }: { code: string })
{
  const [html, setHtml] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() =>
  {
    let active = true;

    highlightPython(code).then((result) =>
    {
      if (active) setHtml(result);
    });

    return () =>
    {
      active = false;
    };
  }, [code]);

  if (!html) 
  {
    return (
      <div className="bg-[#0d1117] p-4 text-sm text-white/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="overflow-auto bg-[#0d1117] text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Balatro spoiler overlay (fade out on reveal) */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-opacity duration-500 ease-out
          ${revealed ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <Balatro isRotate={false} mouseInteraction={!revealed} />

        {!revealed && (
          <div className="absolute">
            <PixelHoverButton
              frames={SOLUTION_BUTTON_FRAMES}
              alt="Solution"
              width={200}
              height={75}
              onClick={() => setRevealed(true)}
            />
          </div>
        )}
      </div>

      {revealed && <CopyButton code={code} />}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode })
{
  return <h3 className="text-lg font-semibold text-white">{children}</h3>;
}

function ComplexityItem({ label, note }: { label: string; note: ComplexityNote })
{
  return (
    <li className="space-y-1">
      <p>
        {label}: <span className="font-mono text-white">{note.bigO}</span>.
      </p>
      <p className="text-zinc-400">{renderInlineCode(note.reason)}</p>
    </li>
  );
}

// LeetCode-editorial-style write-up: Intuition, optional Algorithm steps, and
// Complexity Analysis.
function Explanation({ explanation }: { explanation: SolutionExplanation })
{
  const { intuition, algorithm, complexity } = explanation;

  return (
    <div className="space-y-5 text-base leading-relaxed text-zinc-300">
      <section className="space-y-2">
        <SectionHeading>Intuition</SectionHeading>
        {intuition.map((paragraph, i) => (
          <p key={i}>{renderInlineCode(paragraph)}</p>
        ))}
      </section>

      {algorithm && algorithm.length > 0 && (
        <section className="space-y-2">
          <SectionHeading>Algorithm</SectionHeading>
          <ol className="list-decimal space-y-1.5 pl-6 marker:text-zinc-500">
            {algorithm.map((step, i) => (
              <li key={i}>{renderInlineCode(step)}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="space-y-2">
        <SectionHeading>Complexity Analysis</SectionHeading>
        <ul className="list-disc space-y-3 pl-6 marker:text-zinc-500">
          <ComplexityItem label="Time complexity" note={complexity.time} />
          <ComplexityItem label="Space complexity" note={complexity.space} />
        </ul>
      </section>
    </div>
  );
}

// Spoiler view: each approach is numbered and gets its write-up above its own
// revealable code block, so multiple ways of solving the problem can be listed.
export default function SolutionPanel({ solutions }: SolutionPanelProps)
{
  return (
    <div className="space-y-8">
      {solutions.map((solution, i) => (
        <div key={i} className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">
              {i + 1}. {solution.title}
            </h2>
            {solution.description && (
              <p className="text-base leading-relaxed text-zinc-300">
                {renderInlineCode(solution.description)}
              </p>
            )}
          </div>

          {solution.explanation && <Explanation explanation={solution.explanation} />}

          <div className="space-y-2">
            {solution.explanation && <SectionHeading>Implementation</SectionHeading>}
            <SolutionBlock code={solution.code} />
          </div>
        </div>
      ))}
    </div>
  );
}
