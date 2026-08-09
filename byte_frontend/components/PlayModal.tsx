// ========== //
// Play Modal //
// ========== //

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PixelHoverButton from "@/components/PixelHoverButton";

const STORY_BUTTON_FRAMES = [
  "/base/button-story.png",
  "/base/button-story-2.png",
  "/base/button-story-3.png",
];

const QUESTIONS_BUTTON_FRAMES = [
  "/base/button-questions.png",
  "/base/button-questions-2.png",
  "/base/button-questions-3.png",
];

const PROGRESS_BUTTON_FRAMES = [
  "/base/button-progress.png",
  "/base/button-progress-2.png",
  "/base/button-progress-3.png",
];

const BACK_BUTTON_FRAMES = [
  "/base/button-back.png",
  "/base/button-back-2.png",
  "/base/button-back-3.png",
];

interface PlayModalProps
{
  open: boolean;
  onClose: () => void;
}

// Slides modal-short.png up from off-screen to center on open, and back down
// on close. Stays mounted through the close animation so it can play out.
export default function PlayModal({ open, onClose }: PlayModalProps)
{
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [backFrame, setBackFrame] = useState(0);

  useEffect(() =>
  {
    if (open)
    {
      setMounted(true);

      // Two rAFs, not one — the first just gets us to the next paint, where
      // the off-screen starting position actually renders. Flipping to
      // `entered` in that same paint (a single rAF) races React's commit and
      // skips straight to the end state with no visible slide.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() =>
      {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () =>
      {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setEntered(false);
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() =>
  {
    if (!backHovered)
    {
      setBackFrame(0);
      return;
    }

    const interval = setInterval(() =>
    {
      setBackFrame((i) => (i + 1) % BACK_BUTTON_FRAMES.length);
    }, 90);

    return () => clearInterval(interval);
  }, [backHovered]);

  if (!mounted)
  {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-[92vw] max-w-[900px]"
        style={{
          aspectRatio: "2048 / 1123",
          // The transition genuinely finishes (and stops) right before unmount —
          // that stop is only visible if it lands near the viewport edge, so
          // send it well past the bottom instead of just barely past its own height.
          transform: entered ? "translateY(0)" : "translateY(calc(100% + 60vh))",
          transition: "transform 300ms ease-out",
        }}
      >
        <Image
          src="/base/modal-long.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="absolute inset-[9%] flex flex-col items-center">
          <h2 className="shrink-0 mt-4 text-2xl text-white uppercase tracking-widest text-center sm:mt-6 sm:text-3xl">
            Choose Your Path
          </h2>

          <div className="flex flex-1 items-center justify-center">
            <div className="grid grid-cols-3 gap-x-10 sm:gap-x-12">
              {/* Not usable yet. */}
              <PixelHoverButton frames={STORY_BUTTON_FRAMES} alt="Story" width={210} height={162} />

              <PixelHoverButton
                href="/questions"
                frames={QUESTIONS_BUTTON_FRAMES}
                alt="Questions"
                width={210}
                height={162}
              />

              <PixelHoverButton
                href="/progress"
                frames={PROGRESS_BUTTON_FRAMES}
                alt="Progress"
                width={210}
                height={162}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            className="relative w-32 h-12 shrink-0 mb-4 pb-2 transition-transform hover:scale-105 active:scale-95 sm:w-40 sm:h-16 sm:mb-6"
          >
            {BACK_BUTTON_FRAMES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Back"
                fill
                sizes="160px"
                className={`object-contain ${i === backFrame ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
