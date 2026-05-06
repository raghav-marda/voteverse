/**
 * All game data for the Election Officer simulation.
 * Kept in one file for easy tuning and extension.
 */

export const BOOTH_CHECKLIST = [
  { id: "evm", label: "EVM Machine Ready", icon: "🖥️" },
  { id: "voterlist", label: "Voter List Available", icon: "📋" },
  { id: "security", label: "Security Present", icon: "🛡️" },
];

export const VOTERS = [
  {
    id: "v1",
    name: "Ramesh Kumar",
    age: 34,
    photo: "👨",
    idStatus: "valid",
    detail: "ID card matches voter list. Photo and name verified.",
    correctAction: "allow",
  },
  {
    id: "v2",
    name: "Unknown Person",
    age: 28,
    photo: "🕵️",
    idStatus: "fake",
    detail: "ID card looks tampered. Photo doesn't match the person.",
    correctAction: "reject",
  },
  {
    id: "v3",
    name: "Sunita Devi",
    age: 45,
    photo: "👩",
    idStatus: "duplicate",
    detail: "Indelible ink already visible on left index finger.",
    correctAction: "reject",
  },
  {
    id: "v4",
    name: "Priya Sharma",
    age: 26,
    photo: "👩‍💼",
    idStatus: "valid",
    detail: "All documents in order. First-time voter.",
    correctAction: "allow",
  },
  {
    id: "v5",
    name: "Arjun Mehra",
    age: 16,
    photo: "👦",
    idStatus: "underage",
    detail: "Date of birth shows age is 16. Not eligible to vote.",
    correctAction: "reject",
  },
];

export const SITUATIONS = [
  {
    id: "s1",
    title: "Voter Without ID",
    description: "A person arrives claiming to be a registered voter but has no ID card. They insist they should be allowed to vote.",
    icon: "🪪",
    options: [
      { id: "a", label: "Turn them away", correct: false },
      { id: "b", label: "Allow anyway", correct: false },
      { id: "c", label: "Ask for alternative ID proof", correct: true },
    ],
    correctExplanation: "Election rules allow alternative identification. Turning away without options or allowing without verification are both wrong.",
  },
  {
    id: "s2",
    title: "Crowd Getting Aggressive",
    description: "A large crowd is pressuring you to speed up the process and skip verification steps. Tensions are rising.",
    icon: "😠",
    options: [
      { id: "a", label: "Give in to pressure", correct: false },
      { id: "b", label: "Call security for support", correct: true },
      { id: "c", label: "Close the booth", correct: false },
    ],
    correctExplanation: "Calling security maintains order while ensuring voting continues. Giving in compromises fairness; closing denies people their right.",
  },
  {
    id: "s3",
    title: "EVM Malfunction",
    description: "The Electronic Voting Machine stops responding mid-voting. Several voters are still in queue.",
    icon: "⚠️",
    options: [
      { id: "a", label: "Continue with faulty EVM", correct: false },
      { id: "b", label: "Switch to backup EVM", correct: true },
      { id: "c", label: "Cancel voting at this booth", correct: false },
    ],
    correctExplanation: "Protocol requires switching to a backup EVM. Using a faulty one risks invalid votes; cancelling disenfranchises voters.",
  },
];

/* Scoring constants */
export const POINTS = {
  BOOTH_COMPLETE: 10,
  VOTER_CORRECT: 12,
  VOTER_WRONG: -5,
  SITUATION_CORRECT: 10,
  SITUATION_WRONG: -5,
};

export const MAX_SCORE =
  POINTS.BOOTH_COMPLETE +
  VOTERS.length * POINTS.VOTER_CORRECT +
  SITUATIONS.length * POINTS.SITUATION_CORRECT;

/**
 * Returns a verdict based on score percentage.
 */
export function getVerdict(score) {
  const pct = (score / MAX_SCORE) * 100;
  if (pct >= 90) return { label: "Free & Fair Election ✅", tier: "excellent", color: "#38dc8c" };
  if (pct >= 60) return { label: "Mostly Fair Election ⚠️", tier: "good", color: "#dcb038" };
  return { label: "Compromised Election ❌", tier: "poor", color: "#dc4838" };
}
