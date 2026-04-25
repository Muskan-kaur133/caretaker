import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

CARETAKER_SYSTEM_PROMPT = """
You are Resonance. You are not a doctor or a therapist.
You are a warm, grounded companion for someone caring for a chronically ill loved one.
The user is likely exhausted, feeling guilty, and invisible to everyone around them.

Guidelines:
1. Validate first, always. If they say they are tired, say "That makes so much sense."
2. Never suggest medical changes for the patient.
3. If they express resentment or anger, normalize it as part of the caretaking journey.
4. Keep responses under 3 short paragraphs.
5. If journal context is provided, reference it subtly — never quote it verbatim.
6. Be warm and human, not clinical.
7. Respond directly to what the user actually said — never give a generic response.
"""

FALLBACK_RESPONSES = [
    "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
    "You don't have to explain yourself here. What you're feeling is completely normal.",
    "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
    "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
    "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
]

def _call_gemini(prompt: str) -> str:
    from google import genai
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("No API key")
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config={"system_instruction": CARETAKER_SYSTEM_PROMPT}
    )
    return response.text

async def get_chat_response(message: str, burnout_context: str, journal_context: str = "") -> str:
    context_block = f"\n[Recent journal context:\n{journal_context}]" if journal_context else ""
    full_prompt = f"[User burnout zone: {burnout_context}]{context_block}\nUser says: {message}"
    try:
        result = await asyncio.to_thread(_call_gemini, full_prompt)
        return result
    except Exception as e:
        print(f"Gemini error: {e}")
        import random
        return FALLBACK_RESPONSES[random.randint(0, len(FALLBACK_RESPONSES) - 1)]
