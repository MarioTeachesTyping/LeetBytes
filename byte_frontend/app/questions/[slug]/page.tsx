// ======== //
// The Glue //
// ======== //

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuestionPanel from "@/components/QuestionPanel";
import CodePanel from "@/components/CodePanel";
import ResizableSplit from "@/components/ResizableSplit";
import { WorkspaceProvider } from "@/components/WorkspaceContext";
import { getPublicProblem } from "@leetbytes/problems/public";
import { companyTagsForSlug, titleWithoutProblemNumber } from "@/lib/problem-list";

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

        <ResizableSplit
          left={
            <QuestionPanel
              title={titleWithoutProblemNumber(entry.title)}
              link={entry.link}
              source={entry.source}
              difficulty={entry.difficulty}
              description={entry.description}
              examples={entry.examples}
              constraints={entry.constraints}
              topics={entry.topics}
              companies={companyTagsForSlug(slug, entry.companies)}
              hints={entry.hints}
              code={entry.code}
              explanation={entry.explanation}
              solutions={entry.solutions}
            />
          }
          right={<CodePanel slug={slug} starterCode={entry.starterCode} />}
        />
      </WorkspaceProvider>
    </main>
  );
}
