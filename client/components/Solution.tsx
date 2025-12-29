import React from "react";

interface SolutionProps {
  code: string;
}

export default function Solution({ code }: SolutionProps) {
  return (
    <section className="h-full overflow-y-auto bg-zinc-950 p-6">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
        <span className="font-medium text-white">Code</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
          Python
        </span>
      </div>

      {/* Code block */}
      <pre className="rounded-md bg-zinc-900 p-4 text-sm text-zinc-200 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </section>
  );
}
