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

export async function realCombat(page:Page,context:BrowserContext,mobile:boolean,pole=false){
  const size=page.viewportSize()!,touch=mobile?await context.newCDPSession(page):undefined;
  await expect(page.locator('#tension-display')).toBeVisible();
  const b = pole?{x:0,y:0,width:0,height:0}:(await page.locator('#reel-control').boundingBox())!;
  const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
  const rb = (await page.locator('#rod-control').boundingBox())!;
  const x0 = mobile ? rb.x + rb.width / 2 : size.width * .42, y0 = mobile ? rb.y + rb.height / 2 : size.height * .47;
  let reelHeld = false;
  let poleLift=.18;
  let rod = { id: 10, x: x0, y: y0 }, reel = { id: 20, x: cx, y: cy };
  if (touch) {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod] });
  } else { await page.mouse.move(x0, y0); await page.mouse.down(); }
  const deadline = Date.now() + 85_000;
  while (Date.now() < deadline && await page.locator('body').getAttribute('data-phase') === 'fighting') {
    // Lecture de l’équivalent accessible du fil visible, pas d’état interne du jeu.
    const cue = (await page.locator('#world').getAttribute('aria-description'))?.match(/Fil à (-?\d+) degrés, tension (\d+)/);
    if (cue) {
      const yaw = Math.max(-.9, Math.min(.9, Math.sin(Number(cue[1]) * Math.PI / 180) / .40));
      const tension = Number(cue[2]);if(pole)poleLift=Math.max(0,Math.min(1,poleLift+(tension<30?.018:tension>65?-.028:0)));
      const lift = pole?poleLift:tension > 68 ? .28 : .55;
      rod = { ...rod, x: x0 + yaw * (mobile ? 32 : Math.min(600, size.width) * .28), y: y0 - (lift - (pole?.18:.5)) * (mobile ? 64 : Math.min(600, size.height) * .35) };
      if (touch) {
        const shouldReel = !pole&&tension < 72;
        if (shouldReel && !reelHeld) await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod, reel] });
        else if (!shouldReel && reelHeld) await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [reel] });
        reelHeld = shouldReel;
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: reelHeld ? [rod, reel] : [rod] });
      } else {
        await page.mouse.move(rod.x, rod.y);
        if (!pole&&tension < 72) await page.mouse.wheel(0, 75);
      }
    }
    await page.waitForTimeout(100);
  }
  if (touch) await touch.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  else await page.mouse.up();
  if(await page.locator('body').getAttribute('data-phase')==='landing'){
    await expect(page.locator('#tech-land')).toBeEnabled();await page.locator('#tech-land').click();
  }
  await expect(page.locator('#caught')).toBeVisible();
}
