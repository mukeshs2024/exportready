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

  // Auto-send initial message when popup opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = {
        sender: "bot",
        text: "Hi! What help you need?"
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

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/chatbot", null, {
        params: { query: input }
      });
      const botMessage = {
        sender: "bot",
        text: response.data.response || "I'm thinking..."
      };
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
    setMessages([{ sender: "bot", text: "Hi! What help you need?" }]);
  };

  if (!isOpen) return (
    <div style={{position: "fixed", right: "2rem", bottom: "5rem", zIndex: 1999, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem"}}>
      <button
        onClick={onOpen}
        title="Open AI Advisor"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          border: "3px solid #d4af37",
          color: "white",
          fontSize: "1.8rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(15, 30, 58, 0.3)",
          transition: "all 0.3s ease",
          transform: "scale(1)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(212, 175, 55, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 30, 58, 0.3)";
        }}
      >
        🤖
      </button>
      <p style={{
        margin: 0,
        fontSize: "0.75rem",
        color: "#0f1e3a",
        fontWeight: "600",
        whiteSpace: "nowrap",
        letterSpacing: "0.5px"
      }}>
        Chat Helper
      </p>
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
      background: "#f8f9fa",
      boxShadow: "-8px 0 24px rgba(15, 30, 58, 0.2)",
      borderLeft: "2px solid #d4af37",
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
          background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
          color: "white",
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #d4af37",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none"
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800" }}>
            🤖 AI Advisor
          </h3>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", opacity: 0.9 }}>
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
            color: "white",
            fontSize: "1.5rem",
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
              ⏳ Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        borderTop: "1px solid #cbd5e1",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: "white"
      }}>
        <input
          type="text"
          placeholder="Ask for help..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "0.9rem",
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
