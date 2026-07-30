// ============ //
// Landing Page //
// ============ //

"use client";

import Image from "next/image";
import Balatro from "@/components/react-bits/Balatro";
import PixelHoverButton from "@/components/PixelHoverButton";

const PLAY_BUTTON_FRAMES = ["/base/button-play.png", "/base/button-play-2.png", "/base/button-play-3.png"];
const OPTIONS_BUTTON_FRAMES = ["/base/button-options.png", "/base/button-options-2.png", "/base/button-options-3.png"];
const QUIT_BUTTON_FRAMES = ["/base/button-quit.png", "/base/button-quit-2.png", "/base/button-quit-3.png"];

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
        <PixelHoverButton href="/questions" frames={PLAY_BUTTON_FRAMES} alt="Play" width={240} height={90} />
        <PixelHoverButton frames={OPTIONS_BUTTON_FRAMES} alt="Options" width={240} height={90} />
        <PixelHoverButton frames={QUIT_BUTTON_FRAMES} alt="Quit" width={240} height={90} />
      </div>
    </div>
  );
}
