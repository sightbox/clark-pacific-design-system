// Figma 2.5 additions file: generates use_figma call bodies that recreate the 2.0 styles and
// primitives in a fresh file (the 2.0 library isn't published to the Sightbox team).
// Usage: node a25/setup.js styles <flagged.txt> > call.js | node a25/setup.js prims > call.js
const fs = require('fs'); const path = require('path');
const T = path.join(__dirname, '..');
const src = JSON.parse(fs.readFileSync(path.join(T, '../tokens/source/figma-styles.json')));
const WEIGHTS = { 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold' };
const [step, arg] = process.argv.slice(2);

if (step === 'styles') {
  const flagged = fs.readFileSync(arg, 'utf8').split('\n').filter(Boolean);
  const paints = src.paints.map(p => p.type === 'solid' ? { n: p.name, d: p.description || '', hex: p.hex, o: p.opacity }
    : { n: p.name, d: p.description || '', dir: p.direction, stops: p.stops });
  for (const f of flagged) {
    const m = f.match(/#([0-9A-F]{6}) (\d+)%$/);
    paints.push({ n: f, d: 'Off-token value carried from the September library for a 2.5 component. Not in the 2.0 system: bind to the nearest 2.0 style or approve it.', hex: '#' + m[1], o: +m[2] / 100 });
  }
  const texts = src.text.map(t => { const [n, family, w, size, lh, ls, u, a] = t.split('|'); return { n, family, w: +w, size: +size, lh, ls, u: u === 'U', a: a === 'A' }; });
  const code = `const PAINTS=${JSON.stringify(paints)};const TEXTS=${JSON.stringify(texts)};const WEIGHTS=${JSON.stringify(WEIGHTS)};
const hex=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const have=new Set([...(await figma.getLocalPaintStylesAsync()).map(s=>s.name),...(await figma.getLocalTextStylesAsync()).map(s=>s.name)]);
const made=[];
for(const p of PAINTS){if(have.has(p.n))continue;const s=figma.createPaintStyle();s.name=p.n;s.description=p.d;
 if(p.hex)s.paints=[{type:'SOLID',color:hex(p.hex),opacity:p.o}];
 else{const tf=p.dir==='to top'?[[0,-1,1],[1,0,0]]:[[0,1,0],[-1,0,1]];
  s.paints=[{type:'GRADIENT_LINEAR',gradientTransform:tf,gradientStops:p.stops.map(st=>({position:st.position,color:{...hex(st.hex),a:st.alpha}}))}];}
 made.push(s.id);}
for(const t of TEXTS){if(have.has(t.n))continue;const fn={family:t.family,style:WEIGHTS[t.w]};await figma.loadFontAsync(fn);
 const s=figma.createTextStyle();s.name=t.n;s.fontName=fn;s.fontSize=t.size;
 s.lineHeight=t.lh==='auto'?{unit:'AUTO'}:t.lh.endsWith('%')?{unit:'PERCENT',value:parseFloat(t.lh)}:{unit:'PIXELS',value:parseFloat(t.lh)};
 s.letterSpacing={unit:'PERCENT',value:parseFloat(t.ls)};if(t.u)s.textCase='UPPER';
 s.description=t.a?'Added during the 2.0 build (off the README scale). Copied from the 2.0 file.':'Copied from the 2.0 file.';made.push(s.id);}
return {created:made.length,paints:(await figma.getLocalPaintStylesAsync()).length,texts:(await figma.getLocalTextStylesAsync()).length};`;
  process.stdout.write(code);
}

if (step === 'prims') {
  // Button / Text Link / Text Link · Card / Accent Bar, rebuilt from the 2.0 file's structure (read 30 Sep 2026).
  const code = `const pg=figma.root.children[0];pg.name='Components · 2.5 Additions';
let pp=figma.root.children.find(p=>p.name==='Building blocks (from 2.0)');if(!pp){pp=figma.createPage();pp.name='Building blocks (from 2.0)';}
await figma.setCurrentPageAsync(pp);
const PS={};for(const s of await figma.getLocalPaintStylesAsync())PS[s.name]=s.id;const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
await figma.loadFontAsync({family:'Poppins',style:'SemiBold'});
const fill=async(n,s)=>{if(s)await n.setFillStyleIdAsync(PS[s]);else n.fills=[];};
const label=async(par,ts,col,txt)=>{const t=figma.createText();t.name='Label';await t.setTextStyleIdAsync(TS[ts].id);t.characters=txt;await fill(t,col);par.appendChild(t);return t;};
const out={};
async function mkset(name,variants,defLabel,x,y){const comps=[];
 for(const v of variants){const c=figma.createComponent();c.name=v.vn;await v.build(c);comps.push(c);}
 const set=figma.combineAsVariants(comps,pp);set.name=name;
 let lk=null;if(defLabel){lk=set.addComponentProperty('Label','TEXT',defLabel);for(const c of comps){const t=c.findOne(n=>n.type==='TEXT'&&n.name==='Label');t.componentPropertyReferences={characters:lk};}}
 set.layoutMode='HORIZONTAL';set.layoutWrap='WRAP';set.itemSpacing=24;set.counterAxisSpacing=24;set.paddingTop=set.paddingBottom=set.paddingLeft=set.paddingRight=24;
 set.primaryAxisSizingMode='FIXED';set.counterAxisSizingMode='AUTO';set.resize(900,set.height);set.x=x;set.y=y;
 const byName={};for(const c of comps)byName[c.name]=c;
 for(const v of variants)if(v.hover){const c=byName[v.vn];await c.setReactionsAsync([{trigger:{type:'ON_HOVER'},actions:[{type:'NODE',destinationId:byName[v.hover].id,navigation:'CHANGE_TO',transition:{type:'SMART_ANIMATE',easing:{type:'EASE_OUT'},duration:v.dur},preserveScrollPosition:false}]}]);}
 out[name]={id:set.id,label:lk,variants:Object.fromEntries(comps.map(c=>[c.name,c.id]))};return set;}
// Button
const BV=[];for(const bp of ['Desktop','Mobile'])for(const ty of ['Primary','Secondary','On-dark'])for(const st of ['Default','Hover']){
 const vn=\`Type=\${ty}, State=\${st}, Breakpoint=\${bp}\`;
 BV.push({vn,dur:0.15,hover:st==='Default'?\`Type=\${ty}, State=Hover, Breakpoint=\${bp}\`:null,build:async c=>{
  c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;
  const out=ty!=='Primary';
  if(bp==='Desktop'){const p=out?[17.5,33.5]:[16,32];c.paddingTop=c.paddingBottom=p[0];c.paddingLeft=c.paddingRight=p[1];c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';}
  else{c.paddingTop=c.paddingBottom=0;c.paddingLeft=c.paddingRight=20;c.resize(350,48);c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';}
  await fill(c,ty==='Primary'?(st==='Default'?'Primary/Blue':'State/Primary Hover'):st==='Hover'?(ty==='Secondary'?'State/Hover fill on light':'State/Hover fill on dark'):null);
  if(out){c.strokes=[{type:'SOLID',color:{r:0,g:0,b:0}}];await c.setStrokeStyleIdAsync(PS[ty==='Secondary'?'Text/Dark Charcoal':'Outline/On-dark']);c.strokeWeight=1.5;c.strokeAlign='INSIDE';}
  await label(c,bp+'/Button',ty==='Secondary'?'Text/Dark Charcoal':'Neutral/White','Talk to an Expert');}});}
await mkset('Button',BV,'Talk to an Expert',0,0);
// Text Link
const TC={Orange:'Accent/Orange',Blue:'Primary/Blue',Green:'Sustainability/Green','On dark':'Neutral/White'};const TV=[];
for(const col of Object.keys(TC))for(const st of ['Default','Hover'])TV.push({vn:\`Color=\${col}, State=\${st}, Breakpoint=Desktop\`,dur:0.4,hover:st==='Default'?\`Color=\${col}, State=Hover, Breakpoint=Desktop\`:null,build:async c=>{
 c.layoutMode='VERTICAL';c.itemSpacing=8;c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';await fill(c,null);
 await label(c,'Desktop/Button',col==='On dark'?'Neutral/White':'Text/Dark Charcoal','View Finishes Guide');
 const tr=figma.createFrame();tr.name='Track';c.appendChild(tr);tr.layoutSizingHorizontal='FILL';tr.resize(tr.width,3);tr.clipsContent=true;await fill(tr,col==='On dark'?'Overlay/On-dark divider':'Track/Light');
 const b=figma.createRectangle();b.name='Bar';tr.appendChild(b);b.resize(st==='Hover'?tr.width:0.01,3);b.x=0;b.y=0;await fill(b,TC[col]);if(st==='Hover')b.constraints={horizontal:'STRETCH',vertical:'MIN'};}});
for(const col of Object.keys(TC))TV.push({vn:\`Color=\${col}, State=Default, Breakpoint=Mobile\`,build:async c=>{
 c.layoutMode='VERTICAL';c.itemSpacing=12;c.paddingTop=c.paddingBottom=12;c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';await fill(c,null);
 await label(c,'Mobile/Button',col==='On dark'?'Neutral/White':'Text/Dark Charcoal','View Finishes Guide');
 const b=figma.createFrame();b.name='Bar';c.appendChild(b);b.layoutSizingHorizontal='FILL';b.resize(b.width,2);await fill(b,TC[col]);}});
await mkset('Text Link',TV,'View Finishes Guide',0,400);
// Text Link / Card
const CV=[];for(const acc of ['Blue','Orange'])for(const st of ['Default','Hover'])CV.push({vn:\`Accent=\${acc}, State=\${st}\`,dur:0.4,hover:st==='Default'?\`Accent=\${acc}, State=Hover\`:null,build:async c=>{
 c.layoutMode='VERTICAL';c.itemSpacing=12;c.resize(340,34);c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';await fill(c,null);
 await label(c,'Desktop/Eyebrow Small','Text/Dark Charcoal','Read More');
 const tr=figma.createFrame();tr.name='Track';c.appendChild(tr);tr.layoutSizingHorizontal='FILL';tr.resize(tr.width,2);tr.clipsContent=true;await fill(tr,'Neutral/Border');
 const b=figma.createRectangle();b.name='Bar';tr.appendChild(b);b.resize(st==='Hover'?340:40,2);b.x=0;b.y=0;await fill(b,acc==='Blue'?'Primary/Blue':'Accent/Orange');}});
await mkset('Text Link / Card',CV,'Read More',0,800);
// Accent Bar
const AV=['Blue','Orange','Green'].map(col=>({vn:'Color='+col,build:async c=>{c.resize(40,3);await fill(c,TC[col]);}}));
await mkset('Accent Bar',AV,null,0,1050);
return out;`;
  process.stdout.write(code);
}

if (step === 'icons') {
  const icons = JSON.parse(fs.readFileSync(path.join(T, 'icons.json')));
  const logos = JSON.parse(fs.readFileSync(path.join(T, 'logos.json')));
  const code = `const ICONS=${JSON.stringify(icons.map(i => ({ n: i.n, svg: i.svg })))};const LOGOS=${JSON.stringify(logos)};
const pp=figma.root.children.find(p=>p.name==='Building blocks (from 2.0)');await figma.setCurrentPageAsync(pp);
const PS={};for(const s of await figma.getLocalPaintStylesAsync())PS[s.name]=s.id;
const near=(c,h)=>Math.abs(c.r-h[0])<0.01&&Math.abs(c.g-h[1])<0.01&&Math.abs(c.b-h[2])<0.01;
const DC=[82/255,86/255,90/255],WH=[1,1,1];
async function bind(n){for(const v of n.findAll(x=>'fills' in x)){
 if(v.strokes&&v.strokes.length&&v.strokes[0].type==='SOLID'){const c=v.strokes[0].color;if(near(c,DC))await v.setStrokeStyleIdAsync(PS['Text/Dark Charcoal']);else if(near(c,WH))await v.setStrokeStyleIdAsync(PS['Neutral/White']);}
 if(v.type!=='FRAME'&&v.fills&&v.fills.length&&v.fills[0].type==='SOLID'){const c=v.fills[0].color;if(near(c,DC))await v.setFillStyleIdAsync(PS['Text/Dark Charcoal']);else if(near(c,WH))await v.setFillStyleIdAsync(PS['Neutral/White']);}}}
const out={icons:{},logo:{}};let i=0;
const grid=figma.createFrame();grid.name='Icons';grid.layoutMode='HORIZONTAL';grid.layoutWrap='WRAP';grid.itemSpacing=24;grid.counterAxisSpacing=24;grid.paddingTop=grid.paddingBottom=grid.paddingLeft=grid.paddingRight=24;grid.resize(900,100);grid.primaryAxisSizingMode='FIXED';grid.counterAxisSizingMode='AUTO';grid.x=1000;grid.y=0;grid.fills=[];
for(const ic of ICONS){const f=figma.createNodeFromSvg(ic.svg);const c=figma.createComponent();c.name='Icon / '+ic.n;c.resize(24,24);c.fills=[];
 const s=24/f.width;for(const k of [...f.children])c.appendChild(k);f.remove();if(Math.abs(s-1)>0.001){for(const k of c.children){k.rescale(s);}}
 await bind(c);grid.appendChild(c);out.icons[ic.n]=c.id;}
const lc=[];for(const [tone,svg] of Object.entries(LOGOS)){const f=figma.createNodeFromSvg(svg);const c=figma.createComponent();c.name='Tone='+(tone==='Web'?'Web':'White');c.resize(f.width,f.height);c.fills=[];for(const k of [...f.children])c.appendChild(k);f.remove();if(tone!=='Web')await bind(c);lc.push(c);}
const ls=figma.combineAsVariants(lc,pp);ls.name='Logo / Long';ls.layoutMode='HORIZONTAL';ls.itemSpacing=24;ls.paddingTop=ls.paddingBottom=ls.paddingLeft=ls.paddingRight=24;ls.primaryAxisSizingMode='AUTO';ls.counterAxisSizingMode='AUTO';ls.x=1000;ls.y=grid.height+60;
out.logo={id:ls.id,variants:Object.fromEntries(lc.map(c=>[c.name,c.id]))};
return out;`;
  process.stdout.write(code);
}
