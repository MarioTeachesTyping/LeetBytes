// ============ //
// Landing Page //
// ============ //

import Image from "next/image";
import Link from "next/link";
import LetterGlitch from '@/components/react-bits/LetterGlitch';

export default function Landing() 
{
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* LetterGlitch Background */}
      <div className="absolute inset-0">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
      
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/icon-logo.png"
          alt="LeetBytes Icon"
          width={200}
          height={200}
          priority
        />
        <h1 className="text-4xl font-bold text-white tracking-wider">
          LeetBytes
        </h1>
        <Link href="/solutions">
          <button className="px-12 py-3 bg-black text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-colors">
            Solutions
          </button>
        </Link>
      </div>
    </div>
  );
}
