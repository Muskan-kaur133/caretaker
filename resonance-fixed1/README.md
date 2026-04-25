# Resonance — Caretaker Companion

> "You care for them, we care for you."

---

## ⚡ Quickstart in GitHub Codespaces

```bash
bash start.sh
```

This installs dependencies and starts both servers. Then:

1. Go to the **Ports** tab in VS Code
2. Find port **5173** → right-click → **Open in Browser**
3. Make sure port **8000** is set to **Public** (right-click → Port Visibility → Public)

That's it. The app works **without any API keys** in demo mode.

---

## Manual start (two terminals)

**Terminal 1 — Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment variables (optional)

Copy the example files and add your keys:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Variable | Where | Description |
|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Powers AI chat. Falls back to curated responses without it. |
| `FIREBASE_CREDENTIALS_PATH` | `backend/.env` | Path to Firebase service account JSON. App runs in demo mode without it. |
| `VITE_API_URL` | `frontend/.env` | Override API URL. Auto-detected in Codespaces — leave blank unless needed. |

---

## App flow

```
Landing Page → Sign In / Register → Dashboard
                                        ├── Home        (burnout gauge + venting vault)
                                        ├── Journal     (mood picker + private entries)
                                        ├── Talk        (AI companion via Gemini)
                                        ├── Patterns    (mood chart + insight layer)
                                        └── Groups      (peer community)
```

---

## Bugs fixed from original

| File | Bug |
|---|---|
| `journal.py` | Missing `datetime` import; undefined `sentiment_score` variable |
| `auth.py` | `/login` and `/register` endpoints were completely missing |
| `main.py` | Firebase init crashed the whole app if credentials weren't present |
| `burnout.py` | Firestore calls not wrapped in try/except — crashed without Firebase |
| `requirements.txt` | Malformed `python-multipart=` (missing version pinning broke pip) |
| `App.jsx` | No routing — landing page and auth were skipped entirely |
| `vite.config.js` | Missing `host: '0.0.0.0'` and `hmr.clientPort: 443` — blank page in Codespaces |
