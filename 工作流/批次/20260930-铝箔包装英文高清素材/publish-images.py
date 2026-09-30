"""Publish approved English artwork via existing authenticated admin APIs.

Creates an online SQLite backup and immutable uploads first. Updates only image,
gallery and image HTML of the 121 existing products, then the category image.
Does not change PDF documents, application code, schemas or service processes.
Credentials are read only into memory and never written to batch records.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, re, shutil, sqlite3, subprocess
import requests
from PIL import Image

BASE=Path(__file__).resolve().parent
PROJECT=BASE.parents[2]
PLAN=json.loads((BASE/'generation-plan.json').read_text())
MANIFEST=json.loads((BASE/'asset-manifest.json').read_text())
UPDATES=json.loads((BASE/'image-updates.json').read_text())
STATE_PATH=BASE/'publication-state.json'
state=json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {'products':[]}
assert PLAN['status']=='all-english-assets-prepared'
assert len(MANIFEST)==161 and len(UPDATES)==121
assert len({p['image'] for p in UPDATES})==39

def save():STATE_PATH.write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')

# Ensure requests reach the systemd-managed production process.
pid=subprocess.check_output(['systemctl','show','yiyuanpack.service','-p','MainPID','--value'],text=True).strip()
listeners=subprocess.check_output(['ss','-tlnp','sport = :3000'],text=True)
assert pid!='0' and f'pid={pid},' in listeners,'Port 3000 is not owned by the systemd service.'

if not state.get('backup'):
    stamp=datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    backup=PROJECT/'data/backups'/f'before-aluminum-english-images-{stamp}.db'
    backup.parent.mkdir(parents=True,exist_ok=True)
    with sqlite3.connect(f'file:{PROJECT}/data/yiyuan.db?mode=ro',uri=True) as source,sqlite3.connect(backup) as dest:
        source.backup(dest)
        assert dest.execute('pragma quick_check').fetchone()[0]=='ok'
    state.update(backup=str(backup),startedAt=datetime.now(timezone.utc).isoformat(),status='backup-verified')
    save();print('SQLite online backup verified.',flush=True)

for asset in MANIFEST:
    src=BASE/asset['path'];data=src.read_bytes()
    assert hashlib.sha256(data).hexdigest()==asset['sha256'],asset['path']
    with Image.open(src) as img:
        assert list(img.size)==[asset['width'],asset['height']]
        img.load()
    public=asset['publicPath'];assert public.startswith('/uploads/aluminum-foil-en-20260930/')
    target=PROJECT/'public'/public.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():assert hashlib.sha256(target.read_bytes()).hexdigest()==asset['sha256']
    else:shutil.copy2(src,target)
state['assetsCopied']=len(MANIFEST);save()
print('161 decoded and hashed assets copied to immutable public paths.',flush=True)

env={}
for line in (PROJECT/'.env').read_text().splitlines():
    if not line.strip() or line.lstrip().startswith('#') or '=' not in line:continue
    key,value=line.split('=',1);env[key.strip()]=value.strip().strip('"').strip("'")
for entry in Path('/proc/'+pid+'/environ').read_bytes().split(b'\0'):
    if b'=' not in entry:continue
    key,value=entry.split(b'=',1)
    if key in [b'ADMIN_USERNAME',b'ADMIN_PASSWORD']:env[key.decode()]=value.decode()
assert env.get('ADMIN_USERNAME') and env.get('ADMIN_PASSWORD')
client=requests.Session();origin='http://127.0.0.1:3000'
response=client.post(origin+'/api/admin/auth/login',json={'username':env['ADMIN_USERNAME'],'password':env['ADMIN_PASSWORD']},timeout=20)
assert response.status_code==200,'Admin login failed.'
token=response.cookies.get('yiyuan_admin_session');assert token
client.headers['Cookie']='yiyuan_admin_session='+token

def api(method,path,body=None):
    response=client.request(method,origin+path,json=body,timeout=30)
    if response.status_code>=400:raise RuntimeError(f'{method} {path}: HTTP {response.status_code}')
    return response.json()

def preserved(before,after,changed):
    for key,value in before.items():
        if key not in changed:assert after.get(key)==value,(before['slug'],key)

try:
    categories=api('GET','/api/admin/product-categories')['items']
    category=next(c for c in categories if c['slug']=='aluminum-foil-packaging')
    assert category['id']==234 and category['enabled'] and category['productCount']==121
    all_before=api('GET','/api/admin/products')['items']
    current={p['slug']:p for p in all_before if p['categoryId']==234}
    assert set(current)=={p['slug'] for p in UPDATES}
    assert all(p['status']=='published' for p in current.values())
    before_path=BASE/'before-image-update.json'
    if not before_path.exists():
        before_path.write_text(json.dumps({'category':category,'products':all_before},ensure_ascii=False,indent=2)+'\n')
    for i,update in enumerate(UPDATES,1):
        before=current[update['slug']]
        # Avoid overwriting any subsequent editorial changes outside the image figure.
        assert re.sub(r'<figure>.*?</figure>','',before['contentHtml'])==re.sub(r'<figure>.*?</figure>','',update['contentHtml']),before['slug']
        body={**before,**{k:update[k] for k in ['image','gallery','contentHtml']}}
        item=api('PUT',f'/api/admin/products/{before["id"]}',body)['item']
        preserved(before,item,{'image','gallery','contentHtml','updatedAt'})
        assert item['image']==update['image'] and item['gallery']==update['gallery']
        assert update['gallery'][0]['src'] in item['contentHtml']
        assert '<a href="'+update['gallery'][0]['src']+'"' in item['contentHtml']
        assert '/uploads/aluminum-foil-20260930/' not in item['contentHtml']
        state['products']=[p for p in state['products'] if p['slug']!=item['slug']]+[
            {'id':item['id'],'slug':item['slug'],'image':item['image'],'specificationImage':item['gallery'][0]['src']}]
        save()
        if i%25==0 or i==len(UPDATES):print(f'Updated and verified existing products: {i}/121',flush=True)
    item=api('PUT',f'/api/admin/product-categories/{category["id"]}',{**category,'image':PLAN['categoryPublicPath']})['item']
    preserved(category,item,{'image','updatedAt','productCount'})
    assert item['image']==PLAN['categoryPublicPath']
    after=api('GET','/api/admin/products')['items']
    untouched={p['id']:p for p in all_before if p['categoryId']!=234}
    assert len(after)==len(all_before)
    for p in after:
        if p['id'] in untouched:assert p==untouched[p['id']],p['slug']
    visible=api('GET','/api/public/products?category=aluminum-foil-packaging')
    assert len(visible['items'])==121
    assert len({p['image'] for p in visible['items']})==39
    assert len({p['gallery'][0]['src'] for p in visible['items']})==121
    (BASE/'published-products.json').write_text(json.dumps(visible,ensure_ascii=False,indent=2)+'\n')
    with sqlite3.connect(f'file:{PROJECT}/data/yiyuan.db?mode=ro',uri=True) as db:
        assert db.execute('pragma integrity_check').fetchone()[0]=='ok'
        assert db.execute('pragma foreign_key_check').fetchall()==[]
    state.update(status='published-images-verified',publishedAt=datetime.now(timezone.utc).isoformat(),
                 categoryId=234,categoryImage=PLAN['categoryPublicPath'],mainImages=39,specificationImages=121,
                 untouchedProducts=len(untouched),nonImageProductFieldsPreserved=True,sqliteIntegrity='ok',
                 publicCategoryUrl='https://yiyuanpack.com/products/category/aluminum-foil-packaging')
    save();print('121 product image updates and category image published; all other product fields preserved.',flush=True)
finally:
    try:api('POST','/api/admin/auth/logout')
    finally:client.headers.pop('Cookie',None);client.close()
