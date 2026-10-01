import {test,expect} from '@playwright/test';
import {castByGesture,turnMouseReel} from './helpers';
async function start(page:any) {
 await page.addInitScript(()=>{Math.random=()=>.999;localStorage.setItem('au-fil-de-leau.gestures.v3','3');});
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(10));await page.locator('#strike').click();
}
test('Départ puissant : traction et frein sans moulinage ; insister crée un risque de casse',async({page},info)=>{
 await start(page);const b=(await page.locator('#rod-control').boundingBox())!,cx=b.x+b.width/2,cy=b.y+b.height/2;
 await page.mouse.move(cx,cy);await page.mouse.down();
 for(let i=0;i<37;i++){
  const yaw=await page.evaluate(()=>(window as any).__fishingQA.snapshot().direction);
  await page.mouse.move(cx+yaw*32,cy+(.5-.28)*64);await page.evaluate(()=>(window as any).__fishingQA.advance(.15));
 }
 const burst=await page.evaluate(()=>(window as any).__fishingQA.snapshot());
 expect(burst.phase).toBe('fighting');expect(burst.pulling).toBe(true);expect(burst.reeling).toBe(false);
 expect(burst.tension).toBeGreaterThan(.55);expect(burst.tension).toBeLessThan(.97);expect(burst.dragSpeed).toBeGreaterThan(.1);expect(burst.fatigue).toBeGreaterThan(.05);
 await page.screenshot({path:`test-results/physics-${info.project.name}-brake.png`});
 const angle=await page.locator('#reel-control').evaluate(el=>(el as HTMLElement).style.getPropertyValue('--reel-angle'));
 await page.evaluate(()=>(window as any).__fishingQA.resumeSimulation());await page.waitForTimeout(180);await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 expect(await page.locator('#reel-control').evaluate(el=>(el as HTMLElement).style.getPropertyValue('--reel-angle'))).not.toBe(angle);
 await page.mouse.move(cx-32,cy-32);await page.mouse.up();await page.mouse.move(150,300);
 let peak=0;
 for(let i=0;i<120;i++){
  if(info.project.name==='mobile')await turnMouseReel(page);else await page.mouse.wheel(0,240);
  await page.waitForTimeout(50);await page.evaluate(()=>(window as any).__fishingQA.advance(.1));
  if(info.project.name==='mobile')await page.mouse.up();
  const s=await page.evaluate(()=>(window as any).__fishingQA.snapshot());peak=Math.max(peak,s.tension);if(s.phase==='lost')break;
 }
 expect(peak).toBeGreaterThan(.97);await expect(page.locator('body')).toHaveAttribute('data-phase','lost');
});
test('Retour vers le joueur : le moulinet reprend le mou et rétablit le contact',async({page},info)=>{
 await start(page);await page.evaluate(()=>(window as any).__fishingQA.advance(3));
 const before=await page.evaluate(()=>(window as any).__fishingQA.snapshot());expect(before.returning).toBe(true);expect(before.slack).toBeGreaterThan(.1);
 await page.mouse.move(150,300);
 for(let i=0;i<5;i++){
  if(info.project.name==='mobile')await turnMouseReel(page);else await page.mouse.wheel(0,120);
  await page.waitForTimeout(50);await page.evaluate(()=>(window as any).__fishingQA.advance(.1));
  if(info.project.name==='mobile')await page.mouse.up();
 }
 const after=await page.evaluate(()=>(window as any).__fishingQA.snapshot());expect(after.slack).toBeLessThan(before.slack);expect(after.tension).toBeGreaterThan(.1);
});
