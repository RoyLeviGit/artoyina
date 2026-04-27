# Premiere Pro UXP API — Working Notes

Practical findings from scripting ep02. These were hard-won through trial and error.

---

## How to run scripts

Scripts live at `C:\Users\Roy\` (Windows path). Run them via the MCP plugin:

```
mcp__pr-mcp__execute_uxp_script  →  script_path: "C:\Users\Roy\your_script.js"
```

Scripts have access to globals: `app`, `constants`, `fs`, `params`.

---

## Execution model — actions and transactions

Almost every write operation follows this pattern:

```javascript
const proj = await app.Project.getActiveProject();

// 1. Create an action object
const action = await someParam.createSomeAction(...);

// 2. Execute it inside a transaction
await proj.executeTransaction(async (ca) => {
    ca.addAction(action);
}, 'optional label');
```

`executeTransaction` is on the `Project` object. The `CompoundAction` (`ca`) only has `addAction` and `empty` — no direct execute method.

---

## Setting a Motion parameter value (Scale, Position, etc.)

The `createSetValueAction` method does NOT take a raw number — it takes a **Keyframe object**.

```javascript
const proj = await app.Project.getActiveProject();
const seq = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);

const chain = await items[0].getComponentChain();
const motionComp = await chain.getComponentAtIndex(1); // index 1 = Motion (AE.ADBE Motion)
const scaleParam = await motionComp.getParam(1);       // index 1 = Scale

// CORRECT: create a Keyframe object first, then pass it to createSetValueAction
const kf = await scaleParam.createKeyframe(110);                    // 110 = 110%
const action = await scaleParam.createSetValueAction(kf, false);
await proj.executeTransaction(async (ca) => { ca.addAction(action); }, 'Set scale');
```

**This sets a constant (non-keyframed) scale.** No keyframe is added to the timeline — the clip just has a fixed scale for its entire duration.

For timed keyframes (time-varying), see the "Adding timed keyframes" section below.

### What does NOT work

```javascript
// All of these fail with "Illegal Parameter type":
scaleParam.createSetValueAction(100)
scaleParam.createSetValueAction(100.0)
scaleParam.createSetValueAction({value: 100})
scaleParam.createSetValueAction("100")
```

---

## Motion component parameter indices

Component chain for a video clip:
- `chain.getComponentAtIndex(0)` — Intrinsic effects (varies)
- `chain.getComponentAtIndex(1)` — **Motion** (`AE.ADBE Motion`)

Motion param indices:
| Index | Name |
|-------|------|
| 0 | Position |
| 1 | **Scale** |
| 2 | Scale Width |
| 3 | (blank) |
| 4 | Rotation |
| 5 | Anchor Point |
| 6 | Anti-flicker Filter |
| 7 | Crop Left |
| 8 | Crop Top |
| 9 | Crop Right |
| 10 | Crop Bottom |

---

## Reading a parameter value

```javascript
const zeroPoint = await seq.getZeroPoint(); // {ticks: '0', seconds: 0}
const val = await scaleParam.getValueAtTime(zeroPoint);
// Returns: { value: 100 }  ← note the object wrapper
```

---

## Getting clips from a track

```javascript
const items = await videoTrack.getTrackItems(constants.TrackItemType.CLIP, false);
// items[i].getStartTime()  → { ticks: string, seconds: number }
// items[i].getEndTime()
// items[i].getInPoint()    → source media in-point (NOT sequence time)
```

Clip count for ep02 RoughCut: **209 clips** on video track 0.

---

## Making a parameter time-varying

```javascript
const tvAction = await scaleParam.createSetTimeVaryingAction(true);
await proj.executeTransaction(async (ca) => { ca.addAction(tvAction); }, 'enable keyframes');
```

**Important**: Run this in its own separate transaction before adding keyframes. If combined with other actions or if the param is already time-varying, the action may silently succeed without taking effect.

---

## Adding timed keyframes (with TickTime positioning)

`createKeyframe`, `createAddKeyframeAction`, and `createSetTimeVaryingAction` are **synchronous** — do NOT `await` them. Awaiting native Premiere objects that are "thenable" silently corrupts the action.

### CRITICAL: keyframe positions are in SOURCE timecode, not sequence time

`kf.position` must be set to a TickTime in the **source clip's timecode** domain. Use `clip.getInPoint()` (the clip's in-point in the source media) as the base, NOT `clip.getStartTime()` (which is the clip's position in the sequence). Using sequence time causes keyframes to be written to the wrong position and they will not appear in the UI.

```javascript
const clip1Start   = await clip.getStartTime();  // sequence position — do NOT use for kf.position
const clip1InPoint = await clip.getInPoint();     // source media start — USE THIS as base
const clip2Start   = await items[i+1].getStartTime();
const clip1Dur     = clip2Start.subtract(clip1Start); // clip duration (same in both domains)

