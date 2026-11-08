import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import python from "shiki/langs/python.mjs";
import vesper from "shiki/themes/vesper.mjs";

// Fine-grained imports so only Python and the one theme get bundled — the main
// "shiki" entry drags every language and theme into the build.
let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter()
{
  highlighterPromise ??= createHighlighterCore({
    themes: [vesper],
    langs: [python],
    engine: createOnigurumaEngine(import("shiki/wasm")),
  });

  return highlighterPromise;
}

export async function highlightPython(code: string)
{
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang: "python",
    theme: "vesper",
  });
}
