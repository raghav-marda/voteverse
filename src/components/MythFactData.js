/**
 * Myth vs Fact statements for the interactive quiz.
 * type: "myth" or "fact"
 */
export const MYTH_FACTS = [
  {
    statement: "EVMs can be hacked through WiFi or Bluetooth.",
    type: "myth",
    explanation: "EVMs are standalone devices with no wireless connectivity. They can't be hacked remotely.",
  },
  {
    statement: "You need a Voter ID card to vote in Indian elections.",
    type: "fact",
    explanation: "A Voter ID (EPIC) is the primary ID, though 11 other photo IDs are also accepted at polling booths.",
  },
  {
    statement: "NOTA (None of the Above) can cancel an election if it gets the most votes.",
    type: "myth",
    explanation: "NOTA is symbolic. Even if NOTA gets the highest votes, the candidate with the next highest wins.",
  },
  {
    statement: "Indelible ink on your finger prevents you from voting twice.",
    type: "fact",
    explanation: "The ink lasts several days and is applied to the left index finger to prevent duplicate voting.",
  },
  {
    statement: "The Election Commission is controlled by the ruling government.",
    type: "myth",
    explanation: "The Election Commission is an independent constitutional body. The government cannot direct its decisions.",
  },
  {
    statement: "Voting is a fundamental right under the Indian Constitution.",
    type: "fact",
    explanation: "The right to vote is a constitutional right under Article 326, available to every citizen above 18.",
  },
];
