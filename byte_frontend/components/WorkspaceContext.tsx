// ================= //
// Workspace Context //
// ================= //

// Shares the toolbar controls (Question/Spoiler toggle + Run/Judge actions) so
// they can live on the Navbar while their state/handlers stay in the panels
// that own them (QuestionPanel.tsx and CodePanel.tsx).

"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type View = "question" | "spoiler";
type Running = "run" | "judge" | null;

type Actions = { onRun: () => void; onJudge: () => void };

// How many hints a problem has. Each minigame owns its own per-hint-level
// target (games/minigames.ts) — this is just the shared hint ladder length.
export const TOTAL_HINT_LEVELS = 3;

interface WorkspaceContextValue 
{
  // Question/Spoiler toggle — owned by the context, read by Question.
  view: View;
  setView: (view: View) => void;

  // Run/Judge status — pushed up from CodePanel so the Navbar can reflect it.
  busy: boolean;
  running: Running;

  // Fired by the Navbar buttons.
  run: () => void;
  judge: () => void;

  // Wired up by CodePanel so the Navbar's buttons reach its handlers/state.
  setActions: (actions: Actions) => void;
  setStatus: (status: { busy: boolean; running: Running }) => void;

  // Minigame overlay — the Navbar's Game button opens it, CodePanel swaps its
  // editor area for the game while it's open. Resets to closed/0 on every
  // fresh mount (a new problem page), so hints never persist across leaving.
  gameOpen: boolean;
  openGame: () => void;
  closeGame: () => void;
  hintsUnlocked: number;
  unlockNextHint: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) 
{
  const [view, setView] = useState<View>("question");
  const [status, setStatus] = useState<{ busy: boolean; running: Running }>({
    busy: false,
    running: null,
  });
  const [gameOpen, setGameOpen] = useState(false);
  const [hintsUnlocked, setHintsUnlocked] = useState(0);

  const openGame = useCallback(() => setGameOpen(true), []);
  const closeGame = useCallback(() => setGameOpen(false), []);
  const unlockNextHint = useCallback(() =>
  {
    setHintsUnlocked((prev) => Math.min(prev + 1, TOTAL_HINT_LEVELS));
  }, []);

  // Handlers are kept in a ref so CodePanel can re-register its latest closures
  // every render without triggering a provider re-render (and a render loop).
  const actionsRef = useRef<Actions>({ onRun: () => {}, onJudge: () => {} });

  const setActions = useCallback((actions: Actions) =>
  {
    actionsRef.current = actions;
  }, []);

  const run = useCallback(() => actionsRef.current.onRun(), []);
  const judge = useCallback(() => actionsRef.current.onJudge(), []);

  const setStatusStable = useCallback((next: { busy: boolean; running: Running }) =>
  {
    setStatus(next);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        view,
        setView,
        busy: status.busy,
        running: status.running,
        run,
        judge,
        setActions,
        setStatus: setStatusStable,
        gameOpen,
        openGame,
        closeGame,
        hintsUnlocked,
        unlockNextHint,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() 
{
  const ctx = useContext(WorkspaceContext);
  if (!ctx) 
  {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}
