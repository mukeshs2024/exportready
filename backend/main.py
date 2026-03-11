from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from supabase import create_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url ="https://pwzypicfejlxqyrswteh.supabase.co"
key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3enlwaWNmZWpseHF5cnN3dGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzk4MzUsImV4cCI6MjA4ODgxNTgzNX0.93jEx1dSwJxUNJ66NYy3M9oTDh4dLmvZRev5fL0rNQ4"

supabase = create_client(url, key)

@app.get("/")
def home():
    return {"message": "ExportReady API running"}


@app.post("/add-user")
def add_user(name: str, email: str, password: str):

    data = {
        "name": name,
        "email": email,
        "password": password
    }

    response = supabase.table("users").insert(data).execute()

    return {
        "message": "User added successfully",
        "data": response.data
    }    

@app.post("/add-product")
def add_product(
    user_id: int,
    product_name: str,
    category: str,
    production_capacity: int,
    target_price: float
):

    data = {
        "user_id": user_id,
        "product_name": product_name,
        "category": category,
        "production_capacity": production_capacity,
        "target_price": target_price
    }

    response = supabase.table("products").insert(data).execute()

    return {
        "message": "Product added successfully",
        "data": response.data
    }


@app.get("/market-analysis")
def market_analysis(product_name: str):

    # Simple AI logic (rule-based for prototype)

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


@app.post("/profit-simulation")
def profit_simulation(
    product_price: float,
    production_cost: float,
    shipping_cost: float,
    duty_percentage: float
):

    # calculate duty
    duty_cost = product_price * (duty_percentage / 100)

    # total cost
    total_cost = production_cost + shipping_cost + duty_cost

    # profit
    profit = product_price - total_cost

    # profitability score
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


@app.get("/export-action-plan")
def export_action_plan(product_name: str, target_country: str):

    # Compliance rules (simple prototype logic)
    compliance_rules = {
        "USA": ["Product Labeling Compliance", "Import Duty Declaration", "Quality Certification"],
        "Germany": ["CE Certification", "Packaging Regulations", "EU Safety Standards"],
        "UAE": ["Halal Certification (if food)", "Product Labeling", "Import License"]
    }

    # Export documentation
    documents = [
        "Import Export Code (IEC)",
        "Commercial Invoice",
        "Packing List",
        "Shipping Bill",
        "Bill of Lading"
    ]

    # Export procedure steps
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

