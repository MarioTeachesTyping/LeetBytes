// ============ //
// Navbar Panel //
// ============ //

"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FileText, EyeOff, Play, Gavel, Gamepad2 } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PROBLEM_ROWS } from "@/lib/problem-list";
import { useWorkspace } from "@/components/WorkspaceContext";
import NavTimers from "@/components/NavTimers";

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
    <nav className="w-full h-11 border-b-2 border-white/20 bg-black flex items-center relative">
      {/* Left cluster: previous arrow, logo, next arrow */}
      <div className="flex items-center gap-0 pl-1">
        {previous ? (
          <Link href={`/questions/${previous}`}>
            <button className="flex items-center justify-center w-9 h-9 text-white transition-colors hover:text-gray-400">
              <IoIosArrowBack className="w-6 h-6" />
            </button>
          </Link>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center opacity-30">
            <IoIosArrowBack className="w-6 h-6 text-white" />
          </div>
        )}

        <Link
          href="/questions"
          className="flex items-center justify-center w-11 h-11"
        >
          <Image
            src="/base/icon-light.png"
            alt="LeetBytes Logo"
            width={30}
            height={30}
            priority
          />
        </Link>

        {next ? (
          <Link href={`/questions/${next}`}>
            <button className="flex items-center justify-center w-9 h-9 text-white transition-colors hover:text-gray-400">
              <IoIosArrowForward className="w-6 h-6" />
            </button>
          </Link>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center opacity-30">
            <IoIosArrowForward className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Center cluster: Question · Spoiler · Game · Run · Judge */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView("question")}
          aria-pressed={view === "question"}
          className={`inline-flex items-center justify-center gap-1.5 w-28 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
            view === "question"
              ? "bg-white text-black border-white"
              : "border-white/30 text-white hover:bg-white hover:text-black"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="leading-none">Question</span>
        </button>
        <button
          type="button"
          onClick={() => setView("spoiler")}
          aria-pressed={view === "spoiler"}
          className={`inline-flex items-center justify-center gap-1.5 w-28 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
            view === "spoiler"
              ? "bg-white text-black border-white"
              : "border-white/30 text-white hover:bg-white hover:text-black"
          }`}
        >
          <EyeOff className="w-4 h-4" />
          <span className="leading-none">Solution</span>
        </button>

        {/* Game button — opens the minigame overlay in place of the editor */}
        <button
          type="button"
          onClick={openGame}
          className="flex items-center justify-center w-16 h-9 border-2 border-white/30 text-white hover:bg-white hover:text-black transition-colors"
        >
          <Gamepad2 className="w-7 h-7" />
        </button>

        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 w-28 py-1 text-xs font-bold uppercase tracking-wide border-2 border-white/30 text-white transition-colors
                     hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <Play className="w-4 h-4" />
          <span className="leading-none">Run</span>
        </button>
        <button
          type="button"
          onClick={judge}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 w-28 py-1 text-xs font-bold uppercase tracking-wide border-2 border-white/30 text-white transition-colors
                     hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
        >
          <Gavel className="w-4 h-4" />
          <span className="leading-none">Judge</span>
        </button>
      </div>

      {/* Right cluster: stopwatch, timer */}
      <div className="ml-auto flex items-center gap-2 pr-4">
        <NavTimers />
      </div>
    </nav>
  );
}