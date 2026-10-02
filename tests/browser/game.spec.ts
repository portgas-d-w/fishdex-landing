import {ensureLegacyProfile} from './helpers';
import { test, expect } from '@playwright/test';
import { SPECIES } from '../../src/game/catalog';
import { castByGesture, openMenuPage, holdMouseReel } from './helpers';
test('Prise par geste, commandes compactes et carnet conservé', async ({ page }, info) => {
 const errors: string[]=[]; page.on('pageerror',e=>errors.push(e.message));
 await ensureLegacyProfile(page); await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation()); await page.waitForTimeout(5200);
 expect(await page.locator('#action').count()).toBe(0); expect(await page.locator('.play-card,.topbar,.travel-nav,footer').count()).toBe(0);
 expect(await page.locator('#fight-note').count()).toBe(0);await expect(page.locator('#tension-display')).toBeHidden();
 await expect(page.locator('#menu-open')).toBeVisible(); await expect(page.locator('#collection-open')).toBeHidden();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/immersion-${info.project.name}-lake.png`});
 await castByGesture(page); await page.evaluate(()=>(window as any).__fishingQA.advance(45)); await page.locator('#strike').click();
 await expect(page.locator('#prepare-open')).toBeHidden(); await expect(page.locator('#reel-control')).toBeVisible();
 await expect(page.locator('#rod-control')).toBeVisible();
 await expect(page.locator('#tension-display')).toBeVisible();
 await expect(page.locator('#tension-meter')).toHaveAttribute('aria-valuenow','32');
 await holdMouseReel(page); await page.locator('#reel-control').dispatchEvent('pointercancel',{pointerId:1}); await page.mouse.up();
 expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(false);
 await page.waitForTimeout(5200); await page.screenshot({path:`test-results/immersion-${info.project.name}-fight.png`});
 await page.evaluate(()=>(window as any).__fishingQA.advance(80,'smart'));
 await expect(page.locator('#tension-display')).toBeHidden();
 await expect(page.locator('#caught')).toBeVisible(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');
 await expect(page.locator('#preview-error')).toBeHidden(); expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().total)).toBe(1);
 await page.screenshot({path:`test-results/immersion-${info.project.name}-catch.png`}); await page.locator('#release-fish').click();
 await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await openMenuPage(page,'collection-open'); await expect(page.locator('#collection-count')).toHaveText('1 captures · 0 observations');
 await expect(page.locator('.fish-entry:not(.undiscovered)')).toHaveCount(1); expect(errors).toEqual([]);
});
test('Menu au combat : pause, gestes neutralisés, retours et import invalide',async({page},info)=>{
 await ensureLegacyProfile(page); await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await castByGesture(page); await page.evaluate(()=>(window as any).__fishingQA.advance(45)); await page.locator('#strike').click();
 await page.locator('#menu-open').click(); const before=await page.evaluate(()=>(window as any).__fishingQA.snapshot());
 await page.locator('#world').dispatchEvent('pointerdown',{pointerId:42,button:0,clientX:140,clientY:300});
 await page.locator('#world').dispatchEvent('pointermove',{pointerId:42,clientX:200,clientY:200}); await page.mouse.wheel(0,120);
 await page.waitForTimeout(300); const after=await page.evaluate(()=>(window as any).__fishingQA.snapshot());
 expect(after.tension).toBe(before.tension);expect(after.progress).toBe(before.progress);expect(after.yaw).toBe(before.yaw);expect(after.reeling).toBe(false);
 await page.screenshot({path:`test-results/immersion-${info.project.name}-menu.png`});
 await openMenuPage(page,'collection-open'); await page.locator('#save-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":999}')});
 await expect(page.locator('#toast')).toContainText('non pris en charge'); expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().total)).toBe(0);
 await page.locator('[data-close="collection"]').click(); await expect(page.locator('#menu')).toBeVisible();
 await page.locator('[data-close="menu"]').click(); await expect.poll(()=>page.evaluate(()=>(window as any).__fishingQA.snapshot().paused)).toBe(false);
});
test('Interruptions de l’appui, molette et fermeture de page',async({page})=>{
 await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(45));await page.locator('#strike').click();
 for(const type of ['pointercancel','lostpointercapture']){
  await holdMouseReel(page);expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
  await page.locator('#reel-control').dispatchEvent(type,{pointerId:1});expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(false);await page.mouse.up();
 }
 await page.mouse.move(150,300);await page.mouse.wheel(0,100);expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
 await page.evaluate(()=>(window as any).__fishingQA.advance(.1));
 const tension=await page.evaluate(()=>Math.round((window as any).__fishingQA.snapshot().tension*100));
 await expect(page.locator('#tension-meter')).toHaveAttribute('aria-valuenow',String(tension));
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));
 const paused=await page.evaluate(()=>(window as any).__fishingQA.snapshot());expect(paused.reeling).toBe(false);expect(paused.paused).toBe(true);
 await page.locator('#resume').click();expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().paused)).toBe(false);
});
