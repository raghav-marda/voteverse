import { useState, useCallback, useEffect } from "react";
import { useBadges, BADGES } from "../components/BadgeContext";
import { useProgress } from "../components/ProgressContext";
import ScoreBar from "../components/simulation/ScoreBar";
import BoothSetup from "../components/simulation/BoothSetup";
import VoterVerification from "../components/simulation/VoterVerification";
import SituationHandler from "../components/simulation/SituationHandler";
import ResultScreen from "../components/simulation/ResultScreen";
import { POINTS } from "../components/simulation/SimulationData";
import "../styles/simulation.css";

/* Game phases */
const PHASE = {
  START: "start",
  BOOTH: "booth",
  VOTERS: "voters",
  SITUATIONS: "situations",
  RESULT: "result",
};

function Simulation() {
  const [phase, setPhase] = useState(PHASE.START);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState({
    voterDecisions: [],
    situationDecisions: [],
  });
  const { award } = useBadges();
  const { complete } = useProgress();

  /* Award badge when reaching result with good score */
  useEffect(() => {
    if (phase === PHASE.RESULT) {
      complete("simulation");
      if (score >= 70) {
        setTimeout(() => award(BADGES.FAIR_OFFICER), 800);
      }
    }
  }, [phase, score, award, complete]);

  const addScore = useCallback((pts) => {
    setScore((prev) => Math.max(0, prev + pts));
  }, []);

  /* Phase completions */
  const handleBoothComplete = useCallback(() => {
    addScore(POINTS.BOOTH_COMPLETE);
    setPhase(PHASE.VOTERS);
  }, [addScore]);

  const handleVotersComplete = useCallback((decisions) => {
    setLog((prev) => ({ ...prev, voterDecisions: decisions }));
    setPhase(PHASE.SITUATIONS);
  }, []);

  const handleSituationsComplete = useCallback((decisions) => {
    setLog((prev) => ({ ...prev, situationDecisions: decisions }));
    setPhase(PHASE.RESULT);
  }, []);

  const handleRestart = useCallback(() => {
    setPhase(PHASE.START);
    setScore(0);
    setLog({ voterDecisions: [], situationDecisions: [] });
  }, []);

  /* ── Start Screen ───────────────────────────── */
  if (phase === PHASE.START) {
    return (
      <div className="sim-page">
        <div className="start-screen">
          <div className="start-icon">🗳️</div>
          <h1 className="start-title">Become an Election Officer</h1>
          <p className="start-subtitle">
            Take charge of a polling booth. Verify voters, handle crises, and
            ensure a free and fair election.
          </p>
          <button className="start-btn" onClick={() => setPhase(PHASE.BOOTH)}>
            Start Simulation →
          </button>
        </div>
      </div>
    );
  }

  /* ── Result Screen ──────────────────────────── */
  if (phase === PHASE.RESULT) {
    return (
      <div className="sim-page">
        <ScoreBar score={score} />
        <ResultScreen score={score} log={log} onRestart={handleRestart} />
      </div>
    );
  }

  /* ── Active Game Phases ─────────────────────── */
  return (
    <div className="sim-page">
      <ScoreBar score={score} />

      {phase === PHASE.BOOTH && (
        <BoothSetup onComplete={handleBoothComplete} />
      )}

      {phase === PHASE.VOTERS && (
        <VoterVerification onComplete={handleVotersComplete} onScore={addScore} />
      )}

      {phase === PHASE.SITUATIONS && (
        <SituationHandler onComplete={handleSituationsComplete} onScore={addScore} />
      )}
    </div>
  );
}

export default Simulation;
