// ============ //
// Landing Page //
// ============ //

"use client";

import Image from "next/image";
import Link from "next/link";
import Balatro from "@/components/react-bits/Balatro";

export default function Landing()
{
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center overflow-hidden">
      <div className="absolute inset-0">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      <div className="relative z-10 flex flex-1 items-center gap-8 sm:gap-14">
        <Image
          src="/base/icon-dark.png"
          alt="LeetBytes Icon"
          width={280}
          height={280}
          priority
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
        />

        <Image
          src="/base/title.png"
          alt="LeetBytes"
          width={560}
          height={162}
          priority
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
        />
      </div>

      <div className="relative z-10 flex items-center gap-8 sm:gap-12 pb-16 sm:pb-24">
        <Link href="/questions" className="transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/base/play-button.png"
            alt="Play"
            width={240}
            height={90}
            priority
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
          />
        </Link>

        <button type="button" className="transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/base/options-button.png"
            alt="Options"
            width={240}
            height={90}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
          />
        </button>

        <button type="button" className="transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/base/quit-button.png"
            alt="Quit"
            width={240}
            height={90}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
          />
        </button>
      </div>
    </div>
  );
}
