import {buyShopProduct} from '../browser/helpers';
import {test,expect} from '@playwright/test';
import {openMenuPage} from '../browser/helpers';
import {realCombat} from './controls';
const enabled=process.env.FISHING_TEST_AVAILABLE==='1';
test.beforeEach(async({context})=>{
 const token=process.env.VERCEL_OIDC_TOKEN;if(!token||!process.env.GAME_URL)return;
 const origin=new URL(process.env.GAME_URL).origin;
 await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),'x-vercel-trusted-oidc-idp-token':token}}));
});
async function tools(page:any){await openMenuPage(page,'help-open');await page.locator('#test-open').click();}
test('Le build contrôle le Mode test et conserve la partie normale sans QA',async({page})=>{
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);await openMenuPage(page,'help-open');
 if(!enabled){await expect(page.locator('#test-open')).toHaveCount(0);return;}
 const original=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'));await page.locator('#test-open').click();await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await tools(page);await expect(page.locator('#test-profile-state')).toContainText('∞');await expect(page.locator('#test-technique option')).toHaveCount(22);
 await page.locator('[data-close=test-tools]').click();await page.locator('[data-close=help]').click();await page.locator('#shop-open').click();await buyShopProduct(page,'precision');await page.locator('#purchase-yes').click();await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(s.inventory).toContain('precision');expect(s.development.theoreticalCost).toBe(160);expect(Number.isFinite(s.coins)).toBe(true);
 // Pendant le profil TEST le texte normal est intact. Son redémarrage valide et
 // sérialise à nouveau le JSON : l'ordre des clés peut changer, pas ses données.
 expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(original);
 await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!))).toEqual(JSON.parse(original!));
});
test('Build V2 sans QA : feeder, mouche et traîne jusqu’au combat, réception, photo et reload',async({page,context},info)=>{
 test.skip(!enabled,'Scénarios réservés à un build de test explicite.');test.setTimeout(240000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);const original=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'));await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 for(const [n,id] of ['feeder','mouche','traine'].entries()){
  await tools(page);await page.locator('#test-technique').selectOption(id);await page.locator('#test-kit').click();await page.locator('#test-length').fill('10');await page.locator('#test-fight').click();await expect(page.locator('body')).toHaveAttribute('data-phase','fighting');await realCombat(page,context,info.project.name==='mobile');await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');await expect(page.locator('#photo-state')).toContainText('Photo conservée');const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(s.total).toBe(n+1);expect(s.journal.at(-1).technique).toBe(id);await page.screenshot({path:`test-results/smoke-v2-${info.project.name}-${id}.png`});await page.locator('#release-fish').click();
 }
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(s.total).toBe(3);expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(original);expect(errors).toEqual([]);
});
