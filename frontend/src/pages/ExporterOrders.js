import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";

function ExporterOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const exporterId = Number(localStorage.getItem("exporter_id") || 0) || 1;
      const response = await API.get("/exporter/orders", { params: { exporter_id: exporterId } });
      setOrders(response.data?.items || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusPill = (status) => {
    const palette = {
      pending: "#f59e0b",
      negotiating: "#3b82f6",
      accepted: "#10b981",
      rejected: "#ef4444"
    };
    return (
      <span style={{ padding: "0.25rem 0.6rem", borderRadius: "999px", background: palette[status] || "#94a3b8", color: "white", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f1e3a", fontWeight: 800 }}>Exporter Orders</h2>
          <p style={{ marginTop: "0.4rem", color: "#64748b" }}>Manage negotiations and buyer offers.</p>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
      {loading && <div style={{ color: "#64748b" }}>Loading orders...</div>}

      {!loading && orders.length === 0 && (
        <div style={{ padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b" }}>
          No orders yet. Buyer offers will appear here.
        </div>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {orders.map((order) => {
          const product = order.product || {};
          const lastOffer = order.last_offer || {};
          const roundLabel = `${order.round_count || 0} / ${order.max_rounds || 3}`;
          const hasNew = lastOffer?.sender_id && lastOffer.sender_id !== Number(localStorage.getItem("exporter_id") || 0) && order.status === "negotiating";

          return (
            <div key={order.order_id} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <h3 style={{ margin: 0, color: "#0f1e3a" }}>{product.product_name || "Product"}</h3>
                  {statusPill(order.status)}
                  {hasNew && (
                    <span style={{ background: "#f97316", color: "white", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                      New Offer
                    </span>
                  )}
                </div>
                <p style={{ margin: "0.4rem 0", color: "#64748b" }}>Buyer Country: {order.delivery_country || ""}</p>
                <p style={{ margin: 0, color: "#64748b" }}>Offer Price: ${Number(lastOffer.price || 0).toFixed(2)} | Quantity: {order.quantity}</p>
                <p style={{ marginTop: "0.35rem", color: "#94a3b8", fontSize: "0.85rem" }}>Negotiation Round: {roundLabel}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <button
                  onClick={() => navigate(`/exporter/orders/${order.order_id}`)}
                  style={{ padding: "0.75rem 1.1rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)", color: "white", fontWeight: 700, cursor: "pointer" }}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExporterOrders;