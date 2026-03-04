// ============ //
// Landing Page //
// ============ //

"use client";

import Balatro from "@/components/react-bits/Balatro";
import BalatroButton from "@/components/BalatroButton";

export default function Landing() 
{
  return (
    <div className="relative h-screen w-screen bg-black flex flex-col items-center justify-between overflow-hidden">
      {/* Balatro background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Balatro isRotate={false} mouseInteraction={true} pixelFilter={700} />
      </div>

      {/* Version tag — top right */}
      <div className="absolute top-3 right-4 z-20 font-[family-name:var(--font-pixel)] text-white/60 text-[10px]">
        v0.1.0
      </div>

      {/* Centre: Title */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <h1 className="font-[family-name:var(--font-pixel)] text-white text-7xl tracking-widest drop-shadow-[4px_6px_0px_rgba(0,0,0,0.7)]">
          LEETATRO
        </h1>
      </div>

      {/* Bottom bar — buttons */}
      <div className="relative z-10 w-full flex items-center justify-center pb-34">
        <div className="bg-[#374050]/80 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-3">
          <BalatroButton variant="play" className="py-5">PLAY</BalatroButton>
          <BalatroButton variant="options" className="py-5">OPTIONS</BalatroButton>
          <BalatroButton variant="quit" className="py-5">QUIT</BalatroButton>
          <BalatroButton variant="collection" className="py-5">COLLECTION</BalatroButton>
        </div>
      </div>
    </div>
  );
}
