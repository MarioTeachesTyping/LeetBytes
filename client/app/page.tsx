// ============ //
// Landing Page //
// ============ //

"use client";

import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/react-bits/Particles";
import CircularText from "@/components/react-bits/CircularText";

export default function Landing() 
{
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* ONE wrapper defines the center */}
        <div className="relative w-[290px] h-[290px]">
          {/* Ring: force it to fill wrapper + cancel mx-auto */}
          <CircularText
            text="L E E T B Y T E S ● L E E T B Y T E S ● "
            onHover="speedUp"
            spinDuration={20}
            className="absolute inset-0 w-full h-full mx-0 pointer-events-none"
          />

          {/* Logo: absolute center */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Image
              src="/icon-logo.png"
              alt="LeetBytes Icon"
              width={170}
              height={170}
              priority
            />
          </div>
        </div>

        <Link href="/solutions">
          <button className="px-12 py-3 bg-black text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-colors">
            Solutions
          </button>
        </Link>
      </div>
    </div>
  );
}
