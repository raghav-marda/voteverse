import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBadges, BADGES } from "./BadgeContext";

/**
 * Demo walkthrough narrated tour.
 *
 * Sequence: Timeline → Explore → Simulation → AI Assistant → Home
 */

const STEPS = [
  {
    path: "/timeline",
    label: "Step 1 — Timeline",
    text: "The Election Timeline shows all 7 stages — from announcement to government formation. It auto-plays like a story.",
    duration: 13000,
  },
  {
    path: "/explore",
    label: "Step 2 — Explore",
    text: "Each planet represents a democratic process — voter registration, campaigning, voting day, counting, and government formation.",
    duration: 13000,
  },
  {
    path: "/simulation",
    label: "Step 3 — Simulation",
    text: "Become an Election Officer! Set up booths, verify voter IDs, and handle real crisis scenarios like EVM malfunctions.",
    duration: 13000,
  },
  {
    path: "/ai-assistant",
    label: "Step 4 — AI Assistant",
    text: "Ask anything about elections using voice or text. Get instant, accurate answers from the VoteVerse AI.",
    duration: 12000,
  },
  {
    path: "/",
    label: "Demo Complete!",
    text: "You've explored the entire VoteVerse! Dive into any section to learn about democracy. 🎉",
    duration: 5000,
  },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0);

function DemoWalkthrough({ active, onEnd }) {
  const navigate = useNavigate();
  const { award } = useBadges();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);
  const startTime = useRef(0);
  const rafRef = useRef(null);

  // Stable refs — prevents useEffect re-triggers when navigate/award identity changes
  const navigateRef = useRef(navigate);
  const awardRef = useRef(award);
  const onEndRef = useRef(onEnd);
  navigateRef.current = navigate;
  awardRef.current = award;
  onEndRef.current = onEnd;

  const cleanup = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  /* Start / restart demo — depends ONLY on `active` */
  useEffect(() => {
    if (!active) {
      cleanup();
      setStep(0);
      setProgress(0);
      return;
    }

    startTime.current = Date.now();

    // Progress animation
    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      setProgress(Math.min((elapsed / TOTAL_DURATION) * 100, 100));
      if (elapsed < TOTAL_DURATION) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Navigate to first step
    navigateRef.current(STEPS[0].path);

    // Schedule step transitions
    let accumulated = 0;
    STEPS.forEach((s, i) => {
      if (i > 0) {
        const delay = accumulated;
        timers.current.push(
          setTimeout(() => {
            setStep(i);
            navigateRef.current(s.path);
          }, delay)
        );
      }
      accumulated += s.duration;
    });

    // End demo
    timers.current.push(
      setTimeout(() => {
        awardRef.current(BADGES.DEMO_COMPLETE);
        onEndRef.current();
      }, accumulated)
    );

    return cleanup;
  }, [active, cleanup]);

  if (!active) return null;

  const current = STEPS[step];

  return (
    <div className="demo-overlay">
      {/* Progress bar */}
      <div className="demo-progress-bar" style={{ width: `${progress}%` }} />

      {/* Narration card */}
      <div className="demo-narration" key={step}>
        <div className="demo-narration-step">{current.label}</div>
        <div className="demo-narration-text">{current.text}</div>
        <div className="demo-controls">
          <div className="demo-progress-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`demo-dot ${
                  i === step ? "active" : i < step ? "done" : ""
                }`}
              />
            ))}
          </div>
          <button className="demo-skip" onClick={() => onEndRef.current()}>
            Skip Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoWalkthrough;
