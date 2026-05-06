import { useState } from "react";
import { VOTERS, POINTS } from "./SimulationData";

/**
 * Step 2: Voter verification.
 * Presents voter cards one-by-one; user must Allow or Reject.
 */
function VoterVerification({ onComplete, onScore }) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { correct, message }
  const [decisions, setDecisions] = useState([]);

  const voter = VOTERS[index];
  const isLast = index === VOTERS.length - 1;

  const handleDecision = (action) => {
    if (feedback) return; // already answered

    const correct = action === voter.correctAction;
    const points = correct ? POINTS.VOTER_CORRECT : POINTS.VOTER_WRONG;
    onScore(points);

    const msg = correct
      ? "✓ Correct decision!"
      : `✗ Wrong — should have ${voter.correctAction === "allow" ? "allowed" : "rejected"} this voter.`;

    setFeedback({ correct, message: msg });
    setDecisions((prev) => [...prev, { voter: voter.id, action, correct }]);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (isLast) {
        onComplete(decisions);
      } else {
        setIndex((i) => i + 1);
        setFeedback(null);
      }
    }, 1400);
  };

  return (
    <>
      <span className="phase-badge">📍 Step 2 of 3</span>
      <h2 className="phase-title">Verify Voters</h2>
      <p className="phase-desc">
        Check each voter's credentials. Allow legitimate voters, reject the rest.
      </p>

      <p className="counter-badge">
        Voter {index + 1} of {VOTERS.length}
      </p>

      {/* Step progress dots */}
      <div className="step-progress">
        {VOTERS.map((_, i) => (
          <div
            key={i}
            className={`step-dot ${
              i < index ? "done" : i === index ? "current" : ""
            }`}
          />
        ))}
      </div>

      <div className="game-card" key={voter.id}>
        <div className="voter-card">
          <div className="voter-avatar">{voter.photo}</div>
          <div className="voter-name">{voter.name}</div>
          <div className="voter-age">Age: {voter.age}</div>
          <span className={`voter-status-badge ${voter.idStatus}`}>
            {voter.idStatus === "valid" && "ID Verified"}
            {voter.idStatus === "fake" && "Suspicious ID"}
            {voter.idStatus === "duplicate" && "Possible Duplicate"}
            {voter.idStatus === "underage" && "Age Concern"}
          </span>
          <div className="voter-detail">{voter.detail}</div>

          {!feedback && (
            <div className="decision-row">
              <button
                className="decision-btn allow"
                onClick={() => handleDecision("allow")}
              >
                ✓ Allow to Vote
              </button>
              <button
                className="decision-btn reject"
                onClick={() => handleDecision("reject")}
              >
                ✗ Reject
              </button>
            </div>
          )}

          {feedback && (
            <div className={`feedback-flash ${feedback.correct ? "correct" : "wrong"}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VoterVerification;
