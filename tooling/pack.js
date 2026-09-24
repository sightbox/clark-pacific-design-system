// Usage: node pack.js <extract.json> <bp> <name> <page> <x> <y> [parentId] > code.js
const fs=require('fs');const path=require('path');const {plan}=require('./planner');
const [src,bp,name,page,x,y,parentId]=process.argv.slice(2);
const tree=JSON.parse(fs.readFileSync(src));
// strip kit build aids: everything from the first section-label wrapper onward, and trailing empty spacers
const isAid=n=>n.type==='frame'&&n.kids&&n.kids[0]&&n.kids[0].type==='frame'&&n.kids[0].kids&&n.kids[0].kids.length===2&&n.kids[0].kids[0].r.w===6&&n.kids[0].kids[0].r.h===6;
const i=tree.kids.findIndex(isAid); if(i>=0) tree.kids=tree.kids.slice(0,i);
while(tree.kids.length&&tree.kids[tree.kids.length-1].type==='frame'&&!tree.kids[tree.kids.length-1].kids.length&&!tree.kids[tree.kids.length-1].bg) tree.kids.pop();
tree.r.h=Math.max(...tree.kids.map(k=>k.r.y+k.r.h));
const {plan:p,warnings}=plan(tree,{bp,name});
// Collect referenced image SVGs
const imgs={};const walk=n=>{if(n.t==='I'&&n.src){const f=path.join(process.env.UP||'',n.src);if(fs.existsSync(f)&&fs.statSync(f).size<60000)imgs[n.src]=fs.readFileSync(f,'utf8');}(n.k||[]).forEach(walk);};walk(p);
const builder=fs.readFileSync(path.join(__dirname,'builder.js'),'utf8');
const main=`
scan(PLAN);
const pg=figma.root.children.find(p=>p.name===${JSON.stringify(page)});await figma.setCurrentPageAsync(pg);
for(const f of fonts){const [family,style]=f.split('|');await figma.loadFontAsync({family,style});}
for(const s of Object.values(TS))await figma.loadFontAsync(s.fontName);
const parent=${parentId?`await figma.getNodeByIdAsync(${JSON.stringify(parentId)})`:'pg'};
const node=await build(PLAN,parent);
if(parent===pg){node.x=${x};node.y=${y};}
return {id:node.id,w:node.width,h:node.height,unbound:[...new Set(unbound)]};`;
const code=`const IMG=${JSON.stringify(imgs)};\nconst PLAN=${JSON.stringify(p)};\n`+builder+main;
process.stdout.write(code);
process.stderr.write(`chars=${code.length} planChars=${JSON.stringify(p).length} srcH=${tree.r.h}\nwarnings=${JSON.stringify(warnings,null,1)}\n`);
