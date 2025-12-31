// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";
import LetterGlitch from "./react-bits/LetterGlitch";

interface SolutionProps {
  highlightedHtml: string;
}

export default function Solution({ highlightedHtml }: SolutionProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="h-full bg-zinc-950 p-6 flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <span className="font-medium text-white">Code</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
          Python
        </span>
      </div>

      {/* Code container */}
      <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
        {/* Highlighted code */}
        <div
          className="h-full overflow-auto bg-[#0d1117] text-sm"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* LetterGlitch spoiler overlay */}
        {!revealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
            />

            {/* Reveal button */}
            <button
              onClick={() => setRevealed(true)}
              className="absolute px-12 py-3 bg-black text-white font-semibold rounded-full border border-white
                         hover:bg-white hover:text-black transition-colors"
            >
              Spoiler
            </button>
          </div>
        )}
      </div>

      {/* Bottom blank section (future use) */}
      <div className="mt-4 h-16 rounded-md border border-white/10 bg-white/5" />
    </section>
  );
}

