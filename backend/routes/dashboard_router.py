from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from auth import get_current_user  # Returns Supabase JWT-verified user

router = APIRouter(prefix="/api/v1", tags=["Dashboard"])


# ─── Response Schema ─────────────────────────────────────────────────────────

class DashboardResponse(BaseModel):
    readiness_score: int                   # 0–100, computed from completed/total
    next_action: str                       # First High priority + Not Started doc
    pending_documents: List[str]           # Names of all non-completed docs
    pending_documents_count: int           # ✅ NEW: bonus field from SQL upgrade
    completed_documents: int
    total_documents: int
    active_plan: Optional[str]
    target_market: Optional[str]

    class Config:
        from_attributes = True


# ─── Endpoint ────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)  # Supabase JWT decoded user
):
    """
    Returns dashboard summary for the authenticated user.
    Uses Supabase auth.uid() pattern — no :user_id placeholder.
    All SQL is safe against division-by-zero via NULLIF.
    """

    user_id = current_user.id  # UUID from Supabase JWT

    # ── Query 1: Readiness Score (NULLIF prevents division by zero) ──────────
    #
    # CHANGE LOG:
    #   ❌ Old: COUNT(*) in denominator → crashes if 0 rows
    #   ✅ New: NULLIF(COUNT(*), 0) → returns NULL instead of crash
    #   ❌ Old: WHERE user_id = :user_id → Supabase SQL editor syntax error
    #   ✅ New: WHERE user_id = :uid → standard SQLAlchemy bindparam
    #
    score_result = db.execute(
        text("""
            SELECT
                COUNT(*)                                                        AS total_documents,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)          AS completed_documents,
                SUM(CASE WHEN status != 'Completed' THEN 1 ELSE 0 END)         AS pending_documents_count,
                ROUND(
                    (SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::DECIMAL
                    / NULLIF(COUNT(*), 0)) * 100, 0
                )                                                               AS readiness_score
            FROM user_documents
            WHERE user_id = :uid
        """),
        {"uid": user_id}
    ).fetchone()

    # Guard: no documents at all
    if not score_result or score_result.total_documents == 0:
        raise HTTPException(
            status_code=404,
            detail="No documents found. Please upload your export documents first."
        )

    total               = int(score_result.total_documents)
    completed           = int(score_result.completed_documents)
    pending_count       = int(score_result.pending_documents_count)
    # NULLIF returns NULL if total=0 — we coerce to 0 safely
    readiness_score     = int(score_result.readiness_score or 0)

    # ── Query 2: Pending document names (status != 'Completed') ─────────────
    pending_rows = db.execute(
        text("""
            SELECT document_name, priority, status
            FROM user_documents
            WHERE user_id = :uid
              AND status != 'Completed'
            ORDER BY
                CASE priority
                    WHEN 'High'   THEN 1
                    WHEN 'Medium' THEN 2
                    WHEN 'Low'    THEN 3
                    ELSE 4
                END ASC
        """),
        {"uid": user_id}
    ).fetchall()

    pending_documents = [row.document_name for row in pending_rows]

    # ── Next Action: First High priority, Not Started ────────────────────────
    next_action = "All documents completed 🎉"
    for row in pending_rows:
        if row.priority == "High" and row.status == "Not Started":
            next_action = f"Complete {row.document_name}"
            break

    # ── Query 3: Active export plan ──────────────────────────────────────────
    plan = db.execute(
        text("""
            SELECT plan_name, target_country
            FROM export_plans
            WHERE user_id = :uid
              AND plan_status = 'Active'
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {"uid": user_id}
    ).fetchone()

    return DashboardResponse(
        readiness_score=readiness_score,
        next_action=next_action,
        pending_documents=pending_documents,
        pending_documents_count=pending_count,       # ✅ NEW field
        completed_documents=completed,
        total_documents=total,
        active_plan=plan.plan_name if plan else None,
        target_market=plan.target_country if plan else None,
    )
