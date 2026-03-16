from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from database.connection import supabase

router = APIRouter()


@router.post("/add-product")
def add_product(
    exporter_id: int,
    product_name: str,
    category: str,
    hs_code: str,
    price: float,
    min_order: int,
    country: str,
    description: Optional[str] = None,
    image_url: Optional[str] = None
):
    return create_exporter_product(
        exporter_id=exporter_id,
        product_name=product_name,
        category=category,
        hs_code=hs_code,
        price=price,
        min_order=min_order,
        country=country,
        description=description,
        image_url=image_url
    )


@router.post("/add-marketplace-product")
def add_marketplace_product(
    exporter_id: int,
    product_name: str,
    category: str,
    price: float,
    minimum_order_quantity: int,
    hs_code: Optional[str] = None,
    country_of_origin: Optional[str] = None,
    image_url: Optional[str] = None,
    description: Optional[str] = None,
    production_capacity: Optional[int] = None
):
    data = {
        "exporter_id": exporter_id,
        "product_name": product_name,
        "category": category,
        "hs_code": hs_code,
        "price": price,
        "minimum_order_quantity": minimum_order_quantity,
        "country_of_origin": country_of_origin,
        "image_url": image_url,
        "description": description,
        "production_capacity": production_capacity
    }

    try:
        response = supabase.table("products_marketplace").insert(data).execute()
    except Exception as e:
        msg = e.args[0] if e.args else str(e)
        if isinstance(msg, dict):
            msg = msg.get("message", str(msg))
        raise HTTPException(status_code=500, detail=f"Database error: {msg}")

    return {
        "message": "Marketplace product added successfully",
        "data": response.data
    }


def _format_product(product: dict) -> dict:
    seller = product.get("seller") or {}
    return {
        "product_id": product.get("id"),
        "product_name": product.get("product_name"),
        "category": product.get("category"),
        "hs_code": product.get("hs_code"),
        "description": product.get("description"),
        "price": product.get("price"),
        "minimum_order_quantity": product.get("min_order"),
        "country_of_origin": product.get("country"),
        "production_capacity": product.get("production_capacity"),
        "image_url": product.get("image_url"),
        "exporter_id": product.get("seller_id"),
        "exporter_name": seller.get("name"),
        "exporter_company": seller.get("company_name"),
        "exporter_country": seller.get("country")
    }


def _product_query():
    return supabase.table("products").select(
        "*, seller:seller_id(id, name, company_name, country)",
        count="exact"
    )


@router.get("/products")
def get_all_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50)
):
    try:
        start = (page - 1) * page_size
        end = start + page_size - 1
        response = _product_query().range(start, end).execute()

        products = [_format_product(product) for product in response.data]

        return {
            "items": products,
            "total": response.count or len(products),
            "page": page,
            "page_size": page_size
        }
    except Exception as e:
        # If the marketplace table doesn't exist yet, return an empty list.
        msg = getattr(e, 'args', [str(e)])[0] if getattr(e, 'args', None) else str(e)
        if isinstance(msg, dict):
            msg = msg.get('message', str(msg))
        if msg and "products" in str(msg):
            return {
                "items": [],
                "total": 0,
                "page": page,
                "page_size": page_size
            }
        # For other errors, log and return empty list so frontend can still render.
        print("[products.get_all_products] error:", msg)
        return {
            "items": [],
            "total": 0,
            "page": page,
            "page_size": page_size
        }


@router.get("/search-products")
def search_products(
    category: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    exporter_country: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50)
):
    try:
        start = (page - 1) * page_size
        end = start + page_size - 1
        query = _product_query()

        if category:
            query = query.filter("category", "ilike", f"%{category}%")

        if name:
            query = query.filter("product_name", "ilike", f"%{name}%")

        if exporter_country:
            query = query.filter("seller.country", "ilike", f"%{exporter_country}%")

        response = query.range(start, end).execute()

        products = [_format_product(product) for product in response.data]

        return {
            "items": products,
            "total": response.count or len(products),
            "page": page,
            "page_size": page_size
        }
    except Exception as e:
        msg = getattr(e, 'args', [str(e)])[0] if getattr(e, 'args', None) else str(e)
        if isinstance(msg, dict):
            msg = msg.get('message', str(msg))
        if msg and "products" in str(msg):
            return {
                "items": [],
                "total": 0,
                "page": page,
                "page_size": page_size
            }

        print("[products.search_products] error:", msg)
        return {
            "items": [],
            "total": 0,
            "page": page,
            "page_size": page_size
        }


