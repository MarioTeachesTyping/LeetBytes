// ========== //
// Game Stage //
// ========== //

"use client";

import React, { useEffect, useRef, useState } from "react";
import LetterGlitch from "../react-bits/LetterGlitch";
import PixelHoverButton from "../PixelHoverButton";
import ItemBox from "./ItemBox";
import { MINIGAMES, targetForLevel } from "./minigames";

const PLAY_BUTTON_FRAMES = ["/base/button-play.png", "/base/button-play-2.png", "/base/button-play-3.png"];
const RETRY_BUTTON_FRAMES = ["/base/button-retry.png", "/base/button-retry-2.png", "/base/button-retry-3.png"];
const BACK_BUTTON_FRAMES = ["/base/button-back.png", "/base/button-back-2.png", "/base/button-back-3.png"];
const QUIT_BUTTON_FRAMES = ["/base/button-quit.png", "/base/button-quit-2.png", "/base/button-quit-3.png"];

const GAME_DURATION_SECONDS = 60;

// The roulette flips through screenshots starting at ROULETTE_START_FLICKER_MS
// apart, each gap ROULETTE_SLOWDOWN times longer than the last, until
// ROULETTE_SPIN_MS has passed — so it visibly eases onto its pick like a
// Mario Kart item box rather than stopping dead.
const ROULETTE_START_FLICKER_MS = 60;
const ROULETTE_SLOWDOWN = 1.09;
const ROULETTE_SPIN_MS = 3400;
// How long the roulette holds on its pick before the round actually starts —
// long enough to actually read the objective, not just a beat.
const ROULETTE_REVEAL_HOLD_MS = 2500;

type Phase = "menu" | "roulette" | "countdown" | "playing" | "result";

interface GameStageProps
{
  // 0-based count of hints already unlocked — also the index into each
  // minigame's own targets array for the hint a win unlocks next.
  hintsUnlocked: number;
  allHintsUnlocked: boolean;
  onWin: () => void;
  onExit: () => void;
}

