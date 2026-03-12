import { useState } from "react";

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0",
  borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit",
  transition: "border-color 0.2s",
};
const labelStyle = {
  display: "block", fontWeight: "600", color: "#1a202c",
  marginBottom: "0.4rem", fontSize: "0.8rem",
};

function BuyerForm({ buyer, onChange }) {
  const set = (field) => (e) => onChange({ ...buyer, [field]: e.target.value });

  return (
    <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "10px", border: "1px solid #d1fae5", borderLeft: "4px solid #16a34a" }}>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>Buyer / Consignee Details</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Buyer Name *</label>
          <input style={inputStyle} placeholder="Company name" value={buyer.buyerName || ""} onChange={set("buyerName")} />
        </div>
        <div>
          <label style={labelStyle}>Contact Person</label>
          <input style={inputStyle} placeholder="Full name" value={buyer.contactPerson || ""} onChange={set("contactPerson")} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Address *</label>
          <input style={inputStyle} placeholder="Full address" value={buyer.buyerAddress || ""} onChange={set("buyerAddress")} />
        </div>
        <div>
          <label style={labelStyle}>Country *</label>
          <input style={inputStyle} placeholder="e.g., USA" value={buyer.buyerCountry || ""} onChange={set("buyerCountry")} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="buyer@example.com" value={buyer.email || ""} onChange={set("email")} />
        </div>
      </div>
    </div>
  );
}

export default BuyerForm;
