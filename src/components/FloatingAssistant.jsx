import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { findResponse } from "./assistant/AssistantData";
import { CONFUSED_TOPICS } from "./assistant/ConfusedData";
import useSpeechRecognition from "./assistant/useSpeechRecognition";
import useSpeechSynthesis from "./assistant/useSpeechSynthesis";
import { haptic } from "../utils/haptics";
import "../styles/floating-assistant.css";

/**
 * Persistent floating AI assistant available on all pages.
 * Includes:
 *  - Mini chat panel (text + voice)
 *  - "I'm Confused" quick-help panel
 *  - Page transition glow trail
 */
function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [confusedOpen, setConfusedOpen] = useState(false);
  const [activeConfused, setActiveConfused] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Page transition glow trail
  useEffect(() => {
    setShowGlow(true);
    const timer = setTimeout(() => setShowGlow(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Speech recognition auto-send
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

  /* ── Send Message ──────────────────────────── */
  const handleSend = useCallback(
    (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");

      setTimeout(() => {
        const response = findResponse(trimmed);
        setMessages((prev) => [...prev, { role: "bot", text: response }]);
        if (synthesis.supported) synthesis.speak(response);
      }, 400);
    },
    [input, synthesis, navigate]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const togglePanel = () => {
    haptic();
    setOpen((prev) => !prev);
    setConfusedOpen(false);
  };

  const toggleConfused = () => {
    haptic();
    setConfusedOpen((prev) => !prev);
    setOpen(false);
    setActiveConfused(null);
  };

  const toggleConfusedItem = (idx) => {
    haptic(5);
    setActiveConfused((prev) => (prev === idx ? null : idx));
  };

  const handleMicToggle = () => {
    haptic();
    if (recognition.listening) {
      recognition.stop();
    } else {
      synthesis.cancel();
      recognition.start();
    }
  };

  // Hide on AI Assistant page (full page already has it)
  const onAssistantPage = location.pathname === "/ai-assistant";

  return (
    <>
      {/* Page transition glow */}
      {showGlow && <div className="page-glow-trail" />}

      {/* "I'm Confused" button */}
      {!onAssistantPage && (
        <button className="fab-confused-btn" onClick={toggleConfused}>
          🤔 I'm Confused
        </button>
      )}

      {/* Confused panel */}
      {confusedOpen && (
        <div className="confused-panel">
          <div className="confused-header">
            <h3>🤔 Quick Help</h3>
            <p>Tap a topic for a simple explanation</p>
          </div>
          <div className="confused-list">
            {CONFUSED_TOPICS.map((topic, i) => (
              <div key={i}>
                <button
                  className={`confused-item ${activeConfused === i ? "active" : ""}`}
                  onClick={() => toggleConfusedItem(i)}
                >
                  {topic.label}
                </button>
                {activeConfused === i && (
                  <div className="confused-answer">{topic.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating assistant button */}
      {!onAssistantPage && (
        <button className={`fab-assistant ${open ? "open" : ""}`} onClick={togglePanel}>
          {open ? "✕" : "🤖"}
        </button>
      )}

      {/* Mini chat panel */}
      {open && !onAssistantPage && (
        <div className="fab-panel">
          <div className="fab-panel-header">
            <span className="fab-panel-title">🤖 VoteVerse AI</span>
            <span
              className="fab-expand-link"
              onClick={() => { setOpen(false); navigate("/ai-assistant"); }}
            >
              Open Full →
            </span>
          </div>

          <div className="fab-messages">
            {messages.length === 0 && (
              <div className="fab-welcome">
                <span className="fab-welcome-icon">💬</span>
                Ask anything about elections — type or speak!
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`fab-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="fab-input-area">
            {recognition.supported && (
              <button
                className={`fab-mic-btn ${recognition.listening ? "listening" : ""}`}
                onClick={handleMicToggle}
              >
                {recognition.listening ? "⏹" : "🎤"}
              </button>
            )}
            <input
              className="fab-text-input"
              type="text"
              placeholder={recognition.listening ? "Listening…" : "Ask a question…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={recognition.listening}
            />
            <button
              className="fab-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingAssistant;
