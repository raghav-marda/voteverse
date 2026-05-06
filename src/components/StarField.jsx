import { useMemo, useEffect, useRef, useCallback } from "react";

/**
 * Animated star field with parallax mouse tracking.
 * Stars twinkle via CSS; the entire field shifts subtly
 * as the user moves their mouse for a depth effect.
 */
function StarField({ count = 120 }) {
  const fieldRef = useRef(null);

  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = Math.random() * 2.5 + 0.5;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          "--duration": `${Math.random() * 3 + 2}s`,
          "--min-opacity": `${Math.random() * 0.12 + 0.04}`,
          "--max-opacity": `${Math.random() * 0.45 + 0.35}`,
          animationDelay: `${Math.random() * 5}s`,
        },
      };
    });
  }, [count]);

  /* ── Parallax on mouse move ───────────────────── */
  const handleMouse = useCallback((e) => {
    if (!fieldRef.current) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = ((e.clientX - cx) / cx) * 12;  // max 12px shift
    const dy = ((e.clientY - cy) / cy) * 8;   // max 8px shift
    fieldRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  return (
    <div className="star-field" ref={fieldRef} aria-hidden="true">
      {stars.map((star) => (
        <div key={star.id} className="star" style={star.style} />
      ))}
    </div>
  );
}

export default StarField;
