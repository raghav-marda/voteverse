import { useState, useRef, useEffect, useCallback } from "react";
import { findResponse, KNOWLEDGE_BASE } from "../components/assistant/AssistantData";
import useSpeechRecognition from "../components/assistant/useSpeechRecognition";
import useSpeechSynthesis from "../components/assistant/useSpeechSynthesis";
import { useBadges, BADGES } from "../components/BadgeContext";
import "../styles/assistant.css";

/* Suggested quick questions */
const SUGGESTIONS = [
  "How do I vote?",
  "What is an EVM?",
  "What is VVPAT?",
  "Tell me about the simulation",
];

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const firstMsgSent = useRef(false);

  const { award } = useBadges();

  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();

  /* Auto-scroll to latest message */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* When speech recognition gives a final transcript, auto-send */
  const prevTranscript = useRef("");
  useEffect(() => {
    if (
      recognition.transcript &&
      recognition.transcript !== prevTranscript.current &&
      !recognition.listening
    ) {
      prevTranscript.current = recognition.transcript;
      handleSend(recognition.transcript);
    }
  }, [recognition.transcript, recognition.listening]);

  /* ── Send Message ──────────────────────────────── */
  const handleSend = useCallback(
    (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed) return;

      // Add user message
      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");
      setIsTyping(true);

      // Simulate brief thinking delay for natural feel
      setTimeout(() => {
        const response = findResponse(trimmed);
        setMessages((prev) => [...prev, { role: "bot", text: response }]);
        setIsTyping(false);

        // Award badge on first question
        if (!firstMsgSent.current) {
          firstMsgSent.current = true;
          setTimeout(() => award(BADGES.FIRST_VOTER), 1000);
        }

        // Auto-speak the response
        if (synthesis.supported) {
          synthesis.speak(response);
        }
      }, 600);
    },
    [input, synthesis, award]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = () => {
    if (recognition.listening) {
      recognition.stop();
    } else {
      synthesis.cancel(); // stop any speaking
      recognition.start();
    }
  };

  const handleSuggestion = (text) => {
    handleSend(text);
  };

  /* ── Render ────────────────────────────────────── */
  return (
    <div className="assistant-page">
      {/* Header */}
      <div className="assistant-header">
        <h1>🤖 AI Assistant</h1>
        <p>Ask anything about elections — type or speak</p>
      </div>

      {/* Chat */}
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="welcome-card">
            <span className="welcome-icon">💬</span>
            <div className="welcome-title">Start a conversation</div>
            <div className="welcome-desc">
              Ask me about voting, elections, EVMs, or the VoteVerse platform.
              Use the microphone for voice input.
            </div>
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.role} ${
              msg.role === "bot" && synthesis.speaking && i === messages.length - 1
                ? "speaking"
                : ""
            }`}
          >
            <div className="msg-label">
              {msg.role === "user" ? "You" : "VoteVerse AI"}
              {msg.role === "bot" &&
                synthesis.speaking &&
                i === messages.length - 1 && (
                  <span className="speaker-icon">🔊</span>
                )}
            </div>
            {msg.text}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="msg bot">
            <div className="msg-label">VoteVerse AI</div>
            <div className="typing-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Listening indicator */}
        {recognition.listening && (
          <div className="listening-indicator">
            <div className="listening-text">
              <div className="listening-bars">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              Listening…
            </div>
            {recognition.transcript && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#8888a0",
                  marginTop: "0.4rem",
                  fontStyle: "italic",
                }}
              >
                "{recognition.transcript}"
              </p>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        {recognition.supported && (
          <button
            className={`mic-btn ${recognition.listening ? "listening" : ""}`}
            onClick={handleMicToggle}
            aria-label={recognition.listening ? "Stop listening" : "Start voice input"}
          >
            {recognition.listening ? "⏹" : "🎤"}
          </button>
        )}

        <input
          className="text-input"
          type="text"
          placeholder={
            recognition.listening
              ? "Listening…"
              : "Type your question…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={recognition.listening}
        />

        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || recognition.listening}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;
