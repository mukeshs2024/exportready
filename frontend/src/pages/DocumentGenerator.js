import { useState } from "react";
import { buildAllDocs } from "../services/documentBuilder";
import { downloadPDF, downloadWord } from "../services/documentDownload";

const INITIAL = {
  sellerCompany: "", sellerAddress: "", sellerIEC: "", sellerGST: "",
  buyerCompany: "", buyerName: "", buyerCountry: "", buyerEmail: "",
  productName: "", hsCode: "", quantity: "", unit: "KG", unitPrice: "", currency: "USD",
  incoterms: "FOB", invoiceNo: "", shipDate: "",
  packageCount: "", grossWeight: "", netWeight: "",
  portOfLoading: "", portOfDischarge: "", shipMode: "Sea",
};

const FIELD_GROUPS = [
  { title: "Exporter Details", fields: [
    { key: "sellerCompany", label: "Company Name" },
    { key: "sellerAddress", label: "Address" },
    { key: "sellerIEC", label: "IEC Code" },
    { key: "sellerGST", label: "GST Number" },
  ]},
  { title: "Buyer Details", fields: [
    { key: "buyerCompany", label: "Company Name" },
    { key: "buyerName", label: "Contact Person" },
    { key: "buyerCountry", label: "Country" },
    { key: "buyerEmail", label: "Email" },
  ]},
  { title: "Product Details", fields: [
    { key: "productName", label: "Product Name" },
    { key: "hsCode", label: "HS Code" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "unit", label: "Unit", options: ["KG", "MT", "PCS", "LTR", "CBM"] },
    { key: "unitPrice", label: "Unit Price", type: "number" },
    { key: "currency", label: "Currency", options: ["USD", "EUR", "GBP", "INR"] },
  ]},
  { title: "Shipment Details", fields: [
    { key: "invoiceNo", label: "Invoice Number" },
    { key: "shipDate", label: "Shipment Date", type: "date" },
    { key: "incoterms", label: "Incoterms", options: ["FOB", "CIF", "CFR", "EXW", "DDP"] },
    { key: "packageCount", label: "No. of Packages", type: "number" },
    { key: "grossWeight", label: "Gross Weight (KG)", type: "number" },
    { key: "netWeight", label: "Net Weight (KG)", type: "number" },
    { key: "portOfLoading", label: "Port of Loading" },
    { key: "portOfDischarge", label: "Port of Discharge" },
    { key: "shipMode", label: "Transport Mode", options: ["Sea", "Air", "Road", "Rail"] },
  ]},
];

const input = { width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.85rem", outline: "none" };
const label = { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "4px" };

function DocumentGenerator() {
  const [form, setForm] = useState(INITIAL);
  const [docs, setDocs] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const generate = () => {
    if (!form.productName) { alert("Product Name is required"); return; }
    const all = buildAllDocs(form);
    setDocs(all);
    setActiveDoc(all[0].id);
  };

  const active = docs?.find((d) => d.id === activeDoc);

  return (
    <div>
      <h2 style={{ color: "#0f1e3a", marginBottom: "1.5rem", fontSize: "1.3rem", fontWeight: 800 }}>
        Export Document Generator
      </h2>

      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {FIELD_GROUPS.map((g) => (
          <div key={g.title} style={{ background: "white", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f1e3a", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{g.title}</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {g.fields.map((f) => (
                <div key={f.key}>
                  <label style={label}>{f.label}</label>
                  {f.options ? (
                    <select value={form[f.key]} onChange={set(f.key)} style={input}>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || "text"} value={form[f.key]} onChange={set(f.key)} style={input} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={generate} style={{ width: "100%", padding: "0.875rem", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "white", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1.5rem" }}>
        Generate All Documents
      </button>

      {/* Document Tabs + Output */}
      {docs && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {docs.map((d) => (
              <button key={d.id} onClick={() => setActiveDoc(d.id)} style={{
                padding: "0.5rem 1rem", borderRadius: "8px", border: activeDoc === d.id ? "2px solid #2563eb" : "1px solid #cbd5e1",
                background: activeDoc === d.id ? "#eff6ff" : "white", fontWeight: activeDoc === d.id ? 700 : 500,
                fontSize: "0.82rem", cursor: "pointer", color: activeDoc === d.id ? "#1d4ed8" : "#334155",
              }}>
                {d.icon} {d.title}
              </button>
            ))}
          </div>

          {active && (
            <div id="doc-view" style={{ background: "white", border: "2px solid #2563eb", borderRadius: "10px", padding: "2rem" }}>
              {/* Doc header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #2563eb", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f1e3a", margin: 0 }}>
                  {active.icon} {active.title}
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => downloadPDF("doc-view", active.title)} style={{ padding: "6px 10px", background: "#4ECDC420", border: "1px solid #4ECDC450", color: "#4ECDC4", borderRadius: 6, cursor: "pointer", fontSize: 10 }}>PDF</button>
                  <button onClick={() => downloadWord(active, active.title)} style={{ padding: "6px 10px", background: "#68D39120", border: "1px solid #68D39150", color: "#68D391", borderRadius: 6, cursor: "pointer", fontSize: 10 }}>WORD</button>
                </div>
              </div>
              {active.sections.map((s) => (
                <div key={s.title} style={{ marginBottom: "1.25rem" }}>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1d4ed8", marginBottom: "0.5rem", textTransform: "uppercase" }}>{s.title}</h4>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {s.rows.map(([k, v], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.4rem 0.5rem", fontWeight: 600, color: "#475569", fontSize: "0.83rem", width: "40%" }}>{k}</td>
                          <td style={{ padding: "0.4rem 0.5rem", color: "#0f172a", fontSize: "0.83rem" }}>{v || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentGenerator;
