from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from firebase_admin import firestore
from datetime import datetime
import os

router = APIRouter()

class JournalEntry(BaseModel):
    content: str
    mood: Optional[int] = 3
    user_email: Optional[str] = None
    user_name: Optional[str] = None

@router.post("/vent")
async def vent_to_vault(entry: JournalEntry):
    if not entry.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    uid = entry.user_email.replace("@", "_").replace(".", "_") if entry.user_email else "demo_user"
    sentiment_score = (5 - (entry.mood or 3)) / 4.0
    try:
        db = firestore.client()
        db.collection("journals").add({
            "uid": uid,
            "user_email": entry.user_email or "",
            "content": entry.content,
            "mood": entry.mood or 3,
            "created_at": datetime.now(),
            "sentiment_score": round(sentiment_score, 2),
        })
        print(f"Journal saved for uid: {uid}")
    except Exception as e:
        print(f"Firestore error: {e}")
    return {"status": "Released", "message": "Your thoughts have been safely stored.", "perceived_stress": sentiment_score}

@router.get("/stats")
async def get_journal_stats(user_email: str = ""):
    uid = user_email.replace("@", "_").replace(".", "_").replace("%40", "_").replace("%2E", "_").replace("%", "_") if user_email else "demo_user"
    try:
        db = firestore.client()
        docs = db.collection("journals").where("uid", "==", uid).order_by("created_at", direction=firestore.Query.DESCENDING).limit(7).stream()
        entries = [d.to_dict() for d in docs]
    except Exception as e:
        print(f"Stats error: {e}")
        entries = []
    mood_trend = [{"time": str(e.get("created_at", "")), "stress": e.get("sentiment_score", 0.5)} for e in entries]
    return {"mood_trend": mood_trend, "count": len(entries)}
