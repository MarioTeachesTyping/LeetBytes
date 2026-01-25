// ======== //
// The Glue //
// ======== //

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Question from "@/components/Question";
import Solution from "@/components/Solution";
import { SOLUTIONS } from "@/lib/solutions";
import { highlightPython } from "@/lib/highlight";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const entry = SOLUTIONS[slug];
  if (!entry) return notFound();

  const highlightedHtml = await highlightPython(entry.code);

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0 gap-2 py-1 px-1">
        <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
          <Question
            title={entry.title}
            difficulty={entry.difficulty}
            description={entry.description}
            examples={entry.examples}
            constraints={entry.constraints}
            topics={entry.topics}
          />
        </div>

        <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
          <Solution 
            highlightedHtml={highlightedHtml} 
            slug={slug}
            stats={entry.stats} 
          />
        </div>
      </div>
    </main>
  );
}
