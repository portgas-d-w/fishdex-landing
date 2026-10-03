import {receiveByGesture} from './helpers';
import {ensureLegacyProfile} from './helpers';
import { test, expect, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import {recordCatch, purchase} from '../../src/game/save';
import { SPECIES } from '../../src/game/catalog';
import { castByGesture, openMenuPage } from './helpers';

import {legacySave as emptySave} from '../support/legacy';
const stage = process.env.ART_DIRECTION_STAGE || 'after';
const folder = `test-results/regression/basalte-turquoise/${stage}`;
const snapshot = (page: Page) => page.evaluate(() => ({ at: performance.now(), ...(window as any).__fishingQA.snapshot(), render: (window as any).__fishingQA.rendering() }));
async function measure(page: Page) {
  const start = await snapshot(page), samples = [];
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(150); samples.push(await snapshot(page)); }
  const end = samples.at(-1)!;
  const cpu = samples.map(s => s.render.cpuFrameMs).sort((a,b) => a-b);
  return { fps: Math.round((end.lakeFrames-start.lakeFrames)/((end.at-start.at)/1000)*10)/10,
    cpuSubmissionMedianMs: cpu[10], cpuSubmissionP95Ms: cpu[18], render: end.render };
}

test('Référence DA : cadrage constant, parcours complets et mesures de rendu', async ({ page }, info) => {
  await mkdir(folder, { recursive: true });
  const seed = emptySave(); seed.coins = 250;
  for (const [i, fish] of SPECIES.slice(0,5).entries()) {
    recordCatch(seed, { id: `da-${i}`, speciesId: fish.id, length: fish.min + (fish.max-fish.min)*.35, date: '2026-10-02T10:00:00Z' }); seed.favorites.push(`da-${i}`);
  }
  purchase(seed, 'plants'); purchase(seed, 'rocks');
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
  await page.addInitScript(data => { localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)); localStorage.setItem('au-fil-de-leau.gestures.v3','3'); Math.random = () => 0; }, seed);
  await ensureLegacyProfile(page); await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  const picture = async (name:string) => { await page.screenshot({ path:`${folder}/${info.project.name}-${name}.png` }); };
  await page.waitForTimeout(1200); await picture('lake'); const idle = await measure(page);
  await page.locator('#menu-open').click(); await picture('menu');
  for (const [entry, modal] of [['dex-open','encyclopedia'],['equipment-open','preparation'],['shop-open','shop'],['collection-open','collection'],['progress-open','progression'],['locations-open','locations'],['help-open','help']]) {
    await openMenuPage(page,entry); await picture(modal);
    if (modal==='encyclopedia') { await page.locator('#dex-search').fill('gardon'); await page.locator('.dex-tile').click(); await picture('species'); await page.locator('[data-close="species-sheet"]').click(); await page.locator('#dex-search').fill(''); }
    if (modal==='preparation') { await page.locator('[data-work-rig]').first().click(); await picture('rig'); await page.locator('#rig-done').click(); await page.locator('[data-work-tab="bag"]').click(); await picture('bag'); }
    await page.locator(`[data-close="${modal}"]`).click();
  }
  await openMenuPage(page,'aquarium-open'); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded','true');
  await picture('aquarium'); const a = await snapshot(page); await page.waitForTimeout(3000); const b = await snapshot(page);
  expect(b.lakeFrames).toBe(a.lakeFrames);
  const aquariumFps = Math.round((b.aquarium.frames-a.aquarium.frames)/((b.at-a.at)/1000)*10)/10;
  await page.locator('[data-close="aquarium"]').click(); await page.locator('[data-close="menu"]').click();
  await page.evaluate(() => (window as any).__fishingQA.pauseSimulation()); await castByGesture(page); await picture('cast');
  await page.evaluate(() => (window as any).__fishingQA.advance(45)); await page.locator('#strike').click();
  await picture('fight'); const fight = await measure(page);
  await page.evaluate(() => (window as any).__fishingQA.advance(100,'smart'));await receiveByGesture(page); await expect(page.locator('#caught')).toBeVisible();
  await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true'); await picture('catch');
  await page.locator('#release-fish').click();
  if (info.project.name==='mobile') {
    for (const width of [320,430]) { await page.setViewportSize({width,height:844}); await openMenuPage(page,'dex-open'); await picture(`dex-${width}`);
      expect(await page.locator('#encyclopedia').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true); await page.locator('[data-close="encyclopedia"]').click(); }
    await page.setViewportSize({width:844,height:390}); await page.locator('[data-close="menu"]').click(); await picture('landscape');
    await openMenuPage(page,'equipment-open'); await picture('landscape-rod');
  }
  await writeFile(`${folder}/${info.project.name}-metrics.json`,JSON.stringify({stage,viewport:info.project.use.viewport,renderer:'Windows Chromium ANGLE SwiftShader, eco ; 20 échantillons après échauffement, pas un GPU mobile',idle,fight,aquariumFps,backgroundLakeFrames:b.lakeFrames-a.lakeFrames},null,2));
  expect(errors).toEqual([]);
});

test('Lisibilité à 320/390/430 px et paysage : panneaux, contrastes et cibles tactiles', async ({ page }, info) => {
  test.skip(stage==='before' || info.project.name!=='mobile', 'Contrôle du thème final et des petits formats.');
  const seed=emptySave(); recordCatch(seed,{id:'lisibilite',speciesId:'roach',length:22,date:'2026-10-02T10:00:00Z'});
  await page.addInitScript(data=>localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(data)),seed);
  await ensureLegacyProfile(page); await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
  for(const [width,height] of [[320,844],[390,844],[430,844],[844,390]]) {
    await page.setViewportSize({width,height});
    for(const [entry,id] of [['dex-open','encyclopedia'],['equipment-open','preparation'],['shop-open','shop'],['collection-open','collection'],['progress-open','progression'],['locations-open','locations'],['help-open','help']]) {
      await openMenuPage(page,entry);const panel=page.locator(`#${id}`);
      expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1),`${id} ${width}`).toBe(true);
      const header=await panel.locator('.modal-header').evaluate(e=>{
        const style=getComputedStyle(e),title=getComputedStyle(e.querySelector('h2')!);
        return {background:style.backgroundColor,titleSize:parseFloat(title.fontSize)};
      });
      expect(header.background).toBe('rgb(23, 31, 34)'); expect(header.titleSize).toBeLessThanOrEqual(24);
      if(id==='preparation') {
        for(const pin of await panel.locator('.rod-pin').all()) {const box=await pin.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);}
        await panel.locator('[data-work-tab="bag"]').click();expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
      }
      if(id==='shop') {
        await panel.evaluate(e=>e.scrollTop=e.scrollHeight);const box=await panel.locator('.modal-header').boundingBox(),bounds=await panel.boundingBox();
        expect(box!.y).toBeGreaterThanOrEqual(bounds!.y);expect(box!.y+box!.height).toBeLessThan(bounds!.y+bounds!.height);
      }
      await page.locator(`[data-close="${id}"]`).click();
    }
  }
  await openMenuPage(page,'equipment-open');await page.locator('[data-work-rig]').first().click();
  const contrast=await page.locator('#rig-done').evaluate(e=>{
    const s=getComputedStyle(e),rgb=(v:string)=>v.match(/[\d.]+/g)!.slice(0,3).map(Number);
    const luminance=(v:string)=>rgb(v).map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
    const a=luminance(s.color),b=luminance(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('#rig-done').evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
});
