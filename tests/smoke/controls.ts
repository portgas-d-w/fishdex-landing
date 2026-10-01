import { expect, type Page, type BrowserContext } from '@playwright/test';
import { castByGesture } from '../browser/helpers';

// Commandes du build public, sans API QA ni accélération de simulation.
export async function realFishing(page: Page, context: BrowserContext, mobile: boolean) {
  const size = page.viewportSize()!;
  const touch = mobile ? await context.newCDPSession(page) : undefined;
  if (touch) {
    const x = size.width * .45;
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 30, x, y: size.height * .60 }] });
    for (let i = 1; i <= 8; i++) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 30, x, y: size.height * (.60 - .13 * i / 8) }] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else await castByGesture(page);
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'bite');
  await page.locator('#strike').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'fighting');
  await expect(page.locator('#tension-display')).toBeVisible();
  const b = (await page.locator('#reel-control').boundingBox())!;
  const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
  const rb = (await page.locator('#rod-control').boundingBox())!;
  const x0 = mobile ? rb.x + rb.width / 2 : size.width * .42, y0 = mobile ? rb.y + rb.height / 2 : size.height * .47;
  let angle = 0;
  let rod = { id: 10, x: x0, y: y0 }, reel = { id: 20, x: cx + 28, y: cy };
  if (touch) {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod] });
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod, reel] });
  } else { await page.mouse.move(x0, y0); await page.mouse.down(); }
  const deadline = Date.now() + 85_000;
  while (Date.now() < deadline && await page.locator('body').getAttribute('data-phase') === 'fighting') {
    // Lecture de l’équivalent accessible du fil visible, pas d’état interne du jeu.
    const cue = (await page.locator('#world').getAttribute('aria-description'))?.match(/Fil à (-?\d+) degrés, tension (\d+)/);
    if (cue) {
      const yaw = Math.max(-.9, Math.min(.9, Math.sin(Number(cue[1]) * Math.PI / 180) / .40));
      const tension = Number(cue[2]), lift = tension > 68 ? .18 : .68;
      rod = { ...rod, x: x0 + yaw * (mobile ? 32 : Math.min(600, size.width) * .28), y: y0 - (lift - .5) * (mobile ? 64 : Math.min(600, size.height) * .35) };
      if (touch) {
        if (tension < 80) angle += .85;
        reel = { ...reel, x: cx + 28 * Math.cos(angle), y: cy + 28 * Math.sin(angle) };
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [rod, reel] });
      } else {
        await page.mouse.move(rod.x, rod.y);
        if (tension < 80) await page.mouse.wheel(0, 75);
      }
    }
    await page.waitForTimeout(100);
  }
  if (touch) await touch.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  else await page.mouse.up();
  await expect(page.locator('#caught')).toBeVisible();
}
