import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function AIPopup({ isOpen, onClose, onOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Which countries import cotton shirts?",
    "What documents are needed for UAE export?",
    "Estimate profit exporting spices",
    "How to get IEC license?",
    "/scan-opportunity turmeric",
  ]);

  const getSessionId = () => {
    try {
      const existing = localStorage.getItem("exportready_ai_session");
      if (existing) return existing;
      const newId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      localStorage.setItem("exportready_ai_session", newId);
      return newId;
    } catch {
      return `session_${Date.now()}`;
    }
  };

  if (!sessionIdRef.current) {
    sessionIdRef.current = getSessionId();
  }

  // Auto-send initial message when popup opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = {
        sender: "bot",
        text: "Hello. How can I help with exporting today?"
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, messages.length]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride = "") => {
    const messageText = (textOverride || input).trim();
    if (!messageText) return;

    const userMessage = { sender: "user", text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/export-chat", null, {
        params: {
          question: messageText,
          session_id: sessionIdRef.current,
        }
      });
      const data = response.data || {};
      const botMessage = {
        sender: "bot",
        text: data.response || "Here is a structured export advisory response.",
        cards: data.cards || {},
        confidence: data.confidence,
        sources: data.sources || [],
      };
      if (Array.isArray(data.suggested_questions) && data.suggested_questions.length > 0) {
        setSuggestedQuestions(data.suggested_questions);
      }
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't process that. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ sender: "bot", text: "Hello. How can I help with exporting today?" }]);
  };

  const renderConfidence = (confidence) => {
    if (typeof confidence !== "number") return null;
    const percentage = Math.round(confidence * 100);
    return (
      <div style={{ marginTop: "0.55rem" }}>
        <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.3rem" }}>
          Answer Confidence: {percentage}%
        </div>
        <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ width: `${percentage}%`, height: "100%", background: "#0f1e3a" }} />
        </div>
      </div>
    );
  };

  const renderCards = (cards = {}) => {
    if (!cards || Object.keys(cards).length === 0) return null;

    return (
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
        {cards.market_insight && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.7rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginBottom: "0.2rem" }}>Market Insight</div>
            <div style={{ fontSize: "0.85rem", color: "#0f1e3a" }}>{cards.market_insight}</div>
          </div>
        )}

        {Array.isArray(cards.required_documents) && cards.required_documents.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.7rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginBottom: "0.2rem" }}>Required Documents</div>
            <ul style={{ margin: 0, paddingLeft: "1rem", color: "#0f1e3a", fontSize: "0.85rem" }}>
              {cards.required_documents.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {cards.profit_estimate && Object.keys(cards.profit_estimate).length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.7rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginBottom: "0.2rem" }}>Profit Estimate</div>
            <div style={{ fontSize: "0.85rem", color: "#0f1e3a" }}>
              {cards.profit_estimate.estimated_margin && (
                <div>Estimated margin: {cards.profit_estimate.estimated_margin}</div>
              )}
              {cards.profit_estimate.shipping_cost && (
                <div>Shipping cost: {cards.profit_estimate.shipping_cost}</div>
              )}
            </div>
          </div>
        )}

        {Array.isArray(cards.next_steps) && cards.next_steps.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.7rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginBottom: "0.2rem" }}>Next Steps</div>
            <ol style={{ margin: 0, paddingLeft: "1.1rem", color: "#0f1e3a", fontSize: "0.85rem" }}>
              {cards.next_steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {Array.isArray(cards.market_opportunities) && cards.market_opportunities.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.7rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, marginBottom: "0.2rem" }}>Market Opportunities</div>
            <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem", color: "#0f1e3a" }}>
              {cards.market_opportunities.map((item) => (
                <div key={`${item.rank}-${item.country}`}>
                  {item.rank}. {item.country}{item.demand_score ? ` (Demand Score: ${item.demand_score})` : ""}
                  {item.market_size ? `, Import Value: ${item.market_size}` : ""}
                </div>
              ))}
            </div>
          </div>
        )}

        {cards.safety_notice && (
          <div style={{ border: "1px solid #fecaca", borderRadius: "10px", padding: "0.7rem", background: "#fef2f2", color: "#b91c1c", fontSize: "0.8rem" }}>
            {cards.safety_notice}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return (
    <div style={{position: "fixed", right: "2rem", bottom: "2rem", zIndex: 1999, display: "flex", alignItems: "center", gap: "0.75rem"}}>
      <button
        onClick={onOpen}
        title="Open AI Advisor"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#FFFFFF",
          border: "2px solid #F5A623",
          color: "#0F172A",
          fontSize: "1.2rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transition: "all 0.2s ease",
          transform: "scale(1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        }}
      >
        AI
      </button>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: "-6px", right: "-6px", width: "16px", height: "16px", borderRadius: "50%", background: "#FF4848", color: "white", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "JetBrains Mono, monospace" }}>
          3
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <div style={{ fontSize: "12px", color: "#0F172A", fontWeight: 600, whiteSpace: "nowrap" }}>
          AI Export Advisor
        </div>
        <div style={{ fontSize: "11px", color: "#94A3B8", whiteSpace: "nowrap" }}>
          Ask anything about exporting
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      right: isOpen ? "auto" : 0,
      bottom: isOpen ? "auto" : 0,
      left: isOpen ? `${position.x}px` : "auto",
      top: isOpen ? `${position.y}px` : "auto",
      width: "25vw",
      height: "75vh",
      background: "#FFFFFF",
      boxShadow: "-12px 0 32px rgba(0, 0, 0, 0.12)",
      borderLeft: "2px solid #F5A623",
      display: "flex",
      flexDirection: "column",
      zIndex: 2000,
      borderRadius: "0",
      transition: isDragging ? "none" : "all 0.3s ease"
    }}>
      {/* Header */}
      <div 
        onMouseDown={handleMouseDown}
        style={{
          background: "#FFFFFF",
          color: "#0F172A",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E6ECF3",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none"
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "800" }}>
            AI Advisor
          </h3>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#94A3B8" }}>
            Global Trade Helper
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#0F172A",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "0",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
          onMouseLeave={(e) => e.currentTarget.style.color = "white"}
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "linear-gradient(135deg, #f8f9fa 0%, #f0f3f7 100%)"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              animation: "slideUp 0.3s ease forwards"
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.875rem 1rem",
                borderRadius: "10px",
                background: msg.sender === "user"
                  ? "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)"
                  : "#e2e8f0",
                color: msg.sender === "user" ? "white" : "#1a202c",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                wordWrap: "break-word"
              }}
            >
              {msg.text}
              {msg.sender === "bot" && renderConfidence(msg.confidence)}
              {msg.sender === "bot" && renderCards(msg.cards)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "0.875rem 1rem",
                borderRadius: "10px",
                background: "#e2e8f0",
                color: "#1a202c",
                fontStyle: "italic",
                animation: "blink 1.5s infinite"
              }}
            >
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: "1px solid #cbd5e1",
        padding: "1.2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        background: "white"
      }}>
        <input
          type="text"
          placeholder="Ask for help..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            padding: "0.7rem",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontFamily: "inherit",
            outline: "none",
            transition: "border-color 0.2s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = "#d4af37"}
          onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleSendMessage}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              opacity: loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Send
          </button>
          <button
            onClick={handleClearChat}
            style={{
              padding: "0.75rem 1rem",
              background: "#e2e8f0",
              color: "#1a202c",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#cbd5e1"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#e2e8f0"}
          >
            Clear
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.3px" }}>
            Try asking
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={`${q}-${idx}`}
                onClick={() => handleSendMessage(q)}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "999px",
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.72rem",
                  color: "#0f1e3a",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

export default AIPopup;
