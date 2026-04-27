#!/bin/bash
set -e

OUT="../ep03-realism/visuals/graphics"

COMPOSITIONS=(
  ep03-title-world-in-1848
  ep03-title-courbet
  ep03-title-burial-at-ornans
  ep03-title-pavilion
  ep03-title-commune
  ep03-title-legacy
  ep03-quote-courbet-goal
  ep03-quote-courbet-liberty
  ep03-dates-realism
  ep03-timeline-realism
  ep03-scale-comparison
  ep03-map-courbet
  ep03-map-realism-spread
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
