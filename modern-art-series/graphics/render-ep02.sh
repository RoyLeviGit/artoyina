#!/bin/bash
set -e

OUT="../ep02-romanticism/visuals/graphics"

COMPOSITIONS=(
  ep02-title-cold-open
  ep02-title-world-after-david
  ep02-title-the-sublime
  ep02-title-across-europe
  ep02-title-the-raft
  ep02-title-the-real-story
  ep02-title-the-process
  ep02-title-delacroix
  ep02-title-the-mystery
  ep02-title-the-early-work
  ep02-title-the-rivalry
  ep02-title-liberty
  ep02-title-north-africa
  ep02-title-the-late-years
  ep02-title-the-question
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
