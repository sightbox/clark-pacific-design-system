// Layout helpers used to build the 00 · Guide page (and the cover's flags list) inside Figma.
// Stored in the file as sharedPluginData('cpbuild','guidelib'). Use it by prefixing your script:
//   const run = eval("(async function(){" + figma.root.getSharedPluginData('cpbuild','guidelib') + BODY + "})");
//   return await run();
// Every helper binds text and fills to the system styles (no raw values):
//   chapter(num,title,keyword,intro)  → a 1440-wide chapter frame on 00 · Guide
//   sec(frame,title,intro,accent)     → a section with an accent bar and Heading XS title
//   table(sec,rows,{head,w})          → bordered rows; a cell can be [text,[[substring,nodeId]]] for links
//   cards(sec,[[title,body,accent]],cols) · steps(sec,[[title,body,links]]) · callout(sec,title,body,surface)
//   T(parent,text,style,color,{kw,links,fill,w}) — kw applies the "… Keyword" style to that substring.

const TSo=Object.fromEntries((await figma.getLocalTextStylesAsync()).map(s=>[s.name,s]));const PSo=Object.fromEntries((await figma.getLocalPaintStylesAsync()).map(s=>[s.name,s]));
for(const s of Object.values(TSo))await figma.loadFontAsync(s.fontName);
const AL=(dir,o={})=>{const f=figma.createAutoLayout(dir,o);f.fills=[];return f;};
async function T(parent,txt,style,color='Text/Dark Charcoal',o={}){const t=figma.createText();t.fontName=TSo[style].fontName;t.characters=txt;parent.appendChild(t);await t.setTextStyleIdAsync(TSo[style].id);await t.setFillStyleIdAsync(PSo[color].id);
  if(o.kw){const i=txt.lastIndexOf(o.kw);await t.setRangeTextStyleIdAsync(i,i+o.kw.length,TSo[style+' Keyword'].id);}
  if(o.links)for(const [sub,id] of o.links){const i=txt.indexOf(sub);if(i<0||!id)continue;t.setRangeHyperlink(i,i+sub.length,{type:'NODE',value:id});await t.setRangeFillStyleIdAsync(i,i+sub.length,PSo['Primary/Blue'].id);t.setRangeTextDecoration(i,i+sub.length,'UNDERLINE');}
  if(o.fill)t.layoutSizingHorizontal='FILL';else if(o.w){t.textAutoResize='HEIGHT';t.resize(o.w,t.height);}return t;}
async function bar(parent,color='Accent/Orange',w=40,h=3){const r=figma.createRectangle();r.resize(w,h);parent.appendChild(r);await r.setFillStyleIdAsync(PSo[color].id);r.name='Accent bar';return r;}
async function chapter(num,title,kw,intro){const page=figma.root.children.find(p=>p.name==='00 · Guide');await figma.setCurrentPageAsync(page);
  const name=num+' · '+title;for(const n of [...page.children])if(n.name===name)n.remove();
  const f=figma.createFrame();page.appendChild(f);f.name=name;f.resize(1440,100);await f.setFillStyleIdAsync(PSo['Neutral/White'].id);f.layoutMode='VERTICAL';f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='FIXED';f.paddingLeft=f.paddingRight=72;f.paddingTop=f.paddingBottom=96;f.itemSpacing=72;
  f.x=(parseInt(num)-1)*1640;f.y=0;
  const h=AL('VERTICAL',{name:'Intro',itemSpacing:20});f.appendChild(h);h.layoutSizingHorizontal='FILL';await T(h,'Guide · Chapter '+num,'Desktop/Eyebrow Small');await T(h,title,'Desktop/Heading LG','Text/Dark Charcoal',{kw});if(intro)await T(h,intro,'Desktop/Lead','Text/Dark Charcoal',{w:1000});return f;}
