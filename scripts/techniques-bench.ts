// Natural encounters, finite wallet/stock, no forced fish and no access bypass.
// The controller is idealised. Preparation/photo time below is an explicit assumption.
import {dirname} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
import {emptySave,recordCatch} from '../src/game/save.ts';
import {refreshRights,switchTechnique} from '../src/game/progression.ts';
import {TECHNIQUES} from '../src/game/techniques.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {ITEMS} from '../src/game/economy.ts';
import {component,buyComponent} from '../src/game/rig.ts';
const random=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rows=[];
for(const t of TECHNIQUES){
 const s=emptySave();s.xp=100000;s.coins=1000;refreshRights(s);switchTechnique(s,t.id);
 for(const slot of ['main_line','leader','groundbait','pva','bait'] as const){
  if(!s.tackle.config.components[slot]||slot==='bait'&&s.tackle.config.components.bait!=='kit-worm')continue;
  const id=`v2:${slot}`,b=buyComponent(s.tackle,id,s.coins,3);if(!b.error){s.coins=b.coins;s.tackle.config.components[slot]=id;}
 }
 const initialCoins=s.coins,g=new FishingGame(random(127));g.tackle=s.tackle;g.rights=s.progression;g.method=t.base;g.equipment=s.equipped;g.equipmentPower=ITEMS.find(i=>i.id===s.equipped)!.power;
 g.setPost(t.context.includes('pond')?'jetty':t.context.includes('river')?'river':t.context.includes('deep')?'deep':'boat');
 let seconds=0,spent=0;const casts=[];
 for(let n=0;n<12;n++){
  if(t.engine==='feeder')g.fillFeeder();if(t.engine==='fly'){g.prepareFly();g.prepareFly();}if(t.engine==='troll')g.setBoat(1,0);
  if(!g.cast({x:0,z:3.2})){casts.push({cast:n+1,outcome:'preparation',failure:g.failure});break;}
  let wait=0,fight=0;
  while(wait<120&&['casting','waiting'].includes(g.phase)){
   if(g.phase==='waiting'){if(['retrieve','bottom','feeder'].includes(t.engine))g.reel(.8/60);if(['vertical','clonk'].includes(t.engine))g.orient(0,.5+Math.sin(wait*3)*.2);if(t.engine==='drift')g.holdRestraint(true);if(t.engine==='clonk')g.clonk();}
   g.update(1/60);wait+=1/60;
  }
  if(g.phase==='bite')g.strike();
  while(fight<240&&g.phase==='fighting'){
   g.orient(g.direction,g.hasReel?(g.pulling?.28:.55):Math.max(0,Math.min(1,(g.lineLength-g.fishDistance+(g.pulling?.12:.5)*1.1)/Math.max(1.5,g.lineLength-1.3))));
   if(g.hasReel&&(g.tension<.72||g.slack>.05))g.reel(1.6/60);g.holdSections(g.tension<.8);g.update(1/60);fight+=1/60;
  }
  let landing=0;
  while(g.phase==='landing'&&landing<20){g.holdSections(true);g.update(1/60);landing+=1/60;if(g.elapsed>=1&&(!t.sections||g.rodSections<=3))g.receive();}
  if(g.result)recordCatch(s,g.result);
  const outcome=g.phase,failure=g.failure,species=g.result?.speciesId;g.reset();
  const losses=s.tackle.active?.losses??{},cost=Object.entries(losses).reduce((sum,[id,q])=>sum+q*component(id)!.price/component(id)!.pack,0);spent+=cost;seconds+=wait+fight+landing+8;
  casts.push({cast:n+1,outcome,species,failure,waitSeconds:+wait.toFixed(2),fightSeconds:+fight.toFixed(2),landingSeconds:+landing.toFixed(2),cost:+cost.toFixed(3),losses});
 }
 rows.push({technique:t.id,recipe:t.defaultRecipe,post:g.post,casts:casts.length,captures:s.total,elapsedSeconds:+seconds.toFixed(2),rewards:s.coins-initialCoins,consumedReplacementCost:+spent.toFixed(2),netCoinsPerMinute:+((s.coins-initialCoins-spent)/(seconds/60)).toFixed(2),outcomes:casts});
}
const output=process.argv[2]??'docs/apercus/v2/natural-economy.json';
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify({seed:127,castsPerMethod:12,forcedEncounters:false,unlimitedMoney:false,unlimitedStock:false,access:'Normal high-level fixture with earned rights',controller:'Perfect bearing and regulated tension; no human/device timing',assumedPreparationPhotoSeconds:8,notes:'Only selected replaceable slots are paid. Kits remain free; figures are not balance targets or observed player income.',rows},null,2));
console.log(JSON.stringify(rows.map(({outcomes,...row})=>row),null,2));
