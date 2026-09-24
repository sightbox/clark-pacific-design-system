// Page builder runtime. Injected above: SPEC = {file,title,bp,refPage,outPage,width,sections:[...]}
const W={200:'ExtraLight',300:'Light',400:'Regular',600:'SemiBold'};
const WN={ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,'Semi Bold':600,Bold:700};
const TSby=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.id,s]));
const PS=Object.fromEntries((await figma.getLocalPaintStylesAsync()).map(s=>[s.name,s]));
const ref=await figma.getNodeByIdAsync(SPEC.refPage);await ref.loadAsync();
const out=await figma.getNodeByIdAsync(SPEC.outPage);await figma.setCurrentPageAsync(out);
if(out.children.find(n=>n.name===SPEC.title))throw new Error('already built: '+SPEC.title);
for(const w of Object.values(W))await figma.loadFontAsync({family:'Poppins',style:w});
await figma.loadFontAsync({family:'Inter',style:'Regular'});
const CTA=/^(learn more|read more|view|download|watch|get started|talk to|explore|see |start |contact us|subscribe|request|take advantage|find|browse|meet)/i;
const role=(t,inst)=>{const c=t.characters;if(!/[A-Za-z0-9]/.test(c))return 'glyph';const segs=t.getStyledTextSegments(['fontName','fontSize']);const m=segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a);
  const fs=m.fontSize,fw=Math.max(...segs.map(s=>WN[s.fontName.style]||400)),up=t.textCase==='UPPER'||(t.textCase===figma.mixed);
  if(fs>=24)return 'head';if(up&&fs<=16){let q=t.parent;while(q&&inst&&q.id!==inst.id){if((q.type==='INSTANCE'&&q.mainComponent&&/^(Text Link|Button)/.test((q.mainComponent.parent&&q.mainComponent.parent.type==='COMPONENT_SET'?q.mainComponent.parent.name:q.mainComponent.name)))||/^(Text Link|Button)/.test(q.name))return 'link';q=q.parent;}return 'label';}if(fw>=500)return 'title';return 'body';};
const shown=n=>{let q=n;while(q&&!['PAGE','DOCUMENT','SECTION'].includes(q.type)){if(q.visible===false||q.opacity===0)return false;q=q.parent;}return true;};
function align(A,B){const n=A.length,m=B.length,GD=-0.4,GI=-1.5;const S=(a,b)=>a.r===b.r?(a.c===b.c?2.2:2):((a.r==='link'&&b.r==='label')||(a.r==='label'&&b.r==='link'))?1:-2.5;
  const D=[...Array(n+1)].map(()=>new Float64Array(m+1));for(let i=1;i<=n;i++)D[i][0]=i*GD;for(let j=1;j<=m;j++)D[0][j]=j*GI;
  for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)D[i][j]=Math.max(D[i-1][j-1]+S(A[i-1],B[j-1]),D[i-1][j]+GD,D[i][j-1]+GI);
  const ops=[];let i=n,j=m;const eq=(x,y)=>Math.abs(x-y)<1e-9;while(i>0||j>0){if(i>0&&j>0&&eq(D[i][j],D[i-1][j-1]+S(A[i-1],B[j-1]))){ops.push(['M',i-1,j-1]);i--;j--;}else if(i>0&&eq(D[i][j],D[i-1][j]+GD)){ops.push(['D',i-1]);i--;}else{ops.push(['I',-1,j-1]);j--;}}
  return ops.reverse();}
