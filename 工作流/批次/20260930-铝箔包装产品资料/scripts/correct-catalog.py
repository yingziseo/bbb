"""Apply the user-authorized catalogue corrections and prepare publication payloads.

Keeps catalogue-original.json and the supplied PDF unchanged. Only reference values
with a traceable correction are changed; missing manufacturing data is not invented.
"""
from pathlib import Path
from copy import deepcopy
import csv, hashlib, html, json, math
import fitz
from PIL import Image

BASE = Path(__file__).resolve().parents[1]
ORIGINAL = BASE / 'catalog-original.json'
if not ORIGINAL.exists():
    ORIGINAL.write_bytes((BASE / 'catalog.json').read_bytes())
catalog = json.loads(ORIGINAL.read_text())
products = catalog['products']
original_pdf = Path(catalog['sourcePdf'])
assert hashlib.sha256(original_pdf.read_bytes()).hexdigest() == catalog['sourceSha256']
pdf = fitz.open(original_pdf)
corrections = []

def change(record, field, value, reason, basis):
    previous = deepcopy(record.get(field))
    record[field] = value
    corrections.append({'sourceId': record['sourceId'], 'model': record['model'], 'field': field,
                        'before': previous, 'after': value, 'reason': reason, 'basis': basis})

def numbers(values):
    return ' × '.join(f'{v:g}' for v in values)

def patch(page, rect, text, fontsize, fill, origin=None):
    page.add_redact_annot(fitz.Rect(rect), fill=fill)
    page.apply_redactions(images=0, graphics=0, text=0)
    if origin:
        page.insert_text(origin, text, fontsize=fontsize, fontname='helv', color=(0, 0, 0))
    else:
        result = page.insert_textbox(fitz.Rect(rect), text, fontsize=fontsize, fontname='helv',
                                    color=(0, 0, 0), align=fitz.TEXT_ALIGN_CENTER)
        assert result >= 0, (text, rect)

# Magnified review confirms both the original drawing and printed height are 36 mm.
r = next(r for r in products if r['model'] == '0909-180')
change(r, 'dimensionDrawingHeightMm', 36, '放大原图核对，标尺与文字均为36 mm；修正首次提取的38 mm误读。', 'magnified-drawing-review')
r['heightMm'] = 36

# Restore the missing decimal; this is an authorized reference estimate, not a factory measurement.
r = next(r for r in products if r['model'] == '350深')
change(r, 'bottomDimensionsMm', [306, 80.5], '底宽805 mm超过上口135 mm，按漏小数点修订为80.5 mm。', 'inferred-decimal-restoration')
patch(pdf[17], (482.8, 669.5, 524.2, 679.4), '306\u00d780.5mm', 6.7,
      (237/255, 236/255, 234/255), (483.5, 676.2))

