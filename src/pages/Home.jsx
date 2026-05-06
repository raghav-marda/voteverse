import { Link } from "react-router-dom";
import { useState } from "react";
import { haptic } from "../utils/haptics";
import { useProgress } from "../components/ProgressContext";
import { useBadges } from "../components/BadgeContext";
import "../styles/home.css";
import "../styles/extras.css";

/* ── 3 Modes ────────────────────────────────────── */

const MODES = [
  {
    key: "learn",
    label: "📚 Learn",
    desc: "Understand democracy step by step",
    color: "#388cdc",
    items: [
      { to: "/explore", icon: "🪐", title: "Explore", desc: "Space-themed planet modules" },
      { to: "/timeline", icon: "🗓️", title: "Timeline", desc: "Full election journey" },
    ],
  },
  {
    key: "experience",
    label: "🎮 Experience",
    desc: "Play, simulate, and interact",
    color: "#38dc8c",
    items: [
      { to: "/simulation", icon: "🗳️", title: "Simulation", desc: "Be an Election Officer" },
      { to: "/myths", icon: "🔍", title: "Myth vs Fact", desc: "Test your knowledge" },
    ],
  },
  {
    key: "ask",
    label: "🤖 Ask",
    desc: "Get instant answers via voice or text",
    color: "#7c5cfc",
    items: [
      { to: "/ai-assistant", icon: "💬", title: "AI Assistant", desc: "Voice + chat guide" },
    ],
  },
];

/* ── Voter Journeys ─────────────────────────────── */

const JOURNEYS = {
  first: [
    { text: "Check if you're 18+ and an Indian citizen", done: true },
    { text: "Register online (Form 6) or at your local ERO", done: false },
    { text: "Get your Voter ID (EPIC card)", done: false },
    { text: "Find your polling booth before election day", done: false },
    { text: "Carry valid ID to the booth and vote!", done: false },
  ],
  experienced: [
    { text: "Verify your name in the voter list", done: true },
    { text: "Research candidates and their promises", done: false },
    { text: "Check your booth location & timing", done: false },
    { text: "Vote on election day — bring your ID", done: true },
    { text: "Encourage others to vote too!", done: false },
  ],
};

/* ── Component ──────────────────────────────────── */

function Home({ onStartDemo, onCrashCourse, onFindBooth }) {
  const [activeMode, setActiveMode] = useState("learn");
  const [journey, setJourney] = useState(null); // "first" | "experienced" | null
  const currentMode = MODES.find((m) => m.key === activeMode);
  const { percent, completed, total } = useProgress();
  const { earned } = useBadges();

  return (
    <div className="home-page">
      <section className="hero">
        <span className="hero-badge">✨ Futuristic Democracy Platform</span>

        <h1 className="hero-title">
          Learn Democracy
          <br />
          with <span className="accent">VoteVerse</span>
        </h1>

        <p className="hero-sub">
          Explore elections through an interactive space UI, play as an
          Election Officer, and get AI-powered answers — all in one place.
        </p>

        <div className="hero-actions">
          <button className="cta-primary" onClick={() => { haptic(); onStartDemo(); }}>
            🚀 Start Demo
          </button>
          <Link to="/explore" className="cta-secondary" onClick={() => haptic()}>
            Explore Now →
          </Link>
        </div>

        {/* ── Quick Actions ─────────────────────── */}
        <div className="quick-actions">
          <button className="qa-btn" onClick={() => { haptic(); onCrashCourse(); }}>
            ⚡ Elections in 60s
          </button>
          <button className="qa-btn" onClick={() => { haptic(); onFindBooth(); }}>
            📍 Find My Booth
          </button>
          <Link to="/myths" className="qa-btn" onClick={() => haptic()}>
            🔍 Myth vs Fact
          </Link>
        </div>

        {/* ── Mode Switcher ─────────────────────── */}
        <div className="mode-switcher">
          <div className="mode-tabs">
            {MODES.map((m) => (
              <button
                key={m.key}
                className={`mode-tab ${activeMode === m.key ? "active" : ""}`}
                style={{ "--mode-color": m.color }}
                onClick={() => { haptic(5); setActiveMode(m.key); }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="mode-desc">{currentMode.desc}</p>

          <div className="mode-items" key={activeMode}>
            {currentMode.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="feature-card"
                onClick={() => haptic()}
              >
                <span className="feature-icon">{item.icon}</span>
                <div className="feature-title">{item.title}</div>
                <div className="feature-desc">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Voter Journey ─────────────────────── */}
        <div className="voter-journey">
          <p className="vj-prompt">What describes you?</p>
          <div className="vj-options">
            <button
              className={`vj-option ${journey === "first" ? "active" : ""}`}
              onClick={() => { haptic(); setJourney(journey === "first" ? null : "first"); }}
            >
              🙋 First-Time Voter
            </button>
            <button
              className={`vj-option ${journey === "experienced" ? "active" : ""}`}
              onClick={() => { haptic(); setJourney(journey === "experienced" ? null : "experienced"); }}
            >
              ✅ Experienced Voter
            </button>
          </div>

          {journey && (
            <div className="vj-checklist" key={journey}>
              {JOURNEYS[journey].map((item, i) => (
                <div key={i} className={`vj-item ${item.done ? "done" : ""}`}>
                  <span className="vj-check">{item.done ? "✓" : ""}</span>
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Progress Tracker ──────────────────── */}
        <div className="progress-strip">
          <div className="progress-header">
            <span className="progress-label">Your Progress</span>
            <span className="progress-pct">{percent}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="progress-badges">
            {[
              { id: "first_voter", label: "🗳️ First Voter" },
              { id: "election_expert", label: "🎓 Expert" },
              { id: "fair_officer", label: "🏅 Fair Officer" },
            ].map((b) => (
              <span
                key={b.id}
                className={`progress-badge-chip ${earned.has(b.id) ? "earned" : ""}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
