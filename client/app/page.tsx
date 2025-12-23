// ============ //
// Landing Page //
// ============ //

import Image from "next/image";
import Cubes from '@/components/react-bits/Cubes';

export default function Home() 
{
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* 3D Cubes Background */}
      <div className="absolute inset-0">
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
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <button className="px-12 py-3 bg-black text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-colors">
          Solutions
        </button>
      </div>
    </div>
  );
}
