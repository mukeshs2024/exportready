import csv
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in the environment.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

csv_path = os.path.join(os.path.dirname(__file__), "data", "country_trade_data.csv")

with open(csv_path, newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    rows = []
    for row in reader:
        rows.append({
            "country": row["country"],
            "region": row["region"],
            "tariff_percentage": float(row["tariff_percentage"]),
            "competition_level": row["competition_level"],
            "demand_score": float(row["demand_score"]),
        })

if rows:
    supabase.table("country_trade_data").insert(rows).execute()

print("Trade data seeded successfully")
