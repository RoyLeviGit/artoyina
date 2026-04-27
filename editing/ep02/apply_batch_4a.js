// Apply content-aware scale + position keyframes, clips 152–179
// Defensive: try/catch per clip, detailed results, source timecode KF positions.
// Subject cx=0.375 cy=0.25. Pan: pos = cx + (0.5-cx)*S. HOLD interpolation.

const proj = await app.Project.getActiveProject();
const seq  = (await proj.getSequences()).find(s => s.name === 'RoughCut');
const track = await seq.getVideoTrack(0);
const items = await track.getTrackItems(constants.TrackItemType.CLIP, false);
const HOLD = constants.InterpolationMode.HOLD;
const cx = 0.375, cy = 0.25;

const CLIP_PLANS = {"152":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.1152,"scale":100},{"offsetSec":1.8832,"scale":100},{"offsetSec":2.7672,"scale":115},{"offsetSec":5.2352,"scale":100},{"offsetSec":6.9532,"scale":100},{"offsetSec":7.7532,"scale":100}],"153":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.2331,"scale":100},{"offsetSec":2.1331,"scale":100},{"offsetSec":3.9181,"scale":100}],"154":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.1138,"scale":100},{"offsetSec":2.2478,"scale":100},{"offsetSec":4.0658,"scale":100},{"offsetSec":5.1168,"scale":104}],"155":[{"offsetSec":0.0,"scale":104},{"offsetSec":0.0309,"scale":100},{"offsetSec":1.8979,"scale":108},{"offsetSec":4.5839,"scale":100},{"offsetSec":6.3679,"scale":100}],"156":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.4643,"scale":100},{"offsetSec":2.4813,"scale":100},{"offsetSec":4.7333,"scale":100}],"157":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.462,"scale":114},{"offsetSec":2.713,"scale":100},{"offsetSec":4.681,"scale":100}],"158":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.4428,"scale":100},{"offsetSec":1.6608,"scale":100},{"offsetSec":3.4448,"scale":100},{"offsetSec":5.3628,"scale":115},{"offsetSec":7.7978,"scale":100}],"159":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.861,"scale":100},{"offsetSec":3.379,"scale":100},{"offsetSec":3.963,"scale":100},{"offsetSec":5.831,"scale":100}],"160":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.427,"scale":103},{"offsetSec":2.461,"scale":100},{"offsetSec":5.229,"scale":100}],"161":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.142,"scale":100},{"offsetSec":2.31,"scale":100},{"offsetSec":4.294,"scale":100}],"162":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.2066,"scale":100},{"offsetSec":3.6586,"scale":100},{"offsetSec":4.2586,"scale":100},{"offsetSec":6.2106,"scale":100}],"163":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.5231,"scale":100},{"offsetSec":3.7081,"scale":100},{"offsetSec":5.6921,"scale":100},{"offsetSec":7.3271,"scale":100}],"164":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.4565,"scale":100},{"offsetSec":2.4745,"scale":100},{"offsetSec":4.1585,"scale":100},{"offsetSec":5.6595,"scale":100}],"165":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.072,"scale":100},{"offsetSec":1.923,"scale":100},{"offsetSec":4.509,"scale":100},{"offsetSec":5.909,"scale":100}],"166":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.1054,"scale":100},{"offsetSec":3.0734,"scale":100},{"offsetSec":4.9914,"scale":109}],"167":[{"offsetSec":0.0,"scale":109},{"offsetSec":1.3558,"scale":100},{"offsetSec":3.3398,"scale":100},{"offsetSec":4.4078,"scale":100}],"168":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.4024,"scale":100},{"offsetSec":1.0204,"scale":100},{"offsetSec":2.2204,"scale":100},{"offsetSec":4.1554,"scale":100},{"offsetSec":6.6904,"scale":110}],"169":[{"offsetSec":0.0,"scale":110},{"offsetSec":1.4198,"scale":100},{"offsetSec":3.5208,"scale":100},{"offsetSec":4.8558,"scale":100}],"170":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.4186,"scale":100},{"offsetSec":3.6696,"scale":106},{"offsetSec":4.6866,"scale":100},{"offsetSec":6.7886,"scale":100}],"171":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.1681,"scale":100},{"offsetSec":2.2181,"scale":100},{"offsetSec":3.7861,"scale":100},{"offsetSec":4.8031,"scale":100},{"offsetSec":7.3051,"scale":108}],"172":[{"offsetSec":0.0,"scale":108},{"offsetSec":1.5318,"scale":100},{"offsetSec":2.7658,"scale":100},{"offsetSec":4.4508,"scale":100}],"173":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.1642,"scale":100},{"offsetSec":3.3162,"scale":100},{"offsetSec":4.7002,"scale":100},{"offsetSec":4.8332,"scale":105},{"offsetSec":6.5512,"scale":100}],"174":[{"offsetSec":0.0,"scale":100},{"offsetSec":3.0988,"scale":100},{"offsetSec":3.4988,"scale":100},{"offsetSec":5.3668,"scale":100}],"175":[{"offsetSec":0.0,"scale":100},{"offsetSec":2.1294,"scale":100},{"offsetSec":2.2634,"scale":100},{"offsetSec":5.0144,"scale":100}],"176":[{"offsetSec":0.0,"scale":100},{"offsetSec":1.0101,"scale":100},{"offsetSec":2.7451,"scale":100},{"offsetSec":4.4291,"scale":100},{"offsetSec":5.8471,"scale":100}],"177":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.9264,"scale":100},{"offsetSec":2.8774,"scale":109},{"offsetSec":4.3954,"scale":100},{"offsetSec":5.5454,"scale":100}],"178":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.4257,"scale":100},{"offsetSec":1.7097,"scale":106},{"offsetSec":3.8447,"scale":100}],"179":[{"offsetSec":0.0,"scale":100},{"offsetSec":0.2736,"scale":100},{"offsetSec":2.1916,"scale":100},{"offsetSec":3.9096,"scale":100},{"offsetSec":5.3766,"scale":100}]};

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
