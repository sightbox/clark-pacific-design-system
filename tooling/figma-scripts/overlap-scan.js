// Text overlap + spill scan (read-only). Runs inside a Figma `use_figma` call; paste as the whole script.
// Checks every visible text layer on 03 · Pages Desktop and 04 · Pages Mobile (instances included):
//   overlaps: two text boxes (clipped to their clipping ancestors) overlapping by more than 3px
//   spills:   text extending more than 4px past a fixed-height, non-clipping parent
// Run this after any bulk copy change — the page builder's own overflow gate only sees clipping frames.

const shown=n=>{let q=n;while(q&&q.type!=='PAGE'){if(q.visible===false||q.opacity===0)return false;q=q.parent;}return true;};
const out={};
for(const [pid,pre] of [['81:2','Desktop / '],['81:3','Mobile / ']]){const p=await figma.getNodeByIdAsync(pid);await p.loadAsync();const ov=[],sp=[];
 for(const f of p.children.filter(n=>n.type==='FRAME'&&n.name.startsWith(pre))){const ts=[];
  for(const sec of f.children)for(const t of sec.findAll(n=>n.type==='TEXT')){if(!shown(t)||!t.characters.trim())continue;const b=t.absoluteBoundingBox;if(!b||b.width<1)continue;
   let x0=b.x,y0=b.y,x1=b.x+b.width,y1=b.y+b.height;let q=t.parent;while(q&&q!==f.parent){if(q.clipsContent&&q.absoluteBoundingBox){const a=q.absoluteBoundingBox;x0=Math.max(x0,a.x);y0=Math.max(y0,a.y);x1=Math.min(x1,a.x+a.width);y1=Math.min(y1,a.y+a.height);}q=q.parent;}
   if(x1-x0<2||y1-y0<2)continue;ts.push({t,sec:sec.name,x0,y0,x1,y1});
   const par=t.parent,pb=par.absoluteBoundingBox;if(pb&&!par.clipsContent&&par.type!=='GROUP'&&(b.y+b.height>pb.y+pb.height+4)&&(!par.layoutMode||par.layoutMode==='NONE'||par.layoutSizingVertical==='FIXED'))sp.push(f.name+' | '+sec.name+' "'+t.characters.slice(0,24)+'"');}
  ts.sort((a,b)=>a.y0-b.y0);for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length&&ts[j].y0<ts[i].y1;j++){const a=ts[i],b=ts[j];
   if(Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)>3&&Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)>3)ov.push(f.name+' | '+a.sec+' "'+a.t.characters.slice(0,22)+'" × "'+b.t.characters.slice(0,22)+'"');}}
 out[pre]={overlaps:ov,spills:sp};}
return out;
