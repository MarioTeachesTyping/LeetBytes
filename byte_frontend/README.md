# Frontend

The LeetBytes frontend: a Next.js app for browsing problems, editing and running
solutions, and revealing spoilers.

## Getting started

```bash
pnpm install   # once, at the repo root (installs the whole workspace)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Running and judging code needs the server (see `../byte_backend`). The client calls it
through the Next.js `/api/*` rewrite (see `next.config.ts`), so no CORS or client
env is needed; set `SERVER_URL` if the API server is not on `localhost:4000`, or
`NEXT_PUBLIC_SERVER_URL` to bypass the proxy and hit it directly.

## Structure

- `app/` — Next.js routes.
  - `app/page.tsx` — the landing page.
  - `app/questions/page.tsx` — the solutions list, topic-filterable.
  - `app/questions/[slug]/page.tsx` — an individual problem page.
  - `app/progress/page.tsx` — practice history table, a solved/judged/difficulty summary panel,
    and the contribution calendar, all read from the local-storage submission log.
- `components/`
  - `Navbar.tsx` — prev/next problem navigation, Question/Spoiler toggle, Game button, Run/Judge
  - `WorkspaceContext.tsx` — shared toolbar state (Question/Spoiler view, Run/Judge status) plus
    hint-unlock progress, read by both the Navbar and the panels that own the actual handlers
  - `QuestionPanel.tsx` — description, examples, constraints, topic/company tags, and the Hints
    panel (each hint stays locked until its minigame round is won)
  - `CodePanel.tsx` — the code editor, Run/Judge buttons, and the tabbed, resizable test panel;
    swaps the editor out for the minigame overlay while it's open; records every judged
    submission via `lib/progress.ts` for the Progress page
  - `ResultPanel.tsx` — the Test Cases editor, Test Results, and the Submissions verdict
  - `CodeEditor.tsx` — the CodeMirror editor
  - `CodeBlock.tsx` — a small read-only, syntax-highlighted code block helper
  - `SolutionPanel.tsx` — titled solution approaches hidden behind a Balatro reveal overlay
  - `PlayModal.tsx` / `OptionsModal.tsx` — pixel-art modals off the landing page's Play/Options
    buttons, sharing a slide-up-from-off-screen open/close animation. Play offers Story (locked —
    dimmed with a pixel padlock stamped over it), Questions (`/questions`), and Progress
    (`/progress`) in a row; Options holds the Pixel Font toggle.
  - `FilterModal.tsx` — the questions list's Options button, on the wide `modal-long` frame: a
    search bar over four tag groups (level, status, topic, company) whose chips cycle
    off → "is" → "is not", LeetCode-style. Filtering is live, with a running match count.
  - `PixelHoverButton.tsx` — reusable hover-frame-cycling button (base/-2/-3 PNG frames), used
    for every pixel-art button across the landing page, modals, and Progress header
  - `ContributionCalendar.tsx` — the GitHub/LeetCode-style submission grid on the Progress page,
    grouped into month blocks with a hover readout for the day under the cursor
  - `LoadingBar.tsx` — a centered, segmented pixel loading bar shown between route changes.
    Detects navigation by intercepting internal `<a>` clicks (the App Router has no router
    events) and clears once `usePathname()` reflects the new route.
  - `games/` — the hint-unlocking minigames
    - `GameStage.tsx` — drives a round through intro → countdown → playing → result, judging the
      score reached against the target for the next hint; a pixel-hover Quit button in the corner
      exits back to the editor at any phase
    - `Tetris.tsx` — the current minigame: Hold slot, 6-piece Next queue, ghost piece, a 7-bag
      piece randomizer instead of independent per-piece randomness, and an on-screen Controls
      panel listing the keybinds
  - `react-bits/` — animated visual effects used across the landing page, the solutions list, and
    behind the minigame/spoiler overlays: `Particles`, `CircularText`, `Balatro`, `PillNav`,
    `Cubes`, `Iridescence`, `LetterGlitch`
- `lib/`
  - `problem-list.ts` — builds the solutions-list rows plus the `PROBLEM_TOPICS` /
    `PROBLEM_COMPANIES` tag lists from `@leetbytes/problems/public`; also exports
    `PROBLEMS_BY_SLUG` for looking up a problem's title/difficulty from a bare slug,
    and `companyTagsForSlug` which merges a problem's hand-authored `companies`
    with the generated, frequency-ranked data from `@leetbytes/problems/company-tags`
    (see `byte_problems/README.md`)
  - `problem-filters.ts` — the three-state token model behind `FilterModal` and the pure
    `filterProblems` function the questions page runs its rows through
  - `progress.ts` — the local-storage submission log (`leetbytes-progress`) that `CodePanel`
    appends to on every judged submission, plus the calendar/streak math the Progress page and
    `ContributionCalendar` read it through
  - `highlight.ts` — Shiki syntax highlighting
  - `utils.ts` — small shared helpers (e.g. the `cn` class-name utility)
- problem content (description, examples, starter code, spoiler solutions) comes from the
  `@leetbytes/problems` workspace package (`../byte_problems/<slug>/public.ts`)
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

## Hints and the Minigame

Each problem has a list of hints (`hints` in its `byte_problems/<slug>/public.ts` entry), unlocked one
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
