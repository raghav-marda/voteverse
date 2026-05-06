import { createContext, useContext, useState, useCallback, useEffect } from "react";

/**
 * Tracks user progress across the app.
 * Persisted in localStorage so it survives reloads.
 *
 * Milestones:
 *   timeline   – explored timeline auto-play or clicked 4+ steps
 *   simulation – completed the simulation game
 *   myths      – completed myth vs fact quiz
 *   crash      – finished the 1-minute crash course
 *   booth      – searched for a booth
 */

const STORAGE_KEY = "voteverse_progress";

const DEFAULT = {
  timeline: false,
  simulation: false,
  myths: false,
  crash: false,
  booth: false,
};

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT, ...JSON.parse(saved) } : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const complete = useCallback((key) => {
    setProgress((prev) => ({ ...prev, [key]: true }));
  }, []);

  const completed = Object.values(progress).filter(Boolean).length;
  const total = Object.keys(progress).length;
  const percent = Math.round((completed / total) * 100);

  return (
    <ProgressContext.Provider value={{ progress, complete, percent, completed, total }}>
      {children}
    </ProgressContext.Provider>
  );
}
