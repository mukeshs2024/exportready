"""
AI Compliance Check — returns a per-rule compliance table for a product + destination.
Uses Claude when API key is configured; graceful rule-based fallback otherwise.
"""

import os
from fastapi import APIRouter
from routes.ai_intelligence import _call_claude, _extract_json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Rule-based fallback compliance data
_RULE_TEMPLATES = {
    "default": [
        {"category": "Documentation", "item": "Import Export Code (IEC)", "status": "PASS", "detail": "Mandatory for all Indian exporters. Obtain from DGFT portal.", "action": None},
        {"category": "Documentation", "item": "GST Registration", "status": "PASS", "detail": "Required for export invoicing and GST refund claims.", "action": None},
        {"category": "Documentation", "item": "Commercial Invoice", "status": "PASS", "detail": "Standard document — no special certification needed.", "action": None},
        {"category": "Documentation", "item": "Certificate of Origin", "status": "WARN", "detail": "Required by most countries for preferential tariff treatment.", "action": "Apply through Chamber of Commerce"},
        {"category": "Documentation", "item": "Packing List", "status": "PASS", "detail": "Standard export document — prepare with shipment details.", "action": None},
        {"category": "Customs", "item": "Shipping Bill (ICEGATE)", "status": "WARN", "detail": "Must be filed on ICEGATE customs portal before shipment.", "action": "Register on ICEGATE portal"},
    ],
    "food": [
        {"category": "Certification", "item": "FSSAI Export Certificate", "status": "FAIL", "detail": "Mandatory for all food/agri exports from India.", "action": "Apply at FSSAI portal immediately"},
        {"category": "Certification", "item": "Phytosanitary Certificate", "status": "FAIL", "detail": "Required for plant-based products — issued by Agriculture Ministry.", "action": "Contact local Plant Quarantine office"},
        {"category": "Compliance", "item": "APEDA Registration", "status": "WARN", "detail": "Required for scheduled agricultural and processed food exports.", "action": "Register at APEDA portal"},
        {"category": "Inspection", "item": "Quality Inspection Certificate", "status": "WARN", "detail": "EIA/APEDA inspection required before loading.", "action": "Book APEDA pre-shipment inspection"},
        {"category": "Documentation", "item": "Health Certificate", "status": "PASS", "detail": "Required for destination country import clearance.", "action": None},
    ],
    "pharma": [
        {"category": "Licensing", "item": "Drug License (CDSCO)", "status": "FAIL", "detail": "Mandatory manufacturing and export license for pharmaceuticals.", "action": "Apply to CDSCO immediately"},
        {"category": "Certification", "item": "WHO-GMP Certificate", "status": "FAIL", "detail": "Required by most importing countries for pharma products.", "action": "Arrange WHO-GMP audit"},
        {"category": "Compliance", "item": "Certificate of Pharmaceutical Product (CoPP)", "status": "WARN", "detail": "Issued by CDSCO — required by many regulators.", "action": "Apply to CDSCO for CoPP"},
        {"category": "Documentation", "item": "Free Sale Certificate", "status": "WARN", "detail": "Confirms product is legally marketed in India.", "action": None},
    ],
    "electronics": [
        {"category": "Certification", "item": "BIS Certification", "status": "WARN", "detail": "Required for electronics sold in India; check destination requirements.", "action": "Verify destination country requirements"},
        {"category": "Compliance", "item": "CE Marking (EU)", "status": "FAIL", "detail": "Mandatory for electronics exported to European Union.", "action": "Engage notified body for CE marking"},
        {"category": "Compliance", "item": "FCC Certification (USA)", "status": "FAIL", "detail": "Required for electronic devices sold in the United States.", "action": "Apply for FCC certification"},
        {"category": "Compliance", "item": "RoHS Compliance", "status": "WARN", "detail": "Restriction of hazardous substances — required for EU/UK.", "action": "Obtain RoHS compliance declaration"},
    ],
    "textile": [
        {"category": "Documentation", "item": "Import Export Code (IEC)", "status": "PASS", "detail": "Mandatory for all Indian exporters.", "action": None},
        {"category": "Certification", "item": "OEKO-TEX Certification", "status": "FAIL", "detail": "Required for textile exports to premium markets (EU, USA, Germany).", "action": "Apply to nearest OEKO-TEX testing lab"},
        {"category": "Compliance", "item": "GOTS Organic Certification", "status": "WARN", "detail": "Required if marketing as organic cotton or sustainable textile.", "action": "Apply to GOTS-accredited certifier"},
        {"category": "Tariff", "item": "RoDTEP Scheme", "status": "WARN", "detail": "4% duty drawback available on textile exports.", "action": "File RoDTEP claim on ICEGATE"},
        {"category": "Documentation", "item": "Certificate of Origin", "status": "WARN", "detail": "Required for GSP/preferential tariff access.", "action": "Obtain from local Chamber of Commerce"},
    ],
}

