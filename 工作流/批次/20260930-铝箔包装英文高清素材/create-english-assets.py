"""Crop user-approved AI grids and reuse photographs in English spec artwork.

Pillow performs only the explicitly requested cutting, layout and exact text/arrow
composition. Product restoration itself is performed by built-in image_gen.
PDF documents and application code are not changed by this script.
"""
from pathlib import Path
import hashlib, html, json, math, re, sys
from PIL import Image, ImageChops, ImageDraw, ImageFont

BASE=Path(__file__).resolve().parent
SOURCE=BASE.parent/'20260930-铝箔包装产品资料'
PLAN=json.loads((BASE/'generation-plan.json').read_text())
CATALOG=json.loads((SOURCE/'catalog.json').read_text())
PRODUCTS=CATALOG['products']
INK='#171717'; MUTED='#737373'; LINE='#dedede'
FONT_DIR=Path('/usr/share/fonts/dejavu')
OUTPUT=BASE/'images'
for folder in ['cropped','main','specification','category','review']:(OUTPUT/folder).mkdir(parents=True,exist_ok=True)
manifest=[]; rendered={}; photos={}; product_map={}
REUSE_MAIN='--reuse-main' in sys.argv
previous_assets=json.loads((BASE/'asset-manifest.json').read_text()) if REUSE_MAIN and (BASE/'asset-manifest.json').exists() else []

