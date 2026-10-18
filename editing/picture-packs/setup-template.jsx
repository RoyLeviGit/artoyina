#target aftereffects
(function () {
    var log = new File("/tmp/artoyina-packs-setup.txt");
    log.open("w");
    app.beginUndoGroup("Build reusable picture template pack");
    try {
        var p = app.project;
        if (!p.file || p.file.name !== "AE_AI_TempTEST.aep") throw new Error("Open AE_AI_TempTEST.aep first.");
        var originalFile = p.file;
        $.global.ARTOYINA_PACKS_NO_UI = true;
        $.evalFile(new File(File($.fileName).parent.fsName + "/Picture Packs.jsx"));
        var api = $.global.ArtoyinaPicturePacks;
        if (api.packs().length) throw new Error("Already set up; no changes made.");
        var zoom = null;
        for (var i = 1; i <= p.numItems; i++) {
            if (p.item(i) instanceof CompItem && p.item(i).name === "_TEMPLATE_zoom") zoom = p.item(i);
        }
        if (!zoom) throw new Error("Cannot find _TEMPLATE_zoom.");
        var image = null;
        for (var j = 1; j <= zoom.numLayers; j++) {
            var l = zoom.layer(j);
            if (l.source instanceof FootageItem && l.source.file) {
                if (image) throw new Error("More than one picture layer; inspect before continuing.");
                image = l;
            }
        }
        if (!image) throw new Error("No picture layer.");
        var backups = new Folder(originalFile.parent.fsName + "/picture-packs/backups");
        backups.create();
        var backup = new File(backups.fsName + "/AE_AI_TempTEST_before-packs_" + new Date().getTime() + ".aep");
        p.save(backup);
        p.save(originalFile);
        log.writeln("BACKUP " + backup.fsName);
        var pack = api.setup(zoom, image, 3840, 2160);
        p.save(originalFile);
        pack.zoom.saveFrameToPng(0, new File("/tmp/artoyina-zoom-after.png"));
        pack.full.saveFrameToPng(0, new File("/tmp/artoyina-full-after.png"));
        log.writeln("SUCCESS folder=" + pack.folder.id + " zoom=" + pack.zoom.id + " full=" + pack.full.id + " source=" + pack.picture.id);
    } catch (e) { log.writeln("ERROR " + e.toString() + " LINE " + e.line); }
    finally {
        $.global.ARTOYINA_PACKS_NO_UI = false;
        app.endUndoGroup();
        log.close();
    }
})();