_DEST_EXTRA = {
    "USA": [
        {"category": "Tariff", "item": "US MFN Import Duty", "status": "WARN", "detail": "Standard US MFN tariff applies — verify HS code rate on USITC.gov.", "action": "Check tariff at usitc.gov/tata"},
        {"category": "Regulatory", "item": "FDA Registration (food/pharma)", "status": "WARN", "detail": "Food and pharma exporters must register facility with US FDA.", "action": "Register on FDA FURLS portal"},
    ],
    "EU": [
        {"category": "Tariff", "item": "EU MFN Tariff", "status": "WARN", "detail": "Standard EU tariff applies. India-EU FTA not yet in force.", "action": "Explore EUR.1 certificate for GSP access"},
        {"category": "Regulatory", "item": "REACH Compliance", "status": "WARN", "detail": "Chemical substances regulation — required for chemicals/textiles.", "action": "Prepare REACH compliance dossier"},
    ],
    "UAE": [
        {"category": "Certification", "item": "Halal Certification (food)", "status": "FAIL", "detail": "Mandatory for food products exported to UAE.", "action": "Obtain Halal cert from ESMA-recognised body"},
        {"category": "Regulatory", "item": "Emirates Authority Approval", "status": "WARN", "detail": "Product registration may be required by MOIAT.", "action": "Check MOIAT product registration portal"},
    ],
    "UK": [
        {"category": "Compliance", "item": "UKCA Marking (post-Brexit)", "status": "WARN", "detail": "CE marking no longer valid in UK market — UKCA required for most goods.", "action": "Obtain UKCA marking via UK conformity body"},
    ],
    "GERMANY": [
        {"category": "Compliance", "item": "REACH & RoHS Compliance", "status": "WARN", "detail": "Germany strictly enforces EU chemical and substance restrictions.", "action": "Prepare REACH substance declaration"},
    ],
}


def _resolve_category(product: str) -> str:
    p = product.lower()
    if any(k in p for k in ["rice", "wheat", "food", "spice", "tea", "fruit", "agri", "vegetable", "coffee"]):
        return "food"
    if any(k in p for k in ["pharma", "medicine", "drug", "tablet", "capsule"]):
        return "pharma"
    if any(k in p for k in ["electronic", "mobile", "laptop", "circuit", "semiconductor"]):
        return "electronics"
    if any(k in p for k in ["textile", "garment", "fabric", "apparel", "shirt", "cloth", "cotton", "silk"]):
        return "textile"
    return "default"


def _compute_score(checks: list) -> tuple:
    """Derive an overall compliance score (0-100) and status label from a checks list."""
    if not checks:
        return 0, "NON-COMPLIANT"
    pts = {"PASS": 1.0, "WARN": 0.5, "FAIL": 0.0}
    score = round(sum(pts.get(c.get("status", "WARN"), 0.5) for c in checks) / len(checks) * 100)
    if score >= 80:
        label = "COMPLIANT"
    elif score >= 60:
        label = "NEEDS ATTENTION"
    elif score >= 40:
        label = "HIGH RISK"
    else:
        label = "NON-COMPLIANT"
    return score, label


@router.post("/compliance-check")
def compliance_check(product: str, country: str, hs_code: str = ""):
    """
    Returns a full compliance audit: overallScore, overallStatus, and checks table.
    Tries AI (Claude) first; falls back to rule-based templates.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "")

    if api_key:
        hs_note = f"HS Code: {hs_code}\n" if hs_code.strip() else ""
        prompt = f"""You are an Indian export compliance expert.

Check compliance for:
Product: {product}
Destination: {country}
{hs_note}
Return ONLY valid JSON — no markdown, no explanation:
{{
  "overallScore": 72,
  "overallStatus": "NEEDS ATTENTION",
  "checks": [
    {{"category": "Documentation", "item": "IEC Registration", "status": "PASS", "detail": "Required for Indian exporters", "action": null}},
    {{"category": "Tariff", "item": "Import Duty", "status": "WARN", "detail": "12% MFN tariff applies", "action": "Consider CEPA or GSP route"}},
    {{"category": "Certification", "item": "OEKO-TEX Certification", "status": "FAIL", "detail": "Required for textile exports to this market", "action": "Apply to nearest OEKO-TEX body"}}
  ]
}}

Status: "PASS" = compliant, "WARN" = action needed, "FAIL" = critical/blocking.
Provide 6-8 checks covering: Documentation, Tariff, Certification, Labeling, Packaging, Compliance.
Be specific to India as exporter and {country} as importer. overallScore must be 0-100."""

        try:
            text = _call_claude(prompt, max_tokens=900)
            data = _extract_json(text, array=False)
            if "checks" not in data:
                raise ValueError("Missing checks key")
            data["product"] = product
            data["country"] = country
            data["hs_code"] = hs_code
            data["source"] = "ai"
            return data
        except Exception:
            pass  # fall through to rule-based

    # Rule-based fallback
    category = _resolve_category(product)
    checks = list(_RULE_TEMPLATES.get(category, _RULE_TEMPLATES["default"]))
    if category != "default" and category != "textile":
        checks = checks + _RULE_TEMPLATES["default"][:3]

    # Add destination-specific checks
    dest_upper = country.upper()
    for dest_key, extra_checks in _DEST_EXTRA.items():
        if dest_key in dest_upper:
            checks = checks + extra_checks
            break

    checks = checks[:8]
    score, overall_status = _compute_score(checks)
    return {
        "product": product,
        "country": country,
        "hs_code": hs_code,
        "overallScore": score,
        "overallStatus": overall_status,
        "checks": checks,
        "source": "rules",
    }
