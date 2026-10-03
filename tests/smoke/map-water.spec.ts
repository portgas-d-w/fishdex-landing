import {test,expect,type Page} from '@playwright/test';
test.beforeEach(async({context})=>{
 const token=process.env.VERCEL_OIDC_TOKEN;if(!token||!process.env.GAME_URL)return;
 const origin=new URL(process.env.GAME_URL).origin;
 await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),'x-vercel-trusted-oidc-idp-token':token}}));
});
async function tools(page:Page){await page.locator('#menu-open').click();await page.locator('#help-open').click();await page.locator('#test-open').click();}
test('Carte et eau hébergées : six postes, qualités, ambiances et essais isolés sans QA',async({page},info)=>{
 await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);await expect(page.locator('#water-tools')).toBeHidden();await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('#test-badge')).toBeVisible();
 const normal=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'));await tools(page);await page.locator('#water-tools-open').click();
 expect(await page.locator('#water-tools').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 for(const post of ['jetty','cove','bank','reed-bank','point','timber']){await page.locator('#water-post').selectOption(post);await expect(page.locator('body')).toHaveAttribute('data-post',post);await expect(page.locator('#water-diagnostics')).toContainText('"post": "'+post+'"');}
 for(const q of ['standard','high','low']){await page.locator('#water-profile').selectOption(q);await expect(page.locator('#water-diagnostics')).toContainText('"quality": "'+q+'"');}
 for(const a of ['overcast','evening','morning']){await page.locator('#water-ambience').selectOption(a);await expect(page.locator('#water-diagnostics')).toContainText('"ambience": "'+a+'"');}
 await page.locator('#water-seed').fill('42');await page.locator('#water-event').selectOption('fish_release');await page.locator('#water-event-play').click();await expect(page.locator('dialog[open]')).toHaveCount(0);await page.waitForTimeout(700);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(saved.total).toBe(0);expect(saved.preparation.post).toBe('timber');expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(normal);
 await page.screenshot({path:'test-results/carte-eau-public-'+info.project.name+'.png'});await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('#test-badge')).toBeHidden();await expect(page.locator('body')).toHaveAttribute('data-post','jetty');
});
