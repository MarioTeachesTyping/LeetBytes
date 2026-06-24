// ============= //
// Spoiler Panel //
// ============= //

"use client";

import React, { useEffect, useState } from "react";
import { highlightPython } from "@/lib/highlight";
import Iridescence from "./react-bits/Iridescence";

interface SpoilerProps {
  code: string;
}

/**
 * Read-only, syntax-highlighted view of a problem's solution code.
 * Uses Shiki to highlight on the client (no editing needed).
 */
export default function Spoiler({ code }: SpoilerProps) {
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

      {/* Iridescence spoiler overlay (fade out on reveal) */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-opacity duration-500 ease-out
          ${revealed ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />

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
