import test from 'node:test';
import assert from 'node:assert/strict';
import { swimSections } from '../src/game/swimming.ts';
test('La courbe de nage conserve sa longueur et garde la tête attachée', () => {
  for (const time of [0, 0.4, 1, 2, 4]) {
    const curve = swimSections(time, 0.24); assert.deepEqual(curve[0], { x: -0.2, z: 0, angle: 0 });
    for (let i = 1; i < curve.length; i++) assert.ok(Math.abs(Math.hypot(curve[i].x - curve[i - 1].x, curve[i].z - curve[i - 1].z) - 1.25 / 32) < 1e-10);
  }
  assert.notDeepEqual(swimSections(0), swimSections(1));
});
