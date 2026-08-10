// ============= //
// Options Modal //
// ============= //

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getStoredPixelFontPreference,
  setPixelFontPreference,
} from "@/lib/pixelFont";
import { clearProgress } from "@/lib/progress";

const BACK_BUTTON_FRAMES = [
  "/base/button-back.png",
  "/base/button-back-2.png",
  "/base/button-back-3.png",
];

// How long each transient delete-button state stays up before reverting.
const DELETE_CONFIRM_TIMEOUT_MS = 4000;
const DELETE_DONE_TIMEOUT_MS = 2000;

type DeleteState = "idle" | "confirm" | "deleted";

interface OptionsModalProps
{
  open: boolean;
  onClose: () => void;
}

// Small uppercase label over a short rule, left-aligned with the row labels
// below it rather than centered across the panel.
function SectionHeading({ label }: { label: string })
{
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{label}</span>
      <div className="h-px w-16 bg-white/20" />
    </div>
  );
}

// Slides modal-short.png up from off-screen to center on open, and back down
// on close. Stays mounted through the close animation so it can play out.
export default function OptionsModal({ open, onClose }: OptionsModalProps)
{
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [pixelFontOn, setPixelFontOn] = useState(true);
  const [backHovered, setBackHovered] = useState(false);
  const [backFrame, setBackFrame] = useState(0);
  const [deleteState, setDeleteState] = useState<DeleteState>("idle");

  useEffect(() =>
  {
    setPixelFontOn(getStoredPixelFontPreference());
  }, []);

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

  // "For Real?" auto-reverts if left unconfirmed, and "Deleted" is only ever
  // a brief confirmation — both timers reset if the modal closes mid-flow.
  useEffect(() =>
  {
    if (!open)
    {
      setDeleteState("idle");
      return;
    }

    if (deleteState === "idle")
    {
      return;
    }

    const timeout = setTimeout(
      () => setDeleteState("idle"),
      deleteState === "confirm" ? DELETE_CONFIRM_TIMEOUT_MS : DELETE_DONE_TIMEOUT_MS,
    );
    return () => clearTimeout(timeout);
  }, [open, deleteState]);

  if (!mounted)
  {
    return null;
  }

  function choosePixelFont(enabled: boolean)
  {
    setPixelFontOn(enabled);
    setPixelFontPreference(enabled);
  }

  function handleDeleteClick()
  {
    if (deleteState === "idle")
    {
      setDeleteState("confirm");
      return;
    }

    if (deleteState === "confirm")
    {
      clearProgress();
      setDeleteState("deleted");
    }
  }

  const deleteLabel = deleteState === "idle" ? "Delete?" : deleteState === "confirm" ? "For Real?" : "Deleted";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-[92vw] max-w-[520px]"
        style={{
          aspectRatio: "1862 / 1443",
          // The transition genuinely finishes (and stops) right before unmount —
          // that stop is only visible if it lands near the viewport edge, so
          // send it well past the bottom instead of just barely past its own height.
          transform: entered ? "translateY(0)" : "translateY(calc(100% + 60vh))",
          transition: "transform 300ms ease-out",
        }}
      >
        <Image
          src="/base/modal-short.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="absolute inset-[9%] flex flex-col items-center">
          <div className="flex w-full flex-1 flex-col justify-center gap-5 px-2 sm:px-4">
            <div className="flex w-full flex-col items-center gap-3">
              <SectionHeading label="Graphics" />

              <div className="flex w-full items-center justify-between gap-4">
                <span className="text-base text-white uppercase tracking-wide sm:text-xl">
                  Pixel Font
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => choosePixelFont(true)}
                    aria-pressed={pixelFontOn}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
                      pixelFontOn
                        ? "bg-white text-black border-white"
                        : "border-white/30 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    On
                  </button>
                  <button
                    type="button"
                    onClick={() => choosePixelFont(false)}
                    aria-pressed={!pixelFontOn}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
                      !pixelFontOn
                        ? "bg-white text-black border-white"
                        : "border-white/30 text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    Off
                  </button>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-3">
              <SectionHeading label="Data" />

              <div className="flex w-full items-center justify-between gap-4">
                <span className="text-base text-white uppercase tracking-wide sm:text-xl">
                  Delete Progress
                </span>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={deleteState === "deleted"}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 transition-colors ${
                    deleteState === "confirm"
                      ? "bg-red-500 text-black border-red-500 hover:bg-red-400 hover:border-red-400"
                      : deleteState === "deleted"
                        ? "bg-white text-black border-white"
                        : "border-white/30 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {deleteLabel}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            className="relative w-28 h-11 shrink-0 mb-2 pb-2 transition-transform hover:scale-105 active:scale-95 sm:w-32 sm:h-12 sm:mb-3"
          >
            {BACK_BUTTON_FRAMES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Back"
                fill
                sizes="128px"
                className={`object-contain ${i === backFrame ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
