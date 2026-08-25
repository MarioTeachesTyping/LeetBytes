// ============ //
// Filter Modal //
// ============ //

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PROBLEM_COMPANIES, PROBLEM_TOPICS } from "@/lib/problem-list";
import
{
  DIFFICULTIES,
  EMPTY_FILTERS,
  PROBLEM_STATUSES,
  countActiveFilters,
  countTokens,
  cycleToken,
  type ProblemFilters,
  type TokenMap,
  type TokenState,
} from "@/lib/problem-filters";

const BACK_BUTTON_FRAMES = [
  "/base/button-back.png",
  "/base/button-back-2.png",
  "/base/button-back-3.png",
];

interface FilterModalProps
{
  open: boolean;
  onClose: () => void;
  filters: ProblemFilters;
  onChange: (filters: ProblemFilters) => void;
  matchCount: number;
  totalCount: number;
}

// Pixel-grid magnifier, drawn as rects so it stays hard-edged next to the
// rest of the UI instead of anti-aliasing like a normal icon set would.
function PixelSearchIcon({ className }: { className?: string })
{
  return (
    <svg viewBox="0 0 11 11" className={className} fill="currentColor" shapeRendering="crispEdges">
      <rect x="2" y="0" width="3" height="1" />
      <rect x="1" y="1" width="1" height="1" />
      <rect x="5" y="1" width="1" height="1" />
      <rect x="0" y="2" width="1" height="2" />
      <rect x="6" y="2" width="1" height="2" />
      <rect x="1" y="4" width="1" height="1" />
      <rect x="5" y="4" width="1" height="1" />
      <rect x="2" y="5" width="3" height="1" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="8" width="3" height="3" />
    </svg>
  );
}

const tokenClass: Record<TokenState | "off", string> = {
  off: "border-white/15 text-white/55 hover:border-white/45 hover:text-white",
  include: "border-emerald-400 bg-emerald-400/15 text-emerald-300",
  exclude: "border-rose-400 bg-rose-400/15 text-rose-300",
};

const markerClass: Record<TokenState, string> = {
  include: "border-emerald-400/60 text-emerald-300",
  exclude: "border-rose-400/60 text-rose-300",
};

// One tag. Clicking walks it through is → is not → off, and the little badge
// on the right is what tells the two "on" states apart at a glance.
function TokenChip({ label, state, onClick }: {
  label: string;
  state?: TokenState;
  onClick: () => void;
})
{
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state !== undefined}
      className={`flex w-full shrink-0 items-center justify-between gap-2 border-2 px-2 py-1 text-left transition-colors ${
        tokenClass[state ?? "off"]
      }`}
    >
      <span className={`truncate text-[11px] tracking-wide ${state === "exclude" ? "line-through decoration-rose-400/70" : ""}`}>
        {label}
      </span>

      {state && (
        <span className={`shrink-0 border px-1 text-[8px] font-bold tracking-widest ${markerClass[state]}`}>
          {state === "include" ? "IS" : "NOT"}
        </span>
      )}
    </button>
  );
}

