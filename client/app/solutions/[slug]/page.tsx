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
    <main className="h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
        <Question
          title={entry.title}
          difficulty={entry.difficulty}
          description={entry.description}
          examples={entry.examples}
          constraints={entry.constraints}
          topics={entry.topics}
        />

        <Solution highlightedHtml={highlightedHtml} />
      </div>
    </main>
  );
}
