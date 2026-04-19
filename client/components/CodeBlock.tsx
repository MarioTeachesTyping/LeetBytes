// =================== //
// Syntax Highlighting //
// =================== //

import { createHighlighter } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export default async function CodeBlock({
  code,
  lang = "python",
}: CodeBlockProps) {
  const highlighter = await createHighlighter({
    themes: ["vesper"],
    langs: ["python"],
  });

  const html = highlighter.codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div
      className="h-full overflow-auto rounded-md bg-black text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
