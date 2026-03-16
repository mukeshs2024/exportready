"""
AI Intelligence routes — Market Analysis, HS Code, Export Chat, Scheme Recommender.
All Claude calls use ANTHROPIC_API_KEY from environment (.env).
"""

import os
import json
import re
import requests
import sys
import os as _os
sys.path.insert(0, _os.path.join(_os.path.dirname(__file__), ".."))
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
from database.connection import supabase
from ai.market_analysis import calculate_profit, get_recommended_markets
from export_score_engine import enrich_markets

load_dotenv()

router = APIRouter()

_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
_CLAUDE_URL = "https://api.anthropic.com/v1/messages"
_CLAUDE_MODEL = "claude-3-haiku-20240307"
_OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
_OPENAI_CLIENT = OpenAI(api_key=_OPENAI_KEY) if _OPENAI_KEY else None

# ---------------------------------------------------------------------------
# Export Advisor Architecture Helpers
# ---------------------------------------------------------------------------

_INTENT_KEYWORDS = {
    "compliance": ["document", "documents", "iec", "rcmc", "compliance", "certificate", "certification", "regulation"],
    "market": ["market", "markets", "country", "countries", "demand", "import", "export market"],
    "cost": ["profit", "cost", "margin", "price", "shipping", "duty", "tariff"],
    "process": ["how to export", "steps", "process", "roadmap", "start exporting", "register"],
}

_KNOWN_COUNTRIES = [
    "uae",
    "united arab emirates",
    "usa",
    "united states",
    "germany",
    "uk",
    "united kingdom",
    "saudi arabia",
    "singapore",
    "japan",
    "canada",
    "australia",
    "china",
    "philippines",
    "nigeria",
    "brazil",
]


def _load_region_countries() -> dict[str, list[str]]:
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "region_countries.json")
    try:
        with open(data_path, "r", encoding="utf-8") as handle:
            data = json.load(handle)
        return {k.lower(): v for k, v in data.items() if isinstance(v, list)}
    except (OSError, json.JSONDecodeError):
        return {
            "global": [],
            "middle east": ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"],
            "europe": ["Germany", "UK", "France", "Netherlands", "Italy", "Spain"],
            "north america": ["USA", "Canada", "Mexico"],
            "asia pacific": ["Japan", "Singapore", "Australia", "China", "Philippines"],
        }


_REGION_COUNTRIES = _load_region_countries()


def intent_router(query: str) -> str:
    q = (query or "").lower()
    for intent, keywords in _INTENT_KEYWORDS.items():
        if any(word in q for word in keywords):
            return intent
    return "general"


def _tokenize(text: str) -> set[str]:
    return {t for t in re.split(r"[^a-z0-9]+", text.lower()) if t}


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _mmr_select(
    docs: list[dict[str, Any]],
    query: str,
    k: int = 5,
    fetch_k: int = 20,
    lambda_mult: float = 0.6
) -> tuple[list[dict[str, Any]], float]:
    candidates = docs[:fetch_k]
    if not candidates:
        return [], 0.0

    query_tokens = _tokenize(query)
    scored = []
    for doc in candidates:
        tokens = _tokenize(doc.get("text", ""))
        scored.append({"doc": doc, "tokens": tokens, "score": _jaccard(query_tokens, tokens)})

    selected: list[dict[str, Any]] = []
    selected_tokens: list[set[str]] = []
    top_score = 0.0

    while scored and len(selected) < k:
        best = None
        best_value = -1.0
        for item in scored:
            relevance = item["score"]
            diversity = 0.0
            if selected_tokens:
                diversity = max(_jaccard(item["tokens"], t) for t in selected_tokens)
            value = lambda_mult * relevance - (1 - lambda_mult) * diversity
            if value > best_value:
                best_value = value
                best = item

        if not best:
            break

        scored.remove(best)
        selected.append(best["doc"])
        selected_tokens.append(best["tokens"])
        top_score = max(top_score, best["score"])

    return selected, top_score


def _detect_country(text: str) -> str:
    q = (text or "").lower()
    for country in _KNOWN_COUNTRIES:
        if country in q:
            return country.title() if country != "usa" else "USA"
    return ""


