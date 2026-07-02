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
  - `Question.tsx` — description, examples, constraints, topic/company tags, and the Spoiler toggle
  - `Solution.tsx` — the code editor, Run/Judge buttons, and the tabbed, resizable test panel
  - `Result.tsx` — the Test Cases editor, Test Results, and the Submissions verdict
  - `CodeEditor.tsx` — CodeMirror editor
  - `Spoiler.tsx` — titled solution approaches hidden behind a Balatro reveal overlay
  - `react-bits/` — animated visual effects
- `lib/problems/` — typed problem content (description, examples, starter code, spoiler solutions)
- `lib/highlight.ts` — Shiki syntax highlighting

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
