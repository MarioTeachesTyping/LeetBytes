# Client

The LeetBytes frontend: a Next.js app for browsing problems, editing and running
solutions, and revealing spoilers.

## Getting started

```bash
pnpm install   # once, at the repo root (installs the whole workspace)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Running and judging code needs the server (see `../server`). The client calls it
through the Next.js `/api/*` rewrite (see `next.config.ts`), so no CORS or client
env is needed; set `SERVER_URL` if the API server is not on `localhost:4000`, or
`NEXT_PUBLIC_SERVER_URL` to bypass the proxy and hit it directly.

## Structure

- `app/` — Next.js routes.
  - `app/page.tsx` — the landing page.
  - `app/questions/page.tsx` — the solutions list, topic-filterable.
  - `app/questions/[slug]/page.tsx` — an individual problem page.
- `components/`
  - `Navbar.tsx` — prev/next problem navigation, Question/Spoiler toggle, Game button, Run/Judge
  - `WorkspaceContext.tsx` — shared toolbar state (Question/Spoiler view, Run/Judge status) plus
    hint-unlock progress, read by both the Navbar and the panels that own the actual handlers
  - `QuestionPanel.tsx` — description, examples, constraints, topic/company tags, and the Hints
    panel (each hint stays locked until its minigame round is won)
  - `CodePanel.tsx` — the code editor, Run/Judge buttons, and the tabbed, resizable test panel;
    swaps the editor out for the minigame overlay while it's open
  - `ResultPanel.tsx` — the Test Cases editor, Test Results, and the Submissions verdict
  - `CodeEditor.tsx` — the CodeMirror editor
  - `CodeBlock.tsx` — a small read-only, syntax-highlighted code block helper
  - `SolutionPanel.tsx` — titled solution approaches hidden behind a Balatro reveal overlay
  - `games/` — the hint-unlocking minigames
    - `GameStage.tsx` — drives a round through intro → countdown → playing → result, judging the
      score reached against the target for the next hint
    - `Tetris.tsx` — the current minigame: Hold slot, 6-piece Next queue, ghost piece, and a
      7-bag piece randomizer instead of independent per-piece randomness
  - `react-bits/` — animated visual effects used across the landing page, the solutions list, and
    behind the minigame/spoiler overlays: `Particles`, `CircularText`, `Balatro`, `PillNav`,
    `Cubes`, `Iridescence`, `LetterGlitch`
- `lib/`
  - `problem-list.ts` — builds the solutions-list rows/topics from `@leetbytes/problems/public`
  - `highlight.ts` — Shiki syntax highlighting
  - `utils.ts` — small shared helpers (e.g. the `cn` class-name utility)
- problem content (description, examples, starter code, spoiler solutions) comes from the
  `@leetbytes/problems` workspace package (`../problems/<slug>/public.ts`)
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

Each problem has a list of hints (`hints` in its `problems/<slug>/public.ts` entry), unlocked one
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
