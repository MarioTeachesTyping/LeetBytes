// ============ //
// Landing Page //
// ============ //

import Image from "next/image";
import Link from "next/link";
import Cubes from '@/components/react-bits/Cubes';

export default function Landing() 
{
  return (
    <div className="relative min-h-screen bg-black flex overflow-hidden">
      {/* 3D Cubes Background - Left Half */}
      <div className="absolute left-0 top-0 w-1/2 h-full">
        <Cubes 
          gridSize={12}
          maxAngle={30}
          radius={4}
          borderStyle="2px dotted #ffffff"
          faceColor="transparent"
          rippleColor="#ffffff"
          rippleSpeed={1.0}
          autoAnimate={true}
          rippleOnClick={true}
        />
      </div>
      
      {/* Right Side Content */}
      <div className="ml-auto w-1/2 flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/icon.png"
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
    </div>
  );
}
