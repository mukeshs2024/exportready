const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #e2e8f0",
  borderRadius: "8px", fontSize: "0.85rem", fontFamily: "inherit",
};
const labelStyle = {
  display: "block", fontWeight: "600", color: "#1a202c",
  marginBottom: "0.4rem", fontSize: "0.8rem",
};

function ShipmentForm({ shipment, onChange }) {
  const set = (field) => (e) => onChange({ ...shipment, [field]: e.target.value });

  return (
    <div style={{ background: "#fefce8", padding: "1.5rem", borderRadius: "10px", border: "1px solid #fde68a", borderLeft: "4px solid #ca8a04" }}>
      <h3 style={{ color: "#0f1e3a", marginBottom: "1.25rem", fontSize: "1rem", fontWeight: "700" }}>Shipment Details</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Port of Loading *</label>
          <input style={inputStyle} placeholder="e.g., JNPT Mumbai" value={shipment.portOfLoading || ""} onChange={set("portOfLoading")} />
        </div>
        <div>
          <label style={labelStyle}>Port of Discharge *</label>
          <input style={inputStyle} placeholder="e.g., Shanghai Port" value={shipment.portOfDischarge || ""} onChange={set("portOfDischarge")} />
        </div>
        <div>
          <label style={labelStyle}>Shipping Method *</label>
          <select style={inputStyle} value={shipment.shippingMethod || ""} onChange={set("shippingMethod")}>
            <option value="">Select</option>
            <option value="Sea Freight">Sea Freight</option>
            <option value="Air Freight">Air Freight</option>
            <option value="Road Transport">Road Transport</option>
            <option value="Rail Transport">Rail Transport</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Vessel / Flight</label>
          <input style={inputStyle} placeholder="e.g., MSC Oscar" value={shipment.vessel || ""} onChange={set("vessel")} />
        </div>
        <div>
          <label style={labelStyle}>Gross Weight (kg)</label>
          <input style={inputStyle} type="number" min="0" placeholder="e.g., 12000" value={shipment.grossWeight || ""} onChange={set("grossWeight")} />
        </div>
        <div>
          <label style={labelStyle}>Net Weight (kg)</label>
          <input style={inputStyle} type="number" min="0" placeholder="e.g., 10000" value={shipment.netWeight || ""} onChange={set("netWeight")} />
        </div>
        <div>
          <label style={labelStyle}>Number of Packages</label>
          <input style={inputStyle} type="number" min="0" placeholder="e.g., 500" value={shipment.numPackages || ""} onChange={set("numPackages")} />
        </div>
        <div>
          <label style={labelStyle}>Shipment Date</label>
          <input style={inputStyle} type="date" value={shipment.shipmentDate || ""} onChange={set("shipmentDate")} />
        </div>
      </div>
    </div>
  );
}

export default ShipmentForm;
