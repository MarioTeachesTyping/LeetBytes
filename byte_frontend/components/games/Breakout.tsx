// ================= //
// Breakout Minigame //
// ================= //

"use client";

import React, { useEffect, useRef, useState } from "react";

// Board size matches Snake's and Pong's (18 x 16 cells of 24px) so every game
// sits in GameStage at the same footprint.
const WIDTH = 432;
const HEIGHT = 384;

const PADDLE_WIDTH = 72;
const PADDLE_HEIGHT = 10;
const PADDLE_Y = HEIGHT - 28;

const BALL_SIZE = 8;

// The wall: 8 columns x 5 rows of 46 x 14 bricks, 4px apart, which fills the
// board's width exactly with an 18px margin on each side.
const BRICK_COLUMNS = 8;
const BRICK_ROWS = 5;
const BRICK_WIDTH = 46;
const BRICK_HEIGHT = 14;
const BRICK_GAP = 4;
const BRICK_SIDE_MARGIN = 18;
const BRICK_TOP = 40;
// One color per row, top to bottom.
const ROW_COLORS = ["#fb7185", "#fb923c", "#fbbf24", "#34d399", "#38bdf8"];

// All speeds are pixels per second.
const PADDLE_SPEED = 420;
const BALL_START_SPEED = 280;
const BALL_SPEEDUP = 1.02;
const BALL_MAX_SPEED = 520;
// Hitting the very edge of the paddle sends the ball off at this angle from
// straight up. Capped below 90° so the ball can never go flat sideways.
const MAX_BOUNCE_ANGLE = (60 * Math.PI) / 180;

// How long the ball rides on the paddle before launching, after a lost ball
// or a cleared wall.
const SERVE_DELAY_SECONDS = 1;
const STARTING_LIVES = 3;
// Physics advances in fixed steps of this size, however often frames arrive.
const PHYSICS_STEP_SECONDS = 1 / 120;
// The most real time one frame may simulate, so returning to a backgrounded
// tab doesn't fast-forward through a lost ball.
const MAX_FRAME_SECONDS = 0.25;
// The trail drawn behind the ball, in physics steps.
const TRAIL_LENGTH = 6;

type Brick = {
  x: number;
  y: number;
  color: string;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
};

type GameState = {
  paddleX: number;
  ball: Ball;
  bricks: Brick[];
  trail: { x: number; y: number }[];
  // Counts down while the ball rides on the paddle, then it launches.
  serveTimer: number;
  bricksBroken: number;
  lives: number;
  gameOver: boolean;
};

// A full wall of bricks, used at the start and every time the wall is cleared.
function buildWall(): Brick[]
{
  const bricks: Brick[] = [];
  for (let row = 0; row < BRICK_ROWS; row++)
  {
    for (let column = 0; column < BRICK_COLUMNS; column++)
    {
      bricks.push({
        x: BRICK_SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_GAP),
        color: ROW_COLORS[row],
      });
    }
  }
  return bricks;
}

// A ball resting on top of the paddle, aimed upward at a small random angle
// so launches don't all look the same.
function ballOnPaddle(paddleX: number): Ball
{
  const angle = (Math.random() - 0.5) * (Math.PI / 3);
  return {
    x: paddleX + PADDLE_WIDTH / 2 - BALL_SIZE / 2,
    y: PADDLE_Y - BALL_SIZE,
    vx: BALL_START_SPEED * Math.sin(angle),
    vy: -BALL_START_SPEED * Math.cos(angle),
    speed: BALL_START_SPEED,
  };
}

function initialState(): GameState
{
  const paddleX = WIDTH / 2 - PADDLE_WIDTH / 2;
  return {
    paddleX,
    ball: ballOnPaddle(paddleX),
    bricks: buildWall(),
    trail: [],
    serveTimer: SERVE_DELAY_SECONDS,
    bricksBroken: 0,
    lives: STARTING_LIVES,
    gameOver: false,
  };
}

function clamp(value: number, min: number, max: number): number
{
  return Math.min(max, Math.max(min, value));
}

function overlapsBrick(ball: Ball, brick: Brick): boolean
{
  return (
    ball.x < brick.x + BRICK_WIDTH &&
    ball.x + BALL_SIZE > brick.x &&
    ball.y < brick.y + BRICK_HEIGHT &&
    ball.y + BALL_SIZE > brick.y
  );
}

