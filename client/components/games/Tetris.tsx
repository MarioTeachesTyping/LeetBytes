// =============== //
// Tetris Minigame //
// =============== //

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

const COLUMNS = 10;
const ROWS = 20;
const CELL_SIZE = 28;
const DROP_INTERVAL_MS = 600;

const TETROMINO_SPRITES: Record<TetrominoType, string> = {
  I: "/game-images/tetromino-cyan.png",
  O: "/game-images/tetromino-yellow.png",
  T: "/game-images/tetromino-violet.png",
  S: "/game-images/tetromino-green.png",
  Z: "/game-images/tetromino-red.png",
  J: "/game-images/tetromino-blue.png",
  L: "/game-images/tetromino-orange.png",
};

const TETROMINO_TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

// Each piece's 4 rotation states, as [x, y] cell offsets in a 4x4 box.
const ROTATIONS: Record<TetrominoType, [number, number][][]> = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]],
  ],
  O: [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]],
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[1, 1], [2, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]],
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
  ],
};

// Points per simultaneous line clear, before the combo bonus. Tuned for this
// minigame's own 50k-100k/60s targets, not standard Tetris guideline scoring.
const LINE_CLEAR_SCORES: Record<number, number> = { 1: 1000, 2: 2500, 3: 5000, 4: 10000 };

// How many upcoming pieces are shown in the Next panel.
const NEXT_COUNT = 6;

type Board = (TetrominoType | null)[][];

type ActivePiece = {
  type: TetrominoType;
  rotation: number;
  x: number;
  y: number;
};

type GameState = {
  board: Board;
  piece: ActivePiece;
  queue: TetrominoType[];
  hold: TetrominoType | null;
  canHold: boolean;
  score: number;
  combo: number;
  toppedOut: boolean;
};

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<TetrominoType | null>(COLUMNS).fill(null));
}