async function sec(f,title,intro,accent='Primary/Blue'){const s=AL('VERTICAL',{name:title,itemSpacing:24});f.appendChild(s);s.layoutSizingHorizontal='FILL';const h=AL('VERTICAL',{name:'Header',itemSpacing:14});s.appendChild(h);h.layoutSizingHorizontal='FILL';await bar(h,accent);await T(h,title,'Desktop/Heading XS');if(intro)await T(h,intro,'Desktop/Body','Text/Dark Charcoal',{w:900});return s;}
async function table(s,rows,o={}){const tb=AL('VERTICAL',{name:'Table',itemSpacing:0});s.appendChild(tb);tb.layoutSizingHorizontal='FILL';const w=o.w||[300];
  if(o.head){const r=AL('HORIZONTAL',{name:'Head',itemSpacing:32});tb.appendChild(r);r.layoutSizingHorizontal='FILL';r.paddingBottom=12;for(let i=0;i<o.head.length;i++){const t=await T(r,o.head[i],'Desktop/Label','Neutral/Mid Gray');if(i<o.head.length-1){t.textAutoResize='HEIGHT';t.resize(w[i]||300,t.height);}else t.layoutSizingHorizontal='FILL';}}
  for(const row of rows){const r=AL('HORIZONTAL',{name:'Row',itemSpacing:32});tb.appendChild(r);r.layoutSizingHorizontal='FILL';r.paddingTop=r.paddingBottom=16;r.strokeTopWeight=1;r.strokeBottomWeight=0;r.strokeLeftWeight=0;r.strokeRightWeight=0;await r.setStrokeStyleIdAsync(PSo['Neutral/Border'].id);
    for(let i=0;i<row.length;i++){const cell=row[i];const [txt,links]=Array.isArray(cell)?cell:[cell,null];const t=await T(r,txt,i===0?'Desktop/Body Strong':'Desktop/Body Small','Text/Dark Charcoal',{links});if(i<row.length-1){t.textAutoResize='HEIGHT';t.resize(w[i]||300,t.height);}else t.layoutSizingHorizontal='FILL';}}
  return tb;}
async function cards(s,items,cols=3,surface='Neutral/BG Alt'){const g=AL('HORIZONTAL',{name:'Cards',itemSpacing:24});s.appendChild(g);g.layoutSizingHorizontal='FILL';g.layoutWrap='WRAP';g.counterAxisSpacing=24;
  const cw=Math.floor((1296-(cols-1)*24)/cols);for(const [a,b,accent] of items){const c=AL('VERTICAL',{name:a,itemSpacing:12});g.appendChild(c);c.resize(cw,10);c.layoutSizingHorizontal='FIXED';c.layoutSizingVertical='HUG';c.paddingTop=c.paddingBottom=c.paddingLeft=c.paddingRight=28;await c.setFillStyleIdAsync(PSo[surface].id);
    await bar(c,accent||'Accent/Orange',28,3);await T(c,a,'Desktop/Card Title','Text/Dark Charcoal',{fill:true});if(b){const bt=await T(c,b,'Desktop/Body Small','Text/Dark Charcoal');bt.layoutSizingHorizontal='FILL';}}return g;}
async function steps(s,list){const g=AL('VERTICAL',{name:'Steps',itemSpacing:0});s.appendChild(g);g.layoutSizingHorizontal='FILL';
  for(let i=0;i<list.length;i++){const [a,b,links]=list[i];const r=AL('HORIZONTAL',{name:'Step '+(i+1),itemSpacing:28});g.appendChild(r);r.layoutSizingHorizontal='FILL';r.paddingTop=r.paddingBottom=18;r.strokeTopWeight=1;r.strokeBottomWeight=0;r.strokeLeftWeight=0;r.strokeRightWeight=0;await r.setStrokeStyleIdAsync(PSo['Neutral/Border'].id);
    const n=await T(r,String(i+1).padStart(2,'0'),'Desktop/Step Number','Primary/Blue');n.textAutoResize='HEIGHT';n.resize(80,n.height);const c=AL('VERTICAL',{name:'Text',itemSpacing:6});r.appendChild(c);c.layoutSizingHorizontal='FILL';
    const t1=await T(c,a,'Desktop/Body Strong');t1.layoutSizingHorizontal='FILL';if(b){const t2=await T(c,b,'Desktop/Body Small','Text/Dark Charcoal',{links});t2.layoutSizingHorizontal='FILL';}}return g;}
async function callout(s,title,body,surface='Primary/Blue'){const c=AL('VERTICAL',{name:'Callout · '+title,itemSpacing:10});s.appendChild(c);c.layoutSizingHorizontal='FILL';c.paddingTop=c.paddingBottom=28;c.paddingLeft=c.paddingRight=32;await c.setFillStyleIdAsync(PSo[surface].id);
  const dark=/Blue|Charcoal/.test(surface);await T(c,title,'Desktop/Card Title',dark?'Neutral/White':'Text/Dark Charcoal',{fill:true});const b=await T(c,body,'Desktop/Body Small',dark?'Neutral/White':'Text/Dark Charcoal');b.layoutSizingHorizontal='FILL';return c;}