async function fill(inst,texts,notes){
  const nodes=inst.findAll(n=>n.type==='TEXT'&&shown(n)&&!(n.fontName!==figma.mixed&&n.fontName.family==='Inter'));
  const A=nodes.map(t=>({t,id:t.id,c:t.characters,r:role(t,inst)}));const B=texts.map(x=>x.r==='glyph'&&/[0-9]/.test(x.c)?{...x,r:'head'}:x).filter(x=>x.r!=='glyph'&&/[A-Za-z0-9]/.test(x.c)).map(x=>x.r==='label'&&CTA.test(x.c)?{...x,r:'link'}:x);const Ag=A.filter(a=>a.r!=='glyph');
  const ops=align(Ag,B);const delIds=new Set();const edits=[];
  const bodies=[];const pend=[];
  for(const [op,i,j] of ops){if(op==='M'){const a=Ag[i],b={...B[j]};const e={id:a.id,c:a.c,b,j};edits.push(e);if(b.r==='body'&&a.r==='body'&&!b.w)bodies.push(e);}
    else if(op==='D')delIds.add(Ag[i].id);else pend.push(j);}
  for(const j of pend){const b=B[j];let best=null;if(b.r==='body')for(const e of bodies)if(!best||Math.abs(e.j-j)<Math.abs(best.j-j))best=e;
    if(best&&Math.abs(best.j-j)<=2){best.b.c=j<best.j?b.c+' '+best.b.c:best.b.c+' '+b.c;notes.merged.push(b.c);}else{notes.unplaced.push(b.c);notes.lost.push(b.r==='head'&&b.c.length<5?'num':b.r);}}
  for(let k=edits.length-1;k>=0;k--)if(edits[k].c===edits[k].b.c&&!edits[k].b.w)edits.splice(k,1);
  // plan hides first (fresh handles), climbing to the highest ancestor whose shown texts are all deleted
  const acts=[];const seen=new Set();
  for(const id of delIds){let t=await figma.getNodeByIdAsync(id);if(!t)continue;let target=t,q=t.parent;
    while(q&&q.id!==inst.id){const ts=q.findAll(n=>n.type==='TEXT'&&shown(n)&&!(n.fontName!==figma.mixed&&n.fontName.family==='Inter')&&/[A-Za-z0-9]{2,}/.test(n.characters));
      if(!ts.length||!ts.every(x=>delIds.has(x.id)))break;if(q.type!=='INSTANCE'&&q.findOne(n=>/^Placeholder/.test(n.name)))break;target=q;q=q.parent;}
    if(seen.has(target.id))continue;seen.add(target.id);
    acts.push({id:target.id,ref:target.componentPropertyReferences&&target.componentPropertyReferences.visible,name:target.name+(target.type==='TEXT'?' "'+target.characters.slice(0,24)+'"':'')});}
  // collapse: drop hides nested inside another hidden target
  for(const a of acts){if(a.ref)continue;const n=await figma.getNodeByIdAsync(a.id);if(n){n.visible=false;notes.hidden.push(a.name);}}
  let changed=0;
  for(const e of edits){const t=await figma.getNodeByIdAsync(e.id);if(!t||!shown(t))continue;const b=e.b;
    for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);
    const fam=t.fontName===figma.mixed?t.getRangeFontName(0,1).family:t.fontName.family;
    const h0=t.height;if(e.c!==b.c){t.characters=b.c;changed++;}
    if(t.height>h0*1.3&&t.layoutSizingHorizontal==='FIXED'&&t.parent&&t.parent.layoutMode==='VERTICAL'&&t.layoutPositioning!=='ABSOLUTE'){t.layoutSizingHorizontal='FILL';}
    if(b.w){const st=TSby[t.textStyleId];const base=st?WN[st.fontName.style]:null;const L=t.characters.length;
      const pm=Math.max(...b.w.map(x=>x[2]||0));const sz=st?st.fontSize:(t.fontSize===figma.mixed?null:t.fontSize);let p=0;
      for(const [len,fw,fs] of b.w){const e2=Math.min(p+len,L);if(p<e2){if(fw!==base&&W[fw])t.setRangeFontName(p,e2,{family:fam,style:W[fw]});if(fs&&pm&&sz&&fs!==pm)t.setRangeFontSize(p,e2,Math.round(sz*fs/pm));}p+=len;}}}
  const props={};for(const a of acts)if(a.ref){props[a.ref]=false;notes.hiddenItems.push(a.name);}
  if(Object.keys(props).length){try{inst.setProperties(props);}catch(e){notes.unplaced.push('could not toggle items: '+e.message.slice(0,60));}}
  return changed;}
