from fastapi import APIRouter, Depends
from models.checkin import DailyCheckIn
from services.burnout_engine import calculate_burnout_index
from routers.auth import get_current_user

router = APIRouter()


@router.post("/checkin")
async def save_checkin(data: DailyCheckIn, user: dict = Depends(get_current_user)):
    try:
        from firebase_admin import firestore
        db = firestore.client()
        db.collection("checkins").add({
            **data.model_dump(),
            "uid": user["uid"],
            "timestamp": firestore.SERVER_TIMESTAMP,
        })
    except Exception:
        pass  # Non-fatal in demo mode
    return {"status": "success"}


@router.get("/score")
async def get_score(user: dict = Depends(get_current_user)):
    checkins = []
    sentiments = []
    try:
        from firebase_admin import firestore
        db = firestore.client()
        checkin_docs = (
            db.collection("checkins")
            .where("uid", "==", user["uid"])
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(7)
            .stream()
        )
        journal_docs = (
            db.collection("journals")
            .where("uid", "==", user["uid"])
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .limit(7)
            .stream()
        )
        checkins = [d.to_dict() for d in checkin_docs]
        sentiments = [d.to_dict().get("sentiment_score", 0.5) for d in journal_docs]
    except Exception:
        pass  # Return demo score

    return calculate_burnout_index(checkins, sentiments)
