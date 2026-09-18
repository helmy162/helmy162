#!/usr/bin/env bash
# Renders the preview sheets at 1:1 so panels can be judged at real size.
# --virtual-time-budget fast-forwards CSS animations, so the settled state is
# what gets captured (pass a smaller budget to catch the draw-in mid-flight).
set -euo pipefail
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="${OUT:-/private/tmp/shots}"
BUDGET="${BUDGET:-4000}"
mkdir -p "$OUT"
for theme in dark light; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=976,"${HEIGHT:-900}" --virtual-time-budget="$BUDGET" \
    --screenshot="$OUT/sheet-$theme.png" \
    "http://localhost:8912/sheet.html?theme=$theme" >/dev/null 2>&1
done
echo "$OUT"; ls -la "$OUT"/*.png | awk '{print $NF, $5}'
