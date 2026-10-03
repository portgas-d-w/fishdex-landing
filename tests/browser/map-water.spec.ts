import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {openMenuPage,receiveByGesture} from './helpers';
import {environmentProbe} from '../support/environment-probe';
const folder='docs/apercus/carte-eau';
const qa=(page:any)=>page.evaluate(()=>(window as any).__fishingQA.snapshot());
async function tools(page:any){await openMenuPage(page,'help-open');await page.locator('#test-open').click();}
async function boot(page:any){await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await tools(page);await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());}
test('Carte eau : six vrais postes, combat réception photo et sauvegarde isolée',async({page},info)=>{
 test.setTimeout(180000);await mkdir(folder,{recursive:true});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await boot(page);const normal=await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1')),rows=[];
 for(const post of ['jetty','cove','bank','reed-bank','point','timber']){await tools(page);await page.locator('#test-technique').selectOption('coup');await page.locator('#test-kit').click();await page.locator('#test-post').selectOption(post);await page.locator('#test-species').selectOption('roach');await page.locator('#test-length').fill('10');await page.locator('#test-seed').fill('127');await page.locator('#test-fight').click();await page.evaluate(()=>(window as any).__fishingQA.advance(.02));expect((await qa(page)).post).toBe(post);await page.evaluate(()=>(window as any).__fishingQA.advance(240,'smart'));await receiveByGesture(page);await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');await expect(page.locator('#photo-state')).toContainText('Photo conservée');const s=await qa(page);expect(s.total).toBe(rows.length+1);rows.push({post,capture:s.specimen,photo:true});await page.locator('#release-fish').click();await page.evaluate(()=>(window as any).__fishingQA.advance(.02));}
 await page.reload();await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect((await qa(page)).total).toBe(6);expect(await page.evaluate(()=>localStorage.getItem('au-fil-de-leau.save.v1'))).toBe(normal);expect(errors).toEqual([]);await writeFile(`${folder}/${info.project.name}-six-captures.json`,JSON.stringify({forcedEncounter:true,realCombatAndTouchReception:true,physicalDevice:false,rows},null,2));
});
test('Registre : substitution GLB locale, rejet des dimensions, retour exact à la famille provisoire',async({page})=>{
 await boot(page);await page.route('**/models/environment/contract-probe.glb',route=>route.fulfill({contentType:'model/gltf-binary',body:environmentProbe()}));
 await page.route('**/models/environment/contract-invalid.glb',route=>route.fulfill({contentType:'model/gltf-binary',body:environmentProbe(10)}));
 const before=await qa(page);
 expect(await page.evaluate(()=>(window as any).__fishingQA.replaceAsset('rock_small','/models/environment/contract-probe.glb'))).toBe(true);
 const loaded=await page.evaluate(()=>(window as any).__fishingQA.water());expect(loaded.assets.families.rock_small).toContain('glb:');expect(loaded.assets.families.reeds).toBe('procedural');
 expect(await page.evaluate(()=>(window as any).__fishingQA.replaceAsset('rock_small','/models/environment/contract-invalid.glb'))).toBe(false);
 expect(await page.evaluate(()=>(window as any).__fishingQA.replaceAsset('rock_small',null))).toBe(true);
 expect((await qa(page)).totalMeshes).toBe(before.totalMeshes);expect((await qa(page)).total).toBe(0);
});
test('Carte eau : pools bornés, pause, dix transitions, qualité et repli de décor',async({page})=>{
 await boot(page);await expect(page.locator('#water-tools')).toBeHidden();await tools(page);await page.locator('#water-tools-open').click();await expect(page.locator('#water-tools')).toBeVisible();await page.locator('#water-tools details summary').filter({hasText:'Remplacement'}).click();await page.locator('#water-resource').fill('/models/environment/absent.glb');await page.locator('#water-replace').click();await expect(page.locator('#water-asset-state')).toContainText('conservé');
 const before=await page.evaluate(()=>(window as any).__fishingQA.snapshot());await page.locator('[data-close=water-tools]').click();
 for(const q of ['low','standard','high']){await page.evaluate(q=>{const a=(window as any).__fishingQA;a.waterQuality(q);for(let n=0;n<30;n++)a.waterDemo('cast_impact');},q);const d=await page.evaluate(()=>(window as any).__fishingQA.water());expect(d.water.activeRings).toBeLessThanOrEqual(d.water.capacity.rings);expect(d.water.activeDrops).toBeLessThanOrEqual(d.water.capacity.drops);await page.waitForTimeout(100);const paused=await page.evaluate(()=>(window as any).__fishingQA.water());expect(paused.water.activeRings).toBe(d.water.activeRings);}
 await page.evaluate(()=>(window as any).__fishingQA.waterQuality('low'));await page.waitForTimeout(150);expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().getMeshByName('water').isReady(true))).toBe(true);for(let n=0;n<10;n++){await page.locator('#water-tools-open').click();await page.locator('#water-post').selectOption(['cove','bank','reed-bank','point','timber','jetty'][n%6]);await page.locator('[data-close=water-tools]').click();}
 const after=await qa(page);expect(after.totalMeshes).toBe(before.totalMeshes);expect(after.sceneId).toBe(before.sceneId);expect(after.engines).toBe(before.engines);expect(after.total).toBe(0);
});
