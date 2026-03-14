from fastapi import APIRouter, HTTPException
from database.connection import supabase

router = APIRouter()

MAX_NEGOTIATION_ROUNDS = 3
PRICE_VARIANCE = 0.2


def _get_product(product_id: int) -> dict:
    response = supabase.table("products_marketplace").select("*").eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]


def _get_order(order_id: int) -> dict:
    response = supabase.table("orders").select("*").eq("id", order_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return response.data[0]


def _get_offers(order_id: int) -> list:
    response = supabase.table("offers").select("*").eq("order_id", order_id).order("created_at").execute()
    return response.data or []


def _create_notification(user_id: int, order_id: int, note_type: str, message: str):
    supabase.table("notifications").insert({
        "user_id": user_id,
        "order_id": order_id,
        "type": note_type,
        "message": message
    }).execute()


def _validate_buyer_price(product: dict, offer_price: float):
    base_price = float(product.get("price") or 0)
    min_price = base_price * (1 - PRICE_VARIANCE)
    max_price = base_price * (1 + PRICE_VARIANCE)
    if offer_price < min_price or offer_price > max_price:
        raise HTTPException(
            status_code=400,
            detail=f"Offer must be between ${min_price:.2f} and ${max_price:.2f}"
        )


@router.post("/orders")
def create_order(
    product_id: int,
    buyer_id: int,
    quantity: int,
    offer_price: float,
    delivery_country: str,
    message: str = ""
):
    product = _get_product(product_id)
    minimum_order = product.get("minimum_order_quantity") or 0
    if quantity < minimum_order:
        raise HTTPException(status_code=400, detail=f"Quantity must be at least {minimum_order}")

    if offer_price <= 0:
        raise HTTPException(status_code=400, detail="Offer price must be greater than 0")

    if not delivery_country:
        raise HTTPException(status_code=400, detail="Delivery country is required")

    _validate_buyer_price(product, offer_price)

    seller_id = product.get("exporter_id")
    if not seller_id:
        raise HTTPException(status_code=400, detail="Exporter not found for this product")

    order_data = {
        "product_id": product_id,
        "buyer_id": buyer_id,
        "seller_id": seller_id,
        "quantity": quantity,
        "delivery_country": delivery_country,
        "status": "negotiating"
    }

    order_response = supabase.table("orders").insert(order_data).execute()
    if not order_response.data:
        raise HTTPException(status_code=500, detail="Failed to create order")

    order = order_response.data[0]
    offer_data = {
        "order_id": order.get("id"),
        "sender_id": buyer_id,
        "price": offer_price,
        "message": message,
        "round_number": 1
    }

    supabase.table("offers").insert(offer_data).execute()

    _create_notification(
        user_id=seller_id,
        order_id=order.get("id"),
        note_type="new_order",
        message=f"New offer received for {product.get('product_name')}"
    )

    return {
        "order": order,
        "offer": offer_data
    }


@router.get("/buyer/orders")
def list_buyer_orders(buyer_id: int):
    response = supabase.table("orders").select(
        "*, product:product_id(id, product_name, price, minimum_order_quantity), seller:seller_id(id, name, company_name, country)",
        count="exact"
    ).eq("buyer_id", buyer_id).order("created_at", desc=True).execute()

    orders = []
    for order in response.data or []:
        last_offer = supabase.table("offers").select("*").eq("order_id", order.get("id")).order("created_at", desc=True).limit(1).execute()
        last_offer_data = last_offer.data[0] if last_offer.data else None
        offers_count = supabase.table("offers").select("id", count="exact").eq("order_id", order.get("id")).execute()

        orders.append({
            "order_id": order.get("id"),
            "status": order.get("status"),
            "quantity": order.get("quantity"),
            "delivery_country": order.get("delivery_country"),
            "product": order.get("product") or {},
            "seller": order.get("seller") or {},
            "last_offer": last_offer_data,
            "round_count": offers_count.count or 0,
            "max_rounds": MAX_NEGOTIATION_ROUNDS
        })

    return {
        "items": orders,
        "total": response.count or len(orders)
    }


@router.get("/orders/{order_id}")
def get_order_detail(order_id: int):
    response = supabase.table("orders").select(
        "*, product:product_id(*), seller:seller_id(id, name, company_name, country), buyer:buyer_id(id, name, company_name, country, email, phone)")
    response = response.eq("id", order_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = response.data[0]
    offers = _get_offers(order_id)
    buyer_contact = None
    if order.get("status") == "accepted":
        buyer_contact = order.get("buyer")

    return {
        "order": {
            "id": order.get("id"),
            "status": order.get("status"),
            "quantity": order.get("quantity"),
            "delivery_country": order.get("delivery_country"),
            "created_at": order.get("created_at"),
            "buyer_id": order.get("buyer_id")
        },
        "product": order.get("product") or {},
        "seller": order.get("seller") or {},
        "buyer_contact": buyer_contact,
        "offers": offers,
        "round_count": len(offers),
        "max_rounds": MAX_NEGOTIATION_ROUNDS
    }


@router.post("/orders/{order_id}/offers")
def add_offer(order_id: int, sender_id: int, price: float, message: str = ""):
    order = _get_order(order_id)
    if order.get("status") in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Order is already closed")
    offers = _get_offers(order_id)
    round_number = len(offers) + 1

    if round_number > MAX_NEGOTIATION_ROUNDS:
        raise HTTPException(status_code=400, detail="Negotiation rounds exceeded. Open chat to continue.")

    product = _get_product(order.get("product_id"))
    _validate_buyer_price(product, price)
    if sender_id == order.get("buyer_id"):
        _create_notification(
            user_id=order.get("seller_id"),
            order_id=order_id,
            note_type="buyer_counter",
            message=f"Buyer sent a counter offer for order #{order_id}"
        )

    offer_data = {
        "order_id": order_id,
        "sender_id": sender_id,
        "price": price,
        "message": message,
        "round_number": round_number
    }

    supabase.table("offers").insert(offer_data).execute()

    if order.get("status") not in ["accepted", "rejected"]:
        supabase.table("orders").update({"status": "negotiating"}).eq("id", order_id).execute()

    return offer_data


@router.post("/orders/{order_id}/accept")
def accept_order(order_id: int, actor_id: int = 0):
    response = supabase.table("orders").update({"status": "accepted"}).eq("id", order_id).execute()
    if response.data:
        order = response.data[0]
        if actor_id and actor_id == order.get("buyer_id"):
            _create_notification(
                user_id=order.get("seller_id"),
                order_id=order_id,
                note_type="buyer_accepted",
                message=f"Buyer accepted the counter offer for order #{order_id}"
            )
    return {"message": "Order accepted", "data": response.data}


@router.post("/orders/{order_id}/reject")
def reject_order(order_id: int):
    response = supabase.table("orders").update({"status": "rejected"}).eq("id", order_id).execute()
    return {"message": "Order rejected", "data": response.data}


@router.get("/exporter/orders")
def list_exporter_orders(exporter_id: int):
    response = supabase.table("orders").select(
        "*, product:product_id(id, product_name, price, minimum_order_quantity, country_of_origin)"
    ).eq("seller_id", exporter_id).order("created_at", desc=True).execute()

    orders = []
    for order in response.data or []:
        last_offer = supabase.table("offers").select("*").eq("order_id", order.get("id")).order("created_at", desc=True).limit(1).execute()
        last_offer_data = last_offer.data[0] if last_offer.data else None
        offers_count = supabase.table("offers").select("id", count="exact").eq("order_id", order.get("id")).execute()
        orders.append({
            "order_id": order.get("id"),
            "status": order.get("status"),
            "quantity": order.get("quantity"),
            "delivery_country": order.get("delivery_country"),
            "product": order.get("product") or {},
            "last_offer": last_offer_data,
            "round_count": offers_count.count or 0,
            "max_rounds": MAX_NEGOTIATION_ROUNDS
        })

    return {"items": orders}


@router.get("/exporter/orders/{order_id}")
def get_exporter_order_detail(order_id: int):
    response = supabase.table("orders").select(
        "*, product:product_id(*), buyer:buyer_id(id, name, company_name, country, email, phone)"
    ).eq("id", order_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")

    order = response.data[0]
    offers = _get_offers(order_id)
    buyer_contact = None
    if order.get("status") == "accepted":
        buyer_contact = order.get("buyer")

    buyer_contact = None
    if order.get("status") == "accepted":
        buyer_contact = order.get("buyer")

    return {
        "order": {
            "id": order.get("id"),
            "status": order.get("status"),
            "quantity": order.get("quantity"),
            "delivery_country": order.get("delivery_country"),
            "created_at": order.get("created_at"),
            "buyer_id": order.get("buyer_id")
        },
        "product": order.get("product") or {},
        "buyer": buyer_contact or {},
        "buyer_contact": buyer_contact,
        "offers": offers,
        "round_count": len(offers),
        "max_rounds": MAX_NEGOTIATION_ROUNDS
    }


@router.get("/exporter/dashboard")
def exporter_dashboard(exporter_id: int):
    products = supabase.table("products").select("id", count="exact").eq("seller_id", exporter_id).execute()
    orders = supabase.table("orders").select("id,status", count="exact").eq("seller_id", exporter_id).execute()
    active_negotiations = supabase.table("orders").select("id", count="exact").eq("seller_id", exporter_id).eq("status", "negotiating").execute()
    pending_orders = supabase.table("orders").select("id", count="exact").eq("seller_id", exporter_id).eq("status", "pending").execute()
    accepted_orders = supabase.table("orders").select("id", count="exact").eq("seller_id", exporter_id).eq("status", "accepted").execute()

    recent_notifications = supabase.table("notifications").select("*").eq("user_id", exporter_id).order("created_at", desc=True).limit(5).execute()

    return {
        "summary": {
            "total_products": products.count or 0,
            "active_negotiations": active_negotiations.count or 0,
            "pending_orders": pending_orders.count or 0,
            "accepted_orders": accepted_orders.count or 0
        },
        "recent_activity": recent_notifications.data or []
    }


@router.get("/notifications")
def list_notifications(user_id: int):
    response = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return response.data or []


@router.post("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int):
    response = supabase.table("notifications").update({"is_read": True}).eq("id", notification_id).execute()
    return {"message": "Notification marked as read", "data": response.data}