// page frame
const x0=out.children.reduce((m,n)=>Math.max(m,n.x+n.width),0)+(out.children.length?400:0);
const frame=figma.createFrame();out.appendChild(frame);frame.name=SPEC.title;frame.layoutMode='VERTICAL';frame.primaryAxisSizingMode='AUTO';frame.counterAxisSizingMode='FIXED';frame.resize(SPEC.width,100);frame.itemSpacing=0;await frame.setFillStyleIdAsync(PS['Neutral/White'].id);frame.x=x0;frame.y=0;frame.clipsContent=true;
const refSec=ref.children.find(s=>s.name.startsWith(SPEC.file)&&!/\(Components\)/.test(s.name));const refBody=refSec.children[0].children[0];
const report=[];
async function copyRef(sec,notes){
    const kids=refBody.children.filter(c=>c.visible&&!c.name.startsWith('Annotation / ')&&c.y>=sec.top-2&&c.y<sec.top+sec.h-2);
    const wrap=figma.createFrame();frame.appendChild(wrap);wrap.name='Page-specific / '+sec.tag.replace(/^One-off: /,'');wrap.resize(SPEC.width,Math.max(1,sec.h));wrap.fills=[];wrap.clipsContent=true;wrap.layoutSizingHorizontal='FILL';
    for(const k of kids.sort((a,b)=>a.y-b.y)){const c=k.clone();wrap.appendChild(c);c.x=k.x;c.y=k.y-sec.top;}
    return kids.length;}
function overflow(inst){for(const t of inst.findAll(n=>n.type==='TEXT'&&shown(n))){const b=t.absoluteBoundingBox;if(!b)continue;let q=t.parent;
    while(q){if(q.clipsContent){const a=q.absoluteBoundingBox;if(a&&(b.y+b.height>a.y+a.height+4||b.x+b.width>a.x+a.width+4))return 'text overflows at "'+t.characters.slice(0,30)+'"';}if(q===inst)break;q=q.parent;}}return null;}
const GLOBAL=new Set(['Footer','Brand Sign-off Band','Header','Announcement Bar']);
for(const sec of SPEC.sections){const notes={tag:sec.tag,kind:sec.kind,unplaced:[],merged:[],hidden:[],hiddenItems:[],variant:null,lost:[]};
  if(sec.kind==='instance'){let heroTop=null;const made=[];
    for(const p of sec.pieces){const comp=await figma.getNodeByIdAsync(p.id);if(!comp){notes.unplaced.push('missing component '+p.id);continue;}
      const inst=comp.createInstance();frame.appendChild(inst);made.push([inst,p.set]);inst.layoutSizingHorizontal='FILL';
      if(p.overlay){inst.layoutPositioning='ABSOLUTE';inst.x=0;}
      if(p.set==='Hero'||!p.overlay)heroTop=heroTop??inst.y;
      notes.variant=(notes.variant?notes.variant+' + ':'')+p.set+(p.variant?' · '+p.variant.replace(/, Breakpoint=\w+/,''):'');
      if(p.texts&&p.texts.length)await fill(inst,p.texts,notes);
      if(p.icons&&p.icons.length){const ICON=new Set(SPEC.iconIds);const its=inst.findAll(n=>n.type==='INSTANCE'&&shown(n)&&n.mainComponent&&ICON.has(n.mainComponent.id));
        if(its.length===p.icons.length){let sw=0;for(let k=0;k<its.length;k++){if(its[k].mainComponent.id!==p.icons[k]){const ic=await figma.getNodeByIdAsync(p.icons[k]);if(ic){its[k].swapComponent(ic);sw++;}}}if(sw)notes.hidden.push(sw+' icon(s) swapped');}
        else notes.unplaced.push('icons: page has '+p.icons.length+', component has '+its.length+' (not swapped)');}}
    {const h=made.find(([i,set])=>set==='Hero');for(const [i] of made)if(i.layoutPositioning==='ABSOLUTE'){if(h)i.y=h[0].y;frame.appendChild(i);}}
    let ov=null;for(const [i,set] of made)if(!GLOBAL.has(set)&&(ov=overflow(i)))break;
    if(!ov&&!made.some(([i,set])=>set==='Hero')&&!made.some(([i,set])=>GLOBAL.has(set)&&!sec.pieces.some(p=>p.set!==set&&!GLOBAL.has(p.set)))){const L=notes.lost,nh=L.filter(r=>r==='head').length,nt=L.filter(r=>r==='title').length;
      if(nh||nt>=2||L.length>=5)ov=L.length+' strings had no slot ('+nh+' heading, '+nt+' title)';}
    if(ov){for(const [i] of made)i.remove();const n=await copyRef(sec,notes);notes.variant='Page-specific (poor fit for '+notes.variant+': '+ov+'; copied from reference, '+n+' layers)';notes.unplaced=[];notes.merged=[];notes.hidden=[];notes.hiddenItems=[];notes.fallback=1;}}
  else{ // page-specific: copy the aligned reference section
    const n=await copyRef(sec,notes);notes.variant='Page-specific (copied from reference, '+n+' layers)';}
  report.push(notes);}
