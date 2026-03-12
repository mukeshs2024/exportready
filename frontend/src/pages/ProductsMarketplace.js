import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Toast from "../components/Toast";

function ProductsMarketplace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tradeProductId, setTradeProductId] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerCountry, setBuyerCountry] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchProducts = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (category.trim()) params.category = category.trim();
      if (search.trim()) params.name = search.trim();

      const response = await API.get("/search-products", { params });
      setProducts(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryOptions = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return ["", ...Array.from(unique)];
  }, [products]);

  const openTradeModal = (productId) => {
    setTradeProductId(productId);
    setBuyerName("");
    setBuyerCountry("");
    setQuantity("");
    setError("");
    setSuccess("");
  };

  const closeTradeModal = () => {
    setTradeProductId(null);
    setError("");
    setSuccess("");
  };

  const submitTradeRequest = async () => {
    if (!tradeProductId) return;
    if (!buyerName.trim() || !buyerCountry.trim() || !quantity) {
      setError("All trade request fields are required");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await API.post("/trade-request", null, {
        params: {
          product_id: tradeProductId,
          buyer_name: buyerName.trim(),
          buyer_country: buyerCountry.trim(),
          quantity: Number(quantity)
        }
      });
      setSuccess("Trade request sent. Exporter will respond soon.");
      setBuyerName("");
      setBuyerCountry("");
      setQuantity("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit trade request");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleFilter = async () => {
    await fetchProducts();
  };

  const clearFilters = async () => {
    setSearch("");
    setCategory("");
    await fetchProducts();
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "1.5rem",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <div style={{flex: 1, minWidth: "240px"}}>
          <h2 style={{color: "#0f1e3a", marginBottom: "0.5rem", fontSize: "1.6rem", fontWeight: "800"}}>
            Global Trade Marketplace
          </h2>
          <p style={{color: "#4a5568", lineHeight: 1.6}}>
            Browse export-ready products from global exporters. Filter by category or search by product name.
          </p>
        </div>

        <div style={{display: "flex", alignItems: "flex-end", gap: "0.75rem", flexWrap: "wrap"}}>
          <div style={{display: "flex", flexDirection: "column", flex: 1, minWidth: "220px"}}>
            <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem"}}>
              Search Product
            </label>
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Type product name..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.95rem"
              }}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column", flex: 1, minWidth: "220px"}}>
            <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem"}}>
              Category
            </label>
            <select
              value={category}
              onChange={handleCategory}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.95rem",
                background: "white"
              }}
            >
              <option value="">All categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{display: "flex", gap: "0.75rem", alignItems: "flex-end"}}>
            <button
              onClick={handleFilter}
              style={{
                padding: "0.85rem 1.25rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              style={{
                padding: "0.85rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                color: "#0f1e3a",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{textAlign: "center", color: "#4a5568", margin: "2rem 0"}}>
          Loading products…
        </div>
      )}

      {error && (
        <div style={{marginBottom: "1rem"}}>
          <Toast message={error} type="error" onClose={() => setError("")} />
        </div>
      )}

      {!loading && products.length === 0 && (
        <div style={{padding: "2rem", background: "#f7f8fc", borderRadius: "12px", border: "1px solid #e2e8f0"}}>
          <p style={{margin: 0, color: "#4a5568"}}>
            No products found. Ask exporters to add listings or adjust your filters.
          </p>
        </div>
      )}

      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem"}}>
        {products.map((product) => (
          <div key={product.product_id} style={{background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.08)"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem"}}>
              <div style={{flex: 1}}>
                <h3 style={{margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f1e3a"}}>{product.product_name}</h3>
                <p style={{margin: "0.35rem 0 0", color: "#4a5568", fontSize: "0.9rem"}}>
                  <span style={{fontWeight: 700}}>Category:</span> {product.category || "—"}
                </p>
              </div>
              <div style={{textAlign: "right"}}>
                <div style={{fontSize: "1.25rem", fontWeight: "800", color: "#0f1e3a"}}>
                  ${product.price?.toLocaleString() || "—"}
                </div>
                <div style={{fontSize: "0.85rem", color: "#4a5568"}}>per unit</div>
              </div>
            </div>

            <div style={{marginBottom: "1rem"}}>
              <p style={{margin: "0 0 0.25rem", color: "#2d3748", fontWeight: 600}}>Exporter</p>
              <p style={{margin: 0, color: "#4a5568", fontSize: "0.9rem"}}>
                {product.exporter_name || "Unknown"} — {product.exporter_company || ""}
              </p>
              <p style={{margin: "0.25rem 0 0", color: "#4a5568", fontSize: "0.9rem"}}>
                {product.exporter_country ? `Country: ${product.exporter_country}` : ""}
              </p>
              <p style={{margin: "0.25rem 0 0", color: "#4a5568", fontSize: "0.9rem"}}>
                {product.contact_email ? (
                  <>
                    Email: <a href={`mailto:${product.contact_email}`} style={{color: "#1a73e8"}}>{product.contact_email}</a>
                  </>
                ) : (
                  "Contact: Not provided"
                )}
              </p>
            </div>

            {product.description && (
              <div style={{marginBottom: "1rem"}}>
                <p style={{margin: "0", color: "#4a5568", fontSize: "0.9rem"}}>{product.description}</p>
              </div>
            )}

            <div style={{display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "auto"}}>
              <button
                onClick={() => {
                  if (product.contact_email) {
                    window.location.href = `mailto:${product.contact_email}?subject=Inquiry%20about%20${encodeURIComponent(product.product_name)}`;
                  }
                }}
                disabled={!product.contact_email}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: product.contact_email ? "#ffffff" : "#f7f8fc",
                  color: product.contact_email ? "#0f1e3a" : "#a0aec0",
                  fontWeight: 600,
                  cursor: product.contact_email ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease"
                }}
              >
                Contact Exporter
              </button>

              <button
                onClick={() => openTradeModal(product.product_id)}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Request Trade
              </button>
            </div>
          </div>
        ))}
      </div>

      {tradeProductId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 30, 58, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            zIndex: 2000
          }}
          onClick={closeTradeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(540px, 100%)",
              background: "white",
              borderRadius: "14px",
              padding: "2rem",
              boxShadow: "0 16px 30px rgba(15, 30, 58, 0.25)",
              position: "relative"
            }}
          >
            <button
              onClick={closeTradeModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                border: "none",
                background: "transparent",
                fontSize: "1.25rem",
                cursor: "pointer",
                color: "#4a5568"
              }}
            >
              ×
            </button>

            <h3 style={{margin: 0, fontSize: "1.4rem", fontWeight: "800", color: "#0f1e3a"}}>
              Trade Request
            </h3>
            <p style={{margin: "0.5rem 0 1.25rem", color: "#4a5568"}}>
              Request a quote or order from the exporter. The exporter will receive the request and respond directly.
            </p>

            {error && <Toast message={error} type="error" onClose={() => setError("")} />}
            {success && <Toast message={success} type="success" onClose={() => setSuccess("")} />}

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem"}}>
              <div>
                <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", display: "block", fontSize: "0.85rem"}}>
                  Buyer Name
                </label>
                <input
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Your company name"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "0.95rem"
                  }}
                />
              </div>

              <div>
                <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", display: "block", fontSize: "0.85rem"}}>
                  Buyer Country
                </label>
                <input
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  placeholder="Country (e.g., UAE)"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "0.95rem"
                  }}
                />
              </div>
            </div>

            <div style={{marginBottom: "1.5rem"}}>
              <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", display: "block", fontSize: "0.85rem"}}>
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity (e.g., 20)"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "0.95rem"
                }}
              />
            </div>

            <button
              onClick={submitTradeRequest}
              style={{
                width: "100%",
                padding: "0.9rem 1.25rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #0f1e3a 0%, #1a2f5a 100%)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
            >
              Send Trade Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsMarketplace;
