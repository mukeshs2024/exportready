"""
ExportReady AI Export Advisor — rule-based chatbot module.

Responds instantly using local intent detection and an embedded knowledge base.
No external API calls required.
"""

# ---------------------------------------------------------------------------
# Knowledge Base
# ---------------------------------------------------------------------------

PLATFORM_INFO = (
    "ExportReady is an AI-powered export intelligence platform designed to help "
    "MSMEs start exporting globally.\n\n"
    "The platform provides:\n\n"
    "• Export Readiness Assessment\n"
    "• AI Market Intelligence\n"
    "• Export Compliance Guidance\n"
    "• Export Profitability Simulator\n"
    "• AI Export Advisor\n\n"
    "The system analyzes export opportunities, identifies profitable international "
    "markets, and guides businesses through the export process."
)

EXPORT_PROCESS_STEPS = (
    "Export Process Steps:\n\n"
    "1. Register your business legally\n"
    "2. Obtain Import Export Code (IEC)\n"
    "3. Register GST\n"
    "4. Identify export markets\n"
    "5. Prepare export documents\n"
    "6. Arrange logistics and shipping\n"
    "7. Receive international payments"
)

EXPORT_DOCUMENTS = (
    "Required Export Documents:\n\n"
    "• Import Export Code (IEC)\n"
    "• GST Registration\n"
    "• Commercial Invoice\n"
    "• Packing List\n"
    "• Certificate of Origin\n"
    "• Shipping Bill\n"
    "• Bill of Lading / Airway Bill\n"
    "• Quality Inspection Certificate"
)

EXPORT_MARKETS: dict[str, list[str]] = {
    "agricultural products": ["China", "Philippines", "Nigeria", "Saudi Arabia", "UAE"],
    "rice": ["China", "Philippines", "Nigeria", "Saudi Arabia", "UAE"],
    "electronics": ["USA", "Germany", "Japan", "UK", "France"],
    "software services": ["USA", "UK", "Canada", "Australia", "Germany"],
    "software": ["USA", "UK", "Canada", "Australia", "Germany"],
    "handicrafts": ["USA", "UK", "UAE", "Germany", "France"],
    "pharmaceuticals": ["USA", "UK", "Germany", "Brazil", "South Africa"],
}

READINESS_CHECKLIST = [
    "IEC registration",
    "GST registration",
    "Product availability",
    "Target export market",
    "Export documentation",
    "Logistics partner",
]

GREETING_RESPONSE = (
    "Hello! I am the ExportReady AI Export Advisor.\n\n"
    "I can help you with:\n\n"
    "• Export process guidance\n"
    "• Export documents\n"
    "• Export markets\n"
    "• Platform information\n\n"
    "Try asking:\n"
    "What documents are required to export rice?\n"
    "Which countries import electronics?"
)

FALLBACK_RESPONSE = (
    "I can help with export processes, documents, markets, and platform features.\n\n"
    "Try asking:\n"
    "• What is ExportReady?\n"
    "• How do I start exporting?\n"
    "• What documents do I need?\n"
    "• Which countries import electronics?\n"
    "• Am I ready to export?"
)

# ---------------------------------------------------------------------------
# Intent Detection
# ---------------------------------------------------------------------------

