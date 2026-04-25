#!/bin/bash
# Resonance startup script for GitHub Codespaces

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "┌─────────────────────────────────────┐"
echo "│         RESONANCE — starting        │"
echo "└─────────────────────────────────────┘"
echo ""

# ── Backend ──────────────────────────────
echo "▸ Starting backend on port 8000..."
cd "$SCRIPT_DIR/backend"
pip install -r requirements.txt -q

# Create .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ⚠  backend/.env created from example — add GEMINI_API_KEY to enable AI chat"
fi

uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  ✓ Backend PID: $BACKEND_PID"

# ── Frontend ─────────────────────────────
echo "▸ Starting frontend on port 5173..."
cd "$SCRIPT_DIR/frontend"
npm install --silent

# Create .env if not present
if [ ! -f .env ]; then
  cp .env.example .env
fi

npm run dev &
FRONTEND_PID=$!
echo "  ✓ Frontend PID: $FRONTEND_PID"

echo ""
echo "  Open the PORTS panel in Codespaces and click port 5173 to open the app."
echo "  Make sure BOTH ports 5173 and 8000 are set to Public visibility."
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

# Wait and clean up
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
wait