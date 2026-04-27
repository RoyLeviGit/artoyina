#!/bin/bash
set -e

OUT="../ep05-post-impressionism/visuals/graphics"

COMPOSITIONS=(
  ep05-title-after-impressionism
  ep05-title-cezanne
  ep05-title-van-gogh
  ep05-title-gauguin
  ep05-title-three-paths
  ep05-quote-vangogh-nonentity
  ep05-quote-vangogh-color
  ep05-quote-vangogh-risking
  ep05-quote-cezanne-cylinder
  ep05-quote-picasso-cezanne
  ep05-dates-post-impressionism
  ep05-timeline-post-impressionism
  ep05-three-paths
  ep05-map-van-gogh
  ep05-map-gauguin
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
