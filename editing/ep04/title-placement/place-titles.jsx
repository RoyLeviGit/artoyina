#target aftereffects
(function(){
    var plan=[{"placeholderId": 4297, "startFrame": 7413, "endFrame": 7533, "title": "THE SCIENCE", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/01-the-science.mp4"}, {"placeholderId": 4270, "startFrame": 13682, "endFrame": 13802, "title": "THE TECHNOLOGY", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/02-the-technology.mp4"}, {"placeholderId": 4245, "startFrame": 19810, "endFrame": 19930, "title": "THE SCANDAL", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/03-the-scandal.mp4"}, {"placeholderId": 4227, "startFrame": 25572, "endFrame": 25692, "title": "IMPRESSIONISM", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/04-impressionism.mp4"}, {"placeholderId": 4199, "startFrame": 30753, "endFrame": 30873, "title": "THE EXHIBITION", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/05-the-exhibition.mp4"}, {"placeholderId": 4137, "startFrame": 41246, "endFrame": 41366, "title": "MONET AND CAMILLE", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/06-monet-and-camille.mp4"}, {"placeholderId": 4117, "startFrame": 45271, "endFrame": 45391, "title": "THE LONG ROAD TO SUCCESS", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/07-the-long-road-to-success.mp4"}, {"placeholderId": 4072, "startFrame": 54279, "endFrame": 54399, "title": "MONET\u2019S LATER YEARS", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/08-monets-later-years.mp4"}, {"placeholderId": 4051, "startFrame": 58152, "endFrame": 58272, "title": "ART AFTER IMPRESSIONISM", "file": "/Users/arinagusak/Desktop/Arisha/projects/artoyina/modern-art-series/graphics/renders/ep04-main-titles/09-art-after-impressionism.mp4"}];
    var tag='ARTOYINA_EP04_APPROVED_TITLES_V1';
    var expectedProject='/Users/arinagusak/Desktop/Arisha/projects/artoyina/editing/ep04/AE_AI_ep04.aep';
    var report=[],added=[],imported=[],createdFolder=null,originals=[],target=null;
    var log=new File(File($.fileName).parent.fsName+'/placement-result.txt');
    function assert(ok,msg){if(!ok)throw new Error(msg);}
    function same(a,b){return Math.abs(a-b)<0.000001;}
    function byLayerId(comp,id){for(var i=1;i<=comp.numLayers;i++)if(comp.layer(i).id===id)return comp.layer(i);return null;}
    app.beginUndoGroup('Place episode 04 approved titles');
    try {
        var p=app.project;
        assert(p.file&&p.file.fsName===expectedProject,'Unexpected open project.');
        for(var i=1;i<=p.numItems;i++){
            var item=p.item(i);
            if(item instanceof CompItem&&item.name==='ep04_02 Linked Comp 04'){
                assert(!target,'Ambiguous target composition.');target=item;
            }
        }
        assert(target&&target.id===4001,'Target composition missing or changed.');
        assert(target.width===3840&&target.height===2160&&same(target.frameRate,30)&&same(target.displayStartTime,0),'Unexpected composition settings.');
        for(var i=1;i<=target.numLayers;i++){
            var l=target.layer(i);
            assert(l.comment.indexOf(tag)<0,'Approved titles are already placed; refusing duplicates.');
            originals.push({layer:l,id:l.id,start:l.startTime,inTime:l.inPoint,outTime:l.outPoint,enabled:l.enabled,audio:l.audioEnabled,locked:l.locked});
        }
        for(var r=0;r<plan.length;r++){
            var row=plan[r],slot=byLayerId(target,row.placeholderId);
            assert(slot&&slot.name==='Adjustment Layer','Missing title placeholder.');
            assert(same(slot.inPoint,row.startFrame/30)&&same(slot.outPoint,row.endFrame/30),'Placeholder timing changed.');
            assert(new File(row.file).exists,'Missing rendered title: '+row.file);
        }
        var originalFile=p.file,backupDir=new Folder(originalFile.parent.fsName+'/backups');
        assert(backupDir.exists||backupDir.create(),'Could not create backup folder.');
        var backup=new File(backupDir.fsName+'/AE_AI_ep04_before-title-placement_'+new Date().getTime()+'.aep');
        p.save(backup);p.save(originalFile);
        assert(backup.exists,'Backup was not saved.');
        report.push('BACKUP '+backup.fsName);
        createdFolder=p.items.addFolder('EP04 - Approved Title Cards');
        var sources=[];
        for(var r=0;r<plan.length;r++){
            var item=p.importFile(new ImportOptions(new File(plan[r].file)));imported.push(item);
            item.parentFolder=createdFolder;
            assert(item.width===1920&&item.height===1080&&item.duration>=4,'Unexpected title media dimensions or duration.');
            sources.push(item);
        }
        for(var r=plan.length-1;r>=0;r--){
            var row=plan[r],l=target.layers.add(sources[r]);added.push(l);
            l.name=('0'+(r+1)).slice(-2)+' | '+row.title+' [TITLE]';
            l.comment=tag+'; matched placeholder '+row.placeholderId;
            l.startTime=row.startFrame/30;
            l.inPoint=row.startFrame/30;l.outPoint=row.endFrame/30;
            l.transform.anchorPoint.setValue([960,540]);
            l.transform.position.setValue([1920,1080]);
            l.transform.scale.setValue([200,200]);
            l.audioEnabled=false;l.enabled=true;l.label=9;
            assert(same(l.startTime,row.startFrame/30)&&same(l.inPoint,row.startFrame/30)&&same(l.outPoint,row.endFrame/30),'Title timing mismatch.');
            assert(l.source===sources[r]&&l.transform.scale.value[0]===200&&l.transform.position.value[0]===1920,'Title layout mismatch.');
            report.push('PLACED '+row.startFrame+'-'+row.endFrame+' frames at 30 fps | '+row.title);
        }
        assert(target.numLayers===originals.length+9,'Unexpected layer count.');
        for(var i=0;i<originals.length;i++){
            var old=originals[i],l=old.layer;
            assert(l.id===old.id&&target.layer(i+10).id===old.id&&same(l.startTime,old.start)&&same(l.inPoint,old.inTime)&&same(l.outPoint,old.outTime)&&l.enabled===old.enabled&&l.audioEnabled===old.audio&&l.locked===old.locked,'Existing layer changed.');
        }
        target.time=plan[0].startFrame/30+2;target.openInViewer();
        p.save(originalFile);
        report.push('SUCCESS: 9 titles placed; '+originals.length+' existing layers preserved; saved '+originalFile.fsName);
    } catch(e) {
        report.push('ERROR '+e.toString());
        for(var i=added.length-1;i>=0;i--)try{added[i].remove();}catch(ignored){}
        for(var i=imported.length-1;i>=0;i--)try{imported[i].remove();}catch(ignored){}
        if(createdFolder)try{createdFolder.remove();}catch(ignored){}
    } finally {
        app.endUndoGroup();
        log.encoding='UTF-8';log.open('w');log.write(report.join('\n'));log.close();
    }
})();
