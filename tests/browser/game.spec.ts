import { test, expect } from '@playwright/test';
import { SPECIES } from '../../src/game/catalog';

test('Une partie complète enregistre la prise et la conserve après rechargement', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  // Les captures logicielles peuvent durer plus que le délai de décrochage.
  // Ce scénario pilote déjà la simulation ; le smoke teste le vrai temps réel.
  await page.evaluate(() => (window as any).__fishingQA.pauseSimulation());
  await expect(page.locator('#action')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${info.project.name}-lake.png` });
  await page.locator('#action').click();
  await page.evaluate(() => (window as any).__fishingQA.advance(10));
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'bite');
  await page.locator('#action').click();
  await expect(page.locator('body')).toHaveAttribute('data-phase', 'fighting');
  const actionBounds = await page.locator('#action').boundingBox();
  await page.mouse.move(actionBounds!.x + actionBounds!.width / 2, actionBounds!.y + 20);
  await page.mouse.down();
  await page.locator('#action').dispatchEvent('pointercancel', { pointerId: 1 });
  await page.mouse.up();
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(false);
  await page.screenshot({ path: `test-results/${info.project.name}-fight.png` });
  await page.evaluate(() => (window as any).__fishingQA.advance(70, 'smart'));
  await expect(page.locator('#caught')).toBeVisible();
  await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  await page.waitForTimeout(400);
  await expect(page.locator('#preview-error')).toBeHidden();
  await page.screenshot({ path: `test-results/${info.project.name}-catch.png` });
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().total)).toBe(1);
  await page.locator('#release-fish').click();
  await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#collection-count')).toHaveText(`1 / ${SPECIES.length}`);
  await page.locator('#collection-open').click(); await expect(page.locator('.fish-entry:not(.undiscovered)')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('Le carnet met le combat en pause ; un import invalide préserve les données', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await page.locator('#action').click(); await page.evaluate(() => (window as any).__fishingQA.advance(10));
  await page.locator('#action').click(); await page.locator('#collection-open').click();
  const before = await page.evaluate(() => (window as any).__fishingQA.snapshot());
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => (window as any).__fishingQA.snapshot());
  expect(after.tension).toBe(before.tension); expect(after.progress).toBe(before.progress);
  await page.locator('#save-file').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"version":999}') });
  await expect(page.locator('#toast')).toContainText('non pris en charge');
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().total)).toBe(0);
});

test('Les interruptions arrêtent le moulinet et la fermeture de page met en pause', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  await page.locator('#action').click();
  await page.evaluate(() => (window as any).__fishingQA.advance(10));
  await page.locator('#action').click();
  const bounds = (await page.locator('#action').boundingBox())!;
  for (const type of ['pointercancel', 'lostpointercapture']) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 20);
    await page.mouse.down();
    expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(true);
    await page.locator('#action').dispatchEvent(type, { pointerId: 1 });
    expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(false);
    await expect(page.locator('#action')).not.toHaveClass(/reeling/);
    await page.mouse.up();
  }
  await page.keyboard.down('Space');
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().reeling)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  const paused = await page.evaluate(() => (window as any).__fishingQA.snapshot());
  expect(paused.reeling).toBe(false); expect(paused.paused).toBe(true);
  await page.keyboard.up('Space');
  await expect(page.locator('#paused')).toBeVisible();
  await page.locator('#resume').click();
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().paused)).toBe(false);
});
