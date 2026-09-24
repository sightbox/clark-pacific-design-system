const W={200:'ExtraLight',300:'Light',400:'Regular',500:'Medium',600:'SemiBold',700:'Bold'};
const PS={},TS={};
for(const s of await figma.getLocalPaintStylesAsync())PS[s.name]=s;
for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
const fonts=new Set();
const scan=n=>{if(n.t==='T'){fonts.add((n.ff||'Poppins')+'|'+fstyle(n.ff,n.fw,n.it));(n.runs||[]).forEach(r=>fonts.add((r[6]||n.ff||'Poppins')+'|'+fstyle(r[6]||n.ff,r[2],r[5])));}(n.k||[]).forEach(scan);};
function fstyle(ff,fw,it){if(ff==='Inter'){const m={400:'Regular',500:'Medium',600:'Semi Bold',300:'Light',700:'Bold'};const b=m[fw]||'Regular';return it?(b==='Regular'?'Italic':b+' Italic'):b;}const b=W[fw]||'Regular';return it?(b==='Regular'?'Italic':b+' Italic'):b;}
const hex=h=>{const[c,a]=h.slice(1).split('@');return{color:{r:parseInt(c.slice(0,2),16)/255,g:parseInt(c.slice(2,4),16)/255,b:parseInt(c.slice(4,6),16)/255},opacity:a===undefined?1:+a};};
const unbound=[];const TEXTPROPS=[];const SHOWPROPS=[];
async function paint(node,ref,kind){
  if(!ref){node[kind]=[];return;}
  if(ref[0]==='#'){const h=hex(ref);node[kind]=[{type:'SOLID',color:h.color,opacity:h.opacity}];unbound.push(ref);return;}
  const s=PS[ref];if(!s){unbound.push(ref);node[kind]=[];return;}
  if(kind==='fills')await node.setFillStyleIdAsync(s.id);else await node.setStrokeStyleIdAsync(s.id);
}
const AL={C:'CENTER',E:'MAX',SB:'SPACE_BETWEEN',B:'BASELINE'};
async function build(n,parent){
  let node;
  if(n.t==='T'){
    node=figma.createText();
    node.fontName={family:n.ff||'Poppins',style:fstyle(n.ff,n.fw,n.it)};
    node.characters=n.c;
    const WN={ExtraLight:200,Light:300,Regular:400,Medium:500,SemiBold:600,Bold:700};const tcv=n.tc==='U'?'UPPER':n.tc==='C'?'TITLE':n.tc==='L'?'LOWER':'ORIGINAL';
    let st=TS[n.s];if(st&&n.ff!=='Inter'&&!(Math.abs(st.fontSize-n.fs)<=2&&Math.abs((WN[st.fontName.style]||400)-(n.fw||400))<=100&&st.textCase===tcv))st=null; // off-scale text keeps raw values
    if(st)await node.setTextStyleIdAsync(st.id); // the style owns font, size, line height, spacing and case; overriding them here would detach it
    else{node.fontName={family:n.ff||'Poppins',style:fstyle(n.ff,n.fw,n.it)};
      node.fontSize=n.fs;
      node.lineHeight=n.lh?{unit:'PIXELS',value:n.lh}:{unit:'AUTO'};
      node.letterSpacing={unit:'PERCENT',value:n.ls||0};
      node.textCase=n.tc==='U'?'UPPER':n.tc==='C'?'TITLE':n.tc==='L'?'LOWER':'ORIGINAL';}
    if(n.ud)node.textDecoration='UNDERLINE';
    if(n.ta)node.textAlignHorizontal=n.ta==='C'?'CENTER':'RIGHT';
    await paint(node,n.col,'fills');
    for(const r of n.runs||[]){
      node.setRangeFontName(r[0],r[1],{family:r[6]||n.ff||'Poppins',style:fstyle(r[6]||n.ff,r[2],r[5])});
      if(r[4]&&r[4]!==n.fs)node.setRangeFontSize(r[0],r[1],r[4]);
      if(r[3]){if(r[3][0]==='#'){const h=hex(r[3]);node.setRangeFills(r[0],r[1],[{type:'SOLID',color:h.color,opacity:h.opacity}]);unbound.push(r[3]);}else if(PS[r[3]])await node.setRangeFillStyleIdAsync(r[0],r[1],PS[r[3]].id);}
    }
    node.name=n.pn||n.n||n.c.slice(0,40);
    if(n.pn)TEXTPROPS.push([node,n.pn]);
    parent.appendChild(node);
    if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
    if(n.sw==='HUG'){node.textAutoResize='WIDTH_AND_HEIGHT';}
    else{node.textAutoResize='HEIGHT';if(n.sw==='FILL'&&parent.layoutMode&&parent.layoutMode!=='NONE'&&!n.abs)node.layoutSizingHorizontal='FILL';else node.resize(Math.max(1,Math.ceil(n.w+1)),node.height);}
    if(n.sh==='FIXED'&&n.h&&!n.abs&&parent.layoutMode&&parent.layoutMode!=='NONE'){node.textAutoResize='NONE';node.resize(node.width,n.h);if(n.sw==='FILL')node.layoutSizingHorizontal='FILL';}
    return node;
  }
  if(n.t==='S'){
    try{node=figma.createNodeFromSvg(n.svg);}catch(e){node=figma.createFrame();unbound.push('svg-fail');}
    node.name=n.n||'Icon';parent.appendChild(node);
    if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
    node.resize(Math.max(0.01,n.w),Math.max(0.01,n.h));
    return node;
  }
  if(n.t==='I'){
    const svg=IMG&&IMG[n.src];
    if(svg){node=figma.createNodeFromSvg(svg);}else{node=figma.createFrame();node.fills=[];unbound.push('img:'+n.src);}
    node.name=n.n||(n.src||'Image').split('/').pop().replace(/\.svg$/,'');parent.appendChild(node);
    if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
    node.resize(Math.max(0.01,n.w),Math.max(0.01,n.h));
    return node;
  }
  if(n.t==='C'){
    const main=await figma.getNodeByIdAsync(n.comp);
    if(!main){unbound.push('missing comp '+n.comp);return null;}
    node=main.createInstance();parent.appendChild(node);
    if(n.props){const keys=Object.keys(node.componentProperties);const P={};for(const [k,v] of Object.entries(n.props)){const kk=keys.find(x=>x===k||x.split('#')[0]===k);if(kk)P[kk]=v;else unbound.push('noprop '+k);}
      try{node.setProperties(P);}catch(e){unbound.push('props '+n.name+': '+e.message.slice(0,60));}}
    if(n.nm)node.name=n.nm;
    if(n.show)SHOWPROPS.push([node,n.show]);
    if(n.icon){const s=n.w/24;if(Math.abs(s-1)>0.001)node.rescale(s);
      const st=n.col&&PS[n.col];
      for(const v of node.findAll(x=>x.type==='VECTOR'||x.type==='ELLIPSE'||x.type==='RECTANGLE'||x.type==='POLYGON'||x.type==='LINE')){
        if(st){if(v.strokes&&v.strokes.length)await v.setStrokeStyleIdAsync(st.id);if(v.fills&&v.fills.length)await v.setFillStyleIdAsync(st.id);}
        else if(n.col&&n.col[0]==='#'){const h=hex(n.col);if(v.strokes&&v.strokes.length)v.strokes=[{type:'SOLID',color:h.color,opacity:h.opacity}];if(v.fills&&v.fills.length)v.fills=[{type:'SOLID',color:h.color,opacity:h.opacity}];unbound.push(n.col);}
        if(n.stw&&v.strokes&&v.strokes.length)v.strokeWeight=n.stw*s;
      }
    } else if(n.t==='C'&&n.name==='Logo / Long'){node.rescale(n.h/node.height);}
    {const wFixed=node.layoutMode==='VERTICAL'?node.counterAxisSizingMode==='FIXED':node.layoutMode==='HORIZONTAL'?node.primaryAxisSizingMode==='FIXED':true;
     if(!n.icon&&n.name!=='Logo / Long'&&n.sw!=='FILL'&&wFixed&&Math.abs(node.width-n.w)>0.05)node.resize(n.w,node.height);}
    if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
    const inAL=parent.layoutMode&&parent.layoutMode!=='NONE'&&!n.abs;
    if(inAL&&n.sw==='FILL')node.layoutSizingHorizontal='FILL';
    return node;
  }
  if(n.t==='P'){
    node=figma.createVector();node.vectorPaths=[{windingRule:'NONZERO',data:n.d}];node.name=n.n||'Shape';
    parent.appendChild(node);await paint(node,n.f,'fills');node.strokes=[];
    if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
    return node;
  }
  if(n.t==='L'){
    const x0=Math.min(n.a[0],n.b[0]),y0=Math.min(n.a[1],n.b[1]);
    node=figma.createVector();node.vectorPaths=[{windingRule:'NONE',data:`M ${n.a[0]-x0} ${n.a[1]-y0} L ${n.b[0]-x0} ${n.b[1]-y0}`}];node.name=n.n||'Line';
    parent.appendChild(node);node.fills=[];await paint(node,n.col,'strokes');node.strokeWeight=n.sw;
    if(parent.layoutMode&&parent.layoutMode!=='NONE')node.layoutPositioning='ABSOLUTE';
    node.x=x0;node.y=y0;node.constraints={horizontal:'SCALE',vertical:'SCALE'};
    return node;
  }
  node=n.K?figma.createComponent():figma.createFrame();
  node.name=n.n||(n.l==='H'?'Row':n.l==='V'?'Stack':'Frame');
  node.fills=[];node.clipsContent=!!n.clip;
  if(n.l&&n.l!=='N'){
    node.layoutMode=n.l==='H'?'HORIZONTAL':'VERTICAL';
    if(n.wr){node.layoutWrap='WRAP';node.counterAxisSpacing=n.cg||0;}
    node.itemSpacing=n.pa==='SB'?0:(n.g||0);
    node.primaryAxisAlignItems=AL[n.pa]||'MIN';
    node.counterAxisAlignItems=n.ca==='B'?(n.l==='H'?'BASELINE':'MIN'):(AL[n.ca]||'MIN');
    const p=n.p||[0,0,0,0];node.paddingTop=p[0];node.paddingRight=p[1];node.paddingBottom=p[2];node.paddingLeft=p[3];
  }
  await paint(node,n.f,'fills');
  if(n.st){await paint(node,n.st.c,'strokes');const w=n.st.w;node.strokeAlign='INSIDE';
    if(w.every(v=>v===w[0]))node.strokeWeight=w[0];else{node.strokeTopWeight=w[0];node.strokeRightWeight=w[1];node.strokeBottomWeight=w[2];node.strokeLeftWeight=w[3];}}
  if(n.rad){if(n.rad.every(v=>v===n.rad[0]))node.cornerRadius=Math.min(n.rad[0],Math.min(n.w,n.h)/2);else{node.topLeftRadius=n.rad[0];node.topRightRadius=n.rad[1];node.bottomRightRadius=n.rad[2];node.bottomLeftRadius=n.rad[3];}}
  if(n.op!==undefined)node.opacity=n.op;
  parent.appendChild(node);
  node.resize(Math.max(0.01,n.w),Math.max(0.01,n.h));
  if(n.abs){node.layoutPositioning='ABSOLUTE';node.x=n.abs[0];node.y=n.abs[1];}
  if(n.rt){node.resize(Math.max(0.01,n.rw),Math.max(0.01,n.rh));if(parent.layoutMode&&parent.layoutMode!=='NONE')node.layoutPositioning='ABSOLUTE';node.relativeTransform=n.rt;}
  if(n.fx){const c=n.fx.c;node.effects=[{type:'DROP_SHADOW',color:{r:c[0]/255,g:c[1]/255,b:c[2]/255,a:c[3]},offset:{x:n.fx.x,y:n.fx.y},radius:n.fx.r,spread:n.fx.s,visible:true,blendMode:'NORMAL'}];}
  if(n.gr){const r=figma.createRectangle();r.name='Scrim';node.appendChild(r);if(node.layoutMode!=='NONE')r.layoutPositioning='ABSOLUTE';r.x=0;r.y=0;r.resize(Math.max(0.01,n.w),Math.max(0.01,n.h));r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};
    r.fills=[{type:'GRADIENT_LINEAR',gradientTransform:n.gr.tf,gradientStops:n.gr.stops.map(([p,c])=>({position:p,color:{r:c[0]/255,g:c[1]/255,b:c[2]/255,a:c[3]}}))}];}
  for(const k of n.k||[])await build(k,node);
  if(node.layoutMode!=='NONE'){
    if(n.sw==='HUG')node.layoutSizingHorizontal='HUG';
    if(n.sh==='HUG')node.layoutSizingVertical='HUG';
  }
  const inAL=parent.type!=='PAGE'&&parent.layoutMode&&parent.layoutMode!=='NONE'&&!n.abs;
  if(inAL){if(n.sw==='FILL')node.layoutSizingHorizontal='FILL';if(n.sh==='FILL')node.layoutSizingVertical='FILL';}
  return node;
}
