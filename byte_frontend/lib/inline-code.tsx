// Renders text with backtick-wrapped segments as inline code.
// Example: "use `nums[i]` here" → nums[i] is styled like code
export function renderInlineCode(text: string)
{
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") ? (
      <code
        key={i}
        className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-sm text-zinc-100"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
