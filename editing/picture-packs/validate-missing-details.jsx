#target aftereffects
(function(){
var report=[],created=[],folder,files=[],before;
function assert(ok,msg){if(!ok)throw new Error(msg);report.push('PASS '+msg);}
function caption(p){return p.zoom.layer('Text').text.sourceText.value;}
function write(f,s){f.encoding='UTF-8';f.open('w');f.write(s);f.close();}
app.beginUndoGroup('Test missing artwork details');
try{
    $.global.ARTOYINA_PACKS_NO_UI=true;
    $.evalFile(new File(File($.fileName).parent.fsName+'/Picture Packs.jsx'));
    var api=$.global.ArtoyinaPicturePacks,master=api.templatePack();before=app.project.numItems;
    var base=File($.fileName).parent.parent.parent;
    var valid=new File(base.fsName+'/Ae_Ai_Temp/Assets/cassatt_childs_bath_1893.jpg');
    folder=new Folder(Folder.temp.fsName+'/artoyina-missing-details-'+new Date().getTime());folder.create();
    var pic=new File(folder.fsName+'/unknown.jpg'),catalog=new File(folder.fsName+'/picture_filenames.txt');
    files=[pic,catalog];assert(valid.copy(pic.fsName),'Temporary picture prepared');
    var p=api.duplicate(master,'__MISSING_DETAILS_TEST',pic);created.push(p);
    assert(caption(p).text==='???\r???, ???','Single creation without a details file succeeds with question marks');
    assert(p.captionNotice.indexOf('artist name')>=0&&p.captionNotice.indexOf('artwork title')>=0&&p.captionNotice.indexOf('creation date')>=0,'Single creation supplies the missing-fields pop-up message');
    var oldStyle=caption(master),newStyle=caption(p),split=oldStyle.text.indexOf('\r');
    assert(newStyle.characterRange(0,3).fontSize===oldStyle.characterRange(0,1).fontSize&&newStyle.characterRange(4,-1).fontSize===oldStyle.characterRange(split+1,split+2).fontSize,'Placeholder caption preserves separate title and credit sizes');
    api.replace(p,valid);assert(caption(p).text==='The Child’s Bath\rMary Cassatt, 1893'&&!p.captionNotice,'Known details replace question marks and clear the warning');
    api.replace(p,pic);assert(caption(p).text==='???\r???, ???'&&!!p.captionNotice,'Replacement without details clears the previous caption and reports missing data');
    var batch=api.batch(master,[pic,valid]);for(var i=0;i<batch.created.length;i++)created.push(batch.created[i]);
    assert(batch.created.length===2&&batch.failed.length===0&&batch.warnings.length>=1&&batch.warnings.join(' ').indexOf('unknown.jpg')>=0,'Mixed batch succeeds and includes a warning for the unknown artwork');
    write(catalog,'File: unknown.jpg\nArtist: Known artist\n');
    api.replace(p,pic);assert(caption(p).text==='???\rKnown artist, ???'&&!!p.captionNotice,'Incomplete entry preserves known artist and marks missing title and date');
    write(catalog,'File: other.jpg\nArtist: Other\nArtwork: Other title\nDate of creation: 1900\n');
    api.replace(p,pic);assert(caption(p).text==='???\r???, ???'&&p.captionNotice.indexOf('No matching')>=0,'Unlisted artwork still updates with question marks');
    write(catalog,'File: unknown.jpg\nFile: unknown.jpg\n');
    api.replace(p,pic);assert(caption(p).text==='???\r???, ???'&&p.captionNotice.indexOf('duplicate')>=0,'Ambiguous catalog uses question marks and reports the problem');
    var missing=new File(folder.fsName+'/missing.jpg'),oldFile=p.picture.file.fsName,rejected=false;
    try{api.replace(p,missing);}catch(e){rejected=true;}
    assert(rejected&&p.picture.file.fsName===oldFile,'An actually missing picture still fails without changing the pack');
    report.push('ALL CHECKS PASSED');
}catch(e){report.push('ERROR '+e.toString());}
finally{
    for(var i=created.length-1;i>=0;i--)try{created[i].folder.remove();}catch(e){report.push('CLEANUP ERROR '+e.toString());}
    for(var i=0;i<files.length;i++)if(files[i].exists)files[i].remove();if(folder)folder.remove();
    report.push('Item count before='+before+' after='+app.project.numItems);
    $.global.ARTOYINA_PACKS_NO_UI=false;app.endUndoGroup();write(new File('/tmp/artoyina-missing-details-validation.txt'),report.join('\n'));
}
})();
