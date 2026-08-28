// =========================== //
// Navbar Stopwatch and Timer //
// =========================== //

"use client";

import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";

function formatTime(totalSeconds: number): string
{
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const TIMER_PRESET_MINUTES = [5, 10, 15, 30, 60];

type Mode = "stopwatch" | "timer";

// A LeetCode-style practice stopwatch/timer, styled as a bordered digit box
// (matching the Run/Judge buttons) instead of a clean modern readout. Both
// modes keep ticking in the background even while the other is shown, so
// switching tabs never loses time. Fully client-local — nothing here
// persists or unlocks anything.
export default function NavTimers()
{
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("stopwatch");
  const containerRef = useRef<HTMLDivElement>(null);

  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  useEffect(() =>
  {
    if (!stopwatchRunning) return;
    const interval = setInterval(() => setStopwatchSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const [timerDuration, setTimerDuration] = useState(5 * 60);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerDone = !timerRunning && timerSecondsLeft === 0 && timerDuration > 0;

  useEffect(() =>
  {
    if (!timerRunning) return;
    if (timerSecondsLeft <= 0)
    {
      setTimerRunning(false);
      return;
    }
    const timeout = setTimeout(() => setTimerSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [timerRunning, timerSecondsLeft]);

  // Close the popover on a click outside the button/box.
  useEffect(() =>
  {
    if (!open) return;
    function handleClick(event: MouseEvent)
    {
      if (containerRef.current && !containerRef.current.contains(event.target as Node))
      {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function pickTimerPreset(minutes: number)
  {
    if (timerRunning) return;
    setTimerDuration(minutes * 60);
    setTimerSecondsLeft(minutes * 60);
  }

  // The button itself reflects whichever mode needs attention, regardless of
  // which one is currently shown in the popover.
  const anyRunning = stopwatchRunning || timerRunning;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-center w-9 h-9 border-2 transition-colors ${
          timerDone
            ? "border-red-400 text-red-300"
            : anyRunning
            ? "border-emerald-400 text-emerald-300"
            : "border-white/30 text-white hover:bg-white hover:text-black"
        }`}
      >
        <Timer className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-52 space-y-2 border-2 border-white/30 bg-black p-3">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMode("stopwatch")}
              className={`flex-1 border-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                mode === "stopwatch"
                  ? "border-white bg-white text-black"
                  : "border-white/30 text-white hover:bg-white hover:text-black"
              }`}
            >
              Stopwatch
            </button>
            <button
              type="button"
              onClick={() => setMode("timer")}
              className={`flex-1 border-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                mode === "timer"
                  ? "border-white bg-white text-black"
                  : "border-white/30 text-white hover:bg-white hover:text-black"
              }`}
            >
              Timer
            </button>
          </div>

          {mode === "stopwatch" ? (
            <>
              <p className="text-center font-mono text-2xl font-bold tabular-nums text-white">
                {formatTime(stopwatchSeconds)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStopwatchRunning((r) => !r)}
                  className="flex-1 border-2 border-white/30 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                >
                  {stopwatchRunning ? "Pause" : "Start"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                  {
                    setStopwatchRunning(false);
                    setStopwatchSeconds(0);
                  }}
                  className="flex-1 border-2 border-white/30 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                >
                  Reset
                </button>
              </div>
            </>
          ) : (
            <>
              <p
                className={`text-center font-mono text-2xl font-bold tabular-nums ${
                  timerDone ? "text-red-300" : "text-white"
                }`}
              >
                {timerDone ? "Time's Up!" : formatTime(timerSecondsLeft)}
              </p>
              {!timerRunning && (
                <div className="flex flex-wrap justify-center gap-1">
                  {TIMER_PRESET_MINUTES.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => pickTimerPreset(minutes)}
                      className={`border px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                        timerDuration === minutes * 60
                          ? "border-white bg-white text-black"
                          : "border-white/30 text-white/70 hover:bg-white hover:text-black"
                      }`}
                    >
                      {minutes === 60 ? "1hr" : `${minutes}m`}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                  {
                    if (timerSecondsLeft === 0) return;
                    setTimerRunning((r) => !r);
                  }}
                  disabled={timerSecondsLeft === 0}
                  className="flex-1 border-2 border-white/30 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  {timerRunning ? "Pause" : "Start"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                  {
                    setTimerRunning(false);
                    setTimerSecondsLeft(timerDuration);
                  }}
                  className="flex-1 border-2 border-white/30 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-black"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
