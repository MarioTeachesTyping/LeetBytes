// =============== //
// Solution Panel  //
// =============== //

"use client";

import React, { useEffect, useState } from "react";
import { highlightPython } from "@/lib/highlight";
import type { SpoilerSolution } from "@leetbytes/problems/types";
import Balatro from "./react-bits/Balatro";
import PixelHoverButton from "./PixelHoverButton";

const SOLUTION_BUTTON_FRAMES = ["/base/button-solution.png", "/base/button-solution-2.png", "/base/button-solution-3.png"];

interface SolutionPanelProps 
{
  solutions: SpoilerSolution[];
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
    </div>
  );
}

// Spoiler view: each approach gets a title + description section above its own
// revealable code block, so multiple ways of solving the problem can be listed.
export default function SolutionPanel({ solutions }: SolutionPanelProps)
{
  return (
    <div className="space-y-8">
      {solutions.map((solution, i) => (
        <div key={i} className="space-y-3">
          {/* Title + description section */}
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">{solution.title}</h2>
            {solution.description && (
              <p className="text-base leading-relaxed text-zinc-300">
                {solution.description}
              </p>
            )}
          </div>

          <SolutionBlock code={solution.code} />
        </div>
      ))}
    </div>
  );
}
