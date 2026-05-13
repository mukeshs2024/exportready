# TradeOS — Operating system for Indian SME exporters

TradeOS is a focused B2B SaaS platform that helps Indian SME exporters run export operations like a modern, serious business.

This repository contains the backend services (FastAPI) and the React frontend. The product is intentionally narrow and operational: it centers on three core modules — DocEngine, ComplianceCore, and ShipmentHub — and removes marketplace and generic analytics features in favor of an enterprise-grade workflow product.

## Core product

TradeOS prioritizes three operational systems:

1. DocEngine — AI-first document generation (Commercial Invoice, Packing List, Certificate of Origin, Proforma Invoice, Shipping Bill Draft, Letter of Credit helpers).
2. ComplianceCore — HS code intelligence, required certificates, destination rules, and real-time compliance alerts.
3. ShipmentHub — shipment pipeline, milestones, activity feed, and operational tracking.

Everything else (marketplace, opportunity scanner, generic AI chat pages, gamified readiness scores) has been intentionally removed or deprioritized.

## Design system

Colors
- Primary: `#0D1B4C`
- Secondary: `#2563EB`
- Accent: `#F5A623`
- Background: `#FAFAFA`
- Cards: `#FFFFFF`
- Borders: `#E5E7EB`
- Text: `#111827` / `#374151`

Typography: Inter (strong hierarchy, large clean headings).

Visual: modern B2B SaaS — minimal, spacious, soft shadows, rounded corners, subtle animations.

## UX & product focus

- Platform should feel operational and enterprise-grade (Stripe Dashboard / Linear style).
- AI is embedded inline and contextually (document autofill, HS suggestions, compliance warnings), not as a generic chatbot.
- The main navigation and UX centers on `Dashboard`, `Documents`, `Compliance`, `Shipments`, `Billing`, and `Settings`.

## Local development

Requirements
- Node 18+, npm
- Python 3.10+ (for backend)

Backend (development)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend (development)

```powershell
cd frontend
npm install
npm start
```

- Frontend runs on `http://localhost:3000` by default.
- Backend runs on `http://localhost:8000` by default.

API base URL can be configured via `frontend/.env` or `REACT_APP_API_URL` environment variable.

## Developer notes — wiring and fallbacks

- `frontend/src/services/api.js` exposes an Axios instance pointed at `http://127.0.0.1:8000` by default.
- The dashboard UI is intentionally operational: it fetches live endpoints for the shipment pipeline, compliance alerts, recent documents, and activity feed. Each fetch has a safe client-side fallback so the UI remains useful during local development.

Suggested backend endpoints (phase 1)
- `GET /shipments/pipeline` — returns an array of pipeline stages with `{ id, label, count, progress, note }`.
- `GET /compliance/alerts` — returns active compliance alerts `{ severity, title, shipment, deadlineHours }`.
- `GET /documents/recent` — returns recent documents `{ type, shipment, status }`.
- `GET /activity` — returns recent activity items `{ time, text, shipment }`.

If these endpoints are not present, the frontend will use demo data so the dashboard remains operational.

## Files of interest

- `frontend/src/pages/Dashboard.js` — redesigned dashboard with operational pipeline, alerts, recent documents, and activity feed.
- `frontend/src/pages/tradeos/DocEngine.js` — DocEngine placeholder page.
- `frontend/src/pages/tradeos/ComplianceCore.js` — ComplianceCore placeholder page.
- `frontend/src/pages/tradeos/ShipmentHub.js` — ShipmentHub placeholder page.
- `frontend/src/pages/Landing.js` — TradeOS public landing (/welcome).
- `frontend/src/App.css` — TradeOS design tokens and layout refinements (sidebar active state, responsive hero, pipeline spacing).

## Roadmap (phase plan)

Phase 1 — DocEngine (priority)
- AI document generator wizard (Product → Buyer → Shipment → Generate → Preview/PDF)
- Templates, save, and PDF export

Phase 2 — ComplianceCore
- HS classification helper, rule engine, country panels, and required-doc checklist

Phase 3 — ShipmentHub
- Operational pipeline, milestones, activity feed, and multi-user collaboration

## Contributing

- Keep PRs focused on the three core modules and consistent with the TradeOS design system.
- Include screenshots for UI changes and add tests for new backend endpoints where applicable.

## Security

- Do not commit secrets. Use `.env` for API keys and service credentials.
- Replace local dev auth with a secure identity provider for production (Supabase/Auth0/Keycloak/JWT).

---

This README replaces the previous ExportReady orientation and documents the TradeOS focus, design system, developer workflow, and integration expectations.
