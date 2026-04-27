import json

with open('/tmp/clip_plans.json', 'r') as f:
    clip_plans = json.load(f)

TEMPLATE = """\
// Apply content-aware scale + position keyframes, clips {BATCH_START}–{BATCH_END}
// Subject: cx=0.375, cy=0.25 (top-left area). Pan formula: pos = cx + (0.5-cx)*S
// HOLD interpolation. KF positions in source timecode (getInPoint() base).

const proj = await app.Project.getActiveProject();
const seq  = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);
const HOLD = constants.InterpolationMode.HOLD;
const cx = 0.375, cy = 0.25;

const CLIP_PLANS = {CLIP_PLANS_SLICE};

const results = {{}};

for (const [idxStr, kfPlan] of Object.entries(CLIP_PLANS)) {{
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

    const r = {{ errors: [] }};

    // Remove existing KFs
    for (const t of scaleParam.getKeyframeListAsTickTimes()) {{
        await proj.executeTransaction(async (ca) => {{
            ca.addAction(scaleParam.createRemoveKeyframeAction(t, true));
        }}, 'rm scale kf');
    }}
    for (const t of posParam.getKeyframeListAsTickTimes()) {{
        await proj.executeTransaction(async (ca) => {{
            ca.addAction(posParam.createRemoveKeyframeAction(t, true));
        }}, 'rm pos kf');
    }}

    // Reset TV
    await proj.executeTransaction(async (ca) => {{
        ca.addAction(scaleParam.createSetTimeVaryingAction(false));
    }}, 'scale TV off');
    await proj.executeTransaction(async (ca) => {{
        ca.addAction(scaleParam.createSetTimeVaryingAction(true));
    }}, 'scale TV on');
    await proj.executeTransaction(async (ca) => {{
        ca.addAction(posParam.createSetTimeVaryingAction(false));
    }}, 'pos TV off');
    await proj.executeTransaction(async (ca) => {{
        ca.addAction(posParam.createSetTimeVaryingAction(true));
    }}, 'pos TV on');

    // Build KF objects
    const scaleKfs = [], posKfs = [];
    for (const {{ offsetSec, scale }} of kfPlan) {{
        const frac_n  = Math.round(offsetSec * 10000);
        const frac_d  = Math.round(dur.seconds * 10000);
        const srcTime = inPoint.add(dur.multiply(frac_n).divide(frac_d));
        const S = scale / 100;

        const skf = scaleParam.createKeyframe(scale);
        skf.position = srcTime;
        await skf.setTemporalInterpolationMode(HOLD);
        scaleKfs.push(skf);

        const pkf = posParam.createKeyframe(app.PointF(
            cx + (0.5 - cx) * S,
            cy + (0.5 - cy) * S
        ));
        pkf.position = srcTime;
        posKfs.push({{ kf: pkf, srcTime }});
    }}

    // Batch add
    try {{
        await proj.executeTransaction(async (ca) => {{
            for (const kf of scaleKfs) ca.addAction(scaleParam.createAddKeyframeAction(kf));
        }}, `clip${{idx}} scale`);
        r.scaleOK = true;
    }} catch(e) {{ r.scaleErr = e.message; }}

    try {{
        await proj.executeTransaction(async (ca) => {{
            for (const {{ kf }} of posKfs) ca.addAction(posParam.createAddKeyframeAction(kf));
        }}, `clip${{idx}} pos`);
        r.posOK = true;
    }} catch(e) {{ r.posErr = e.message; }}

    // HOLD on position KFs
    for (const {{ srcTime }} of posKfs) {{
        try {{
            await proj.executeTransaction(async (ca) => {{
                ca.addAction(posParam.createSetInterpolationAtKeyframeAction(srcTime, HOLD, false));
            }}, 'pos hold');
        }} catch(e) {{ r.errors.push('posHold: ' + e.message); }}
    }}

    results[idx] = r;
}}

return results;
"""

BATCHES = [
    (2,   51,  '/mnt/c/Users/Roy/apply_batch_1.js'),
    (52,  101, '/mnt/c/Users/Roy/apply_batch_2.js'),
    (102, 151, '/mnt/c/Users/Roy/apply_batch_3.js'),
    (152, 208, '/mnt/c/Users/Roy/apply_batch_4.js'),
]

for batch_start, batch_end, out_path in BATCHES:
    slice_dict = {}
    for idx in range(batch_start, batch_end + 1):
        key = str(idx)
        if key in clip_plans:
            slice_dict[idx] = clip_plans[key]

    # json.dumps produces valid JS for simple dicts/lists/numbers
    clip_plans_js = json.dumps(slice_dict, separators=(', ', ': '))

    content = TEMPLATE.format(
        BATCH_START=batch_start,
        BATCH_END=batch_end,
        CLIP_PLANS_SLICE=clip_plans_js,
    )

    with open(out_path, 'w') as f:
        f.write(content)

    print(f"Wrote {out_path} ({len(content)} bytes, {len(slice_dict)} clips)")

print("Done.")
