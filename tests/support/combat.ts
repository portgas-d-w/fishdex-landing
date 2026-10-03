import { FishingGame } from '../../src/game/fishing.ts';
import type { Species } from '../../src/game/catalog.ts';
export function hookFish(fish: Species,power=1,size=.5){let seed=42;const g=new FishingGame(()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;});g.equipmentPower=power;g.cast({x:0,z:8});g.fish=fish;(g as unknown as {size:number}).size=fish.min+size*(fish.max-fish.min);g.phase='bite';g.strike();return g;}
export {manageFight} from '../../src/testing/combat-driver.ts';
