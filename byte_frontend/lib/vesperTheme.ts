// ============= //
// Vesper Theme  //
// ============= //

import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

// Vesper by Rauno Freiberg (https://github.com/raunofreiberg/vesper), ported
// from its VS Code token colors to a CodeMirror 6 highlight style.
const VESPER_COLORS = {
  background: "#101010",
  foreground: "#FFFFFF",
  comment: "#8b8b8b94",
  accent: "#FFC799",
  mint: "#99FFE4",
  grey: "#A0A0A0",
  red: "#FF8080",
  gutter: "#505050",
  activeLine: "#161616",
  selection: "rgba(255, 255, 255, 0.15)",
};

export const vesperTheme = createTheme({
  theme: "dark",
  settings: {
    background: VESPER_COLORS.background,
    foreground: VESPER_COLORS.foreground,
    caret: VESPER_COLORS.accent,
    selection: VESPER_COLORS.selection,
    selectionMatch: VESPER_COLORS.selection,
    lineHighlight: VESPER_COLORS.activeLine,
    gutterBackground: VESPER_COLORS.background,
    gutterForeground: VESPER_COLORS.gutter,
    gutterActiveForeground: VESPER_COLORS.accent,
  },
  styles: [
    { tag: [t.comment, t.lineComment, t.blockComment], color: VESPER_COLORS.comment },
    { tag: [t.string, t.special(t.string)], color: VESPER_COLORS.mint },
    { tag: [t.number, t.bool, t.null, t.atom], color: VESPER_COLORS.accent },
    { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword, t.operatorKeyword], color: VESPER_COLORS.grey },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: VESPER_COLORS.accent },
    { tag: [t.className, t.definition(t.className), t.typeName], color: VESPER_COLORS.accent },
    { tag: [t.propertyName, t.variableName, t.definition(t.variableName)], color: VESPER_COLORS.foreground },
    { tag: [t.operator, t.punctuation, t.derefOperator], color: VESPER_COLORS.grey },
    { tag: [t.meta, t.annotation], color: VESPER_COLORS.foreground },
    { tag: t.invalid, color: VESPER_COLORS.red },
  ],
});
