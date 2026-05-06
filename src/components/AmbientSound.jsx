import { useRef, useState, useCallback } from "react";

/**
 * Ambient space drone generator using Web Audio API.
 * Creates a layered pad sound with no external files needed.
 * Returns a toggle button component.
 */
function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const start = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    // Fade in over 2 seconds
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);

    // Layer 1: deep sub drone
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const g1 = ctx.createGain();
    g1.gain.value = 0.5;
    osc1.connect(g1).connect(masterGain);
    osc1.start();

    // Layer 2: mid pad
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 110;
    const g2 = ctx.createGain();
    g2.gain.value = 0.15;
    osc2.connect(g2).connect(masterGain);
    osc2.start();

    // Layer 3: airy high shimmer
    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 330;
    const g3 = ctx.createGain();
    g3.gain.value = 0.04;

    // Gentle LFO on shimmer for movement
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain).connect(osc3.frequency);
    lfo.start();

    osc3.connect(g3).connect(masterGain);
    osc3.start();

    nodesRef.current = [osc1, osc2, osc3, lfo, masterGain];
    
    // Safely handle the audio promise to prevent autoplay errors
    if (ctx.state === "suspended") {
      ctx.resume().then(() => {
        setPlaying(true);
      }).catch((e) => {
        console.warn("Audio autoplay blocked by browser:", e);
        setPlaying(false);
      });
    } else {
      setPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const masterGain = nodesRef.current[nodesRef.current.length - 1];
    // Fade out over 1.5s
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

    setTimeout(() => {
      nodesRef.current.forEach((n) => {
        if (n.stop) n.stop();
      });
      ctx.close();
      ctxRef.current = null;
      nodesRef.current = [];
    }, 1600);

    setPlaying(false);
  }, []);

  const toggle = () => (playing ? stop() : start());

  return (
    <button
      className={`ctrl-btn ${playing ? "active" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
    >
      <span className="ctrl-btn-icon">{playing ? "🔊" : "🔇"}</span>
      Ambient
    </button>
  );
}

export default AmbientSound;
