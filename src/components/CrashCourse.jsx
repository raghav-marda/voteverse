import { useState, useEffect, useRef, useCallback } from "react";
import { useProgress } from "./ProgressContext";
import { haptic } from "../utils/haptics";

/**
 * 1-Minute Crash Course — full-screen overlay
 * Auto-advances through election steps with text.
 * Props: active, onEnd
 */

const CRASH_STEPS = [
  { icon: "📣", title: "Elections Announced", text: "The Election Commission sets the date. The Model Code of Conduct starts — no government freebies allowed." },
  { icon: "📋", title: "Voter Registration", text: "Citizens 18+ sign up, get a Voter ID, and their names go on the electoral roll." },
  { icon: "📢", title: "Campaigning Begins", text: "Parties hold rallies and debates. All campaigning must stop 48 hours before voting." },
  { icon: "🗳️", title: "Voting Day", text: "You go to your booth, show your ID, press a button on the EVM, and your vote is cast secretly." },
  { icon: "📊", title: "Votes Counted", text: "EVMs are opened under strict watch. Paper VVPAT slips are cross-checked for accuracy." },
  { icon: "📈", title: "Results Declared", text: "Winners announced constituency by constituency. The party with majority seats wins." },
  { icon: "🏛️", title: "Government Formed", text: "The winning leader takes oath as PM or CM. Governance begins for the new term." },
];

const STEP_DURATION = 8500; // ~8.5s per step = ~60s total

function CrashCourse({ active, onEnd }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const { complete } = useProgress();

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const animateProgress = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const total = CRASH_STEPS.length * STEP_DURATION;
    setProgress(Math.min((elapsed / total) * 100, 100));
    if (elapsed < total) rafRef.current = requestAnimationFrame(animateProgress);
  }, []);

  useEffect(() => {
    if (!active) { cleanup(); setStep(0); setProgress(0); return; }

    startRef.current = Date.now();
    rafRef.current = requestAnimationFrame(animateProgress);

    let current = 0;
    timerRef.current = setInterval(() => {
      current += 1;
      if (current >= CRASH_STEPS.length) {
        cleanup();
        complete("crash");
        onEnd();
        return;
      }
      setStep(current);
    }, STEP_DURATION);

    return cleanup;
  }, [active, cleanup, animateProgress, complete, onEnd]);

  if (!active) return null;

  const current = CRASH_STEPS[step];

  return (
    <div className="crash-overlay">
      <div className="crash-card" key={step}>
        <div className="crash-step-label">
          Step {step + 1} of {CRASH_STEPS.length}
        </div>
        <span className="crash-icon">{current.icon}</span>
        <div className="crash-title">{current.title}</div>
        <div className="crash-detail">{current.text}</div>
      </div>

      <div className="crash-progress-track">
        <div className="crash-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <button className="crash-skip" onClick={() => { haptic(); complete("crash"); onEnd(); }}>
        Skip Course
      </button>
    </div>
  );
}

export default CrashCourse;
