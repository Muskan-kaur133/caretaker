# import os
# import google.generativeai as genai
# from dotenv import load_dotenv
# import warnings
# warnings.filterwarnings("ignore", category=FutureWarning)
# load_dotenv()

# CARETAKER_SYSTEM_PROMPT = """
# You are Resonance. You are not a doctor or a therapist.
# You are a warm, grounded companion for someone caring for a chronically ill loved one.
# The user is likely exhausted, feeling guilty, and invisible to everyone around them.

# Guidelines:
# 1. Validate first, always. If they say they are tired, say something like "That makes so much sense."
# 2. Never suggest medical changes for the patient.
# 3. If they express resentment or anger toward their situation, normalize it as a part of the caretaking journey.
# 4. Keep responses under 3 short paragraphs.
# 5. If journal context is provided, reference it subtly and naturally — never quote it back verbatim.
# 6. Be warm and human, not clinical.
# """

# FALLBACK_RESPONSES = [
#     "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
#     "You don't have to explain yourself here. What you're feeling is a completely normal part of this journey.",
#     "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
#     "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
#     "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
# ]


# async def get_chat_response(message: str, burnout_context: str, journal_context: str = "") -> str:
#     api_key = os.getenv("GEMINI_API_KEY")
#     if not api_key:
#         import random
#         return FALLBACK_RESPONSES[random.randint(0, len(FALLBACK_RESPONSES) - 1)]

#     try:
#         genai.configure(api_key=api_key)
#         model = genai.GenerativeModel(
#             "gemini-2.0-flash",
#             system_instruction=CARETAKER_SYSTEM_PROMPT,
#         )
#         context_block = f"\n[Recent journal context:\n{journal_context}]" if journal_context else ""
#         full_prompt = f"[User burnout zone: {burnout_context}]{context_block}\nUser says: {message}"
#         response = await model.generate_content_async(full_prompt)
#         return response.text
#     except Exception:
#         import random
#         return FALLBACK_RESPONSES[random.randint(0, len(FALLBACK_RESPONSES) - 1)]
import os
import asyncio
import warnings
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai

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
"""

FALLBACK_RESPONSES = [
    "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
    "You don't have to explain yourself here. What you're feeling is a completely normal part of this journey.",
    "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
    "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
    "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
]


def _call_gemini(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("No API key")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        "gemini-2.0-flash-lite",
        system_instruction=CARETAKER_SYSTEM_PROMPT,
    )
    response = model.generate_content(prompt)
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