// Drives the minigame overlay through menu -> roulette -> countdown ->
// playing -> result. Mounted fresh each time the Navbar's Game button opens
// it (CodePanel.tsx unmounts it on exit), so every field here resets for
// free between rounds.
export default function GameStage({ hintsUnlocked, allHintsUnlocked, onWin, onExit }: GameStageProps)
{
  // 1-based, for display only.
  const hintNumber = hintsUnlocked + 1;

  const [phase, setPhase] = useState<Phase>("menu");
  const [displayedGameIndex, setDisplayedGameIndex] = useState(0);
  const [pickedGameIndex, setPickedGameIndex] = useState(0);
  // Driven by the spin timer, not by displayedGameIndex === pickedGameIndex —
  // with only 2 games, a random flicker tick lands on the eventual pick by
  // pure chance about half the time, which isn't the same as the spin ending.
  const [rouletteLanded, setRouletteLanded] = useState(false);
  // Bumped on Play and again on landing to replay the item box's "hit" pop.
  const [boxHitKey, setBoxHitKey] = useState(0);
  // Which screenshot the roulette starts flipping from — random per spin.
  const rouletteStartIndexRef = useRef(0);
  const [countdown, setCountdown] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SECONDS);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const scoreRef = useRef(0);

  // The hint number/target for the round in progress, frozen at round start.
  // onWin() bumps the parent's hintsUnlocked immediately, which would otherwise
  // shift hintNumber (and which game's target table applies) out from under
  // the result screen before it renders (e.g. winning hint 1 would display
  // "Hint 2 Unlocked"). The initial targetScore is never actually shown — it's
  // overwritten by spinRoulette() before the first round starts.
  const [roundHintNumber, setRoundHintNumber] = useState(hintNumber);
  const [roundTargetScore, setRoundTargetScore] = useState(() => targetForLevel(MINIGAMES[0], hintsUnlocked));
  const [roundAllHintsUnlocked, setRoundAllHintsUnlocked] = useState(allHintsUnlocked);

  // Warm the browser cache with every screenshot up front so the roulette
  // never flashes an empty frame while one is still downloading.
  useEffect(() =>
  {
    for (const game of MINIGAMES)
    {
      const img = new Image();
      img.src = game.screenshot;
    }
  }, []);

  // The roulette itself — cycles through the screenshots in order (so every
  // flip visibly changes), slowing down each step, then locks onto the
  // predetermined pickedGameIndex and holds it briefly before the round
  // starts.
  useEffect(() =>
  {
    if (phase !== "roulette") return;

    // spinRoulette() already reset rouletteLanded and put the box on this
    // starting frame, so the effect only has to schedule the flips.
    let index = rouletteStartIndexRef.current;
    let delay = ROULETTE_START_FLICKER_MS;
    let elapsed = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () =>
    {
      elapsed += delay;
      if (elapsed >= ROULETTE_SPIN_MS)
      {
        setDisplayedGameIndex(pickedGameIndex);
        setRouletteLanded(true);
        setBoxHitKey((k) => k + 1);
        timeout = setTimeout(() => setPhase("countdown"), ROULETTE_REVEAL_HOLD_MS);
        return;
      }
      index = (index + 1) % MINIGAMES.length;
      setDisplayedGameIndex(index);
      delay *= ROULETTE_SLOWDOWN;
      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, delay);

    return () => clearTimeout(timeout);
  }, [phase, pickedGameIndex]);

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

  // The board filling up (Tetris) or a wall/self hit (Snake) also ends the
  // round early, using whatever score was reached before then.
  function handleGameOver()
  {
    finishRound();
  }

  function handleScoreChange(next: number)
  {
    scoreRef.current = next;
    setScore(next);
  }

  // Kicks off a fresh round: picks the roulette's outcome up front (the spin
  // animation is just theater — the result is decided the moment it starts),
  // locks in this round's hint/target using that pick's own target table, and
  // resets the play clock.
  function spinRoulette()
  {
    const nextPickedIndex = Math.floor(Math.random() * MINIGAMES.length);

    scoreRef.current = 0;
    setScore(0);
    setWon(false);
    setSecondsLeft(GAME_DURATION_SECONDS);
    setCountdown(3);
    setAttempt((a) => a + 1);
    setRoundHintNumber(hintNumber);
    setRoundTargetScore(targetForLevel(MINIGAMES[nextPickedIndex], hintsUnlocked));
    setRoundAllHintsUnlocked(allHintsUnlocked);
    setPickedGameIndex(nextPickedIndex);
    const startIndex = Math.floor(Math.random() * MINIGAMES.length);
    rouletteStartIndexRef.current = startIndex;
    setDisplayedGameIndex(startIndex);
    setRouletteLanded(false);
    setBoxHitKey((k) => k + 1);
    setPhase("roulette");
  }

  const displayedGame = MINIGAMES[displayedGameIndex];
  const pickedGame = MINIGAMES[pickedGameIndex];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-y-auto border-2 border-white bg-zinc-950 p-4 text-white">
      <div className="absolute right-5 top-5 z-20">
        <PixelHoverButton frames={QUIT_BUTTON_FRAMES} alt="Quit" width={48} height={18} onClick={onExit} />
      </div>

      {/* Menu and roulette share one item box so it keeps floating/spinning
          straight through Play instead of remounting — only its contents
          change, from the "?" to the flashing screenshots. */}
      {(phase === "menu" || phase === "roulette") && (
        <div className="flex max-w-sm flex-col items-center gap-8 text-center">
          <p className="text-4xl font-bold">
            {phase === "menu" ? "Hint Minigame" : `Level ${roundHintNumber}`}
          </p>
          <ItemBox
            imageSrc={phase === "roulette" ? displayedGame.screenshot : undefined}
            imageAlt={phase === "roulette" ? displayedGame.title : undefined}
            landed={phase === "roulette" && rouletteLanded}
            hitKey={boxHitKey}
          />
          <div className="flex min-h-[60px] flex-col items-center justify-center gap-3">
            {phase === "menu" && (
              <>
                <p className="text-sm text-white/70">
                  {allHintsUnlocked
                    ? "All hints for this problem are unlocked already! Feel free to play anyway."
                    : "Complete a minigame to unlock a hint!"}
                </p>
                <PixelHoverButton frames={PLAY_BUTTON_FRAMES} alt="Start" width={160} height={60} onClick={spinRoulette} />
              </>
            )}
            {phase === "roulette" && rouletteLanded && (
              <>
                <p className="text-lg font-bold uppercase tracking-widest text-emerald-300">{pickedGame.title}</p>
                <p className="text-lg text-white/80">
                  {roundAllHintsUnlocked
                    ? `Get ${roundTargetScore.toLocaleString()} ${pickedGame.unitName} in ${GAME_DURATION_SECONDS}s`
                    : `Get ${roundTargetScore.toLocaleString()} ${pickedGame.unitName} in ${GAME_DURATION_SECONDS}s to unlock Hint ${roundHintNumber}`}
                </p>
              </>
            )}
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
            <pickedGame.Component
              key={attempt}
              running={phase === "playing"}
              secondsLeft={secondsLeft}
              targetScore={roundTargetScore}
              onScoreChange={handleScoreChange}
              onGameOver={handleGameOver}
            />
          </div>
        </div>
      )}

      {phase === "result" && (
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-widest text-white/40">{pickedGame.title}</p>
          <p className={`text-2xl font-bold ${won ? "text-emerald-300" : "text-red-300"}`}>
            {secondsLeft === 0 && "Time's Up! "}{won ? "You Win!" : "You Lose"}
          </p>
          {won && !roundAllHintsUnlocked && (
            <p className="font-semibold text-white">Hint {roundHintNumber} Unlocked!</p>
          )}
          <p className="text-sm text-white/60 capitalize">
            Final {pickedGame.unitName}: {score.toLocaleString()} / {roundTargetScore.toLocaleString()}
          </p>
          <div className="flex justify-center gap-2">
            {!won && (
              <PixelHoverButton frames={RETRY_BUTTON_FRAMES} alt="Try Again" width={140} height={52} onClick={spinRoulette} />
            )}
            <PixelHoverButton frames={BACK_BUTTON_FRAMES} alt="Back to Code" width={140} height={52} onClick={onExit} />
          </div>
        </div>
      )}
    </div>
  );
}
