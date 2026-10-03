import { FishingGame } from '../../src/game/fishing.ts';
import {rodGeometry} from '../../src/game/combat.ts';
import type { Species } from '../../src/game/catalog.ts';
export function hookFish(fish: Species,power=1,size=.5){let seed=42;const g=new FishingGame(()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;});g.equipmentPower=power;g.cast({x:0,z:8});g.fish=fish;(g as unknown as {size:number}).size=fish.min+size*(fish.max-fish.min);g.phase='bite';g.strike();return g;}
/** Pilote de contrôle des tests : utilise les mêmes actions que le joueur, jamais dans le jeu. */
export function manageFight(g:FishingGame,receive=true,enterLanding=true){
 const yaw=Math.max(-.65,Math.min(.65,-g.fishPosition.x*.12));let lift=.55;
 if(!g.hasReel){let error=Infinity;for(let n=0;n<=80;n++){const l=n/100,tip=rodGeometry(yaw,l,g.rodLength,g.poleRetreat,g.tension,g.fishPosition).tip,span=Math.hypot(tip.x-g.fishPosition.x,tip.y-g.fishPosition.y,tip.z-g.fishPosition.z),e=Math.abs(span-g.lineLength-(g.pulling?.28:.5));if(e<error){error=e;lift=l;}}if(g.technique.sections&&g.rodSections>2.5){g.movePole(1.2/60);if(g.canDetach)g.detachPole();}}
 g.orient(yaw,lift);if(g.hasReel&&g.phase==='fighting')g.holdReel(true);g.update(1/60);
 if(enterLanding&&g.canReceive&&g.fishPosition.y>-.65&&g.phase==='fighting')g.beginLanding();
 if(receive&&g.phase==='landing'){g.placeNet(g.fishPosition.x,g.fishPosition.z);if(g.netReady)g.liftNet(.4);}
}
