#!/usr/bin/env bash
# Stoppa ev. Next på 3000/3001, rensa build-cache, starta dev på nytt (macOS/Linux).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for port in 3000 3001; do
  pid="$(lsof -ti:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "${pid}" ]]; then
    kill -9 ${pid} 2>/dev/null || true
  fi
done

rm -rf .next
exec ./node_modules/.bin/next dev "$@"
