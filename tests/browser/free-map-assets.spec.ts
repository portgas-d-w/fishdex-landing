import {test,expect} from '@playwright/test';
import {openMenuPage} from './helpers';
async function boot(page:any){await page.addInitScript(()=>localStorage.setItem('au-fil-de-leau.gestures.v3','3'));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'help-open');await page.locator('#test-open').click();await page.locator('#test-toggle').click();await page.waitForFunction(()=>!!(window as any).__fishingQA);await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());}
test('Décor de carte : chargement réel, source partagée, qualités et dix transitions stables',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await boot(page);
 await expect.poll(()=>page.evaluate(()=>Object.values((window as any).__fishingQA.water().assets.families).filter((s:any)=>s.startsWith('glb:')).length)).toBe(14);
 await openMenuPage(page,'settings-open');await page.locator('#quality').click();await expect(page.locator('#quality')).toHaveText('Qualité élevée');
 for(const id of ['settings','menu'])if(await page.locator('#'+id).isVisible())await page.locator('[data-close='+id+']').click();
 await page.waitForTimeout(1000);expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().getMeshByName('water').isReady(true))).toBe(true);
 await openMenuPage(page,'settings-open');await page.locator('#quality').click();await expect(page.locator('#quality')).toHaveText('Économie mobile');
 for(const id of ['settings','menu'])if(await page.locator('#'+id).isVisible())await page.locator('[data-close='+id+']').click();
 const measure=()=>page.evaluate(()=>{const q=(window as any).__fishingQA,s=q.waterScene();return{meshes:s.meshes.length,textures:s.textures.length,materials:s.materials.length,engine:q.snapshot().engines,scene:s.uid};});
 const before=await measure();await openMenuPage(page,'help-open');await page.locator('#test-open').click();
 for(let n=0;n<10;n++)await page.locator('#test-post').selectOption(['cove','bank','reed-bank','point','timber','jetty'][n%6]);
 for(const quality of ['high','low','standard']){await page.evaluate(q=>(window as any).__fishingQA.waterQuality(q),quality);await page.waitForTimeout(150);expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().getMeshByName('water').isReady(true))).toBe(true);}
 for(const ambience of ['evening','overcast','morning'])await page.evaluate(a=>(window as any).__fishingQA.ambience(a),ambience);
 expect(await measure()).toEqual(before);
 // Releasing one family must preserve the shared tree source used by the others (fdx-trees.glb).
 expect(await page.evaluate(()=>(window as any).__fishingQA.replaceAsset('tree_oak',null))).toBe(true);
 expect(await page.evaluate(()=>(window as any).__fishingQA.replaceAsset('tree_oak','/models/environment/fdx-trees.glb'))).toBe(true);
 expect(await measure()).toEqual(before);expect(errors).toEqual([]);
 const requests=await page.evaluate(()=>performance.getEntriesByType('resource').filter((r:any)=>r.name.endsWith('/fdx-trees.glb')).length);
 // Once for the normal scene and once for the separate TEST scene, not twice per family.
 expect(requests).toBeLessThanOrEqual(2);
 for(const id of ['test-tools','help','menu'])if(await page.locator('#'+id).isVisible())await page.locator('[data-close='+id+']').click();
 await page.locator('#map-open').click();await expect(page.locator('.post-preview')).toBeVisible();
 await expect.poll(()=>page.locator('.post-preview').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(576);
});
test('Décor de carte : une texture et un modèle indisponibles gardent une carte jouable',async({page})=>{
 await page.route('**/map-assets/ground-macro.jpg',r=>r.abort());await page.route('**/models/environment/fdx-trees.glb',r=>r.abort());
 await boot(page);await expect.poll(()=>page.evaluate(()=>(window as any).__fishingQA.water().assets.families.tree_oak)).toContain('fallback:');
 expect(await page.evaluate(()=>(window as any).__fishingQA.waterScene().getMeshByName('pond-shared-terrain').isReady(true))).toBe(true);
 await openMenuPage(page,'help-open');await page.locator('#test-open').click();await page.locator('#test-post').selectOption('cove');await expect(page.locator('body')).toHaveAttribute('data-post','cove');
});
