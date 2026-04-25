from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import datetime

router = APIRouter()

DEFAULT_GROUPS = [
    {"id": "parent-caretakers", "name": "Caring for a parent", "desc": "For adult children navigating the role reversal — when you become the caretaker of the person who once cared for you.", "tag": "parent caretaker", "count": 47},
    {"id": "spousal-caretakers", "name": "Spousal caretakers", "desc": "When your partner is the one who needs constant care. The loneliness of that is unlike anything else.", "tag": "spousal care", "count": 29},
    {"id": "chronic-illness", "name": "Chronic illness journeys", "desc": "For those in the long haul — years, not months. Where resilience and exhaustion coexist daily.", "tag": "chronic care", "count": 83},
    {"id": "first-year", "name": "First-year caretakers", "desc": "Just starting out and overwhelmed. A gentler group for those still finding their footing.", "tag": "new caretaker", "count": 18},
]

class JoinRequest(BaseModel):
    group_id: str
    user_name: str
    user_email: str

class MessageRequest(BaseModel):
    group_id: str
    user_name: str
    user_email: str
    text: str

@router.get("/list")
async def list_groups():
    try:
        from firebase_admin import firestore
        db = firestore.client()
        result = []
        for g in DEFAULT_GROUPS:
            members_snap = db.collection("groups").document(g["id"]).collection("members").stream()
            members = [m.to_dict() for m in members_snap]
            result.append({**g, "members": members, "count": len(members)})
        return result
    except Exception as e:
        print(f"Groups list error: {e}")
        return [{**g, "members": []} for g in DEFAULT_GROUPS]

@router.post("/join")
async def join_group(data: JoinRequest):
    try:
        from firebase_admin import firestore
        db = firestore.client()
        uid = data.user_email.replace("@", "_").replace(".", "_")
        db.collection("groups").document(data.group_id).collection("members").document(uid).set({
            "uid": uid,
            "name": data.user_name,
            "initials": data.user_name[:2].upper(),
            "joined_at": datetime.datetime.utcnow().isoformat(),
        })
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.post("/leave")
async def leave_group(data: JoinRequest):
    try:
        from firebase_admin import firestore
        db = firestore.client()
        uid = data.user_email.replace("@", "_").replace(".", "_")
        db.collection("groups").document(data.group_id).collection("members").document(uid).delete()
        return {"ok": True}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.get("/messages/{group_id}")
async def get_messages(group_id: str):
    try:
        from firebase_admin import firestore
        db = firestore.client()
        msgs = db.collection("groups").document(group_id).collection("messages").order_by("timestamp").limit(50).stream()
        return [m.to_dict() for m in msgs]
    except Exception as e:
        print(f"Messages error: {e}")
        return []

@router.post("/message")
async def send_message(data: MessageRequest):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    try:
        from firebase_admin import firestore
        db = firestore.client()
        ts = datetime.datetime.utcnow().isoformat()
        db.collection("groups").document(data.group_id).collection("messages").add({
            "name": data.user_name[:2].upper(),
            "full_name": data.user_name,
            "text": data.text.strip(),
            "timestamp": ts,
            "mine_uid": data.user_email.replace("@", "_").replace(".", "_"),
        })
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
