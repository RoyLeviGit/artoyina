#target aftereffects
(function(){
    var report=[],added=[],originals=[],target=null;
    var tag='ARTOYINA_EP04_SRT_PLACEMENT_V1';
    var plan=[{"title": "The Luncheon on the Grass", "comp": "manet_luncheon_on_the_grass_1863_zoom", "startFrame": 22801, "endFrame": 23728, "inTC": "00:12:40:01", "outTC": "00:13:10:28", "cueStart": 452, "cueEnd": 469, "note": "Artwork introduction through the end of its discussion."}, {"title": "Olympia", "comp": "manet_olympia_1863_zoom", "startFrame": 23900, "endFrame": 24567, "inTC": "00:13:16:20", "outTC": "00:13:38:27", "cueStart": 472, "cueEnd": 485, "note": "Named painting through the critics\u2019 reaction."}, {"title": "Impression, Sunrise", "comp": "Monet_-_Impression,_Sunrise_zoom", "startFrame": 29439, "endFrame": 30749, "inTC": "00:16:21:09", "outTC": "00:17:04:29", "cueStart": 583, "cueEnd": 611, "note": "Creation, visual description, title, and introduction to the naming story."}, {"title": "Impression, Sunrise \u2014 critic review", "comp": "Monet_-_Impression,_Sunrise_zoom", "startFrame": 32887, "endFrame": 34033, "inTC": "00:18:16:07", "outTC": "00:18:54:13", "cueStart": 653, "cueEnd": 676, "note": "Second explicit mention: review and naming of Impressionism."}, {"title": "The Dance Class", "comp": "degas_dance_class_1874_zoom", "startFrame": 35208, "endFrame": 35912, "inTC": "00:19:33:18", "outTC": "00:19:57:02", "cueStart": 700, "cueEnd": 715, "note": "Look at the dance class through its composition analysis."}, {"title": "Blue Dancers", "comp": "Edgar_Germain_Hilaire_Degas_076_zoom", "startFrame": 35912, "endFrame": 36257, "inTC": "00:19:57:02", "outTC": "00:20:08:17", "cueStart": 716, "cueEnd": 722, "note": "User-approved contextual match: Degas\u2019s later pastel paintings."}, {"title": "Dance at the Moulin de la Galette", "comp": "renoir_moulin_de_la_galette_1876_zoom", "startFrame": 36442, "endFrame": 37206, "inTC": "00:20:14:22", "outTC": "00:20:40:06", "cueStart": 727, "cueEnd": 742, "note": "Named painting through discussion of social atmosphere; transition shares a subtitle cue."}, {"title": "The Child\u2019s Bath", "comp": "cassatt_childs_bath_1893_zoom", "startFrame": 37672, "endFrame": 38438, "inTC": "00:20:55:22", "outTC": "00:21:21:08", "cueStart": 754, "cueEnd": 770, "note": "Painting description through the transition to the next example."}, {"title": "Little Girl in a Blue Armchair", "comp": "cassatt_little_girl_blue_armchair_1878_zoom", "startFrame": 38438, "endFrame": 38968, "inTC": "00:21:21:08", "outTC": "00:21:38:28", "cueStart": 771, "cueEnd": 781, "note": "Another example through the child\u2019s pose; following transition shares a subtitle cue."}, {"title": "Rouen Cathedral", "comp": "RouenCathedral_Monet_1894_zoom", "startFrame": 54410, "endFrame": 55600, "inTC": "00:30:13:20", "outTC": "00:30:53:10", "cueStart": 1073, "cueEnd": 1098, "note": "Available Full Sunlight version illustrates the cathedral-series passage; other lighting variants are not in art_comps."}, {"title": "Bridge over a Pond of Water Lilies", "comp": "The_Water-Lily_Pond_1899_Claude_Monet_Metropolitan_zoom", "startFrame": 55600, "endFrame": 56257, "inTC": "00:30:53:10", "outTC": "00:31:15:07", "cueStart": 1099, "cueEnd": 1110, "note": "Garden, pond, and Japanese bridge; ends before the late abstract canvases."}];
    function assert(ok,message){if(!ok)throw new Error(message);}
    function same(a,b){return Math.abs(a-b)<0.000001;}
    app.beginUndoGroup('Place artworks from episode 04 subtitles');
    try{
        var project=app.project;
        assert(project.file&&project.file.name==='AE_AI_ep04.aep','Open AE_AI_ep04.aep first.');
        for(var i=1;i<=project.numItems;i++){
            var item=project.item(i);
            if(item instanceof CompItem&&item.name==='ep04 Linked Comp 03'){
                assert(!target,'Ambiguous target composition');target=item;
            }
        }
        assert(target&&target.frameRate===30&&target.width===3840&&target.height===2160&&target.displayStartTime===0,'Unexpected target composition settings');
        for(var i=1;i<=target.numLayers;i++){
            var layer=target.layer(i);
            assert(layer.comment.indexOf(tag)!==0,'This placement has already been applied; refusing duplicate layers.');
            originals.push({layer:layer,id:layer.id,start:layer.startTime,inTime:layer.inPoint,outTime:layer.outPoint,enabled:layer.enabled});
        }
        var sources=[];
        for(var r=0;r<plan.length;r++){
            var source=null;
            for(var i=1;i<=project.numItems;i++){
                var item=project.item(i);
                if(!(item instanceof CompItem)||item.name!==plan[r].comp)continue;
                var folder=item.parentFolder,within=false;
                while(folder&&folder!==project.rootFolder){if(folder.name==='art_comps')within=true;folder=folder.parentFolder;}
                if(within){assert(!source,'Duplicate artwork composition name');source=item;}
            }
            assert(source,'Missing artwork comp: '+plan[r].comp);
            assert(source.width===1920&&source.height===2160,'Unexpected artwork dimensions');
            assert(plan[r].endFrame/30<=target.duration&&(plan[r].endFrame-plan[r].startFrame)/30<=source.duration,'Invalid artwork duration');
            for(var j=1;j<=source.numLayers;j++){
                var media=source.layer(j).source;
                if(media instanceof FootageItem&&media.file)assert(media.file.exists,'Missing image in '+source.name);
            }
            sources.push(source);
        }
        var originalFile=project.file,backups=new Folder(originalFile.parent.fsName+'/backups');backups.create();
        var backup=new File(backups.fsName+'/AE_AI_ep04_before-srt-artworks_'+new Date().getTime()+'.aep');
        project.save(backup);project.save(originalFile);
        report.push('BACKUP '+backup.fsName);
        // Reverse insertion leaves the earliest artwork at the top of the layer stack.
        for(var r=plan.length-1;r>=0;r--){
            var row=plan[r],layer=target.layers.add(sources[r]);added.push(layer);
            layer.name=row.title+' [SRT]';
            layer.comment=tag+'; cues '+row.cueStart+'-'+row.cueEnd+'; '+row.note;
            layer.startTime=row.startFrame/30;
            layer.inPoint=row.startFrame/30;layer.outPoint=row.endFrame/30;
            layer.transform.position.setValue([2880,1080]);
            layer.transform.scale.setValue([100,100]);
            layer.audioEnabled=false;layer.label=9;
            var marker=new MarkerValue(row.title+' | SRT '+row.cueStart+'-'+row.cueEnd);
            layer.property('ADBE Marker').setValueAtTime(layer.inPoint,marker);
            assert(same(layer.inPoint,row.startFrame/30)&&same(layer.outPoint,row.endFrame/30)&&same(layer.startTime,layer.inPoint),'Placement timing mismatch');
            assert(layer.source===sources[r]&&layer.transform.position.value[0]===2880&&layer.transform.position.value[1]===1080,'Placement source or position mismatch');
            report.push('PLACED '+row.inTC+' -> '+row.outTC+' '+row.title);
        }
        for(var i=0;i<originals.length;i++){
            var old=originals[i],layer=old.layer;
            assert(layer.id===old.id&&same(layer.startTime,old.start)&&same(layer.inPoint,old.inTime)&&same(layer.outPoint,old.outTime)&&layer.enabled===old.enabled,'Existing footage changed');
        }
        assert(target.numLayers===originals.length+plan.length,'Unexpected layer count');
        target.time=plan[0].startFrame/30;
        target.openInViewer();
        project.save(originalFile);
        report.push('SUCCESS '+added.length+' artwork layers; '+originals.length+' existing layers retained; project saved.');
    }catch(e){
        report.push('ERROR '+e.toString());
        for(var i=added.length-1;i>=0;i--)try{added[i].remove();}catch(ignored){}
    }finally{
        app.endUndoGroup();
        var log=new File(File($.fileName).parent.fsName+'/placement-result.txt');log.encoding='UTF-8';log.open('w');log.write(report.join('\n'));log.close();
    }
})();
