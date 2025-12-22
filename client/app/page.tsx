import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      
      {/* Floating circles */}
      <div className="absolute top-20 left-20 w-64 h-64 border border-white/10 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/5 rounded-full animate-pulse [animation-delay:1s]" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-white/10 rounded-full animate-pulse [animation-delay:2s]" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          {/* Glow effect behind icon */}
          <div className="absolute inset-0 blur-3xl bg-white/20 rounded-full scale-150" />
          <Image
            src="/icon.png"
            alt="LeetBytes Icon"
            width={200}
            height={200}
            priority
            className="relative z-10"
          />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-wider">LeetBytes</h1>
        <button className="px-12 py-3 bg-black text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          Solutions
        </button>
      </div>
    </div>
  );
}
