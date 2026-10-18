#target aftereffects
(function () {
    var report = [], created = [], fixtureFiles = [], fixtureFolders = [], before;
    function assert(ok, message) { if (!ok) throw new Error(message); report.push('PASS ' + message); }
    function write(file, text) { file.encoding = 'UTF-8'; if (!file.open('w')) throw new Error('Cannot write test fixture'); file.write(text); file.close(); }
    app.beginUndoGroup('Validate automatic artwork captions');
    try {
        $.global.ARTOYINA_PACKS_NO_UI = true;
        $.evalFile(new File(File($.fileName).parent.fsName + '/Picture Packs.jsx'));
        var api = $.global.ArtoyinaPicturePacks, master = api.templatePack();
        before = app.project.numItems;
        var dir = new Folder(File($.fileName).parent.parent.parent.fsName + '/modern-art-series/ep04-impressionism/artworks/Ai_test');
        var images = dir.getFiles(function (f) { return f instanceof File && /\.jpg$/i.test(f.name); });
        var result = api.batch(master, images);
        created = result.created;
        assert(result.failed.length === 0 && created.length === 10, 'All ten real artworks create captioned packs');
        assert(result.warnings.join(' ').indexOf('RouenCathedral') >= 0, 'Long captions report overflow without changing the design');
        var style = master.zoom.layer('Text').text.sourceText.value, split = style.text.indexOf('\r');
        for (var i=0; i<created.length; i++) {
            var p = created[i], caption = api.captionFor(p.picture.file, {}), doc = p.zoom.layer('Text').text.sourceText.value;
            assert(doc.text === caption.title + '\r' + caption.credit, 'Correct metadata: ' + p.folder.name);
            var cut = doc.text.indexOf('\r');
            assert(doc.characterRange(0,cut).fontSize === style.characterRange(0,split).fontSize && doc.characterRange(cut+1,-1).fontSize === style.characterRange(split+1,-1).fontSize, 'All title/credit characters keep their separate sizes');
            assert(String(doc.boxTextSize) === String(style.boxTextSize), 'Text box is unchanged');
            if (p.picture.file.name === 'RouenCathedral_Monet_1894.jpg') {
                assert(caption.credit === 'Claude Monet, 1893', 'Catalog date overrides filename date');
                report.push('LONG TITLE overflow=' + doc.boxOverflow);
            }
        }
        var stamp = new Date().getTime(), cache = {}, pictures = [], catalogs = [];
        for (var j=0; j<2; j++) {
            var folder = new Folder(Folder.temp.fsName + '/artoyina-caption-test-' + stamp + '-' + j); folder.create(); fixtureFolders.push(folder);
            var pic = new File(folder.fsName + '/same.jpg'); images[0].copy(pic.fsName); fixtureFiles.push(pic); pictures.push(pic);
            var catalog = new File(folder.fsName + '/picture_filenames.txt'); fixtureFiles.push(catalog); catalogs.push(catalog);
            write(catalog, '\uFEFFARTWORK DETAILS\r\n1. File: same.jpg\r\nArtist: Édouard Manet\r\nArtwork: Full title '+j+'\r\nDate of creation: 1873–1876\r\nDisplay title: Short '+j+'\r\nNote: Ignored\r\n');
        }
        assert(api.captionFor(pictures[0],cache).title === 'Short 0' && api.captionFor(pictures[1],cache).title === 'Short 1', 'Same filenames in different folders use their own catalogs; optional display title works');
        write(catalogs[0], 'File: same.jpg\nArtist: Mary Cassatt\nArtwork: Edited title\nDate of creation: circa 1898\n');
        assert(api.captionFor(pictures[0],cache).title === 'Short 0', 'One batch reuses its cached catalog');
        assert(api.captionFor(pictures[0],{}).title === 'Edited title', 'Next operation rereads edited metadata');
        var multi = api.batch(master, pictures); for(var k=0;k<multi.created.length;k++)created.push(multi.created[k]);
        assert(multi.created.length === 2 && multi.failed.length === 0, 'One batch accepts images from multiple folders');
        var rejected = false;
        write(catalogs[0], 'File: same.jpg\nArtist: Mary Cassatt\nArtwork: Incomplete\n');
        var incomplete = api.captionFor(pictures[0],{});
        assert(incomplete.title === 'Incomplete' && incomplete.credit === 'Mary Cassatt, ???' && !!incomplete.warning, 'Incomplete details retain known fields and warn about missing fields');
        write(catalogs[0], 'File: same.jpg\nFile: same.jpg\n'); rejected=false;
        var ambiguous = api.captionFor(pictures[0],{});
        assert(ambiguous.title === '???' && ambiguous.credit === '???, ???' && !!ambiguous.warning, 'Ambiguous catalogs use question marks with a warning');
        write(catalogs[0], 'File: another.jpg\nArtist: A\nArtwork: B\nDate of creation: C\n');
        var partial = api.batch(master,pictures);for(var k=0;k<partial.created.length;k++)created.push(partial.created[k]);
        assert(partial.created.length===2 && partial.failed.length===0 && partial.warnings.length===1, 'Unlisted artworks are created with a missing-information warning');
        report.push('ALL CHECKS PASSED');
    } catch(e) { report.push('ERROR ' + e.toString()); }
    finally {
        for(var i=created.length-1;i>=0;i--)try{created[i].folder.remove();}catch(e){report.push('CLEANUP ERROR '+e.toString());}
        for(var i=0;i<fixtureFiles.length;i++)fixtureFiles[i].remove();
        for(var i=0;i<fixtureFolders.length;i++)fixtureFolders[i].remove();
        report.push('Item count before='+before+' after='+app.project.numItems);
        $.global.ARTOYINA_PACKS_NO_UI=false;app.endUndoGroup();
        var log=new File('/tmp/artoyina-caption-validation.txt');write(log,report.join('\n'));
    }
})();
