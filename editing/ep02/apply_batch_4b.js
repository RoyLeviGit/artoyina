// Apply content-aware scale + position keyframes, clips 180–208
// Defensive: try/catch per clip, detailed results, source timecode KF positions.
// Subject cx=0.375 cy=0.25. Pan: pos = cx + (0.5-cx)*S. HOLD interpolation.

const proj = await app.Project.getActiveProject();
const seq  = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);
const HOLD = constants.InterpolationMode.HOLD;
const cx = 0.375, cy = 0.25;

const CLIP_PLANS = {"180":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.2729,"scale":100},{"offsetSec":1.8569,"scale":100},{"offsetSec":3.8079,"scale":100},{"offsetSec":5.8259,"scale":100},{"offsetSec":7.5269,"scale":100}],"181":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.074,"scale":106},{"offsetSec":4.81,"scale":105},{"offsetSec":6.344,"scale":100}],"182":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9235,"scale":100},{"offsetSec":2.4575,"scale":100},{"offsetSec":3.3085,"scale":100},{"offsetSec":5.1255,"scale":100}],"183":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9389,"scale":112},{"offsetSec":2.9569,"scale":100}],"184":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.2198,"scale":100},{"offsetSec":1.5878,"scale":100},{"offsetSec":3.3058,"scale":100},{"offsetSec":4.4228,"scale":100}],"185":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.8856,"scale":100},{"offsetSec":3.3536,"scale":100},{"offsetSec":5.0216,"scale":100}],"186":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9849,"scale":100},{"offsetSec":3.6199,"scale":100},{"offsetSec":4.8199,"scale":100}],"187":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.5485,"scale":100},{"offsetSec":1.7495,"scale":105},{"offsetSec":5.3025,"scale":100}],"188":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.8476,"scale":100},{"offsetSec":2.3486,"scale":100},{"offsetSec":2.9486,"scale":100},{"offsetSec":5.1336,"scale":100}],"189":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.6973,"scale":100},{"offsetSec":1.8473,"scale":100},{"offsetSec":2.7983,"scale":100},{"offsetSec":4.5993,"scale":100}],"190":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.1458,"scale":100},{"offsetSec":1.1298,"scale":100},{"offsetSec":2.9808,"scale":100}],"191":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.6108,"scale":100},{"offsetSec":2.9948,"scale":100},{"offsetSec":4.3298,"scale":100},{"offsetSec":5.9138,"scale":100}],"192":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.7278,"scale":100},{"offsetSec":2.2458,"scale":108},{"offsetSec":3.5958,"scale":105},{"offsetSec":5.4138,"scale":100}],"193":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.6272,"scale":100},{"offsetSec":2.0782,"scale":100},{"offsetSec":2.8282,"scale":100},{"offsetSec":4.5132,"scale":100}],"194":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.2252,"scale":100},{"offsetSec":3.2602,"scale":100},{"offsetSec":5.0952,"scale":113}],"195":[{"offsetSec":0.0,"scale":113},{"offsetSec":0.9579,"scale":100},{"offsetSec":2.4089,"scale":100},{"offsetSec":4.4439,"scale":100}],"196":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.5725,"scale":111},{"offsetSec":1.7895,"scale":114},{"offsetSec":4.1085,"scale":104},{"offsetSec":5.4255,"scale":100},{"offsetSec":6.6265,"scale":100}],"197":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.6721,"scale":105},{"offsetSec":2.2731,"scale":100},{"offsetSec":3.4081,"scale":100},{"offsetSec":5.6421,"scale":107}],"198":[{"offsetSec":0.0,"scale":107},{"offsetSec":0.9725,"scale":100},{"offsetSec":2.2565,"scale":100},{"offsetSec":3.7075,"scale":100},{"offsetSec":5.5415,"scale":100}],"199":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9375,"scale":100},{"offsetSec":2.8225,"scale":100},{"offsetSec":4.5565,"scale":112}],"200":[{"offsetSec":0.0,"scale":112},{"offsetSec":0.0029,"scale":100},{"offsetSec":1.5539,"scale":100},{"offsetSec":3.1889,"scale":100},{"offsetSec":4.9899,"scale":100}],"201":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.1528,"scale":100},{"offsetSec":2.5868,"scale":100},{"offsetSec":4.3708,"scale":100},{"offsetSec":5.5388,"scale":100}],"202":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.1344,"scale":100},{"offsetSec":1.3854,"scale":111},{"offsetSec":3.2704,"scale":100},{"offsetSec":5.4384,"scale":100}],"203":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9846,"scale":100},{"offsetSec":2.3356,"scale":100},{"offsetSec":3.6696,"scale":100},{"offsetSec":5.6206,"scale":100}],"204":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.2656,"scale":100},{"offsetSec":1.3166,"scale":100},{"offsetSec":2.9006,"scale":100},{"offsetSec":5.5356,"scale":100}],"205":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.4493,"scale":100},{"offsetSec":3.5843,"scale":100},{"offsetSec":5.7363,"scale":100}],"206":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.816,"scale":100},{"offsetSec":2.333,"scale":107},{"offsetSec":3.568,"scale":100},{"offsetSec":5.686,"scale":100},{"offsetSec":7.32,"scale":100},{"offsetSec":9.621,"scale":100},{"offsetSec":10.455,"scale":100},{"offsetSec":12.84,"scale":100},{"offsetSec":14.141,"scale":100},{"offsetSec":17.243,"scale":100},{"offsetSec":19.511,"scale":100},{"offsetSec":20.629,"scale":100},{"offsetSec":22.296,"scale":100},{"offsetSec":24.398,"scale":100},{"offsetSec":25.782,"scale":100},{"offsetSec":27.783,"scale":100},{"offsetSec":29.885,"scale":107},{"offsetSec":32.286,"scale":100},{"offsetSec":34.404,"scale":100}],"207":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.1834,"scale":100},{"offsetSec":2.6014,"scale":100},{"offsetSec":4.4524,"scale":100}],"208":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.6835,"scale":100},{"offsetSec":2.9845,"scale":100}]};

