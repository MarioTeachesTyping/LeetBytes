// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";

interface SolutionProps {
  highlightedHtml: string; // <-- now takes HTML, not raw code
}

export default function Solution({ highlightedHtml }: SolutionProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="h-full bg-zinc-950 p-6 flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <span className="font-medium text-white">Code</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">Python</span>
      </div>

      {/* Code container */}
      <div className="relative flex-1 min-h-0">
        <div
          className="h-full overflow-auto rounded-md bg-[#0d1117] text-sm"
          // Shiki outputs a <pre class="shiki">...</pre>
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* Spoiler overlay */}
        {!revealed && (
          <div className="absolute inset-0 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <button
              onClick={() => setRevealed(true)}
              className="px-12 py-3 bg-black text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-colors"
            >
              Spoiler
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
