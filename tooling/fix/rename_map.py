import json
M={}
def seq(prefix,olds,start=1):
    return {o:f"{prefix} {i}" for i,o in enumerate(olds,start)}
# Split Content
m={'Placeholder Caption':'Photo caption','Placeholder Caption · 40/60 Image left · Desktop':'Photo caption','Placeholder Caption · 40/60 Image right · Desktop':'Photo caption','Placeholder Caption · Stacked list + photo · Desktop':'Photo caption',
 'Eyebrow Small':'Eyebrow','Eyebrow':'Eyebrow',
 'Button':'Link label','Button · 40/60 Image left · Desktop':'Link label','Button · 40/60 Image right · Desktop':'Link label','Eyebrow Small · Horizontal icon callout · Desktop':'Link label'}
for v in ['Image left 50/50','Image right 50/50','40/60 Image left','40/60 Image right','Horizontal icon callout']:
    m[f'Eyebrow · {v} · Mobile']='Link label'; m[f'Body · {v} · Mobile']='Body'
for v in ['40/60 Image left','40/60 Image right','Horizontal icon callout']: m[f'Body · {v} · Desktop']='Body'
m['Body']='Body'
for i in (1,2,3): m[f'Body {i}']=f'Bullet {i}'; m[f'Body {i} · Bulleted · Mobile']=f'Bullet {i}'; m[f'Card Title {i}']=f'Item {i} title'; m[f'Body Light {i}']=f'Item {i} body'; m[f'Eyebrow Small {i}']=f'Item {i} link'
for i in (1,2): m[f'Body {i} · Stacked list + photo · Mobile']=f'Item {i} body'
M['Split Content']=m
M['Quote Band']={'Eyebrow':'Name','Caption':'Attribution','Eyebrow · Mobile':'Name','Caption · Mobile':'Attribution'}
m={'Fine Print':'Column A eyebrow','Heading XS 1':'Column A title','Heading XS 2':'Column B title','Eyebrow Small 1':'Column A title','Eyebrow Small 2':'Column B title'}
for i in (1,2,3,4): m[f'Button {i}']=f'Row {i} label'; m[f'Body Light {2*i-1}']=f'Row {i} · Column A'; m[f'Body Light {2*i}']=f'Row {i} · Column B'
for i in (1,2): m[f'Label {i}']=f'Row {i} label'; m[f'Body Light {i} · Mobile']=f'Row {i} · Column A'; m[f'Body Small {i}']=f'Row {i} · Column B'
M['Comparison Table']=m
m={'Label 1':'Column 1 heading','Label 2':'Column 2 heading','Label 3':'Newsletter label','Caption 1':'Email placeholder','Caption 2':'Copyright',
 'Body Light':'Tagline','Eyebrow 1':'Column 1 heading','Eyebrow 2':'Column 2 heading','Eyebrow 3':'Column 3 heading','Eyebrow 4':'Newsletter heading','Body Small':'Email field','Meta 4':'Copyright','Meta 5':'Legal links'}
m.update(seq('Column 1 link',[f'Body Small {i}' for i in range(1,5)])); m.update(seq('Column 2 link',[f'Body Small {i}' for i in range(5,11)]))
m.update(seq('Legal link',[f'Caption {i}' for i in range(3,7)])); m.update(seq('Social',[f'Meta {i}' for i in (1,2,3)]))
M['Footer']=m
m={'Fine Print 6':'CTA label','Placeholder Caption':'Photo caption','Placeholder Caption · Desktop':'Photo caption'}
m.update(seq('Nav',[f'Fine Print {i}' for i in range(1,6)]))
groups=[('Fine Print 7',[1,2]),('Fine Print 8',[3,4,5,6]),('Fine Print 9',[7,8,9,10]),('Fine Print 10',[11,12,13])]
for g,(fp,caps) in enumerate(groups,1):
    m[fp]=f'Products menu · Group {g}'
    for j,c in enumerate(caps,1): m[f'Caption {c}']=f'Products menu · Group {g} · Link {j}'
agroups=[('Fine Print 7 · Desktop',[1,2,3,4]),('Fine Print 8 · Desktop',[5,6,7]),('Fine Print 9 · Desktop',[8,9,10])]
for g,(fp,caps) in enumerate(agroups,1):
    m[fp]=f'Approach menu · Group {g}'
    for j,c in enumerate(caps,1): m[f'Caption {c} · Desktop']=f'Approach menu · Group {g} · Link {j}'
