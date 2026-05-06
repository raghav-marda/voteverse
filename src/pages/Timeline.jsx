import { useState, useEffect, useRef, useCallback } from "react";
import { useProgress } from "../components/ProgressContext";
import "../styles/timeline.css";

/* ── Timeline Data ──────────────────────────────── */

const STEPS = [
  {
    icon: "📣",
    title: "Announcement of Elections",
    detail:
      "The Election Commission announces the schedule. The Model Code of Conduct kicks in — no government can announce new policies or schemes to influence voters.",
  },
  {
    icon: "📋",
    title: "Voter Registration",
    detail:
      "Citizens above 18 register to vote. They verify their identity, get a Voter ID (EPIC card), and their names are added to the electoral roll.",
  },
  {
    icon: "📢",
    title: "Campaigning",
    detail:
      "Parties and candidates campaign through rallies, debates, and media. Campaigning must stop 48 hours before polling day to give voters time to decide.",
  },
  {
    icon: "🗳️",
    title: "Voting Day",
    detail:
      "Voters visit their assigned polling booth, verify their identity, and cast votes on EVMs. Indelible ink is applied to prevent duplicate voting.",
  },
  {
    icon: "📊",
    title: "Counting of Votes",
    detail:
      "EVMs are unsealed under strict observation. Votes are tallied electronically and cross-verified with VVPAT paper slips for accuracy.",
  },
  {
    icon: "📈",
    title: "Result Declaration",
    detail:
      "The Election Commission officially declares results. Winners are announced constituency by constituency, and the final tally determines the majority.",
  },
  {
    icon: "🏛️",
    title: "Government Formation",
    detail:
      "The party or coalition with majority is invited to form the government. The leader takes oath as PM or CM, and governance begins.",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5s per step

/* ── Timeline Page ──────────────────────────────── */

function Timeline() {
  const [activeStep, setActiveStep] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [visited, setVisited] = useState(new Set());
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const { complete } = useProgress();

  /* Stop autoplay cleanly */
  const stopAutoplay = useCallback(() => {
    setAutoplay(false);
    setAutoProgress(0);
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    complete("timeline");
  }, [complete]);

  /* Progress animation */
  const animateProgress = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const total = STEPS.length * AUTOPLAY_INTERVAL;
    const pct = Math.min((elapsed / total) * 100, 100);
    setAutoProgress(pct);
    if (pct < 100) {
      rafRef.current = requestAnimationFrame(animateProgress);
    }
  }, []);

  /* Start autoplay */
  const startAutoplay = useCallback(() => {
    setAutoplay(true);
    setActiveStep(0);
    startRef.current = Date.now();

    // Advance step every interval
    let current = 0;
    timerRef.current = setInterval(() => {
      current += 1;
      if (current >= STEPS.length) {
        stopAutoplay();
        return;
      }
      setActiveStep(current);
    }, AUTOPLAY_INTERVAL);

    // Smooth progress bar
    rafRef.current = requestAnimationFrame(animateProgress);
  }, [stopAutoplay, animateProgress]);

  /* Toggle autoplay */
  const toggleAutoplay = () => {
    if (autoplay) {
      stopAutoplay();
      setActiveStep(null);
    } else {
      startAutoplay();
    }
  };

  /* Manual click */
  const handleStepClick = (idx) => {
    if (autoplay) return;
    setActiveStep((prev) => (prev === idx ? null : idx));
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(idx);
      if (next.size >= 4) complete("timeline");
      return next;
    });
  };

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Calculate fill height for the spine */
  const fillHeight =
    activeStep !== null
      ? `${((activeStep + 1) / STEPS.length) * 100}%`
      : "0%";

  return (
    <div className="timeline-page">
      {/* Header */}
      <div className="timeline-header">
        <h1>🗓️ Election Timeline</h1>
        <p>
          Follow the complete election journey — from announcement to
          government formation.
        </p>

        <button
          className={`autoplay-btn ${autoplay ? "active" : ""}`}
          onClick={toggleAutoplay}
        >
          {autoplay ? "⏹ Stop" : "▶ Auto Play"}
        </button>
      </div>

      {/* Autoplay progress bar */}
      {autoplay && (
        <div className="tl-autoplay-bar">
          <div
            className="tl-autoplay-fill"
            style={{ width: `${autoProgress}%` }}
          />
        </div>
      )}

      {/* Timeline */}
      <div className="timeline">
        {/* Animated fill line */}
        <div className="timeline-fill" style={{ height: fillHeight }} />

        {STEPS.map((step, i) => {
          const isActive = activeStep === i;
          const isCompleted = activeStep !== null && i < activeStep;

          return (
            <div
              key={i}
              className={`tl-step ${isActive ? "active" : ""} ${
                isCompleted ? "completed" : ""
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => handleStepClick(i)}
            >
              {/* Node circle */}
              <div className="tl-node">
                <span className="tl-num">
                  {isCompleted ? "✓" : i + 1}
                </span>
              </div>

              {/* Content */}
              <div className="tl-header">
                <span className="tl-icon">{step.icon}</span>
                <span className="tl-title">{step.title}</span>
              </div>

              {/* Expandable detail */}
              <div className={`tl-detail ${isActive ? "open" : ""}`}>
                <div className="tl-detail-inner">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;
