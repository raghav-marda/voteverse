import { useState, useCallback } from "react";
import { MYTH_FACTS } from "../components/MythFactData";
import { useProgress } from "../components/ProgressContext";
import { useBadges, BADGES } from "../components/BadgeContext";
import { haptic } from "../utils/haptics";
import "../styles/extras.css";

function MythFact() {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState(null); // "myth" | "fact" | null
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [done, setDone] = useState(false);
  const { complete } = useProgress();
  const { award } = useBadges();

  const item = MYTH_FACTS[current];
  const isCorrect = answer === item?.type;

  const handleAnswer = useCallback(
    (choice) => {
      haptic();
      setAnswer(choice);
      setScore((prev) => ({
        ...prev,
        [choice === item.type ? "correct" : "incorrect"]:
          prev[choice === item.type ? "correct" : "incorrect"] + 1,
      }));
    },
    [item]
  );

  const handleNext = () => {
    haptic(5);
    if (current + 1 >= MYTH_FACTS.length) {
      setDone(true);
      complete("myths");
      if (score.correct >= 4) {
        setTimeout(() => award(BADGES.ELECTION_EXPERT), 600);
      }
    } else {
      setCurrent((prev) => prev + 1);
      setAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setAnswer(null);
    setScore({ correct: 0, incorrect: 0 });
    setDone(false);
  };

  if (done) {
    return (
      <div className="myth-page">
        <div className="myth-complete">
          <span className="myth-complete-icon">
            {score.correct >= 4 ? "🏆" : "📊"}
          </span>
          <h2>
            {score.correct >= 4 ? "Excellent!" : "Good Try!"}
          </h2>
          <p>
            You got {score.correct} out of {MYTH_FACTS.length} correct.
          </p>
          <button className="myth-next-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="myth-page">
      <div className="myth-header">
        <h1>🔍 Myth vs Fact</h1>
        <p>Can you tell election myths from facts?</p>
      </div>

      <div className="myth-score-bar">
        <div>
          ✅ Correct: <span className="correct">{score.correct}</span>
        </div>
        <div>
          ❌ Wrong: <span className="incorrect">{score.incorrect}</span>
        </div>
      </div>

      <div
        className={`myth-card ${
          answer ? (isCorrect ? "correct-flash" : "incorrect-flash") : ""
        }`}
        key={current}
      >
        <div className="myth-counter">
          Question {current + 1} of {MYTH_FACTS.length}
        </div>

        <div className="myth-statement">"{item.statement}"</div>

        {!answer ? (
          <div className="myth-buttons">
            <button
              className="myth-btn myth-type"
              onClick={() => handleAnswer("myth")}
            >
              ❌ Myth
            </button>
            <button
              className="myth-btn fact-type"
              onClick={() => handleAnswer("fact")}
            >
              ✅ Fact
            </button>
          </div>
        ) : (
          <>
            <div className={`myth-result ${isCorrect ? "correct" : "incorrect"}`}>
              <div className="myth-result-label">
                {isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
                {" — It's a "}
                {item.type === "myth" ? "Myth" : "Fact"}.
              </div>
              {item.explanation}
            </div>
            <button className="myth-next-btn" onClick={handleNext}>
              {current + 1 < MYTH_FACTS.length ? "Next →" : "See Results"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MythFact;
