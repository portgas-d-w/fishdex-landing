import {test,expect} from '@playwright/test';
import {emptySave,recordCatch} from '../../src/game/save';
import {openMenuPage} from './helpers';
import {mkdir,writeFile} from 'node:fs/promises';

test('Aquarium : cinq identités et robes, rapports de taille, orbites dans les parois et photos sans gains',async({page},info)=>{
 const save=emptySave();const fixtures=[{speciesId:'roach',length:12},{speciesId:'anguille-europeenne',length:100},{speciesId:'esturgeon-siberien',length:180,appearanceId:'esturgeon-albinos'},{speciesId:'carpe-koi',length:32,appearanceId:'carpe-koi-kohaku'},{speciesId:'pike',length:110}];
 for(const [i,row]of fixtures.entries()){recordCatch(save,{...row,id:'exhibit-'+i,date:'2026-10-03T00:00:00Z',seed:127+i});save.favorites.push('exhibit-'+i);}
 const errors:string[]=[],requests:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.glb'))requests.push(r.url());});await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));localStorage.setItem('au-fil-de-leau.gestures.v3','3');},save);
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');expect(requests).toEqual([]);
 await openMenuPage(page,'aquarium-open');await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded','true');const state=await page.evaluate(()=>(window as any).__fishingQA.snapshot());expect(state.aquarium.count).toBe(5);expect(state.engines).toBe(2);
 const orbit=await page.evaluate(()=>(window as any).__fishingQA.aquariumOrbit());
 for(const sample of orbit)for(const fish of sample){expect(fish.bounds.min[0],fish.id).toBeGreaterThan(-4);expect(fish.bounds.max[0],fish.id).toBeLessThan(4);expect(fish.bounds.min[1],fish.id).toBeGreaterThan(.1);expect(fish.bounds.max[1],fish.id).toBeLessThan(4);expect(fish.bounds.min[2],fish.id).toBeGreaterThan(-1);expect(fish.bounds.max[2],fish.id).toBeLessThan(2);}
 // At the quarter turn the world x span equals the normalized longitudinal length.
 const spans=orbit[20].map((f:any)=>f.bounds.max[0]-f.bounds.min[0]);expect(spans[0]/spans[2]).toBeCloseTo(12/180,2);expect(spans[3]/spans[2]).toBeCloseTo(32/180,2);
 await mkdir('docs/apercus/poissons',{recursive:true});await page.screenshot({path:`docs/apercus/poissons/${info.project.name}-aquarium-five.png`});await writeFile(`docs/apercus/poissons/${info.project.name}-aquarium-bounds.json`,JSON.stringify({fixtures,state,orbitSamples:orbit.length,allInside:true,longitudinalSpans:spans,errors},null,2));
 await page.locator('[data-close=aquarium]').click();await expect.poll(()=>page.evaluate(()=>(window as any).__fishingQA.snapshot().engines)).toBe(1);
 await openMenuPage(page,'collection-open');for(let n=0;n<4;n++){await page.locator('[data-specimen=exhibit-3]').click();await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');await expect(page.locator('#photo-state')).toContainText('Photo conservée');await page.locator('#release-fish').click();}
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.save.v1')!));expect(stored.total).toBe(5);expect(stored.coins).toBe(save.coins);expect(stored.xp).toBe(save.xp);expect(stored.favorites).toEqual(save.favorites);expect(stored.journal.map((s:any)=>s.appearanceId)).toEqual(save.journal.map(s=>s.appearanceId));expect(errors).toEqual([]);
});

test('Comparaison de profils accessible, taille refusée explicitement, aucun effet sur la partie',async({page})=>{
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'help-open');await page.locator('#test-open').click();await page.locator('#test-toggle').click();await expect(page.locator('body')).toHaveAttribute('data-ready','true');await openMenuPage(page,'help-open');await page.locator('#test-open').click();await page.locator('#test-species').selectOption('roach');await page.locator('#test-fish-kit').click();await page.locator('#test-tools summary').filter({hasText:'Comparer deux profils'}).click();await page.locator('#test-compare-species').selectOption('perch');await page.locator('#test-compare').click();await expect(page.locator('#test-comparison')).toContainText('burstSeconds');await page.locator('#test-compare-species').selectOption('gobie');await page.locator('#test-length').fill('30');await page.locator('#test-compare').click();await expect(page.locator('#test-comparison')).toContainText('Taille hors des limites');const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('au-fil-de-leau.test.save.v1')!));expect(saved.total).toBe(0);expect(saved.coins).toBe(0);
});
