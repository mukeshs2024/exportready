import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";

function ProductsMarketplace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [exporterCountry, setExporterCountry] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (category.trim()) params.category = category.trim();
      if (search.trim()) params.name = search.trim();
      if (exporterCountry.trim()) params.exporter_country = exporterCountry.trim();
      params.page = page;
      params.page_size = pageSize;

      const response = await API.get("/marketplace", { params });
      const payload = response.data || {};
      const items = Array.isArray(payload) ? payload : payload.items || [];
      setProducts(items);
      setTotal(payload.total || items.length);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const categoryOptions = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(unique);
  }, [products]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleExporterCountry = (e) => {
    setExporterCountry(e.target.value);
  };

  const handleFilter = async () => {
    setPage(1);
    await fetchProducts();
  };

  const clearFilters = async () => {
    setSearch("");
    setCategory("");
    setExporterCountry("");
    setPage(1);
    await fetchProducts();
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

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
            Browse export-ready products from global exporters. Filter by category, exporter country, or search by product name.
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

          <div style={{display: "flex", flexDirection: "column", flex: 1, minWidth: "220px"}}>
            <label style={{fontWeight: 600, color: "#1a202c", marginBottom: "0.4rem", fontSize: "0.85rem"}}>
              Exporter Country
            </label>
            <input
              value={exporterCountry}
              onChange={handleExporterCountry}
              placeholder="e.g., India"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.95rem"
              }}
            />
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
          <div key={product.product_id} style={{background: "white", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(15, 30, 58, 0.08)", display: "flex", flexDirection: "column", gap: "1rem"}}>
            <div style={{height: "160px", borderRadius: "12px", background: "linear-gradient(135deg, #f3f6ff 0%, #eef2f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#94a3b8", overflow: "hidden"}}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.product_name} style={{width: "100%", height: "100%", objectFit: "cover"}} />
              ) : (
                "Product Image"
              )}
            </div>
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
            </div>

            {product.description && (
              <div style={{marginBottom: "1rem"}}>
                <p style={{margin: "0", color: "#4a5568", fontSize: "0.9rem"}}>{product.description}</p>
              </div>
            )}

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div style={{fontSize: "0.85rem", color: "#64748b"}}>
                MOQ: <strong style={{color: "#0f1e3a"}}>{product.minimum_order_quantity || "—"}</strong>
              </div>
              <div style={{fontSize: "0.85rem", color: "#64748b"}}>
                Exporter: <strong style={{color: "#0f1e3a"}}>{product.exporter_company || product.exporter_name || "Unknown"}</strong>
              </div>
            </div>

            <div style={{display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "auto"}}>
              <button
                onClick={() => navigate(`/product/${product.product_id}`)}
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
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem"}}>
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={!canPrev}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            background: canPrev ? "#ffffff" : "#f7f8fc",
            color: canPrev ? "#0f1e3a" : "#a0aec0",
            fontWeight: 600,
            cursor: canPrev ? "pointer" : "not-allowed"
          }}
        >
          Previous
        </button>
        <div style={{color: "#64748b", fontWeight: 600}}>
          Page {page} of {totalPages}
        </div>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={!canNext}
          style={{
            padding: "0.7rem 1rem",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            background: canNext ? "#ffffff" : "#f7f8fc",
            color: canNext ? "#0f1e3a" : "#a0aec0",
            fontWeight: 600,
            cursor: canNext ? "pointer" : "not-allowed"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductsMarketplace;
