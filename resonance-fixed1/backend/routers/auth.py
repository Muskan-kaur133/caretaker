from fastapi import APIRouter, HTTPException
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

@router.post("/register")
async def register(data: RegisterRequest):
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="All fields are required.")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    try:
        from firebase_admin import auth, firestore
        # Create user in Firebase Auth
        user = auth.create_user(
            email=data.email,
            password=data.password,
            display_name=data.name,
        )
        # Save profile in Firestore
        db = firestore.client()
        db.collection("users").document(user.uid).set({
            "uid": user.uid,
            "name": data.name,
            "email": data.email,
            "role": data.role,
        })
        return {
            "message": "Account created. Please sign in.",
            "email": data.email,
            "name": data.name,
            "role": data.role,
        }
    except Exception as e:
        err = str(e)
        if "EMAIL_EXISTS" in err or "email-already-exists" in err:
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        elif "INVALID_EMAIL" in err or "invalid-email" in err:
            raise HTTPException(status_code=400, detail="Invalid email address.")
        elif "WEAK_PASSWORD" in err or "weak-password" in err:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
        else:
            raise HTTPException(status_code=500, detail=f"Registration failed: {err}")

@router.post("/login")
async def login(data: LoginRequest):
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    try:
        from firebase_admin import auth, firestore
        # Verify user exists in Firebase
        user = auth.get_user_by_email(data.email)
        # Get profile from Firestore
        db = firestore.client()
        doc = db.collection("users").document(user.uid).get()
        profile = doc.to_dict() if doc.exists else {}
        return {
            "access_token": user.uid,
            "name": profile.get("name", user.display_name or data.email.split("@")[0]),
            "email": data.email,
            "role": profile.get("role"),
        }
    except Exception as e:
        err = str(e)
        if "USER_NOT_FOUND" in err or "user-not-found" in err:
            raise HTTPException(status_code=401, detail="No account found with this email.")
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

async def get_current_user(authorization: str = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")
    token = authorization.split("Bearer ")[1]
    try:
        from firebase_admin import auth
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

@router.get("/me")
async def get_profile(authorization: str = None):
    try:
        from firebase_admin import firestore, auth
        doc = firestore.client().collection("users").document("demo").get()
        return doc.to_dict() if doc.exists else {"name": "Caretaker"}
    except Exception:
        return {"name": "Caretaker"}
