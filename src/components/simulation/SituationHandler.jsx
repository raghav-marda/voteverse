import { useState } from "react";
import { SITUATIONS, POINTS } from "./SimulationData";

/**
 * Step 3: Handle situational challenges.
 * Multiple-choice scenarios with instant feedback.
 */
function SituationHandler({ onComplete, onScore }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [log, setLog] = useState([]);

  const situation = SITUATIONS[index];
  const isLast = index === SITUATIONS.length - 1;

  const handleChoice = (option) => {
    if (feedback) return;

    const points = option.correct ? POINTS.SITUATION_CORRECT : POINTS.SITUATION_WRONG;
    onScore(points);

    setFeedback({
      correct: option.correct,
      message: option.correct
        ? "✓ Great call!"
        : `✗ Not ideal. ${situation.correctExplanation}`,
    });

    setLog((prev) => [...prev, {
      situation: situation.id,
      chose: option.id,
      correct: option.correct,
    }]);

    setTimeout(() => {
      if (isLast) {
        onComplete(log);
      } else {
        setIndex((i) => i + 1);
        setFeedback(null);
      }
    }, 2000);
  };

  return (
    <>
      <span className="phase-badge">📍 Step 3 of 3</span>
      <h2 className="phase-title">Handle Situations</h2>
      <p className="phase-desc">
        Real challenges arise. Make the right call to ensure a fair election.
      </p>

      <p className="counter-badge">
        Scenario {index + 1} of {SITUATIONS.length}
      </p>

      <div className="step-progress">
        {SITUATIONS.map((_, i) => (
          <div
            key={i}
            className={`step-dot ${
              i < index ? "done" : i === index ? "current" : ""
            }`}
          />
        ))}
      </div>

      <div className="game-card" key={situation.id}>
        <div className="situation-icon">{situation.icon}</div>
        <div className="situation-title">{situation.title}</div>
        <div className="situation-desc">{situation.description}</div>

        {!feedback && (
          <div className="option-list">
            {situation.options.map((opt) => (
              <button
                key={opt.id}
                className="option-btn"
                onClick={() => handleChoice(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {feedback && (
          <div className={`feedback-flash ${feedback.correct ? "correct" : "wrong"}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </>
  );
}

export default SituationHandler;