// Removes the first brick the ball overlaps and returns true, or returns
// false if it isn't touching one.
function breakOverlappingBrick(state: GameState): boolean
{
  const index = state.bricks.findIndex((brick) => overlapsBrick(state.ball, brick));
  if (index === -1) return false;
  state.bricks.splice(index, 1);
  state.bricksBroken += 1;
  return true;
}

// Puts the ball back on the paddle and starts the serve pause.
function resetServe(state: GameState): void
{
  state.ball = ballOnPaddle(state.paddleX);
  state.trail = [];
  state.serveTimer = SERVE_DELAY_SECONDS;
}

// Advances the game by `dt` seconds. Mutates `state` in place, since it lives
// in a ref and is redrawn every animation frame rather than rendered by React.
function step(state: GameState, dt: number, input: { left: boolean; right: boolean }): void
{
  const paddleMove = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  state.paddleX = clamp(state.paddleX + paddleMove * PADDLE_SPEED * dt, 0, WIDTH - PADDLE_WIDTH);

  // During the serve pause the ball rides along on the paddle, so you can
  // line up the launch.
  if (state.serveTimer > 0)
  {
    state.serveTimer = Math.max(0, state.serveTimer - dt);
    state.ball.x = state.paddleX + PADDLE_WIDTH / 2 - BALL_SIZE / 2;
    return;
  }

  const ball = state.ball;

  // Moving one axis at a time tells us which side of a brick the ball hit:
  // a hit while moving sideways flips vx, and one while moving vertically
  // flips vy. Steps are small enough (under 5px) that the ball can't skip
  // past a brick.
  ball.x += ball.vx * dt;
  if (ball.x <= 0)
  {
    ball.x = 0;
    ball.vx = Math.abs(ball.vx);
  }
  else if (ball.x + BALL_SIZE >= WIDTH)
  {
    ball.x = WIDTH - BALL_SIZE;
    ball.vx = -Math.abs(ball.vx);
  }
  else if (breakOverlappingBrick(state))
  {
    ball.x -= ball.vx * dt;
    ball.vx = -ball.vx;
  }

  const previousBottom = ball.y + BALL_SIZE;
  ball.y += ball.vy * dt;
  if (ball.y <= 0)
  {
    ball.y = 0;
    ball.vy = Math.abs(ball.vy);
  }
  else if (breakOverlappingBrick(state))
  {
    ball.y -= ball.vy * dt;
    ball.vy = -ball.vy;
  }

  // Paddle hits check whether the ball crossed the paddle's top this step,
  // and the further from the paddle's center it lands, the steeper it leaves.
  const ballBottom = ball.y + BALL_SIZE;
  const overPaddle = ball.x + BALL_SIZE >= state.paddleX && ball.x <= state.paddleX + PADDLE_WIDTH;
  if (ball.vy > 0 && previousBottom <= PADDLE_Y && ballBottom >= PADDLE_Y && overPaddle)
  {
    const paddleCenter = state.paddleX + PADDLE_WIDTH / 2;
    const ballCenter = ball.x + BALL_SIZE / 2;
    const relative = clamp((ballCenter - paddleCenter) / (PADDLE_WIDTH / 2), -1, 1);
    const angle = relative * MAX_BOUNCE_ANGLE;
    ball.speed = Math.min(ball.speed * BALL_SPEEDUP, BALL_MAX_SPEED);
    ball.vx = ball.speed * Math.sin(angle);
    ball.vy = -ball.speed * Math.cos(angle);
    ball.y = PADDLE_Y - BALL_SIZE;
  }

  // A ball past the bottom costs a life.
  if (ball.y > HEIGHT)
  {
    state.lives -= 1;
    if (state.lives <= 0)
    {
      state.gameOver = true;
      return;
    }
    resetServe(state);
    return;
  }

  // Clearing the wall builds a fresh one and re-serves from the paddle, so
  // the round can keep going past 40 bricks.
  if (state.bricks.length === 0)
  {
    state.bricks = buildWall();
    resetServe(state);
    return;
  }

  state.trail.push({ x: ball.x, y: ball.y });
  if (state.trail.length > TRAIL_LENGTH) state.trail.shift();
}

