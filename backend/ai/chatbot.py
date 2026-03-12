import os
import requests
from dotenv import load_dotenv
from ai.platform_knowledge import detect_platform_question, PLATFORM_CONTEXT
from ai.export_steps import detect_step
from ai.market_answers import detect_market_question

load_dotenv()

API_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3"

headers = {
    "Authorization": f"Bearer {os.getenv('HF_TOKEN')}"
}


def detect_greeting(question):

    q = question.lower().strip()

    greetings = ["hi", "hello", "hey", "good morning", "good evening"]

    if q in greetings:
        return """
Hello! \ud83d\udc4b I am the ExportReady AI Export Advisor.

I can help you with:

\u2022 Export process guidance
\u2022 Required export documents
\u2022 Export market insights
\u2022 Information about the ExportReady platform

Try asking something like:

\u2022 What is ExportReady?
\u2022 What documents do I need to export rice?
\u2022 Which countries import electronics?
"""

    return None


def export_chatbot(question):

    # greeting check
    greeting = detect_greeting(question)
    if greeting:
        return greeting

    # check platform questions
    platform_response = detect_platform_question(question)
    if platform_response:
        return platform_response

    # check export steps
    step_response = detect_step(question)
    if step_response:
        return step_response

    # check market analysis questions
    market_response = detect_market_question(question)
    if market_response:
        return market_response

    # AI fallback
    prompt = PLATFORM_CONTEXT + "\nUser Question: " + question

    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 200}
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    result = response.json()

    if isinstance(result, dict) and "error" in result:
        return "Sorry, I couldn't process your question. Please try again."

    if isinstance(result, list):
        return result[0]["generated_text"]

    return str(result)