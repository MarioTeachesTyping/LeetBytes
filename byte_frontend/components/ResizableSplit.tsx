// =============== //
// Resizable Split //
// =============== //

"use client";

import React, { useRef, useState } from "react";

// The question panel's share of the width, in percent. Clamped so neither
// side can be dragged closed — this is a resize, not a collapse.
const DEFAULT_LEFT_PERCENT = 50;
const MIN_LEFT_PERCENT = 25;
const MAX_LEFT_PERCENT = 70;

interface ResizableSplitProps
{
  left: React.ReactNode;
  right: React.ReactNode;
}

// Side-by-side panels with a draggable divider between them (md and up).
// Below md the panels stack, same as the old grid, and the handle is hidden.
export default function ResizableSplit({ left, right }: ResizableSplitProps)
{
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPercent, setLeftPercent] = useState(DEFAULT_LEFT_PERCENT);
  const [dragging, setDragging] = useState(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>)
  {
    // Pointer capture keeps the drag alive even when the cursor passes over
    // the editor or leaves the handle's 8px strip.
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>)
  {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPercent(Math.min(MAX_LEFT_PERCENT, Math.max(MIN_LEFT_PERCENT, percent)));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>)
  {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-1 min-h-0 flex-col gap-2 px-1 py-1 md:flex-row md:gap-0 ${dragging ? "cursor-col-resize select-none" : ""}`}
      style={{ "--split-left": `${leftPercent}%` } as React.CSSProperties}
    >
      <div className="min-h-0 min-w-0 flex-1 md:flex-none md:w-[var(--split-left)]">{left}</div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize question and code panels"
        aria-valuenow={Math.round(leftPercent)}
        aria-valuemin={MIN_LEFT_PERCENT}
        aria-valuemax={MAX_LEFT_PERCENT}
        title="Drag to resize, double-click to reset"
        className="group hidden w-2 shrink-0 cursor-col-resize touch-none items-center justify-center md:flex"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => setLeftPercent(DEFAULT_LEFT_PERCENT)}
      >
        <div className={`h-12 w-0.5 transition-colors ${dragging ? "bg-white" : "bg-white/20 group-hover:bg-white/60"}`} />
      </div>

      <div className="min-h-0 min-w-0 flex-1">{right}</div>
    </div>
  );
}
