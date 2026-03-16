"""
Export Opportunity Score Engine.

Formula (per user spec):
  raw = (demand_score × 6) + (growth_score × 3) − (competition_score × 2)
  clamped to 0–100.

demand_score is expected on a 0–10 scale.
If the caller passes a 0–100 value it is normalised automatically.
"""

import random


def calculate_export_score(demand_score: float) -> dict:
    """
    Returns growth, competition and the composite export opportunity score
    for a single market given its demand score.

    Parameters
    ----------
    demand_score : float
        Demand score, either 0-10 or 0-100 (auto-normalised).

    Returns
    -------
    dict with keys:
        growth_score       – float, 6.5–8.5
        competition_score  – float, 3.0–6.0
        export_score       – int,   0–100
    """
    # Normalise to 0-10 scale if caller sent 0-100
    ds = demand_score / 10.0 if demand_score > 10 else float(demand_score)

    growth_score      = round(random.uniform(6.5, 8.5), 1)
    competition_score = round(random.uniform(3.0, 6.0), 1)

    raw   = (ds * 6) + (growth_score * 3) - (competition_score * 2)
    score = max(0, min(100, round(raw)))

    return {
        "growth_score":      growth_score,
        "competition_score": competition_score,
        "export_score":      score,
    }


def enrich_markets(markets: list[dict]) -> list[dict]:
    """
    Accepts a list of market dicts (each must have 'demand_score' or
    'demand_index') and returns them enriched with score engine output.
    """
    enriched = []
    for market in markets:
        demand = (
            market.get("demand_score")
            or market.get("demand_index")
            or 7.0
        )
        score_data = calculate_export_score(float(demand))
        enriched.append({**market, **score_data})
    return enriched
