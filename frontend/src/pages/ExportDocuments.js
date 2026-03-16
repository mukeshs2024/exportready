import { useState, useEffect } from "react";
import API from "../services/api";

// ---------------------------------------------------------------------------
// Category tabs config
// ---------------------------------------------------------------------------
const CATEGORIES = [
    { key: "Manufactured Goods", icon: "🏭" },
    { key: "Agriculture", icon: "🌾" },
    { key: "Textiles", icon: "🧵" },
    { key: "Pharmaceuticals", icon: "💊" },
];

// ---------------------------------------------------------------------------
// DocCard — single document card with Apply Now button
// ---------------------------------------------------------------------------
function DocCard({ doc }) {
    const [hover, setHover] = useState(false);

    return (
        <div style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(15,30,58,0.07)",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            transform: hover ? "translateY(-2px)" : "none",
            boxShadow: hover
                ? "0 8px 24px rgba(15,30,58,0.13)"
                : "0 2px 8px rgba(15,30,58,0.07)",
        }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Document name + category badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "800", lineHeight: 1.3 }}>
                    📄 {doc.document_name}
                </h3>
                {doc.category && doc.category !== "Universal" && (
                    <span style={{
                        background: "#eff6ff", color: "#1d4ed8", borderRadius: "20px",
                        padding: "0.18rem 0.6rem", fontSize: "0.68rem", fontWeight: "700",
                        whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                        {doc.category}
                    </span>
                )}
                {doc.category === "Universal" && (
                    <span style={{
                        background: "#f0fdf4", color: "#16a34a", borderRadius: "20px",
                        padding: "0.18rem 0.6rem", fontSize: "0.68rem", fontWeight: "700",
                        whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                        Universal
                    </span>
                )}
            </div>

            {/* Description */}
            {doc.description && (
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem", lineHeight: 1.55 }}>
                    {doc.description}
                </p>
            )}

            {/* Fee + Time row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.1rem" }}>
                {doc.application_fee && (
                    <div style={{ background: "#fefce8", borderRadius: "7px", padding: "0.5rem 0.7rem", border: "1px solid #fde68a" }}>
                        <div style={{ fontSize: "0.62rem", color: "#92400e", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            💰 Application Fee
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#78350f", fontWeight: "800", marginTop: "0.15rem" }}>
                            {doc.application_fee}
                        </div>
                    </div>
                )}
                {doc.processing_time && (
                    <div style={{ background: "#f0fdf4", borderRadius: "7px", padding: "0.5rem 0.7rem", border: "1px solid #bbf7d0" }}>
                        <div style={{ fontSize: "0.62rem", color: "#166534", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                            ⏱ Processing Time
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#15803d", fontWeight: "800", marginTop: "0.15rem" }}>
                            {doc.processing_time}
                        </div>
                    </div>
                )}
            </div>

            {/* Portal name + Apply button */}
            <div style={{ marginTop: "0.25rem" }}>
                {doc.portal_name && (
                    <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.5rem", fontWeight: "500" }}>
                        Government Portal: <strong style={{ color: "#0f1e3a" }}>{doc.portal_name}</strong>
                    </div>
                )}
                <a
                    href={doc.document_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "block" }}
                >
                    <button style={{
                        width: "100%",
                        padding: "0.65rem 1rem",
                        background: "linear-gradient(135deg, #F5A623 0%, #d88d1c 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        letterSpacing: "0.4px",
                        boxShadow: "0 2px 8px rgba(245,166,35,0.35)",
                        transition: "filter 0.15s ease",
                    }}>
                        Apply on {doc.portal_name || "Official Website"} →
                    </button>
                </a>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main ExportDocuments page
// ---------------------------------------------------------------------------
function ExportDocuments() {
    const [activeCategory, setActiveCategory] = useState("Manufactured Goods");
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDocs(activeCategory);
    }, [activeCategory]);

    const fetchDocs = async (cat) => {
        setLoading(true);
        setError("");
        setDocs([]);
        try {
            const res = await API.get(`/export-documents/${encodeURIComponent(cat)}`);
            setDocs(res.data?.documents || res.data || []);
        } catch {
            setError("Could not load documents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const mainDocs = docs.filter(d => d.category !== "Universal");
    const universalDocs = docs.filter(d => d.category === "Universal");

    return (
        <div>
            {/* Hero header */}
            <div style={{
                background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
                color: "white",
                padding: "2rem 2.5rem",
                borderRadius: "12px",
                marginBottom: "1.75rem",
                border: "1px solid rgba(245,166,35,0.2)",
            }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0, marginBottom: "0.35rem" }}>
                    📋 Required Export Documents
                </h2>
                <p style={{ opacity: 0.85, fontSize: "0.85rem", margin: 0 }}>
                    Find every government licence, certificate, and registration you need — with direct Apply Now links,
                    fees, and processing times.
                </p>
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
                {CATEGORIES.map(({ key, icon }) => {
                    const active = activeCategory === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            style={{
                                padding: "0.55rem 1.1rem",
                                background: active
                                    ? "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)"
                                    : "white",
                                color: active ? "white" : "#475569",
                                border: active ? "2px solid #0f1e3a" : "1.5px solid #e2e8f0",
                                borderRadius: "25px",
                                fontSize: "0.82rem",
                                fontWeight: active ? "700" : "500",
                                cursor: "pointer",
                                boxShadow: active ? "0 2px 8px rgba(15,30,58,0.2)" : "none",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {icon} {key}
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
                    Loading documents for <strong>{activeCategory}</strong>...
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    padding: "1rem 1.25rem", background: "#fef2f2", borderRadius: "8px",
                    borderLeft: "4px solid #dc2626", color: "#b91c1c", fontSize: "0.88rem", fontWeight: "600"
                }}>
                    {error}
                </div>
            )}

            {/* Category-specific documents */}
            {!loading && mainDocs.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F5A623" }} />
                        <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "800" }}>
                            {activeCategory} Documents
                        </h3>
                        <span style={{
                            background: "#F5A623", color: "white", borderRadius: "20px",
                            padding: "0.15rem 0.55rem", fontSize: "0.68rem", fontWeight: "700"
                        }}>
                            {mainDocs.length} required
                        </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
                        {mainDocs.map((doc, i) => <DocCard key={i} doc={doc} />)}
                    </div>
                </div>
            )}

            {/* Universal documents */}
            {!loading && universalDocs.length > 0 && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16a34a" }} />
                        <h3 style={{ margin: 0, color: "#0f1e3a", fontSize: "0.95rem", fontWeight: "800" }}>
                            Universal Export Documents
                        </h3>
                        <span style={{
                            background: "#16a34a", color: "white", borderRadius: "20px",
                            padding: "0.15rem 0.55rem", fontSize: "0.68rem", fontWeight: "700"
                        }}>
                            Required for all exports
                        </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
                        {universalDocs.map((doc, i) => <DocCard key={i} doc={doc} />)}
                    </div>
                </div>
            )}

            {/* Info footer */}
            {!loading && docs.length > 0 && (
                <div style={{
                    marginTop: "2rem", padding: "1rem 1.25rem", background: "#f8fafc",
                    borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.78rem", color: "#64748b"
                }}>
                    ℹ️ <strong>Disclaimer:</strong> Processing times and fees are approximate and may vary.
                    Always verify current requirements on the official government portal before applying.
                </div>
            )}
        </div>
    );
}

export default ExportDocuments;
