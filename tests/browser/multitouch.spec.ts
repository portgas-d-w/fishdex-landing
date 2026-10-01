import { test, expect } from '@playwright/test';
test('Deux vrais doigts Chromium : orientation indépendante du moulinet et annulation', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'mobile', 'Commande à deux doigts sur le viewport tactile.');
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => (window as any).__fishingQA.pauseSimulation()); await page.locator('#action').click(); await page.evaluate(() => (window as any).__fishingQA.advance(10)); await page.locator('#action').click();
  const bounds = (await page.locator('#action').boundingBox())!;
  const session = await context.newCDPSession(page);
  await page.evaluate(() => { (window as any).__touchEvents = []; for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'lostpointercapture']) window.addEventListener(type, e => (window as any).__touchEvents.push({ type, id: (e as PointerEvent).pointerId, target: (e.target as HTMLElement).id }), true); });
  const rod = { id: 10, x: 150, y: 360 }, reel = { id: 20, x: bounds.x + bounds.width / 2, y: bounds.y + 20 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [rod, reel] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...rod, x: 220, y: 315 }, reel] });
  const moved = await page.evaluate(() => (window as any).__fishingQA.snapshot()); expect(moved.reeling).toBe(true); expect(moved.yaw).toBeGreaterThan(0.3); expect(moved.lift).toBeGreaterThan(0.5);
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ ...rod, x: 220, y: 315 }] });
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling), JSON.stringify(await page.evaluate(() => (window as any).__touchEvents))).toBe(true);
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(false); expect(errors).toEqual([]);
});
