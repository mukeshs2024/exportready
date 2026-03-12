from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()

# Fallback data when DB rows are missing
_FALLBACK_DOCUMENTS = {
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

_FALLBACK_BUYERS = [
    "Walmart",
    "Amazon",
    "Costco",
]

_PRODUCT_CATEGORY_MAP = {
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


def _resolve_category(product: str) -> str:
    p = product.lower()
    for keyword, category in _PRODUCT_CATEGORY_MAP.items():
        if keyword in p:
            return category
    return "general"


@router.get("/export-analysis")
def export_analysis(product: str):

    # --- 1. Top markets from market_data table ---
    markets = []
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

    # --- 2. Resolve product category ---
    category = _resolve_category(product)

    # --- 3. Required documents from export_certifications table ---
    documents = []
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
        fallback_docs = _FALLBACK_DOCUMENTS.get(category, _FALLBACK_DOCUMENTS["general"])
        documents = [[doc] for doc in fallback_docs]

    # --- 4. Potential buyers (no DB table yet — use fallback) ---
    buyers = [[name] for name in _FALLBACK_BUYERS]

    return {
        "product": product,
        "top_markets": markets,
        "documents_required": documents,
        "potential_buyers": buyers,
    }
