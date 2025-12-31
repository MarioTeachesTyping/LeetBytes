// =============== //
// Solutions Panel //
// =============== //

"use client";

import React, { useState } from "react";
import Iridescence from "./react-bits/Iridescence";

type StatCard = {
  value: string;
  beats?: string;
};

interface SolutionProps {
  highlightedHtml: string;
  stats?: {
    runtime?: StatCard;
    memory?: StatCard;
  };
}

function StatBox({ title, stat }: { title: string; stat?: StatCard }) {
  return (
    <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
          {title}
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="text-lg font-semibold text-white">
          {stat?.value ?? "—"}
        </div>

        <div className="text-xs text-white/60">
          {stat?.beats ? (
            <>
              Beats{" "}
              <span className="text-white font-semibold">{stat.beats}</span>{" "}
              <span className="text-emerald-400">🍃</span>
            </>
          ) : (
            " "
          )}
        </div>
      </div>
    </div>
  );
}

export default function Solution({ highlightedHtml, stats }: SolutionProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="h-full bg-zinc-950 p-6 flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <span className="font-medium text-white">Code</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">Python</span>
      </div>

      {/* Code container */}
      <div className="relative flex-1 min-h-0 rounded-md overflow-hidden">
        <div
          className="h-full overflow-auto bg-[#0d1117] text-sm"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* Iridescence spoiler overlay (fade out) */}
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
              className="absolute px-12 py-3 bg-black text-white font-semibold rounded-full border border-white
                         hover:bg-white hover:text-black transition-colors"
            >
              Spoiler
            </button>
          )}
        </div>
      </div>

      {/* Bottom stats section */}
      <div className="mt-4 flex gap-3">
        <StatBox title="Runtime" stat={stats?.runtime} />
        <StatBox title="Memory" stat={stats?.memory} />
      </div>
    </section>
  );
}
