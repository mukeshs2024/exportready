"""
Export Reports endpoint — save and retrieve analysis history.
Stores every AI Market Intelligence result in the export_reports table.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from database.connection import supabase

router = APIRouter()


class ReportIn(BaseModel):
    product: str
    top_market: str
    export_score: int
    demand_index: int | None = None
    growth_score: float | None = None
    competition_score: float | None = None


@router.post("/export-reports")
def save_report(report: ReportIn):
    """
    Persists one market analysis result to the export_reports table.
    Called fire-and-forget from the frontend after AI analysis succeeds.
    Silently ignores DB errors so the user flow is never interrupted.
    """
    try:
        payload = {
            "product": report.product,
            "top_market": report.top_market,
            "export_score": report.export_score,
            "demand_index": report.demand_index,
            "growth_score": report.growth_score,
            "competition_score": report.competition_score,
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
        }
        supabase.table("export_reports").insert(payload).execute()
        return {"status": "saved"}
    except Exception as exc:
        # Never break the UI over a reporting write failure
        return {"status": "skipped", "reason": str(exc)}


@router.get("/export-reports")
def get_reports(limit: int = 20):
    """
    Returns the most recent export analysis results for the history panel.
    """
    try:
        resp = (
            supabase.table("export_reports")
            .select("*")
            .order("analyzed_at", desc=True)
            .limit(limit)
            .execute()
        )
        return {"reports": resp.data or []}
    except Exception:
        return {"reports": []}
