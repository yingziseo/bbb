"""Group visually similar products under user-approved shared photographs.

Sizes, capacities and packing remain per product. References are original photos;
AI restoration is performed separately with the built-in image generation tool.
"""
from pathlib import Path
from collections import defaultdict
import json, math
from PIL import Image, ImageDraw, ImageFont

BASE=Path(__file__).resolve().parent
SOURCE=BASE.parent/'20260930-铝箔包装产品资料'
CATALOG=json.loads((SOURCE/'catalog.json').read_text())

def visual_key(p):
    shape,finish=p['shape'],p['finish'].lower()
    top=p.get('topDimensionsMm') or []
    height=p.get('heightMm') or 0
    depth=height/top[-1] if top else 0
    aspect=top[0]/top[-1] if len(top)>1 else 1
    prefix=finish+'-'
    if shape in ['household','foodservice']:return 'silver-bare-foil-rolls'
    if shape in ['hookah-roll','hookah-sheets']:return prefix+shape
    if finish=='gold':
        if shape=='square':return prefix+'square-'+('shallow' if depth<=.30 else 'deep')
        if shape=='rectangular':
            return prefix+'rectangular-'+('narrow' if aspect>=2.2 else 'shallow' if depth<=.36 else 'deep')
        if shape=='round':
            if p['model'] in ['128-450','195-1200']:return prefix+'round-smooth'
            if p['model']=='120-300':return prefix+'round-hemispherical'
            if p['model']=='160-600' or p['model'].startswith('270-'):return prefix+'round-flared'
            return prefix+'round-fluted-'+('shallow' if depth<=.34 else 'medium' if depth<=.40 else 'deep')
    if finish=='silver':
        if shape=='rectangular':
            profile='narrow' if aspect>=2.2 else 'elongated' if aspect>=1.65 else 'standard'
            limit={'narrow':.47,'elongated':.40,'standard':.29}[profile]
            return prefix+'rectangular-'+profile+'-'+('shallow' if depth<=limit else 'deep')
        if shape=='oval':return prefix+'oval-'+('plate' if depth<=.12 else 'bowl')
        if shape=='pot':
            return prefix+'pot-'+('closed' if '338' in p['model'] else 'wide' if '390' in p['model'] else 'open')
        if shape in ['round-cup','round-bowl']:
            return prefix+'round-fluted-'+('shallow' if depth<=.28 else 'medium' if depth<=.39 else 'deep')
    return prefix+shape

groups=defaultdict(list)
for p in CATALOG['products']:groups[visual_key(p)].append(p)
# Representative choices preserve the clearly visible construction of each family.
preferred={
    'silver-bare-foil-rolls':'aluminum-foil-household',
    'gold-round-flared':'aluminum-foil-gold-270-3100',
    'gold-round-fluted-shallow':'aluminum-foil-gold-250-2500',
    'gold-round-fluted-medium':'aluminum-foil-gold-140-620',
    'gold-round-fluted-deep':'aluminum-foil-gold-180-1370',
    'gold-rectangular-shallow':'aluminum-foil-gold-184-750',
    'gold-rectangular-deep':'aluminum-foil-gold-221-1800',
    'silver-rectangular-standard-deep':'aluminum-foil-silver-185-1813',
    'silver-rectangular-standard-shallow':'aluminum-foil-silver-315',
    'silver-rectangular-elongated-deep':'aluminum-foil-silver-205-2011',
    'silver-rectangular-elongated-shallow':'aluminum-foil-silver-l-l-2514',
    'silver-round-fluted-medium':'aluminum-foil-silver-y120',
    'silver-round-fluted-deep':'aluminum-foil-silver-clam-bowl',
    'silver-round-plate':'aluminum-foil-silver-8-inch-plate',
    'silver-oval-plate':'aluminum-foil-silver-l-l-428',
}
records=[]
for key,products in groups.items():
    representative=next((p for p in products if p['slug']==preferred.get(key)),products[0])
    records.append({'visualKey':key,'representativeSlug':representative['slug'],
                    'representativeName':representative['name'],'sourceMain':str((SOURCE/representative['assets']['main']).resolve()),
                    'finish':representative['finish'],'shape':representative['shape'],
                    'products':[{'slug':p['slug'],'model':p['model'],'dimensions':p['dimensions'],'capacityMl':p['capacityMl']} for p in products],
                    'basis':'Same visible construction and broad proportions; sizes and packing annotated separately. Distinct colors, shapes, profiles, lids, handles and compartments separated.',
                    'status':'pending'})
BASE.joinpath('references').mkdir(exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/dejavu/DejaVuSans.ttf',22)
batches=[]
for start in range(0,len(records),4):
    subset=records[start:start+4];ref=Image.new('RGB',(1280,1280),'white');draw=ImageDraw.Draw(ref)
    for i,g in enumerate(subset):
        photo=Image.open(g['sourceMain']).convert('RGB');photo.thumbnail((630,550))
        x=(i%2)*640;y=(i//2)*640
        ref.paste(photo,(x+(640-photo.width)//2,y+65+(535-photo.height)//2))
        draw.text((x+20,y+18),str(i+1)+' '+g['visualKey'],font=font,fill='#333333')
    draw.line([(640,0),(640,1280)],fill='#dddddd',width=1)
    draw.line([(0,640),(1280,640)],fill='#dddddd',width=1)
    path=BASE/'references'/f'visual-{start//4+1:02d}.png';ref.save(path)
    batches.append({'batch':start//4+1,'grid':[2,2],'reference':str(path.resolve()),
                    'visualKeys':[g['visualKey'] for g in subset],'status':'pending'})
plan={'date':'2026-09-30','status':'visually-grouped',
       'authorization':'User approved shared restored main photograph for products with the same appearance but different sizes; distinctly different construction gets a separate restoration.',
       'strategy':'AI restore one representative per visual family; crop batch sheets; reuse the image in per-model English specification graphics.',
       'productCount':121,'uniqueVisualFamilies':len(records),'avoidedDuplicateRestorations':121-len(records),
       'pdfScope':'Source of images and data only; no PDF editing or restoration in this batch.',
       'groups':records,'batches':batches}
BASE.joinpath('generation-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
lines=['# 外观去重与修复映射','','尺寸或容量不同但外观接近的产品共用修复主图；每款规格图保留独立参数。','',
       f'121 款产品分为 {len(records)} 组外观，减少 {121-len(records)} 次重复修复。','',
       '| 外观组 | 代表型号 | 共用产品数 | 对应型号 |','| --- | --- | ---: | --- |']
for g in records:lines.append('| '+g['visualKey']+' | '+g['representativeName']+' | '+str(len(g['products']))+' | '+', '.join(p['model'] for p in g['products'])+' |')
BASE.joinpath('外观去重映射.md').write_text('\n'.join(lines)+'\n')
print(f'121 products grouped into {len(records)} visual families, {len(batches)} AI batches; {121-len(records)} duplicate restorations avoided.')
