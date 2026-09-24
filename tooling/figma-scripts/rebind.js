// Nearest-style rebind (WRITES). Runs inside a Figma `use_figma` call, same wrapper as acceptance.js:
//   const fix = eval("(async function(ROOTS){" + SOURCE + "})"); return await fix(page.children);
// Stored in the file as sharedPluginData('cpbuild','rebind').
// For every text run that is not bound to a text style, applies the nearest style:
//   same family and text case (case ignored for symbol-only runs), size ±2px, weight ±1 step.
//   Prefers the breakpoint of the enclosing frame (Desktop/…, Mobile/…) and "… Keyword" styles for
//   SemiBold runs inside two-weight headlines. Quote vs Stat Unit styles are chosen by context.
// Also binds raw #52565A icon vectors to Text/Dark Charcoal (logos and placeholders are skipped).
// Run it on 02 · Components first (instances inherit), then Foundations and the page sets.

const TSl=await figma.getLocalTextStylesAsync();const PSl=await figma.getLocalPaintStylesAsync();const PS=Object.fromEntries(PSl.map(s=>[s.name,s]));const PSid=new Set(PSl.map(s=>s.id));
const W={Thin:100,ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,'Semi Bold':600,Bold:700};
const lh=(l,fs)=>l.unit==='AUTO'?fs*1.5:l.unit==='PERCENT'?fs*l.value/100:l.value;
const shown=n=>{let q=n;while(q&&!['PAGE','DOCUMENT','SECTION'].includes(q.type)){if(q.visible===false)return false;q=q.parent;}return true;};
const inPh=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/^Placeholder/.test(q.name)||q.name==='Placeholder Caption')return true;q=q.parent;}return false;};
const inLogo=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/^Logo/.test(q.name)||(q.type==='INSTANCE'&&q.mainComponent&&/Logo/.test((q.mainComponent.parent||{}).name||'')))return true;q=q.parent;}return false;};
const bpOf=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/Breakpoint=Mobile|^Mobile \//.test(q.name))return 'Mobile';if(/Breakpoint=Desktop|^Desktop \//.test(q.name))return 'Desktop';q=q.parent;}return 'Desktop';};
const fonts=new Set();for(const s of TSl)fonts.add(JSON.stringify(s.fontName));for(const f of fonts)await figma.loadFontAsync(JSON.parse(f));
const R={texts:0,bound:0,left:{},vectors:0,byStyle:{}};
for(const root of ROOTS)for(const n of root.findAll(x=>x.type==='TEXT'||x.type==='VECTOR'||x.type==='BOOLEAN_OPERATION')){if(!shown(n))continue;
  if(n.type!=='TEXT'){if(inLogo(n)||inPh(n))continue;for(const kind of ['fills','strokes']){const v=n[kind];if(v===figma.mixed||!v.length)continue;const sid=kind==='fills'?n.fillStyleId:n.strokeStyleId;if(sid&&PSid.has(sid))continue;
      const p=v.find(x=>x.visible!==false&&x.type==='SOLID');if(!p)continue;const hx=[p.color.r,p.color.g,p.color.b].map(c=>Math.round(c*255));
      if(Math.abs(hx[0]-82)<=2&&Math.abs(hx[1]-86)<=2&&Math.abs(hx[2]-90)<=2){if(kind==='fills')await n.setFillStyleIdAsync(PS['Text/Dark Charcoal'].id);else await n.setStrokeStyleIdAsync(PS['Text/Dark Charcoal'].id);R.vectors++;}}continue;}
  if(inPh(n)||!/[A-Za-z0-9]{2,}/.test(n.characters))continue;
  const segs=n.getStyledTextSegments(['fontName','fontSize','textStyleId','textCase','lineHeight','letterSpacing']);if(segs.every(g=>g.textStyleId))continue;R.texts++;
  const wts=segs.map(g=>W[g.fontName.style]||400);const mixedW=new Set(wts).size>1;const bp=bpOf(n);
  for(const s of n.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);
  for(const g of segs){if(g.textStyleId)continue;const gw=W[g.fontName.style]||400;let best=null,bd=1e9;
    for(const s of TSl){if(s.fontName.family!==g.fontName.family)continue;if(s.textCase!==g.textCase&&/[A-Za-z]/.test(n.characters.slice(g.start,g.end)))continue;const ds=Math.abs(s.fontSize-g.fontSize);if(ds>2)continue;const sw=W[s.fontName.style]||400;const steps=Math.abs(sw-gw)/100;if(steps>1)continue;
      const [pre]=s.name.split('/');let d=ds*10+steps*6+Math.abs(lh(s.lineHeight,s.fontSize)-lh(g.lineHeight,g.fontSize))*0.3;
      if(pre!=='Utility'&&pre!==bp)d+=3;const isQ=(()=>{let q=n;while(q&&q.type!=='PAGE'){if(/Quote/.test(q.name))return true;q=q.parent;}return false;})();if(/Quote/.test(s.name)&&!isQ)d+=1;if(/Stat Unit/.test(s.name)&&isQ)d+=1;const kw=/Keyword/.test(s.name);if(mixedW&&gw>=600)d+=kw?0:1.5;else if(kw)d+=2;
      if(d<bd){bd=d;best=s;}}
    if(best){await n.setRangeTextStyleIdAsync(g.start,g.end,best.id);R.bound++;R.byStyle[best.name]=(R.byStyle[best.name]||0)+1;}
    else{const k=g.fontName.style+' '+g.fontSize+' '+g.textCase+' "'+n.characters.slice(g.start,Math.min(g.end,g.start+20))+'"';R.left[k]=(R.left[k]||0)+1;}}}
return {texts:R.texts,segmentsBound:R.bound,vectorsBound:R.vectors,left:Object.entries(R.left).sort((a,b)=>b[1]-a[1]).slice(0,15),leftTotal:Object.values(R.left).reduce((a,b)=>a+b,0),byStyle:Object.entries(R.byStyle).sort((a,b)=>b[1]-a[1]).slice(0,12)};
