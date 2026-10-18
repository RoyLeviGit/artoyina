#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
output_dir="renders/ep04-main-titles"
mkdir -p "$output_dir"

titles=(
  "the-science"
  "the-technology"
  "the-scandal"
  "impressionism"
  "the-exhibition"
  "monet-and-camille"
  "the-long-road-to-success"
  "monets-later-years"
  "art-after-impressionism"
)

for index in "${!titles[@]}"; do
  title="${titles[$index]}"
  printf -v number '%02d' "$((index + 1))"
  npx remotion render src/index.ts "ep04-main-title-$title" \
    "$output_dir/$number-$title.mp4" --codec h264 --crf 16
done
