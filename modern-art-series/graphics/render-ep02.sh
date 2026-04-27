#!/bin/bash
set -e

OUT="../ep02-romanticism/visuals/graphics"

COMPOSITIONS=(
  ep02-title-world-after-david
  ep02-title-the-sublime
  ep02-title-the-raft
  ep02-title-delacroix
  ep02-title-north-africa
  ep02-title-legacy
  ep02-quote-baudelaire
  ep02-quote-delacroix-greeks
  ep02-quote-delacroix-paint
  ep02-dates-romanticism
  ep02-timeline-romanticism
  ep02-map-europe
  ep02-map-north-africa
  ep02-comparison-ingres-vs-delacroix
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
