import type {FishingGame} from '../game/fishing.ts';
import {rodGeometry} from '../game/combat.ts';
/** Pilote de contrôle des tests : utilise les mêmes actions que le joueur, jamais dans le jeu. */
export function manageFight(g:FishingGame,receive=true,enterLanding=true){
 const yaw=Math.max(-.65,Math.min(.65,-g.fishPosition.x*.12));let lift=.55;
 if(!g.hasReel){let error=Infinity;for(let n=0;n<=80;n++){const l=n/100,tip=rodGeometry(yaw,l,g.rodLength,g.poleRetreat,g.tension,g.fishPosition).tip,span=Math.hypot(tip.x-g.fishPosition.x,tip.y-g.fishPosition.y,tip.z-g.fishPosition.z),e=Math.abs(span-g.lineLength-(g.pulling?.28:.5));if(e<error){error=e;lift=l;}}if(g.technique.sections&&g.rodSections>2.5){g.movePole(1.2/60);if(g.canDetach)g.detachPole();}}
 g.orient(yaw,lift);if(g.hasReel&&g.phase==='fighting')g.holdReel(true);g.update(1/60);
 if(enterLanding&&g.canReceive&&g.fishPosition.y>-.65&&g.phase==='fighting')g.beginLanding();
 if(receive&&g.phase==='landing'){g.placeNet(g.fishPosition.x,g.fishPosition.z);if(g.netReady)g.liftNet(.4);}
}
