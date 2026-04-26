<div align="center">

# RESONANCE
### *You care for them. We care for you.*

**A psychosocial wellness platform for the invisible patient , the family caretaker.**

*Google Solution Challenge 2026 · Team JXM*

---

![Tech Stack](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google)
![Database](https://img.shields.io/badge/Database-Firebase-FFCA28?style=flat-square&logo=firebase)

</div>

---

## The Problem

There are an estimated **53 million unpaid family caretakers** in the world people who have taken on the full-time, emotionally consuming role of caring for a chronically ill parent, spouse, child, or sibling. While the medical system focuses entirely on the primary patient, the caretaker is left without support, without visibility, and without a space to process what they are going through.

Over time, this leads to what researchers call **Caretaker Burnout Syndrome** , a state of chronic physical exhaustion, emotional depletion, social isolation, and psychological distress. The caretaker becomes what we call the **Second Patient**: someone who is suffering deeply, but whose suffering goes unrecognized and unaddressed.

Resonance was built for them.

---

## Our Solution

Resonance is a **psychosocial digital companion** designed specifically for family caretakers. It provides a safe, private, and emotionally intelligent space where caretakers can track their mental health over time, express themselves freely, receive AI-powered emotional support, and connect with a real community of people who understand their journey — without judgment, without clinical coldness, and without having to explain themselves.

---

## Features

### 🔥 Burnout Index
A dynamic burnout score calculated from journal sentiment analysis and self-reported check-ins. The score places the user in one of four zones : Stable, Moderate, Warning, or Critical Burnout, with a personalized narrative that reflects their current emotional state. The index updates over time as more data is gathered, becoming more accurate the longer it is used.

### 📓 Private Journal with Pattern Recognition
A fully encrypted private journal where caretakers can write freely. Over time, the AI analyzes entries to detect emotional patterns that the user may not be consciously aware of — themes of suppression, emotional loops, declining mood trends, and the gap between what is said and what is felt. This "unsaid layer" analysis surfaces insights gently and without alarm.

### 🤖 AI Emotional Companion
A Gemini-powered conversational companion trained to respond with warmth, validation, and grounded support. Unlike generic chatbots, Resonance is context-aware — it reads the user's recent journal entries and current burnout zone to tailor its responses. It never gives medical advice, never minimizes feelings, and never responds with clinical detachment. It responds the way a deeply empathetic friend would.

### 💬 Real-Time Peer Group Chats
Live group chats powered by Firebase Firestore, organized around shared caretaking situations caring for a parent, a spouse, a child with a chronic condition, or navigating the first overwhelming year. Messages are real, users are real, and the conversations persist. No bots, no simulated community.

### 🔐 Secure Authentication
Firebase-backed authentication with a graceful demo mode for users who want to explore before signing up. User data is stored securely in Firestore, scoped to individual accounts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | FastAPI (Python) |
| AI | Google Gemini API |
| Database & Auth | Firebase Firestore + Firebase Admin SDK |
| Real-time | Firestore `onSnapshot` listeners |
| Hosting | GitHub Codespaces / any cloud |

---

## Architecture

```
User
 │
 ▼
React Frontend (Vite · port 5173)
 │   ├── LandingPage
 │   ├── AuthPage (Firebase Auth)
 │   └── Dashboard
 │        ├── Home (Burnout Gauge + Venting Vault)
 │        ├── Journal (Mood + Entries)
 │        ├── Talk (AI Chat)
 │        ├── Patterns (Trend Analysis)
 │        └── Groups (Real-time Firestore)
 │
 ▼
FastAPI Backend (Uvicorn · port 8000)
 │   ├── /auth      → Login, Register, Profile
 │   ├── /journal   → Save entries, Gemini sentiment analysis
 │   ├── /burnout   → Score calculation engine
 │   └── /chat      → Gemini conversational AI
 │
 ▼
Firebase Firestore (journals, checkins, users, groups)
Google Gemini API (chat responses, sentiment scoring)
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Firebase project with Firestore enabled
- A Google Gemini API key (free tier at [aistudio.google.com](https://aistudio.google.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/caretaker.git
cd caretaker
```

**Backend:**
```bash
cd resonance-fixed/backend
pip install -r requirements.txt
cp .env.example .env
# Fill in GEMINI_API_KEY and FIREBASE_CREDENTIALS_PATH in .env
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd resonance-fixed/frontend
npm install
cp .env.example .env
# Fill in VITE_API_URL and Firebase config values in .env
npm run dev
```

**Or start everything at once:**
```bash
bash resonance-fixed/start.sh
```

### Environment Variables

**Backend (`backend/.env`):**
```
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> The app runs in **demo mode** without Firebase or Gemini configured — all features work, data just lives in memory for the session.

---

## Google Solution Challenge Alignment

Resonance directly addresses **UN Sustainable Development Goal 3: Good Health and Well-Being** by:

- Providing accessible, stigma-free mental health support to an underserved population
- Using AI to deliver personalized emotional care at scale, without requiring professional intervention for every interaction
- Building community infrastructure that reduces isolation — one of the leading predictors of caretaker burnout and depression
- Making mental health monitoring continuous and passive, not a burden

---

## Team JXM

| Name | Role |
|---|---|
| Jaskeerat | Full-stack development, Backend, AI integration |
| Muskan | Full-stack development, UI/UX, Firebase |

---

## What's Next

- Push notifications for burnout threshold alerts
- Weekly AI-generated emotional summaries
- Therapist referral integration for Critical Burnout zone users
- Mobile app (React Native)
- Multilingual support for global reach

---

<div align="center">

*Built with care, for caretakers.*

**Google Solution Challenge 2026 · Team JXM**

</div>