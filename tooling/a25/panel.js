// Page panel → component converter. Stored in the design-system file as sharedPluginData('a25','panel').
// Use: const run = await eval("(async function(){" + figma.root.getSharedPluginData('a25','panel') + "})")();
//      await run(figma, [{ name, page, d: '<desktop frame id>', m: '<mobile frame id>' | null, mInst: '<existing mobile instance id>' }]);
// Per spec: clones the desktop and mobile Page-specific frames, makes them Breakpoint=Desktop / Mobile variants of a new
// component set in 02 · Components → "04 · Page panels", adds a text property for every single-style text layer,
// replaces the frames on the pages with instances and moves the originals to the "Replaced page-specific frames" sections.
// Details learned: set the current page first (createSection lands on it); non-auto-layout roots are made vertical auto-layout;
// hard line breaks in single-style text are removed; texts inside nested instances are skipped.
return async function(figma, specs, opts){
 opts=opts||{};
 for(const id of ['2:3','2:4','2:5','81:2','81:3'])await (await figma.getNodeByIdAsync(id)).loadAsync();
 figma.skipInvisibleInstanceChildren=false;
 const TSid={};for(const s of await figma.getLocalTextStylesAsync())TSid[s.id]=s.name;
 const comps0=await figma.getNodeByIdAsync('2:3');await figma.setCurrentPageAsync(comps0);
 let section=comps0.children.find(n=>n.type==='SECTION'&&n.name==='04 · Page panels');
 if(!section){let bottom=0;for(const c of comps0.children){bottom=Math.max(bottom,c.y+c.height);}
  section=figma.createSection();section.name='04 · Page panels';section.x=0;section.y=bottom+300;section.resizeWithoutConstraints(8000,400);section.fills=[];}
 const secD=await figma.getNodeByIdAsync('235:9931'),secM=await figma.getNodeByIdAsync('260:5810');
 const roleOf=(sn)=>{const s=(sn||'').replace(/^(Desktop|Mobile)\//,'');
  if(!s)return 'Text';
  if(/^Eyebrow/.test(s))return 'Eyebrow';if(/^Heading|^Display|^Lead/.test(s))return 'Heading';if(/^Body/.test(s))return 'Body';if(/^Card Title/.test(s))return 'Title';
  if(/^Label|^Link|^Button/.test(s))return /Button|Link/.test(s)?'Link':'Label';if(/^Stat/.test(s))return 'Stat';if(/Placeholder/.test(s))return 'Caption';
  if(/^Caption|^Meta|^Fine/.test(s))return 'Meta';if(/^Year/.test(s))return 'Year';if(/^Quote/.test(s))return 'Quote';return s.replace(/[^A-Za-z ]/g,'').trim()||'Text';};
 const report=[];
 let cy=80;for(const ch of section.children){cy=Math.max(cy,ch.y+ch.height+80);}
 let rx=80,ry=cy,rh=0;
 for(const sp of specs){
  try{
  const dn=sp.d?await figma.getNodeByIdAsync(sp.d):null;
  const mn=sp.m?await figma.getNodeByIdAsync(sp.m):null;
  const plans=[];const variants=[];
  const mk=async(node,bp,detach)=>{
    let c=node.clone();
    if(detach){c=c.detachInstance();}
    if(c.layoutMode==='NONE'){c.layoutMode='VERTICAL';c.itemSpacing=0;c.paddingTop=c.paddingBottom=c.paddingLeft=c.paddingRight=0;c.counterAxisSizingMode='FIXED';c.primaryAxisSizingMode='AUTO';for(const k of c.children){if('layoutSizingHorizontal' in k&&k.layoutPositioning!=='ABSOLUTE')k.layoutSizingHorizontal='FILL';}}
    const comp=figma.createComponentFromNode(c);
    comp.name='Breakpoint='+bp;section.appendChild(comp);
    const counters={};const plan=[];
    for(const t of comp.findAll(n=>n.type==='TEXT')){
      {let q=t.parent,ii=false;while(q&&q!==comp){if(q.type==='INSTANCE'){ii=true;break;}q=q.parent;}if(ii)continue;}
      const segs=t.getStyledTextSegments(['textStyleId']);
      const sn=segs.length&&segs[0].textStyleId?TSid[segs[0].textStyleId]:'';
      const role=roleOf(sn);counters[role]=(counters[role]||0)+1;
      const nm=role+' '+counters[role];t.name=nm;
      if(segs.length===1&&/\n/.test(t.characters)){await figma.loadFontAsync(t.fontName);t.characters=t.characters.replace(/[ \t]*\n[ \t]*/g,' ');}
      if(segs.length===1&&segs[0].textStyleId&&t.characters.trim())plan.push({t,nm,def:t.characters});
    }
    plans.push(plan);variants.push(comp);return comp;};
  const dc=dn?await mk(dn,'Desktop',false):null;
  let mc=null;
  if(mn)mc=await mk(mn,'Mobile',false);else if(sp.mInst){const inst=await figma.getNodeByIdAsync(sp.mInst);mc=await mk(inst,'Mobile',true);}
  if(!dc&&!mc)throw new Error('no source');
  const set=figma.combineAsVariants(variants,section);set.name=sp.name;set.fills=[];
  const defs={};
  for(const plan of plans)for(const it of plan){if(!(it.nm in defs)){defs[it.nm]=set.addComponentProperty(it.nm,'TEXT',it.def.slice(0,400));}it.t.componentPropertyReferences={characters:defs[it.nm]};}
  let x=0,h=0;for(const v of set.children){v.x=x;v.y=0;x+=v.width+40;h=Math.max(h,v.height);}
  set.resizeWithoutConstraints(Math.max(100,x-40),Math.max(100,h));
  if(rx+set.width>7800){rx=80;ry+=rh+120;rh=0;}
  set.x=rx;set.y=ry;rx+=set.width+120;rh=Math.max(rh,set.height);
  set.description='Page panel built from the '+(sp.page||'page')+' design (FPO copy). Edit copy through the text properties; heading keyword runs are edited on the layer.';
  const sw=[];
  for(const [fid,bp,sec] of [[sp.d,'Desktop',secD],[sp.m,'Mobile',secM]]){
    if(!fid)continue;const f=await figma.getNodeByIdAsync(fid);if(!f)continue;
    const v=set.children.find(x=>x.name==='Breakpoint='+bp);if(!v)continue;
    const par=f.parent;const idx=par.children.indexOf(f);
    const inst=v.createInstance();par.insertChild(idx,inst);inst.layoutSizingHorizontal='FILL';try{inst.layoutSizingVertical='HUG';}catch(e){}inst.name=sp.name;
    f.name=f.name+' · '+par.name;sec.appendChild(f);sw.push(bp+' '+Math.round(f.height)+'→'+Math.round(inst.height));
  }
  report.push([sp.name,set.id,sw.join(' | '),Object.keys(defs).length]);
  }catch(e){report.push([sp.name,'ERR '+String(e).slice(0,160)]);}
 }
 section.resizeWithoutConstraints(8000,Math.max(section.height,ry+rh+120));
 return report;
};
