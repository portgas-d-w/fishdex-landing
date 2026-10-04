import { expect, type Page, type BrowserContext } from '@playwright/test';
import { castByGesture } from '../browser/helpers';

// Commandes du build public, sans API QA ni accélération de simulation.
export async function realFishing(page: Page, context: BrowserContext, mobile: boolean, pole=false) {
  const size = page.viewportSize()!;
  const touch = mobile ? await context.newCDPSession(page) : undefined;
  if (touch) {
    const x = size.width * .45;
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 30, x, y: size.height * .80 }] });
    for (let i = 1; i <= 8; i++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 30, x, y: size.height * (.80 - .35 * i / 8) }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else await castByGesture(page);
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'bite');
  await page.locator('#strike').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'fighting');
  await realCombat(page,context,mobile,pole);
}

export async function realCombat(page:Page,context:BrowserContext,_mobile:boolean,pole=false,maxSeconds=85){
 await page.bringToFront();if(await page.locator('#resume').isVisible())await page.locator('#resume').click();
 const touch=await context.newCDPSession(page),rb=(await page.locator('#rod-control').boundingBox())!;
 const x0=rb.x+rb.width/2,y0=rb.y+rb.height/2;const initial=(await page.locator('#world').getAttribute('aria-description'))?.match(/Canne latérale (-?\d+) pour cent, hauteur (\d+)/);let yaw0=Number(initial?.[1]??0)/100,lift0=Number(initial?.[2]??(pole?18:50))/100,lift=lift0;
 let rod={id:10,x:x0,y:y0},secondary={id:20,x:0,y:0},held=false,rodHeld=false;
 const clear=async()=>{if(held||rodHeld)await touch.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});held=false;rodHeld=false;};
 const drag=async(dx:number,dy:number)=>{const b=(await page.locator('#reel-control').boundingBox())!,x=b.x+b.width/2,y=b.y+b.height/2;await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:20,x,y}]});for(let n=1;n<=5;n++)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:20,x:x+dx*n/5,y:y+dy*n/5}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
 const deadline=Date.now()+maxSeconds*1000;let netPlaced=false;
 while(Date.now()<deadline&&['fighting','landing'].includes(await page.locator('body').getAttribute('data-phase')??'')){
  if(await page.locator('#resume').isVisible()){await clear();await page.bringToFront();await page.locator('#resume').click();}
  const phase=await page.locator('body').getAttribute('data-phase');const signal=(await page.locator('#world').getAttribute('aria-description'))?.match(/tension (\d+)/);const charge=Number(signal?.[1]??0);
  if(phase==='fighting'&&charge>12&&await page.locator('#tech-land').isVisible()){await clear();await page.locator('#tech-land').click();netPlaced=false;await page.waitForTimeout(80);continue;}
  if(phase==='landing'){if(charge<5){await clear();await page.locator('#tech-land').click();await page.waitForTimeout(100);continue;}
   const offset=(await page.locator('#world').getAttribute('aria-description'))?.match(/décalage latéral (-?\d+) cm, avancer (-?\d+) cm/);if(offset&&Math.hypot(Number(offset[1]),Number(offset[2]))>35){await clear();await drag(Math.max(-50,Math.min(50,Number(offset[1])/2)),Math.max(-50,Math.min(50,-Number(offset[2])/2.5)));netPlaced=true;}else if(!offset&&!netPlaced){await clear();await drag(-35,-76);netPlaced=true;}
   if(await page.locator('#reel-control .reel-label').textContent()==='Relever'){await clear();await drag(0,-32);await page.waitForTimeout(120);continue;}
  }
  const cue=(await page.locator('#world').getAttribute('aria-description'))?.match(/Fil à (-?\d+) degrés, tension (\d+)/);
  if(cue){const tension=Number(cue[2]),yaw=Math.max(-.6,Math.min(.6,-Math.sin(Number(cue[1])*Math.PI/180)*.8));lift=pole?Math.max(0,Math.min(.85,lift+(tension<30?.014:tension>65?-.02:0))):.55;rod={...rod,x:x0+(yaw-yaw0)*76,y:y0-(lift-lift0)*130};
   if(!rodHeld){const pose=(await page.locator('#world').getAttribute('aria-description'))?.match(/Canne latérale (-?\d+) pour cent, hauteur (\d+)/);yaw0=Number(pose?.[1]??0)/100;lift0=Number(pose?.[2]??50)/100;rod={...rod,x:x0,y:y0};await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rod]});rodHeld=true;}
   if(!pole&&phase==='fighting'&&!held){const b=(await page.locator('#reel-control').boundingBox())!;secondary={id:20,x:b.x+b.width/2,y:b.y+b.height/2};await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[rod,secondary]});held=true;}
   await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:held?[rod,secondary]:[rod]});
  }
  await page.waitForTimeout(100);
 }
 await clear();await touch.detach();await expect(page.locator('#caught'),'Phase finale : '+await page.locator('body').getAttribute('data-phase')+' '+await page.locator('#test-diagnostics').textContent()).toBeVisible();
}
