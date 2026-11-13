// ============= //
// Pong Minigame //
// ============= //

"use client";

import React, { useEffect, useRef, useState } from "react";

// Court size matches Snake's board (18 x 16 cells of 24px) so every game
// sits in GameStage at the same footprint.
const WIDTH = 432;
const HEIGHT = 384;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 64;
const PADDLE_MARGIN = 16;
const PLAYER_X = PADDLE_MARGIN;
const CPU_X = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH;

const BALL_SIZE = 10;

// All speeds are pixels per second.
const PLAYER_SPEED = 380;
// Slower than the ball gets at a steep angle, so hitting off the paddle's
// edge is how you score. A flat return is always saved.
const CPU_SPEED = 215;
const BALL_START_SPEED = 260;
const BALL_SPEEDUP = 1.06;
const BALL_MAX_SPEED = 640;
// Hitting the very edge of a paddle sends the ball off at this angle.
const MAX_BOUNCE_ANGLE = (55 * Math.PI) / 180;

// Pause after each point before the next serve.
const SERVE_DELAY_SECONDS = 0.8;
const STARTING_LIVES = 3;
// Physics advances in fixed steps of this size, however often frames arrive.
const PHYSICS_STEP_SECONDS = 1 / 120;
// The most real time one frame may simulate, so returning to a backgrounded
// tab doesn't fast-forward through a point.
const MAX_FRAME_SECONDS = 0.25;
// The trail drawn behind the ball, in frames.
const TRAIL_LENGTH = 6;

type Side = "player" | "cpu";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
};

type GameState = {
  playerY: number;
  cpuY: number;
  // Where the CPU aims on its paddle, re-rolled every time you return the
  // ball, so it doesn't always meet the ball dead center.
  cpuAimOffset: number;
  ball: Ball;
  trail: { x: number; y: number }[];
  // Counts down between points; the ball is frozen at center until it hits 0.
  serveTimer: number;
  points: number;
  lives: number;
  gameOver: boolean;
};

// A ball sitting at center court, headed toward `toward` once the serve
// delay runs out, at a small random angle so serves don't all look the same.
function servedBall(toward: Side): Ball
{
  const angle = (Math.random() - 0.5) * (Math.PI / 4);
  const direction = toward === "player" ? -1 : 1;
  return {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    vx: direction * BALL_START_SPEED * Math.cos(angle),
    vy: BALL_START_SPEED * Math.sin(angle),
    speed: BALL_START_SPEED,
  };
}

function initialState(): GameState
{
  const centerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
  return {
    playerY: centerY,
    cpuY: centerY,
    cpuAimOffset: 0,
    ball: servedBall("player"),
    trail: [],
    serveTimer: SERVE_DELAY_SECONDS,
    points: 0,
    lives: STARTING_LIVES,
    gameOver: false,
  };
}

function clamp(value: number, min: number, max: number): number
{
  return Math.min(max, Math.max(min, value));
}

// Bounces the ball off a paddle: the further from the paddle's center it
// hits, the steeper it leaves, and every hit speeds it up a little.
function bounceOffPaddle(ball: Ball, paddleY: number, direction: 1 | -1): Ball
{
  const paddleCenter = paddleY + PADDLE_HEIGHT / 2;
  const ballCenter = ball.y + BALL_SIZE / 2;
  const relative = clamp((ballCenter - paddleCenter) / (PADDLE_HEIGHT / 2), -1, 1);
  const angle = relative * MAX_BOUNCE_ANGLE;
  const speed = Math.min(ball.speed * BALL_SPEEDUP, BALL_MAX_SPEED);
  return {
    ...ball,
    vx: direction * speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
    speed,
  };
}

