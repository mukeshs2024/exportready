import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    quantity: "",
    offerPrice: "",
    deliveryCountry: "",
    message: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await API.get(`/marketplace/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const pricingRange = useMemo(() => {
    const base = Number(product?.price || 0);
    return {
      min: base * 0.8,
      max: base * 1.2
    };
  }, [product]);

  const estimatedValue = useMemo(() => {
    const qty = Number(form.quantity || 0);
    const price = Number(form.offerPrice || 0);
    if (!qty || !price) return 0;
    return qty * price;
  }, [form]);

  const setField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const submitOrder = async () => {
    if (!product) return;
    setError("");
    setSuccess("");

    const quantity = Number(form.quantity || 0);
    const offerPrice = Number(form.offerPrice || 0);
    const minOrder = Number(product.minimum_order_quantity || 0);

    if (quantity < minOrder) {
      setError(`Quantity must be at least ${minOrder}`);
      return;
    }

    if (offerPrice < pricingRange.min || offerPrice > pricingRange.max) {
      setError(`Offer must be between $${pricingRange.min.toFixed(2)} and $${pricingRange.max.toFixed(2)}`);
      return;
    }

    if (!form.deliveryCountry.trim()) {
      setError("Delivery country is required");
      return;
    }

    try {
      const buyerId = Number(localStorage.getItem("buyer_id") || 0) || 1;
      const response = await API.post("/orders", null, {
        params: {
          product_id: product.product_id,
          buyer_id: buyerId,
          quantity,
          offer_price: offerPrice,
          delivery_country: form.deliveryCountry.trim(),
          message: form.message.trim()
        }
      });
      const createdId = response.data?.order?.id;
      setSuccess("Order submitted. Negotiation started with exporter.");
      setForm({ quantity: "", offerPrice: "", deliveryCountry: "", message: "" });
      if (createdId) {
        setTimeout(() => navigate(`/buyer/orders/${createdId}`), 800);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order");
    }
  };

  if (loading) {
    return <div style={{ color: "#4a5568" }}>Loading product...</div>;
  }

  if (!product) {
    return <div style={{ color: "#4a5568" }}>Product not found.</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "start" }}>
      <div style={{ background: "white", borderRadius: "14px", padding: "2rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 20px rgba(15, 30, 58, 0.08)" }}>
        <div style={{ height: "260px", borderRadius: "14px", background: "linear-gradient(135deg, #f3f6ff 0%, #eef2f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 700, overflow: "hidden" }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            "Product Image"
          )}
        </div>
        <h2 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1.7rem", color: "#0f1e3a" }}>{product.product_name}</h2>
        <p style={{ margin: 0, color: "#64748b" }}>{product.category || "Category not specified"}</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Exporter</div>
            <div style={{ fontWeight: 700, color: "#0f1e3a" }}>{product.exporter_company || product.exporter_name || "Unknown"}</div>
            <div style={{ color: "#64748b" }}>{product.exporter_country || ""}</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Price per unit</div>
            <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f1e3a" }}>${Number(product.price || 0).toFixed(2)}</div>
            <div style={{ color: "#64748b" }}>MOQ: {product.minimum_order_quantity || "-"}</div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.5rem", color: "#0f1e3a" }}>Description</h4>
          <p style={{ margin: 0, color: "#4a5568", lineHeight: 1.6 }}>{product.description || "No description provided."}</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 20px rgba(15, 30, 58, 0.08)" }}>
        <h3 style={{ marginTop: 0, color: "#0f1e3a" }}>Place Order / Negotiate</h3>
        <p style={{ marginTop: "0.35rem", color: "#64748b" }}>
          Allowed Range: ${pricingRange.min.toFixed(2)} - ${pricingRange.max.toFixed(2)}
        </p>

        {error && <Toast message={error} type="error" onClose={() => setError("")} />}
        {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

        <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={setField("quantity")}
              placeholder={`Minimum ${product.minimum_order_quantity || 0}`}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Offer Price (USD)</label>
            <input
              type="number"
              value={form.offerPrice}
              onChange={setField("offerPrice")}
              placeholder="Your offer per unit"
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Delivery Country</label>
            <input
              value={form.deliveryCountry}
              onChange={setField("deliveryCountry")}
              placeholder="Destination country"
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a202c" }}>Message (optional)</label>
            <textarea
              value={form.message}
              onChange={setField("message")}
              placeholder="Share timeline, specs, or payment terms"
              rows={3}
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid #e2e8f0", resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "1rem", padding: "0.85rem 1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", fontWeight: 600, color: "#0f1e3a" }}>
          Estimated Value: ${estimatedValue.toFixed(2)}
        </div>

        <button
          onClick={submitOrder}
          style={{
            marginTop: "1.25rem",
            width: "100%",
            padding: "0.95rem 1.2rem",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Submit Offer
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;