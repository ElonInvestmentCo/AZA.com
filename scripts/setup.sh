#!/usr/bin/env bash
# PAYVORA fresh-import bootstrap.
#
# A fresh re-import of this repl wipes node_modules and every package's
# build output (dist/, .next/, Metro cache) since those are gitignored.
# Run this after import (or any time the app/API/mobile workflows fail
# with "next: not found" or a missing artifacts/api-server/dist/index.mjs)
# to restore a working dev environment. See PROJECT_STATUS.md's "Fresh
# Import / Environment Bootstrap" section for the full explanation.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> pnpm install"
pnpm install

echo "==> building artifacts/api-server (the root 'API Server' workflow runs the pre-built dist/index.mjs directly)"
pnpm --filter @workspace/api-server run build

echo "==> checking for a stale Expo process holding port 19000"
if command -v lsof >/dev/null 2>&1; then
  STALE_PIDS=$(lsof -ti :19000 2>/dev/null || true)
  if [ -n "${STALE_PIDS}" ]; then
    echo "    found stale process(es) on port 19000: ${STALE_PIDS} — killing"
    kill -9 ${STALE_PIDS} || true
  else
    echo "    port 19000 is free"
  fi
fi

echo "==> done. Now restart the 'API Server', 'PayVora Website', and 'artifacts/mobile: expo' workflows."
