import {FishingGame} from './fishing.ts';
import {speciesById} from './catalog.ts';
import {ITEMS} from './economy.ts';
import type {SaveData} from './save.ts';
import type {WaterPoint} from './casting.ts';

/** Diagnostic replay only: no recordCatch, storage, rewards or mutation of the player's kit. */
export function profileTrace(save:SaveData,id:string,length:number,seed:number,point:WaterPoint,seconds=10,dt=1/60){
 const fish=speciesById(id);if(!fish||fish.mode!=='capture'||length<fish.min||length>fish.max)throw Error('Taille hors des limites de cette espèce ou observation sans combat.');
 const game=new FishingGame();game.testMode=true;game.accessBypass=true;game.testAppearance='natural';game.testTarget={...point};
 game.tackle=structuredClone(save.tackle);game.tackle.active=null;game.rights=structuredClone(save.progression);game.equipment=save.equipped;game.equipmentPower=ITEMS.find(i=>i.id===save.equipped)!.power;game.method=save.tackle.config.method;
 if(!game.setPost(save.preparation.post))throw Error('Poste refusé.');
 if(game.technique.engine==='feeder')game.fillFeeder();if(game.technique.engine==='fly'){game.prepareFly();game.prepareFly();}if(game.technique.engine==='troll')game.setBoat(1,0);
 const error=game.testEncounter(id,length,seed,true);if(error)throw Error(error);
 let burst=0,returns=0,bearing=0,maxTension=0,elapsed=0;const rows=[];
 for(let n=0;n<Math.round(seconds/dt)&&game.phase==='fighting';n++){
  // Identical fixed commands; this is a profile comparison, not an ideal controller.
  game.orient(0,game.hasReel?.48:.18);if(game.hasReel)game.reel(.6*dt);game.update(dt);elapsed+=dt;
  burst+=game.pulling?dt:0;returns+=game.returning?dt:0;bearing+=game.direction**2*dt;maxTension=Math.max(maxTension,game.tension);
  if(n%Math.round(1/dt)===0)rows.push({seconds:elapsed,direction:game.direction,tension:game.tension,fatigue:game.fatigue,distance:game.fishDistance});
 }
 return {id,length,seed,post:game.post,recipe:game.config.recipe,elapsed,burstSeconds:burst,returnSeconds:returns,bearingRms:Math.sqrt(bearing/Math.max(dt,elapsed)),maxTension,fatigue:game.fatigue,distance:game.fishDistance,phase:game.phase,rows};
}
