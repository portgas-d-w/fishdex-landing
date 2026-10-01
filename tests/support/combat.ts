import { FishingGame } from '../../src/game/fishing.ts';
import { pickSpecies, type Species } from '../../src/game/catalog.ts';
export function hookFish(fish: Species, power = 1, size = .5) {
  for (const spot of ['reeds', 'open', 'willow'] as const) for (const bait of ['worm', 'lure'] as const) for (let i = 0; i < 1000; i++) {
    if (pickSpecies(spot, bait, i / 1000).id !== fish.id) continue;
    const rolls = [i / 1000, size, .2, .2, .2]; const g = new FishingGame(() => rolls.shift() ?? .2);
    g.setBait(bait); g.equipmentPower = power; g.cast({ x: spot === 'willow' ? 3 : 0, z: spot === 'open' ? 14 : 8 });
    g.phase = 'bite'; g.strike(); return g;
  }
  throw Error(fish.id);
}
export function manageFight(g: FishingGame) {
  g.orient(g.direction, g.pulling ? .28 : .55);
  if (g.tension < .72 || g.slack > .05) g.reel(1.6 / 60);
  g.update(1 / 60);
}
