import {test,expect} from '@playwright/test';
import {openMenuPage} from '../browser/helpers';
import {realCombat} from './controls';
import {mkdir,writeFile} from 'node:fs/promises';
const testAvailable=process.env.FISHING_TEST_AVAILABLE==='1';
test.beforeEach(async({context})=>{
 const token=process.env.VERCEL_OIDC_TOKEN;if(!token||!process.env.GAME_URL)return;
 const origin=new URL(process.env.GAME_URL).origin;
 await context.route(`${origin}/**`,route=>route.continue({headers:{...route.request().headers(),'x-vercel-trusted-oidc-idp-token':token}}));
});
async function tools(page:any){await openMenuPage(page,'help-open');await page.locator('#test-open').click();}
test('FishDex hébergé sans QA : 66 identités, 52 captures, 14 observations, sources et robe canonique',async({page},info)=>{
 const failures:string[]=[];page.on('requestfailed',r=>failures.push(r.url()));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);
 await openMenuPage(page,'dex-open');await expect(page.locator('.dex-tile')).toHaveCount(66);await page.locator('#dex-state').selectOption('playable');await expect(page.locator('.dex-tile')).toHaveCount(52);await page.locator('#dex-state').selectOption('observation');await expect(page.locator('.dex-tile')).toHaveCount(14);await page.locator('#dex-state').selectOption('all');await page.locator('#dex-search').fill('tiger');await page.locator('.dex-tile').click();await expect(page.locator('#species-sheet')).toContainText('Salmo trutta × Salvelinus fontinalis');await expect(page.locator('#species-sheet')).toContainText('Silhouette procédurale provisoire');await expect(page.locator('#species-sheet a[href*="wildlife.utah.gov"]')).toHaveCount(1);
 await page.locator('[data-close=species-sheet]').click();await page.locator('#dex-search').fill('esturgeon sib');await page.locator('.dex-tile').click();await expect(page.locator('.variant-image[alt*="esturgeon gold" i]')).toHaveAttribute('src',/^\/fishdex-assets\/.+\.webp$/);await expect(page.locator('#species-sheet')).not.toContainText('écartée');
 await mkdir('test-results/poissons-heberge',{recursive:true});await page.screenshot({path:`test-results/poissons-heberge/${info.project.name}-fishdex.png`});expect(failures).toEqual([]);
});
test('Poissons hébergés : modèles exacts/provisoires, robe, commandes réelles, réception, photo et observation',async({page,context},info)=>{
 test.skip(!testAvailable,'Ce contrôle nécessite le Mode test.');test.setTimeout(540000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(await page.evaluate(()=>'__fishingQA' in window)).toBe(false);const original=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'));await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 const rows=[];
 for(const [id,appearance]of [['gobie',''],['carpe-koi','carpe-koi-kohaku'],['truite-fario',''],['esturgeon-siberien','esturgeon-albinos']]){
  await tools(page);await page.locator('#test-species').selectOption(id);if(appearance)await page.locator('#test-appearance').selectOption(appearance);await page.locator('#test-fish-kit').click();await page.locator('#test-fight').click();await expect(page.locator('body')).toHaveAttribute('data-phase','fighting');const pole=await page.locator('#reel-control').isHidden();await realCombat(page,context,info.project.name==='mobile',pole,180);await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');await expect(page.locator('#photo-state')).toContainText('Photo conservée');
  const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(s.total).toBe(rows.length+1);expect(s.journal.at(-1).speciesId).toBe(id);expect(s.journal.at(-1).appearanceId??'').toBe(appearance);rows.push({id,appearance,specimen:s.journal.at(-1).id,length:s.journal.at(-1).length,photo:true});await page.screenshot({path:`test-results/poissons-heberge/${info.project.name}-${id}.png`});await page.locator('#release-fish').click();
 }
 for(const id of ['apron-du-rhone','lamproie-de-planer','saumon-roi']){
  await tools(page);await page.locator('#test-species').selectOption(id);await page.locator('#test-fish-observe').click();await expect(page.locator('#observation-hold')).toBeEnabled();const b=(await page.locator('#observation-hold').boundingBox())!;await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await expect(page.locator('#observation-photo')).toBeEnabled({timeout:20000});await page.mouse.up();await page.locator('#observation-photo').click();await expect(page.locator('#observation-state')).toContainText('Découverte et identité conservées');await page.screenshot({path:`test-results/poissons-heberge/${info.project.name}-${id}.png`});await page.locator('[data-close=observation]').click();
 }
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(save.journal.map((s:any)=>s.id)).toEqual(rows.map(r=>r.specimen));expect(save.observations.map((o:any)=>o.speciesId)).toEqual(['apron-du-rhone','lamproie-de-planer','saumon-roi']);expect(save.total).toBe(4);expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(original);expect(errors).toEqual([]);
 await writeFile(`test-results/poissons-heberge/${info.project.name}-chains.json`,JSON.stringify({qa:false,forcedEncounterOnly:true,controller:'Real DOM/CDP commands at wall-clock speed',captures:rows,observations:save.observations,errors},null,2));
});
