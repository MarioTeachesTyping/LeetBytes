// ============ //
// Navbar Panel //
// ============ //

"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PROBLEMS } from "@/lib/problems";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

function getAdjacentProblems(currentSlug: string) {
  const slugs = Object.keys(PROBLEMS);
  const currentIndex = slugs.indexOf(currentSlug);
  
  return {
    previous: currentIndex > 0 ? slugs[currentIndex - 1] : null,
    next: currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null,
  };
}

export default function Navbar() {
  const params = useParams();
  const currentSlug = params?.slug as string;
  const { previous, next } = currentSlug ? getAdjacentProblems(currentSlug) : { previous: null, next: null };

  return (
    <nav className="w-full h-11 border-b border-white/10 bg-black flex items-center justify-center relative">
      {/* Previous button */}
      <div className="absolute left-4">
        {previous ? (
          <Link href={`/solutions/${previous}`}>
            <button className="flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
              <FaChevronCircleLeft className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center text-white/30">
            <FaChevronCircleLeft className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Logo */}
      <Link href="/solutions" className="flex items-center">
        <Image
          src="/icon-logo.png" // or icon-dark.png
          alt="LeetBytes Logo"
          width={28}
          height={28}
          priority
        />
      </Link>

      {/* Next button */}
      <div className="absolute right-4">
        {next ? (
          <Link href={`/solutions/${next}`}>
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
    </nav>
  );
}