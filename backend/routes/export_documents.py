"""
Export Documents guidance endpoint.
Queries the export_documents table and returns clickable doc cards
with processing_time and application_fee where available.
"""

from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()

# ---------------------------------------------------------------------------
# Static fallback catalogue — shown when the DB table has no data for a category
# ---------------------------------------------------------------------------
_STATIC_DOCS = {
    "Agriculture": [
        {
            "document_name": "APEDA Registration",
            "portal_name": "APEDA",
            "document_link": "https://apeda.gov.in",
            "description": "Mandatory for exporters of scheduled agricultural products.",
            "processing_time": "7–10 days",
            "application_fee": "₹5,000",
            "category": "Agriculture",
        },
        {
            "document_name": "Phytosanitary Certificate",
            "portal_name": "NPPO / State Dept",
            "document_link": "https://ppqs.gov.in",
            "description": "Certifies produce is free from pests and diseases.",
            "processing_time": "2–5 days",
            "application_fee": "₹200–₹500",
            "category": "Agriculture",
        },
        {
            "document_name": "Certificate of Origin",
            "portal_name": "FIEO / EPC",
            "document_link": "https://www.fieo.org",
            "description": "Establishes the country of origin for preferential duty.",
            "processing_time": "1–2 days",
            "application_fee": "₹300",
            "category": "Agriculture",
        },
    ],
    "Manufactured Goods": [
        {
            "document_name": "Import Export Code (IEC)",
            "portal_name": "DGFT",
            "document_link": "https://dgft.gov.in",
            "description": "10-digit code mandatory for every exporter/importer.",
            "processing_time": "2–3 days",
            "application_fee": "₹500",
            "category": "Manufactured Goods",
        },
        {
            "document_name": "GST Registration",
            "portal_name": "GST Portal",
            "document_link": "https://www.gst.gov.in",
            "description": "Required for claiming GST refunds on exports.",
            "processing_time": "3–7 days",
            "application_fee": "Free",
            "category": "Manufactured Goods",
        },
        {
            "document_name": "BIS Certification",
            "portal_name": "Bureau of Indian Standards",
            "document_link": "https://www.bis.gov.in",
            "description": "Quality certification required for many manufactured goods.",
            "processing_time": "30–60 days",
            "application_fee": "₹1,000–₹10,000",
            "category": "Manufactured Goods",
        },
    ],
    "Textiles": [
        {
            "document_name": "RCMC – AEPC",
            "portal_name": "Apparel Export Promotion Council",
            "document_link": "https://www.aepc.in",
            "description": "Registration cum Membership Certificate for apparel exporters.",
            "processing_time": "7 days",
            "application_fee": "₹10,000",
            "category": "Textiles",
        },
        {
            "document_name": "OEKO-TEX Certification",
            "portal_name": "OEKO-TEX",
            "document_link": "https://www.oeko-tex.com",
            "description": "Global textile safety & sustainability certification.",
            "processing_time": "4–8 weeks",
            "application_fee": "€300–€800",
            "category": "Textiles",
        },
    ],
    "Pharmaceuticals": [
        {
            "document_name": "WHO-GMP Certificate",
            "portal_name": "CDSCO",
            "document_link": "https://cdsco.gov.in",
            "description": "WHO Good Manufacturing Practice certification for pharma exports.",
            "processing_time": "30–45 days",
            "application_fee": "₹25,000",
            "category": "Pharmaceuticals",
        },
        {
            "document_name": "Free Sale Certificate",
            "portal_name": "CDSCO",
            "document_link": "https://cdsco.gov.in",
            "description": "Confirms the product is freely sold in India.",
            "processing_time": "7–14 days",
            "application_fee": "₹2,000",
            "category": "Pharmaceuticals",
        },
    ],
}

# Universal documents shown for every category
_UNIVERSAL_DOCS = [
    {
        "document_name": "Import Export Code (IEC)",
        "portal_name": "DGFT",
        "document_link": "https://dgft.gov.in",
        "description": "10-digit code mandatory for every exporter/importer in India.",
        "processing_time": "2–3 days",
        "application_fee": "₹500",
        "category": "Universal",
    },
    {
        "document_name": "Shipping Bill",
        "portal_name": "ICEGATE",
        "document_link": "https://icegate.gov.in",
        "description": "Filed with customs for every export shipment.",
        "processing_time": "Same day",
        "application_fee": "Free",
        "category": "Universal",
    },
    {
        "document_name": "Letter of Credit / Bank Guarantee",
        "portal_name": "Your Export Bank",
        "document_link": "https://www.eximbankindia.in",
        "description": "Payment security instrument for international buyers.",
        "processing_time": "1–3 days",
        "application_fee": "Bank charges apply",
        "category": "Universal",
    },
]


@router.get("/export-documents/{category}")
def get_export_documents(category: str):
    """
    Returns export documents for a given category.
    Tries the Supabase table first; falls back to static catalogue.
    Appends universal documents to every response.
    """
    docs = []

    # Try DB
    try:
        resp = (
            supabase.table("export_documents")
            .select("*")
            .ilike("category", f"%{category}%")
            .execute()
        )
        if resp.data:
            docs = resp.data
    except Exception:
        pass

    # Fall back to static if DB returned nothing
    if not docs:
        # Best-match static key
        cat_key = next(
            (k for k in _STATIC_DOCS if k.lower() in category.lower() or category.lower() in k.lower()),
            None,
        )
        if cat_key:
            docs = _STATIC_DOCS[cat_key]

    # Merge universal docs (avoid duplicating IEC if already in main list)
    main_names = {d.get("document_name", "").lower() for d in docs}
    for ud in _UNIVERSAL_DOCS:
        if ud["document_name"].lower() not in main_names:
            docs.append(ud)

    return {"category": category, "documents": docs}


@router.get("/export-documents")
def list_categories():
    """Returns the list of available document categories."""
    return {
        "categories": list(_STATIC_DOCS.keys()),
        "default": "Manufactured Goods",
    }
