// =========== //
// Loading Bar //
// =========== //

// A centered, game-style loading bar shown between route changes.
//
// The App Router has no router events to hook, so navigation start is detected
// by intercepting internal link clicks in the capture phase, and navigation end
// by usePathname() changing once the new route commits.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Discrete blocks rather than a smooth fill — the stepping is what makes it
// read as a game bar instead of a browser progress indicator.
const SEGMENTS = 24;

// Local navigations are near-instant, so without a floor the bar just flashes.
const MIN_VISIBLE_MS = 450;
// A short beat on a full bar before it disappears.
const DONE_HOLD_MS = 160;
// A navigation the router never commits (aborted, blocked) must not strand the
// overlay on screen forever.
const SAFETY_MS = 8000;

type Phase = "idle" | "loading" | "done";

export default function LoadingBar()
{
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(1);

  const phaseRef = useRef<Phase>("idle");
  const progressRef = useRef(0);
  const startedAt = useRef(0);

  phaseRef.current = phase;
  progressRef.current = progress;

  function begin()
  {
    startedAt.current = Date.now();
    setProgress(0);
    setPhase("loading");
  }

  // Navigation start.
  useEffect(() =>
  {
    function onClick(event: MouseEvent)
    {
      // Let the browser handle anything that isn't a plain left-click, and
      // anything a handler upstream already claimed.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // Same route — nothing commits, so pathname never changes and the bar
      // would have nothing to end it.
      if (url.pathname === window.location.pathname) return;

      begin();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", begin);

    return () =>
    {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", begin);
    };
  }, []);

  // Navigation end — the new route has committed. Deliberately keyed on
  // pathname alone; phase comes from a ref so this can't re-fire on its own
  // state change.
  useEffect(() =>
  {
    if (phaseRef.current !== "loading") return;

    setPhase("done");
  }, [pathname]);

  // Creep toward 92% while loading — real progress is unknowable here, so the
  // bar eases toward the cap and only fills on commit.
  useEffect(() =>
  {
    if (phase !== "loading") return;

    const interval = setInterval(() =>
    {
      setProgress((current) => current + (0.92 - current) * 0.1);
    }, 55);

    const safety = setTimeout(() => setPhase("idle"), SAFETY_MS);

    return () =>
    {
      clearInterval(interval);
      clearTimeout(safety);
    };
  }, [phase]);

  useEffect(() =>
  {
    if (phase !== "done") return;

    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(DONE_HOLD_MS, MIN_VISIBLE_MS - elapsed);

    // Sweep the rest of the bar across the remaining hold rather than snapping
    // to 100% — a navigation that commits instantly should still look like it
    // filled, not like the bar skipped.
    const sweep = Math.max(0, wait - DONE_HOLD_MS);
    const from = progressRef.current;
    const sweepStart = Date.now();

    const interval = setInterval(() =>
    {
      const t = sweep === 0 ? 1 : Math.min(1, (Date.now() - sweepStart) / sweep);
      setProgress(from + (1 - from) * t);
    }, 30);

    const timeout = setTimeout(() => setPhase("idle"), wait);

    return () =>
    {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [phase]);

  useEffect(() =>
  {
    if (phase === "idle") return;

    const interval = setInterval(() => setDots((n) => (n % 3) + 1), 260);
    return () => clearInterval(interval);
  }, [phase]);

  if (phase === "idle")
  {
    return null;
  }

  const filled = Math.round(progress * SEGMENTS);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      {/* Same frame convention as the questions list and progress panels */}
      <div className="bg-white/25 p-[3px]">
        <div className="flex flex-col gap-3 bg-black/95 px-6 py-5">
          <div className="flex items-baseline justify-between gap-8">
            <span className="text-sm tracking-[0.25em] text-white">
              LOADING{".".repeat(dots)}
            </span>
            <span className="text-[10px] tracking-[0.2em] text-white/60">
              {Math.round(progress * 100)}%
            </span>
          </div>

          <div className="flex gap-[2px] border-2 border-white/20 bg-black p-[3px]">
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <div
                key={i}
                className={`h-4 w-2 ${
                  i < filled
                    ? // The leading block sits brighter, like a fill head.
                      i === filled - 1
                      ? "bg-white"
                      : "bg-white/70"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