// A shuffled set of all 7 tetromino types — the "bag" randomizer used by
// Tetris Guideline games. Drawing full bags instead of one independent random
// piece at a time guarantees every type shows up once before any type
// repeats, so you never get long droughts of one piece or clumps of another.
// avoidFirst swaps the bag's first slot if it would land right after the
// previous bag's last piece, so a type can never repeat back-to-back either.
function shuffledBag(avoidFirst?: TetrominoType): TetrominoType[] {
  const bag = [...TETROMINO_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  if (avoidFirst && bag[0] === avoidFirst) {
    const swapWith = 1 + Math.floor(Math.random() * (bag.length - 1));
    [bag[0], bag[swapWith]] = [bag[swapWith], bag[0]];
  }
  return bag;
}

// Tops the queue back up to NEXT_COUNT pieces so the Next panel always has a
// full lookahead to show, drawing whole bags at a time.
function fillQueue(queue: TetrominoType[]): TetrominoType[] {
  const filled = [...queue];
  while (filled.length < NEXT_COUNT) {
    filled.push(...shuffledBag(filled[filled.length - 1]));
  }
  return filled;
}

// Draws the next piece off the front of the queue, refilling it back up to
// NEXT_COUNT so the caller always gets a fresh, fully-stocked queue back.
function drawFromQueue(queue: TetrominoType[]): { piece: ActivePiece; queue: TetrominoType[] } {
  const [type, ...rest] = fillQueue(queue);
  return { piece: { type, rotation: 0, x: 3, y: 0 }, queue: fillQueue(rest) };
}

function initialState(): GameState {
  const { piece, queue } = drawFromQueue([]);
  return { board: emptyBoard(), piece, queue, hold: null, canHold: true, score: 0, combo: 0, toppedOut: false };
}

function cellsFor(piece: ActivePiece): [number, number][] {
  return ROTATIONS[piece.type][piece.rotation].map(([dx, dy]) => [piece.x + dx, piece.y + dy]);
}

// Where the active piece would land if hard-dropped right now, for the ghost
// preview. Doesn't touch score/combo — it's a pure look-ahead, not a drop.
function ghostCellsFor(board: Board, piece: ActivePiece): [number, number][] {
  let ghost = piece;
  while (!collides(board, { ...ghost, y: ghost.y + 1 })) {
    ghost = { ...ghost, y: ghost.y + 1 };
  }
  return cellsFor(ghost);
}

function collides(board: Board, piece: ActivePiece): boolean {
  return cellsFor(piece).some(([x, y]) => {
    if (x < 0 || x >= COLUMNS || y >= ROWS) return true;
    if (y < 0) return false;
    return board[y][x] !== null;
  });
}

// Merges a landed piece into the board, clears completed lines, scores the
// clear (with a combo bonus for back-to-back clears), and spawns the next
// piece — or flags a top-out if the next piece has nowhere to spawn. Pure:
// takes the previous state and returns a new one, no outside mutation.
function lockInto(state: GameState, pieceToLock: ActivePiece): GameState {
  const merged = state.board.map((row) => [...row]);
  cellsFor(pieceToLock).forEach(([x, y]) => {
    if (y >= 0 && y < ROWS && x >= 0 && x < COLUMNS) merged[y][x] = pieceToLock.type;
  });

  const remaining = merged.filter((row) => row.some((cell) => cell === null));
  const clearedCount = ROWS - remaining.length;
  while (remaining.length < ROWS) {
    remaining.unshift(Array<TetrominoType | null>(COLUMNS).fill(null));
  }

  const combo = clearedCount > 0 ? state.combo + 1 : 0;
  const gained = clearedCount > 0 ? (LINE_CLEAR_SCORES[clearedCount] ?? 0) + state.combo * 1000 : 0;
  const score = state.score + gained;

  const { piece: next, queue } = drawFromQueue(state.queue);
  if (collides(remaining, next)) {
    return { ...state, board: remaining, piece: pieceToLock, queue, score, combo, toppedOut: true };
  }
  return { ...state, board: remaining, piece: next, queue, score, combo, toppedOut: false, canHold: true };
}

function tick(state: GameState): GameState {
  const dropped = { ...state.piece, y: state.piece.y + 1 };
  if (collides(state.board, dropped)) return lockInto(state, state.piece);
  return { ...state, piece: dropped };
}

function moveState(state: GameState, dx: number, dy: number): GameState {
  const moved = { ...state.piece, x: state.piece.x + dx, y: state.piece.y + dy };
  if (collides(state.board, moved)) return state;
  return { ...state, piece: moved };
}

function softDropState(state: GameState): GameState {
  const moved = { ...state.piece, y: state.piece.y + 1 };
  if (collides(state.board, moved)) return state;
  return { ...state, piece: moved, score: state.score + 1 };
}

function rotateState(state: GameState): GameState {
  const rotated = { ...state.piece, rotation: (state.piece.rotation + 1) % 4 };
  if (collides(state.board, rotated)) return state;
  return { ...state, piece: rotated };
}

// Swaps the active piece into the hold slot, pulling the replacement either
// from an empty hold (draw the next queued piece) or from whatever was
// already held. Limited to once per piece in play via canHold, so a piece
// can't be bounced in and out of hold repeatedly before it locks.
function holdState(state: GameState): GameState {
  if (!state.canHold) return state;

  if (state.hold === null) {
    const { piece, queue } = drawFromQueue(state.queue);
    return { ...state, hold: state.piece.type, piece, queue, canHold: false };
  }

  const swapped: ActivePiece = { type: state.hold, rotation: 0, x: 3, y: 0 };
  if (collides(state.board, swapped)) return state;
  return { ...state, hold: state.piece.type, piece: swapped, canHold: false };
}

function hardDropState(state: GameState): GameState {
  let landed = state.piece;
  let distance = 0;
  while (!collides(state.board, { ...landed, y: landed.y + 1 })) {
    landed = { ...landed, y: landed.y + 1 };
    distance += 1;
  }
  return lockInto({ ...state, score: state.score + distance * 2 }, landed);
}

interface TetrisProps {
  running: boolean;
  onScoreChange: (score: number) => void;
  onTopOut: () => void;
}

// A falling-blocks board that runs its own gravity/input loop while `running`
// is true. Score changes are reported upward so the parent can judge a win
// against its own countdown instead of this component tracking time itself.
export default function Tetris({ running, onScoreChange, onTopOut }: TetrisProps) {
  const [state, setState] = useState<GameState>(initialState);
  const onScoreChangeRef = useRef(onScoreChange);
  const onTopOutRef = useRef(onTopOut);

  useEffect(() => {
    onScoreChangeRef.current = onScoreChange;
  }, [onScoreChange]);

  useEffect(() => {
    onTopOutRef.current = onTopOut;
  }, [onTopOut]);

  useEffect(() => {
    onScoreChangeRef.current(state.score);
  }, [state.score]);

  useEffect(() => {
    if (state.toppedOut) onTopOutRef.current();
  }, [state.toppedOut]);

  // Gravity loop — only active while the round is running, and stops nudging
  // the board once it's topped out (the parent reacts to that separately).
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setState((prev) => (prev.toppedOut ? prev : tick(prev)));
    }, DROP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [running]);

  // Keyboard controls — only listening while the round is running, so input
  // never leaks to the page once the game ends or is exited.
  useEffect(() => {
    if (!running) return;

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : moveState(prev, -1, 0)));
          break;
        case "ArrowRight":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : moveState(prev, 1, 0)));
          break;
        case "ArrowDown":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : softDropState(prev)));
          break;
        case "ArrowUp":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : rotateState(prev)));
          break;
        case " ":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : hardDropState(prev)));
          break;
        case "c":
        case "C":
          event.preventDefault();
          setState((prev) => (prev.toppedOut ? prev : holdState(prev)));
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [running]);

  const activeCells = new Set(cellsFor(state.piece).map(([x, y]) => `${x},${y}`));
  const ghostCells = new Set(
    ghostCellsFor(state.board, state.piece)
      .map(([x, y]) => `${x},${y}`)
      .filter((key) => !activeCells.has(key)),
  );

  return (
    <div className="flex items-start gap-3">
      <PiecePanel label="Hold">
        <PiecePreview type={state.hold} />
      </PiecePanel>

      <div
        className="border border-zinc-700 bg-black"
        style={{ width: COLUMNS * CELL_SIZE, height: ROWS * CELL_SIZE }}
      >
        {state.board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => {
              const key = `${x},${y}`;
              const type = activeCells.has(key) ? state.piece.type : cell;
              const isGhost = !type && ghostCells.has(key);
              return (
                <div
                  key={x}
                  className="relative border border-zinc-900/60"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {isGhost && (
                    <Image
                      src={TETROMINO_SPRITES[state.piece.type]}
                      alt=""
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      style={{ imageRendering: "pixelated", opacity: 0.25 }}
                    />
                  )}
                  {type && (
                    <Image
                      src={TETROMINO_SPRITES[type]}
                      alt=""
                      width={CELL_SIZE}
                      height={CELL_SIZE}
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <PiecePanel label="Next">
        {state.queue.slice(0, NEXT_COUNT).map((type, i) => (
          <PiecePreview key={i} type={type} />
        ))}
      </PiecePanel>
    </div>
  );
}

// Small bordered box used for both the Hold panel and the Next-pieces panel.
function PiecePanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 p-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</span>
      {children}
    </div>
  );
}

const PREVIEW_CELL_SIZE = 16;

// Renders a piece at its spawn rotation inside a fixed 4x4 box, for the Hold
// and Next panels. Renders an empty box of the same size when there's nothing
// to show, so panels don't jump around as pieces come and go.
function PiecePreview({ type }: { type: TetrominoType | null }) {
  const size = PREVIEW_CELL_SIZE;
  if (!type) {
    return <div style={{ width: size * 4, height: size * 4 }} />;
  }
  const cells = new Set(ROTATIONS[type][0].map(([x, y]) => `${x},${y}`));
  return (
    <div style={{ width: size * 4, height: size * 4 }}>
      {Array.from({ length: 4 }, (_, y) => (
        <div key={y} className="flex">
          {Array.from({ length: 4 }, (_, x) => (
            <div key={x} style={{ width: size, height: size }}>
              {cells.has(`${x},${y}`) && (
                <Image
                  src={TETROMINO_SPRITES[type]}
                  alt=""
                  width={size}
                  height={size}
                  style={{ imageRendering: "pixelated" }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
