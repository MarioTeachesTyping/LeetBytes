// ================= //
// Minigame Registry //
// ================= //

// The shared contract every minigame implements, so GameStage's roulette can
// mount whichever one it lands on interchangeably. secondsLeft/targetScore
// are display-only — the round clock and win check both live in GameStage,
// not in the individual game.
import type { ComponentType } from "react";
import Tetris from "./Tetris";
import Snake from "./Snake";
import Pong from "./Pong";
import Breakout from "./Breakout";

export interface MinigameProps
{
  running: boolean;
  secondsLeft: number;
  targetScore: number;
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

// How many hints a problem has — every game's `targets` array below should
// have exactly this many entries, one per hint level.
export const TOTAL_HINT_LEVELS = 3;

export interface MinigameDefinition
{
  id: string;
  title: string;
  Component: ComponentType<MinigameProps>;
  // What GameStage's onScoreChange number means for this game, e.g. "5,000
  // points" vs "10 apples" — used to phrase the objective generically.
  unitName: string;
  // This game's own target per hint level (points for Tetris, apples eaten
  // for Snake) — index 0 is hint 1's target, index 1 is hint 2's, etc.
  targets: number[];
  // Screenshot the item-box roulette flashes for this game (under public/).
  screenshot: string;
}

// A hint level past the end of a game's targets array clamps to the last
// entry, same as the old shared HINT_SCORE_TARGETS behavior.
export function targetForLevel(game: MinigameDefinition, hintIndex: number): number
{
  return game.targets[Math.min(hintIndex, game.targets.length - 1)];
}

export const MINIGAMES: MinigameDefinition[] = [
  { id: "tetris", title: "Tetris", Component: Tetris, unitName: "points", targets: [5000, 10000, 15000], screenshot: "/game-images/tetris.png" },
  { id: "snake", title: "Snake", Component: Snake, unitName: "apples", targets: [10, 15, 20], screenshot: "/game-images/snake.png" },
  { id: "pong", title: "Pong", Component: Pong, unitName: "hits", targets: [10, 20, 30], screenshot: "/game-images/pong.png" },
  { id: "breakout", title: "Breakout", Component: Breakout, unitName: "bricks", targets: [10, 20, 30], screenshot: "/game-images/breakout.png" },
];
