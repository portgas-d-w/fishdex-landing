import { test, expect } from '@playwright/test';
test('Leurre et fond : contrôles utiles, annulation et capture propre', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); await page.evaluate(() => (window as any).__fishingQA.pauseSimulation());
  await page.locator('[data-method="bottom"]').click(); await page.locator('#action').click(); await page.evaluate(() => (window as any).__fishingQA.advance(3));
  await expect(page.locator('#instruction')).toContainText('fond'); await page.locator('#cancel-cast').click(); await expect(page.locator('body')).toHaveAttribute('data-phase', 'idle');
  await page.locator('[data-method="lure"]').click(); await page.locator('#action').click(); await page.evaluate(() => (window as any).__fishingQA.advance(2));
  await expect(page.locator('#instruction')).toContainText('leurre'); await page.evaluate(() => (window as any).__fishingQA.advance(10)); await expect(page.locator('body')).toHaveAttribute('data-phase', 'waiting');
  await page.keyboard.down('Space'); await expect(page.locator('#action')).toHaveClass(/reeling/); await page.mouse.move(170, 360); await page.mouse.down(); await page.mouse.move(210, 320); await page.mouse.up();
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(true);
  await page.evaluate(() => (window as any).__fishingQA.advance(20)); await page.keyboard.up('Space'); await expect(page.locator('body')).toHaveAttribute('data-phase', 'bite');
  await page.screenshot({ path: `test-results/${info.project.name}-lure.png` }); await page.locator('#action').click(); await page.evaluate(() => (window as any).__fishingQA.advance(80, 'smart'));
  await expect(page.locator('#caught')).toBeVisible(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true'); expect(errors).toEqual([]);
});