// Advances the game by `dt` seconds. Mutates `state` in place, since it lives
// in a ref and is redrawn every animation frame rather than rendered by React.
function step(state: GameState, dt: number, input: { up: boolean; down: boolean }): void
{
  // The player's paddle moves even during the serve pause, so you can get set.
  const playerMove = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  state.playerY = clamp(state.playerY + playerMove * PLAYER_SPEED * dt, 0, HEIGHT - PADDLE_HEIGHT);

  // The CPU follows the ball while it's coming toward it, and drifts back to
  // center while it's heading to you.
  const ballCenterY = state.ball.y + BALL_SIZE / 2;
  const cpuTarget = state.ball.vx > 0 ? ballCenterY + state.cpuAimOffset : HEIGHT / 2;
  const cpuCenter = state.cpuY + PADDLE_HEIGHT / 2;
  const cpuMove = clamp(cpuTarget - cpuCenter, -CPU_SPEED * dt, CPU_SPEED * dt);
  state.cpuY = clamp(state.cpuY + cpuMove, 0, HEIGHT - PADDLE_HEIGHT);

  if (state.serveTimer > 0)
  {
    state.serveTimer = Math.max(0, state.serveTimer - dt);
    return;
  }

  const ball = state.ball;
  const previousX = ball.x;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  // Top and bottom walls.
  if (ball.y <= 0)
  {
    ball.y = 0;
    ball.vy = Math.abs(ball.vy);
  }
  else if (ball.y + BALL_SIZE >= HEIGHT)
  {
    ball.y = HEIGHT - BALL_SIZE;
    ball.vy = -Math.abs(ball.vy);
  }

  const overlapsVertically = (paddleY: number) =>
    ball.y + BALL_SIZE >= paddleY && ball.y <= paddleY + PADDLE_HEIGHT;

  // Paddle hits check whether the ball crossed the paddle's face this frame,
  // not just whether it overlaps now, so a fast ball can't skip through.
  const playerFace = PLAYER_X + PADDLE_WIDTH;
  if (ball.vx < 0 && previousX >= playerFace && ball.x <= playerFace && overlapsVertically(state.playerY))
  {
    state.ball = bounceOffPaddle({ ...ball, x: playerFace }, state.playerY, 1);
    state.cpuAimOffset = (Math.random() - 0.5) * PADDLE_HEIGHT * 0.6;
  }

  const cpuFace = CPU_X;
  if (ball.vx > 0 && previousX + BALL_SIZE <= cpuFace && ball.x + BALL_SIZE >= cpuFace && overlapsVertically(state.cpuY))
  {
    state.ball = bounceOffPaddle({ ...ball, x: cpuFace - BALL_SIZE }, state.cpuY, -1);
  }

  // A ball past either edge is a point. The next serve goes toward whoever
  // just gave up the point.
  if (state.ball.x + BALL_SIZE < 0)
  {
    state.lives -= 1;
    if (state.lives <= 0)
    {
      state.gameOver = true;
      return;
    }
    state.ball = servedBall("player");
    state.trail = [];
    state.serveTimer = SERVE_DELAY_SECONDS;
  }
  else if (state.ball.x > WIDTH)
  {
    state.points += 1;
    state.ball = servedBall("cpu");
    state.trail = [];
    state.serveTimer = SERVE_DELAY_SECONDS;
  }

  state.trail.push({ x: state.ball.x, y: state.ball.y });
  if (state.trail.length > TRAIL_LENGTH) state.trail.shift();
}

// Draws one frame of the court, paddles, and ball onto the canvas.
function draw(context: CanvasRenderingContext2D, state: GameState): void
{
  context.fillStyle = "#000";
  context.fillRect(0, 0, WIDTH, HEIGHT);

  // Faint 24px grid, the same cell size as Snake's board.
  context.fillStyle = "rgba(24, 24, 27, 0.9)";
  for (let x = 24; x < WIDTH; x += 24) context.fillRect(x, 0, 1, HEIGHT);
  for (let y = 24; y < HEIGHT; y += 24) context.fillRect(0, y, WIDTH, 1);

  // Center divider, drawn as stacked pixel blocks.
  context.fillStyle = "rgba(255, 255, 255, 0.15)";
  for (let y = 4; y < HEIGHT; y += 16) context.fillRect(WIDTH / 2 - 2, y, 4, 8);

  context.fillStyle = "#34d399";
  context.fillRect(PLAYER_X, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  context.fillStyle = "#fb7185";
  context.fillRect(CPU_X, state.cpuY, PADDLE_WIDTH, PADDLE_HEIGHT);

  state.trail.forEach((point, index) =>
  {
    const alpha = ((index + 1) / (state.trail.length + 1)) * 0.35;
    context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    context.fillRect(point.x + 2, point.y + 2, BALL_SIZE - 4, BALL_SIZE - 4);
  });

  // The ball blinks at center during the serve pause.
  const blinkingOff = state.serveTimer > 0 && Math.floor(state.serveTimer * 6) % 2 === 1;
  if (!blinkingOff)
  {
    context.fillStyle = "#fff";
    context.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE);
  }
}

const UP_KEYS = new Set(["ArrowUp", "w", "W"]);
const DOWN_KEYS = new Set(["ArrowDown", "s", "S"]);

interface PaddleDuelProps
{
  running: boolean;
  secondsLeft: number;
  // Named for the shared MinigameProps contract. For Pong this is a
  // target number of points scored against the CPU.
  targetScore: number;
  onScoreChange: (points: number) => void;
  onGameOver: () => void;
}

