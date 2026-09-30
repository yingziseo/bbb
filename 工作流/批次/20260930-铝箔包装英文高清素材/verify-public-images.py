"""Verify live product preservation, immutable image bytes and English assets."""
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
import hashlib,io,json,re
import requests
from PIL import Image

BASE=Path(__file__).resolve().parent
ORIGIN='https://yiyuanpack.com'
MANIFEST=json.loads((BASE/'asset-manifest.json').read_text())
UPDATES=json.loads((BASE/'image-updates.json').read_text())
BEFORE=json.loads((BASE/'before-image-update.json').read_text())
response=requests.get(ORIGIN+'/api/public/products?category=aluminum-foil-packaging',timeout=30)
assert response.status_code==200
public=response.json();by_slug={p['slug']:p for p in public['items']}
assert len(by_slug)==121
old={p['slug']:p for p in BEFORE['products']}
for update in UPDATES:
    item=by_slug[update['slug']]
    assert item['image']==update['image'] and item['gallery']==update['gallery']
    for key in ['name','slug','shortDesc','material','moq','custom','packaging','specs','sizeOptions','applications','seoTitle','seoDescription','seoKeywords','canonical','sortOrder','status']:
        assert item[key]==old[item['slug']][key],(item['slug'],key)
    assert update['gallery'][0]['src'] in item['contentHtml']
    assert '/uploads/aluminum-foil-20260930/' not in item['image']+json.dumps(item['gallery'])+item['contentHtml']
assert len({p['image'] for p in by_slug.values()})==39
assert len({p['gallery'][0]['src'] for p in by_slug.values()})==121
assert not re.search(r'[\u3400-\u9fff]',json.dumps(json.loads((BASE/'english-rendered-text.json').read_text()),ensure_ascii=False))

def verify_asset(asset):
    response=requests.get(ORIGIN+asset['publicPath'],timeout=45)
    assert response.status_code==200,(asset['publicPath'],response.status_code)
    assert hashlib.sha256(response.content).hexdigest()==asset['sha256'],asset['publicPath']
    with Image.open(io.BytesIO(response.content)) as im:
        assert list(im.size)==[asset['width'],asset['height']]
        im.load()
    return {'path':asset['publicPath'],'http':200,'sha256Verified':True,'pixels':[asset['width'],asset['height']]}

with ThreadPoolExecutor(max_workers=4) as pool:assets=list(pool.map(verify_asset,MANIFEST))
print('161 public image files: HTTP 200, exact SHA256, decoded successfully.',flush=True)

paths=['/products/category/aluminum-foil-packaging']+['/products/'+p['slug'] for p in UPDATES]
def verify_page(path):
    response=requests.get(ORIGIN+path,timeout=45)
    assert response.status_code==200,(path,response.status_code)
    if path.startswith('/products/aluminum-foil-'):
        assert by_slug[path.split('/')[-1]]['image'] in response.text,path
    return {'path':path,'http':200}
with ThreadPoolExecutor(max_workers=4) as pool:pages=list(pool.map(verify_page,paths))
report={'status':'passed','checkedAt':datetime.now(timezone.utc).isoformat(),'products':121,'sharedMainImages':39,
        'specificationImages':121,'categoryImages':1,'assets':assets,'pages':pages,'nonImageFieldsPreserved':True,
        'englishArtworkTextChecked':True,'oldProductImageReferencesRemaining':0}
(BASE/'public-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('121 English product pages and category: HTTP 200; all non-image fields preserved.',flush=True)
