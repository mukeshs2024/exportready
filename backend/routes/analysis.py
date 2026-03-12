from fastapi import APIRouter
from ai.market_analysis import get_recommended_markets, calculate_profit

router = APIRouter()


@router.get("/market-analysis")
def market_analysis(product_name: str):
    return get_recommended_markets(product_name)


@router.post("/profit-simulation")
def profit_simulation(
    product_price: float,
    production_cost: float,
    shipping_cost: float,
    duty_percentage: float
):
    return calculate_profit(product_price, production_cost, shipping_cost, duty_percentage)
