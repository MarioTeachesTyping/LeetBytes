<h1 align="center">LeetBytes</h1>

<p align="center">Lil website to shove my LeetCode solutions. Also testing frontend libs for fun.</p>

<p align="center">The long-term idea is to turn this into a frontend-heavy coding playground where solutions are not just listed, but explored through visuals, notes, code running, and small games that unlock hints.</p>

---

## Features

### Current

- Landing page with animated visual effects
- Solutions list with topic filtering
- 35 problems added, 34 of them with a judged hidden test suite
- Individual problem pages with:
  - Question details, examples, and constraints
  - Topics and company tags
  - In-browser Python code editor (CodeMirror)
  - **Run** against editable example cases, and **Judge** against a hidden test suite
  - Tabbed test panel (Test Cases / Test Results / Submissions), resizable by dragging the divider
  - Editable per-parameter inputs, so you can try your own cases
  - Runtime and memory reported on judged runs
  - Spoiler view with one or more titled solution approaches behind a reveal overlay
  - Hints panel, gated behind a score threshold per hint
  - **Tetris** minigame that unlocks the next hint when you hit that round's target score
    - Hold and 6-piece Next queue, ghost piece landing preview, 7-bag piece randomizer
    - Blurred, sped-up gameplay-footage backdrop on the intro screen; animated glitch-text backdrop during play

### Planned

- More LeetCode solutions added to the problem database
- Additional minigames behind a roulette that picks one at random per hint
- Optional AI-generated contextual hints using a local model
- Monthly company-question metadata updates from public sources

## Goals

- [x] Make landing page
- [x] Make solutions list page
- [x] Make the solutions page with question and answer
- [x] Add an in-browser code editor
- [x] Add a server-backed code runner / judge
- [x] Add hint unlocks
- [x] Add first minigame
- [x] Add my solutions
- [ ] Add more minigames + a roulette to pick one at random
- [ ] Add company question tracking

## Architecture

```txt
leetbytes/          pnpm workspace (install once at the root: pnpm install)
    client/         Next.js frontend: problem pages, editor, results panel, effects, minigames
    server/         Node HTTP API: runs/judges code, serves public test cases
    shared/         @leetbytes/shared — request/response types + Zod schemas used by both sides
    problems/       @leetbytes/problems — one folder per problem, the single source of truth
```

The client is a Next.js app. Each problem lives in `problems/<slug>/` split into
two files: `public.ts` (description, examples, starter code, hints — everything
the browser may see, imported by the client) and `hidden.ts` (the judged test
suite and answer key, imported only by the server). A `ProblemSlug` union in
`problems/types.ts` keys both registries, so the two sides can't drift apart. A
`public.ts` file must never import from a `hidden.ts` file.

Running and judging code is delegated to the server, which wraps submissions in
a Python harness and executes them through a pluggable runner (Piston or a local
Python install). The browser reaches the server through the Next.js `/api/*`
rewrite, so everything stays on one origin during development.

To run both apps at once from the repo root:

```bash
pnpm install
pnpm dev
```

Hints and the minigame that unlocks them are currently client-only state (see
`client/components/WorkspaceContext.tsx` and `client/components/games/`) — nothing
about hint progress or minigame results is persisted or sent to the server yet.

### Planned

The server will grow to own more of the risky or stateful parts of the app:

- Creating hint sessions
- Checking whether a minigame challenge was completed
- Generating or caching AI hints
- Updating company/problem metadata on a schedule

## Tech Stack

### Current

```txt
Frontend
--------
Next.js
React
TypeScript
Tailwind CSS
React Icons
shadcn
Shiki
CodeMirror
React Bits
- GSAP
- three
- motion
- ogl

Backend
-------
Node.js (built-in http)
TypeScript (tsx)
Zod
Piston or local Python for code execution
```

### Planned / Possible

```txt
Persistence
-----------
Prisma
SQLite for local development
Postgres for deployment

AI Hints
--------
Ollama
Local LLM

Jobs / Data Updates
-------------------
GitHub Actions or cron
Public GitHub repos / public datasets for company question metadata
```

---

Please don't hurt me LeetCode.