const results = { _meta: { total: Object.keys(CLIP_PLANS).length, done: 0, failed: 0 } };

for (const [idxStr, kfPlan] of Object.entries(CLIP_PLANS)) {
    const idx = parseInt(idxStr);
    const r = { idx, errors: [], kfPlan: kfPlan.map(k => k.scale) };
    results[idx] = r; // write immediately so partial results survive a crash

    try {
        const clip = items[idx];
        const inPoint  = await clip.getInPoint();
        const seqStart = await clip.getStartTime();
        const seqEnd   = idx < items.length - 1
            ? await items[idx + 1].getStartTime()
            : await clip.getEndTime();
        const dur = seqEnd.subtract(seqStart);
        r.durSec = Math.round(dur.seconds * 100) / 100;
        r.inPointSec = Math.round(inPoint.seconds * 100) / 100;

        const chain      = await clip.getComponentChain();
        const motionComp = await chain.getComponentAtIndex(1);
        const scaleParam = await motionComp.getParam(1);
        const posParam   = await motionComp.getParam(0);

        // Remove existing KFs
        const scaleTicksBefore = scaleParam.getKeyframeListAsTickTimes();
        const posTicksBefore   = posParam.getKeyframeListAsTickTimes();
        r.scaleKfsRemoved = scaleTicksBefore.length;
        r.posKfsRemoved   = posTicksBefore.length;
        for (const t of scaleTicksBefore)
            await proj.executeTransaction(async ca => ca.addAction(scaleParam.createRemoveKeyframeAction(t, true)), );
        for (const t of posTicksBefore)
            await proj.executeTransaction(async ca => ca.addAction(posParam.createRemoveKeyframeAction(t, true)), );

        // Reset TV
        await proj.executeTransaction(async ca => ca.addAction(scaleParam.createSetTimeVaryingAction(false)), );
        await proj.executeTransaction(async ca => ca.addAction(scaleParam.createSetTimeVaryingAction(true)), );
        await proj.executeTransaction(async ca => ca.addAction(posParam.createSetTimeVaryingAction(false)), );
        await proj.executeTransaction(async ca => ca.addAction(posParam.createSetTimeVaryingAction(true)), );

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

        // Batch add scale KFs
        try {
            await proj.executeTransaction(async ca => {
                for (const kf of scaleKfs) ca.addAction(scaleParam.createAddKeyframeAction(kf));
            }, );
            r.scaleOK = true;
        } catch(e) { r.scaleErr = e.message; r.errors.push('scale: ' + e.message); }

        // Batch add position KFs
        try {
            await proj.executeTransaction(async ca => {
                for (const { kf } of posKfs) ca.addAction(posParam.createAddKeyframeAction(kf));
            }, );
            r.posOK = true;
        } catch(e) { r.posErr = e.message; r.errors.push('pos: ' + e.message); }

        // HOLD on each position KF
        let posHoldOK = 0;
        for (const { srcTime } of posKfs) {
            try {
                await proj.executeTransaction(async ca => {
                    ca.addAction(posParam.createSetInterpolationAtKeyframeAction(srcTime, HOLD, false));
                }, );
                posHoldOK++;
            } catch(e) { r.errors.push('posHold: ' + e.message); }
        }
        r.posHoldOK = posHoldOK;

        // Verify final KF counts
        r.finalScaleKfs = (await scaleParam.getKeyframeListAsTickTimes()).length;
        r.finalPosKfs   = (await posParam.getKeyframeListAsTickTimes()).length;

        r.ok = r.scaleOK && r.posOK && r.finalScaleKfs === kfPlan.length && r.finalPosKfs === kfPlan.length;
        results._meta.done++;

    } catch(e) {
        r.clipError = e.message;
        r.ok = false;
        results._meta.failed++;
    }
}

return results;
