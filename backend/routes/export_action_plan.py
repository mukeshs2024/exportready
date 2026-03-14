from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()

# ---------------------------------------------------------------------------
# Fallback document lists per category (used when DB has no rows)
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


def _resolve_category(product: str) -> str:
    p = product.lower()
    for keyword, category in _PRODUCT_CATEGORY_MAP.items():
        if keyword in p:
            return category
    return "general"


@router.get("/export-action-plan")
def export_action_plan(product: str, hs_code: str = "", country: str = ""):

    # --- 1. Resolve product category ---
    category = _resolve_category(product)

    # --- 2. Top markets from market_data table ---
    markets: list[str] = []
    try:
        result = (
            supabase.table("market_data")
            .select("country")
            .ilike("product_name", f"%{product}%")
            .order("demand_score", desc=True)
            .limit(3)
            .execute()
        )
        if result.data:
            markets = [row["country"] for row in result.data]
    except Exception:
        pass

    # --- 3. Required documents from export_certifications table ---
    documents: list[str] = []
    try:
        result = (
            supabase.table("export_certifications")
            .select("certification_name")
            .ilike("product_category", f"%{category}%")
            .execute()
        )
        if result.data:
            documents = [row["certification_name"] for row in result.data]
    except Exception:
        pass

    if not documents:
        documents = _FALLBACK_DOCUMENTS.get(category, _FALLBACK_DOCUMENTS["general"])

    # --- 4. Export steps roadmap ---
    export_steps = [
        "Register your business legally",
        "Obtain Import Export Code (IEC)",
        "Register GST",
        "Identify export markets",
        "Prepare export documents",
        "Arrange shipping and logistics",
        "Receive international payments",
    ]

    return {
        "product": product,
        "category": category.title(),
        "recommended_markets": markets,
        "required_documents": documents,
        "export_steps": export_steps,
        "hs_code": hs_code,
        "country": country,
    }
