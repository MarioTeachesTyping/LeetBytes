// ============ //
// Navbar Panel //
// ============ //

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-14 border-b border-white/10 bg-black flex items-center px-6">
      <Link href="/solutions" className="flex items-center gap-2">
        <Image
          src="/icon-logo.png"   // change if you want icon-dark.png
          alt="LeetBytes Logo"
          width={28}
          height={28}
          priority
        />
        <span className="text-white font-semibold tracking-wide">
          LeetBytes
        </span>
      </Link>
    </nav>
  );
}
