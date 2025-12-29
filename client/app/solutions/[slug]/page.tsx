// ======== //
// The Glue //
// ======== //

import { notFound } from "next/navigation";
import Question from "@/components/Question";
import Solution from "@/components/Solution";
import { SOLUTIONS } from "@/lib/solutions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const entry = SOLUTIONS[slug];
  if (!entry) return notFound();

  return (
    <main className="h-screen bg-zinc-950 text-white">
      <div className="h-full grid grid-cols-1 md:grid-cols-2">
        <Question
          title={entry.title}
          difficulty={entry.difficulty}
          description={entry.description}
          examples={entry.examples}
          constraints={entry.constraints}
        />
        <Solution code={entry.code} />
      </div>
    </main>
  );
}
