const project = await app.Project.getActiveProject();
const seqs = await project.getSequences();
let ep01 = null;
for (const s of seqs) {
    const name = await s.getName();
    if (name === 'ep01-RoughCut') { ep01 = s; break; }
}
if (!ep01) throw new Error('ep01-RoughCut not found');
await ep01.open();
return { opened: await ep01.getName() };
