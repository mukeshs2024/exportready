def get_recommended_markets(product_name: str):
    """Simple AI logic (rule-based for prototype)"""

    market_data = {
        "cotton shirts": ["USA", "Germany", "UAE"],
        "spices": ["USA", "UK", "Canada"],
        "electronics": ["Singapore", "Japan", "UAE"],
        "rice": ["UAE", "Saudi Arabia", "Malaysia"]
    }

    product = product_name.lower()

    if product in market_data:
        markets = market_data[product]
    else:
        markets = ["USA", "UAE", "Germany"]  # default markets

    return {
        "product": product_name,
        "recommended_markets": markets
    }


def calculate_profit(
    product_price: float,
    production_cost: float,
    shipping_cost: float,
    duty_percentage: float
):
    duty_cost = product_price * (duty_percentage / 100)
    total_cost = production_cost + shipping_cost + duty_cost
    profit = product_price - total_cost

    if profit > 0:
        score = "Profitable"
    else:
        score = "Not Profitable"

    return {
        "product_price": product_price,
        "production_cost": production_cost,
        "shipping_cost": shipping_cost,
        "duty_cost": duty_cost,
        "total_cost": total_cost,
        "profit": profit,
        "profitability": score
    }


def get_export_action_plan(product_name: str, target_country: str):
    compliance_rules = {
        "USA": ["Product Labeling Compliance", "Import Duty Declaration", "Quality Certification"],
        "Germany": ["CE Certification", "Packaging Regulations", "EU Safety Standards"],
        "UAE": ["Halal Certification (if food)", "Product Labeling", "Import License"]
    }

    documents = [
        "Import Export Code (IEC)",
        "Commercial Invoice",
        "Packing List",
        "Shipping Bill",
        "Bill of Lading"
    ]

    steps = [
        "Register IEC from DGFT",
        "Prepare export documentation",
        "Select international logistics partner",
        "Submit shipping bill in customs portal",
        "Ship goods to destination country"
    ]

    compliance = compliance_rules.get(target_country, ["Standard Export Certification"])

    return {
        "product": product_name,
        "target_country": target_country,
        "compliance_checklist": compliance,
        "required_documents": documents,
        "export_steps": steps
    }
