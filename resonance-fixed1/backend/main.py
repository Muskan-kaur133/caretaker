from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(title="Resonance Caretaker API", version="1.0.0")

# Initialize Firebase (optional — app runs without it in dev mode)
def init_firebase():
    try:
        import firebase_admin
        from firebase_admin import credentials
        if not firebase_admin._apps:
            cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
            if cred_path and os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                print("✓ Firebase initialized")
            else:
                print("⚠ Firebase credentials not found — running in demo mode")
    except Exception as e:
        print(f"⚠ Firebase init skipped: {e}")

init_firebase()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import auth, chat, journal, burnout

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(journal.router, prefix="/journal", tags=["journal"])
app.include_router(burnout.router, prefix="/burnout", tags=["burnout"])

@app.get("/")
def read_root():
    return {"status": "Resonance API Active", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"ok": True}