# Carton dimensions are millimetres: validate every row against the catalogue's m³ volume.
for r in products:
    if not r['model'].startswith('hookah-'):
        continue
    for i, variant in enumerate(r['variants']):
        variant['specificationOriginal'] = variant['specificationRaw']
        variant['cartonDimensionsOriginal'] = variant['cartonDimensionsRaw']
        corrected = variant['candidateCartonDimensionsMm']
        computed_cube = math.prod(corrected) / 1_000_000_000
        assert abs(computed_cube - variant['cubeM3Raw']) <= 0.0001
        corrections.append({'sourceId': r['sourceId'], 'variant': i+1, 'field': 'cartonDimensions',
                            'before': variant['cartonDimensionsRaw'], 'after': numbers(corrected)+' mm',
                            'basis': 'carton-volume-cross-check', 'computedCubeM3': computed_cube,
                            'catalogueCubeM3': variant['cubeM3Raw']})
        variant['cartonDimensionsMm'] = corrected
        variant['cartonDimensions'] = numbers(corrected)+' mm'
        variant['issues'] = []
        if r['model'] == 'hookah-roll':
            variant['packQuantity'] = 30
            variant['packUnit'] = 'rolls'
            variant['packBasis'] = 'carton'
            variant['packDisplay'] = '30 rolls / carton'
            variant['specificationDisplay'] = f'{variant["widthMm"]} mm × {variant["lengthM"]} m / 20 or 25 μm'
            center = [186.12, 211.81, 237.49, 263.18, 289.0, 314.68, 341.25, 366.95][i]
            fill = (233/255, 232/255, 238/255) if i % 2 == 0 else (1, 1, 1)
            patch(pdf[5], (316, center-10, 422, center+10), numbers(corrected)+' mm', 9.0,
                  fill, (321.5, center+3.2))
        else:
            variant['packsPerCarton'] = 200
            variant['sheetsPerPack'] = 50
            variant['sheetsPerCarton'] = 10000
            variant['packBasis'] = 'carton'
            variant['packDisplay'] = '50 sheets / pack; 200 packs / carton (10,000 sheets)'
            variant['packInterpretation'] = 'user-authorized interpretation of the catalogue packaging hierarchy'
            variant['diameterMm'] = variant['widthMm'] if variant['shape'] == 'round' else None
            size = f'φ{variant["widthMm"]} mm' if variant['shape']=='round' else f'{variant["widthMm"]} × {variant["lengthMm"]} mm'
            variant['specificationDisplay'] = ('Round' if variant['shape']=='round' else 'Square')+' / '+size+' / 20 or 25 μm'
            center = 563.45 + 22.87*i
            fill = (233/255, 232/255, 238/255) if i % 2 == 0 else (1, 1, 1)
            patch(pdf[5], (355, center-8, 446, center+8), numbers(corrected)+' mm', 7.7,
                  fill, (358.5, center+2.6))
            patch(pdf[5], (273, center-8, 325, center+8), '200 packs', 7.4,
                  fill, (274.0, center+2.6))
    if r['model'] == 'hookah-roll':
        r['sourceClipPt']['specification'][3] = 390
    else:
        r['sourceClipPt']['specification'][1] = 410

pdf[5].insert_text((35, 778), 'Specification revision: carton dimensions in mm; 50 sheets/pack, 200 packs/carton. 2026-09-30.',
                   fontsize=6.6, fontname='helv', color=(0.35, 0.35, 0.35))
metadata = pdf.metadata
metadata['title'] = 'Aluminum Foil Packaging Catalogue - Specification Revision 2026-09-30'
pdf.set_metadata(metadata)
public_pdf = BASE.parents[2] / 'public/downloads/ihwan-aluminum-foil-packaging-catalog.pdf'
public_pdf.parent.mkdir(parents=True, exist_ok=True)
pdf.save(public_pdf, garbage=0, deflate=True)
pdf.close()
pdf = fitz.open(public_pdf)

shape_names = {'oval-cup':'Mini oval cup','heart':'Heart container','square':'Square container',
    'round-cup':'Round cup','rectangular':'Rectangular container','round':'Round container',
    'ear-tab':'Round container with ear tabs','oval':'Oval tray','pot':'Pot with lid',
    'round-plate':'Round plate','two-compartment':'Two compartment container',
    'three-compartment':'Three compartment container','round-bowl':'Round bowl',
    'round-lid':'Round lid','rectangular-lid':'Rectangular lid'}
