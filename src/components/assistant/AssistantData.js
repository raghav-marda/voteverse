/**
 * Predefined Q&A knowledge base for the VoteVerse AI Assistant.
 * Responses are matched via keyword scoring against user input.
 */

export const KNOWLEDGE_BASE = [
  {
    keywords: ["vote", "voting", "how to vote", "cast vote", "voting process"],
    question: "How do I vote?",
    answer:
      "To vote, you need a valid voter ID. On election day, visit your assigned polling booth, verify your identity, and cast your vote on the EVM (Electronic Voting Machine). Your vote is secret and secure.",
  },
  {
    keywords: ["register", "voter registration", "enroll", "sign up", "voter id"],
    question: "How do I register to vote?",
    answer:
      "You can register to vote by filling out Form 6 online at the Election Commission website or offline at your nearest Electoral Registration Office. You need to be at least 18 years old and an Indian citizen.",
  },
  {
    keywords: ["evm", "electronic voting machine", "machine", "how evm works"],
    question: "What is an EVM?",
    answer:
      "An EVM (Electronic Voting Machine) is a portable device used to record votes electronically. It has two units — the control unit with the officer, and the ballot unit in the booth. EVMs are tamper-proof and don't need electricity or internet.",
  },
  {
    keywords: ["election", "types of election", "general election", "state election"],
    question: "What are the types of elections?",
    answer:
      "India has several types of elections: General Elections (Lok Sabha), State Legislative Assembly Elections (Vidhan Sabha), Local Body Elections (Panchayat/Municipal), and By-elections to fill mid-term vacancies.",
  },
  {
    keywords: ["booth", "polling booth", "polling station", "where to vote"],
    question: "How do I find my polling booth?",
    answer:
      "You can find your polling booth by visiting the Election Commission's Voter Helpline app or website. Enter your EPIC number or search by name to find your assigned polling station.",
  },
  {
    keywords: ["count", "counting", "result", "how votes counted"],
    question: "How are votes counted?",
    answer:
      "After voting ends, EVMs are sealed and stored securely. On counting day, EVMs are opened in the presence of candidates' agents. Each EVM's VVPAT slips can be cross-verified. Results are tallied electronically for accuracy.",
  },
  {
    keywords: ["candidate", "contest", "stand for election", "nomination"],
    question: "How can someone become a candidate?",
    answer:
      "To contest elections, a person must file a nomination with the returning officer, pay a security deposit, and meet eligibility criteria — minimum age 25 for Lok Sabha/Vidhan Sabha, Indian citizenship, and no criminal disqualifications.",
  },
  {
    keywords: ["vvpat", "paper trail", "verification", "slip"],
    question: "What is VVPAT?",
    answer:
      "VVPAT (Voter Verifiable Paper Audit Trail) is attached to EVMs. After you press a button on the EVM, a paper slip showing your choice is displayed for 7 seconds. This allows voters to verify their vote was recorded correctly.",
  },
  {
    keywords: ["simulation", "game", "play", "election officer"],
    question: "Tell me about the simulation",
    answer:
      "The VoteVerse Simulation lets you play as an Election Officer! You'll set up a booth, verify voters, and handle real-world crisis scenarios. Your decisions affect the 'Fair Election Score'. Try it from the Simulation page!",
  },
  {
    keywords: ["voteverse", "about", "what is this", "app", "platform"],
    question: "What is VoteVerse?",
    answer:
      "VoteVerse is a futuristic platform for understanding democracy. It features an interactive Explore section with planet modules, a gamified Election Officer simulation, and this AI Assistant to answer your questions about voting and elections.",
  },
  {
    keywords: ["help", "what can you do", "commands", "options"],
    question: "What can you help me with?",
    answer:
      "I can help you understand voting processes, voter registration, EVMs, VVPATs, election types, how to find your polling booth, vote counting, and more. You can type or use the microphone to ask me anything about elections!",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    question: "Hello!",
    answer:
      "Hello! Welcome to VoteVerse AI Assistant. I'm here to help you with anything related to elections and voting. Ask me a question or tap the mic to speak!",
  },
];

const FALLBACK_RESPONSE =
  "I'm not sure about that. Try asking me about voter registration, EVMs, polling booths, vote counting, or the VoteVerse simulation!";

/**
 * Finds the best matching response by keyword scoring.
 *
 * Strategy:
 *   1. Full phrase match = big bonus (phrase length × 3)
 *   2. Exact word match = +2 per matched word
 *   3. Ignores common stop words to avoid false positives
 */
const STOP_WORDS = new Set([
  "how", "do", "i", "is", "what", "the", "a", "an", "to", "in",
  "of", "and", "can", "are", "my", "me", "tell", "about", "this",
]);

export function findResponse(input) {
  if (!input || !input.trim()) return FALLBACK_RESPONSE;

  const inputLower = input.toLowerCase().replace(/[?!.,]/g, "").trim();
  const inputWords = inputLower.split(/\s+/).filter((w) => !STOP_WORDS.has(w));

  let bestScore = 0;
  let bestAnswer = FALLBACK_RESPONSE;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    for (const keyword of entry.keywords) {
      const kwLower = keyword.toLowerCase();

      // Full phrase match — strong signal
      if (inputLower.includes(kwLower)) {
        score += kwLower.length * 3;
        continue;
      }

      // Individual word matches (exact only, no substring)
      const kwWords = kwLower.split(/\s+/).filter((w) => !STOP_WORDS.has(w));
      for (const kw of kwWords) {
        if (inputWords.some((w) => w === kw)) {
          score += 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  return bestAnswer;
}
