#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
output_dir="renders/ep03-main-titles"
mkdir -p "$output_dir"

compositions=(
  "ep03-title-world-courbet-walked-into"
  "ep03-main-title-gustave-courbet"
  "ep03-main-title-burial-at-ornans"
  "ep03-main-title-stone-breakers"
  "ep03-main-title-pavilion-of-realism"
  "ep03-main-title-painters-studio"
  "ep03-main-title-realism-beyond-courbet"
  "ep03-main-title-realism-taken-all-the-way"
  "ep03-main-title-commune-and-exile"
  "ep03-main-title-legacy"
)

for composition in "${compositions[@]}"; do
  npx remotion render src/index.ts "$composition" "$output_dir/$composition.mp4"
done
