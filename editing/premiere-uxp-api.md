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

---

## Gotchas

- **Sequence name**: When ep02.prproj is opened alone (not alongside ep01), the sequence is called `"RoughCut"`, not `"ep02-RoughCut"`.
- **Active project**: `app.Project.getActiveProject()` returns whichever project has focus in the Premiere UI.
- **Crashes**: Long loops with many API calls can crash Premiere. Avoid inspecting all params in a loop; keep exploration scripts minimal.
- **`getStartTime()` vs `getInPoint()`**: `getStartTime()` is the clip's position in the sequence. `getInPoint()` is the source footage in-point (e.g. 359s into the source file). They are different.
- **Action objects have no `.execute()`** — always use `proj.executeTransaction`.
