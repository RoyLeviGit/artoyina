#target aftereffects
(function () {
    var report = [], temporary = [], api;
    function assert(ok, message) {
        if (!ok) throw new Error(message);
        report.push("PASS " + message);
    }
    function pictureLayer(comp, source) {
        for (var i = 1; i <= comp.numLayers; i++) if (comp.layer(i).source === source) return comp.layer(i);
        throw new Error("Missing shared picture layer in " + comp.name);
    }
    function fit(pack) {
        var l = pictureLayer(pack.full, pack.picture);
        var s = l.transform.scale.value, a = l.transform.anchorPoint.value, p = l.transform.position.value;
        var endTime = pack.full.duration - pack.full.frameDuration;
        s = l.transform.scale.valueAtTime(endTime, false);
        var growth = l.parent ? l.parent.transform.scale.valueAtTime(endTime, false)[0] / 100 : 1;
        var w = pack.picture.width * s[0] / 100 * growth, h = pack.picture.height * s[1] / 100 * growth;
        assert(!l.transform.scale.expressionError && !l.transform.position.expressionError && !l.transform.anchorPoint.expressionError, "Full-screen expressions evaluate");
        assert(Math.abs(p[0] - pack.full.width / 2) < 0.01 && Math.abs(p[1] - pack.full.height / 2) < 0.01, "Picture is centered");
        assert(Math.abs(a[0] - pack.picture.width / 2) < 0.01 && Math.abs(a[1] - pack.picture.height / 2) < 0.01, "Anchor follows picture dimensions");
        assert(w <= pack.full.width * 0.8 + 0.01 && h <= pack.full.height * 0.8 + 0.01, "Entire picture is inside title safe");
        assert(Math.abs(w - pack.full.width * 0.8) < 0.01 || Math.abs(h - pack.full.height * 0.8) < 0.01, "Picture uses maximum available safe size");
        var zoomLayer = pictureLayer(pack.zoom, pack.picture);
        assert(!zoomLayer.transform.scale.expressionError && !zoomLayer.transform.anchorPoint.expressionError, "Zoom expressions evaluate");
        var za = zoomLayer.transform.anchorPoint.value;
        assert(za[0] === 0 && za[1] === 0, "Zoom picture anchor is its top-left corner");
        var zs = zoomLayer.transform.scale.value;
        assert(Math.abs(zs[0] - zs[1]) < 0.001, "Zoom preserves picture proportions");
    }
    function fullDesign(pack, master) {
        var c = pack.full, m = master.full;
        assert(c.duration === m.duration && c.frameRate === m.frameRate, "New full-screen timing comes from the master");
        assert(c.numLayers === m.numLayers, "New full-screen view includes every master layer");
        var control = c.layer("FULL SCREEN MOTION");
        assert(!control.transform.scale.expressionError, "Shared zoom expression evaluates");
        var start = control.transform.scale.valueAtTime(0, false)[0];
        var end = control.transform.scale.valueAtTime(c.duration - c.frameDuration, false)[0];
        var amount = control.property("ADBE Effect Parade").property("Zoom amount (%)").property(1).value;
        assert(Math.abs(start - 100) < 0.001 && Math.abs(end - 100/(1-amount/100)) < 0.001, "Shared zoom uses the configured starting reduction");
        assert(Math.abs(start/end - (1-amount/100)) < 0.001, "Picture starts at the configured fraction of its final title-safe size");
        for (var i = 1; i <= c.numLayers; i++) {
            var layer = c.layer(i), reference = m.layer(i);
            assert(layer.name === reference.name, "Master layer order retained: " + layer.name);
            if (layer !== control) assert(layer.parent === control, "Layer shares the zoom: " + layer.name);
            if (reference.source && reference.source !== master.picture) {
                assert(layer.source === reference.source, "Shared design asset retained: " + layer.name);
            }
            assert(layer.transform.opacity.value === reference.transform.opacity.value, "Opacity retained: " + layer.name);
        }
    }
    app.beginUndoGroup("Validate picture packs");
    try {
        if (!app.project.file || app.project.file.name !== "AE_AI_TempTEST.aep") throw new Error("Wrong project.");
        $.global.ARTOYINA_PACKS_NO_UI = true;
        $.evalFile(new File(File($.fileName).parent.fsName + "/Picture Packs.jsx"));
        api = $.global.ArtoyinaPicturePacks;
        var all = api.packs(), master = api.templatePack();
        // Start from an older pack to verify that master edits still carry over.
        var original = all[all.length - 1], count = app.project.numItems;
        var originalFile = original.picture.file.fsName;
        // Older packs retain their previous motion; validate the current master here.
        fit(master);
        var artworkDir = new Folder(app.project.file.parent.parent.fsName + "/modern-art-series/ep04-impressionism/artworks/Ai_test");
        var landscape = new File(artworkDir.fsName + "/manet_luncheon_on_the_grass_1863.jpg");
        var portrait = new File(artworkDir.fsName + "/cassatt_childs_bath_1893.jpg");
        var copy = api.duplicate(original, "__VALIDATION", landscape);
        temporary.push(copy);
        assert(copy.picture.id !== original.picture.id, "Duplicate has an independent source");
        assert(copy.zoom.numLayers === original.zoom.numLayers, "Duplicate retains all zoom design layers");
        assert(copy.zoom.layer("PICTURE").parent.containingComp.id === copy.zoom.id, "Duplicate parenting stays inside its own comp");
        assert(copy.zoom.layer("PICTURE").trackMatteLayer.containingComp.id === copy.zoom.id, "Duplicate matte stays inside its own comp");
        fit(copy);
        fullDesign(copy, master);
        copy.full.saveFrameToPng(0, new File("/tmp/artoyina-landscape-test.png"));
        api.replace(copy, portrait);
        assert(copy.picture.file.fsName === portrait.fsName, "Replacement changes the duplicate's shared source");
        pictureLayer(copy.zoom, copy.picture);
        pictureLayer(copy.full, copy.picture);
        assert(original.picture.file.fsName === originalFile, "Replacement leaves original pack unchanged");
        fit(copy);
        var second = api.duplicate(copy, "__VALIDATION", landscape);
        temporary.push(second);
        assert(second.folder.name !== copy.folder.name, "Repeated pack names are made unique");
        assert(second.picture.id !== copy.picture.id && second.picture.id !== original.picture.id, "Duplicate of a duplicate is also independent");
        fit(second);
        fullDesign(second, master);
        var batchResult = api.batch(original, [landscape, portrait, landscape, new File(artworkDir.fsName + "/__missing_batch_artwork__.jpg")]);
        for (var b = 0; b < batchResult.created.length; b++) temporary.push(batchResult.created[b]);
        assert(batchResult.created.length === 3 && batchResult.failed.length === 1, "Batch continues after a missing image and reports the failure");
        var first = batchResult.created[0], secondBatch = batchResult.created[1], repeated = batchResult.created[2];
        assert(first.folder.name.indexOf("manet_luncheon_on_the_grass_1863") === 0, "Batch names packs from image filenames");
        assert(first.folder.name !== repeated.folder.name, "Batch handles repeated filenames");
        assert(first.picture.id !== secondBatch.picture.id && first.picture.id !== repeated.picture.id, "Every batch artwork has its own source");
        for (var b = 0; b < batchResult.created.length; b++) {
            fit(batchResult.created[b]);
            fullDesign(batchResult.created[b], master);
        }
        api.replace(first, portrait);
        assert(repeated.picture.file.fsName === landscape.fsName && original.picture.file.fsName === originalFile, "Replacing one batch artwork leaves other packs unchanged");
        var originalText = original.zoom.layer("Text").property("ADBE Text Properties").property("ADBE Text Document").value;
        var updated = first.zoom.layer("Text").property("ADBE Text Properties").property("ADBE Text Document").value;
        assert(updated.text === "The Child’s Bath\rMary Cassatt, 1893", "Replacement updates the title and credit from metadata");
        var originalBreak = originalText.text.indexOf("\r"), updatedBreak = updated.text.indexOf("\r");
        var styleFields = ["font", "fontSize", "applyFill", "fillColor", "applyStroke", "strokeColor", "strokeWidth", "tracking", "horizontalScale", "verticalScale", "baselineShift"];
        for (var sf = 0; sf < styleFields.length; sf++) {
            var attr = styleFields[sf];
            for (var line = 0; line < 2; line++) {
                var oi = line ? originalBreak+1 : 0, ni = line ? updatedBreak+1 : 0;
                assert(String(originalText.characterRange(oi,oi+1)[attr]) === String(updated.characterRange(ni,ni+1)[attr]), "Caption retains paragraph " + line + " " + attr);
            }
        }
        assert(String(updated.boxTextSize) === String(originalText.boxTextSize), "Caption retains text box dimensions");
        var beforeFailure = first.picture.file.fsName, beforeText = updated.text, missing = new File(artworkDir.fsName + "/__missing_image__.jpg"), rejected = false;
        try { api.replace(first, missing); } catch (expected) { rejected = true; }
        assert(rejected && first.picture.file.fsName === beforeFailure && first.zoom.layer("Text").text.sourceText.value.text === beforeText, "Missing image leaves existing picture and caption unchanged");
        report.push("ALL CHECKS PASSED");
    } catch (e) {
        report.push("ERROR " + e.toString() + " LINE " + e.line);
    } finally {
        for (var k = temporary.length - 1; k >= 0; k--) {
            try { temporary[k].folder.remove(); } catch (e) { report.push("CLEANUP ERROR " + e.toString()); }
        }
        if (typeof count !== "undefined") report.push("Item count before=" + count + " after=" + app.project.numItems);
        $.global.ARTOYINA_PACKS_NO_UI = false;
        app.endUndoGroup();
        var log = new File("/tmp/artoyina-packs-validation.txt");
        log.open("w");
        log.write(report.join("\n"));
        log.close();
    }
})();