for r in products:
    r['referenceDataNote'] = 'Catalogue dimensions and packing are reference values; confirm final order specifications.'
    top = r.get('topDimensionsMm')
    if top:
        prefix = 'φ' if r['topDimensionsType']=='diameter' else ''
        r['dimensions'] = prefix+numbers(top)+(f' × {r["heightMm"]:g}' if r.get('heightMm') is not None else '')+' mm'
    else:
        r['dimensions'] = None
    r['bottomDimensions'] = numbers(r['bottomDimensionsMm'])+' mm' if r.get('bottomDimensionsMm') else None
    r['cartonDimensions'] = numbers(r['cartonDimensionsMm'])+' mm' if r.get('cartonDimensionsMm') else None
    r['resolvedSourceIssues'] = r['issues']
    r['issues'] = []
    r['publicationStatus'] = 'approved'
    for v in r['variants']:
        if not v.get('specificationDisplay'):
            v['specificationDisplay'] = v['specificationRaw']
            v['packDisplay'] = v['packRaw']
            v['cartonDimensions'] = numbers(v['cartonDimensionsMm'])+' mm'
    d = r['websiteDraft']
    d['custom'] = True
    d.pop('customizationNote', None)
    d.pop('reviewNotes', None)
    d['publicationBlocked'] = False
    d['status'] = 'draft'
    d['material'] = 'Aluminum foil'
    d['specs'] = [{'label':'Catalogue model','value':r.get('displayModelEn') or r['model']},
                  {'label':'Material','value':'Aluminum foil'},
                  {'label':'Series','value':{'gold':'Gold Container Series','silver-l':'Silver L Container Series',
                                            'silver':'Silver Container Series','foil-rolls-and-sheets':'Foil Rolls and Sheets'}[r['sourceSeries']]},
                  {'label':'Product type','value':shape_names.get(r['shape'],r['name'])}]
    if not r['variants']:
        d['specs'].append({'label':'Finish shown','value':r['finish']})
    if r['capacityMl'] is not None:
        d['specs'].append({'label':'Capacity','value':f'{r["capacityMl"]} ml'})
    if r['dimensions']:
        d['specs'].append({'label':'Top dimensions / height','value':r['dimensions']})
    if r['bottomDimensions']:
        d['specs'].append({'label':'Bottom dimensions (reference)' if r['model']=='350深' else 'Bottom dimensions','value':r['bottomDimensions']})
    if r.get('innerTopDimensionsMm'):
        d['specs'].append({'label':'Inner opening','value':numbers(r['innerTopDimensionsMm'])+' mm'})
    if r['packQuantity']:
        pack_unit = 'sets' if r['packUnit']=='sets' else 'pcs'
        d['packaging'] = f'{r["packQuantity"]:,} {pack_unit} / carton'
        d['specs'].append({'label':'Packing','value':d['packaging']})
    else:
        d['packaging'] = 'See size and packing options'
    if r['cartonDimensions']:
        d['specs'].append({'label':'Carton size','value':r['cartonDimensions']})
    d['specs'].append({'label':'Thickness / alloy','value':'Confirm for the selected model with quotation'})
    d['specs'].append({'label':'OEM options','value':'Dimensions, packing and labeling by quotation'})
    if r['variants']:
        d['sizeOptions'] = [{'label':v['specificationDisplay'], 'value':v['specificationDisplay'],
                             'packaging':v['packDisplay']+'; '+v['cartonDimensions']} for v in r['variants']]
        summary = 'Available in '+str(len(r['variants']))+' listed size and packing options.'
    else:
        d['sizeOptions'] = [{'label':r.get('displayModelEn') or r['model'], 'value':r['dimensions'] or 'See lid dimensions',
                             'packaging':d['packaging']}]
        summary = 'Dimensions: '+r['dimensions']+'. '+d['packaging']+'.' if r['dimensions'] else d['packaging']+'.'
    d['shortDesc'] = r['name']+'. '+summary+' Contact YIYUAN for wholesale and OEM quotation.'
    d['seoDescription'] = r['name']+'. '+summary+' Ask YIYUAN for packing options and a wholesale quotation.'
    body = '<h2>Product dimensions and packing</h2><p>'+html.escape(d['shortDesc'])+'</p>'
    body += '<ul>'+''.join('<li><strong>'+html.escape(s['label'])+':</strong> '+html.escape(s['value'])+'</li>'
                           for s in d['specs'] if s['label'] in ['Product type','Capacity','Top dimensions / height','Bottom dimensions','Bottom dimensions (reference)','Packing','Carton size'])+'</ul>'
    body += '<figure><img src="'+d['gallery'][0]['src']+'" alt="'+html.escape(r['name']+' dimensions and packing',quote=True)+'" loading="lazy"><figcaption>'+html.escape(r['name'])+' — dimension drawing and packing specifications.</figcaption></figure>'
    body += '<h2>Wholesale and OEM orders</h2><p>Send the selected model, quantity, destination and packing requirements for quotation. Final dimensions, thickness, matching lids and carton configuration are confirmed with your order.</p>'
    d['contentHtml'] = body

