import test from 'node:test';
import assert from 'node:assert/strict';
import { aimFromGesture, inspectTarget } from '../src/game/casting.ts';
import { FishingGame } from '../src/game/fishing.ts';
test('Gestes normalisés : court, long, diagonal et hors eau', () => {
  assert.equal(aimFromGesture(2, -5, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, -140, 390, 844).valid, true);
  assert.equal(aimFromGesture(150, -140, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, -500, 390, 844).valid, false);
  assert.equal(aimFromGesture(0, 120, 390, 844).valid, false);
  assert.deepEqual(aimFromGesture(30, -140, 390, 844).point, aimFromGesture(60, -280, 780, 1688).point);
  assert.equal(inspectTarget({ x: NaN, z: 5 }).valid, false);
});
test('Une cible refusée conserve l’état ; les coordonnées choisissent l’habitat', () => {
  const game = new FishingGame(() => 0);
  assert.equal(game.cast({ x: 15, z: 7 }), false); assert.equal(game.phase, 'idle');
  assert.equal(game.cast({ x: 4.2, z: 8.5 }), true);
  assert.deepEqual(game.target, { x: 4.2, z: 8.5 }); assert.equal(game.spot, 'willow');
});
test('L’orientation influence récupération et amortissement', () => {
  const make = (yaw: number, lift: number) => {
    const g = new FishingGame(() => 0); g.cast(); g.phase = 'bite'; g.strike(); g.orient(yaw, lift); g.reeling = true;
    for (let i = 0; i < 180; i++) g.update(1 / 60); return g;
  };
  const aligned = make(0, 0.8); const wrong = make(-1, 0);
  assert.notEqual(aligned.progress, wrong.progress); assert.ok(aligned.tension < wrong.tension);
});
