#!/bin/bash
set -e

OUT="../ep01-neoclassicism/visuals/graphics"

COMPOSITIONS=(
  ep01-quote-winckelmann
  ep01-quote-hemlock
  ep01-quote-patriotism
  ep01-dates-revolution
  ep01-timeline-david
  ep01-map-exile
  ep01-map-pompeii
  ep01-map-paris
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
