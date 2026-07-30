// ========== //
// Game Stage //
// ========== //

"use client";

import React, { useEffect, useRef, useState } from "react";
import Tetris from "./Tetris";
import LetterGlitch from "../react-bits/LetterGlitch";
import PixelHoverButton from "../PixelHoverButton";

const PLAY_BUTTON_FRAMES = ["/base/button-play.png", "/base/button-play-2.png", "/base/button-play-3.png"];
const RETRY_BUTTON_FRAMES = ["/base/button-retry.png", "/base/button-retry-2.png", "/base/button-retry-3.png"];
const BACK_BUTTON_FRAMES = ["/base/button-back.png", "/base/button-back-2.png", "/base/button-back-3.png"];
const QUIT_BUTTON_FRAMES = ["/base/button-quit.png", "/base/button-quit-2.png", "/base/button-quit-3.png"];

// How much faster than real time the intro's background video plays.
const INTRO_VIDEO_PLAYBACK_RATE = 2.5;

const GAME_DURATION_SECONDS = 60;

type Phase = "intro" | "countdown" | "playing" | "result";

interface GameStageProps
{
  // 1-based — which hint number a win unlocks, for display only.
  hintNumber: number;
  targetScore: number;
  allHintsUnlocked: boolean;
  onWin: () => void;
  onExit: () => void;
}

// Drives the minigame overlay through intro -> countdown -> playing -> result.
// Mounted fresh each time the Navbar's Game button opens it (CodePanel.tsx
// unmounts it on exit), so every field here resets for free between rounds.
export default function GameStage({ hintNumber, targetScore, allHintsUnlocked, onWin, onExit }: GameStageProps)
{
  const [phase, setPhase] = useState<Phase>("intro");
  const [countdown, setCountdown] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const scoreRef = useRef(0);

  // The hint number/target for the round in progress, frozen at round start.
  // onWin() bumps the parent's hintsUnlocked immediately, which would otherwise
  // shift the hintNumber/targetScore props out from under the result screen
  // before it renders (e.g. winning hint 1 would display "Hint 2 Unlocked").
  const [roundHintNumber, setRoundHintNumber] = useState(hintNumber);
  const [roundTargetScore, setRoundTargetScore] = useState(targetScore);
  const [roundAllHintsUnlocked, setRoundAllHintsUnlocked] = useState(allHintsUnlocked);

  // 3-2-1 countdown before a round starts.
  useEffect(() =>
  {
    if (phase !== "countdown") return;
    if (countdown === 0)
    {
      setPhase("playing");
      return;
    }
    const timeout = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [phase, countdown]);

  // The 60-second play clock.
  useEffect(() =>
  {
    if (phase !== "playing") return;
    if (secondsLeft === 0)
    {
      finishRound();
      return;
    }
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  function finishRound()
  {
    const finalWon = scoreRef.current >= roundTargetScore;
    setWon(finalWon);
    setPhase("result");
    if (finalWon && !roundAllHintsUnlocked) onWin();
  }

  // The board filling up to the top also ends the round early, using
  // whatever score was reached before running out of room.
  function handleTopOut()
  {
    finishRound();
  }

  function handleScoreChange(next: number)
  {
    scoreRef.current = next;
    setScore(next);
  }

  function startRound()
  {
    scoreRef.current = 0;
    setScore(0);
    setWon(false);
    setSecondsLeft(GAME_DURATION_SECONDS);
    setCountdown(3);
    setAttempt((a) => a + 1);
    setRoundHintNumber(hintNumber);
    setRoundTargetScore(targetScore);
    setRoundAllHintsUnlocked(allHintsUnlocked);
    setPhase("countdown");
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto border-2 border-white bg-zinc-950 p-4 text-white">
      <div className="absolute right-5 top-5 z-20">
        <PixelHoverButton frames={QUIT_BUTTON_FRAMES} alt="Quit" width={48} height={18} onClick={onExit} />
      </div>

      {phase === "intro" && (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <video
            ref={(el) =>
            {
              if (el) el.playbackRate = INTRO_VIDEO_PLAYBACK_RATE;
            }}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
            src="/videos/tetris-gameplay.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="relative z-10 max-w-xs space-y-3 border border-white/10 bg-zinc-950/70 p-6 text-center backdrop-blur-sm">
            <p className="text-4xl font-bold">Tetris</p>
            {allHintsUnlocked ? (
              <p className="text-sm text-white/60">
                All hints for this problem are unlocked already! Feel free to play anyway.
              </p>
            ) : (
              <p className="text-sm text-white/70">
                Score {targetScore.toLocaleString()} points in {GAME_DURATION_SECONDS} seconds to unlock Hint{" "}
                {hintNumber}.
              </p>
            )}
            <div className="flex justify-center">
              <PixelHoverButton frames={PLAY_BUTTON_FRAMES} alt="Start" width={160} height={60} onClick={startRound} />
            </div>
          </div>
        </div>
      )}

      {phase === "countdown" && (
        <div className="text-6xl font-bold text-white">{countdown === 0 ? "Go!" : countdown}</div>
      )}

      {phase === "playing" && (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden">
          <div className="absolute inset-0">
            <LetterGlitch
              glitchSpeed={50}
              centerVignette={false}
              outerVignette={false}
              smooth
              grayscale
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Tetris
              key={attempt}
              running={phase === "playing"}
              secondsLeft={secondsLeft}
              targetScore={roundTargetScore}
              onScoreChange={handleScoreChange}
              onTopOut={handleTopOut}
            />
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="space-y-3 text-center">
          <p className={`text-2xl font-bold ${won ? "text-emerald-300" : "text-red-300"}`}>
            Time&apos;s Up! {won ? "You Win!" : "You Lose"}
          </p>
          {won && !roundAllHintsUnlocked && (
            <p className="font-semibold text-white">Hint {roundHintNumber} Unlocked!</p>
          )}
          <p className="text-sm text-white/60">
            Final score: {score.toLocaleString()} / {roundTargetScore.toLocaleString()}
          </p>
          <div className="flex justify-center gap-2">
            {!won && (
              <PixelHoverButton frames={RETRY_BUTTON_FRAMES} alt="Try Again" width={140} height={52} onClick={startRound} />
            )}
            <PixelHoverButton frames={BACK_BUTTON_FRAMES} alt="Back to Code" width={140} height={52} onClick={onExit} />
          </div>
        </div>
      )}
    </div>
  );
}
