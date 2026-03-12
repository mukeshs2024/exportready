"""
AI Intelligence routes — Market Analysis, HS Code, Export Chat, Scheme Recommender.
All Claude calls use ANTHROPIC_API_KEY from environment (.env).
"""

import os
import json
import requests
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
_CLAUDE_URL = "https://api.anthropic.com/v1/messages"
_CLAUDE_MODEL = "claude-3-haiku-20240307"


def _call_claude(prompt: str, max_tokens: int = 1024) -> str:
    """Call Claude API and return the text content of the first message block."""
    if not _API_KEY:
        raise HTTPException(
            status_code=503,
            detail="ANTHROPIC_API_KEY not configured. Add it to your .env file."
        )
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
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="AI service timed out. Please retry.")
    except requests.exceptions.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"AI service unreachable: {exc}")

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"AI service returned {response.status_code}: {response.text[:200]}"
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

@router.post("/market-analysis-ai")
def ai_market_analysis(product: str):
    """
    Returns AI-generated market intelligence cards for a product.
    Each card contains: country, demand_index, import_volume, tariff,
    best_route, and a list of top buyers.
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

    text = _call_claude(prompt, max_tokens=1200)
    try:
        markets = _extract_json(text, array=True)
        return {"product": product, "markets": markets}
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI market response: {exc}")


# ---------------------------------------------------------------------------
# 2. HS Code AI Suggestion
# ---------------------------------------------------------------------------

@router.get("/hs-suggest")
def hs_suggest(product: str):
    """
    Returns the suggested HS Code and description for a given product.
    """
    prompt = f"""You are an international trade classification expert.

Suggest the most accurate HS Code for this product: {product}

Return ONLY a valid JSON object — no markdown, no explanation:
{{
  "hs_code": "1006.30",
  "description": "Semi milled or wholly milled rice, whether or not polished or glazed",
  "chapter": "Chapter 10 - Cereals"
}}"""

    text = _call_claude(prompt, max_tokens=250)
    try:
        return _extract_json(text, array=False)
    except (ValueError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse HS code response: {exc}")


# ---------------------------------------------------------------------------
# 3. Context-Aware Export Chat
# ---------------------------------------------------------------------------

@router.post("/export-chat")
def export_chat(question: str, product: str = ""):
    """
    Context-aware AI chat that knows the user's product.
    Returns a practical export advisory answer.
    """
    product_context = f"The user is exporting: {product}\n\n" if product.strip() else ""

    prompt = f"""You are an expert export advisor for Indian MSMEs exporting globally.

{product_context}User question: {question}

Give a concise, actionable answer (under 220 words) covering relevant points from:
- Market timing and demand outlook
- Tariff advantages or risks
- Compliance and documentation tips
- Recommended immediate next action

Be practical, specific, and encouraging."""

    text = _call_claude(prompt, max_tokens=450)
    return {"answer": text, "product": product}


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
