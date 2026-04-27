# ep02 Zoom Keyframe Instructions

Auto-generated content-aware scale + position keyframes for all 209 clips in the ep02 RoughCut sequence.

---

## Status

| Batch | Clips | Sequence range | Status |
|-------|-------|----------------|--------|
| Manual | 0–1 | 00:00:00 – 00:00:37 | ✅ Done |
| Batch 1 | 2–51 | 00:00:37 – 07:05 | ✅ Done |
| Batch 2 | 52–101 | 07:05 – 13:53 | ✅ Done |
| Batch 3 | 102–151 | 13:53 – 19:44 | ✅ Done |
| Batch 4 | 152–208 | 19:44 – end | ❌ Not applied |

---

## How to apply Batch 4 (remaining clips)

### Option A — Use the pre-generated script (fastest)

`apply_batch_4.js` is already generated in this directory with the correct CLIP_PLANS embedded. Just copy it to the Windows user folder and run via MCP:

```bash
cp /home/roylevi/projects/artoyina/editing/ep02/apply_batch_4.js /mnt/c/Users/Roy/apply_batch_4.js
```

Then run via MCP:
```
mcp__pr-mcp__execute_uxp_script  →  script_path: "C:\Users\Roy\apply_batch_4.js"
```

Check result for errors (output will be large — save to file and grep):
- Should show `scaleOK: true, posOK: true` for each clip
- `errors: []` for posHold operations

### Option B — Regenerate from scratch

If clip timings change or SRT is edited, regenerate:

```bash
cd /home/roylevi/projects/artoyina/editing/ep02

# 1. Get fresh clip timings from Premiere (run C:\Users\Roy\get_clip_times.js via MCP)
#    Save response clips array to clip_times.json

# 2. Update CLIPS_RAW in gen_clip_plans.py if clip_times.json changed

# 3. Regenerate clip plans
python3 gen_clip_plans.py
# → writes /tmp/clip_plans.json

# 4. Regenerate batch scripts
python3 gen_apply_scripts.py
# → writes C:\Users\Roy\apply_batch_1.js ... apply_batch_4.js

# 5. Run whichever batches you need via MCP
```

---

## What these scripts do (per clip)

1. Clear any existing scale + position keyframes
2. Reset Time Varying (off then on) for both params
3. For each SRT entry overlapping the clip's sequence time window:
   - Score intensity (dramatic keywords, name drops, year mentions)
   - Map score → scale 100–145%
   - Create scale KF with HOLD interpolation (set on the KF object before adding)
   - Create position KF panning toward subject (cx=0.375, cy=0.25) using:
     `pos.x = cx + (0.5 - cx) * S` where S = scale/100
4. Batch-add all scale KFs in one transaction
5. Batch-add all position KFs in one transaction
6. Set HOLD interpolation on each position KF via `createSetInterpolationAtKeyframeAction`

**Subject**: top half, 2nd quarter from left (cx=0.375, cy=0.25)
**Scale range**: 100% (no speech) – 145% (peak drama)

---

## Key files

| File | Purpose |
|------|---------|
| `gen_clip_plans.py` | Parses SRT + clip timings → `/tmp/clip_plans.json` |
| `gen_apply_scripts.py` | Reads clip_plans.json → writes batch UXP scripts |
| `clip_times.json` | Cached Premiere clip timing data (209 clips) |
| `apply_batch_4.js` | Ready-to-run UXP script for clips 152–208 |
| `RoughCut.srt` | Source subtitles used for intensity scoring |
| `C:\Users\Roy\apply_kfs.js` | Manual KF plan for clips 0–1 (higher intensity) |
| `C:\Users\Roy\get_clip_times.js` | Premiere script to refresh clip timing data |

---

## Premiere API reminders (full details in premiere-uxp-api.md)

- **KF positions must use source timecode** (`getInPoint()` base), not sequence time
- **Batch all KF adds in one transaction** per param or they won't appear in the UI
- **`createKeyframe` / `createAddKeyframeAction` / `createSetTimeVaryingAction` are SYNC** — do NOT await them
- **HOLD on scalar KFs**: `await kf.setTemporalInterpolationMode(HOLD)` before adding
- **HOLD on PointF KFs**: `createSetInterpolationAtKeyframeAction(srcTime, HOLD, false)` in a separate transaction after adding
- **TV reset**: disable then enable in separate transactions before re-adding KFs
- **Crash risk**: 50–60 clips per batch is safe; avoid larger batches
