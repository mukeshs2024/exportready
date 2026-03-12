from database.connection import supabase


def get_market_data(product_name=None):
    try:
        query = supabase.table("market_data").select("*").order("demand_score", desc=True).limit(5)
        if product_name:
            query = query.ilike("product_name", f"%{product_name}%")
        result = query.execute()
        if result.data:
            response = "Top export markets:\n\n"
            for row in result.data:
                response += f"• {row['country']} — Demand Score: {row['demand_score']}, Market Size: {row['market_size']}\n"
            return response
    except Exception:
        pass
    return None


def explain_market(product):

    markets = {
        "electronics": ["USA", "Germany", "Japan"],
        "rice": ["China", "Philippines", "Nigeria"],
        "pharmaceuticals": ["USA", "UK", "Germany"]
    }

    if product in markets:

        countries = markets[product]

        return f"""
Top export markets for {product} include:

• {countries[0]}
• {countries[1]}
• {countries[2]}

These markets show strong demand and stable trade volumes for this product.
"""

    return None


def explain_profit(product):

    profits = {
        "rice": 5,
        "electronics": 20,
        "pharmaceuticals": 15
    }

    if product in profits:

        return f"""
Estimated export profit for {product} is approximately ${profits[product]} per unit after logistics and duties.

Profit may vary depending on shipping cost, tariffs, and market demand.
"""

    return None


def detect_market_question(question):

    question = question.lower()

    if "rice" in question and "country" in question:
        return """
Top countries importing rice include:

• China
• Philippines
• Nigeria
• Saudi Arabia
• United Arab Emirates
"""

    if "electronics" in question:
        return explain_market("electronics")

    if "rice" in question:
        return explain_market("rice")

    if "pharmaceutical" in question:
        return explain_market("pharmaceuticals")

    return None
