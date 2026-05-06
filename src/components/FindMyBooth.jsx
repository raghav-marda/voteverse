import { useState, useCallback } from "react";
import { useProgress } from "./ProgressContext";
import { haptic } from "../utils/haptics";

/**
 * Find My Booth modal — deterministic simulation.
 * Generates consistent mock results based on any user input.
 * Props: open, onClose
 */

const BOOTH_NAMES = [
  "Government Senior Secondary School",
  "Community Welfare Hall",
  "Municipal Corporation Office",
  "Public Library Building",
  "Primary Health Centre",
  "Local Panchayat Bhavan",
  "City Sports Complex"
];

function generateBooth(input) {
  const normalized = input.trim();
  if (!normalized) return null;
  
  const alphanumericOnly = normalized.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "unknown";
  
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < alphanumericOnly.length; i++) {
    hash = (hash << 5) - hash + alphanumericOnly.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const nameIdx = hash % BOOTH_NAMES.length;
  const boothNum = (hash % 150) + 1;
  
  // Title case for the address area
  const displayArea = normalized
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    name: `${BOOTH_NAMES[nameIdx]}, Booth ${boothNum}`,
    address: `${displayArea}, Local District`,
    time: "7:00 AM – 6:00 PM"
  };
}

function FindMyBooth({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { complete } = useProgress();

  const handleSearch = useCallback(() => {
    haptic();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate network/processing delay
    setTimeout(() => {
      const booth = generateBooth(query);
      setResult(booth);
      setLoading(false);
      complete("booth");
    }, 500);
  }, [query, complete]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (!open) return null;

  return (
    <div className="booth-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="booth-modal">
        <h2>📍 Find My Polling Booth</h2>
        <p className="booth-sub">Enter your city or area to find your booth</p>

        <input
          className="booth-input"
          type="text"
          placeholder="e.g. Delhi, Sector 4, MG Road…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <button className="booth-search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search Booth"}
        </button>

        {loading && <div className="booth-loading">Locating booth details...</div>}

        {result && !loading && (
          <div className="booth-result">
            <h3>🏫 {result.name}</h3>
            <p>📍 {result.address}</p>
            <p>🕐 {result.time}</p>
            <ul className="booth-tips">
              <li>Carry your Voter ID or approved photo ID</li>
              <li>Check your name in the voter list beforehand</li>
              <li>Arrive early to avoid queues</li>
            </ul>
            <p className="booth-disclaimer">
              * This is a simulated booth result for demonstration purposes.
            </p>
          </div>
        )}

        <button className="booth-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default FindMyBooth;
