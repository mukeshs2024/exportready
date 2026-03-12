from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from postgrest.exceptions import APIError
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


@router.post("/add-marketplace-product")
def add_marketplace_product(
    exporter_id: int,
    product_name: str,
    category: str,
    price: float,
    minimum_order_quantity: int,
    description: Optional[str] = None,
    production_capacity: Optional[int] = None
):
    data = {
        "exporter_id": exporter_id,
        "product_name": product_name,
        "category": category,
        "price": price,
        "minimum_order_quantity": minimum_order_quantity,
        "description": description,
        "production_capacity": production_capacity
    }

    try:
        response = supabase.table("products_marketplace").insert(data).execute()
    except APIError as e:
        msg = e.args[0] if e.args else str(e)
        if isinstance(msg, dict):
            msg = msg.get("message", str(msg))
        raise HTTPException(status_code=500, detail=f"Database error: {msg}")

    return {
        "message": "Marketplace product added successfully",
        "data": response.data
    }


@router.get("/products")
def get_all_products():
    try:
        response = supabase.table("products_marketplace").select(
            "*, exporter:exporter_id(name, company_name, country, email)"
        ).execute()

        products = []
        for product in response.data:
            exporter = product.get("exporter") or {}
            products.append({
                "product_id": product.get("id"),
                "product_name": product.get("product_name"),
                "category": product.get("category"),
                "description": product.get("description"),
                "price": product.get("price"),
                "minimum_order_quantity": product.get("minimum_order_quantity"),
                "production_capacity": product.get("production_capacity"),
                "exporter_name": exporter.get("name"),
                "exporter_company": exporter.get("company_name"),
                "exporter_country": exporter.get("country"),
                "contact_email": exporter.get("email"),
                "contact_phone": None
            })

        return products
    except Exception as e:
        # If the marketplace table doesn't exist yet, return an empty list.
        msg = getattr(e, 'args', [str(e)])[0] if getattr(e, 'args', None) else str(e)
        if isinstance(msg, dict):
            msg = msg.get('message', str(msg))
        if msg and "products_marketplace" in str(msg):
            return []
        # For other errors, log and return empty list so frontend can still render.
        print("[products.get_all_products] error:", msg)
        return []


@router.get("/search-products")
def search_products(
    category: Optional[str] = Query(None),
    name: Optional[str] = Query(None)
):
    try:
        query = supabase.table("products_marketplace").select(
            "*, exporter:exporter_id(name, company_name, country, email)"
        )

        if category:
            query = query.filter("category", "ilike", f"%{category}%")

        if name:
            query = query.filter("product_name", "ilike", f"%{name}%")

        response = query.execute()

        products = []
        for product in response.data:
            exporter = product.get("exporter") or {}
            products.append({
                "product_id": product.get("id"),
                "product_name": product.get("product_name"),
                "category": product.get("category"),
                "description": product.get("description"),
                "price": product.get("price"),
                "minimum_order_quantity": product.get("minimum_order_quantity"),
                "production_capacity": product.get("production_capacity"),
                "exporter_name": exporter.get("name"),
                "exporter_company": exporter.get("company_name"),
                "exporter_country": exporter.get("country"),
                "contact_email": exporter.get("email"),
                "contact_phone": None
            })

        return products
    except Exception as e:
        msg = getattr(e, 'args', [str(e)])[0] if getattr(e, 'args', None) else str(e)
        if isinstance(msg, dict):
            msg = msg.get('message', str(msg))
        if msg and "products_marketplace" in str(msg):
            return []

        print("[products.search_products] error:", msg)
        return []


@router.post("/trade-request")
def create_trade_request(
    product_id: int,
    buyer_name: str,
    buyer_country: str,
    quantity: int
):
    data = {
        "product_id": product_id,
        "buyer_name": buyer_name,
        "buyer_country": buyer_country,
        "quantity": quantity,
        "status": "pending"
    }

    response = supabase.table("trade_requests").insert(data).execute()

    return {
        "message": "Trade request submitted successfully",
        "data": response.data
    }
