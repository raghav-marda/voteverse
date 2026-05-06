import { useEffect, useCallback } from "react";

/**
 * Full-screen overlay for planet details.
 * Supports walkthrough mode with step indicators and auto-advance.
 *
 * Props:
 *   planet       – active planet data (null = closed)
 *   onClose      – callback to close the panel
 *   walkthrough  – { currentStep, totalSteps } | null
 */
function DetailPanel({ planet, onClose, walkthrough = null }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && !walkthrough) onClose();
    },
    [onClose, walkthrough]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className={`detail-overlay ${planet ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !walkthrough) onClose();
      }}
    >
      <div className="detail-panel" style={{ "--planet-glow": planet?.glow }}>
        {planet && (
          <>
            {/* Step dots — only shown during walkthrough */}
            {walkthrough && (
              <div className="detail-step-indicator">
                {Array.from({ length: walkthrough.totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`detail-step-dot ${
                      i === walkthrough.currentStep
                        ? "active"
                        : i < walkthrough.currentStep
                        ? "completed"
                        : ""
                    }`}
                  />
                ))}
              </div>
            )}

            <span className="detail-planet-icon">{planet.icon}</span>
            <h2 className="detail-title">{planet.title}</h2>
            <p className="detail-description">{planet.description}</p>

            {!walkthrough && (
              <button className="detail-back-btn" onClick={onClose}>
                ← Back to Explore
              </button>
            )}

            {walkthrough && (
              <p style={{ fontSize: "0.7rem", color: "#555570", marginTop: "0.5rem" }}>
                Auto-advancing…
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DetailPanel;