// Keyframe at offsetSec from clip start, in source timecode:
const frac_n  = Math.round(offsetSec * 10000);
const frac_d  = Math.round(clip1Dur.seconds * 10000);
const srcTime = clip1InPoint.add(clip1Dur.multiply(frac_n).divide(frac_d));
const kf = scaleParam.createKeyframe(value);  // sync, NO await
kf.position = srcTime;
```

### Batch all KF adds in one transaction

Adding KFs one transaction at a time does NOT update Premiere's render state. Batch all `createAddKeyframeAction` calls into a single `executeTransaction` to trigger one render flush:

```javascript
// Enable time-varying first (its own isolated transaction)
await proj.executeTransaction(async (ca) => {
    ca.addAction(scaleParam.createSetTimeVaryingAction(true));  // NO await
}, 'enable TV');

// Add ALL keyframes in ONE transaction
await proj.executeTransaction(async (ca) => {
    for (const kf of kfObjects) {
        ca.addAction(scaleParam.createAddKeyframeAction(kf));   // NO await
    }
}, 'add all kfs');
```

**What does NOT work**:
- `await scaleParam.createKeyframe(...)` — awaiting these sync methods corrupts the returned native object
- `createAddKeyframeAction(tickTime)` — must pass a Keyframe object, not a TickTime
- One transaction per keyframe — KFs will be written to the API state but won't appear in the UI

---

## Point/Position parameters (PointF type)

Position (param index 0) uses the `PointF` type. Values are normalized 0–1 (not pixels). Center = `(0.5, 0.5)`. y=0 is top, y=1 is bottom.

`PointF` is **not** a plain `{x, y}` object. Construct it via `app.PointF(x, y)`:

```javascript
const posParam = await motionComp.getParam(0); // Position

// CORRECT: use app.PointF constructor
const pt = app.PointF(0.5, 0.5);               // center of frame
const posKf = posParam.createKeyframe(pt);      // sync, NO await
posKf.position = srcTime;                       // source timecode TickTime
```

**What does NOT work**: `createKeyframe([0.5, 0.5])`, `createKeyframe({x, y})`, `createKeyframe(currentVal)` — all throw "Illegal Parameter type".

`getValueAtTime` for Position returns `{value: [x, y]}` (normalized array), e.g. `{value: [0.5, 0.5]}` at center.

### Setting HOLD interpolation on PointF keyframes

`setTemporalInterpolationMode()` does **not** exist on PointF keyframe objects (unlike scalar keyframes). Use `createSetInterpolationAtKeyframeAction` after adding:

```javascript
// Add KFs in batch first
await proj.executeTransaction(async (ca) => {
    for (const { kf } of posKfs) ca.addAction(posParam.createAddKeyframeAction(kf));
}, 'add pos kfs');

// Then set interpolation per KF (sync action, async transaction)
for (const { srcTime } of posKfs) {
    await proj.executeTransaction(async (ca) => {
        ca.addAction(posParam.createSetInterpolationAtKeyframeAction(srcTime, constants.InterpolationMode.HOLD, false));
    }, 'pos hold');
}
```

### Pan formula: locking a subject in place while zooming

Position in Premiere moves the clip center on screen. To keep image point `(cx, cy)` visible at its natural screen position as scale `S` increases, position must **increase** (clip shifts lower-right to expose upper-left content):

```
pos.x = cx + (0.5 - cx) * S
pos.y = cy + (0.5 - cy) * S
```

At S=1 this always gives (0.5, 0.5). At S>1 position increases, panning the visible region toward `(cx, cy)`.

Safe position range at scale S (no black bars): `[0.5/S, 1 - 0.5/S]` on each axis.

**Common mistake**: decreasing position to "go toward" a top-left subject is wrong — it moves the clip toward upper-left and exposes lower-right content instead.

---

## Setting keyframe interpolation mode

Use `setTemporalInterpolationMode(mode)` on the Keyframe object **before** adding it via `createAddKeyframeAction`. This is async (`Promise<boolean>`).

```javascript
const kf = scaleParam.createKeyframe(value);   // sync
kf.position = srcTime;
await kf.setTemporalInterpolationMode(constants.InterpolationMode.HOLD);
// then add in batch transaction as usual
```

**Runtime integer values** (not enum index order — verify via `r.holdModeValue = constants.InterpolationMode.HOLD`):
| Constant | Runtime value |
|----------|--------------|
| `constants.InterpolationMode.HOLD` | **4** |
| `constants.InterpolationMode.LINEAR` | (unchecked) |
| `constants.InterpolationMode.BEZIER` | (unchecked) |

**What does NOT work**:
- `app.Keyframe.INTERPOLATION_MODE_HOLD` — `app.Keyframe` is undefined at runtime
- `createSetInterpolationAtKeyframeAction(..., UpdateUI=true)` — throws "Script action failed to execute"

---

## Gotchas

- **Sequence name**: When ep02.prproj is opened alone (not alongside ep01), the sequence is called `"RoughCut"`, not `"ep02-RoughCut"`.
- **Active project**: `app.Project.getActiveProject()` returns whichever project has focus in the Premiere UI.
- **Crashes**: Long loops with many API calls can crash Premiere. Avoid inspecting all params in a loop; keep exploration scripts minimal.
- **`getStartTime()` vs `getInPoint()`**: `getStartTime()` is the clip's position in the sequence. `getInPoint()` is the source footage in-point (e.g. 197.7s into the source file). **Keyframe positions must use source timecode (`getInPoint()` + offset), not sequence time.**
- **Action objects have no `.execute()`** — always use `proj.executeTransaction`.
- **Batch size**: ~50 clips per loop is safe. Larger batches risk crashing Premiere due to cumulative API call volume.
- **Result size**: Script return values for 50+ clips exceed MCP token limits — save output to a file path or grep the saved result file for `scaleErr`, `posErr`, `FAILURE`.

---

## Bulk keyframe workflow (content-aware zoom for all clips)

Scripts live in `/home/roylevi/projects/artoyina/editing/ep02/`. See `ZOOM_INSTRUCTIONS.md` there for full status and usage.

### Pipeline

```
RoughCut.srt + clip_times.json
        ↓ gen_clip_plans.py
   /tmp/clip_plans.json
        ↓ gen_apply_scripts.py
  C:\Users\Roy\apply_batch_N.js  (N = 1..4, 50 clips each)
        ↓ mcp__pr-mcp__execute_uxp_script
   Premiere keyframes applied
