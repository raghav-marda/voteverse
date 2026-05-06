import { getVerdict, MAX_SCORE, POINTS } from "./SimulationData";

/**
 * Final result screen with score breakdown and verdict.
 */
function ResultScreen({ score, log, onRestart }) {
  const verdict = getVerdict(score);
  const pct = Math.round((score / MAX_SCORE) * 100);

  // Calculate category scores from log
  const voterCorrect = log.voterDecisions?.filter((d) => d.correct).length || 0;
  const voterWrong = (log.voterDecisions?.length || 0) - voterCorrect;
  const situCorrect = log.situationDecisions?.filter((d) => d.correct).length || 0;
  const situWrong = (log.situationDecisions?.length || 0) - situCorrect;

  const rows = [
    {
      label: "🖥️ Booth Setup",
      value: `+${POINTS.BOOTH_COMPLETE}`,
      cls: "positive",
    },
    {
      label: `👤 Voters Correct (${voterCorrect})`,
      value: voterCorrect > 0 ? `+${voterCorrect * POINTS.VOTER_CORRECT}` : "0",
      cls: voterCorrect > 0 ? "positive" : "neutral",
    },
    {
      label: `👤 Voters Wrong (${voterWrong})`,
      value: voterWrong > 0 ? `${voterWrong * POINTS.VOTER_WRONG}` : "0",
      cls: voterWrong > 0 ? "negative" : "neutral",
    },
    {
      label: `⚡ Situations Correct (${situCorrect})`,
      value: situCorrect > 0 ? `+${situCorrect * POINTS.SITUATION_CORRECT}` : "0",
      cls: situCorrect > 0 ? "positive" : "neutral",
    },
    {
      label: `⚡ Situations Wrong (${situWrong})`,
      value: situWrong > 0 ? `${situWrong * POINTS.SITUATION_WRONG}` : "0",
      cls: situWrong > 0 ? "negative" : "neutral",
    },
  ];

  return (
    <div className="result-screen">
      <div className="result-verdict" style={{ color: verdict.color }}>
        {verdict.label}
      </div>
      <div className="result-score-big">{score}</div>
      <div className="result-max">
        out of {MAX_SCORE} ({pct}%)
      </div>

      <div className="result-breakdown">
        {rows.map((row, i) => (
          <div className="result-row" key={i}>
            <span className="result-row-label">{row.label}</span>
            <span className={`result-row-value ${row.cls}`}>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="restart-btn" onClick={onRestart}>
        🔄 Play Again
      </button>
    </div>
  );
}

export default ResultScreen;
