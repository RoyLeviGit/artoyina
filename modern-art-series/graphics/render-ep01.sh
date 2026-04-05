#!/bin/bash
set -e

OUT="../ep01-neoclassicism/visuals/graphics"

# Already rendered — uncomment to re-render if needed:
# ep01-quote-winckelmann ep01-quote-hemlock ep01-quote-patriotism
# ep01-dates-revolution ep01-timeline-david
# ep01-map-exile ep01-map-pompeii ep01-map-paris

COMPOSITIONS=(
  ep01-title-world-before-david
  ep01-title-davids-rise
  ep01-title-revolution
  ep01-title-the-fall
  ep01-title-legacy
)

for comp in "${COMPOSITIONS[@]}"; do
  echo "=== Rendering $comp ==="
  npx remotion render "$comp" "$OUT/$comp.mp4" --codec h264 --crf 16
  echo ""
done

echo "=== All done ==="
ls -lh "$OUT"