```

### Checking batch results

```bash
python3 -c "
import re
data = open('/path/to/tool-result.txt').read()
errors = re.findall(r'(scaleErr|posErr|FAILURE)[^,}\"]{0,80}', data)
print('errors:', errors)
print(f'scaleOK: {data.count(\"scaleOK\")}, posOK: {data.count(\"posOK\")}')
"
```

### apply_batch template (complete, copy-paste safe)

```javascript
const proj = await app.Project.getActiveProject();
const seq  = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);
const HOLD = constants.InterpolationMode.HOLD;
const cx = 0.375, cy = 0.25;

const CLIP_PLANS = { /* {clipIndex: [{offsetSec, scale}, ...], ...} */ };

const results = {};
for (const [idxStr, kfPlan] of Object.entries(CLIP_PLANS)) {
    const idx = parseInt(idxStr);
    const clip = items[idx];
    const inPoint  = await clip.getInPoint();
    const seqStart = await clip.getStartTime();
    const seqEnd   = idx < items.length - 1
        ? await items[idx + 1].getStartTime()
        : await clip.getEndTime();
    const dur = seqEnd.subtract(seqStart);

    const chain      = await clip.getComponentChain();
    const motionComp = await chain.getComponentAtIndex(1);
    const scaleParam = await motionComp.getParam(1);
    const posParam   = await motionComp.getParam(0);
    const r = { errors: [] };

    for (const t of scaleParam.getKeyframeListAsTickTimes())
        await proj.executeTransaction(async ca => ca.addAction(scaleParam.createRemoveKeyframeAction(t, true)), 'rm scale kf');
    for (const t of posParam.getKeyframeListAsTickTimes())
        await proj.executeTransaction(async ca => ca.addAction(posParam.createRemoveKeyframeAction(t, true)), 'rm pos kf');
    await proj.executeTransaction(async ca => ca.addAction(scaleParam.createSetTimeVaryingAction(false)), 'scale TV off');
    await proj.executeTransaction(async ca => ca.addAction(scaleParam.createSetTimeVaryingAction(true)), 'scale TV on');
    await proj.executeTransaction(async ca => ca.addAction(posParam.createSetTimeVaryingAction(false)), 'pos TV off');
    await proj.executeTransaction(async ca => ca.addAction(posParam.createSetTimeVaryingAction(true)), 'pos TV on');

    const scaleKfs = [], posKfs = [];
    for (const { offsetSec, scale } of kfPlan) {
        const frac_n = Math.round(offsetSec * 10000);
        const frac_d = Math.round(dur.seconds * 10000);
        const srcTime = inPoint.add(dur.multiply(frac_n).divide(frac_d));
        const S = scale / 100;
        const skf = scaleParam.createKeyframe(scale);
        skf.position = srcTime;
        await skf.setTemporalInterpolationMode(HOLD);
        scaleKfs.push(skf);
        const pkf = posParam.createKeyframe(app.PointF(cx + (0.5 - cx) * S, cy + (0.5 - cy) * S));
        pkf.position = srcTime;
        posKfs.push({ kf: pkf, srcTime });
    }

    try {
        await proj.executeTransaction(async ca => {
            for (const kf of scaleKfs) ca.addAction(scaleParam.createAddKeyframeAction(kf));
        }, `clip${idx} scale`);
        r.scaleOK = true;
    } catch(e) { r.scaleErr = e.message; }

    try {
        await proj.executeTransaction(async ca => {
            for (const { kf } of posKfs) ca.addAction(posParam.createAddKeyframeAction(kf));
        }, `clip${idx} pos`);
        r.posOK = true;
    } catch(e) { r.posErr = e.message; }

    for (const { srcTime } of posKfs) {
        try {
            await proj.executeTransaction(async ca => {
                ca.addAction(posParam.createSetInterpolationAtKeyframeAction(srcTime, HOLD, false));
            }, 'pos hold');
        } catch(e) { r.errors.push('posHold: ' + e.message); }
    }
    results[idx] = r;
}
return results;
```