// Draws one frame of the board, bricks, paddle, and ball onto the canvas.
function draw(context: CanvasRenderingContext2D, state: GameState): void
{
  context.fillStyle = "#000";
  context.fillRect(0, 0, WIDTH, HEIGHT);

  // Faint 24px grid, the same cell size as Snake's board.
  context.fillStyle = "rgba(24, 24, 27, 0.9)";
  for (let x = 24; x < WIDTH; x += 24) context.fillRect(x, 0, 1, HEIGHT);
  for (let y = 24; y < HEIGHT; y += 24) context.fillRect(0, y, WIDTH, 1);

  // Each brick gets a lighter top edge and a darker bottom edge for a
  // simple pixel bevel.
  for (const brick of state.bricks)
  {
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    context.fillStyle = "rgba(255, 255, 255, 0.35)";
    context.fillRect(brick.x, brick.y, BRICK_WIDTH, 2);
    context.fillStyle = "rgba(0, 0, 0, 0.3)";
    context.fillRect(brick.x, brick.y + BRICK_HEIGHT - 2, BRICK_WIDTH, 2);
  }

  context.fillStyle = "#e4e4e7";
  context.fillRect(state.paddleX, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
  context.fillStyle = "#34d399";
  context.fillRect(state.paddleX, PADDLE_Y, PADDLE_WIDTH, 2);

  state.trail.forEach((point, index) =>
  {
    const alpha = ((index + 1) / (state.trail.length + 1)) * 0.35;
    context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    context.fillRect(point.x + 2, point.y + 2, BALL_SIZE - 4, BALL_SIZE - 4);
  });

  // The ball blinks on the paddle during the serve pause.
  const blinkingOff = state.serveTimer > 0 && Math.floor(state.serveTimer * 6) % 2 === 1;
  if (!blinkingOff)
  {
    context.fillStyle = "#fff";
    context.fillRect(state.ball.x, state.ball.y, BALL_SIZE, BALL_SIZE);
  }
}

const LEFT_KEYS = new Set(["ArrowLeft", "a", "A"]);
const RIGHT_KEYS = new Set(["ArrowRight", "d", "D"]);

interface BrickBreakerProps
{
  running: boolean;
  secondsLeft: number;
  // Named for the shared MinigameProps contract. For Breakout this is a
  // target number of bricks broken.
  targetScore: number;
  onScoreChange: (bricksBroken: number) => void;
  onGameOver: () => void;
}

// A paddle-and-ball Breakout. Every brick broken counts toward the
// target, and the ball falling past the paddle costs one of three lives.
// Reaching the target (a win) or running out of lives (a loss) ends the
// round early. Physics runs in a requestAnimationFrame loop on a ref'd state
// object, and only the brick count and lives go through React state for the
// side panels.
export default function BrickBreaker({ running, secondsLeft, targetScore: targetBricks, onScoreChange, onGameOver }: BrickBreakerProps)
{
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initialState());
  const inputRef = useRef({ left: false, right: false });
  const [bricksBroken, setBricksBroken] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const onScoreChangeRef = useRef(onScoreChange);
  const onGameOverRef = useRef(onGameOver);
  const targetBricksRef = useRef(targetBricks);

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
    targetBricksRef.current = targetBricks;
  }, [targetBricks]);

  useEffect(() =>
  {
    onScoreChangeRef.current(bricksBroken);
  }, [bricksBroken]);

  // Game loop: steps the physics in fixed steps by real elapsed time each
  // frame and redraws. Only runs while the round is running, and freezes on
  // the last frame after.
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
        if (state.bricksBroken >= targetBricksRef.current) state.gameOver = true;
      }

      setBricksBroken(state.bricksBroken);
      setLives(state.lives);

      draw(context!, state);
      // The loop stops scheduling itself on game over, so this fires once.
      if (state.gameOver)
      {
        // Report the final score first. The bricksBroken effect above only
        // runs after the next render, which is too late for GameStage's win
        // check.
        onScoreChangeRef.current(state.bricksBroken);
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
      if (LEFT_KEYS.has(event.key)) input.left = pressed;
      else if (RIGHT_KEYS.has(event.key)) input.right = pressed;
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
      input.left = false;
      input.right = false;
    };
  }, [running]);

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-3">
        <PanelBox label="Time">
          <span className="text-lg font-bold text-white">{secondsLeft}s</span>
        </PanelBox>
        <PanelBox label="Bricks">
          <span className="text-sm font-semibold text-white">{bricksBroken}</span>
          <span className="text-[10px] text-white/50">/ {targetBricks}</span>
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

// Small bordered box used for the side panels. Matches the other games'
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
  ["← / A", "Left"],
  ["→ / D", "Right"],
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
