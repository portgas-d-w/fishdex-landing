import {test,expect} from '@playwright/test';
import {castByGesture,turnMouseReel} from './helpers';
test('Leurre et fond : préparation, molette effective, annulation et prise',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 await page.locator('#prepare-open').click();await page.locator('[data-method="bottom"]').click();await page.locator('[data-close="preparation"]').click();await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(3));
 await expect(page.locator('#reel-control')).toBeHidden();await page.locator('#cancel-cast').click();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 await page.locator('#prepare-open').click();await page.locator('[data-method="lure"]').click();await page.locator('[data-close="preparation"]').click();await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(12));await expect(page.locator('body')).toHaveAttribute('data-phase','waiting');
 for(let i=0;i<100&&await page.locator('body').getAttribute('data-phase')==='waiting';i++){
  if(info.project.name==='mobile') await turnMouseReel(page);
  else {await page.mouse.move(150,300);await page.mouse.wheel(0,120);}
  await page.waitForTimeout(60);await expect.poll(()=>page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);await page.evaluate(()=>(window as any).__fishingQA.advance(.20));
  if(info.project.name==='mobile') await page.mouse.up();
 }
 await expect(page.locator('body')).toHaveAttribute('data-phase','bite');await page.screenshot({path:`test-results/immersion-${info.project.name}-lure.png`});await page.locator('#strike').click();await page.evaluate(()=>(window as any).__fishingQA.advance(80,'smart'));
 await expect(page.locator('#caught')).toBeVisible();await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded','true');expect(errors).toEqual([]);
});
