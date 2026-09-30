"""Check shared photographs and readable English spec navigation at both widths."""
from pathlib import Path
from datetime import datetime, timezone
import json
from playwright.sync_api import sync_playwright

BASE=Path(__file__).resolve().parent
OUT=BASE/'images/verification';OUT.mkdir(parents=True,exist_ok=True)
ORIGIN='https://yiyuanpack.com';category='/products/category/aluminum-foil-packaging'
updates={p['slug']:p for p in json.loads((BASE/'image-updates.json').read_text())}
slugs=['aluminum-foil-gold-0909-180','aluminum-foil-silver-l-two-compartment','aluminum-foil-hookah-sheets','aluminum-foil-silver-round-bowl-lid']
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium-browser',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in [1440,390]:
        context=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},device_scale_factor=1)
        page=context.new_page();errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        response=page.goto(ORIGIN+category,wait_until='networkidle',timeout=60000)
        assert response.status==200
        assert page.locator('main h3 a[href^="/products/aluminum-foil-"]').count()==121
        if width==1440:
            page.locator('.site-nav-node--products').hover()
            assert page.locator('.site-nav-dropdown__item[href="'+category+'"]').is_visible()
            page.mouse.move(10,400)
        else:
            page.get_by_role('button',name='Open menu',exact=True).click()
            assert page.locator('.site-mobile-category[href="'+category+'"]').is_visible()
            page.get_by_role('button',name='Close menu',exact=True).click()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
        page.screenshot(path=str(OUT/f'category-{width}.png'))
        results.append({'width':width,'page':category,'cards':121,'http':200,'navigationVisible':True,'horizontalOverflow':False})
        for slug in slugs:
            update=updates[slug];spec=update['gallery'][0]['src']
            response=page.goto(ORIGIN+'/products/'+slug,wait_until='networkidle',timeout=60000)
            assert response.status==200
            main=page.locator('main img[fetchpriority="high"]')
            assert main.get_attribute('src')==update['image']
            assert main.evaluate('(im)=>im.complete && im.naturalWidth===1280')
            buttons=page.locator('main button[aria-label^="View image"]');assert buttons.count()==2
            buttons.nth(1).click();assert buttons.nth(1).get_attribute('aria-pressed')=='true'
            assert main.get_attribute('src')==spec
            main.evaluate('(im)=>im.decode()')
            figure=page.locator('.product-detail-content img');assert figure.count()==1
            figure.scroll_into_view_if_needed()
            page.wait_for_function('Array.from(document.querySelectorAll(".product-detail-content img")).every(im => im.complete && im.naturalWidth === 1600)',timeout=30000)
            assert figure.get_attribute('src')==spec
            link=page.locator('.product-detail-content a[href="'+spec+'"]')
            assert link.count()==1 and link.get_attribute('target')=='_blank'
            assert page.locator('main a[href^="/contact?product="]').count()>=1
            if slug.endswith('0909-180'):assert '90 × 90 × 36 mm' in page.locator('main').inner_text()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
            page.screenshot(path=str(OUT/f'{slug}-{width}.png'))
            results.append({'width':width,'page':'/products/'+slug,'http':200,'mainImageLoaded':True,'gallerySwitch':True,
                            'englishSpecLoaded':True,'fullSizeImageLink':True,'horizontalOverflow':False})
        assert not errors,errors
        context.close()
    browser.close()
(BASE/'browser-verification.json').write_text(json.dumps({'status':'passed','checkedAt':datetime.now(timezone.utc).isoformat(),
    'pageErrors':[],'results':results,'screenshots':'images/verification/'},ensure_ascii=False,indent=2)+'\n')
print('1440px/390px: 121 cards, navigation, restored main photos, English spec switching/full-size links, no page errors/overflow.',flush=True)
