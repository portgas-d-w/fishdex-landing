import { test, expect } from '@playwright/test';
import { castByGesture, openMenuPage, holdMouseReel } from './helpers';
import { emptySave, recordCatch } from '../../src/game/save';

test('Appui long, glissement et nettoyage : aucune sélection ni menu natif sur le jeu', async ({page,context},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());
 const w=page.viewportSize()!.width,h=page.viewportSize()!.height;
 if(info.project.name==='mobile') {
  const touch=await context.newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:31,x:w*.45,y:h*.8}]});
  await page.waitForTimeout(1100);
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 } else {await page.mouse.move(w*.45,h*.8);await page.mouse.down();await page.waitForTimeout(1100);await page.mouse.up();}
 await expect(page.locator('body')).toHaveAttribute('data-phase','idle');
 expect(await page.evaluate(()=>getSelection()?.toString())).toBe('');
 await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(45));await page.locator('#strike').click();
 const protection=await page.evaluate(()=>['#world','#rod-control','#reel-control'].map(selector=>{
  const element=document.querySelector(selector)!,style=getComputedStyle(element);
  return {select:style.userSelect,webkit:style.webkitUserSelect,touch:style.touchAction,
   context:!element.dispatchEvent(new Event('contextmenu',{bubbles:true,cancelable:true})),drag:!element.dispatchEvent(new Event('dragstart',{bubbles:true,cancelable:true})),selection:!element.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}))};
 }));
 for(const surface of protection)expect(surface).toEqual({select:'none',webkit:'none',touch:'none',context:true,drag:true,selection:true});
 await holdMouseReel(page);expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();
 expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(false);
 await page.locator('#resume').click();await page.mouse.move(w*.5,h*.4);
 await page.screenshot({path:`test-results/touch-${info.project.name}-fight.png`});expect(errors).toEqual([]);
});

test('Carnet et boutique défilent naturellement ; recherche et sélection restent éditables', async ({page,context},info)=>{
 const seed=emptySave();for(let i=0;i<20;i++)recordCatch(seed,{id:`touch-${i}`,speciesId:'roach',length:20,date:'2026-10-01T10:00:00Z'});
 await page.addInitScript(data=>localStorage.setItem('au-fil-de-leau.save.v1',JSON.stringify(data)),seed);
 await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 const touch=info.project.name==='mobile'?await context.newCDPSession(page):undefined;
 for(const [opener,id] of [['collection-open','collection'],['shop-open','shop']]) {
  await openMenuPage(page,opener);const dialog=page.locator(`#${id}`);const b=(await dialog.boundingBox())!;
  expect(await dialog.evaluate(el=>getComputedStyle(el).touchAction)).toBe('pan-y');
  expect(await dialog.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true);
  if(touch){const x=b.x+b.width*.82,y=b.y+b.height*.78;
   await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:41,x,y}]});
   for(let i=1;i<=8;i++){await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:41,x,y:y-i*25}]});await page.waitForTimeout(25);}
   await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } else {await page.mouse.move(b.x+b.width*.8,b.y+b.height*.7);await page.mouse.wheel(0,450);}
  await expect.poll(()=>dialog.evaluate(el=>el.scrollTop)).toBeGreaterThan(50);
  await dialog.evaluate(el=>el.scrollTop=0);await page.locator(`[data-close="${id}"]`).click();
 }
 await openMenuPage(page,'dex-open');const field=page.locator('#dex-search');await field.fill('gardon');
 await expect(page.locator('.dex-tile')).toHaveCount(1);
 const native=await field.evaluate(el=>{const input=el as HTMLInputElement;input.select();const s=getComputedStyle(el);return {select:s.userSelect,webkit:s.webkitUserSelect,start:input.selectionStart,end:input.selectionEnd,context:el.dispatchEvent(new Event('contextmenu',{bubbles:true,cancelable:true})),selection:el.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true})),app:getComputedStyle(document.querySelector('#app')!).touchAction};});
 expect(native).toEqual({select:'text',webkit:'text',start:0,end:6,context:true,selection:true,app:'auto'});
 await field.press('Backspace');await field.pressSequentially('perche');await expect(field).toHaveValue('perche');await expect(page.locator('.dex-tile')).toHaveCount(2);
 await page.screenshot({path:`test-results/touch-${info.project.name}-search.png`});
});
