// ================= //
// Workspace Context //
// ================= //

// Shares the toolbar controls (Question/Spoiler toggle + Run/Judge actions) so
// they can live on the Navbar while their state/handlers stay in the panels
// that own them (Question.tsx and Solution.tsx).

"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type View = "question" | "spoiler";
type Running = "run" | "judge" | null;

type Actions = { onRun: () => void; onJudge: () => void };

interface WorkspaceContextValue {
  // Question/Spoiler toggle — owned by the context, read by Question.
  view: View;
  setView: (view: View) => void;

  // Run/Judge status — pushed up from Solution so the Navbar can reflect it.
  busy: boolean;
  running: Running;

  // Fired by the Navbar buttons.
  run: () => void;
  judge: () => void;

  // Wired up by Solution so the Navbar's buttons reach its handlers/state.
  setActions: (actions: Actions) => void;
  setStatus: (status: { busy: boolean; running: Running }) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("question");
  const [status, setStatus] = useState<{ busy: boolean; running: Running }>({
    busy: false,
    running: null,
  });

  // Handlers are kept in a ref so Solution can re-register its latest closures
  // every render without triggering a provider re-render (and a render loop).
  const actionsRef = useRef<Actions>({ onRun: () => {}, onJudge: () => {} });

  const setActions = useCallback((actions: Actions) => {
    actionsRef.current = actions;
  }, []);

  const run = useCallback(() => actionsRef.current.onRun(), []);
  const judge = useCallback(() => actionsRef.current.onJudge(), []);

  const setStatusStable = useCallback((next: { busy: boolean; running: Running }) => {
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
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}
