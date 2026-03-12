import { useState, useEffect, useRef } from "react";
import API from "../services/api";

function ExportAdvisor() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to chatbot
  const sendMessage = async () => {
    if (!userInput.trim()) {
      alert("Please enter a question");
      return;
    }

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await API.post("/chatbot", null, {
        params: { query: userInput }
      });

      const botReply = response.data.response;

      // Add bot response to chat
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
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

  return (
    <div style={{ background: "white", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.12)", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "2px solid #e2e8f0" }}>
        <h2 style={{ color: "#0f1e3a", fontSize: "1.8rem", fontWeight: "800", margin: "0 0 0.5rem 0" }}>
          <span style={{ marginRight: "0.75rem" }}>💬</span>AI Export Advisor
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: "0" }}>
          Ask me anything about export processes, documents, markets, and more!
        </p>
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
            <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>Start a conversation!</p>
            <p style={{ fontSize: "0.9rem" }}>Ask me about export documents, processes, or market opportunities.</p>
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
              }}
            >
              {msg.text}
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

      {/* Helper Text */}
      <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", margin: "0" }}>
        💡 Try asking: "What documents do I need to export rice?" or "Which countries import electronics?"
      </p>
    </div>
  );
}

export default ExportAdvisor;
