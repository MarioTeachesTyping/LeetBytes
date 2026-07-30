// ================== //
// Pixel Hover Button //
// ================== //

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PixelHoverButtonProps
{
  frames: string[];
  alt: string;
  width: number;
  height: number;
  href?: string;
  onClick?: () => void;
  intervalMs?: number;
}

const GLOW_FILTER =
  "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(255,255,255,0.35))";

// Cycles through `frames` (index 0 is also the resting frame) while hovered, fast,
// then snaps back to frame 0 on mouse leave. Renders as a Link when `href` is given,
// otherwise a button.
export default function PixelHoverButton({
  frames,
  alt,
  width,
  height,
  href,
  onClick,
  intervalMs = 90,
}: PixelHoverButtonProps)
{
  const [isHovered, setIsHovered] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() =>
  {
    if (!isHovered)
    {
      setFrameIndex(0);
      return;
    }

    const interval = setInterval(() =>
    {
      setFrameIndex((i) => (i + 1) % frames.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isHovered, frames.length, intervalMs]);

  const content = frames.map((src, i) => (
    <Image
      key={src}
      src={src}
      alt={alt}
      fill
      sizes={`${width}px`}
      priority
      className={`object-contain ${i === frameIndex ? "opacity-100" : "opacity-0"}`}
      style={{ filter: GLOW_FILTER }}
    />
  ));

  const sharedProps = {
    className: "relative block transition-transform hover:scale-105 active:scale-95",
    style: { width, height },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (href)
  {
    return (
      <Link href={href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} {...sharedProps}>
      {content}
    </button>
  );
}
