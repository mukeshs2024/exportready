"""
AI Intelligence routes — Market Analysis, HS Code, Export Chat, Scheme Recommender.
All Claude calls use ANTHROPIC_API_KEY from environment (.env).
"""

import os
import json
import re
import requests
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from database.connection import supabase
from ai.market_analysis import calculate_profit, get_recommended_markets

load_dotenv()

router = APIRouter()

_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
_CLAUDE_URL = "https://api.anthropic.com/v1/messages"
_CLAUDE_MODEL = "claude-3-haiku-20240307"

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


def _mmr_select(docs: list[dict[str, Any]], query: str, k: int = 5, fetch_k: int = 20,
                lambda_mult: float = 0.6) -> tuple[list[dict[str, Any]], float]:
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


# ---------------------------------------------------------------------------
# 1. AI Market Intelligence Cards
# ---------------------------------------------------------------------------

_MARKET_FALLBACK = [
    {"country": "UAE", "demand_index": 91, "import_volume": "$6.8B/year", "tariff": "0% (CEPA)", "best_route": "FOB Mumbai → Jebel Ali", "buyers": ["Al Maya Group", "Lulu Hypermarket", "Carrefour UAE"]},
    {"country": "USA", "demand_index": 87, "import_volume": "$12.4B/year", "tariff": "6-12% MFN", "best_route": "FOB JNPT → Los Angeles / New York", "buyers": ["Walmart", "Amazon Business", "Whole Foods"]},
    {"country": "Germany", "demand_index": 78, "import_volume": "$4.1B/year", "tariff": "3.5% EU GSP", "best_route": "FOB Mumbai → Hamburg", "buyers": ["Metro AG", "REWE Group", "Kaufland"]},
    {"country": "UK", "demand_index": 74, "import_volume": "$3.2B/year", "tariff": "4% UK GSP", "best_route": "FOB JNPT → Felixstowe", "buyers": ["Tesco", "Sainsbury's", "Asda"]},
    {"country": "Australia", "demand_index": 69, "import_volume": "$1.8B/year", "tariff": "0% ECTA", "best_route": "FOB Chennai → Sydney", "buyers": ["Woolworths AU", "Coles", "IGA"]},
]

@router.post("/market-analysis-ai")
def ai_market_analysis(product: str):
    """
    Returns AI-generated market intelligence cards for a product.
    Falls back to realistic static data when AI is unavailable.
    """
    prompt = f"""You are an international trade analyst specializing in Indian exports.

Analyze the top 5 export markets for this product: {product}

Return ONLY a valid JSON array — no markdown fences, no explanation — in exactly this format:
[
  {{
    "country": "USA",
    "demand_index": 94,
    "import_volume": "$8.2B/year",
    "tariff": "12%",
    "best_route": "FOB Mumbai → Los Angeles",
    "buyers": ["Walmart", "Target", "Amazon Business"]
  }}
]

Use realistic trade data. Provide exactly 5 entries."""

    try:
        text = _call_claude(prompt, max_tokens=1200)
        markets = _extract_json(text, array=True)
        return {"product": product, "markets": markets, "source": "ai"}
    except Exception:
        pass

    return {"product": product, "markets": _MARKET_FALLBACK, "source": "static"}


# ---------------------------------------------------------------------------
# 2. HS Code AI Suggestion
# ---------------------------------------------------------------------------

_HS_FALLBACK = {
    "rice": {"hs_code": "1006.30", "description": "Semi-milled or wholly milled rice", "chapter": "Chapter 10 - Cereals"},
    "wheat": {"hs_code": "1001.99", "description": "Wheat and meslin, other", "chapter": "Chapter 10 - Cereals"},
    "spice": {"hs_code": "0910.99", "description": "Spices, other", "chapter": "Chapter 09 - Coffee, Tea, Spices"},
    "turmeric": {"hs_code": "0910.30", "description": "Turmeric (curcuma)", "chapter": "Chapter 09 - Coffee, Tea, Spices"},
    "cotton": {"hs_code": "5201.00", "description": "Cotton, not carded or combed", "chapter": "Chapter 52 - Cotton"},
    "shirt": {"hs_code": "6205.20", "description": "Men's shirts of cotton", "chapter": "Chapter 62 - Apparel"},
    "garment": {"hs_code": "6211.42", "description": "Garments of cotton", "chapter": "Chapter 62 - Apparel"},
    "pharma": {"hs_code": "3004.90", "description": "Medicaments, other", "chapter": "Chapter 30 - Pharmaceutical"},
    "mobile": {"hs_code": "8517.12", "description": "Telephones for cellular networks", "chapter": "Chapter 85 - Electrical Machinery"},
    "software": {"hs_code": "8523.49", "description": "Recorded media for sound/data", "chapter": "Chapter 85 - Electrical Machinery"},
}

