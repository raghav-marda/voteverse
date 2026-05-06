import { MAX_SCORE } from "./SimulationData";

/**
 * Sticky score bar with animated fill.
 */
function ScoreBar({ score }) {
  const pct = Math.max(0, Math.min((score / MAX_SCORE) * 100, 100));

  return (
    <div className="score-bar">
      <span className="score-label">Fair Election Score</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="score-value">{score}</span>
    </div>
  );
}

export default ScoreBar;
