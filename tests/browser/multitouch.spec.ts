import {ensureLegacyProfile} from './helpers';
import {test,expect} from '@playwright/test';
import {castByGesture} from './helpers';
test('Deux vrais doigts : appui maintenu, canne simultanée, maintien immobile et annulation',async({page,context},info)=>{
 test.skip(info.project.name!=='mobile','Deux doigts réels sur le profil tactile Chromium.');
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ensureLegacyProfile(page); await page.goto('/');await expect(page.locator('body')).toHaveAttribute('data-ready','true');
 await page.evaluate(()=>(window as any).__fishingQA.pauseSimulation());await castByGesture(page);await page.evaluate(()=>(window as any).__fishingQA.advance(45));await page.locator('#strike').click();
 const b=(await page.locator('#reel-control').boundingBox())!,cx=b.x+b.width/2,cy=b.y+b.height/2,session=await context.newCDPSession(page);
 const rb=(await page.locator('#rod-control').boundingBox())!,rx=rb.x+rb.width/2,ry=rb.y+rb.height/2;
 let rod={id:10,x:rx,y:ry},reel={id:20,x:cx+28,y:cy};
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rod]});await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rod,reel]});
 expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
 for(let i=1;i<=5;i++){rod={...rod,x:rx+i*4.5,y:ry-i*3};await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[rod,reel]});}
 const moved=await page.evaluate(()=>(window as any).__fishingQA.snapshot());expect(moved.reeling).toBe(true);expect(moved.yaw).toBeGreaterThan(.5);expect(moved.lift).toBeGreaterThan(.6);
 await page.waitForTimeout(1100);expect(await page.evaluate(()=>getSelection()?.toString())).toBe('');await page.evaluate(()=>(window as any).__fishingQA.advance(.5));expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
 reel={...reel,x:cx-14,y:cy+24};await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[rod,reel]});
 await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[rod]});expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(true);
 await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().reeling)).toBe(false);
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:30,x:rx,y:ry}]});
 await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
 const yaw=await page.evaluate(()=>(window as any).__fishingQA.snapshot().yaw);
 await page.locator('#rod-control').dispatchEvent('pointermove',{pointerId:99,clientX:rx-40,clientY:ry+40});expect(await page.evaluate(()=>(window as any).__fishingQA.snapshot().yaw)).toBe(yaw);
 await page.setViewportSize({width:844,height:390});await page.waitForTimeout(300);await expect(page.locator('#rod-control')).toBeVisible();await expect(page.locator('#reel-control')).toBeVisible();
 await page.waitForTimeout(5200);await page.screenshot({path:'test-results/immersion-mobile-landscape-fight.png'});expect(errors).toEqual([]);
});
