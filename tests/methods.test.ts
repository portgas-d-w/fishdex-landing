import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame } from '../src/game/fishing.ts';
function advance(g: FishingGame, seconds: number) { for (let i = 0; i < seconds * 60; i++) g.update(1 / 60); }
test('Leurre : aucune touche immobile, récupération et animation actives, combat et capture', () => {
  const g = new FishingGame(() => 0); g.setMethod('lure'); g.cast(); advance(g, 1.2); advance(g, 10);
  assert.equal(g.phase, 'waiting'); assert.equal(g.retrieveProgress, 0);
  for (let i = 0; i < 60 * 9 && g.phase === 'waiting'; i++) { g.orient(Math.sin(i / 20) * 0.3, 0.5); g.reel(1.5 / 60); g.update(1 / 60); }
  assert.equal(g.phase, 'bite'); assert.ok(g.retrieveProgress > 0);
  g.strike(); for (let i = 0; i < 60 * 80 && g.phase === 'fighting'; i++) { g.orient(g.direction, g.pulling ? 0.2 : 0.68); g.reel((g.pulling ? 0.1 : 1.6) / 60); g.update(1 / 60); }
  assert.equal(g.phase, 'caught'); assert.equal(g.result?.method, 'lure'); assert.equal(g.result?.bait, 'lure');
  assert.deepEqual({ coloration: g.result?.coloration, mirage: g.result?.mirage }, g.appearance);
});
test('Fond : montage compatible, attente distincte et annulation propre', () => {
  const g = new FishingGame(() => 0); g.setMethod('bottom'); assert.equal(g.bait, 'worm'); g.cast(); advance(g, 1.2); advance(g, 3.1);
  assert.equal(g.phase, 'waiting'); advance(g, 1); assert.equal(g.phase, 'bite'); g.reset();
  assert.equal(g.phase, 'idle'); assert.equal(g.reeling, false); assert.equal(g.result, null);
});