# Each rule is (list-of-keyword-sets, intent).  A match requires *any* keyword
# set to be fully present (all words in the set appear in the query).
_INTENT_RULES: list[tuple[list[set[str]], str]] = [
    # greeting — exact short inputs
    ([{"hi"}, {"hello"}, {"hey"}, {"good morning"}, {"good evening"}], "greeting"),
    # platform info
    ([{"exportready"}, {"export ready"}, {"this platform"}, {"what is exportready"},
      {"this website"}, {"this project"}, {"about platform"}], "platform_info"),
    # export readiness
    ([{"ready to export"}, {"export readiness"}, {"readiness"}, {"am i ready"},
      {"readiness score"}, {"readiness check"}, {"checklist"}], "export_readiness"),
    # export documents
    ([{"document"}, {"documents"}, {"certification"}, {"certificate"},
      {"invoice"}, {"packing list"}, {"shipping bill"}, {"bill of lading"},
      {"iec"}, {"airway bill"}], "export_documents"),
    # export process
    ([{"export process"}, {"how to export"}, {"start export"}, {"steps to export"},
      {"export steps"}, {"begin export"}, {"process"}, {"register business"},
      {"gst"}, {"logistics"}, {"shipping"}, {"payment"}, {"customs"},
      {"next step"}, {"after iec"}], "export_process"),
    # export markets
    ([{"country"}, {"countries"}, {"market"}, {"markets"}, {"import"},
      {"importing"}, {"demand"}, {"rice"}, {"electronics"}, {"pharmaceutical"},
      {"pharmaceuticals"}, {"handicraft"}, {"handicrafts"}, {"software"},
      {"agricultural"}], "export_markets"),
]


def _detect_intent(query: str) -> str:
    """Return the best-matching intent string for *query*."""
    q = query.lower().strip()

    # Exact-match greetings first (very short inputs).
    if q in {"hi", "hello", "hey", "good morning", "good evening", "namaste"}:
        return "greeting"

    for keyword_sets, intent in _INTENT_RULES:
        for kw_set in keyword_sets:
            # Every token in the keyword set must appear in the query.
            if all(token in q for token in kw_set):
                return intent

    return "fallback"

# ---------------------------------------------------------------------------
# Response Handlers
# ---------------------------------------------------------------------------


def _handle_greeting() -> str:
    return GREETING_RESPONSE


def _handle_platform_info() -> str:
    return PLATFORM_INFO


def _handle_export_process() -> str:
    return EXPORT_PROCESS_STEPS


def _handle_export_documents() -> str:
    return EXPORT_DOCUMENTS


def _handle_export_markets(query: str) -> str:
    """Try to match a specific product category; otherwise list all."""
    q = query.lower()

    for category, countries in EXPORT_MARKETS.items():
        if category in q:
            bullet_list = "\n".join(f"• {c}" for c in countries)
            return (
                f"Top countries importing {category}:\n\n"
                f"{bullet_list}\n\n"
                "These markets show strong demand and stable trade volumes."
            )

    # No specific product matched — show overview.
    lines = ["Export Markets by Product Category:\n"]
    seen: set[str] = set()
    for category, countries in EXPORT_MARKETS.items():
        if category in seen:
            continue
        seen.add(category)
        bullet_list = ", ".join(countries)
        lines.append(f"• {category.title()}: {bullet_list}")
    return "\n".join(lines)


def _handle_export_readiness() -> str:
    completed = ["IEC registration", "GST registration"]
    missing = ["Market analysis", "Logistics partner", "Export documentation"]

    score = "50%"

    completed_str = "\n".join(f"✓ {item}" for item in completed)
    missing_str = "\n".join(f"✗ {item}" for item in missing)

    return (
        f"Export Readiness Score: {score}\n\n"
        f"Completed:\n{completed_str}\n\n"
        f"Missing:\n{missing_str}\n\n"
        "Complete the missing items to improve your readiness score."
    )


def _handle_fallback() -> str:
    return FALLBACK_RESPONSE

# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

_HANDLERS: dict[str, object] = {
    "greeting": lambda _q: _handle_greeting(),
    "platform_info": lambda _q: _handle_platform_info(),
    "export_process": lambda _q: _handle_export_process(),
    "export_documents": lambda _q: _handle_export_documents(),
    "export_markets": _handle_export_markets,
    "export_readiness": lambda _q: _handle_export_readiness(),
    "fallback": lambda _q: _handle_fallback(),
}


def export_chatbot(question: str) -> str:
    """Detect intent and return a structured response immediately."""
    if not question or not question.strip():
        return FALLBACK_RESPONSE

    intent = _detect_intent(question)
    handler = _HANDLERS.get(intent, lambda _q: _handle_fallback())
    return handler(question)