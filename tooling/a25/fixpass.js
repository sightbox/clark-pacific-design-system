// Fix pass for the 45 2.5 components. Set PAGE (and SECTION when they sit in a section).
const PAGE='02 · Components',SECTION='2.5 Additions';
const pg=figma.root.children.find(p=>p.name===PAGE);await figma.setCurrentPageAsync(pg);
const host=SECTION?pg.children.find(n=>n.type==='SECTION'&&n.name===SECTION):pg;
const comps=host.children.filter(n=>n.type==='COMPONENT'&&n.name.startsWith('2.5 /'));
const PS={};for(const s of await figma.getLocalPaintStylesAsync())PS[s.name]=s;
const out={dividers:0,effects:0,bound:{exact:0,nearest:0,flagged:0},newStyles:[]};
// A) stat dividers
for(const c of comps){for(const r of c.findAll(n=>n.type==='RECTANGLE'&&n.name==='Scrim'&&n.fills.length&&n.fills[0].type==='GRADIENT_LINEAR')){
  const st=r.fills[0].gradientStops;if(!(st.length===2&&Math.abs(st[0].position-0.65)<0.01))continue;
  const p=r.parent;const h=p.height;const top=st[0].color;
  const trackStyle=(top.r<0.01&&top.a<0.2)?'Flagged/2.5 · #000000 10%':'Neutral/Border';
  const mk=async(name,y,hh,style)=>{const x=figma.createRectangle();x.name=name;p.appendChild(x);x.layoutPositioning='ABSOLUTE';x.x=0;x.y=y;x.resize(1,hh);await x.setFillStyleIdAsync(PS[style].id);x.constraints={horizontal:'MIN',vertical:'SCALE'};};
  await mk('Accent divider · track',0,Math.round(h*0.65),trackStyle);await mk('Accent divider · accent',Math.round(h*0.65),h-Math.round(h*0.65),'Accent/Orange');
  r.remove();out.dividers++;}}
// B) raw effects -> flagged effect style
for(const c of comps)for(const n of c.findAll(n=>'effects' in n&&n.effects.length&&!n.effectStyleId&&n.type!=='INSTANCE')){
  let es=(await figma.getLocalEffectStylesAsync()).find(s=>s.name==='Flagged/2.5 · Ring #DEDFE0 1.5');
  if(!es){es=figma.createEffectStyle();es.name='Flagged/2.5 · Ring #DEDFE0 1.5';es.effects=n.effects;es.description='Off-token value carried from the September library (legend dot ring). Not in the 2.0 system.';}
  await n.setEffectStyleIdAsync(es.id);out.effects++;}
// C) text
const TS=await figma.getLocalTextStylesAsync();
const W={Thin:100,ExtraLight:200,Light:300,Regular:400,Medium:500,'Semi Bold':600,SemiBold:600,Bold:700};
const SN={200:'ExtraLight',300:'Light',400:'Regular',600:'SemiBold'};
const lhv=l=>l.unit==='PIXELS'?l.value:l.unit==='AUTO'?'auto':l.value+'%';
const sig=s=>({fam:s.fontName.family,w:W[s.fontName.style]||400,size:s.fontSize,cs:s.textCase==='UPPER'?'UPPER':'ORIGINAL',lh:s.lineHeight,ls:s.letterSpacing});
const cand=TS.filter(s=>s.name.startsWith('Desktop/')||s.name.startsWith('Utility/')||s.name.startsWith('Flagged/')).map(s=>({s,...sig(s)}));
const fonts=new Set();for(const s of TS)fonts.add(JSON.stringify(s.fontName));
for(const f of fonts)await figma.loadFontAsync(JSON.parse(f));
async function pick(seg){
  const w=W[seg.fontName.style]||400,cs=seg.textCase==='UPPER'?'UPPER':'ORIGINAL',fam=seg.fontName.family;
  if(fam==='Inter'){return {s:cand.find(c=>c.s.name==='Utility/Placeholder Caption').s,k:'nearest'};}
  let ex=cand.filter(c=>c.fam===fam&&c.size===seg.fontSize&&c.w===w&&c.cs===cs);
  if(ex.length){ex.sort((a,b)=>(a.s.name.startsWith('Flagged')?1:0)-(b.s.name.startsWith('Flagged')?1:0));return {s:ex[0].s,k:'exact'};}
  let nr=cand.filter(c=>!c.s.name.startsWith('Flagged')&&c.fam===fam&&Math.abs(c.size-seg.fontSize)<=2&&Math.abs(c.w-w)<=100&&c.cs===cs);
  if(nr.length){nr.sort((a,b)=>(Math.abs(a.size-seg.fontSize)+Math.abs(a.w-w)/100)-(Math.abs(b.size-seg.fontSize)+Math.abs(b.w-w)/100));return {s:nr[0].s,k:'nearest'};}
  const lh=seg.lineHeight;const name=`Flagged/2.5 · Desktop · ${SN[w]||w} ${seg.fontSize}/${lh.unit==='PIXELS'?Math.round(lh.value):'auto'}${cs==='UPPER'?' Caps':''}`;
  let f=cand.find(c=>c.s.name===name);
  if(!f){const s=figma.createTextStyle();s.name=name;s.fontName=seg.fontName;s.fontSize=seg.fontSize;s.lineHeight=lh;s.letterSpacing=seg.letterSpacing;if(cs==='UPPER')s.textCase='UPPER';
    s.description='Off-scale type carried from the September library for a 2.5 component. Not in the 2.0 type scale: map to the nearest 2.0 style or approve it.';
    f={s,...sig(s)};cand.push(f);out.newStyles.push(name);}
  return {s:f.s,k:'flagged'};}
for(const c of comps)for(const t of c.findAll(n=>n.type==='TEXT')){
  if(t.parent&&t.parent.type==='INSTANCE')continue;
  const segs=t.getStyledTextSegments(['fontName','fontSize','textCase','lineHeight','letterSpacing','textStyleId']);
  if(segs.every(s=>s.textStyleId))continue;
  for(const s of segs)await figma.loadFontAsync(s.fontName);
  for(const seg of segs){if(seg.textStyleId)continue;const r=await pick(seg);
    if(segs.length===1)await t.setTextStyleIdAsync(r.s.id);else await t.setRangeTextStyleIdAsync(seg.start,seg.end,r.s.id);
    out.bound[r.k]++;}}
// re-audit
let left=0;for(const c of comps)for(const t of c.findAll(n=>n.type==='TEXT'))if(!(t.parent&&t.parent.type==='INSTANCE')&&t.getStyledTextSegments(['textStyleId']).some(s=>!s.textStyleId))left++;
out.textLeftUnstyled=left;return out;