"""Stage or publish this approved batch through the existing local admin API.

Credentials are read into memory only. A SQLite online backup precedes the first
login; the category stays disabled until the verified cloud artifact is deployed.
"""
from pathlib import Path
from datetime import datetime, timezone
import argparse, hashlib, json, shutil, sqlite3, subprocess
import requests

BASE = Path(__file__).resolve().parents[1]
PROJECT = BASE.parents[2]
STATE_PATH = BASE/'publication-state.json'
CATALOG = json.loads((BASE/'catalog.json').read_text())
PAYLOADS = json.loads((BASE/'products-to-import.json').read_text())
MANIFEST = json.loads((BASE/'asset-manifest.json').read_text())
assert CATALOG['status']=='approved-corrected-ready-for-import'
assert len(PAYLOADS)==121 and len({p['slug'] for p in PAYLOADS})==121
assert all(p['custom'] is True and p['status']=='draft' for p in PAYLOADS)

parser=argparse.ArgumentParser()
parser.add_argument('mode',choices=['stage','publish'])
parser.add_argument('--sha',help='Required deployed commit SHA for publication')
args=parser.parse_args()
state=json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {'products':[]}

def save():
    STATE_PATH.write_text(json.dumps(state,ensure_ascii=False,indent=2))

if not state.get('backup'):
    stamp=datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    backup=PROJECT/'data/backups'/f'before-aluminum-foil-products-{stamp}.db'
    backup.parent.mkdir(parents=True,exist_ok=True)
    source=sqlite3.connect(f'file:{PROJECT}/data/yiyuan.db?mode=ro',uri=True)
    dest=sqlite3.connect(backup)
    source.backup(dest)
    assert dest.execute('pragma quick_check').fetchone()[0]=='ok'
    dest.close();source.close()
    state.update({'backup':str(backup),'startedAt':datetime.now(timezone.utc).isoformat(),'status':'backup-complete'})
    save();print('SQLite online backup verified.',flush=True)

if args.mode=='publish':
    assert args.sha, 'Publication requires --sha.'
    assert (PROJECT/'.output/BUILD_SHA').read_text().strip()==args.sha, 'Running artifact SHA mismatch.'
    state['deployedCommit']=args.sha
    save()

# The authenticated service environment has priority over the on-disk fallback.
env={}
for line in (PROJECT/'.env').read_text().splitlines():
    if not line.strip() or line.lstrip().startswith('#') or '=' not in line:continue
    key,value=line.split('=',1);env[key.strip()]=value.strip().strip('"').strip("'")
pid=subprocess.check_output(['systemctl','show','yiyuanpack.service','-p','MainPID','--value'],text=True).strip()
for item in Path('/proc/'+pid+'/environ').read_bytes().split(b'\0'):
    if b'=' not in item:continue
    key,value=item.split(b'=',1)
    if key in [b'ADMIN_USERNAME',b'ADMIN_PASSWORD']:env[key.decode()]=value.decode()
assert env.get('ADMIN_USERNAME') and env.get('ADMIN_PASSWORD'), 'Admin credentials unavailable.'
client=requests.Session()
origin='http://127.0.0.1:3000'
response=client.post(origin+'/api/admin/auth/login',json={'username':env['ADMIN_USERNAME'],'password':env['ADMIN_PASSWORD']},timeout=20)
assert response.status_code==200, f'Admin login failed: HTTP {response.status_code}'
token=response.cookies.get('yiyuan_admin_session')
assert token, 'Admin session cookie missing.'
client.headers['Cookie']='yiyuan_admin_session='+token
# Do not serialize or print env, headers or the session token.

def api(method,path,body=None):
    response=client.request(method,origin+path,json=body,timeout=30)
    if response.status_code>=400:
        raise RuntimeError(f'{method} {path}: HTTP {response.status_code}: {response.text[:300]}')
    return response.json()

def assert_product(item,payload):
    for key in ['slug','name','shortDesc','image','material','moq','custom','packaging','seoTitle','seoDescription',
                'seoKeywords','specs','sizeOptions','applications','gallery']:
        assert item[key]==payload[key], (payload['slug'],key)
    assert item['gallery'][0]['src'] in item['contentHtml']
    assert '<script' not in item['contentHtml'].lower()

