#!/usr/bin/env bash
# Lighthouse (mobile) against a freshly built ./dist.
# Usage: scripts/lighthouse.sh <label> [path]   e.g. scripts/lighthouse.sh after /faq/
# Needs: node/npm and a Chromium. Set CHROME_PATH if Chromium isn't auto-detected.
set -euo pipefail
LABEL="${1:-run}"; PAGE="${2:-/}"; PORT="${PORT:-8089}"; OUT="audit"
mkdir -p "$OUT"
: "${CHROME_PATH:=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -n1)}"
export CHROME_PATH
python3 -m http.server "$PORT" --directory dist >/dev/null 2>&1 & SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1.5
npx --yes lighthouse "http://localhost:$PORT$PAGE" --form-factor=mobile --screenEmulation.mobile=true \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
  --output=json --output-path="$OUT/lh-$LABEL.json" --quiet
node -e '
const r=require(process.argv[1]); const c=r.categories;
console.log(process.argv[2], Object.keys(c).map(k=>k+": "+Math.round(c[k].score*100)).join(" | "));
for (const cat of Object.values(c)) for (const ref of cat.auditRefs) { const a=r.audits[ref.id];
  if (a.score!==null && a.score<0.9 && ref.weight>0) console.log("  -", cat.id, a.id, a.displayValue||"") }' "$PWD/$OUT/lh-$LABEL.json" "$LABEL"