m.update(seq('Mobile nav',[f'Card Title {i}' for i in (1,2,3,4)]))
m.update({'Eyebrow Small 1':'Mobile products · Group 1','Body 1':'Mobile products · Group 1 · Link 1','Body 2':'Mobile products · Group 1 · Link 2','Body 3':'Mobile products · Group 1 · Link 3','Eyebrow Small 2':'Mobile products · Group 2','Body 4':'Mobile products · Group 2 · Link 1'})
M['Header']=m
m={'Placeholder Caption':'Photo caption','Placeholder Caption · Desktop':'Photo caption','Placeholder Caption · Mobile':'Photo caption','Meta 1':'Announcement message','Meta 2':'Announcement link','Label 6':'CTA label',
 'Eyebrow Small 1':'Eyebrow','Label · Mobile':'Eyebrow','Eyebrow Small':'Eyebrow','Label · Index · Mobile':'Eyebrow','Eyebrow Small 1 · Desktop':'Eyebrow','Label · Editorial · Mobile':'Eyebrow',
 'Body':'Body','Body · Desktop':'Body','Body · Mobile':'Body','Body · Index':'Body','Body · Homepage · Mobile':'Body',
 'Eyebrow Small 2':'Button 1 label','Eyebrow Small 3':'Button 2 label','Label':'Breadcrumb trail','Eyebrow Small 2 · Desktop':'Date','Eyebrow Small 3 · Desktop':'Author','Eyebrow Small 4':'Read time','Caption':'Meta line'}
m.update(seq('Nav',[f'Label {i}' for i in range(1,6)])); m.update(seq('Breadcrumb',[f'Caption {i}' for i in (1,2,3)]))
M['Hero']=m
m={'Label':'Eyebrow','Body':'Body','Button 1':'Button 1 label','Button 2':'Button 2 label','Placeholder Caption':'Photo caption',
 'Eyebrow Small 1':'Button 1 label','Eyebrow Small 2':'Button 2 label','Eyebrow Small 3':'Button 2 label',
 'Eyebrow Small 1 · Photo overlay · Align left · Desktop':'Eyebrow','Eyebrow Small 2 · Photo overlay · Align left · Desktop':'Button 1 label',
 'Eyebrow Small 2 · Photo overlay · Align center · Desktop':'Button 2 label','Eyebrow Small 1 · Photo overlay · Align right · Desktop':'Button 1 label','Eyebrow Small 2 · Photo overlay · Align right · Desktop':'Button 2 label'}
for v in ['Dark Charcoal · Content left','White · Content left','BG Alt · Content right','Dark Charcoal · Content right']:
    m[f'Label · {v} · Desktop']='Eyebrow'; m[f'Body · {v} · Desktop']='Body'; m[f'Button 1 · {v} · Desktop']='Button 1 label'; m[f'Button 2 · {v} · Desktop']='Button 2 label'; m[f'Placeholder Caption · {v} · Desktop']='Photo caption'
