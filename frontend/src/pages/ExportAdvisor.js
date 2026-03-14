import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function ExportAdvisor() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Which countries import cotton shirts?",
    "What documents are needed for UAE export?",
    "Estimate profit exporting spices",
    "How to get IEC license?",
    "/scan-opportunity turmeric",
  ]);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef("");

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

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to chatbot
  const sendMessage = async (textOverride = "") => {
    const messageText = (textOverride || userInput).trim();
    if (!messageText) {
      alert("Please enter a question");
      return;
    }

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: messageText }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await API.post("/export-chat", null, {
        params: {
          question: messageText,
          product: selectedProduct,
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

      setMessages([...newMessages, botMessage]);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Sorry, I couldn't process your question. Please try again.";
      setMessages([...newMessages, { sender: "bot", text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setUserInput("");
  };

  const renderConfidence = (confidence) => {
    if (typeof confidence !== "number") return null;
    const percentage = Math.round(confidence * 100);
    return (
      <div style={{ marginTop: "0.65rem" }}>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.35rem" }}>
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
      <div style={{ marginTop: "0.9rem", display: "grid", gap: "0.65rem" }}>
        {cards.market_insight && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.8rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>Market Insight</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a" }}>{cards.market_insight}</div>
          </div>
        )}

        {Array.isArray(cards.required_documents) && cards.required_documents.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.8rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>Required Documents</div>
            <ul style={{ margin: 0, paddingLeft: "1rem", color: "#0f1e3a", fontSize: "0.9rem" }}>
              {cards.required_documents.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {cards.profit_estimate && Object.keys(cards.profit_estimate).length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.8rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>Profit Estimate</div>
            <div style={{ fontSize: "0.9rem", color: "#0f1e3a" }}>
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
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.8rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>Next Steps</div>
            <ol style={{ margin: 0, paddingLeft: "1.1rem", color: "#0f1e3a", fontSize: "0.9rem" }}>
              {cards.next_steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {Array.isArray(cards.market_opportunities) && cards.market_opportunities.length > 0 && (
          <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.8rem", background: "#ffffff" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.25rem" }}>Market Opportunities</div>
            <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.9rem", color: "#0f1e3a" }}>
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
          <div style={{ border: "1px solid #fecaca", borderRadius: "10px", padding: "0.8rem", background: "#fef2f2", color: "#b91c1c", fontSize: "0.85rem" }}>
            {cards.safety_notice}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", maxWidth: "900px" }}>
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "2px solid #e2e8f0" }}>
        <h2 style={{ color: "#0f1e3a", fontSize: "1.8rem", fontWeight: "800", margin: "0 0 0.5rem 0" }}>
          AI Export Advisor
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0 0 1rem 0" }}>
          Ask me anything about export processes, documents, markets, and more!
        </p>

        {/* Product context input */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Your Product:
          </span>
          <input
            type="text"
            placeholder="e.g., Basmati Rice   (leave blank for general advice)"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              flex: 1, border: "none", background: "transparent", fontSize: "0.88rem",
              fontFamily: "inherit", outline: "none", color: "#0f1e3a", fontWeight: "600",
            }}
          />
          {selectedProduct.trim() && (
            <span style={{
              background: "#7c3aed", color: "white", borderRadius: "12px",
              padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: "700", whiteSpace: "nowrap"
            }}>
              AI Mode
            </span>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1.5rem",
          padding: "1.5rem",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "2rem" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>Hello! I am the ExportReady AI Advisor.</p>
            {selectedProduct.trim() ? (
              <p style={{ fontSize: "0.9rem", lineHeight: "1.8", color: "#7c3aed" }}>
                AI Mode active for: <strong>{selectedProduct}</strong><br />
                I'll give product-specific advice on markets, tariffs, timing &amp; compliance.
              </p>
            ) : (
              <p style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                I can help you with:<br />
                • Export documents<br />
                • Export process steps<br />
                • Export markets<br />
                • Platform features<br />
                <span style={{ color: "#7c3aed", fontWeight: "600" }}>
                  Enter your product above to unlock AI-powered advice
                </span>
              </p>
            )}
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "1rem 1.25rem",
                borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.sender === "user" ? "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)" : "#e2e8f0",
                color: msg.sender === "user" ? "white" : "#0f1e3a",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {typeof msg.text === "string"
                ? msg.text
                : JSON.stringify(msg.text)}
              {msg.sender === "bot" && renderConfidence(msg.confidence)}
              {msg.sender === "bot" && renderCards(msg.cards)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "18px 18px 18px 4px",
                background: "#e2e8f0",
                color: "#0f1e3a",
              }}
            >
              <span style={{ animation: "blink 1.4s infinite" }}>
                ⏳ Thinking
              </span>
              <style>{`
                @keyframes blink {
                  0%, 20%, 50%, 80%, 100% { opacity: 1; }
                  40% { opacity: 0.5; }
                  60% { opacity: 0.7; }
                }
              `}</style>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Ask the AI Export Advisor..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.875rem 1rem",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            backgroundColor: loading ? "#f8f9fa" : "white",
            cursor: loading ? "not-allowed" : "text",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#d4af37";
            e.target.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.boxShadow = "none";
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !userInput.trim()}
          style={{
            padding: "0.875rem 1.5rem",
            background: loading || !userInput.trim() ? "#cbd5e1" : "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading || !userInput.trim() ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!loading && userInput.trim()) {
              e.currentTarget.style.background = "linear-gradient(135deg, #1a2f5a 0%, #2a3f6a 100%)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 30, 58, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && userInput.trim()) {
              e.currentTarget.style.background = "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          Send
        </button>

        <button
          onClick={clearChat}
          disabled={messages.length === 0}
          style={{
            padding: "0.875rem 1rem",
            background: messages.length === 0 ? "#cbd5e1" : "#64748b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: messages.length === 0 ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (messages.length > 0) {
              e.currentTarget.style.background = "#475569";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 30, 58, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (messages.length > 0) {
              e.currentTarget.style.background = "#64748b";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.3px" }}>
          Try asking
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={`${q}-${idx}`}
              onClick={() => sendMessage(q)}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "999px",
                padding: "0.45rem 0.85rem",
                fontSize: "0.8rem",
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

      {/* Helper Text */}
      <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", margin: "0" }}>
        {selectedProduct.trim()
          ? `💡 AI Mode: Ask about markets, tariffs, timing, or compliance for "${selectedProduct}"`
          : `💡 Try: "What documents do I need to export rice?" • "Which countries import electronics?"`
        }
      </p>
    </div>
  );
}

export default ExportAdvisor;