def _load_chat_history(session_id: str, limit: int = 6) -> list[dict[str, Any]]:
    if not session_id:
        return []
    try:
        result = (
            supabase.table("chat_history")
            .select("role, content, created_at")
            .eq("session_id", session_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        if result.data:
            return list(reversed(result.data))
    except Exception:
        pass
    return []


def _save_chat_message(session_id: str, role: str, content: str) -> None:
    if not session_id:
        return
    try:
        supabase.table("chat_history").insert({
            "session_id": session_id,
            "role": role,
            "content": content,
        }).execute()
    except Exception:
        pass


def _get_trade_data(country: str) -> dict[str, Any] | None:
    if not country:
        return None
    try:
        result = (
            supabase.table("country_trade_data")
            .select("country, region, tariff_percentage, competition_level, demand_score")
            .eq("country", country)
            .limit(1)
            .execute()
        )
        if result.data:
            return result.data[0]
    except Exception:
        return None
    return None


def _competition_weight(level: str) -> int:
    if not level:
        return 2
    val = level.lower()
    if val == "low":
        return 1
    if val == "high":
        return 3
    return 2


def _opportunity_score(demand_score: float, tariff: float, competition_level: str) -> float:
    return round((demand_score * 0.5) - (tariff * 0.2) - (_competition_weight(competition_level) * 0.3), 2)


def _why_market(country: str, demand_score: float, tariff: float, competition_level: str) -> list[str]:
    reasons: list[str] = []
    if demand_score >= 8.0:
        reasons.append("High import demand for your product")
    if tariff <= 5.0:
        reasons.append("Lower tariff relative to comparable markets")
    if competition_level.lower() == "low":
        reasons.append("Lower competition for new exporters")
    if country in {"UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain"}:
        reasons.append("Strong trade corridor with Indian exporters")
    return reasons[:3]


def market_engine(product: str, target_region: str = "") -> dict[str, Any]:
    markets: list[dict[str, Any]] = []
    source = "static"
    if product:
        try:
            result = (
                supabase.table("market_data")
                .select("country, demand_score, market_size")
                .ilike("product_name", f"%{product}%")
                .order("demand_score", desc=True)
                .limit(5)
                .execute()
            )
            if result.data:
                markets = result.data
                source = "db"
        except Exception:
            markets = []

    if not markets:
        fallback = get_recommended_markets(product or "")
        markets = [{"country": c, "demand_score": None, "market_size": None}
                   for c in fallback.get("recommended_markets", [])]
        source = "rule"

    region_key = (target_region or "").strip().lower()
    if region_key and region_key in _REGION_COUNTRIES and _REGION_COUNTRIES[region_key]:
        region_countries = set(_REGION_COUNTRIES[region_key])
        markets = [item for item in markets if item.get("country") in region_countries]

    return {"markets": markets, "source": source}


def compliance_rag(query: str, product: str, country: str, fetch_k: int = 20) -> dict[str, Any]:
    docs: list[dict[str, Any]] = []
    sources: list[dict[str, Any]] = []

    try:
        cert_query = supabase.table("export_certifications").select("id, product_category, certification_name, description")
        if product:
            cert_query = cert_query.ilike("product_category", f"%{product}%")
        cert_result = cert_query.limit(fetch_k).execute()
        for row in cert_result.data or []:
            text = f"Certification: {row.get('certification_name', '')}. {row.get('description', '')}."
            docs.append({"text": text, "type": "export_certifications", "id": row.get("id"), "name": row.get("certification_name")})
    except Exception:
        pass

    try:
        reg_query = supabase.table("country_regulations").select("id, country, product_category, required_certification, import_rules")
        if country:
            reg_query = reg_query.ilike("country", f"%{country}%")
        if product:
            reg_query = reg_query.ilike("product_category", f"%{product}%")
        reg_result = reg_query.limit(fetch_k).execute()
        for row in reg_result.data or []:
            text = f"Country: {row.get('country', '')}. Required: {row.get('required_certification', '')}. Rules: {row.get('import_rules', '')}."
            docs.append({"text": text, "type": "country_regulations", "id": row.get("id"), "country": row.get("country")})
    except Exception:
        pass

    selected, top_score = _mmr_select(docs, query, k=5, fetch_k=fetch_k)
    for doc in selected:
        sources.append({"type": doc.get("type"), "id": doc.get("id")})

    required_documents = [doc.get("name") for doc in selected if doc.get("type") == "export_certifications" and doc.get("name")]
    regulations = [doc.get("text") for doc in selected if doc.get("type") == "country_regulations"]

    return {
        "required_documents": required_documents,
        "regulations": regulations,
        "sources": sources,
        "retrieval_score": top_score,
    }


def compliance_engine(product: str, hs_code: str, country: str) -> list[str]:
    query = " ".join([product, hs_code, country]).strip()
    data = compliance_rag(query, product, country)
    if data.get("required_documents"):
        return data["required_documents"]

    return [
        "Import Export Code (IEC)",
        "Commercial Invoice",
        "Packing List",
        "Certificate of Origin",
    ]


def profit_simulator(
    product_price: float | None,
    production_cost: float | None,
    shipping_cost: float | None,
    duty_percentage: float | None,
) -> dict[str, Any] | None:
    if None in (product_price, production_cost, shipping_cost, duty_percentage):
        return None

    duty_cost = product_price * (duty_percentage / 100)
    total_cost = production_cost + shipping_cost + duty_cost
    profit = product_price - total_cost
    margin = (profit / product_price) * 100 if product_price else 0.0

    return {
        "selling_price": round(product_price, 2),
        "total_cost": round(total_cost, 2),
        "profit_per_unit": round(profit, 2),
        "profit_margin": round(margin, 1),
    }


def export_plan_profit_estimate(
    product_price: float | None,
    production_cost: float | None,
    shipping_cost: float | None,
    duty_percentage: float | None,
) -> dict[str, Any]:
    if None not in (product_price, production_cost, shipping_cost, duty_percentage):
        return profit_simulator(product_price, production_cost, shipping_cost, duty_percentage) or {}

    return {
        "selling_price": 12.0,
        "total_cost": 7.8,
        "profit_per_unit": 4.2,
        "profit_margin": 35.0,
    }


def export_intelligence_engine(
    intent: str,
    question: str,
    product: str,
    country: str,
    costs: dict[str, Any],
    memory_context: str,
    target_region: str = "",
) -> dict[str, Any]:
    query_context = " ".join([question, memory_context]).strip()

    result: dict[str, Any] = {
        "market": None,
        "compliance": None,
        "profit": None,
        "process": None,
    }

    if intent in {"market", "general"}:
        result["market"] = market_engine(product, target_region=target_region)

    if intent in {"compliance", "general"}:
        result["compliance"] = compliance_rag(query_context, product, country)

    if intent in {"cost", "general"}:
        result["profit"] = profit_simulator(
            costs.get("product_price"),
            costs.get("production_cost"),
            costs.get("shipping_cost"),
            costs.get("duty_percentage"),
        )

    if intent in {"process", "general"}:
        result["process"] = {
            "steps": [
                "Register your business legally",
                "Obtain Import Export Code (IEC)",
                "Register GST",
                "Identify export markets",
                "Prepare export documents",
                "Arrange shipping and logistics",
                "Receive international payments",
            ]
        }

    return result


def response_formatter(
    intent: str,
    question: str,
    product: str,
    country: str,
    engine: dict[str, Any],
    session_id: str,
    scan_mode: bool = False,
    pricing: dict[str, Any] | None = None,
) -> dict[str, Any]:
    compliance = engine.get("compliance") or {}
    market = engine.get("market") or {}
    profit = engine.get("profit") or {}
    process = engine.get("process") or {}

    retrieval_score = compliance.get("retrieval_score", 0.0) if compliance else 0.0
    if intent in {"compliance", "general"}:
        confidence_score = max(0.35, min(0.95, retrieval_score))
    elif intent == "market":
        confidence_score = 0.78
    elif intent == "cost":
        confidence_score = 0.72
    else:
        confidence_score = 0.66

    market_items = market.get("markets", [])
    market_insight = ""
    if market_items:
        top = market_items[0]
        if top.get("market_size"):
            market_insight = f"{top.get('country')} shows strong demand with market size {top.get('market_size')}"
        else:
            market_insight = f"Top market: {top.get('country')}"

    profit_estimate: dict[str, Any] = {}
    if profit:
        profit_value = profit.get("profit")
        if profit_value is not None:
            profit_estimate["estimated_margin"] = f"${profit_value:.2f} per unit"
        if profit.get("shipping_cost") is not None:
            profit_estimate["shipping_cost"] = f"${profit.get('shipping_cost'):.2f}"

    if intent == "market" and market_items:
        response_text = f"Top export markets identified for {product or 'your product'}."
    elif intent == "compliance" and compliance.get("required_documents"):
        response_text = (
            f"Exporting {product or 'your product'} to {country or 'the target market'} "
            "requires IEC and standard export documentation."
        )
    elif intent == "cost" and profit:
        response_text = f"Estimated profitability calculated for {product or 'your product'}."
    elif intent == "process":
        response_text = "Here is a step-by-step export roadmap."
    else:
        response_text = "Here is a structured export advisory response."

    cards = {
        "market_insight": market_insight,
        "required_documents": compliance.get("required_documents", []),
        "profit_estimate": profit_estimate,
        "next_steps": process.get("steps", []),
    }

    if scan_mode:
        price = (pricing or {}).get("product_price")
        production_cost = (pricing or {}).get("production_cost")
        shipping_cost = (pricing or {}).get("shipping_cost")
        duty_percentage = (pricing or {}).get("duty_percentage")

        enriched = []
        for item in market_items:
            country_name = item.get("country")
            trade = _get_trade_data(country_name) or {}
            tariff = trade.get("tariff_percentage")
            competition = trade.get("competition_level") or "Medium"
            demand_score = trade.get("demand_score") or item.get("demand_score") or 7.5
            if tariff is None:
                tariff = 5.0

            opportunity_score = _opportunity_score(float(demand_score), float(tariff), competition)
            profit_estimate = None
            if None not in (price, production_cost, shipping_cost):
                profit_estimate = profit_simulator(price, production_cost, shipping_cost, float(tariff))

            enriched.append({
                "country": country_name,
                "demand_score": demand_score,
                "market_size": item.get("market_size"),
                "tariff": tariff,
                "competition": competition,
                "opportunity_score": opportunity_score,
                "profit_estimate": profit_estimate,
                "why_market": _why_market(country_name, float(demand_score), float(tariff), competition),
                "ai_confidence": round(
                    0.6 + (min(10, float(demand_score)) / 10) * 0.35,
                    2,
                ),
            })

        enriched.sort(key=lambda row: row.get("opportunity_score") or 0, reverse=True)
        cards["market_opportunities"] = [
            {"rank": idx + 1, **row}
            for idx, row in enumerate(enriched)
        ]
        response_text = f"Opportunity scan completed for {product or 'your product'}."

    sources: list[str] = []
    for doc in compliance.get("sources", []):
        if doc.get("type") == "export_certifications" and doc.get("id"):
            sources.append("DGFT Export Policy")
        elif doc.get("type") == "country_regulations" and doc.get("id"):
            sources.append("India Trade Portal")
    sources = list(dict.fromkeys(sources))
    if not sources:
        sources = ["ExportReady Knowledge Base"]

    suggested_questions = [
        "Which countries import cotton shirts?",
        "What documents are needed for UAE export?",
        "Estimate profit exporting spices",
        "How to get IEC license?",
        "/scan-opportunity turmeric",
    ]

    response = {
        "intent": intent,
        "confidence": round(confidence_score, 2),
        "response": response_text,
        "cards": cards,
        "sources": sources,
        "suggested_questions": suggested_questions,
        "query": question,
        "product": product,
        "country": country,
        "session_id": session_id,
    }

    if confidence_score < 0.45 and intent in {"compliance", "general"}:
        response["cards"]["safety_notice"] = (
            "I could not find strong regulatory matches in the knowledge base. "
            "Please verify with DGFT or the India Trade Portal."
        )

    return response


def _call_claude(prompt: str, max_tokens: int = 1024) -> str:
    """Call Claude API and return the text content of the first message block.
    Raises RuntimeError on any failure so callers can fall through to fallbacks.
    """
    if not _API_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY not configured")
    try:
        response = requests.post(
            _CLAUDE_URL,
            headers={
                "x-api-key": _API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": _CLAUDE_MODEL,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
    except (requests.exceptions.Timeout, requests.exceptions.RequestException) as exc:
        raise RuntimeError(f"AI service unreachable: {exc}")

    if response.status_code != 200:
        raise RuntimeError(
            f"AI service returned {response.status_code}: {response.text[:200]}"
        )

    return response.json()["content"][0]["text"]


def _extract_json(text: str, array: bool = True) -> dict | list:
    """Extract the first JSON object or array from a Claude response string."""
    if array:
        start, end = text.find("["), text.rfind("]") + 1
    else:
        start, end = text.find("{"), text.rfind("}") + 1
    if start == -1 or end <= start:
        raise ValueError("No JSON found in response")
    return json.loads(text[start:end])


@router.get("/ai/opportunity-scanner")
def opportunity_scanner(product_name: str):
    try:
        market = supabase.table("market_data").select("*").eq("product_name", product_name).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to load market data: {exc}")

    results: list[dict[str, Any]] = []
    for row in market.data or []:
        trade = supabase.table("country_trade_data").select("*").eq("country", row["country"]).execute()
        if trade.data:
            tariff = trade.data[0].get("tariff_percentage", 0)
            competition = trade.data[0].get("competition_level", "")
            score = (row.get("demand_score", 0) or 0) - (tariff or 0)

            results.append({
                "country": row.get("country"),
                "demand_score": row.get("demand_score"),
                "tariff": tariff,
                "competition": competition,
                "opportunity_score": score
            })

    results.sort(key=lambda x: x.get("opportunity_score", 0), reverse=True)
    top = results[0] if results else None
    explanation = ""

    if top and _OPENAI_CLIENT:
        prompt = (
            "Explain why {country} is a good export market for {product}.\n"
            "Demand score: {demand}\n"
            "Tariff: {tariff}%\n"
            "Competition level: {competition}\n"
            "Give a short explanation for an MSME exporter."
        ).format(
            country=top.get("country"),
            product=product_name,
            demand=top.get("demand_score"),
            tariff=top.get("tariff"),
            competition=top.get("competition"),
        )
        try:
            ai = _OPENAI_CLIENT.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[{"role": "user", "content": prompt}],
            )
            explanation = (ai.choices[0].message.content or "").strip()
        except Exception:
            explanation = ""

    if not explanation and top:
        explanation = (
            f"{top.get('country')} has strong demand and a favorable tariff profile "
            "relative to other markets, making it a practical entry market for MSME exporters."
        )

    confidence = None
    if top is not None:
        score_value = top.get("opportunity_score")
        if score_value is not None:
            if score_value >= 4:
                confidence = "High"
            elif score_value >= 2:
                confidence = "Medium"
            else:
                confidence = "Low"

    return {
        "top_market": top.get("country") if top else None,
        "score": top.get("opportunity_score") if top else None,
        "confidence": confidence,
        "analysis": results[:3],
        "ai_explanation": explanation,
    }


@router.get("/ai/market-analysis")
def market_analysis(product_name: str):
    data = (
        supabase.table("market_data")
        .select("*")
        .ilike("product_name", f"%{product_name}%")
        .execute()
    )
    if not data.data:
        return {"status": "no_data"}
    return {"status": "success", "data": data.data}


@router.post("/market-analysis-ai")
def market_analysis_ai(product: str):
    """
    AI-driven market intelligence cards for a product.
    1. Tries Claude to generate rich per-country market cards.
    2. Falls back to rule-based market_engine + static enrichment.
    Either way, every market card is enriched with export_score,
    growth_score and competition_score via the score engine.
    """
    prompt = f"""You are a global trade analyst. Return market intelligence for exporting {product!r} from India.

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
{{
  "product": "{product}",
  "markets": [
    {{
      "country": "UAE",
      "demand_index": 88,
      "import_volume": "$4.2B annually",
      "tariff": "5%",
      "best_route": "Mumbai → Jebel Ali (sea)",
      "buyers": ["Al Futtaim Group", "Lulu Hypermarket"]
    }}
  ]
}}

Include the top 4 most promising import markets. Use realistic figures."""

    # --- Try Claude first ---
    try:
        raw = _call_claude(prompt, max_tokens=900)
        payload = _extract_json(raw, array=False)
        markets = payload.get("markets", [])
        if markets:
            enriched = enrich_markets(markets)
            return {"product": product, "markets": enriched}
    except Exception:
        pass

    # --- Try OpenAI ---
    if _OPENAI_CLIENT:
        try:
            resp = _OPENAI_CLIENT.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=900,
            )
            raw = (resp.choices[0].message.content or "").strip()
            payload = _extract_json(raw, array=False)
            markets = payload.get("markets", [])
            if markets:
                enriched = enrich_markets(markets)
                return {"product": product, "markets": enriched}
        except Exception:
            pass

    # --- Rule-based fallback ---
    engine = market_engine(product)
    base_markets = [
        {
            "country": m.get("country", "Unknown"),
            "demand_index": int((m.get("demand_score") or 7.5) * 10),
            "import_volume": m.get("market_size") or "N/A",
            "tariff": "~5%",
            "best_route": "Sea freight via Mumbai",
            "buyers": [],
        }
        for m in engine.get("markets", [])
    ]
    enriched = enrich_markets(base_markets)
    return {"product": product, "markets": enriched}


@router.get("/ai/demand-heatmap")
def demand_heatmap(product_name: str):
    data = (
        supabase.table("market_data")
        .select("country, demand_score")
        .eq("product_name", product_name)
        .execute()
    )
    return data.data or []


@router.post("/ai/profit-simulator")
def profit_simulator(product_id: int, country: str, shipping_cost: float, production_cost: float):
    product = supabase.table("products").select("*").eq("id", product_id).execute()
    if not product.data:
        raise HTTPException(status_code=404, detail="Product not found")

    price = product.data[0].get("price")

    trade = supabase.table("country_trade_data").select("*").eq("country", country).execute()
    if not trade.data:
        raise HTTPException(status_code=404, detail="Trade data not found for country")

    tariff = trade.data[0].get("tariff_percentage", 0)
    duties = (price or 0) * ((tariff or 0) / 100)

    profit = (price or 0) - (production_cost + shipping_cost + duties)

    return {
        "selling_price": price,
        "production_cost": production_cost,
        "shipping_cost": shipping_cost,
        "duties": duties,
        "estimated_profit": profit
    }


@router.get("/ai/export-readiness")
def export_readiness(has_iec: bool, production_capacity: int):
    score = 0
    if has_iec:
        score += 50
    if production_capacity > 500:
        score += 30
    if production_capacity > 2000:
        score += 20

    return {
        "readiness_score": score,
        "status": "Ready" if score >= 70 else "Needs Improvement"
    }


class ExportPlanRequest(BaseModel):
    product: str
    hs_code: str | None = None
    country: str | None = None
    product_price: float | None = None
    production_cost: float | None = None
    shipping_cost: float | None = None
    duty_percentage: float | None = None


@router.post("/generate-export-plan")
async def generate_export_plan(request: ExportPlanRequest):
    product = request.product
    hs_code = request.hs_code or ""
    country = request.country or ""
    product_price = request.product_price
    production_cost = request.production_cost
    shipping_cost = request.shipping_cost
    duty_percentage = request.duty_percentage

    markets = market_engine(product, target_region="")
    top_market = (markets.get("markets") or [{}])[0] if markets else {}
    market_insight = {
        "import_value": top_market.get("market_size") or "$1.1B annually",
        "demand_score": top_market.get("demand_score") or 8.6,
    }

    compliance = compliance_engine(product, hs_code, country)
    profit_estimate = export_plan_profit_estimate(
        product_price,
        production_cost,
        shipping_cost,
        duty_percentage,
    )

    roadmap = [
        "Register IEC",
        "Verify product compliance",
        "Prepare export documentation",
        "Connect with logistics partner",
    ]

    return {
        "product": product,
        "country": country,
        "hs_code": hs_code,
        "market_insight": market_insight,
        "compliance": compliance,
        "profit_estimate": profit_estimate,
        "roadmap": roadmap,
    }


# ---------------------------------------------------------------------------
# 4. Scheme Recommender (rule-based, fast — no AI call)
# ---------------------------------------------------------------------------

def _recommend_schemes(product: str) -> list:
    schemes = []
    p = product.lower()

    if any(k in p for k in ["rice", "wheat", "spice", "tea", "coffee", "fruit",
                              "vegetable", "agri", "cotton", "tobacco", "grain"]):
        schemes.append({
            "name": "RoDTEP",
            "benefit": "4% duty drawback on export value",
            "link": "https://www.dgft.gov.in"
        })
        schemes.append({
            "name": "APEDA Subsidy",
            "benefit": "₹2L certification grant for agri exporters",
            "link": "https://apeda.gov.in"
        })

    if any(k in p for k in ["handicraft", "handmade", "craft", "art", "jewelry", "jewellery"]):
        schemes.append({
            "name": "EPCH Market Development",
            "benefit": "Export Promotion Council for Handicrafts support & buyer matchmaking",
            "link": "https://epch.in"
        })

    if any(k in p for k in ["pharma", "medicine", "drug", "chemical", "biotech"]):
        schemes.append({
            "name": "PHARMEXCIL MDA",
            "benefit": "Market development assistance up to ₹10L",
            "link": "https://pharmexcil.com"
        })

    if any(k in p for k in ["textile", "garment", "fabric", "apparel", "shirt", "cloth"]):
        schemes.append({
            "name": "TUFS Scheme",
            "benefit": "Technology Upgradation Fund for textile exporters",
            "link": "https://texmin.nic.in"
        })

    if any(k in p for k in ["software", "it ", "tech", "digital", "saas"]):
        schemes.append({
            "name": "STPI Benefits",
            "benefit": "100% income tax exemption on export profits",
            "link": "https://stpi.in"
        })

    # Universal schemes always included
    schemes.append({
        "name": "ECGC Insurance",
        "benefit": "Export credit guarantee cover up to 90% against payment default",
        "link": "https://ecgc.in"
    })
    schemes.append({
        "name": "MEIS / RoDTEP",
        "benefit": "Merchandise export incentive — offsets embedded taxes",
        "link": "https://www.dgft.gov.in"
    })

    return schemes


@router.get("/scheme-recommend")
def scheme_recommend(product: str):
    """Returns applicable government export schemes for a product."""
    return {"product": product, "schemes": _recommend_schemes(product)}


# ---------------------------------------------------------------------------
# 5. Export Performance AI Insights
# ---------------------------------------------------------------------------

@router.post("/export-insights")
def export_insights(
    product: str = "",
    revenue: str = "$2.4M",
    markets: str = "UAE 42%, USA 31%, Germany 27%",
    shipments: int = 12,
):
    """
    Returns AI-generated performance insights as a list of bullet strings.
    Falls back to curated static insights when AI is unavailable.
    """
    product_ctx = f"Product: {product}\n" if product.strip() else ""
    prompt = f"""You are an expert export performance analyst for Indian exporters.

Analyze this exporter's data:
{product_ctx}Total Revenue: {revenue}
Shipments: {shipments}
Market Split: {markets}

Return ONLY a JSON array of exactly 4 insight strings — no markdown, no explanation.
Each must be a single sentence starting with one of these emojis:
• 💡 for market opportunity insights
• 📈 for growth trend observations
• ⚠️ for risk or cost warnings
• 🎯 for concrete recommended actions

Example: ["\ud83d\udca1 UAE performs 40% better due to India-UAE CEPA zero-tariff advantage"]"""

    try:
        text = _call_claude(prompt, max_tokens=400)
        insights = _extract_json(text, array=True)
        return {"insights": insights, "source": "ai"}
    except Exception:
        pass

    # Static fallback
    return {
        "insights": [
            "💡 UAE shows highest ROI due to India-UAE CEPA zero-tariff advantage on most textile categories",
            "📈 Germany demand for organic cotton apparel rising 18% YoY — consider increasing Q3 allocation",
            "⚠️ USD/INR at 83.2 could compress margins 3-4% — hedge forward contracts for next 2 quarters",
            "🎯 Increase UAE shipment to 50%+ and explore Saudi Arabia as 4th market to reduce concentration risk",
        ],
        "source": "static",
    }
