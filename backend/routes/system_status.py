from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()


@router.get("/system-status")
def system_status():

    market_records = 0
    export_documents = 0
    products_supported = 0
    countries_covered = 0
    country_regulations = 0

    try:
        result = supabase.table("market_data").select("id", count="exact").execute()
        market_records = result.count or 0
    except Exception:
        pass

    try:
        result = supabase.table("export_certifications").select("id", count="exact").execute()
        export_documents = result.count or 0
    except Exception:
        pass

    try:
        result = supabase.table("market_data").select("product_name").execute()
        if result.data:
            products_supported = len({row["product_name"] for row in result.data})
    except Exception:
        pass

    try:
        result = supabase.table("market_data").select("country").execute()
        if result.data:
            countries_covered = len({row["country"] for row in result.data})
    except Exception:
        pass

    try:
        result = supabase.table("country_regulations").select("id", count="exact").execute()
        country_regulations = result.count or 0
    except Exception:
        pass

    return {
        "platform": "ExportReady",
        "datasets": {
            "market_records": market_records,
            "export_documents": export_documents,
            "country_regulations": country_regulations,
            "products_supported": products_supported,
            "countries_covered": countries_covered,
        },
        "modules": [
            "AI Market Intelligence",
            "Export Compliance Guidance",
            "Export Profit Simulator",
            "AI Export Advisor Chatbot",
            "Export Action Plan Generator",
        ],
    }
