// ======== //
// The Glue //
// ======== //

import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Question from "@/components/Question";
import Solution from "@/components/Solution";
import { PROBLEMS } from "@/lib/problems";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const entry = PROBLEMS[slug];
  if (!entry) return notFound();

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0 gap-2 py-1 px-1">
        <div className="min-h-0">
          <Question
            title={entry.title}
            link={entry.link}
            difficulty={entry.difficulty}
            description={entry.description}
            examples={entry.examples}
            constraints={entry.constraints}
            topics={entry.topics}
            companies={entry.companies}
            code={entry.code}
            solutions={entry.solutions}
          />
        </div>

        <div className="min-h-0">
          <Solution slug={slug} starterCode={entry.starterCode} />
        </div>
      </div>
    </main>
  );
}
