// ============= //
// Spoiler Panel //
// ============= //

"use client";

import React, { useEffect, useState } from "react";
import { highlightPython } from "@/lib/highlight";

interface SpoilerProps {
  code: string;
}

/**
 * Read-only, syntax-highlighted view of a problem's solution code.
 * Uses Shiki to highlight on the client (no editing needed).
 */
export default function Spoiler({ code }: SpoilerProps) {
  const [html, setHtml] = useState<string | null>(null);

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
    <div
      className="overflow-auto rounded-md bg-[#0d1117] text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
