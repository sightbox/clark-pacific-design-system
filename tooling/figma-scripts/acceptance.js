// README acceptance checks (read-only). Runs inside a Figma `use_figma` call.
// Usage: wrap as a function of ROOTS (an array of nodes to scan) and call it once per Figma page:
//   const p = await figma.getNodeByIdAsync('<pageId>'); await figma.setCurrentPageAsync(p);
//   const check = eval("(async function(ROOTS){" + SOURCE + "})"); return await check(p.children);
// The same source is stored in the file as figma.root.getSharedPluginData('cpbuild','accept').
// Reports: unbound fills/text, fonts in use, weight-700 runs, off-palette colours, gradients,
// orange text on Blue/Dark Charcoal, non-zero radius (circles, pills, canvas frames excepted), detached instances.
// Exceptions by design: anything inside a "Placeholder…" layer, logo artwork, glyph-only text (✓ + – “ →).

const PSl=await figma.getLocalPaintStylesAsync();const PSid=new Set(PSl.map(s=>s.id));const hex=c=>'#'+[c.r,c.g,c.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('').toUpperCase();
const pal=new Set();for(const s of PSl)for(const p of s.paints)if(p.type==='SOLID')pal.add(hex(p.color)+'@'+Math.round((p.opacity??1)*100));
const pname=Object.fromEntries(PSl.map(s=>[s.id,s.name]));
const shown=n=>{let q=n;while(q&&!['PAGE','DOCUMENT','SECTION'].includes(q.type)){if(q.visible===false)return false;q=q.parent;}return true;};
const inPh=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/^Placeholder/.test(q.name)||q.name==='Placeholder Caption')return true;q=q.parent;}return false;};
const inLogo=n=>{let q=n;while(q&&q.type!=='PAGE'){if(/^Logo/.test(q.name)||(q.type==='INSTANCE'&&q.mainComponent&&/Logo/.test((q.mainComponent.parent||{}).name||'')))return true;q=q.parent;}return false;};
const R={nodes:0,unboundFill:{},unboundText:{},fonts:{},w700:0,offPalette:{},gradients:0,orangeOnDark:[],radius:{},detached:0};
const bump=(o,k)=>{o[k]=(o[k]||0)+1;};
const bgOf=n=>{let q=n.parent;while(q&&q.type!=='PAGE'){if('fills' in q&&q.fills!==figma.mixed&&q.visible!==false){const f=q.fills.filter(x=>x.visible!==false&&x.type==='SOLID'&&(x.opacity??1)>0.5&&(q.opacity??1)>0.5);if(f.length)return q.fillStyleId&&pname[q.fillStyleId]?pname[q.fillStyleId]:hex(f[f.length-1].color);}q=q.parent;}return null;};
for(const root of ROOTS)for(const n of root.findAll(()=>true)){if(!shown(n))continue;R.nodes++;const ph=inPh(n)||inLogo(n);
  if(n.type==='INSTANCE'&&!n.mainComponent)R.detached++;
  for(const kind of ['fills','strokes']){if(n.type==='TEXT'&&kind==='fills')continue;if(!(kind in n)||n[kind]===figma.mixed)continue;const vis=n[kind].filter(p=>p.visible!==false);if(!vis.length)continue;
    if(vis.some(p=>p.type!=='SOLID')){R.gradients++;continue;}for(const p of vis){const k=hex(p.color)+'@'+Math.round((p.opacity??1)*100);if(!pal.has(k)&&!ph)bump(R.offPalette,k);}
    const sid=kind==='fills'?n.fillStyleId:n.strokeStyleId;if(!ph&&(!sid||!PSid.has(sid)))bump(R.unboundFill,(n.type)+' '+n.name.slice(0,24)+' '+kind);}
  if('cornerRadius' in n&&n.type!=='ELLIPSE'){const cr=n.cornerRadius===figma.mixed?Math.max(n.topLeftRadius,n.topRightRadius,n.bottomLeftRadius,n.bottomRightRadius):n.cornerRadius;if(cr>0&&!(cr>=Math.min(n.width,n.height)/2-1)&&n.type!=='COMPONENT_SET'&&!(n.parent&&n.parent.type==='PAGE'))bump(R.radius,n.type+' '+n.name.slice(0,30)+' r'+cr);}
  if(n.type==='TEXT'){const segs=n.getStyledTextSegments(['fontName','textStyleId','fillStyleId','fills']);const glyph=!/[A-Za-z0-9]{2,}/.test(n.characters);
    for(const g of segs){bump(R.fonts,g.fontName.family+' '+g.fontName.style);if(/Bold/.test(g.fontName.style)&&!/Semi/.test(g.fontName.style))R.w700++;
      if(!ph&&!glyph&&(!g.textStyleId||!(typeof g.textStyleId==='string')))bump(R.unboundText,n.name.slice(0,24)+' '+g.fontName.style+' '+(n.fontSize===figma.mixed?'mix':n.fontSize));
      const vf=g.fills.filter(p=>p.visible!==false&&p.type==='SOLID');for(const p of vf){const k=hex(p.color)+'@'+Math.round((p.opacity??1)*100);if(!pal.has(k))bump(R.offPalette,k+' text');}
      if(!ph&&(!g.fillStyleId||!PSid.has(g.fillStyleId)))bump(R.unboundFill,'TEXT '+n.name.slice(0,24)+' fill');
      if(pname[g.fillStyleId]==='Accent/Orange'){const bg=bgOf(n);if(bg&&/Primary\/Blue|Dark Charcoal|#004A9F|#52565A/.test(bg))R.orangeOnDark.push(n.name+' "'+n.characters.slice(0,20)+'" on '+bg);}}}}
const top=(o,k=8)=>{const e=Object.entries(o).sort((a,b)=>b[1]-a[1]);return {total:e.reduce((a,b)=>a+b[1],0),top:e.slice(0,k).map(([a,b])=>b+' '+a)};};
return {nodes:R.nodes,unboundFill:top(R.unboundFill),unboundText:top(R.unboundText),fonts:R.fonts,w700:R.w700,offPalette:top(R.offPalette,12),gradients:R.gradients,orangeOnDark:R.orangeOnDark.slice(0,10),orangeOnDarkN:R.orangeOnDark.length,radius:top(R.radius),detached:R.detached};
