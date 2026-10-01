import { test, expect } from '@playwright/test';
import { castByGesture } from './helpers';

test('Canne visible aux quatre orientations et deux commandes avec jauge compacte', async ({ page }, info) => {
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => (window as any).__fishingQA.pauseSimulation());
  await castByGesture(page); await page.evaluate(() => (window as any).__fishingQA.advance(10)); await page.locator('#strike').click();
  await page.waitForTimeout(5200);
  for (const [i, dx, dy] of [[0, 32, -32], [1, -64, 64], [2, 64, 0], [3, -64, -64]]) {
    const b = (await page.locator('#rod-control').boundingBox())!, x = b.x + b.width / 2, y = b.y + b.height / 2;
    await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + dx, y + dy, { steps: 6 }); await page.mouse.up();
    await page.waitForTimeout(150);
    const tip = await page.evaluate(() => (window as any).__fishingQA.snapshot().rodTip);
    expect(tip.x).toBeGreaterThan(0); expect(tip.x).toBeLessThan(1); expect(tip.y).toBeGreaterThan(0); expect(tip.y).toBeLessThan(1);
    await page.screenshot({ path: `test-results/immersion-${info.project.name}-rod-${i}.png` });
  }
});