try:
    categories=api('GET','/api/admin/product-categories')['items']
    proposal=CATALOG['categoryProposal']
    category=next((c for c in categories if c['slug']==proposal['slug']),None)
    if state.get('categoryId'):
        assert category and category['id']==state['categoryId'], 'Existing batch category ownership mismatch.'
    if category is None:
        assert args.mode=='stage', 'Stage the category before publication.'
        body={k:proposal[k] for k in ['name','slug','description','sortOrder','seoTitle','seoDescription','seoKeywords']}
        body.update({'image':proposal['proposedImage'],'enabled':False})
        category=api('POST','/api/admin/product-categories',body)['item']
        state['categoryId']=category['id'];state['categorySlug']=category['slug'];save()
    elif not state.get('categoryId'):
        raise RuntimeError('The category already exists but is not recorded as this batch; inspect before resuming.')
    existing=api('GET',f'/api/admin/products?categoryId={category["id"]}')['items']
    expected={p['slug'] for p in PAYLOADS}
    assert all(p['slug'] in expected for p in existing), 'Unrelated products in the batch category.'
    by_slug={p['slug']:p for p in existing}
    if args.mode=='stage':
        assert not category['enabled'], 'Cannot stage over an already enabled category.'
        upload_root=PROJECT/'public/uploads'
        for asset in MANIFEST:
            src=BASE/asset['path'];data=src.read_bytes()
            assert hashlib.sha256(data).hexdigest()==asset['sha256'], asset['path']
            public=asset['proposedPublicPath']
            assert public.startswith('/uploads/aluminum-foil-20260930/')
            target=PROJECT/'public'/public.lstrip('/')
            target.parent.mkdir(parents=True,exist_ok=True)
            if not target.exists() or hashlib.sha256(target.read_bytes()).hexdigest()!=asset['sha256']:
                shutil.copy2(src,target)
        state['assetsCopied']=len(MANIFEST);save()
        for i,payload in enumerate(PAYLOADS,1):
            body={**payload,'categoryId':category['id']}
            item=by_slug.get(payload['slug'])
            if item is None:item=api('POST','/api/admin/products',body)['item']
            assert item['status']=='draft'
            assert_product(item,payload)
            state['products']=[p for p in state['products'] if p['slug']!=item['slug']]+[{'id':item['id'],'slug':item['slug'],'status':item['status']}]
            save()
            if i%25==0 or i==len(PAYLOADS):print(f'Validated drafts: {i}/121',flush=True)
        assert len(state['products'])==121
        state['status']='staged';save()
        print('121 drafts staged; category remains disabled.',flush=True)
    else:
        assert len(by_slug)==121 and len(state['products'])==121
        for i,payload in enumerate(PAYLOADS,1):
            current=by_slug[payload['slug']]
            assert_product(current,payload)
            body={**payload,'categoryId':category['id'],'status':'published'}
            item=current if current['status']=='published' else api('PUT',f'/api/admin/products/{current["id"]}',body)['item']
            assert item['status']=='published'
            assert_product(item,payload)
            for p in state['products']:
                if p['id']==item['id']:p['status']='published'
            save()
            if i%25==0 or i==len(PAYLOADS):print(f'Published records: {i}/121',flush=True)
        body={k:proposal[k] for k in ['name','slug','description','sortOrder','seoTitle','seoDescription','seoKeywords']}
        body.update({'image':proposal['proposedImage'],'enabled':True})
        if not category['enabled']:category=api('PUT',f'/api/admin/product-categories/{category["id"]}',body)['item']
        assert category['enabled']
        visible=api('GET','/api/public/products?category=aluminum-foil-packaging')
        assert len(visible['items'])==121
        public_category=next(c for c in visible['categories'] if c['slug']==proposal['slug'])
        assert public_category['productCount']==121
        state.update({'status':'published','publishedAt':datetime.now(timezone.utc).isoformat(),'publicCategoryUrl':'https://yiyuanpack.com/products/category/aluminum-foil-packaging'})
        save()
        (BASE/'published-products.json').write_text(json.dumps(visible,ensure_ascii=False,indent=2))
        print('Aluminum Foil Packaging enabled with 121 published products.',flush=True)
    db=sqlite3.connect(f'file:{PROJECT}/data/yiyuan.db?mode=ro',uri=True)
    assert db.execute('pragma integrity_check').fetchone()[0]=='ok'
    assert db.execute('pragma foreign_key_check').fetchall()==[]
    db.close()
    print('SQLite integrity and foreign keys verified.',flush=True)
finally:
    try:api('POST','/api/admin/auth/logout')
    finally:
        client.headers.pop('Cookie',None)
        client.close()
