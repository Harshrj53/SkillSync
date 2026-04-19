#!/bin/bash
# SkillSync – Start both backend and frontend in split terminals

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

# ── check .env files exist ────────────────────────────────────
if [ ! -f "$BACKEND/.env" ]; then
  echo "⚠️  backend/.env not found – copying from .env.example"
  cp "$BACKEND/.env.example" "$BACKEND/.env"
fi

if [ ! -f "$FRONTEND/.env" ]; then
  echo "⚠️  frontend/.env not found – copying from .env.example"
  cp "$FRONTEND/.env.example" "$FRONTEND/.env"
fi

# ── launch ────────────────────────────────────────────────────
echo ""
echo "🚀  Starting SkillSync…"
echo "    Backend  → http://localhost:5000"
echo "    Frontend → http://localhost:5173"
echo ""

# Open two terminal tabs on macOS
osascript <<EOF
tell application "Terminal"
  do script "cd '$BACKEND' && npm run dev"
  tell application "System Events" to keystroke "t" using command down
  delay 0.5
  do script "cd '$FRONTEND' && npm run dev" in front window
  activate
end tell
EOF
