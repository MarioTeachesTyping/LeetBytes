import { createHighlighter } from "shiki";

let _highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighterOnce() {
  if (_highlighter) return _highlighter;

  _highlighter = await createHighlighter({
    themes: ["github-dark"],
    langs: ["python"],
  });

  return _highlighter;
}

export async function highlightPython(code: string) {
  const highlighter = await getHighlighterOnce();

  return highlighter.codeToHtml(code, {
    lang: "python",
    theme: "github-dark",
  });
}
