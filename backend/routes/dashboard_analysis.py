from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()

# ---------------------------------------------------------------------------
# Fallback data
# ---------------------------------------------------------------------------
_FALLBACK_DOCUMENTS: dict[str, list[str]] = {
    "agricultural": [
        "Import Export Code (IEC)",
        "APEDA Registration",
        "Phytosanitary Certificate",
        "Certificate of Origin",
        "Commercial Invoice",
    ],
    "electronics": [
        "Import Export Code (IEC)",
        "BIS Certification",
        "Commercial Invoice",
        "Packing List",
        "Shipping Bill",
    ],
    "pharmaceuticals": [
        "Import Export Code (IEC)",
        "Drug License",
        "WHO-GMP Certificate",
        "Certificate of Pharmaceutical Product",
        "Commercial Invoice",
    ],
    "general": [
        "Import Export Code (IEC)",
        "GST Registration",
        "Commercial Invoice",
        "Packing List",
        "Certificate of Origin",
        "Shipping Bill",
        "Bill of Lading",
    ],
}

_FALLBACK_BUYERS = ["Walmart", "Amazon", "Costco"]

_PRODUCT_CATEGORY_MAP: dict[str, str] = {
    "rice": "agricultural",
    "wheat": "agricultural",
    "spices": "agricultural",
    "tea": "agricultural",
    "cotton shirts": "textiles",
    "textiles": "textiles",
    "electronics": "electronics",
    "pharmaceuticals": "pharmaceuticals",
    "software": "software",
    "handicrafts": "handicrafts",
}

_PROFIT_ESTIMATES: dict[str, str] = {
    "agricultural": "20% - 30% Estimated Export Profit",
    "electronics": "15% - 25% Estimated Export Profit",
    "pharmaceuticals": "25% - 35% Estimated Export Profit",
    "textiles": "18% - 28% Estimated Export Profit",
    "software": "30% - 50% Estimated Export Profit",
    "handicrafts": "25% - 40% Estimated Export Profit",
    "general": "15% - 25% Estimated Export Profit",
}


def _resolve_category(product: str) -> str:
    p = product.lower()
    for keyword, category in _PRODUCT_CATEGORY_MAP.items():
        if keyword in p:
            return category
    return "general"


@router.get("/dashboard-analysis")
def dashboard_analysis(product: str):

    # --- 1. Top markets ---
    markets: list[list] = []
    try:
        result = (
            supabase.table("market_data")
            .select("country, demand_score")
            .ilike("product_name", f"%{product}%")
            .order("demand_score", desc=True)
            .limit(3)
            .execute()
        )
        if result.data:
            markets = [[row["country"], row["demand_score"]] for row in result.data]
    except Exception:
        pass

    # --- 2. Category ---
    category = _resolve_category(product)

    # --- 3. Required documents ---
    documents: list[list[str]] = []
    try:
        result = (
            supabase.table("export_certifications")
            .select("certification_name")
            .ilike("product_category", f"%{category}%")
            .execute()
        )
        if result.data:
            documents = [[row["certification_name"]] for row in result.data]
    except Exception:
        pass

    if not documents:
        documents = [[d] for d in _FALLBACK_DOCUMENTS.get(category, _FALLBACK_DOCUMENTS["general"])]

    # --- 4. Potential buyers ---
    buyers = [[name] for name in _FALLBACK_BUYERS]

    # --- 5. Profit estimation ---
    profit = _PROFIT_ESTIMATES.get(category, _PROFIT_ESTIMATES["general"])

    return {
        "product": product,
        "top_markets": markets,
        "documents_required": documents,
        "potential_buyers": buyers,
        "profit_estimation": profit,
    }
