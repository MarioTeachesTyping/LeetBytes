// ============ //
// Navbar Panel //
// ============ //

"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FileText, EyeOff, Play, Gavel, Gamepad2 } from "lucide-react";
import { PROBLEM_ROWS } from "@/lib/problem-list";
import { useWorkspace } from "@/components/WorkspaceContext";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

function getAdjacentProblems(currentSlug: string)
{
  const slugs = PROBLEM_ROWS.map((row) => row.slug).filter(
    (slug): slug is string => Boolean(slug)
  );
  const currentIndex = slugs.indexOf(currentSlug);
  
  return {
    previous: currentIndex > 0 ? slugs[currentIndex - 1] : null,
    next: currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null,
  };
}

export default function Navbar()
{
  const params = useParams();
  const currentSlug = params?.slug as string;
  const { previous, next } = currentSlug ? getAdjacentProblems(currentSlug) : { previous: null, next: null };

  const { view, setView, run, judge, busy, openGame } = useWorkspace();

  return (
    <nav className="w-full h-11 border-b border-white/10 bg-black flex items-center relative">
      {/* Left cluster: previous arrow, logo, next arrow */}
      <div className="flex items-center gap-2 pl-4">
        {previous ? (
          <Link href={`/questions/${previous}`}>
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
              <FaChevronCircleLeft className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center text-white/30">
            <FaChevronCircleLeft className="w-4 h-4" />
          </div>
        )}

        <Link
          href="/questions"
          className="group flex items-center justify-center w-8 h-8 rounded-full border border-white/30 overflow-hidden"
        >
          <Image
            src="/icon-logo.png" // or icon-dark.png
            alt="LeetBytes Logo"
            width={20}
            height={20}
            priority
            className="group-hover:animate-spin"
          />
        </Link>

        {next ? (
          <Link href={`/questions/${next}`}>
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
              <FaChevronCircleRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center text-white/30">
            <FaChevronCircleRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Center cluster: Question · Spoiler · Game · Run · Judge */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView("question")}
          aria-pressed={view === "question"}
          className={`inline-flex items-center justify-center gap-1.5 w-24 py-1 text-xs font-semibold leading-tight rounded-md border transition-colors ${
            view === "question"
              ? "bg-white text-black border-white"
              : "border-white/30 text-white hover:bg-white hover:text-black"
          }`}
        >
          <FileText className="w-4 h-4" />
          Question
        </button>
        <button
          type="button"
          onClick={() => setView("spoiler")}
          aria-pressed={view === "spoiler"}
          className={`inline-flex items-center justify-center gap-1.5 w-24 py-1 text-xs font-semibold leading-tight rounded-md border transition-colors ${
            view === "spoiler"
              ? "bg-white text-black border-white"
              : "border-white/30 text-white hover:bg-white hover:text-black"
          }`}
        >
          <EyeOff className="w-4 h-4" />
          Spoiler
        </button>

        {/* Game button — opens the minigame overlay in place of the editor */}
        <button
          type="button"
          onClick={openGame}
          className="flex items-center justify-center w-16 h-9 rounded-md border border-white/30 text-white hover:bg-white hover:text-black transition-colors"
        >
          <Gamepad2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 w-24 py-1 text-xs font-semibold leading-tight rounded-md border border-white/30 text-white transition-colors
                     hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <Play className="w-4 h-4" />
          Run
        </button>
        <button
          type="button"
          onClick={judge}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 w-24 py-1 text-xs font-semibold leading-tight rounded-md border border-white/30 text-white transition-colors
                     hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <Gavel className="w-4 h-4" />
          Judge
        </button>
      </div>
    </nav>
  );
}