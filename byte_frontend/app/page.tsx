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
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      <div className="relative z-10 flex items-center gap-16 sm:gap-24">
        <Image
          src="/base/icon-dark.png"
          alt="LeetBytes Icon"
          width={170}
          height={170}
          priority
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))" }}
        />

        <Link href="/questions" className="transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/base/play-button.png"
            alt="Play"
            width={240}
            height={112}
            priority
          />
        </Link>
      </div>
    </div>
  );
}
