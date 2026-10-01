import { test, expect } from '@playwright/test';
import { emptySave, recordCatch, purchase } from '../../src/game/save';
import { SPECIES } from '../../src/game/catalog';
test('Cinq favoris, décorations, fiches et navigations sans accumulation de moteurs', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const seed = emptySave();
  for (const [i, fish] of SPECIES.entries()) { recordCatch(seed, { id: `favorite-${i}`, speciesId: fish.id, length: fish.min + 10, date: '2026-10-01T12:00:00Z', coloration: i === 2 ? 'golden' : 'natural' }); seed.favorites.push(`favorite-${i}`); }
  recordCatch(seed, { id: 'sixth', speciesId: 'roach', length: 25, date: '2026-10-01T12:00:00Z' });
  purchase(seed, 'plants'); purchase(seed, 'rocks');
  await page.addInitScript(data => { if (!localStorage.getItem('au-fil-de-leau.save.v1')) localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)); }, seed);
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  for (let i = 0; i < 3; i++) {
    await page.locator('#aquarium-open').click(); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded', 'true');
    const before = await page.evaluate(() => (window as any).__fishingQA.snapshot());
    expect(before.aquarium.count).toBe(5); expect(before.engines).toBe(2); expect(before.paused).toBe(true);
    await page.locator('#aquarium-add').click(); await expect(page.locator('#toast')).toContainText('Cinq favoris');
    if (i === 0) {
      await page.locator('#aq-plants').check(); await page.locator('#aq-rocks').check(); await page.locator('#aq-floor').selectOption('gravel'); await page.locator('#aq-background').selectOption('night'); await page.locator('#aq-light').selectOption('cool');
      const state = await page.evaluate(() => (window as any).__fishingQA.snapshot()); expect(state.aquarium.plants).toBe(true); expect(state.aquarium.rocks).toBe(true);
      await page.screenshot({ path: `test-results/${info.project.name}-aquarium.png` });
    }
    await page.locator('[data-close="aquarium"]').click(); await expect.poll(() => page.evaluate(() => (window as any).__fishingQA.snapshot().engines)).toBe(1);
  }
  await page.reload(); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); await page.locator('#aquarium-open').click(); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded', 'true');
  await expect(page.locator('#aq-plants')).toBeChecked(); await expect(page.locator('#aq-floor')).toHaveValue('gravel');
  await page.locator('[data-aq-remove="favorite-0"]').click(); await expect(page.locator('#aquarium-state')).toContainText('4 / 5');
  await page.locator('#aquarium-choice').selectOption('sixth'); await page.locator('#aquarium-add').click(); await expect(page.locator('#aquarium-state')).toContainText('5 / 5');
  await page.locator('[data-aq-view="sixth"]').click(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().aquarium.enabled)).toBe(false);
  await page.locator('#release-fish').click(); await expect(page.locator('#aquarium-state')).toContainText('5 / 5'); expect(errors).toEqual([]);
});
test('Un modèle manquant ne perd pas le spécimen et permet de revenir à la pêche', async ({ page }) => {
  const seed = emptySave(); recordCatch(seed, { id: 'missing', speciesId: 'zander', length: 40, date: '2026-10-01T12:00:00Z' }); seed.favorites.push('missing');
  await page.addInitScript(data => localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)), seed);
  await page.route('**/models/Zander.glb', route => route.abort());
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); await page.locator('#aquarium-open').click();
  await expect(page.locator('#aquarium-state')).toContainText('Un modèle n’a pas pu'); await page.locator('[data-close="aquarium"]').click();
  await page.locator('#collection-open').click(); await page.locator('[data-specimen="missing"]').click(); await expect(page.locator('#preview-error')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__fishingQA.snapshot().total)).toBe(1); await page.locator('#release-fish').click(); await page.locator('[data-close="collection"]').click();
  await expect(page.locator('#action')).toBeEnabled();
});
