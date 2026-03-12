PLATFORM_INFO = """
ExportReady is an AI-powered platform that helps MSMEs export products globally.

The platform provides:

1. Export Readiness Assessment
2. Market Intelligence Engine
3. Compliance & Document Guidance
4. Export Profitability Simulator
5. AI Export Advisor

It helps businesses identify export markets, understand export regulations,
prepare documents, and estimate export profitability.
"""

PLATFORM_CONTEXT = """
You are the AI assistant of ExportReady.

ExportReady is an AI-powered platform that helps MSMEs export products globally.

The platform provides the following features:

1. Export Readiness Assessment
Checks whether a business is ready to export and identifies missing requirements.

2. Market Intelligence Engine
Analyzes global trade data to recommend the best countries to export a product.

3. Compliance Guidance
Shows required export documents, certifications, and country regulations.

4. Profit Simulation
Estimates export profitability including shipping, duties, and logistics costs.

5. AI Export Advisor
Guides businesses step-by-step through the export process.

Your job is to explain the platform clearly and help users with export guidance.
"""


def detect_platform_question(question):

    question = question.lower()

    if "exportready" in question or "this platform" in question or "this web" in question:
        return """
ExportReady is an AI-powered export intelligence platform designed for MSMEs.

It helps businesses start exporting by providing:

\u2022 Export readiness assessment
\u2022 AI-based market analysis
\u2022 Export document guidance
\u2022 Profitability simulation
\u2022 AI export advisor chatbot

The platform helps exporters identify global markets,
understand export requirements, and plan profitable exports.
"""

    if "features" in question:
        return """
ExportReady platform features:

• Export readiness assessment
• AI market intelligence
• Compliance and document guidance
• Export profitability simulation
• AI export advisor chatbot
"""

    if "market analysis" in question:
        return "Market analysis identifies the best countries to export a product by analyzing demand, trade data, and market trends."

    if "profit simulation" in question:
        return "Profit simulation estimates export profitability by calculating costs such as shipping, duties, and logistics."

    if "who created exportready" in question:
        return "ExportReady is a project designed to help MSMEs simplify the export process using AI and data analysis."

    if "how does this platform work" in question:
        return """
ExportReady works in three steps:

1. Analyze export readiness
2. Identify high-demand international markets
3. Estimate export profitability and guide the export process.
"""

    if "who is this platform for" in question:
        return "ExportReady is designed for MSMEs and small businesses that want to export their products internationally."

    return None
