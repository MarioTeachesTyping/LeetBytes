// ======== //
// The Glue //
// ======== //

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuestionPanel from "@/components/QuestionPanel";
import CodePanel from "@/components/CodePanel";
import { WorkspaceProvider } from "@/components/WorkspaceContext";
import { getPublicProblem } from "@leetbytes/problems/public";
import { titleWithoutProblemNumber } from "@/lib/problem-list";

type PageProps =
{
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata>
{
  const { slug } = await params;
  const entry = getPublicProblem(slug);
  if (!entry) return {};

  return { title: `${titleWithoutProblemNumber(entry.title)} - LeetBytes` };
}

export default async function Page({ params }: PageProps)
{
  const { slug } = await params;

  const entry = getPublicProblem(slug);
  if (!entry) return notFound();

  return (
    <main className="h-screen bg-black text-white flex flex-col">
      <WorkspaceProvider>
        <Navbar />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0 gap-2 py-1 px-1">
          <div className="min-h-0">
            <QuestionPanel
              title={entry.title}
              link={entry.link}
              difficulty={entry.difficulty}
              description={entry.description}
              examples={entry.examples}
              constraints={entry.constraints}
              topics={entry.topics}
              companies={entry.companies}
              hints={entry.hints}
              code={entry.code}
              solutions={entry.solutions}
            />
          </div>

          <div className="min-h-0">
            <CodePanel slug={slug} starterCode={entry.starterCode} />
          </div>
        </div>
      </WorkspaceProvider>
    </main>
  );
}
