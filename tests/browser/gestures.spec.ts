import {test,expect} from '@playwright/test';
import {castByGesture} from './helpers';
test('Gestes courts, hors eau, diagonaux, annulés et redimensionnement',async({page},info)=>{
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 const w=page.viewportSize()!.width,h=page.viewportSize()!.height;const canvas=page.locator('#world');
 await page.keyboard.press('Space');await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 for(const [dx,dy] of [[4,-3],[w*.4,-h*.15],[0,-h*.5]]){
  await page.mouse.move(w*.4,h*.6);await page.mouse.down();await page.mouse.move(w*.4+dx,h*.6+dy);await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 }
 await page.mouse.move(w*.4,h*.6);await page.mouse.down();await page.mouse.move(w*.45,h*.47);await canvas.dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(400);await page.screenshot({path:`test-results/immersion-${info.project.name}-landscape.png`});
 await page.locator('#menu-open').click();await page.locator('#equipment-open').click();await expect(page.locator('[data-method="lure"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-close="preparation"]').click();await page.locator('[data-close="menu"]').click();
 await castByGesture(page);await expect(page.locator('body')).toHaveAttribute('data-phase','casting');
});
