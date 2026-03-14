import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";

function ExporterOrderDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [counter, setCounter] = useState({ price: "", message: "" });

  const fetchDetail = async () => {
    setError("");
    try {
      const response = await API.get(`/exporter/orders/${id}`);
      setDetail(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load order");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const pricingRange = useMemo(() => {
    const base = Number(detail?.product?.price || 0);
    return { min: base * 0.8, max: base * 1.2 };
  }, [detail]);

  const status = detail?.order?.status || "";
  const roundCount = detail?.round_count || 0;
  const maxRounds = detail?.max_rounds || 3;
  const allowCounter = status === "negotiating" && roundCount < maxRounds;

  const updateStatus = async (action) => {
    setError("");
    setSuccess("");
    try {
      await API.post(`/orders/${id}/${action}`);
      setSuccess(`Order ${action}ed.`);
      fetchDetail();
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${action} order`);
    }
  };

  const submitCounter = async () => {
    setError("");
    setSuccess("");
    const price = Number(counter.price || 0);
    if (!price) {
      setError("Counter price is required");
      return;
    }
    if (price < pricingRange.min || price > pricingRange.max) {
      setError(`Counter must be between $${pricingRange.min.toFixed(2)} and $${pricingRange.max.toFixed(2)}`);
      return;
    }

    try {
      const exporterId = Number(localStorage.getItem("exporter_id") || 0) || 1;
      await API.post(`/orders/${id}/offers`, null, {
        params: {
          sender_id: exporterId,
          price,
          message: counter.message.trim()
        }
      });
      setSuccess("Counter offer sent.");
      setCounter({ price: "", message: "" });
      fetchDetail();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send counter offer");
    }
  };

  if (!detail) {
    return <div style={{ color: "#64748b" }}>Loading order...</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "start" }}>
      <div style={{ background: "white", borderRadius: "14px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 20px rgba(15, 30, 58, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f1e3a" }}>{detail.product?.product_name || "Order"}</h2>
            <p style={{ marginTop: "0.4rem", color: "#64748b" }}>Buyer Country: {detail.order?.delivery_country || ""}</p>
          </div>
          <div style={{ padding: "0.35rem 0.8rem", borderRadius: "999px", background: "#e2e8f0", fontWeight: 700, textTransform: "uppercase", color: "#0f1e3a", fontSize: "0.75rem" }}>
            {status}
          </div>
        </div>

        <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Offer Range</div>
            <div style={{ fontWeight: 700, color: "#0f1e3a" }}>${pricingRange.min.toFixed(2)} - ${pricingRange.max.toFixed(2)}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Quantity</div>
            <div style={{ fontWeight: 700, color: "#0f1e3a" }}>{detail.order?.quantity}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Negotiation Round</div>
            <div style={{ fontWeight: 700, color: "#0f1e3a" }}>{roundCount} / {maxRounds}</div>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ margin: "0 0 1rem", color: "#0f1e3a" }}>Negotiation Timeline</h3>
          <div style={{ display: "grid", gap: "0.9rem" }}>
            {detail.offers?.map((offer) => (
              <div key={offer.id} style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, color: "#0f1e3a" }}>
                    {offer.sender_id === detail.order?.buyer_id ? "Buyer" : "Seller"} -> ${Number(offer.price || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Round {offer.round_number}</div>
                </div>
                {offer.message && <p style={{ marginTop: "0.35rem", color: "#64748b" }}>{offer.message}</p>}
              </div>
            ))}
          </div>
        </div>

        {detail.buyer_contact ? (
          <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: "12px", background: "#ecfdf3", border: "1px solid #bbf7d0" }}>
            <h4 style={{ margin: "0 0 0.5rem", color: "#047857" }}>Buyer Contact (Unlocked)</h4>
            <div style={{ color: "#047857" }}>{detail.buyer_contact.company_name || detail.buyer_contact.name}</div>
            <div style={{ color: "#047857" }}>{detail.buyer_contact.email}</div>
            <div style={{ color: "#047857" }}>{detail.buyer_contact.phone}</div>
            <div style={{ color: "#047857" }}>{detail.buyer_contact.country}</div>
          </div>
        ) : (
          <div style={{ marginTop: "2rem", padding: "1rem", borderRadius: "12px", background: "#fff7ed", border: "1px solid #fed7aa" }}>
            <h4 style={{ margin: 0, color: "#c2410c" }}>Buyer Contact Hidden</h4>
            <p style={{ margin: "0.4rem 0 0", color: "#9a3412" }}>Contact details unlock once the order is accepted.</p>
          </div>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "14px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 20px rgba(15, 30, 58, 0.08)" }}>
        <h3 style={{ marginTop: 0, color: "#0f1e3a" }}>Actions</h3>
        {error && <Toast message={error} type="error" onClose={() => setError("")} />}
        {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

        <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            onClick={() => updateStatus("accept")}
            disabled={status !== "negotiating"}
            style={{ padding: "0.85rem 1rem", borderRadius: "10px", border: "none", background: status === "negotiating" ? "#10b981" : "#d1fae5", color: "white", fontWeight: 700, cursor: status === "negotiating" ? "pointer" : "not-allowed" }}
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus("reject")}
            disabled={status !== "negotiating"}
            style={{ padding: "0.85rem 1rem", borderRadius: "10px", border: "none", background: status === "negotiating" ? "#ef4444" : "#fee2e2", color: "white", fontWeight: 700, cursor: status === "negotiating" ? "pointer" : "not-allowed" }}
          >
            Reject
          </button>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.5rem", color: "#0f1e3a" }}>Counter Offer</h4>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            <input
              type="number"
              value={counter.price}
              onChange={(e) => setCounter((prev) => ({ ...prev, price: e.target.value }))}
              placeholder={`Offer between ${pricingRange.min.toFixed(2)} and ${pricingRange.max.toFixed(2)}`}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
            />
            <textarea
              value={counter.message}
              onChange={(e) => setCounter((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Message to buyer"
              rows={3}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", resize: "vertical" }}
            />
            <button
              onClick={submitCounter}
              disabled={!allowCounter}
              style={{ padding: "0.85rem 1rem", borderRadius: "10px", border: "none", background: allowCounter ? "#0f1e3a" : "#e2e8f0", color: allowCounter ? "white" : "#94a3b8", fontWeight: 700, cursor: allowCounter ? "pointer" : "not-allowed" }}
            >
              {allowCounter ? "Send Counter" : "Counter Disabled"}
            </button>
          </div>
        </div>

        {roundCount >= maxRounds && status === "negotiating" && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "12px", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <h4 style={{ margin: "0 0 0.4rem", color: "#1d4ed8" }}>Negotiation Limit Reached</h4>
            <p style={{ margin: 0, color: "#1e40af" }}>Open direct chat to continue the discussion.</p>
            <button
              style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", borderRadius: "10px", border: "none", background: "#1d4ed8", color: "white", fontWeight: 700, cursor: "pointer" }}
            >
              Open Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExporterOrderDetail;