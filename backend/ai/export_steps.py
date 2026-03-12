from database.connection import supabase


def get_documents_from_db(product_category=None):
    try:
        query = supabase.table("export_certifications").select("*")
        if product_category:
            query = query.eq("product_category", product_category)
        result = query.execute()
        if result.data:
            docs = "Required export documents and certifications:\n\n"
            for row in result.data:
                docs += f"• {row['certification_name']}: {row['description']}\n"
            return docs
    except Exception:
        pass
    return None


def get_country_regulations(country=None, product_category=None):
    try:
        query = supabase.table("country_regulations").select("*")
        if country:
            query = query.ilike("country", f"%{country}%")
        if product_category:
            query = query.ilike("product_category", f"%{product_category}%")
        result = query.execute()
        if result.data:
            response = "Country regulations:\n\n"
            for row in result.data:
                response += f"• {row['country']} ({row['product_category']}): {row['required_certification']} — {row['import_rules']}\n"
            return response
    except Exception:
        pass
    return None


def detect_step(question):

    question = question.lower()

    if "business" in question:
        return "First register your business legally before starting export."

    if "iec" in question:
        return "After obtaining Import Export Code (IEC), the next step is GST registration."

    if "gst" in question:
        return "After GST registration, choose the product you want to export."

    if "product" in question:
        return "Once the product is selected, analyze export markets with high demand."

    if "market" in question:
        from ai.market_answers import get_market_data
        db_markets = get_market_data()
        if db_markets:
            return db_markets
        return "After identifying markets, check country regulations and certifications."

    if "documents" in question or "certification" in question:
        db_docs = get_documents_from_db()
        if db_docs:
            return db_docs
        return """Required export documents include:

• Import Export Code (IEC)
• GST Registration
• Commercial Invoice
• Packing List
• Certificate of Origin
• Shipping Bill
• Bill of Lading
"""

    if "regulation" in question:
        db_regs = get_country_regulations()
        if db_regs:
            return db_regs
        return "Check country-specific regulations and certification requirements before exporting."

    if "shipping" in question or "logistics" in question:
        return "Next step is arranging logistics and shipping through freight companies."

    if "customs" in question or "clearance" in question:
        return "After shipping, complete customs clearance by submitting your shipping bill and export documents."

    if "payment" in question:
        return "After export shipment, payment is received via international banking channels and confirmed through FIRC."

    if "progress" in question or "completed" in question or "%" in question:
        return """Based on typical export progress:

If you have completed registration:

Next steps:
1. Identify export markets
2. Check regulations
3. Prepare export documents
4. Arrange shipping
5. Complete customs clearance
6. Receive international payment
"""

    return None
