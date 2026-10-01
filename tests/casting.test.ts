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
test('La même traction exige de suivre le fil : récupération et tension changent', () => {
  const make = (follow: boolean) => {
    const g = new FishingGame(() => 0); g.cast(); g.phase = 'bite'; g.strike();
    for (let i = 0; i < 600; i++) {
      g.orient(follow ? g.direction : -1, g.pulling ? 0.2 : 0.68);
      g.reel((g.pulling ? 0.1 : 1.6) / 60); g.update(1 / 60);
    } return g;
  };
  const aligned = make(true), wrong = make(false);
  assert.ok(aligned.progress > wrong.progress + 0.25);
  assert.ok(aligned.tension < wrong.tension);
});