def font(size,bold=False):
    return ImageFont.truetype(str(FONT_DIR/('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size)

def text(draw,xy,value,size=28,bold=False,fill=INK,anchor=None,slug=None):
    value=str(value)
    assert not re.search(r'[\u3400-\u9fff]',value),value
    draw.text(xy,value,font=font(size,bold),fill=fill,anchor=anchor)
    if slug:rendered.setdefault(slug,[]).append(value)

def wrap(draw,xy,value,width,size=30,bold=False,fill=INK,leading=1.3,slug=None):
    words=str(value).split();line='';y=xy[1]
    for word in words:
        candidate=(line+' '+word).strip()
        if line and draw.textlength(candidate,font=font(size,bold))>width:
            text(draw,(xy[0],y),line,size,bold,fill,slug=slug);y+=int(size*leading);line=word
        else:line=candidate
    if line:text(draw,(xy[0],y),line,size,bold,fill,slug=slug);y+=int(size*leading)
    return y

def fit_photo(image,box,canvas):
    photo=image.copy();photo.thumbnail((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS)
    x=box[0]+(box[2]-box[0]-photo.width)//2;y=box[1]+(box[3]-box[1]-photo.height)//2
    canvas.paste(photo,(x,y));return x,y,x+photo.width,y+photo.height

def save_asset(image,path,kind,**metadata):
    image.save(path,format='WEBP',lossless=True,method=4)
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    public='/uploads/aluminum-foil-en-20260930/'+path.stem+'-'+digest[:10]+'.webp'
    asset={'path':str(path.relative_to(BASE)),'kind':kind,'width':image.width,'height':image.height,
           'sha256':digest,'bytes':path.stat().st_size,'publicPath':public,**metadata}
    manifest.append(asset);return public

def numbers(values):return ' × '.join(f'{v:g}' for v in values)

def arrow(draw,start,end):
    draw.line([start,end],fill=INK,width=2)
    angle=math.atan2(end[1]-start[1],end[0]-start[0])
    for point,direction in [(start,angle),(end,angle+math.pi)]:
        a=(point[0]+11*math.cos(direction+.4),point[1]+11*math.sin(direction+.4))
        b=(point[0]+11*math.cos(direction-.4),point[1]+11*math.sin(direction-.4))
        draw.polygon([point,a,b],fill=INK)

def dimension_diagram(draw,p):
    top=p.get('topDimensionsMm') or []
    if not top:return
    slug=p['slug'];diameter=p.get('topDimensionsType')=='diameter';single=len(top)==1
    x,y=190,924;w=240
    h=180 if single else round(180*min(top)/max(top))
    w=180 if single else round(180*top[0]/max(top))
    if p['shape']=='heart':
        pts=[]
        for i in range(181):
            t=2*math.pi*i/180
            px=16*math.sin(t)**3;py=13*math.cos(t)-5*math.cos(2*t)-2*math.cos(3*t)-math.cos(4*t)
            pts.append((x+w*(px+16)/32,y+h*(17-py)/34))
        draw.line(pts+[pts[0]],fill=INK,width=3)
    elif diameter or p['shape'] in ['oval','oval-cup']:
        draw.ellipse((x,y,x+w,y+h),outline=INK,width=3)
    else:
        draw.rounded_rectangle((x,y,x+w,y+h),radius=14,outline=INK,width=3)
        if p['shape']=='two-compartment':draw.line([(x+w/2,y),(x+w/2,y+h)],fill=INK,width=2)
        elif p['shape']=='three-compartment':
            draw.line([(x,y+h/2),(x+w,y+h/2)],fill=INK,width=2)
            draw.line([(x+w/2,y+h/2),(x+w/2,y+h)],fill=INK,width=2)
    arrow(draw,(x,y-27),(x+w,y-27))
    label=('D ' if diameter else 'L ')+f'{top[0]:g} mm'
    text(draw,(x+w/2,y-60),label,28,anchor='mm',slug=slug)
    if not single:
        arrow(draw,(x+w+28,y),(x+w+28,y+h))
        text(draw,(x+w+48,y+h/2),f'W {top[1]:g} mm',27,anchor='lm',slug=slug)
    height=p.get('heightMm')
    if height is not None:
        sx,sy=720,945;sw=190;sh=min(132,max(40,sw*height/top[0]))
        bottom=p.get('bottomDimensionsMm')
        bw=sw*min(1,bottom[0]/top[0]) if bottom else sw*.84
        draw.line([(sx,sy),(sx+sw,sy),(sx+(sw+bw)/2,sy+sh),(sx+(sw-bw)/2,sy+sh),(sx,sy)],fill=INK,width=3)
        arrow(draw,(sx+sw+30,sy),(sx+sw+30,sy+sh))
        text(draw,(sx+sw+48,sy+sh/2),f'H {height:g} mm',27,anchor='lm',slug=slug)

for batch in PLAN['batches']:
    assert batch['status']=='generated-reviewed',batch['batch']
    source=BASE/batch['generatedGrid'];assert hashlib.sha256(source.read_bytes()).hexdigest()==batch['sha256']
    grid=Image.open(source).convert('RGB');cw=grid.width/2;ch=grid.height/2
    for i,key in enumerate(batch['visualKeys']):
        cell=grid.crop((round(i%2*cw),round(i//2*ch),round((i%2+1)*cw),round((i//2+1)*ch)))
        mask=ImageChops.difference(cell,Image.new('RGB',cell.size,'white')).convert('L').point(lambda p:255 if p>15 else 0)
        bounds=mask.getbbox();assert bounds,key
        bounds=(max(0,bounds[0]-14),max(0,bounds[1]-14),min(cell.width,bounds[2]+14),min(cell.height,bounds[3]+14))
        crop=cell.crop(bounds);photos[key]=crop
        crop.save(OUTPUT/'cropped'/f'{key}.png')
        canvas=Image.new('RGB',(1280,960),'white')
        scaled=crop.copy();scaled.thumbnail((1080,720),Image.Resampling.LANCZOS)
        # Upsizing only standardizes layout; generation provides the new material detail.
        scale=min(1080/crop.width,720/crop.height)
        scaled=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS)
        fit_photo(scaled,(100,100,1180,860),canvas)
        if REUSE_MAIN:
            asset=next((a for a in previous_assets if a.get('visualKey')==key and a['kind']=='main'),None)
            if asset is None:
                path=OUTPUT/'main'/f'{key}.webp'
                digest=hashlib.sha256(path.read_bytes()).hexdigest()
                asset={'path':str(path.relative_to(BASE)),'kind':'main','width':1280,'height':960,
                       'sha256':digest,'bytes':path.stat().st_size,
                       'publicPath':'/uploads/aluminum-foil-en-20260930/'+path.stem+'-'+digest[:10]+'.webp',
                       'visualKey':key,'nativeSourcePixels':list(cell.size),'subjectPixels':list(crop.size),
                       'generationBatch':batch['batch']}
            manifest.append(asset);public=asset['publicPath']
        else:
            public=save_asset(canvas,OUTPUT/'main'/f'{key}.webp','main',visualKey=key,
                              nativeSourcePixels=list(cell.size),subjectPixels=list(crop.size),generationBatch=batch['batch'])
        for group in PLAN['groups']:
            if group['visualKey']==key:
                group.update(status='restored-cropped',mainPublicPath=public,mainAsset=f'images/main/{key}.webp')
                for product in group['products']:product_map[product['slug']]=group

def summary_row(draw,x,y,label,value,p,size=38):
    text(draw,(x,y),label,23,fill=MUTED,slug=p['slug'])
    if label in ['LENGTH × WIDTH × HEIGHT','LENGTH × HEIGHT','DIAMETER × HEIGHT','BASE DIMENSIONS','CARTON SIZE']:
        length=draw.textlength(str(value),font=font(size,True))
        if length>400:size=max(25,math.floor(size*395/length))
    return wrap(draw,(x,y+36),value,400,size,True,leading=1.28,slug=p['slug'])+34

def container_sheet(p):
    slug=p['slug'];key=product_map[slug]['visualKey'];canvas=Image.new('RGB',(1600,1200),'white');draw=ImageDraw.Draw(canvas)
    text(draw,(80,62),'ALUMINUM FOIL PACKAGING',25,fill=MUTED,slug=slug)
    model=next(s['value'] for s in p['websiteDraft']['specs'] if s['label']=='Catalogue model')
    model={'两格':'2-Compartment','煲仔盖·花甲盖':'Round Bowl Lid'}.get(model,model)
    text(draw,(80,103),model,64,True,slug=slug)
    descriptor=next(s['value'] for s in p['websiteDraft']['specs'] if s['label']=='Product type')
    text(draw,(80,191),p['finish']+' / '+descriptor,32,fill=MUTED,slug=slug)
    draw.line([(80,260),(1520,260)],fill=LINE,width=2)
    crop=photos[key];scale=min(850/crop.width,540/crop.height)
    photo=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS)
    fit_photo(photo,(80,300,1070,820),canvas)
    x,y=1120,306
    if p['capacityMl'] is not None:y=summary_row(draw,x,y,'CAPACITY',f"{p['capacityMl']:g} ml",p,54)
    top=p.get('topDimensionsMm') or []
    if top:
        label='DIAMETER' if p.get('topDimensionsType')=='diameter' else 'LENGTH' if len(top)==1 else 'LENGTH × WIDTH'
        if p.get('heightMm') is not None:label+=' × HEIGHT'
        y=summary_row(draw,x,y,label,p['dimensions'],p,38)
    y=summary_row(draw,x,y,'PACKING',p['websiteDraft']['packaging'],p,33)
    if p.get('bottomDimensions'):
        y=summary_row(draw,x,y,'BASE DIMENSIONS',p['bottomDimensions'],p,30)
    if p.get('cartonDimensions'):
        y=summary_row(draw,x,y,'CARTON SIZE',p['cartonDimensions'],p,29)
    assert y<1130,(slug,y)
    dimension_diagram(draw,p)
    text(draw,(80,1148),'Dimensions in mm',24,fill=MUTED,slug=slug)
    return canvas

def variant_sheet(p):
    slug=p['slug'];rows=p['variants'];height=900+len(rows)*74
    canvas=Image.new('RGB',(1600,height),'white');draw=ImageDraw.Draw(canvas)
    text(draw,(80,62),'ALUMINUM FOIL PACKAGING',25,fill=MUTED,slug=slug)
    title=p['name'].replace('Aluminum Foil','Foil')
    text(draw,(80,110),title,62,True,slug=slug)
    text(draw,(80,207),'Size and packing options',32,fill=MUTED,slug=slug)
    draw.line([(80,270),(1520,270)],fill=LINE,width=2)
    crop=photos[product_map[slug]['visualKey']];scale=min(670/crop.width,390/crop.height)
    photo=crop.resize((round(crop.width*scale),round(crop.height*scale)),Image.Resampling.LANCZOS)
    fit_photo(photo,(80,300,850,720),canvas)
    text(draw,(1040,360),str(len(rows)),95,True,slug=slug)
    text(draw,(1040,475),'LISTED OPTIONS',26,fill=MUTED,slug=slug)
    text(draw,(1040,542),'Aluminum foil',30,slug=slug)
    thickness=rows[0].get('thicknessOptionsMicrons')
    if thickness:text(draw,(1040,596),'20 or 25 μm',30,slug=slug)
    xs=[80,620,1130];y=780
    for x,label in zip(xs,['FOIL SIZE','PACKING','CARTON (mm)']):text(draw,(x,y),label,25,True,fill=MUTED,slug=slug)
    draw.line([(80,y+47),(1520,y+47)],fill=LINE,width=2)
    for i,v in enumerate(rows):
        y=845+i*74
        size=v['specificationDisplay'].replace('×',' × ').replace(' / ',' / ')
        size=re.sub(r'(?<=\d)(mm|cm|ft|m)\b',r' \1',size)
        size=size.replace('"',' in ').replace('  ',' ')
        pack=v['packDisplay'];carton=numbers(v['cartonDimensionsMm'])
        if p['shape']=='hookah-sheets':pack=f"{v['sheetsPerPack']} sheets/pack; {v['packsPerCarton']} packs/carton"
        wrap(draw,(xs[0],y),size,510,26,leading=1.12,slug=slug)
        wrap(draw,(xs[1],y),pack,470,25,leading=1.12,slug=slug)
        text(draw,(xs[2],y),carton,26,slug=slug)
        draw.line([(80,y+59),(1520,y+59)],fill=LINE,width=1)
    if p['shape']=='hookah-sheets':text(draw,(80,height-42),'50 sheets/pack × 200 packs/carton = 10,000 sheets/carton',25,fill=MUTED,slug=slug)
    return canvas

payloads=[]
for p in PRODUCTS:
    canvas=variant_sheet(p) if p['variants'] else container_sheet(p)
    public=save_asset(canvas,OUTPUT/'specification'/f"{p['slug']}-spec-en.webp",'specification',
                      productSlug=p['slug'],model=p['model'],visualKey=product_map[p['slug']]['visualKey'],
                      dimensions=p['dimensions'],capacityMl=p['capacityMl'],variantRows=len(p['variants']))
    main=product_map[p['slug']]['mainPublicPath'];old=p['websiteDraft']['gallery'][0]['src']
    body=p['websiteDraft']['contentHtml'].replace(old,public)
    body=body.replace('<figure><img','<figure><a href="'+public+'" target="_blank" rel="noopener noreferrer"><img')
    body=body.replace('<figcaption>','</a><figcaption>')
    body=body.replace(' — dimension drawing and packing specifications.',' — dimensions and packing. Open the full-size image for details.')
    assert main!=p['websiteDraft']['image'] and public!=old
    payloads.append({'slug':p['slug'],'image':main,'gallery':[{'src':public,'alt':p['name']+' — English dimensions and packing'}],
                     'contentHtml':body,'visualKey':product_map[p['slug']]['visualKey']})

category=Image.new('RGB',(1200,900),'white')
for i,key in enumerate(['gold-rectangular-shallow','silver-rectangular-standard-deep','silver-bare-foil-rolls','silver-two-compartment']):
    fit_photo(photos[key],((i%2)*600+35,(i//2)*450+45,(i%2+1)*600-35,(i//2+1)*450-45),category)
category_url=save_asset(category,OUTPUT/'category'/'category-aluminum-foil-en.webp','category')
PLAN.update(status='all-english-assets-prepared',mainImages=39,specificationImages=121,categoryImages=1,totalWebsiteAssets=161,
            finalMainPixels=[1280,960],containerSpecificationPixels=[1600,1200],categoryPublicPath=category_url,
            nativeGenerationGridPixels=[1254,1254],nativeGenerationCellPixels=[627,627],
            resolutionNote='AI restores material detail from the low-resolution source. Layout dimensions are separate from the native generated photograph resolution; no claim of native 4K product photographs.')
assert len(manifest)==161 and len(payloads)==121 and len(rendered)==121
assert sum(len(p['variants']) for p in PRODUCTS)==38
assert len({p['gallery'][0]['src'] for p in payloads})==121
assert len({p['image'] for p in payloads})==39
BASE.joinpath('generation-plan.json').write_text(json.dumps(PLAN,ensure_ascii=False,indent=2)+'\n')
BASE.joinpath('asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
BASE.joinpath('image-updates.json').write_text(json.dumps(payloads,ensure_ascii=False,indent=2)+'\n')
BASE.joinpath('english-rendered-text.json').write_text(json.dumps(rendered,ensure_ascii=False,indent=2)+'\n')
print('Prepared 39 shared restored main images, 121 individual English specification images and 1 category image (161 assets).')
