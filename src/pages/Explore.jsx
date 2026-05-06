import { useState, useCallback } from "react";
import StarField from "../components/StarField";
import PlanetModule from "../components/PlanetModule";
import DetailPanel from "../components/DetailPanel";
import AmbientSound from "../components/AmbientSound";
import useGuidedWalkthrough from "../components/useGuidedWalkthrough";
import "../styles/explore.css";

/* ── Planet Data ────────────────────────────────── */

const planets = [
  {
    id: "registration",
    title: "Voter Registration",
    icon: "📋",
    description:
      "Citizens register to participate in the democratic process. Identity verification, eligibility checks, and voter ID issuance happen at this stage.",
    bg: "linear-gradient(135deg, #1a3a5c, #0d2240)",
    glow: "rgba(56, 140, 220, 0.4)",
    glowSoft: "rgba(56, 140, 220, 0.15)",
  },
  {
    id: "campaigning",
    title: "Campaigning",
    icon: "📢",
    description:
      "Candidates and parties present their vision to the public. Rallies, debates, and media outreach shape voter awareness and opinion.",
    bg: "linear-gradient(135deg, #5c3a1a, #402a0d)",
    glow: "rgba(220, 156, 56, 0.4)",
    glowSoft: "rgba(220, 156, 56, 0.15)",
  },
  {
    id: "voting",
    title: "Voting Day",
    icon: "🗳️",
    description:
      "The electorate casts their ballots at designated polling stations. Secure processes ensure every vote is counted fairly and transparently.",
    bg: "linear-gradient(135deg, #1a5c3a, #0d4022)",
    glow: "rgba(56, 220, 140, 0.4)",
    glowSoft: "rgba(56, 220, 140, 0.15)",
  },
  {
    id: "counting",
    title: "Counting",
    icon: "📊",
    description:
      "Ballots are tallied under strict observation. Results are verified, audited, and prepared for official announcement.",
    bg: "linear-gradient(135deg, #3a1a5c, #280d40)",
    glow: "rgba(156, 56, 220, 0.4)",
    glowSoft: "rgba(156, 56, 220, 0.15)",
  },
  {
    id: "formation",
    title: "Government Formation",
    icon: "🏛️",
    description:
      "Elected representatives form the government. Coalitions are built, portfolios assigned, and governance begins for the new term.",
    bg: "linear-gradient(135deg, #5c4a1a, #40350d)",
    glow: "rgba(220, 190, 56, 0.4)",
    glowSoft: "rgba(220, 190, 56, 0.15)",
  },
];

/* ── Explore Page ───────────────────────────────── */

function Explore() {
  const [manualPlanet, setManualPlanet] = useState(null);

  const walkthrough = useGuidedWalkthrough(planets);

  // During walkthrough, the hook controls which planet is shown.
  // Otherwise, manual click controls it.
  const shownPlanet = walkthrough.isActive
    ? walkthrough.activePlanet
    : manualPlanet;

  const handlePlanetClick = useCallback(
    (planet) => {
      if (walkthrough.isActive) return; // ignore clicks during walkthrough
      setManualPlanet(planet);
    },
    [walkthrough.isActive]
  );

  const handleClose = useCallback(() => {
    setManualPlanet(null);
  }, []);

  return (
    <div className="explore-space">
      <StarField count={160} />

      <div className="explore-header">
        <h1>Explore the VoteVerse</h1>
        <p>Navigate the democratic universe — click a planet to learn more</p>

        {/* Control buttons */}
        <div className="explore-controls">
          {!walkthrough.isActive ? (
            <button className="ctrl-btn" onClick={walkthrough.start}>
              <span className="ctrl-btn-icon">🚀</span>
              Quick Learn in 60s
            </button>
          ) : (
            <button className="ctrl-btn active" onClick={walkthrough.stop}>
              <span className="ctrl-btn-icon">⏹</span>
              Stop Tour
            </button>
          )}
          <AmbientSound />
        </div>
      </div>

      <div className="planet-grid">
        {planets.map((planet, i) => (
          <PlanetModule
            key={planet.id}
            planet={planet}
            index={i}
            onClick={handlePlanetClick}
            spotlight={walkthrough.isActive ? walkthrough.spotlitId : null}
          />
        ))}
      </div>

      <DetailPanel
        planet={shownPlanet}
        onClose={handleClose}
        walkthrough={walkthrough.walkthroughMeta}
      />

      {/* Walkthrough progress bar */}
      {walkthrough.isActive && (
        <div
          className="walkthrough-progress"
          style={{ width: `${walkthrough.progress}%` }}
        />
      )}
    </div>
  );
}

export default Explore;
