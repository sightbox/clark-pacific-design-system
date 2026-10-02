// 2.5 mobile helpers: add a Breakpoint=Mobile variant to each 2.5 component. Stored as sharedPluginData('a25','mob').
// Load: const M=await (eval('('+figma.root.getSharedPluginData('a25','mob')+')'))(figma);
async function A25MOB(figma){
  const L=await (eval('('+figma.root.getSharedPluginData('a25','lib')+')'))(figma,{page:'02 · Components'});
  const pg=figma.root.children.find(p=>p.name==='02 · Components');if(figma.currentPage!==pg)await figma.setCurrentPageAsync(pg);
  const W={200:'ExtraLight',300:'Light',400:'Regular',500:'Medium',600:'SemiBold'};
  async function fontsFor(PLAN){const s=new Set(['Inter|Regular','Inter|Semi Bold']);(function w(n){if(n.t==='T'&&n.ff){s.add(n.ff+'|'+(n.ff==='Inter'?(n.fw>=600?'Semi Bold':'Regular'):W[n.fw]||'Regular'));for(const r of n.runs||[])s.add((r[6]||n.ff)+'|'+(W[r[2]]||'Regular'));}(n.k||[]).forEach(w);})(PLAN);
    for(const f of s){const [family,style]=f.split('|');try{await figma.loadFontAsync({family,style});}catch(e){}}
    for(const st of Object.values(L.TS))await figma.loadFontAsync(st.fontName);}
  const find=name=>pg.findOne(n=>(n.type==='COMPONENT_SET'||n.type==='COMPONENT')&&n.name===name&&n.parent&&n.parent.type==='SECTION');
  const texts=n=>n.findAllWithCriteria({types:['TEXT']});
  const inInst=(n,root)=>{let p=n.parent;while(p&&p!==root){if(p.type==='INSTANCE')return true;p=p.parent;}return false;};
  const keyed=v=>{const m=new Map(),seen={};for(const t of texts(v)){if(inInst(t,v))continue;const c=t.characters;seen[c]=(seen[c]||0)+1;m.set(c+'#'+seen[c],t);}return m;};
  async function buildMobile(PLAN,host){await fontsFor(PLAN);const node=await L.build(PLAN,host);return figma.createComponentFromNode(node);}
  // Bind mobile texts to the set's TEXT properties by matching content (same string + occurrence) with a reference variant.
  function bindProps(set,mobs,ref){const defs=set.componentPropertyDefinitions;const rk=keyed(ref);const byKey={};
    for(const [k,t] of rk){const r=t.componentPropertyReferences;if(r&&r.characters)byKey[r.characters]=k;}
    let n=0,miss=[];for(const m of mobs){const mk=keyed(m);for(const [prop,ck] of Object.entries(byKey)){const t=mk.get(ck);if(t){t.componentPropertyReferences={...(t.componentPropertyReferences||{}),characters:prop};n++;}else miss.push(ck.split('#')[0].slice(0,30));}}
    return {bound:n,miss:[...new Set(miss)]};}
  async function expose(m){let k=0;for(const i of m.findAllWithCriteria({types:['INSTANCE']})){if(inInst(i,m))continue;const mc=await i.getMainComponentAsync();const nm=mc&&(mc.parent&&mc.parent.type==='COMPONENT_SET'?mc.parent.name:mc.name);if(nm&&/^(Button|Text Link)/.test(nm)){i.isExposedInstance=true;k++;}}return k;}
  // Desktop variants in a column on the left, mobile variants in a column on the right.
  function layoutSet(set){set.layoutMode='NONE';const d=set.children.filter(v=>/Breakpoint=Desktop/.test(v.name)),m=set.children.filter(v=>/Breakpoint=Mobile/.test(v.name));
    let y=40,w=0;for(const v of d){v.x=40;v.y=y;y+=v.height+80;w=Math.max(w,v.width);}const hd=y;
    let y2=40,w2=0;for(const v of m){v.x=40+w+160;v.y=y2;y2+=v.height+80;w2=Math.max(w2,v.width);}
    set.resizeWithoutConstraints(40+w+160+w2+40,Math.max(hd,y2)-40);}
  // Plain component -> set with Breakpoint=Desktop | Mobile.
  async function addPlain(PLAN,name){
    const C=find(name);if(!C)throw new Error('not found '+name);if(C.type!=='COMPONENT')throw new Error(name+' is already a set');
    const host=C.parent,x=C.x,y=C.y,idx=host.children.indexOf(C),desc=C.description;
    const mob=await buildMobile(PLAN,host);mob.name='Breakpoint=Mobile';
    const props=Object.entries(C.componentPropertyDefinitions).map(([k,d])=>[k.split('#')[0],d.type]);
    C.name='Breakpoint=Desktop';
    const set=figma.combineAsVariants([C,mob],host,idx);set.name=name;set.description=desc;C.description='';
    layoutSet(set);set.x=x;set.y=y;
    const b=bindProps(set,[mob],C);const ex=await expose(mob);
    return {name,set:set.id,mob:mob.id,h:Math.round(mob.height),propsBefore:props.length,propsAfter:Object.keys(set.componentPropertyDefinitions).length,...b,exposed:ex};
  }
  // Existing set (state variants): add ', Breakpoint=Desktop' to every variant, then add mobile variants built by
  // mutate(mobileClone, combo) for each existing combo (default combo = the plan as built).
  async function addToSet(PLAN,name,mutate,wire){
    const S=find(name);if(!S||S.type!=='COMPONENT_SET')throw new Error('no set '+name);
    const host=S.parent,base=await buildMobile(PLAN,host);
    const combos=S.children.map(v=>Object.fromEntries(v.name.split(', ').map(s=>s.split('='))));
    const mobs=[];
    for(let i=0;i<combos.length;i++){const m=i===0?base:base.clone();if(i)host.appendChild(m);await mutate(m,combos[i]);mobs.push(m);}
    const fmt=c=>Object.entries(c).map(([k,v])=>k+'='+v).join(', ');
    S.children.forEach((v,i)=>{v.name=fmt({...combos[i],Breakpoint:'Desktop'});});
    for(let i=0;i<mobs.length;i++){mobs[i].name=fmt({...combos[i],Breakpoint:'Mobile'});S.appendChild(mobs[i]);}
    const get=c=>S.children.find(v=>v.name===fmt(c));
    if(wire)for(let i=0;i<mobs.length;i++)await wire(mobs[i],{...combos[i],Breakpoint:'Mobile'},get);
    layoutSet(S);
    // bind text props per state: reference = the desktop variant with the same combo
    let bound=0,miss=[];for(let i=0;i<mobs.length;i++){const r=bindProps(S,[mobs[i]],get({...combos[i],Breakpoint:'Desktop'}));bound+=r.bound;miss.push(...r.miss);}
    let ex=0;for(const m of mobs)ex+=await expose(m);
    return {name,mobiles:mobs.length,bound,miss:[...new Set(miss)].slice(0,8),exposed:ex};
  }
  async function click(node,dest,dur){await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:dest.id,navigation:'CHANGE_TO',transition:{type:'SMART_ANIMATE',easing:{type:'EASE_OUT'},duration:dur||0.3},preserveScrollPosition:false}]}]);}
  // 2.0 sets: build a variant from PLAN and put it in set `setName` as `name`, replacing an existing variant of that name
  // (only if the old one has no instances). Returns {c, old, instances}.
  async function buildVariant(PLAN,setName,name){
    const S=find(setName);if(!S||S.type!=='COMPONENT_SET')throw new Error('no set '+setName);
    const old=S.children.find(v=>v.name===name);let inst=0;if(old){inst=(await old.getInstancesAsync()).length;}
    const c=await buildMobile(PLAN,S.parent);c.name=old?name+' (new)':name;S.appendChild(c);
    if(old&&!inst){old.remove();c.name=name;}
    return {c,set:S,oldKept:!!(old&&inst),instances:inst};
  }
  return {L,pg,find,buildVariant,texts,keyed,buildMobile,bindProps,expose,layoutSet,addPlain,addToSet,click,fontsFor};
}
