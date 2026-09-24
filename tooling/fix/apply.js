const page=figma.root.children.find(p=>p.name.startsWith('02'));await figma.setCurrentPageAsync(page);
const TS=await figma.getLocalTextStylesAsync();
const W={Thin:100,ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,'Semi Bold':600,Bold:700};
const lhpx=(lh,fs,fam)=>lh.unit==='AUTO'?fs*(fam==='Inter'?1.21:1.5):lh.unit==='PERCENT'?fs*lh.value/100:lh.value;
const desktopTiers=new Set(TS.filter(s=>s.name.startsWith('Desktop/')).map(s=>s.name.split('/')[1]));
function pick(f,fs,lh,ls,tc,bp){let b=null,bd=1e9;
  for(const s of TS){if(s.fontName.family!==f.family)continue;const [pre,tier]=s.name.split('/');
    let d=Math.abs(s.fontSize-fs)*10+Math.abs((W[s.fontName.style]||400)-(W[f.style]||400))/100*6+(s.textCase===tc?0:8)
      +Math.abs(s.letterSpacing.value-ls.value)*0.8+Math.abs(lhpx(s.lineHeight,s.fontSize,f.family)-lhpx(lh,fs,f.family))*0.5;
    if(pre!=='Utility'){const shared=pre==='Mobile'&&!desktopTiers.has(tier);if(!shared&&pre!==bp)d+=3;}
    if(d<bd){bd=d;b=s;}}
  return {s:b,d:bd};}
const inInstance=n=>{let p=n.parent;while(p&&p.type!=='PAGE'){if(p.type==='INSTANCE')return true;p=p.parent;}return false;};
const bpOf=n=>{let p=n;while(p&&p.type!=='PAGE'){if(p.type==='COMPONENT'&&/Breakpoint=Mobile/.test(p.name))return 'Mobile';if(p.type==='COMPONENT'&&/Breakpoint=Desktop/.test(p.name))return 'Desktop';p=p.parent;}return 'Desktop';};
function mainSeg(n){const segs=n.getStyledTextSegments(['fontName','fontSize','lineHeight','letterSpacing','textCase']);return {segs,m:segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a)};}
const GROUP=__GROUP__;const DRY=__DRY__;
const grp=page.children.find(n=>n.name.startsWith(GROUP));
const texts=grp.findAllWithCriteria({types:['TEXT']}).filter(n=>!inInstance(n));
const isGlyph=s=>!/[A-Za-z0-9]{2,}/.test(s);
const fonts=new Set();for(const s of TS)fonts.add(s.fontName.family+'|'+s.fontName.style);
const plan=[];const skip=[];
for(const n of texts){const {segs,m}=mainSeg(n);segs.forEach(g=>fonts.add(g.fontName.family+'|'+g.fontName.style));
  const bp=bpOf(n);const {s}=pick(m.fontName,m.fontSize,m.lineHeight,m.letterSpacing,m.textCase,bp);
  const mixed=new Set(segs.map(g=>g.fontName.style+g.fontSize)).size>1;const glyph=isGlyph(n.characters);
  const wdiff=Math.abs((W[s.fontName.style]||400)-(W[m.fontName.style]||400));
  const caseOk=glyph||s.textCase===m.textCase;const sizeOk=Math.abs(s.fontSize-m.fontSize)<=2;
  const ok=s&&caseOk&&sizeOk&&(mixed||glyph||wdiff<=100);
  if(ok)plan.push({n,s,segs,mixed});else skip.push(`${n.parent.name.slice(0,14)}/${n.name.slice(0,24)} "${n.characters.slice(0,18)}" ${m.fontName.style} ${m.fontSize} ${m.textCase[0]} ~ ${s&&s.name}`);}
if(DRY)return {apply:plan.length,skip:skip.length,skipList:skip};
for(const f of fonts){const [family,style]=f.split('|');await figma.loadFontAsync({family,style});}
let moved=[];const done=[];
for(const {n,s,segs,mixed} of plan){const w0=n.width,h0=n.height;
  await n.setTextStyleIdAsync(s.id);
  if(mixed){for(const g of segs){if(g.fontName.style!==s.fontName.style)n.setRangeFontName(g.start,g.end,g.fontName);}
    const main=segs.reduce((a,b)=>b.end-b.start>a.end-a.start?b:a);for(const g of segs)if(g!==main&&g.fontSize!==main.fontSize)n.setRangeFontSize(g.start,g.end,g.fontSize);}
  done.push(n.id);const dh=n.height-h0,dw=n.width-w0;if(Math.abs(dh)>4||Math.abs(dw)>4)moved.push(`${n.name.slice(0,22)} ${s.name} dh${Math.round(dh)} dw${Math.round(dw)}`);}
return {group:grp.name,applied:done.length,skipped:skip.length,skipList:skip,moved:moved.slice(0,40),movedCount:moved.length,mutatedNodeIds:done.length};
