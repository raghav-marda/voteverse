/**
 * A single floating planet module with multi-axis drift.
 * Supports "spotlit" and "dimmed" states for the guided walkthrough.
 */
function PlanetModule({ planet, index, onClick, spotlight }) {
  // Each planet gets unique drift params for organic motion
  const driftDuration = 6 + (index % 3) * 2.5;
  const driftDelay = index * 0.8;

  // Randomised drift offsets per planet (deterministic by index)
  const seed = (index + 1) * 37;
  const dx1 = ((seed % 11) - 5) + "px";
  const dy1 = -((seed % 15) + 8) + "px";
  const dx2 = -((seed % 9) + 2) + "px";
  const dy2 = -((seed % 20) + 12) + "px";
  const dx3 = ((seed % 7) - 3) + "px";
  const dy3 = -((seed % 10) + 4) + "px";

  // Determine CSS class based on walkthrough state
  let stateClass = "";
  if (spotlight === planet.id) stateClass = "spotlit";
  else if (spotlight && spotlight !== planet.id) stateClass = "dimmed";

  return (
    <div
      className={`planet-wrapper ${stateClass}`}
      style={{
        "--drift-duration": `${driftDuration}s`,
        "--drift-delay": `${driftDelay}s`,
        "--dx1": dx1, "--dy1": dy1,
        "--dx2": dx2, "--dy2": dy2,
        "--dx3": dx3, "--dy3": dy3,
      }}
    >
      <div
        className="planet"
        role="button"
        tabIndex={0}
        aria-label={`Open ${planet.title}`}
        style={{
          "--planet-bg": planet.bg,
          "--planet-glow": planet.glow,
          "--planet-glow-soft": planet.glowSoft,
        }}
        onClick={() => onClick(planet)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(planet);
          }
        }}
      >
        <span className="planet-icon">{planet.icon}</span>
        <span className="planet-label">{planet.title}</span>
      </div>
    </div>
  );
}

export default PlanetModule;