for v in ['Light · Centered · two buttons','Light · Centered · single button','Photo overlay · Align left','Photo overlay · Align center','Photo overlay · Align right']: m[f'Body · {v} · Desktop']='Body'
for v in ['Blue','Dark Charcoal','Light']: m[f'Body · {v} · Stacked · Mobile']='Body'
M['CTA Banner']=m
M['Related Content Row']={'Eyebrow Small':'Link label'}
m={'Body Small':'Search placeholder'}; m.update(seq('Filter',[f'Label {i}' for i in (1,2,3,4)])); m.update(seq('Filter chip',[f'Eyebrow Small {i}' for i in (1,2,3,4)]))
M['Filterable Index Grid']=m
M['Featured Resources']={'Eyebrow Small':'Eyebrow','Button':'Button label'}
M['Projects Photo Mosaic']={'Placeholder Caption 1':'Tile 1 photo caption','Placeholder Caption 2':'Tile 2 photo caption','Placeholder Caption 3':'Tile 3 photo caption','Eyebrow Small 1':'Tile 1 label','Eyebrow Small 2':'Tile 2 label','Eyebrow Small 3':'Tile 3 label','Eyebrow Small 3 · Mobile':'Tile 3 label','Eyebrow Small 4':'Button label'}
M['Image Gallery']={'Label':'Project name','Placeholder Caption':'Photo caption','Body Light':'Caption','Caption':'Caption'}
M['Leadership Grid']={'Label':'Eyebrow','Body Light':'Body'}
m={}
for i in range(1,7): m[f'Heading XS {i}']=f'Value {i} title'; m[f'Body Light {i}']=f'Value {i} body'
for i in (1,2): m[f'Heading XS {i} · Mobile']=f'Value {i} title'; m[f'Body Light {i} · Mobile']=f'Value {i} body'
M['Core Values']=m
m={}
for i in range(1,6): m[f'Fine Print {i}']=f'Milestone {i} label'; m[f'Card Title {i}']=f'Milestone {i} title'; m[f'Body Small {i}']=f'Milestone {i} body'
for i in (1,2,3): m[f'Body {i}']=f'Milestone {i} body'
M['Timeline']=m
m={}
for i in range(1,7): m[f'Card Title {i}']=f'Benefit {i} title'; m[f'Body Light {i}']=f'Benefit {i} body'
for i in (1,2,3): m[f'Body {2*i-1}']=f'Benefit {i} title'; m[f'Body {2*i}']=f'Benefit {i} body'
M['Benefits Grid']=m
M['CARBONSHIELD®']={'Placeholder Caption':'Photo caption','Label':'Eyebrow','Body 1':'Body 1','Body 2':'Body 2','Button':'Button label','Label · Mobile':'Eyebrow','Body':'Body 1','Eyebrow':'Button label'}
M['Finishes Guide · Graphic CTA']={'Placeholder Caption 1':'Cover caption','Placeholder Caption 2':'Swatch 1 caption','Placeholder Caption 3':'Swatch 2 caption','Placeholder Caption 4':'Swatch 3 caption','Placeholder Caption 5':'Swatch 4 caption','Eyebrow':'Eyebrow','Body':'Body','Button 1':'Button 1 label','Button 2':'Button 2 label','Eyebrow Small':'Eyebrow'}
m={'Lead':'Intro','Body':'Body','Eyebrow':'Materials eyebrow','Lead · Mobile':'Intro','Card Title':'Material 1 title'}
for i in (1,2,3): m[f'Placeholder Caption {i}']=f'Material {i} photo caption'; m[f'Card Title {i}']=f'Material {i} title'; m[f'Body Small {i}']=f'Material {i} body'
M['System Overview + Materials']=m
m={'Placeholder Caption':'Photo caption','Eyebrow':'Project types eyebrow','Eyebrow · Mobile':'Benefits eyebrow','Body 1':'Benefit 1','Body 2':'Benefit 2'}
for i in range(1,6): m[f'Eyebrow Small {i}']=f'Spec {i} label'; m[f'Body Light {i}']=f'Spec {i} value'
for i,o in enumerate([6,7,8],1): m[f'Body Light {o}']=f'Project type {i} title'; m[f'Body Small {i}']=f'Project type {i} body'
for i in (1,2,3): m[f'Label {i}']=f'Spec {i} label'; m[f'Body Light {i} · Mobile']=f'Spec {i} value'
M['Assembly + Specifications']=m
m={'Eyebrow Small':'Meta','Placeholder Caption 1':'Photo caption','Placeholder Caption 2':'Timecode','Body':'Body','Placeholder Caption':'Timecode','Eyebrow Small 1':'Eyebrow','Body · Video left · Desktop':'Body','Eyebrow Small 2':'Link label','Body · Video right · Desktop':'Body','Placeholder Caption · Video right · Desktop':'Timecode',
 'Placeholder Caption 1 · Carousel · Desktop':'Slide 1 timecode','Placeholder Caption 2 · Carousel · Desktop':'Slide 2 timecode','Placeholder Caption 3':'Slide 3 timecode','Card Title':'Slide title','Body Light':'Slide body','Label':'Eyebrow'}
for v in ['Full width','Video left','Video right','Carousel']: m[f'Body · {v} · Mobile']='Body'
M['Video Module']=m
m={'Body':'Intro','Label 1':'Office name','Body Small 1':'Office address','Label 2':'Phone label','Body Small 2':'Phone number','Label 3':'Inquiry type 1','Label 4':'Inquiry type 2','Label 5':'Inquiry type 3',
 'Body Small 3':'Field · First name','Body Small 4':'Field · Last name','Body Small 5':'Field · Company','Body Small 6':'Field · Title / role','Body Small 7':'Field · Email','Body Small 8':'Field · Phone','Body Small 9':'Field · Message','Fine Print':'Consent text',
 'Body · Newsletter · Desktop':'Intro','Body Small 1 · Newsletter · Desktop':'Field · First name','Body Small 2 · Newsletter · Desktop':'Field · Last name','Body Small 3 · Newsletter · Desktop':'Field · Email','Fine Print · Newsletter · Desktop':'Consent text',
 'Label 1 · Contact · Mobile':'Field · Full name','Label 2 · Contact · Mobile':'Field · Email','Label 3 · Contact · Mobile':'Field · Project type','Body Small':'Select placeholder','Label 4 · Contact · Mobile':'Field · Message'}
M['Form']=m
json.dump(M,open('rename_map.json','w'),ensure_ascii=False)
print({k:len(v) for k,v in M.items()}, len(json.dumps(M,ensure_ascii=False)))
