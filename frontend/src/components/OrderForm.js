const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0",
  borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit",
};
const labelStyle = {
  display: "block", fontWeight: "600", color: "#1a202c",
  marginBottom: "0.4rem", fontSize: "0.8rem",
};

function OrderForm({ order, onChange }) {
  const set = (field, isNum) => (e) => {
    const val = isNum ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
    onChange({ ...order, [field]: val });
  };

  return (
    <div style={{ background: "#eff6ff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #bfdbfe", borderLeft: "4px solid #2563eb" }}>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>Order Details</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Product Name *</label>
          <input style={inputStyle} placeholder="e.g., Basmati Rice" value={order.productName || ""} onChange={set("productName")} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <input style={inputStyle} placeholder="e.g., Agricultural" value={order.category || ""} onChange={set("category")} />
        </div>
        <div>
          <label style={labelStyle}>HS Code</label>
          <input style={inputStyle} placeholder="e.g., 1006.30" value={order.hsCode || ""} onChange={set("hsCode")} />
        </div>
        <div>
          <label style={labelStyle}>Quantity *</label>
          <input style={inputStyle} type="number" min="1" placeholder="e.g., 10000" value={order.quantity ?? ""} onChange={set("quantity", true)} />
        </div>
        <div>
          <label style={labelStyle}>Unit</label>
          <input style={inputStyle} placeholder="e.g., kg, pcs" value={order.unit || ""} onChange={set("unit")} />
        </div>
        <div>
          <label style={labelStyle}>Unit Price (USD) *</label>
          <input style={inputStyle} type="number" min="0" step="0.01" placeholder="e.g., 1.25" value={order.unitPrice ?? ""} onChange={set("unitPrice", true)} />
        </div>
        <div>
          <label style={labelStyle}>Total Value (USD)</label>
          <input style={{ ...inputStyle, background: "#f1f5f9" }} readOnly value={order.quantity && order.unitPrice ? (order.quantity * order.unitPrice).toFixed(2) : ""} />
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
