import { openMenuPage } from './helpers';
import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { SPECIES } from '../../src/game/catalog';
import { emptySave, recordCatch } from '../../src/game/save';
test('Mesures de rendu local et suspension réelle de l’étang derrière le bassin', async ({ page }, info) => {
  const seed = emptySave(); for (const [i, fish] of SPECIES.slice(0, 5).entries()) { recordCatch(seed, { id: `perf-${i}`, speciesId: fish.id, length: fish.min + 10, date: '2026-10-01T12:00:00Z' }); seed.favorites.push(`perf-${i}`); }
  await page.addInitScript(data => localStorage.setItem('au-fil-de-leau.save.v1', JSON.stringify(data)), seed);
  await page.goto('/'); await expect(page.locator('body')).toHaveAttribute('data-ready', 'true');
  const a = await page.evaluate(() => ({ at: performance.now(), ...(window as any).__fishingQA.snapshot() })); await page.waitForTimeout(3000);
  const b = await page.evaluate(() => ({ at: performance.now(), ...(window as any).__fishingQA.snapshot() }));
  expect(b.lakeFrames).toBeGreaterThan(a.lakeFrames);
  await openMenuPage(page, 'aquarium-open'); await expect(page.locator('#aquarium-canvas')).toHaveAttribute('data-loaded', 'true');
  const c = await page.evaluate(() => ({ at: performance.now(), ...(window as any).__fishingQA.snapshot() })); await page.waitForTimeout(3000);
  const d = await page.evaluate(() => ({ at: performance.now(), ...(window as any).__fishingQA.snapshot() }));
  expect(d.lakeFrames).toBe(c.lakeFrames); expect(d.aquarium.frames).toBeGreaterThan(c.aquarium.frames);
  const result = { platform: process.platform, renderer: 'Chromium headless, ANGLE SwiftShader, qualité eco', viewport: info.project.use.viewport, lakeFps: Math.round((b.lakeFrames - a.lakeFrames) / ((b.at - a.at) / 1000) * 10) / 10, aquariumFps: Math.round((d.aquarium.frames - c.aquarium.frames) / ((d.at - c.at) / 1000) * 10) / 10, activeLakeMeshes: b.meshes, lakeFramesDuringAquarium: d.lakeFrames - c.lakeFrames, note: 'Échantillons de 3 secondes sur PC Windows ; aucune certification iPhone ni mesure de chauffe.' };
  await writeFile(`test-results/performance-${info.project.name}.json`, JSON.stringify(result, null, 2));
});
