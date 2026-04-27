#!/bin/bash
set -e

OUT="../ep04-impressionism/visuals/graphics"

COMPOSITIONS=(
  ep04-title-the-door-opens
  ep04-title-monet
  ep04-title-mary-cassatt
  ep04-title-the-group
  ep04-title-the-series
  ep04-title-legacy
  ep04-quote-monet-landscape
  ep04-quote-cassatt-independence
  ep04-quote-cassatt-alone
  ep04-quote-renoir-tubes
  ep04-dates-impressionism
  ep04-timeline-impressionism
  ep04-chevreul-color-demo
  ep04-comparison-japonisme
  ep04-map-impressionist-paris
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
