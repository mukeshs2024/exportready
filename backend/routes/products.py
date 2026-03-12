from fastapi import APIRouter
from database.connection import supabase

router = APIRouter()


@router.post("/add-product")
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
