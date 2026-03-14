import { useEffect, useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

function ExporterDashboard() {
  const [summary, setSummary] = useState({
    total_products: 0,
    active_negotiations: 0,
    pending_orders: 0,
    accepted_orders: 0
  });
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setError("");
      try {
        const exporterId = Number(localStorage.getItem("exporter_id") || 0) || 1;
        const response = await API.get("/exporter/dashboard", { params: { exporter_id: exporterId } });
        setSummary(response.data?.summary || summary);
        setActivity(response.data?.recent_activity || []);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load exporter dashboard");
      }
    };
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, color: "#0f1e3a", fontWeight: 800 }}>Exporter Dashboard</h2>
        <p style={{ marginTop: "0.4rem", color: "#64748b" }}>Track products, negotiations, and buyer activity.</p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Products", value: summary.total_products },
          { label: "Active Negotiations", value: summary.active_negotiations },
          { label: "Pending Orders", value: summary.pending_orders },
          { label: "Accepted Orders", value: summary.accepted_orders }
        ].map((card) => (
          <div key={card.label} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 8px 16px rgba(15, 30, 58, 0.06)" }}>
            <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{card.label}</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f1e3a", marginTop: "0.4rem" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem", background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
        <h3 style={{ marginTop: 0, color: "#0f1e3a" }}>Recent Activity</h3>
        {activity.length === 0 ? (
          <div style={{ color: "#64748b" }}>No recent activity yet.</div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            {activity.map((note) => (
              <div key={note.id} style={{ padding: "0.85rem 1rem", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: 700, color: "#0f1e3a" }}>{note.message}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem" }}>{note.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExporterDashboard;