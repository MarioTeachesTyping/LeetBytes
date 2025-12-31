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
    themes: ["github-dark"],
    langs: ["python"],
  });

  const html = highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return (
    <div
      className="h-full overflow-auto rounded-md bg-[#0d1117] text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