// A one-player paddle game against a CPU paddle. Scoring past the CPU earns a
// point, and letting the ball past you costs one of three lives. Reaching the
// target score (a win) or running out of lives (a loss) ends the round early. Physics runs in a requestAnimationFrame loop
// on a ref'd state object, and only points and lives go through React state
// for the side panels.
export default function PaddleDuel({ running, secondsLeft, targetScore: targetPoints, onScoreChange, onGameOver }: PaddleDuelProps)
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState());
  const inputRef = useRef({ up: false, down: false });
  const [points, setPoints] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const onScoreChangeRef = useRef(onScoreChange);
  const onGameOverRef = useRef(onGameOver);
  const targetPointsRef = useRef(targetPoints);

  useEffect(() =>
  {
    onScoreChangeRef.current = onScoreChange;
  }, [onScoreChange]);

  useEffect(() =>
  {
    targetPointsRef.current = targetPoints;
  }, [targetPoints]);

  useEffect(() =>
  {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() =>
  {
    onScoreChangeRef.current(points);
  }, [points]);

  // Game loop: steps the physics by real elapsed time each frame and redraws.
  // Only runs while the round is running, and freezes on the last frame after.
  useEffect(() =>
  {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    draw(context, stateRef.current);
    if (!running) return;

    let frame = 0;
    let lastTime: number | null = null;
    // Real time not yet simulated, carried between frames.
    let unsimulated = 0;

    function loop(time: number)
    {
      const state = stateRef.current;
      // Capped so a backgrounded tab doesn't fast-forward the game on return.
      unsimulated += lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_FRAME_SECONDS);
      lastTime = time;

      // Physics runs in small fixed steps, so the game plays at the same speed
      // on a slow or stuttering frame rate instead of going slow motion.
      while (!state.gameOver && unsimulated >= PHYSICS_STEP_SECONDS)
      {
        step(state, PHYSICS_STEP_SECONDS, inputRef.current);
        unsimulated -= PHYSICS_STEP_SECONDS;
        // Reaching the target wins the round right away instead of playing
        // out the clock.
        if (state.points >= targetPointsRef.current) state.gameOver = true;
      }

      setPoints(state.points);
      setLives(state.lives);

      draw(context!, state);
      // The loop stops scheduling itself on game over, so this fires once.
      if (state.gameOver)
      {
        // Report the final score first. The points effect above only runs
        // after the next render, which is too late for GameStage's win check.
        onScoreChangeRef.current(state.points);
        onGameOverRef.current();
        return;
      }
      frame = requestAnimationFrame(loop);
    }

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  // Keyboard controls: held keys move the paddle, so this tracks both press
  // and release. Only listening while the round is running.
  useEffect(() =>
  {
    if (!running) return;
    const input = inputRef.current;

    function handleKey(event: KeyboardEvent, pressed: boolean)
    {
      if (UP_KEYS.has(event.key)) input.up = pressed;
      else if (DOWN_KEYS.has(event.key)) input.down = pressed;
      else return;
      event.preventDefault();
    }

    const onKeyDown = (event: KeyboardEvent) => handleKey(event, true);
    const onKeyUp = (event: KeyboardEvent) => handleKey(event, false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () =>
    {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      input.up = false;
      input.down = false;
    };
  }, [running]);

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-3">
        <PanelBox label="Time">
          <span className="text-lg font-bold text-white">{secondsLeft}s</span>
        </PanelBox>
        <PanelBox label="Points">
          <span className="text-sm font-semibold text-white">{points}</span>
          <span className="text-[10px] text-white/50">/ {targetPoints}</span>
        </PanelBox>
        <PanelBox label="Lives">
          <div className="flex gap-1.5">
            {Array.from({ length: STARTING_LIVES }, (_, i) => (
              <div key={i} className={`h-3 w-3 ${i < lives ? "bg-emerald-400" : "bg-zinc-700"}`} />
            ))}
          </div>
        </PanelBox>
        <PanelBox label="Controls">
          <ControlsList />
        </PanelBox>
      </div>

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="border border-zinc-700 bg-black"
        style={{ width: WIDTH, height: HEIGHT, imageRendering: "pixelated" }}
      />
    </div>
  );
}

// Small bordered box used for the side panels. Matches Snake's and Tetris's
// so every game sits consistently inside GameStage.
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
const CONTROLS: [string, string][] = [
  ["↑ / W", "Up"],
  ["↓ / S", "Down"],
];

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
