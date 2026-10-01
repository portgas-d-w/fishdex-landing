import { test, expect } from '@playwright/test';
import { SPECIES } from '../../src/game/catalog';
import { emptySave, recordCatch } from '../../src/game/save';
test('Chaque espèce charge son modèle et son portrait ; catalogue sans téléchargement initial', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Atlas de contrôle à largeur bureau ; prises et aquarium également contrôlés à 390×844.');
  test.setTimeout(120_000);
  const seed = emptySave(); for (const f of SPECIES) recordCatch(seed, { id: `atlas-${f.id}`, speciesId: f.id, length: (f.min + f.max) / 2, date: '2026-10-01T12:00:00Z' });
  await page.addInitScript(data => localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)), seed);
  const requests: string[] = [], errors: string[] = []; page.on('request', r => { if (r.url().endsWith('.glb')) requests.push(r.url()); }); page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true'); expect(requests).toEqual([]);
  await page.locator('#collection-open').click();
  for (const f of SPECIES) {
    await page.locator(`[data-specimen="atlas-${f.id}"]`).click(); await expect(page.locator('#fish-preview')).toHaveAttribute('data-loaded', 'true');
    await expect(page.locator('#catch-name')).toHaveText(f.name); await expect(page.locator('#photo-state')).toContainText('Photo conservée');
    await page.locator('#fish-preview').screenshot({ path: `test-results/model-${f.id}.png` }); await page.locator('#release-fish').click();
  }
  expect(new Set(requests.map(r => r.split('/').pop())).size).toBe(SPECIES.length); expect(errors).toEqual([]);
});
