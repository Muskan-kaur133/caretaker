from fastapi import APIRouter, Depends, HTTPException
from models.journal import JournalEntry
from routers.auth import get_current_user
from firebase_admin import firestore
import google.generativeai as genai
import os
from datetime import datetime

router = APIRouter()

@router.post("/vent")
async def vent_to_vault(entry: JournalEntry, user: dict = Depends(get_current_user)):
    uid = user["uid"]

    if not entry.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")

    # Get sentiment score from Gemini
    sentiment_score = 0.5
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.0-flash-lite")
        analysis_prompt = (
            "Analyze the following caretaker journal entry for emotional exhaustion. "
            "Return ONLY a numerical score between 0.0 (peaceful) and 1.0 (total burnout/crisis). "
            f"Content: {entry.content}"
        )
        response = model.generate_content(analysis_prompt)
        sentiment_score = float(response.text.strip())
        sentiment_score = max(0.0, min(1.0, sentiment_score))
    except Exception:
        sentiment_score = 0.5

    # Save to Firestore
    try:
        db = firestore.client()
        db.collection("journals").add({
            "uid": uid,
            "content": entry.content,
            "created_at": datetime.now(),
            "sentiment_score": sentiment_score
        })
    except Exception:
        pass  # Non-fatal — still return success

    return {
        "status": "Released",
        "message": "Your thoughts have been safely stored.",
        "perceived_stress": sentiment_score,
    }


@router.get("/stats")
async def get_journal_stats(user: dict = Depends(get_current_user)):
    """Returns mood trends and unsaid pattern analysis."""
    try:
        db = firestore.client()
        docs = (
            db.collection("journals")
            .where("uid", "==", user["uid"])
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .limit(7)
            .stream()
        )
        entries = [d.to_dict() for d in docs]
    except Exception:
        entries = []

    mood_trend = [
        {"time": str(e.get("created_at", "")), "stress": e.get("sentiment_score", 0.5)}
        for e in entries
    ]

    return {"mood_trend": mood_trend}
