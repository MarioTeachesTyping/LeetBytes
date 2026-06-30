// ============= //
// Spoiler Panel //
// ============= //

"use client";

import React, { useEffect, useState } from "react";
import { highlightPython } from "@/lib/highlight";
import type { SpoilerSolution } from "@/lib/problems";
import Balatro from "./react-bits/Balatro";

interface SpoilerProps {
  solutions: SpoilerSolution[];
}

/**
 * One read-only, syntax-highlighted code block hidden behind a Balatro overlay.
 * Highlights with Shiki on the client and reveals independently of its siblings.
 */
function SpoilerBlock({ code }: { code: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let active = true;

    highlightPython(code).then((result) => {
      if (active) setHtml(result);
    });

    return () => {
      active = false;
    };
  }, [code]);

  if (!html) {
    return (
      <div className="rounded-md bg-[#0d1117] p-4 text-sm text-white/40">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative rounded-md overflow-hidden">
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
          <button
            onClick={() => setRevealed(true)}
            className="absolute px-12 py-3 bg-black text-white font-semibold rounded-lg border border-white
                       hover:bg-white hover:text-black transition-colors"
          >
            Spoiler
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Spoiler view: each approach gets a title + description section above its own
 * revealable code block, so multiple ways of solving the problem can be listed.
 */
export default function Spoiler({ solutions }: SpoilerProps) {
  return (
    <div className="space-y-8">
      {solutions.map((solution, i) => (
        <div key={i} className="space-y-3">
          {/* Title + description section */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">{solution.title}</h2>
            {solution.description && (
              <p className="text-sm leading-relaxed text-zinc-300">
                {solution.description}
              </p>
            )}
          </div>

          <SpoilerBlock code={solution.code} />
        </div>
      ))}
    </div>
  );
}