function FilterGroup({ label, options, map, onToggle }: {
  label: string;
  options: string[];
  map: TokenMap;
  onToggle: (token: string) => void;
})
{
  const active = countTokens(map);

  return (
    <div className="flex min-h-0 min-w-0 flex-col bg-white/20 p-[2px]">
      <div className="flex min-h-0 flex-1 flex-col bg-black/85">
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 px-2 py-1.5">
          <span className="text-[9px] tracking-[0.25em] text-white/40">{label}</span>
          {active > 0 && (
            <span className="border border-white/25 px-1 text-[8px] font-bold text-white/70">{active}</span>
          )}
        </div>

        <div className="pixel-scrollbar flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-1.5">
          {options.length === 0 ? (
            <p className="px-1 py-2 text-[10px] tracking-wide text-white/25">Nothing tagged yet.</p>
          ) : (
            options.map((option) => (
              <TokenChip
                key={option}
                label={option}
                state={map[option]}
                onClick={() => onToggle(option)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Slides modal-long.png up from off-screen, same as the Play/Options modals.
// Filtering is live — there's no Apply, Back just gets you back to the list.
export default function FilterModal({
  open,
  onClose,
  filters,
  onChange,
  matchCount,
  totalCount,
}: FilterModalProps)
{
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [backFrame, setBackFrame] = useState(0);

  useEffect(() =>
  {
    if (open)
    {
      setMounted(true);

      // Two rAFs, not one — the first gets us to the paint where the
      // off-screen start position actually renders, so the slide is visible.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() =>
      {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () =>
      {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setEntered(false);
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() =>
  {
    if (!backHovered)
    {
      setBackFrame(0);
      return;
    }

    const interval = setInterval(() =>
    {
      setBackFrame((i) => (i + 1) % BACK_BUTTON_FRAMES.length);
    }, 90);

    return () => clearInterval(interval);
  }, [backHovered]);

  useEffect(() =>
  {
    if (!open)
    {
      return;
    }

    function handleKey(event: KeyboardEvent)
    {
      if (event.key === "Escape")
      {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  if (!mounted)
  {
    return null;
  }

  function toggle(group: "topics" | "companies" | "difficulties" | "statuses", token: string)
  {
    onChange({ ...filters, [group]: cycleToken(filters[group], token) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-[92vw] max-w-[900px]"
        style={{
          aspectRatio: "2048 / 1123",
          transform: entered ? "translateY(0)" : "translateY(calc(100% + 60vh))",
          transition: "transform 300ms ease-out",
        }}
      >
        <Image
          src="/base/modal-long.png"
          alt=""
          fill
          priority
          className="pointer-events-none select-none"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="absolute inset-[9%] flex flex-col gap-2 px-2 pb-1 pt-2 sm:gap-3 sm:px-4 sm:pb-2 sm:pt-3">
          {/* Search */}
          <div className="flex shrink-0 items-center gap-2 border-2 border-white/25 bg-black/70 px-3 py-2 transition-colors focus-within:border-white/60">
            <PixelSearchIcon className="h-3.5 w-3.5 shrink-0 text-white/35" />

            <input
              type="text"
              value={filters.search}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
              placeholder="SEARCH PROBLEMS, TOPICS, COMPANIES"
              className="w-full bg-transparent text-xs tracking-wide text-white outline-none placeholder:text-white/25 sm:text-sm"
            />

            {filters.search !== "" && (
              <button
                type="button"
                onClick={() => onChange({ ...filters, search: "" })}
                aria-label="Clear search"
                className="shrink-0 border-2 border-white/20 px-1.5 text-[10px] font-bold text-white/50 transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                X
              </button>
            )}
          </div>

          {/* Groups — the two short lists sit on the left, the long ones scroll */}
          <div className="grid min-h-0 flex-1 grid-cols-[0.8fr_0.9fr_1.15fr_1.15fr] gap-2 sm:gap-3">
            <FilterGroup
              label="LEVEL"
              options={DIFFICULTIES}
              map={filters.difficulties}
              onToggle={(token) => toggle("difficulties", token)}
            />
            <FilterGroup
              label="STATUS"
              options={PROBLEM_STATUSES}
              map={filters.statuses}
              onToggle={(token) => toggle("statuses", token)}
            />
            <FilterGroup
              label="TOPIC"
              options={PROBLEM_TOPICS}
              map={filters.topics}
              onToggle={(token) => toggle("topics", token)}
            />
            <FilterGroup
              label="COMPANY"
              options={PROBLEM_COMPANIES}
              map={filters.companies}
              onToggle={(token) => toggle("companies", token)}
            />
          </div>

          {/* Footer — live match count, Back, Reset */}
          <div className="grid shrink-0 grid-cols-3 items-center">
            <p className="text-[10px] tracking-[0.2em] text-white/40">
              <span className={matchCount === 0 ? "text-rose-400" : "text-white"}>{matchCount}</span>
              {" "}/ {totalCount} MATCH
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                onMouseEnter={() => setBackHovered(true)}
                onMouseLeave={() => setBackHovered(false)}
                className="relative h-11 w-28 pb-2 transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:w-36"
              >
                {BACK_BUTTON_FRAMES.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Back"
                    fill
                    sizes="144px"
                    className={`object-contain ${i === backFrame ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onChange(EMPTY_FILTERS)}
                disabled={activeCount === 0}
                className="border-2 border-white/25 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-black disabled:border-white/10 disabled:text-white/25 disabled:hover:bg-transparent disabled:hover:text-white/25"
              >
                Reset{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
