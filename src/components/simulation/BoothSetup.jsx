import { useState } from "react";
import { BOOTH_CHECKLIST } from "./SimulationData";

/**
 * Step 1: Booth setup checklist.
 * User checks off all items before proceeding.
 */
function BoothSetup({ onComplete }) {
  const [checked, setChecked] = useState(new Set());

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allChecked = checked.size === BOOTH_CHECKLIST.length;

  return (
    <>
      <span className="phase-badge">📍 Step 1 of 3</span>
      <h2 className="phase-title">Setup Your Booth</h2>
      <p className="phase-desc">
        Before voting begins, ensure everything is in place. Check off each item.
      </p>

      <div className="game-card">
        <div className="checklist">
          {BOOTH_CHECKLIST.map((item) => (
            <div
              key={item.id}
              className={`checklist-item ${checked.has(item.id) ? "checked" : ""}`}
              onClick={() => toggle(item.id)}
              role="checkbox"
              aria-checked={checked.has(item.id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(item.id);
                }
              }}
            >
              <div className="check-box">
                {checked.has(item.id) && "✓"}
              </div>
              <span className="check-icon-label">{item.icon}</span>
              <span className="check-text">{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            className="continue-btn"
            disabled={!allChecked}
            onClick={() => onComplete()}
          >
            {allChecked ? "Open Booth →" : `${checked.size}/${BOOTH_CHECKLIST.length} checked`}
          </button>
        </div>
      </div>
    </>
  );
}

export default BoothSetup;
