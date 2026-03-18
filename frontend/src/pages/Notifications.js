import React, { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

export default function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: "task",
      title: "Complete Export Compliance Check",
      description: "Your export documents need compliance verification",
      time: "2 hours ago",
      read: false,
      icon: <AlertCircle size={20} />,
      color: "#FF6B6B"
    },
    {
      id: 2,
      type: "success",
      title: "Document Ready",
      description: "Your Commercial Invoice has been generated successfully",
      time: "4 hours ago",
      read: false,
      icon: <CheckCircle size={20} />,
      color: "#10B981"
    },
    {
      id: 3,
      type: "info",
      title: "Market Opportunity",
      description: "New export opportunity in Germany for your product",
      time: "1 day ago",
      read: true,
      icon: <Bell size={20} />,
      color: "#2F6BFF"
    },
    {
      id: 4,
      type: "pending",
      title: "Pending Action Required",
      description: "Buyer order #5234 requires confirmation",
      time: "2 days ago",
      read: true,
      icon: <Clock size={20} />,
      color: "#F5A623"
    },
    {
      id: 5,
      type: "document",
      title: "Document Template Updated",
      description: "New packing list template is available",
      time: "3 days ago",
      read: true,
      icon: <FileText size={20} />,
      color: "#7C3AED"
    }
  ]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--aurora-text)", margin: 0 }}>
          Notifications
        </h1>
        <p style={{ color: "var(--aurora-text-secondary)", margin: "0.5rem 0 0" }}>
          Stay updated on your export operations
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              background: "var(--aurora-card)",
              border: `1px solid var(--aurora-border)`,
              borderLeft: `4px solid ${notif.color}`,
              borderRadius: "12px",
              padding: "1.25rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              transition: "all 0.2s ease",
              opacity: notif.read ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${notif.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: notif.color,
                flexShrink: 0
              }}
            >
              {notif.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--aurora-text)",
                    margin: "0 0 0.25rem 0"
                  }}>
                    {notif.title}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    color: "var(--aurora-text-secondary)",
                    margin: "0 0 0.5rem 0"
                  }}>
                    {notif.description}
                  </p>
                  <span style={{
                    fontSize: "12px",
                    color: "var(--aurora-text-muted)"
                  }}>
                    {notif.time}
                  </span>
                </div>
                {!notif.read && (
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--aurora-blue)",
                    marginTop: "0.5rem"
                  }} />
                )}
              </div>

              {/* Action buttons for unread notifications */}
              {!notif.read && (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <button style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    background: "var(--aurora-blue)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "opacity 0.2s"
                  }} onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                     onMouseLeave={(e) => e.target.style.opacity = "1"}>
                    Take Action
                  </button>
                  <button style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    background: "transparent",
                    color: "var(--aurora-text-secondary)",
                    border: "1px solid var(--aurora-border)",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.2s"
                  }} onMouseEnter={(e) => {
                    e.target.style.background = "var(--aurora-hover)";
                  }} onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}>
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          background: "var(--aurora-card)",
          borderRadius: "12px",
          border: "1px solid var(--aurora-border)"
        }}>
          <Bell size={32} style={{ color: "var(--aurora-text-muted)", marginBottom: "1rem", opacity: 0.5 }} />
          <h3 style={{ color: "var(--aurora-text)", fontSize: "16px", fontWeight: 600 }}>
            No notifications
          </h3>
          <p style={{ color: "var(--aurora-text-secondary)", fontSize: "14px" }}>
            You're all caught up!
          </p>
        </div>
      )}
    </div>
  );
}
