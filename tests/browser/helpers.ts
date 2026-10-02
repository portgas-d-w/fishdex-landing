import { expect, type Page } from '@playwright/test';
export async function chooseMethod(page:Page,method:string) {
  await page.locator('[data-slot="method"]').click();
  if(!await page.locator(`[data-choose-method="${method}"]`).isVisible())await page.locator("#component-sheet details summary").click();
  await page.locator(`[data-choose-method="${method}"]`).click();
}
export async function castByGesture(page: Page) {
  await timedCastGesture(page,120,.45);
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'casting');
}
// Chromium protocol supplies input timestamps, independent of CI/render scheduling.
// Real pointer handlers still consume every event; this is not a physical-touch test.
export async function timedCastGesture(page:Page,durationMs:number,xRatio=.5){
  const size = page.viewportSize()!;
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  const session=await page.context().newCDPSession(page),start=Date.now()/1000,x=size.width*xRatio;
  try{
   await session.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y:size.height*.8,button:'left',buttons:1,clickCount:1,timestamp:start});
   for(let i=1;i<=12;i++)await session.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y:size.height*(.8-.35*i/12),button:'left',buttons:1,timestamp:start+durationMs/1000*i/12});
   await page.waitForTimeout(Math.max(5,(start+durationMs/1000)*1000-Date.now()+5));
   await session.send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y:size.height*.45,button:'left',buttons:0,clickCount:1,timestamp:start+durationMs/1000+.005});
  }finally{await session.detach();}
}
export async function openMenuPage(page: Page, id: string) {
  if (!await page.locator('#menu').isVisible()) await page.locator('#menu-open').click();
  await page.locator(`#${id}`).click();
}
export async function holdMouseReel(page: Page) {
  const b = (await page.locator('#reel-control').boundingBox())!;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
}

import {legacySave} from '../support/legacy';
// Régressions des parcours déjà ouverts avant 0.8 ; la nouvelle partie a ses tests dédiés.
export async function ensureLegacyProfile(page:Page){await page.addInitScript(s=>{if(!localStorage.getItem('au-fil-de-leau.save.v1'))localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(s));},legacySave());}
