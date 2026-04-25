from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = None


async def get_current_user(authorization: str = Header(None)):
    """
    Verifies Firebase JWT or falls back to demo user for development.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return {"uid": "demo_caretaker_123"}

    token = authorization.split("Bearer ")[1]
    try:
        from firebase_admin import auth
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        # Graceful fallback for dev/demo
        return {"uid": "demo_caretaker_123"}


@router.post("/login")
async def login(data: LoginRequest):
    """
    Login endpoint. In production, Firebase handles auth on the frontend.
    This is a dev/demo fallback that returns a mock token.
    """
    # In production: Firebase Auth on frontend sends ID token directly.
    # This endpoint is for dev/testing only.
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    # Try Firebase Admin SDK verification
    try:
        from firebase_admin import auth as fb_auth
        # In real flow, frontend gets the token from Firebase and sends it.
        # We return a placeholder here.
        return {
            "access_token": "dev_token",
            "name": data.email.split("@")[0],
            "email": data.email,
        }
    except Exception:
        return {
            "access_token": "dev_token",
            "name": data.email.split("@")[0],
            "email": data.email,
        }


@router.post("/register")
async def register(data: RegisterRequest):
    """
    Register and create user profile in Firestore.
    """
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="All fields are required.")

    try:
        from firebase_admin import firestore
        db = firestore.client()
        # Use email-derived key for demo; in prod use Firebase UID
        uid = f"user_{data.email.replace('@', '_').replace('.', '_')}"
        db.collection("users").document(uid).set({
            "uid": uid,
            "name": data.name,
            "email": data.email,
            "role": data.role,
        })
        return {
            "access_token": "dev_token",
            "name": data.name,
            "email": data.email,
            "role": data.role,
        }
    except Exception:
        # Firestore not configured — still allow demo flow
        return {
            "access_token": "dev_token",
            "name": data.name,
            "email": data.email,
            "role": data.role,
        }


@router.get("/me")
async def get_profile(user: dict = Depends(get_current_user)):
    try:
        from firebase_admin import firestore
        db = firestore.client()
        doc = db.collection("users").document(user["uid"]).get()
        if doc.exists:
            return doc.to_dict()
    except Exception:
        pass
    return {"uid": user["uid"], "name": "Caretaker"}
