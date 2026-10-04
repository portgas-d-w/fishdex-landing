import { expect, type Page } from '@playwright/test';
import {SHOP_PRODUCTS} from '../../src/game/shop';
export async function openShopProduct(page:Page,id:string){await page.locator('#shop-query').fill(SHOP_PRODUCTS.find(p=>p.id===id)!.name);await page.locator(`[data-shop-product="${id}"]`).click();}
export async function buyShopProduct(page:Page,id:string,count=1){await openShopProduct(page,id);if(count!==1)await page.locator('#shop-quantity').fill(String(count));await page.locator('#shop-detail-buy').click();}
export async function equipShopRod(page:Page,id:string){await openShopProduct(page,id);await page.locator('#shop-detail-equip').click();await expect(page.locator('#item-sheet .state-pill')).toHaveText('Équipé');await page.locator('[data-close="item-sheet"]').click();}
export async function chooseMethod(page:Page,method:string) {
  await page.locator('[data-slot="method"]').click();
  if(!await page.locator(`[data-choose-method="${method}"]`).isVisible())await page.locator(`details:has([data-choose-method="${method}"]) > summary`).click();
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

export async function receiveByGesture(page:Page,onLanding?:()=>Promise<void>){
 await page.locator('#tech-land').click();await page.evaluate(()=>(window as any).__fishingQA.advance(.02));await expect(page.locator('body')).toHaveAttribute('data-phase','landing');if(onLanding)await onLanding();
 const move=async(dx:number,dy:number)=>{const b=(await page.locator('#reel-control').boundingBox())!,x=b.x+b.width/2,y=b.y+b.height/2;const session=await page.context().newCDPSession(page);try{await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:19,x,y}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:19,x:x+dx,y:y+dy}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}finally{await session.detach();}};
 for(let n=0;n<90;n++){const s=await page.evaluate(()=>(window as any).__fishingQA.snapshot());if(s.phase!=='landing')break;if(s.netReady)await move(0,-32);else{await move((s.fishPosition.x-s.net.x)/.02,-(s.fishPosition.z-s.net.z)/.025);await page.evaluate(()=>(window as any).__fishingQA.advance(.05,'smart'));}await page.evaluate(()=>(window as any).__fishingQA.advance(.02));}await expect(page.locator('#caught')).toBeVisible();
}
export async function chooseComponent(page:Page,id:string){const b=page.locator('[data-choose-component="'+id+'"]');if(!await b.isVisible())await b.locator('xpath=ancestor::details[1]/summary').click();await b.click();}
