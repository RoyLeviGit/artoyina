// Apply content-aware scale + position keyframes, clips 152–208
// Subject: cx=0.375, cy=0.25 (top-left area). Pan formula: pos = cx + (0.5-cx)*S
// HOLD interpolation. KF positions in source timecode (getInPoint() base).

const proj = await app.Project.getActiveProject();
const seq  = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);
const HOLD = constants.InterpolationMode.HOLD;
const cx = 0.375, cy = 0.25;

const CLIP_PLANS = {"152": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.1152, "scale": 100}, {"offsetSec": 1.8832, "scale": 100}, {"offsetSec": 2.7672, "scale": 115}, {"offsetSec": 5.2352, "scale": 100}, {"offsetSec": 6.9532, "scale": 100}, {"offsetSec": 7.7532, "scale": 100}], "153": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.2331, "scale": 100}, {"offsetSec": 2.1331, "scale": 100}, {"offsetSec": 3.9181, "scale": 100}], "154": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.1138, "scale": 100}, {"offsetSec": 2.2478, "scale": 100}, {"offsetSec": 4.0658, "scale": 100}, {"offsetSec": 5.1168, "scale": 104}], "155": [{"offsetSec": 0.0, "scale": 104}, {"offsetSec": 0.0309, "scale": 100}, {"offsetSec": 1.8979, "scale": 108}, {"offsetSec": 4.5839, "scale": 100}, {"offsetSec": 6.3679, "scale": 100}], "156": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.4643, "scale": 100}, {"offsetSec": 2.4813, "scale": 100}, {"offsetSec": 4.7333, "scale": 100}], "157": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.462, "scale": 114}, {"offsetSec": 2.713, "scale": 100}, {"offsetSec": 4.681, "scale": 100}], "158": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.4428, "scale": 100}, {"offsetSec": 1.6608, "scale": 100}, {"offsetSec": 3.4448, "scale": 100}, {"offsetSec": 5.3628, "scale": 115}, {"offsetSec": 7.7978, "scale": 100}], "159": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.861, "scale": 100}, {"offsetSec": 3.379, "scale": 100}, {"offsetSec": 3.963, "scale": 100}, {"offsetSec": 5.831, "scale": 100}], "160": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.427, "scale": 103}, {"offsetSec": 2.461, "scale": 100}, {"offsetSec": 5.229, "scale": 100}], "161": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.142, "scale": 100}, {"offsetSec": 2.31, "scale": 100}, {"offsetSec": 4.294, "scale": 100}], "162": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.2066, "scale": 100}, {"offsetSec": 3.6586, "scale": 100}, {"offsetSec": 4.2586, "scale": 100}, {"offsetSec": 6.2106, "scale": 100}], "163": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.5231, "scale": 100}, {"offsetSec": 3.7081, "scale": 100}, {"offsetSec": 5.6921, "scale": 100}, {"offsetSec": 7.3271, "scale": 100}], "164": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.4565, "scale": 100}, {"offsetSec": 2.4745, "scale": 100}, {"offsetSec": 4.1585, "scale": 100}, {"offsetSec": 5.6595, "scale": 100}], "165": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.072, "scale": 100}, {"offsetSec": 1.923, "scale": 100}, {"offsetSec": 4.509, "scale": 100}, {"offsetSec": 5.909, "scale": 100}], "166": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.1054, "scale": 100}, {"offsetSec": 3.0734, "scale": 100}, {"offsetSec": 4.9914, "scale": 109}], "167": [{"offsetSec": 0.0, "scale": 109}, {"offsetSec": 1.3558, "scale": 100}, {"offsetSec": 3.3398, "scale": 100}, {"offsetSec": 4.4078, "scale": 100}], "168": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.4024, "scale": 100}, {"offsetSec": 1.0204, "scale": 100}, {"offsetSec": 2.2204, "scale": 100}, {"offsetSec": 4.1554, "scale": 100}, {"offsetSec": 6.6904, "scale": 110}], "169": [{"offsetSec": 0.0, "scale": 110}, {"offsetSec": 1.4198, "scale": 100}, {"offsetSec": 3.5208, "scale": 100}, {"offsetSec": 4.8558, "scale": 100}], "170": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.4186, "scale": 100}, {"offsetSec": 3.6696, "scale": 106}, {"offsetSec": 4.6866, "scale": 100}, {"offsetSec": 6.7886, "scale": 100}], "171": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.1681, "scale": 100}, {"offsetSec": 2.2181, "scale": 100}, {"offsetSec": 3.7861, "scale": 100}, {"offsetSec": 4.8031, "scale": 100}, {"offsetSec": 7.3051, "scale": 108}], "172": [{"offsetSec": 0.0, "scale": 108}, {"offsetSec": 1.5318, "scale": 100}, {"offsetSec": 2.7658, "scale": 100}, {"offsetSec": 4.4508, "scale": 100}], "173": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.1642, "scale": 100}, {"offsetSec": 3.3162, "scale": 100}, {"offsetSec": 4.7002, "scale": 100}, {"offsetSec": 4.8332, "scale": 105}, {"offsetSec": 6.5512, "scale": 100}], "174": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 3.0988, "scale": 100}, {"offsetSec": 3.4988, "scale": 100}, {"offsetSec": 5.3668, "scale": 100}], "175": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 2.1294, "scale": 100}, {"offsetSec": 2.2634, "scale": 100}, {"offsetSec": 5.0144, "scale": 100}], "176": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.0101, "scale": 100}, {"offsetSec": 2.7451, "scale": 100}, {"offsetSec": 4.4291, "scale": 100}, {"offsetSec": 5.8471, "scale": 100}], "177": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9264, "scale": 100}, {"offsetSec": 2.8774, "scale": 109}, {"offsetSec": 4.3954, "scale": 100}, {"offsetSec": 5.5454, "scale": 100}], "178": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.4257, "scale": 100}, {"offsetSec": 1.7097, "scale": 106}, {"offsetSec": 3.8447, "scale": 100}], "179": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.2736, "scale": 100}, {"offsetSec": 2.1916, "scale": 100}, {"offsetSec": 3.9096, "scale": 100}, {"offsetSec": 5.3766, "scale": 100}], "180": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.2729, "scale": 100}, {"offsetSec": 1.8569, "scale": 100}, {"offsetSec": 3.8079, "scale": 100}, {"offsetSec": 5.8259, "scale": 100}, {"offsetSec": 7.5269, "scale": 100}], "181": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.074, "scale": 106}, {"offsetSec": 4.81, "scale": 105}, {"offsetSec": 6.344, "scale": 100}], "182": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9235, "scale": 100}, {"offsetSec": 2.4575, "scale": 100}, {"offsetSec": 3.3085, "scale": 100}, {"offsetSec": 5.1255, "scale": 100}], "183": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9389, "scale": 112}, {"offsetSec": 2.9569, "scale": 100}], "184": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.2198, "scale": 100}, {"offsetSec": 1.5878, "scale": 100}, {"offsetSec": 3.3058, "scale": 100}, {"offsetSec": 4.4228, "scale": 100}], "185": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.8856, "scale": 100}, {"offsetSec": 3.3536, "scale": 100}, {"offsetSec": 5.0216, "scale": 100}], "186": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9849, "scale": 100}, {"offsetSec": 3.6199, "scale": 100}, {"offsetSec": 4.8199, "scale": 100}], "187": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.5485, "scale": 100}, {"offsetSec": 1.7495, "scale": 105}, {"offsetSec": 5.3025, "scale": 100}], "188": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.8476, "scale": 100}, {"offsetSec": 2.3486, "scale": 100}, {"offsetSec": 2.9486, "scale": 100}, {"offsetSec": 5.1336, "scale": 100}], "189": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.6973, "scale": 100}, {"offsetSec": 1.8473, "scale": 100}, {"offsetSec": 2.7983, "scale": 100}, {"offsetSec": 4.5993, "scale": 100}], "190": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.1458, "scale": 100}, {"offsetSec": 1.1298, "scale": 100}, {"offsetSec": 2.9808, "scale": 100}], "191": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.6108, "scale": 100}, {"offsetSec": 2.9948, "scale": 100}, {"offsetSec": 4.3298, "scale": 100}, {"offsetSec": 5.9138, "scale": 100}], "192": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.7278, "scale": 100}, {"offsetSec": 2.2458, "scale": 108}, {"offsetSec": 3.5958, "scale": 105}, {"offsetSec": 5.4138, "scale": 100}], "193": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.6272, "scale": 100}, {"offsetSec": 2.0782, "scale": 100}, {"offsetSec": 2.8282, "scale": 100}, {"offsetSec": 4.5132, "scale": 100}], "194": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.2252, "scale": 100}, {"offsetSec": 3.2602, "scale": 100}, {"offsetSec": 5.0952, "scale": 113}], "195": [{"offsetSec": 0.0, "scale": 113}, {"offsetSec": 0.9579, "scale": 100}, {"offsetSec": 2.4089, "scale": 100}, {"offsetSec": 4.4439, "scale": 100}], "196": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.5725, "scale": 111}, {"offsetSec": 1.7895, "scale": 114}, {"offsetSec": 4.1085, "scale": 104}, {"offsetSec": 5.4255, "scale": 100}, {"offsetSec": 6.6265, "scale": 100}], "197": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.6721, "scale": 105}, {"offsetSec": 2.2731, "scale": 100}, {"offsetSec": 3.4081, "scale": 100}, {"offsetSec": 5.6421, "scale": 107}], "198": [{"offsetSec": 0.0, "scale": 107}, {"offsetSec": 0.9725, "scale": 100}, {"offsetSec": 2.2565, "scale": 100}, {"offsetSec": 3.7075, "scale": 100}, {"offsetSec": 5.5415, "scale": 100}], "199": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9375, "scale": 100}, {"offsetSec": 2.8225, "scale": 100}, {"offsetSec": 4.5565, "scale": 112}], "200": [{"offsetSec": 0.0, "scale": 112}, {"offsetSec": 0.0029, "scale": 100}, {"offsetSec": 1.5539, "scale": 100}, {"offsetSec": 3.1889, "scale": 100}, {"offsetSec": 4.9899, "scale": 100}], "201": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.1528, "scale": 100}, {"offsetSec": 2.5868, "scale": 100}, {"offsetSec": 4.3708, "scale": 100}, {"offsetSec": 5.5388, "scale": 100}], "202": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.1344, "scale": 100}, {"offsetSec": 1.3854, "scale": 111}, {"offsetSec": 3.2704, "scale": 100}, {"offsetSec": 5.4384, "scale": 100}], "203": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.9846, "scale": 100}, {"offsetSec": 2.3356, "scale": 100}, {"offsetSec": 3.6696, "scale": 100}, {"offsetSec": 5.6206, "scale": 100}], "204": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.2656, "scale": 100}, {"offsetSec": 1.3166, "scale": 100}, {"offsetSec": 2.9006, "scale": 100}, {"offsetSec": 5.5356, "scale": 100}], "205": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.4493, "scale": 100}, {"offsetSec": 3.5843, "scale": 100}, {"offsetSec": 5.7363, "scale": 100}], "206": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.816, "scale": 100}, {"offsetSec": 2.333, "scale": 107}, {"offsetSec": 3.568, "scale": 100}, {"offsetSec": 5.686, "scale": 100}, {"offsetSec": 7.32, "scale": 100}, {"offsetSec": 9.621, "scale": 100}, {"offsetSec": 10.455, "scale": 100}, {"offsetSec": 12.84, "scale": 100}, {"offsetSec": 14.141, "scale": 100}, {"offsetSec": 17.243, "scale": 100}, {"offsetSec": 19.511, "scale": 100}, {"offsetSec": 20.629, "scale": 100}, {"offsetSec": 22.296, "scale": 100}, {"offsetSec": 24.398, "scale": 100}, {"offsetSec": 25.782, "scale": 100}, {"offsetSec": 27.783, "scale": 100}, {"offsetSec": 29.885, "scale": 107}, {"offsetSec": 32.286, "scale": 100}, {"offsetSec": 34.404, "scale": 100}], "207": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 0.1834, "scale": 100}, {"offsetSec": 2.6014, "scale": 100}, {"offsetSec": 4.4524, "scale": 100}], "208": [{"offsetSec": 0.0, "scale": 100}, {"offsetSec": 1.6835, "scale": 100}, {"offsetSec": 2.9845, "scale": 100}]};

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

    // Remove existing KFs
    for (const t of scaleParam.getKeyframeListAsTickTimes()) {
        await proj.executeTransaction(async (ca) => {
            ca.addAction(scaleParam.createRemoveKeyframeAction(t, true));
        }, 'rm scale kf');
    }
    for (const t of posParam.getKeyframeListAsTickTimes()) {
        await proj.executeTransaction(async (ca) => {
            ca.addAction(posParam.createRemoveKeyframeAction(t, true));
        }, 'rm pos kf');
    }

    // Reset TV
    await proj.executeTransaction(async (ca) => {
        ca.addAction(scaleParam.createSetTimeVaryingAction(false));
    }, 'scale TV off');
    await proj.executeTransaction(async (ca) => {
        ca.addAction(scaleParam.createSetTimeVaryingAction(true));
    }, 'scale TV on');
    await proj.executeTransaction(async (ca) => {
        ca.addAction(posParam.createSetTimeVaryingAction(false));
    }, 'pos TV off');
    await proj.executeTransaction(async (ca) => {
        ca.addAction(posParam.createSetTimeVaryingAction(true));
    }, 'pos TV on');

    // Build KF objects
    const scaleKfs = [], posKfs = [];
    for (const { offsetSec, scale } of kfPlan) {
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
        posKfs.push({ kf: pkf, srcTime });
    }

    // Batch add
    try {
        await proj.executeTransaction(async (ca) => {
            for (const kf of scaleKfs) ca.addAction(scaleParam.createAddKeyframeAction(kf));
        }, `clip${idx} scale`);
        r.scaleOK = true;
    } catch(e) { r.scaleErr = e.message; }

    try {
        await proj.executeTransaction(async (ca) => {
            for (const { kf } of posKfs) ca.addAction(posParam.createAddKeyframeAction(kf));
        }, `clip${idx} pos`);
        r.posOK = true;
    } catch(e) { r.posErr = e.message; }

    // HOLD on position KFs
    for (const { srcTime } of posKfs) {
        try {
            await proj.executeTransaction(async (ca) => {
                ca.addAction(posParam.createSetInterpolationAtKeyframeAction(srcTime, HOLD, false));
            }, 'pos hold');
        } catch(e) { r.errors.push('posHold: ' + e.message); }
    }

    results[idx] = r;
}

return results;
