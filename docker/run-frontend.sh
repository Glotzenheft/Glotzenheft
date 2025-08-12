#!/usr/bin/env sh
set -e

# Defaults (per ENV überschreibbar)
FRONTEND_DIR="${FRONTEND_DIR:-/app/Frontend}"
FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
FRONTEND_PORT="${FRONTEND_PORT:-4200}"
FRONTEND_PROXY="${FRONTEND_PROXY:-proxy.docker.json}"

cd "$FRONTEND_DIR"

if [ ! -x node_modules/.bin/ng ]; then
  echo "[frontend] Installing deps via npm ci…"
  npm ci
fi

echo "[frontend] Starting ng serve on ${FRONTEND_HOST}:${FRONTEND_PORT} (proxy: ${FRONTEND_PROXY})"
exec npx ng serve \
  --host "${FRONTEND_HOST}" \
  --port "${FRONTEND_PORT}" \
  --proxy-config "${FRONTEND_PROXY}"
