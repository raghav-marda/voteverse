import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for the "Quick Learn in 60 Seconds" guided walkthrough.
 *
 * Cycles through all planets:
 *   1. Spotlight planet (dim others)  → 2s pause
 *   2. Open detail panel              → 10s reading time
 *   3. Close panel, move to next
 *   Total ≈ 12s × 5 = 60s
 *
 * Returns: { isActive, spotlitId, activePlanet, walkthroughMeta, progress, start, stop }
 */
function useGuidedWalkthrough(planets) {
  const [isActive, setIsActive] = useState(false);
  const [spotlitId, setSpotlitId] = useState(null);
  const [activePlanet, setActivePlanet] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);
  const startTime = useRef(0);
  const rafRef = useRef(null);

  const SPOTLIGHT_PAUSE = 2000;  // 2s spotlight before opening detail
  const DETAIL_DURATION = 10000; // 10s to read
  const STEP_TOTAL = SPOTLIGHT_PAUSE + DETAIL_DURATION;
  const TOTAL_DURATION = planets.length * STEP_TOTAL;

  const clearAllTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  /* Progress bar animation via rAF */
  const animateProgress = useCallback(() => {
    const elapsed = Date.now() - startTime.current;
    const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
    setProgress(pct);
    if (pct < 100) {
      rafRef.current = requestAnimationFrame(animateProgress);
    }
  }, [TOTAL_DURATION]);

  const start = useCallback(() => {
    clearAllTimers();
    setIsActive(true);
    setProgress(0);
    startTime.current = Date.now();
    rafRef.current = requestAnimationFrame(animateProgress);

    planets.forEach((planet, i) => {
      const stepStart = i * STEP_TOTAL;

      // Phase 1: Spotlight the planet
      timers.current.push(
        setTimeout(() => {
          setSpotlitId(planet.id);
          setActivePlanet(null);
          setCurrentStep(i);
        }, stepStart)
      );

      // Phase 2: Open detail panel
      timers.current.push(
        setTimeout(() => {
          setActivePlanet(planet);
        }, stepStart + SPOTLIGHT_PAUSE)
      );

      // Phase 3: Close detail, prepare for next
      if (i < planets.length - 1) {
        timers.current.push(
          setTimeout(() => {
            setActivePlanet(null);
          }, stepStart + STEP_TOTAL - 400)
        );
      }
    });

    // End walkthrough
    timers.current.push(
      setTimeout(() => {
        setActivePlanet(null);
        setSpotlitId(null);
        setIsActive(false);
        setProgress(0);
        setCurrentStep(0);
      }, TOTAL_DURATION + 200)
    );
  }, [planets, clearAllTimers, animateProgress, STEP_TOTAL, TOTAL_DURATION]);

  const stop = useCallback(() => {
    clearAllTimers();
    setIsActive(false);
    setSpotlitId(null);
    setActivePlanet(null);
    setProgress(0);
    setCurrentStep(0);
  }, [clearAllTimers]);

  const walkthroughMeta = isActive
    ? { currentStep, totalSteps: planets.length }
    : null;

  return { isActive, spotlitId, activePlanet, walkthroughMeta, progress, start, stop };
}

export default useGuidedWalkthrough;
