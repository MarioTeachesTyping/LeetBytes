// ============ //
// Navbar Panel //
// ============ //

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-14 border-b border-white/10 bg-black flex items-center justify-center">
      <Link href="/solutions" className="flex items-center">
        <Image
          src="/icon-logo.png" // or icon-dark.png
          alt="LeetBytes Logo"
          width={28}
          height={28}
          priority
        />
      </Link>
    </nav>
  );
}