// build notes panel
const np=figma.createAutoLayout('VERTICAL',{name:'Build notes / '+SPEC.title,itemSpacing:16});out.appendChild(np);np.paddingTop=np.paddingBottom=np.paddingLeft=np.paddingRight=32;np.resize(560,100);np.counterAxisSizingMode='FIXED';
await np.setFillStyleIdAsync(PS['Neutral/BG Alt'].id);np.x=frame.x+frame.width+80;np.y=0;
const TSn=Object.fromEntries(Object.values(TSby).map(s=>[s.name,s]));
async function T(txt,style,parent){const t=figma.createText();t.fontName={family:'Poppins',style:'Regular'};t.characters=txt;parent.appendChild(t);await t.setTextStyleIdAsync(TSn[style].id);await t.setFillStyleIdAsync(PS['Text/Dark Charcoal'].id);t.layoutSizingHorizontal='FILL';return t;}
await T('Build notes · '+SPEC.title,'Desktop/Card Title',np);
await T('Sections are library instances with the page copy filled in. Copy is FPO: extra paragraphs were merged into the body, other copy with no slot was trimmed, and unused layers were hidden. Page-specific sections are copies of the aligned reference import.','Desktop/Caption',np);
for(const r of report){const box=figma.createAutoLayout('VERTICAL',{name:r.tag,itemSpacing:6});np.appendChild(box);box.layoutSizingHorizontal='FILL';box.paddingTop=12;box.strokeTopWeight=1;box.strokeBottomWeight=0;box.strokeLeftWeight=0;box.strokeRightWeight=0;await box.setStrokeStyleIdAsync(PS['Neutral/Border'].id);
  await T(r.tag,'Desktop/Label',box);await T(r.variant||'','Desktop/Caption',box);
  if(r.hiddenItems.length)await T('Hidden items: '+r.hiddenItems.join(', '),'Desktop/Caption',box);
  if(r.hidden.length)await T('Hidden layers: '+r.hidden.slice(0,8).join(' · ')+(r.hidden.length>8?' …':''),'Desktop/Caption',box);
  if(r.merged.length)await T('Merged into the body copy: '+r.merged.length+' paragraph(s)','Desktop/Caption',box);
  for(const u of r.unplaced)await T('Trimmed (FPO copy): '+u.slice(0,90)+(u.length>90?'…':''),'Desktop/Caption',box);}
return {frame:frame.id,height:Math.round(frame.height),notes:np.id,report:report.map(r=>`${r.tag} | ${r.variant} | unplaced ${r.unplaced.length} | hidden ${r.hidden.length} | items off ${r.hiddenItems.length}`)};
