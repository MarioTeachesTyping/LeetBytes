# Client

The LeetBytes frontend: a Next.js app for browsing problems, editing and running
solutions, and revealing spoilers.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Running and judging code needs the server (see `../server`). Point the client at
it with `NEXT_PUBLIC_SERVER_URL` (defaults to `http://localhost:4000`).

## Structure

- `app/` — Next.js routes. `app/solutions/[slug]` renders an individual problem page.
- `components/`
  - `Navbar.tsx` — prev/next problem navigation, Question/Spoiler toggle, Game button, Run/Judge
  - `WorkspaceContext.tsx` — shared toolbar state (Question/Spoiler view, Run/Judge status) plus
    hint-unlock progress, read by both the Navbar and the panels that own the actual handlers
  - `Question.tsx` — description, examples, constraints, topic/company tags, and the Hints panel
    (each hint stays locked until its minigame round is won)
  - `Solution.tsx` — the code editor, Run/Judge buttons, and the tabbed, resizable test panel;
    swaps the editor out for the minigame overlay while it's open
  - `Result.tsx` — the Test Cases editor, Test Results, and the Submissions verdict
  - `CodeEditor.tsx` — CodeMirror editor
  - `Spoiler.tsx` — titled solution approaches hidden behind a Balatro reveal overlay
  - `games/` — the hint-unlocking minigames
    - `GameStage.tsx` — drives a round through intro → countdown → playing → result, judging the
      score reached against the target for the next hint
    - `Tetris.tsx` — the current minigame: Hold slot, 6-piece Next queue, ghost piece, and a
      7-bag piece randomizer instead of independent per-piece randomness
  - `react-bits/` — animated visual effects (backgrounds, glitch text, etc.), used both on the
    landing page and behind the minigame
- `lib/problems/` — typed problem content (description, examples, starter code, spoiler solutions)
- `lib/highlight.ts` — Shiki syntax highlighting
- `public/videos/`, `public/game-images/` — minigame background footage and tetromino sprites

## Test panel

The panel under the editor has three tabs:

- **Test Cases** — the example inputs, split per parameter and editable as raw JSON.
  Edited inputs are sent to the server on the next Run.
- **Test Results** — per-case output from Run: your output, plus the expected value
  for cases you haven't edited (a custom input has no known answer).
- **Submissions** — the Judge verdict (**Accepted** / **Almost** / **Failed**) with
  runtime and memory.

Drag the thin handle between the editor and the panel to resize the split; the
chevron collapses the panel.

## Hints and the minigame

Each problem has a list of hints (`hints` in its `lib/problems` entry), unlocked one
at a time. `WorkspaceContext` tracks how many are unlocked and the score target for
the next one (`HINT_SCORE_TARGETS`); hints past that count stay hidden in the Hints
panel until earned.

Clicking the Navbar's Game button swaps the code editor for `GameStage`, which walks
a round through four phases:

1. **Intro** — shows the target score for the next hint over a blurred, sped-up
   background video.
2. **Countdown** — 3-2-1 before the clock starts.
3. **Playing** — a 60-second round of the current minigame (Tetris) over an animated
   glitch-text background.
4. **Result** — win by reaching the target score before time (or the board topping
   out) to unlock the next hint; otherwise try again.

`GameStage` freezes the hint number/target/all-unlocked flags at the moment a round
starts, so a win unlocking hint *N* always reports hint *N* — even though the
underlying `hintsUnlocked` count (and the props derived from it) can advance out from
under the component the instant `onWin()` fires.
