// =========== //
// Code Editor //
// =========== //

"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// CodeMirror 6 is DOM-based, so this lives in a client component and fills its
// parent. The parent must give it a bounded height (e.g. flex-1 + min-h-0).
export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={oneDark}
      extensions={[python()]}
      height="100%"
      className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        tabSize: 4,
      }}
    />
  );
}