@router.get("/marketplace")
def marketplace_products(
    category: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    exporter_country: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50)
):
    return search_products(
        category=category,
        name=name,
        exporter_country=exporter_country,
        page=page,
        page_size=page_size
    )


@router.get("/marketplace/products/{product_id}")
def get_marketplace_product(product_id: int):
    try:
        response = _product_query().eq("id", product_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")

        return _format_product(response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        msg = getattr(e, 'args', [str(e)])[0] if getattr(e, 'args', None) else str(e)
        if isinstance(msg, dict):
            msg = msg.get('message', str(msg))
        raise HTTPException(status_code=500, detail=f"Failed to load product: {msg}")


@router.post("/exporter/products")
def create_exporter_product(
    exporter_id: int,
    product_name: str,
    category: str,
    hs_code: str,
    price: float,
    min_order: int,
    country: str,
    description: Optional[str] = None,
    image_url: Optional[str] = None
):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")
    if min_order <= 0:
        raise HTTPException(status_code=400, detail="Minimum order must be greater than 0")

    product_data = {
        "seller_id": exporter_id,
        "product_name": product_name,
        "category": category,
        "hs_code": hs_code,
        "price": price,
        "min_order": min_order,
        "description": description,
        "country": country,
        "image_url": image_url
    }

    product_response = supabase.table("products").insert(product_data).execute()
    if not product_response.data:
        raise HTTPException(status_code=500, detail="Failed to create product")

    marketplace_data = {
        "exporter_id": exporter_id,
        "product_name": product_name,
        "category": category,
        "hs_code": hs_code,
        "price": price,
        "minimum_order_quantity": min_order,
        "country_of_origin": country,
        "image_url": image_url,
        "description": description
    }

    try:
        marketplace_response = supabase.table("products_marketplace").insert(marketplace_data).execute()
    except Exception as e:
        msg = e.args[0] if e.args else str(e)
        if isinstance(msg, dict):
            msg = msg.get("message", str(msg))
        raise HTTPException(status_code=500, detail=f"Marketplace error: {msg}")

    return {
        "product": product_response.data[0],
        "marketplace": marketplace_response.data[0]
    }


@router.get("/exporter/products")
def list_exporter_products(exporter_id: int):
    response = supabase.table("products").select("*").eq("seller_id", exporter_id).order("created_at", desc=True).execute()
    return response.data or []


@router.get("/exporter/products/{product_id}")
def get_exporter_product(product_id: int):
    response = supabase.table("products").select("*").eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]


@router.put("/exporter/products/{product_id}")
def update_exporter_product(
    product_id: int,
    exporter_id: int,
    product_name: str,
    category: str,
    hs_code: str,
    price: float,
    min_order: int,
    country: str,
    description: Optional[str] = None,
    image_url: Optional[str] = None
):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")
    if min_order <= 0:
        raise HTTPException(status_code=400, detail="Minimum order must be greater than 0")

    existing = supabase.table("products").select("product_name").eq("id", product_id).eq("seller_id", exporter_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")
    previous_name = existing.data[0].get("product_name")

    product_response = supabase.table("products").update({
        "product_name": product_name,
        "category": category,
        "hs_code": hs_code,
        "price": price,
        "min_order": min_order,
        "description": description,
        "country": country,
        "image_url": image_url
    }).eq("id", product_id).eq("seller_id", exporter_id).execute()

    marketplace_response = supabase.table("products_marketplace").update({
        "product_name": product_name,
        "category": category,
        "hs_code": hs_code,
        "price": price,
        "minimum_order_quantity": min_order,
        "country_of_origin": country,
        "image_url": image_url,
        "description": description
    }).eq("product_name", previous_name).eq("exporter_id", exporter_id).execute()

    return {
        "product": product_response.data[0],
        "marketplace": marketplace_response.data[0] if marketplace_response.data else None
    }


@router.delete("/exporter/products/{product_id}")
def delete_exporter_product(product_id: int, exporter_id: int):
    existing = supabase.table("products").select("product_name").eq("id", product_id).eq("seller_id", exporter_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Product not found")

    response = supabase.table("products").delete().eq("id", product_id).eq("seller_id", exporter_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")

    supabase.table("products_marketplace").delete().eq("exporter_id", exporter_id).eq("product_name", existing.data[0].get("product_name")).execute()

    return {"message": "Product deleted"}


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
