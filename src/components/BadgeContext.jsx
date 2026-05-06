import { createContext, useContext, useState, useCallback } from "react";
import "../styles/badges.css";

/* ── Badge Definitions ──────────────────────────── */

export const BADGES = {
  FIRST_VOTER: {
    id: "first_voter",
    icon: "🗳️",
    title: "First Time Voter",
    desc: "You asked your first question about elections!",
  },
  ELECTION_EXPERT: {
    id: "election_expert",
    icon: "🎓",
    title: "Election Expert",
    desc: "You explored all planets in the VoteVerse!",
  },
  FAIR_OFFICER: {
    id: "fair_officer",
    icon: "🏅",
    title: "Fair Election Officer",
    desc: "You completed the simulation with a great score!",
  },
  DEMO_COMPLETE: {
    id: "demo_complete",
    icon: "🚀",
    title: "VoteVerse Explorer",
    desc: "You completed the full guided demo!",
  },
};

/* ── Context ────────────────────────────────────── */

const BadgeContext = createContext();

export function useBadges() {
  return useContext(BadgeContext);
}

export function BadgeProvider({ children }) {
  const [earned, setEarned] = useState(new Set());
  const [popup, setPopup] = useState(null);

  const award = useCallback(
    (badge) => {
      if (earned.has(badge.id)) return; // already earned
      setEarned((prev) => new Set(prev).add(badge.id));
      setPopup(badge);
    },
    [earned]
  );

  const dismiss = useCallback(() => setPopup(null), []);

  return (
    <BadgeContext.Provider value={{ earned, award }}>
      {children}

      {/* Badge Popup */}
      {popup && (
        <div className="badge-popup-overlay" onClick={dismiss}>
          <div className="badge-popup" onClick={(e) => e.stopPropagation()}>
            <span className="badge-icon">{popup.icon}</span>
            <div className="badge-label">Badge Earned</div>
            <div className="badge-title">{popup.title}</div>
            <div className="badge-desc">{popup.desc}</div>
            <button className="badge-dismiss" onClick={dismiss}>
              Awesome!
            </button>
          </div>
        </div>
      )}
    </BadgeContext.Provider>
  );
}