@router.get("/hs-suggest")
def hs_suggest(product: str):
    """
    Returns the suggested HS Code and description for a given product.
    Falls back to keyword-matched static table when AI is unavailable.
    """
    prompt = f"""You are an international trade classification expert.

Suggest the most accurate HS Code for this product: {product}

Return ONLY a valid JSON object — no markdown, no explanation:
{{
  "hs_code": "1006.30",
  "description": "Semi milled or wholly milled rice, whether or not polished or glazed",
  "chapter": "Chapter 10 - Cereals"
}}"""

    try:
        text = _call_claude(prompt, max_tokens=250)
        return _extract_json(text, array=False)
    except Exception:
        pass

    p = product.lower()
    for key, val in _HS_FALLBACK.items():
        if key in p:
            return val
    return {"hs_code": "9999.99", "description": product.title(), "chapter": "Chapter 99 - Miscellaneous"}


# ---------------------------------------------------------------------------
# 3. Context-Aware Export Chat
# ---------------------------------------------------------------------------


class ExportPlanRequest(BaseModel):
    product: str
    hs_code: str | None = None
    country: str | None = None
    product_price: float | None = None
    production_cost: float | None = None
    shipping_cost: float | None = None
    duty_percentage: float | None = None

@router.post("/export-chat")
def export_chat(
    question: str,
    product: str = "",
    country: str = "",
    session_id: str = "",
    hs_code: str = "",
    target_region: str = "",
    product_price: float | None = None,
    production_cost: float | None = None,
    shipping_cost: float | None = None,
    duty_percentage: float | None = None,
):
    """
    Structured export advisory response with intent routing, hybrid engines,
    Supabase-backed memory, and compliance RAG.
    """
    if not question or not question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    scan_match = re.match(r"^/scan-opportunity\s+(.*)", question.strip(), re.IGNORECASE)
    scan_mode = False
    if scan_match:
        scan_mode = True
        product = scan_match.group(1).strip() or product

    history = _load_chat_history(session_id, limit=6)
    memory_context = " ".join(
        [entry.get("content", "") for entry in history if entry.get("role") == "user"]
    )

    if not country:
        country = _detect_country(" ".join([question, memory_context]))

    scan_query = question
    if scan_mode:
        scan_parts = [f"global demand for {product}"]
        if hs_code:
            scan_parts.append(f"HS code {hs_code}")
        if target_region:
            scan_parts.append(f"in {target_region}")
        scan_query = " ".join(scan_parts)

    combined_query = " ".join([scan_query, memory_context]).strip()
    intent = "market" if scan_mode else intent_router(combined_query)

    engine = export_intelligence_engine(
        intent,
        scan_query,
        product,
        country,
        {
            "product_price": product_price,
            "production_cost": production_cost,
            "shipping_cost": shipping_cost,
            "duty_percentage": duty_percentage,
        },
        memory_context,
        target_region=target_region,
    )

    formatted = response_formatter(
        intent,
        question,
        product,
        country,
        engine,
        session_id,
        scan_mode=scan_mode,
        pricing={
            "product_price": product_price,
            "production_cost": production_cost,
            "shipping_cost": shipping_cost,
            "duty_percentage": duty_percentage,
        },
    )

    _save_chat_message(session_id, "user", question)
    _save_chat_message(session_id, "assistant", formatted.get("response", ""))

    return formatted


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
