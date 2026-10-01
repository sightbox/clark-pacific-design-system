// 2.5 interactions + text properties helpers. Stored in the file as sharedPluginData('a25','ix');
// load with: const X=await (eval('('+figma.root.getSharedPluginData('a25','ix')+')'))(figma,{page,section});
async function A25IX(figma,opts){
  opts=opts||{};
  const pg=figma.root.children.find(p=>p.name===(opts.page||'02 · Components'));
  if(figma.currentPage!==pg)await figma.setCurrentPageAsync(pg);
  const sec=opts.section?pg.children.find(n=>n.type==='SECTION'&&n.name===opts.section):pg;
  const PS={},TS={};
  for(const s of await figma.getLocalPaintStylesAsync())PS[s.name]=s;
  for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
  const SN={};for(const s of Object.values(PS).concat(Object.values(TS)))SN[s.id]=s.name;
  const find=name=>sec.children.find(c=>(c.type==='COMPONENT'||c.type==='COMPONENT_SET')&&c.name===name);
  const texts=n=>n.findAllWithCriteria({types:['TEXT']});
  const T=(root,str,i)=>texts(root).filter(t=>t.characters===str)[i||0];
  const inInstance=(n,root)=>{let p=n.parent;while(p&&p!==root){if(p.type==='INSTANCE')return true;p=p.parent;}return false;};
  async function fonts(node){const s=new Set();for(const t of texts(node))for(const g of t.getStyledTextSegments(['fontName']))s.add(JSON.stringify(g.fontName));for(const f of s)await figma.loadFontAsync(JSON.parse(f));}
  async function loadStyleFonts(){for(const s of Object.values(TS))await figma.loadFontAsync(s.fontName);}
  // Set text, keeping styles. kw: substring to keep in the keyword style; default = same number of trailing words as before.
  async function setText(t,str,kw){
    const segs=t.getStyledTextSegments(['textStyleId','fillStyleId']);
    if(segs.length===1){t.characters=str;return;}
    const base=segs[0],key=segs.find(s=>s.textStyleId!==base.textStyleId||s.fillStyleId!==base.fillStyleId)||segs[segs.length-1];
    let a,b;
    if(kw!=null){a=str.indexOf(kw);b=a+kw.length;}
    else{const n=key.characters.trim().split(/\s+/).length;const w=[...str.matchAll(/\S+/g)];a=w[Math.max(0,w.length-n)].index;b=str.length;}
    t.characters=str;
    await t.setRangeTextStyleIdAsync(0,str.length,base.textStyleId);if(base.fillStyleId)await t.setRangeFillStyleIdAsync(0,str.length,base.fillStyleId);
    if(a>=0&&b>a){await t.setRangeTextStyleIdAsync(a,b,key.textStyleId);if(key.fillStyleId)await t.setRangeFillStyleIdAsync(a,b,key.fillStyleId);}
  }
  const fmt=c=>Object.entries(c).map(([k,v])=>k+'='+v).join(', ');
  // Turn a component into a component set: one variant per combo, mutate(node,combo) customises each.
  async function variants(comp,combos,mutate){
    const name=comp.name,desc=comp.description,x=comp.x,y=comp.y,idx=sec.children.indexOf(comp);
    await fonts(comp);
    const nodes=[comp];for(let i=1;i<combos.length;i++){const c=comp.clone();sec.appendChild(c);nodes.push(c);}
    for(let i=0;i<combos.length;i++){nodes[i].name=fmt(combos[i]);nodes[i].description='';await mutate(nodes[i],combos[i]);}
    const set=figma.combineAsVariants(nodes,sec,idx);
    set.name=name;set.description=desc;
    set.layoutMode='VERTICAL';set.itemSpacing=80;set.paddingTop=set.paddingBottom=set.paddingLeft=set.paddingRight=40;
    set.primaryAxisSizingMode='AUTO';set.counterAxisSizingMode='AUTO';
    set.x=x;set.y=y;
    return {set,get:c=>set.children.find(n=>n.name===fmt(c))};
  }
  async function click(node,dest,dur){
    await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation:'CHANGE_TO',transition:{type:'SMART_ANIMATE',easing:{type:'EASE_OUT'},duration:dur||0.3},preserveScrollPosition:false}]}]);
  }
  // Restyle a tab/chip row: chip at activeIdx takes the look of the row's original active chip (origIdx).
  async function tabs(row,activeIdx,origIdx){
    origIdx=origIdx||0;const kids=[...row.children];
    const labels=kids.map(k=>texts(k)[0].characters);
    const tplA=kids[origIdx],tplI=kids[origIdx===0?1:0];
    const out=[];
    for(let i=0;i<kids.length;i++){
      const n=(i===activeIdx?tplA:tplI).clone();row.insertChild(row.children.indexOf(kids[i]),n);
      const t=texts(n)[0];t.characters=labels[i];
      for(const b of n.children)if(b.type!=='TEXT'&&b.height<=4){
        if(b.layoutPositioning==='ABSOLUTE')b.resize(n.width,b.height);else b.layoutSizingHorizontal='FILL';}
      out.push(n);
    }
    for(const k of kids)k.remove();
    return out;
  }
  async function emptyState(parent,str,index){
    const f=figma.createAutoLayout('VERTICAL',{name:'Empty state',paddingTop:32,paddingBottom:32,paddingLeft:24,paddingRight:24});f.fills=[];
    parent.insertChild(index==null?parent.children.length:index,f);
    const t=figma.createText();f.appendChild(t);
    await t.setTextStyleIdAsync(TS['Desktop/Body'].id);t.characters=str;await t.setFillStyleIdAsync(PS['Neutral/Mid Gray'].id);
    t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';
    if(parent.layoutMode&&parent.layoutMode!=='NONE'){f.layoutSizingHorizontal='FILL';f.layoutSizingVertical='HUG';}
    return f;
  }
  // ---- text properties ----
  const GLYPH=new Set(['‹','›','+','–','-','·','✕','×','→']);
  function role(t){
    const nm=typeof t.textStyleId==='string'?(SN[t.textStyleId]||''):'';
    if(t.parent&&t.parent.name==='cp-textlink')return 'Link';
    if(/Display|Heading|Lead|Quote/.test(nm))return 'Heading';
    if(/Eyebrow/.test(nm))return 'Eyebrow';
    if(/Button|Link/.test(nm))return 'Link';
    if(/Body/.test(nm))return 'Body';
    if(/Flagged/.test(nm)){const m=nm.match(/ (\d+)\//);return m&&+m[1]>=28?'Heading':'Text';}
    if(/Placeholder/.test(nm))return 'Placeholder';
    return 'Label';
  }
  const similar=(a,b)=>a!==b&&a.type===b.type&&a.name===b.name&&('children' in a)&&('children' in b)&&((a.children.length===b.children.length&&Math.abs(a.height-b.height)<a.height*0.6+8)||(a.parent.layoutMode==='HORIZONTAL'&&Math.abs(a.height-b.height)<a.height*0.3+4));
  function item(t,root){
    let n=t.parent;
    while(n&&n!==root){const p=n.parent;if(p&&n.type!=='TEXT'){const sib=p.children.filter(c=>c===n||similar(c,n));
      if(sib.length>=2){const hasImg=n.findOne&&n.findOne(x=>x.name==='Image placeholder');const kind=hasImg?'Card':(n.height<60&&n.width<260?'Tab':'Item');return kind+' '+(sib.indexOf(n)+1);}}
      n=p;}
    return '';
  }
  async function textProps(node){
    const vars=node.type==='COMPONENT_SET'?[...node.children]:[node];
    const keyed=v=>{const m=new Map(),seen={};for(const t of texts(v)){if(inInstance(t,v))continue;const c=t.characters;seen[c]=(seen[c]||0)+1;m.set(c+'#'+seen[c],t);}return m;};
    const maps=vars.map(keyed);const base=maps[0];const used={};let n=0,skipped=0;
    for(const [k,t] of base){
      const c=t.characters.trim();
      if(c.length<2||GLYPH.has(c)){continue;}
      if(t.getStyledTextSegments(['textStyleId']).length>1){skipped++;continue;}
      if(!maps.every(m=>m.has(k))){skipped++;continue;}
      if(t.componentPropertyReferences&&t.componentPropertyReferences.characters)continue;
      const it=item(t,vars[0]);let name=(it?it+' · ':'')+role(t);
      if(used[name]){used[name]++;name=name+' '+used[name];}else used[name]=1;
      const key=node.addComponentProperty(name,'TEXT',t.characters);
      for(const m of maps)m.get(k).componentPropertyReferences={characters:key};
      n++;
    }
    return {props:n,skipped};
  }
  // Re-stack the section: components/sets in manifest order, their dev notes to the right, extras (sub-components) right of the note.
  function relayout(pad){
    pad=pad||120;
    const items=sec.children.filter(c=>(c.type==='COMPONENT'||c.type==='COMPONENT_SET')&&!c.getSharedPluginData('a25','extraOf'));
    items.sort((a,b)=>a.y-b.y);
    let y=pad,maxR=0;
    for(const c of items){
      c.x=pad;c.y=y;let r=c.x+c.width,h=c.height;
      const note=sec.children.find(nn=>nn.name==='Dev note / '+c.name);
      if(note){note.x=r+80;note.y=y;r=note.x+note.width;h=Math.max(h,note.height);}
      let ex=r+80;for(const e of sec.children.filter(e=>e.getSharedPluginData('a25','extraOf')===c.name)){e.x=ex;e.y=y;ex+=e.width+80;r=e.x+e.width;h=Math.max(h,e.height);}
      maxR=Math.max(maxR,r);y+=h+240;
    }
    sec.resizeWithoutConstraints(maxR+pad,y-240+pad);
    return {items:items.length,w:Math.round(maxR+pad),h:Math.round(y-240+pad)};
  }
  return {pg,sec,PS,TS,find,texts,T,fonts,loadStyleFonts,setText,variants,click,tabs,emptyState,textProps,relayout,fmt};
}
