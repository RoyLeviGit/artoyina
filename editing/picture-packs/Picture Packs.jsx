#target aftereffects

// Run from File > Scripts > Run Script File. Also works as a ScriptUI panel.
(function (host) {
    var TAG = "ARTOYINA_PICTURE_PACK_V1";
    function role(item, name) { item.comment = TAG + ":" + name; }
    function packs() {
        var result = [];
        if (!app.project) return result;
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof FolderItem && item.comment === TAG) result.push(read(item));
        }
        return result;
    }
    function read(folder) {
        var p = {folder: folder};
        for (var i = 1; i <= folder.numItems; i++) {
            var item = folder.item(i);
            if (item.comment === TAG + ":picture") p.picture = item;
            if (item.comment === TAG + ":zoom") p.zoom = item;
            if (item.comment === TAG + ":full") p.full = item;
        }
        return p;
    }
    function check(p) {
        if (!p || !p.picture || !p.zoom || !p.full) throw new Error("Select a complete picture pack.");
        // A missing old image must not block replacement or duplication with a new file.
    }
    function templatePack() {
        var list = packs();
        for (var i = 0; i < list.length; i++) {
            if (list[i].full && list[i].full.name === "_TEMPLATE_Fscreen") return list[i];
        }
        throw new Error("Keep the master composition named _TEMPLATE_Fscreen so new packs can use its latest design.");
    }
    function addFullMotion(comp) {
        var control = null;
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).comment === TAG + ":full-motion") control = comp.layer(i);
        }
        if (!control) {
            control = comp.layers.addNull(comp.duration);
            control.name = "FULL SCREEN MOTION";
            control.comment = TAG + ":full-motion";
            control.label = 9;
            // Equal anchor and position make this an identity transform at 100%,
            // preserving existing expression-driven positions when parenting.
            control.transform.anchorPoint.expression = "[thisComp.width/2, thisComp.height/2];";
            control.transform.position.expression = "[thisComp.width/2, thisComp.height/2];";
            var amount = control.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            amount.name = "Zoom amount (%)";
            amount.property(1).setValue(10);
            control.transform.scale.expression =
                'var amount = Math.max(0, Math.min(99, effect("Zoom amount (%)")(1)));\n' +
                'var end = Math.max(thisComp.frameDuration, thisComp.duration-thisComp.frameDuration);\n' +
                'var s = ease(time, 0, end, 100, 100/(1-amount/100));\n[s,s];';
        }
        control.inPoint = 0;
        control.outPoint = comp.duration;
        for (var j = 1; j <= comp.numLayers; j++) {
            var layer = comp.layer(j);
            if (layer !== control && !layer.parent && !layer.threeDLayer && layer instanceof AVLayer) {
                var locked = layer.locked;
                layer.locked = false;
                layer.setParentWithJump(control);
                layer.locked = locked;
            }
        }
        return control;
    }
    // Normalize the picture against the final parent zoom, retaining full background coverage.
    function fitFullPictureAtEnd(picture) {
        picture.transform.scale.expression =
            'var m = Math.max(0, Math.min(49, effect("Title-safe margin (%)")(1)))/100;\n' +
            "var s = 100*Math.min(thisComp.width*(1-2*m)/thisLayer.source.width, thisComp.height*(1-2*m)/thisLayer.source.height);\nvar end = Math.max(thisComp.frameDuration, thisComp.duration-thisComp.frameDuration);\nvar growth = thisLayer.hasParent ? parent.transform.scale.valueAtTime(end)[0]/100 : 1;\ns /= growth;\n[s,s];";
    }
    function importPicture(file) {
        if (!file || !file.exists) throw new Error("Picture file not found.");
        var options = new ImportOptions(file);
        options.sequence = false;
        var item = app.project.importFile(options);
        if (!(item instanceof FootageItem) || !item.mainSource.isStill || !item.file) {
            item.remove();
            throw new Error("Choose a still picture, such as a JPG or PNG.");
        }
        return item;
    }
    function clearSelection() {
        for (var i = 1; i <= app.project.numItems; i++) app.project.item(i).selected = false;
    }
    function uniqueName(name) {
        var base = name, suffix = 2;
        function used(n) {
            var list = packs();
            for (var i = 0; i < list.length; i++) if (list[i].folder.name === n) return true;
            return false;
        }
        while (used(name)) name = base + " " + suffix++;
        return name;
    }
    function trim(text) { return text.replace(/^\s+|\s+$/g, ""); }
    function captionFor(file, cache) {
        if (!file || !file.exists) throw new Error("Picture file not found.");
        var key = "$" + file.parent.fsName, catalog = cache[key];
        if (!catalog) {
            catalog = {entries: {}, error: null};
            cache[key] = catalog;
            var details = new File(file.parent.fsName + "/picture_filenames.txt");
            try {
                if (!details.exists) throw new Error("Missing picture_filenames.txt beside " + File.decode(file.name));
                details.encoding = "UTF-8";
                if (!details.open("r")) throw new Error("Cannot read " + details.fsName);
                var content;
                try { content = details.read(); } finally { details.close(); }
                var lines = content.replace(/^\uFEFF/, "").split(/\r\n|\r|\n/), entry = null;
                for (var i = 0; i < lines.length; i++) {
                    var match = /^\s*(?:\d+\.\s*)?File:\s*(.*?)\s*$/i.exec(lines[i]);
                    if (match) {
                        var filename = trim(match[1]), entryKey = "$" + filename;
                        if (!filename || catalog.entries[entryKey]) throw new Error("Empty or duplicate File entry in " + details.fsName + ": " + filename);
                        entry = {}; catalog.entries[entryKey] = entry;
                    } else if (entry) {
                        match = /^\s*(Artist|Artwork|Date of creation|Display title):\s*(.*?)\s*$/i.exec(lines[i]);
                        if (match) {
                            var field = match[1].toLowerCase();
                            if (typeof entry[field] !== "undefined") throw new Error("Repeated " + match[1] + " field in " + details.fsName);
                            entry[field] = trim(match[2]);
                        }
                    }
                }
            } catch (e) { catalog.error = e.toString(); }
        }
        var record = catalog.error ? null : catalog.entries["$" + File.decode(file.name)];
        var missing = [], title = record && (record["display title"] || record.artwork);
        if (!title) missing.push("artwork title");
        if (!record || !record.artist) missing.push("artist name");
        if (!record || !record["date of creation"]) missing.push("creation date");
        var warning = "";
        if (missing.length) {
            warning = File.decode(file.name) + ": Missing " + missing.join(", ") +
                ". Question marks were used for the missing information.";
            if (catalog.error) warning += "\n" + catalog.error;
            else if (!record) warning += "\nNo matching File entry in picture_filenames.txt.";
        }
        return {title: title || "???", credit: (record && record.artist || "???") + ", " +
            (record && record["date of creation"] || "???"), warning: warning};
    }

    function prepareCaption(comp, caption) {
        var layer = comp.layer("Text");
        if (!(layer instanceof TextLayer)) throw new Error("The zoom composition needs its original Text layer.");
        var prop = layer.property("ADBE Text Properties").property("ADBE Text Document");
        if (prop.expressionEnabled || prop.numKeys) throw new Error("Caption updates require unanimated Source Text; layer animation and effects are preserved.");
        var doc = prop.value, split = doc.text.indexOf("\r");
        if (split < 1 || split >= doc.text.length - 1) throw new Error("Keep a title and an artist/date paragraph in the Text layer.");
        // Replace from the end so both paragraphs retain their own typography.
        doc.characterRange(split + 1, doc.text.length).text = caption.credit;
        doc.characterRange(0, split).text = caption.title;
        return {layer: layer, prop: prop, doc: doc, original: prop.value};
    }
    function writeCaption(prepared, doc) {
        var locked = prepared.layer.locked;
        prepared.layer.locked = false;
        try { prepared.prop.setValue(doc || prepared.doc); }
        finally { prepared.layer.locked = locked; }
    }
    function captionWarning(p) {
        var doc = p.zoom.layer("Text").property("ADBE Text Properties").property("ADBE Text Document").value;
        var overflow = doc.boxOverflow ? p.folder.name + ": Caption exceeds the existing text box. Add a shorter Display title in picture_filenames.txt, then replace the picture again." : "";
        return (p.captionNotice || "") + (p.captionNotice && overflow ? "\n" : "") + overflow;
    }
    function replace(p, file) {
        check(p);
        var caption = captionFor(file, {});
        var prepared = prepareCaption(p.zoom, caption);
        // Validate the import before changing the shared source.
        var probe = importPicture(file);
        probe.remove();
        writeCaption(prepared);
        try { p.picture.replace(file); }
        catch (e) { writeCaption(prepared, prepared.original); throw e; }
        for (var i = 1; i <= p.zoom.numLayers; i++) {
            if (p.zoom.layer(i).source === p.picture) p.zoom.layer(i).transform.anchorPoint.expression = "[0, 0];";
        }
        p.captionNotice = caption.warning;
        return p;
    }
    function duplicate(p, name, file, catalogCache) {
        check(p);
        var master = templatePack();
        check(master);
        file = file || p.picture.file;
        var caption = captionFor(file, catalogCache || {});
        prepareCaption(p.zoom, caption);
        name = uniqueName(name || "Picture Pack");
        var created = [], fresh;
        try {
            var folder = app.project.items.addFolder(name);
            created.push(folder);
            folder.parentFolder = p.folder.parentFolder;
            folder.comment = TAG;
            fresh = importPicture(file || p.picture.file);
            created.push(fresh);
            fresh.name = "PICTURE - " + name;
            fresh.parentFolder = folder;
            role(fresh, "picture");
            // The selected pack supplies the zoom design. The master always
            // supplies full-screen styling and timing, including recent edits.
            var originals = [p.zoom, master.full], sources = [p.picture, master.picture], copies = [];
            for (var i = 0; i < originals.length; i++) {
                var copy = originals[i].duplicate();
                created.push(copy);
                copy.name = name + (i === 0 ? "_zoom" : "_Fscreen");
                copy.parentFolder = folder;
                role(copy, i === 0 ? "zoom" : "full");
                var replaced = 0;
                for (var j = 1; j <= copy.numLayers; j++) {
                    var layer = copy.layer(j);
                    if (layer.source === sources[i]) {
                        layer.replaceSource(fresh, false);
                        layer.name = "PICTURE";
                        if (i === 0) layer.transform.anchorPoint.expression = "[0, 0];";
                        replaced++;
                    }
                }
                if (!replaced) throw new Error("The original composition no longer uses the pack picture.");
                if (i === 1) addFullMotion(copy);
                copies.push(copy);
            }
            writeCaption(prepareCaption(copies[0], caption));
            var pack = read(folder);
            pack.captionNotice = caption.warning;
            return pack;
        } catch (e) {
            for (var k = created.length - 1; k >= 0; k--) {
                try { created[k].remove(); } catch (ignored) {}
            }
            throw e;
        }
    }
    function artworkName(file) {
        var name = File.decode(file.name).replace(/\.[^.]+$/, "");
        return name.replace(/^\s+|\s+$/g, "") || "Artwork";
    }
    function batch(p, files) {
        check(p);
        check(templatePack());
        var result = {created: [], failed: [], warnings: []}, catalogCache = {};
        for (var i = 0; i < files.length; i++) {
            try {
                var fresh = duplicate(p, artworkName(files[i]), files[i], catalogCache);
                result.created.push(fresh);
                var warning = captionWarning(fresh);
                if (warning) result.warnings.push(warning);
            } catch (e) {
                result.failed.push(File.decode(files[i].name) + ": " + e.toString());
            }
        }
        return result;
    }
    function setup(zoom, imageLayer, width, height) {
        if (packs().length) throw new Error("A template pack already exists.");
        if (!(zoom instanceof CompItem) || !imageLayer.source || !imageLayer.source.file) {
            throw new Error("Select a composition and a still-picture layer.");
        }
        var folder = app.project.items.addFolder("_TEMPLATE Picture Pack");
        folder.comment = TAG;
        folder.parentFolder = zoom.parentFolder;
        var original = imageLayer.source;
        // A dedicated source prevents replacement from affecting unrelated comps.
        var source = importPicture(original.file);
        source.name = "PICTURE - replace to update both comps";
        source.parentFolder = folder;
        role(source, "picture");
        var w = original.width, h = original.height;
        imageLayer.replaceSource(source, false);
        imageLayer.name = "PICTURE";
        imageLayer.comment = "Shared picture. Use Picture Packs to replace it in both views. Animate the parent null to pan and zoom.";
        // Preserve the original artwork footprint and all existing scale keyframes.
        // Different image proportions fit within that footprint without distortion.
        imageLayer.transform.scale.expression =
            "var fit = Math.min(" + w + "/thisLayer.source.width, " + h + "/thisLayer.source.height);\n" +
            "[value[0]*fit, value[1]*fit];";
        // Every replacement starts at the same top-left origin, regardless of dimensions.
        imageLayer.transform.anchorPoint.expression = "[0, 0];";
        zoom.parentFolder = folder;
        role(zoom, "zoom");
        var full = app.project.items.addComp("_TEMPLATE_Fscreen", width, height, 1, 10, zoom.frameRate);
        full.parentFolder = folder;
        full.bgColor = zoom.bgColor;
        role(full, "full");
        var picture = full.layers.add(source);
        picture.name = "PICTURE";
        picture.comment = "Same picture as zoom. Automatically centered and fitted inside the title-safe area.";
        var margin = picture.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        margin.name = "Title-safe margin (%)";
        margin.property(1).setValue(10);
        picture.transform.anchorPoint.expression = "[thisLayer.source.width/2, thisLayer.source.height/2];";
        picture.transform.position.expression = "[thisComp.width/2, thisComp.height/2];";
        fitFullPictureAtEnd(picture);
        full.addGuide(1, Math.round(width * 0.1));
        full.addGuide(1, Math.round(width * 0.9));
        full.addGuide(0, Math.round(height * 0.1));
        full.addGuide(0, Math.round(height * 0.9));
        addFullMotion(full);
        return read(folder);
    }
    var api = {packs: packs, read: read, setup: setup, replace: replace, duplicate: duplicate, batch: batch, captionFor: captionFor, templatePack: templatePack, addFullMotion: addFullMotion, fitFullPictureAtEnd: fitFullPictureAtEnd};
    $.global.ArtoyinaPicturePacks = api;
    if ($.global.ARTOYINA_PACKS_NO_UI) return;

    var win = host instanceof Panel ? host : new Window("palette", "Picture Packs", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    var row = win.add("group");
    var list = row.add("dropdownlist", undefined, []);
    list.preferredSize.width = 280;
    var refresh = row.add("button", undefined, "Refresh");
    var hint = win.add("statictext", undefined, "New full-screen views use the latest master template.");
    var captionHint = win.add("statictext", undefined, "Captions: picture_filenames.txt beside each image.");
    var replaceButton = win.add("button", undefined, "Replace picture in both comps...");
    var duplicateButton = win.add("button", undefined, "Duplicate pack with new picture...");
    var batchButton = win.add("button", undefined, "Create packs from multiple artworks...");
    var openBatch = win.add("checkbox", undefined, "Open both compositions for each new artwork");
    openBatch.value = false;
    var views = win.add("group");
    var openZoom = views.add("button", undefined, "Open zoom");
    var openFull = views.add("button", undefined, "Open full screen");
    var status = win.add("statictext", undefined, "", {multiline: true});
    status.preferredSize = [370, 42];
    var entries = [];
    function reload(id) {
        entries = packs();
        list.removeAll();
        var selection = 0;
        for (var i = 0; i < entries.length; i++) {
            list.add("item", entries[i].folder.name);
            if (entries[i].folder.id === id) selection = i;
        }
        if (entries.length) list.selection = selection;
        replaceButton.enabled = duplicateButton.enabled = batchButton.enabled = openZoom.enabled = openFull.enabled = entries.length > 0;
        status.text = entries.length ? "Choose a pack above. Save your project after making changes." : "Open a project containing a Picture Pack, then click Refresh.";
    }
    function selected() {
        if (!list.selection) throw new Error("Choose a picture pack first.");
        var p = read(entries[list.selection.index].folder);
        check(p);
        return p;
    }
    function action(fn) {
        app.beginUndoGroup("Picture Packs");
        try { fn(); } catch (e) { alert("Picture Packs: " + e.toString()); }
        finally { app.endUndoGroup(); }
    }
    refresh.onClick = function () { reload(); };
    replaceButton.onClick = function () {
        action(function () {
            var p = selected();
            var file = File.openDialog("Choose the replacement picture for both compositions", undefined, false);
            if (!file) return;
            replace(p, file);
            status.text = "Updated both pictures and the zoom caption in " + p.folder.name + ".";
            var warning = captionWarning(p);
            if (warning) alert(warning);
        });
    };
    duplicateButton.onClick = function () {
        action(function () {
            var p = selected();
            var name = prompt("Name the new picture pack", "Artwork");
            if (!name) return;
            name = name.replace(/^\s+|\s+$/g, "");
            if (!name) return;
            var file = File.openDialog("Choose the picture for the NEW pack", undefined, false);
            if (!file) return;
            var fresh = duplicate(p, name, file);
            clearSelection();
            fresh.folder.selected = true;
            reload(fresh.folder.id);
            fresh.zoom.openInViewer();
            status.text = "Created " + fresh.folder.name + " with its artwork caption.";
            var warning = captionWarning(fresh);
            if (warning) alert(warning);
        });
    };
    batchButton.onClick = function () {
        var p, files;
        try {
            p = selected();
            files = File.openDialog("Choose artworks (Command-click or Shift-click to select several)", undefined, true);
            if (!files || !files.length) return;
        } catch (e) { alert("Picture Packs: " + e.toString()); return; }
        action(function () {
            status.text = "Creating " + files.length + " picture packs...";
            var result = batch(p, files);
            if (result.created.length) {
                clearSelection();
                for (var i = 0; i < result.created.length; i++) result.created[i].folder.selected = true;
                reload(result.created[result.created.length - 1].folder.id);
            }
            status.text = "Created " + result.created.length + " packs (" + (result.created.length * 2) + " compositions)." +
                (result.failed.length ? " Skipped " + result.failed.length + " files." : " Save your project.");
            var notices = [];
            if (result.failed.length) notices.push("These files were skipped:\n" + result.failed.join("\n\n"));
            if (result.warnings.length) notices.push("Created, but captions need attention:\n" + result.warnings.join("\n\n"));
            if (notices.length) alert(notices.join("\n\n"));
            if (openBatch.value) {
                for (var j = 0; j < result.created.length; j++) {
                    result.created[j].zoom.openInViewer();
                    result.created[j].full.openInViewer();
                }
            }
        });
    };
    openZoom.onClick = function () { action(function () { selected().zoom.openInViewer(); }); };
    openFull.onClick = function () { action(function () { selected().full.openInViewer(); }); };
    win.onResizing = win.onResize = function () { this.layout.resize(); };
    reload();
    win.layout.layout(true);
    if (win instanceof Window) { win.center(); win.show(); }
    $.global.ArtoyinaPicturePacksWindow = win;
})(this);
