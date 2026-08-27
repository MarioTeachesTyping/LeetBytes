// ============== //
// Snake Minigame //
// ============== //

"use client";

import React, { useEffect, useRef, useState } from "react";

const COLUMNS = 18;
const ROWS = 16;
const CELL_SIZE = 24;
const TICK_MS = 120;

type Direction = "up" | "down" | "left" | "right";
type Cell = { x: number; y: number };

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DELTA: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

type GameState = {
  snake: Cell[];
  direction: Direction;
  // Queued so a fast double key-press can't reverse the snake into itself
  // within the same tick — only the first turn since the last tick applies.
  pendingDirection: Direction;
  food: Cell;
  applesEaten: number;
  gameOver: boolean;
};

function randomEmptyCell(occupied: Cell[]): Cell
{
  const occupiedKeys = new Set(occupied.map((c) => `${c.x},${c.y}`));
  const options: Cell[] = [];
  for (let y = 0; y < ROWS; y++)
  {
    for (let x = 0; x < COLUMNS; x++)
    {
      if (!occupiedKeys.has(`${x},${y}`)) options.push({ x, y });
    }
  }
  return options[Math.floor(Math.random() * options.length)];
}

function initialState(): GameState
{
  const startY = Math.floor(ROWS / 2);
  const snake: Cell[] = [
    { x: 4, y: startY },
    { x: 3, y: startY },
    { x: 2, y: startY },
  ];
  return {
    snake,
    direction: "right",
    pendingDirection: "right",
    food: randomEmptyCell(snake),
    applesEaten: 0,
    gameOver: false,
  };
}

// One tick: advance in the queued direction, handle wall/self collision,
// and grow + count the apple on eating food. Pure: takes the previous state,
// returns a new one, no outside mutation.
function tick(state: GameState): GameState
{
  const direction = state.pendingDirection;
  const delta = DELTA[direction];
  const head = state.snake[0];
  const nextHead: Cell = { x: head.x + delta.x, y: head.y + delta.y };

  const hitWall = nextHead.x < 0 || nextHead.x >= COLUMNS || nextHead.y < 0 || nextHead.y >= ROWS;
  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  // The tail cell vacates this tick unless the snake just grew, so it's not
  // a collision to move into — matches how the sprite will actually render.
  const body = ateFood ? state.snake : state.snake.slice(0, -1);
  const hitSelf = body.some((cell) => cell.x === nextHead.x && cell.y === nextHead.y);

  if (hitWall || hitSelf)
  {
    return { ...state, direction, gameOver: true };
  }

  const snake = [nextHead, ...body];

  return {
    ...state,
    snake,
    direction,
    applesEaten: ateFood ? state.applesEaten + 1 : state.applesEaten,
    food: ateFood ? randomEmptyCell(snake) : state.food,
  };
}

interface SnakeProps
{
  running: boolean;
  secondsLeft: number;
  // Named for the shared MinigameProps contract — for Snake this is a target
  // apple count, not a point total.
  targetScore: number;
  onScoreChange: (applesEaten: number) => void;
  onGameOver: () => void;
}

// A grid-based Snake that runs its own movement/input loop while `running`
// is true. Apple count is reported upward each time it changes, so the
// parent can judge a win against its own countdown instead of this component
// tracking time itself. secondsLeft/targetApples are display-only, owned by
// the parent's round clock.
export default function Snake({ running, secondsLeft, targetScore: targetApples, onScoreChange, onGameOver }: SnakeProps)
{
  const [state, setState] = useState<GameState>(initialState);
  const onScoreChangeRef = useRef(onScoreChange);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() =>
  {
    onScoreChangeRef.current = onScoreChange;
  }, [onScoreChange]);

  useEffect(() =>
  {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() =>
  {
    onScoreChangeRef.current(state.applesEaten);
  }, [state.applesEaten]);

  useEffect(() =>
  {
    if (state.gameOver) onGameOverRef.current();
  }, [state.gameOver]);

  // Movement loop — only active while the round is running, and stops
  // advancing once game over so the board freezes on the final position.
  useEffect(() =>
  {
    if (!running) return;
    const interval = setInterval(() =>
    {
      setState((prev) => (prev.gameOver ? prev : tick(prev)));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running]);

  // Keyboard controls — only listening while the round is running, so input
  // never leaks to the page once the game ends or is exited.
  useEffect(() =>
  {
    if (!running) return;

    function handleKeyDown(event: KeyboardEvent)
    {
      const next = KEY_TO_DIRECTION[event.key];
      if (!next) return;
      event.preventDefault();
      setState((prev) =>
      {
        if (prev.gameOver || next === OPPOSITE[prev.direction]) return prev;
        return { ...prev, pendingDirection: next };
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running]);

  const snakeCells = new Set(state.snake.map((cell) => `${cell.x},${cell.y}`));
  const headKey = `${state.snake[0].x},${state.snake[0].y}`;
  const foodKey = `${state.food.x},${state.food.y}`;

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-3">
        <PanelBox label="Time">
          <span className="text-lg font-bold text-white">{secondsLeft}s</span>
        </PanelBox>
        <PanelBox label="Apples">
          <span className="text-sm font-semibold text-white">{state.applesEaten}</span>
          <span className="text-[10px] text-white/50">/ {targetApples}</span>
        </PanelBox>
        <PanelBox label="Controls">
          <ControlsList />
        </PanelBox>
      </div>

      <div
        className="border border-zinc-700 bg-black"
        style={{ width: COLUMNS * CELL_SIZE, height: ROWS * CELL_SIZE }}
      >
        {Array.from({ length: ROWS }, (_, y) => (
          <div key={y} className="flex">
            {Array.from({ length: COLUMNS }, (_, x) =>
            {
              const key = `${x},${y}`;
              const isHead = key === headKey;
              const isBody = !isHead && snakeCells.has(key);
              const isFood = key === foodKey;
              return (
                <div
                  key={x}
                  className="relative border border-zinc-900/60"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {isHead && <div className="absolute inset-0.5 bg-white" />}
                  {isBody && <div className="absolute inset-0.5 bg-white/70" />}
                  {isFood && <div className="snake-apple absolute inset-1" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Small bordered box used for the Time/Score/Controls panels — matches Tetris's
// PiecePanel so the two games sit consistently inside GameStage.
function PanelBox({ label, children }: { label: string; children: React.ReactNode })
{
  return (
    <div className="flex w-28 flex-col items-center gap-2 border border-zinc-700 bg-zinc-900 p-3">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</span>
      {children}
    </div>
  );
}

// Compact key -> action reference shown in the Controls panel.
const CONTROLS: [string, string][] = [["↑ ↓ ← →", "Move"]];

function ControlsList()
{
  return (
    <div className="flex w-full flex-col gap-1">
      {CONTROLS.map(([key, action]) => (
        <div key={action} className="flex items-center justify-between gap-1 text-[10px]">
          <span className="font-mono text-white/70">{key}</span>
          <span className="text-white/50">{action}</span>
        </div>
      ))}
    </div>
  );
}
