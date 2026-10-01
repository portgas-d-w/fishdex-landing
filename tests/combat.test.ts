import test from 'node:test';
import assert from 'node:assert/strict';
import { FishingGame } from '../src/game/fishing.ts';
import { SPECIES } from '../src/game/catalog.ts';
import { circularTurns, wheelTurns } from '../src/game/reeling.ts';
import { combatForces } from '../src/game/combat.ts';

test('Le cercle passe la couture angulaire sans saut ; ni maintien ni moyeu ne moulinent', () => {
  assert.equal(circularTurns({ x: 30, y: 0 }, { x: 30, y: 0 }), 0);
  assert.equal(circularTurns({ x: 0, y: 0 }, { x: 30, y: 0 }), 0);
  assert.equal(circularTurns({ x: 100, y: 0 }, { x: 0, y: 100 }), 0);
  assert.ok(circularTurns({ x: -30, y: 2 }, { x: -30, y: -2 }) < 0.03);
  assert.equal(circularTurns({ x: 30, y: 0 }, { x: -30, y: 0 }), 0);
  assert.equal(wheelTurns(-100), wheelTurns(100));
  assert.equal(wheelTurns(NaN), 0);
  assert.equal(wheelTurns(10, 1), wheelTurns(160));
});

test('Une impulsion de molette s’épuise ; release interrompt immédiatement les tours en attente', () => {
  const g = new FishingGame(() => 0); g.cast(); g.phase = 'bite'; g.strike();
  g.reel(0.2); for (let i = 0; i < 15; i++) g.update(1 / 60);
  assert.equal(g.reeling, false); g.reel(0.4); g.release();
  assert.equal(g.reeling, false); g.update(1 / 60); assert.equal(g.reelSpeed, 0);
});

test('Même départ : angle et hauteur modifient traction, contact et récupération', () => {
  const good = combatForces(0.8, 0.2, 0.8, true, 1.2, 1, 0.5);
  const wrong = combatForces(-0.8, 0.9, 0.8, true, 1.2, 1, 0.5);
  assert.ok(good.tension < wrong.tension); assert.ok(good.recovery > wrong.recovery);
  assert.ok(combatForces(0.8, 0, 0.8, false, 1.2, 1, 0).tension < 0.025);
});

test('Même moulinage optimisé : une canne fixe ne résout pas tous les poissons, suivre le fil les ramène', () => {
  let fixedCatches = 0;
  for (const fish of SPECIES) {
    for (const follow of [false, true]) {
      const g = new FishingGame(() => 0.5); g.cast({ x: 0, z: 10 }); g.phase = 'bite'; g.strike(); g.fish = fish; g.equipmentPower = 1.32;
      for (let i = 0; i < 60 * 91 && g.phase === 'fighting'; i++) {
        if (follow) g.orient(g.direction, g.pulling ? 0.2 : 0.68);
        if (g.tension < 0.72) g.reel((g.pulling ? 0.1 : 1.6) / 60);
        g.update(1 / 60);
      }
      if (follow) assert.equal(g.phase, 'caught', fish.name);
      else if (g.phase === 'caught') fixedCatches++;
    }
  }
  assert.ok(fixedCatches < SPECIES.length - 3, `${fixedCatches} captures avec canne fixe`);
});
