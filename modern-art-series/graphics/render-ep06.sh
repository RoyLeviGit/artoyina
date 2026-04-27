#!/bin/bash
set -e

OUT="../ep06-symbolism-art-nouveau/visuals/graphics"

COMPOSITIONS=(
  ep06-title-symbolist-turn
  ep06-title-klimt
  ep06-title-secession
  ep06-title-art-nouveau
  ep06-title-ornament-and-crime
  ep06-title-the-century-turns
  ep06-quote-secession-motto
  ep06-quote-klimt-freedom
  ep06-quote-loos-ornament
  ep06-quote-sullivan-form
  ep06-dates-symbolism
  ep06-timeline-symbolism
  ep06-series-recap
  ep06-comparison-redon
  ep06-map-art-nouveau
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