# Update the four affected specification images, and the affected product main image.
for r in products:
    if r['model'] not in ['0909-180','350深','hookah-roll','hookah-sheets']:
        continue
    page = pdf[r['sourcePage']-1]
    page.get_pixmap(matrix=fitz.Matrix(3,3), clip=fitz.Rect(r['sourceClipPt']['specification']), alpha=False).pil_image().save(
        BASE/r['assets']['specification'],lossless=True,method=1)
    if r['model']=='350深':
        image = page.get_pixmap(matrix=fitz.Matrix(3,3),clip=fitz.Rect(r['sourceClipPt']['main']),alpha=False).pil_image()
        image.thumbnail((544,350),Image.Resampling.LANCZOS)
        canvas = Image.new('RGB',(640,480),'white')
        canvas.paste(image,((640-image.width)//2,(480-image.height)//2+15))
        canvas.save(BASE/r['assets']['main'],lossless=True,method=1)

manifest = json.loads((BASE/'asset-manifest.json').read_text())
for asset in manifest:
    data = (BASE/asset['path']).read_bytes()
    asset['bytes'] = len(data)
    asset['sha256'] = hashlib.sha256(data).hexdigest()
    image = Image.open(BASE/asset['path'])
    asset['width'],asset['height'] = image.size
    asset['specificationsRevised'] = asset['sourceId'] in ['p07-06','p18-08','p06-hookah-roll','p06-hookah-sheets']
(BASE/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
catalog['status'] = 'approved-corrected-ready-for-import'
catalog['approvedDate'] = '2026-09-30'
catalog['limitations'] = [x for x in catalog['limitations'] if not x.startswith('No changes to production')]
catalog['limitations'][0] = 'Similar source models are separate products when dimensions or packing differ; this is not a count of factory moulds.'
catalog['categoryProposal']['enabled'] = False
catalog['revisedPublicPdf'] = str(public_pdf)
catalog['revisedPdfSha256'] = hashlib.sha256(public_pdf.read_bytes()).hexdigest()
(BASE/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2))
(BASE/'corrections.json').write_text(json.dumps({'authorization':'2026-09-30 user approved corrections and publication',
    'sourcePdfSha256':catalog['sourceSha256'],'revisedPdfSha256':catalog['revisedPdfSha256'],
    'corrections':corrections,'similarModels':'Both source series retained; different capacities and dimensions are separate products.',
    'packingInterpretation':'Hookah sheets: 50 sheets/pack, 200 packs/carton; round-sheet dimensions treated as envelope diameter.',
    'unchangedUnknowns':['MOQ','Container foil thickness/alloy','Missing carton dimensions','Unspecified lid heights'],
    'photographs':'Original product photographs and all dimension arrows retained; numeric annotations corrected through PDF overlays.'},ensure_ascii=False,indent=2))
# The existing API accepts only these product fields.
fields = ['slug','name','shortDesc','image','material','moq','custom','packaging','seoTitle','seoDescription','seoKeywords',
          'specs','sizeOptions','applications','sortOrder','status','gallery','contentHtml']
payloads = [{k:r['websiteDraft'][k] for k in fields} for r in products]
(BASE/'products-to-import.json').write_text(json.dumps(payloads,ensure_ascii=False,indent=2))
with (BASE/'产品总表.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f,lineterminator="\n");w.writerow(['来源ID','PDF页码','源系列','类型分类','原型号','中文名称','网站英文名称','Slug','容量ml','上口及高度mm','底部尺寸mm','装箱数量','装箱单位','箱规mm','主图','规格图'])
    for r in products:w.writerow([r['sourceId'],r['sourcePage'],r['sourceSeries'],r['typeCategory'],r['model'],r['nameCn'],r['name'],r['slug'],r['capacityMl'],r['dimensions'],r['bottomDimensions'],r['packQuantity'],r['packUnit'],r['cartonDimensions'],r['assets']['main'],r['assets']['specification']])
with (BASE/'铝箔卷与水烟片规格.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f,lineterminator="\n");w.writerow(['产品','页码','上架规格','包装','箱规mm','体积m³','原规格','原箱规'])
    for r in products:
        for v in r['variants']:w.writerow([r['nameCn'],r['sourcePage'],v['specificationDisplay'],v['packDisplay'],v['cartonDimensions'],v['cubeM3Raw'],v['specificationRaw'],v['cartonDimensionsRaw']])
print('Prepared 121 import payloads, corrected specification images and revised 21-page PDF.')
print('PDF:',public_pdf,'bytes:',public_pdf.stat().st_size)
