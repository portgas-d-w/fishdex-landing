import {test,expect} from '@playwright/test';
import {castByGesture} from './helpers';
test('Départ bas, préparation visible, relâchement seul, refus et annulations',async({page},info)=>{
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 const w=page.viewportSize()!.width,h=page.viewportSize()!.height;const canvas=page.locator('#world');
 await page.keyboard.press('Space');await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 for(const [start,dx,dy] of [[.5,0,-h*.3],[.8,4,-3],[.8,w*.5,-h*.4],[.8,0,-h*.12]]){
  await page.mouse.move(w*.4,h*start);await page.mouse.down();await page.mouse.move(w*.4+dx,h*start+dy,{steps:5});await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 }
 await page.mouse.move(w*.4,h*.8);await page.mouse.down();await page.mouse.move(w*.45,h*.45,{steps:8});
 await expect(page.locator('body')).toHaveAttribute('data-phase','idle');expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().lift)).toBeGreaterThan(.65);
 await canvas.dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().lift)).toBe(.5);
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(400);await page.screenshot({path:`test-results/physics-${info.project.name}-landscape.png`});
 await page.locator('#menu-open').click();await page.locator('#equipment-open').click();await expect(page.locator('[data-method="lure"]')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-close="preparation"]').click();await page.locator('[data-close="menu"]').click();
 await castByGesture(page);await expect(page.locator('body')).toHaveAttribute('data-phase','casting');
});

test('Un long lancer lent reste court ; une projection rapide gagne de la distance',async({page})=>{
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 const w=page.viewportSize()!.width,h=page.viewportSize()!.height;
 await page.mouse.move(w*.45,h*.8);await page.mouse.down();
 for(let i=1;i<=30;i++){await page.mouse.move(w*.45,h*(.8-.35*i/30));await page.waitForTimeout(50);}
 await page.mouse.up();await expect(page.locator('body')).toHaveAttribute('data-phase','casting');
 const slow=await page.evaluate(()=>(window as any).__fishingQA.snapshot().target.z);
 await page.locator('#cancel-cast').click();await castByGesture(page);
 const fast=await page.evaluate(()=>(window as any).__fishingQA.snapshot().target.z);
 expect(fast).toBeGreaterThan(slow+7);
});
