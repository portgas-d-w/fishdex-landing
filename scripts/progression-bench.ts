// Banc déterministe hors rendu. Individus imposés pour comparer le combat,
// jamais une capture guidée dans le jeu. Les rencontres naturelles sont relevées séparément.
import {writeFileSync,mkdirSync} from 'node:fs';
import {FishingGame} from '../src/game/fishing.ts';
import {SPECIES} from '../src/game/catalog.ts';
import {ITEMS,REWARD_BASE} from '../src/game/economy.ts';
import {emptySave,recordCatch} from '../src/game/save.ts';
import {COMPONENTS,starterConfig} from '../src/game/rig.ts';
import type {MethodId} from '../src/game/specimens.ts';
const random=(seed:number)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const rows=[];
for(const mode of ['manual','assisted'] as const)for(const species of ['roach','perch','carp'])for(const rod of ['starter','balanced','precision'])for(const post of ['jetty','cove'] as const){
 const s=emptySave(),g=new FishingGame(random(127));g.setMethod('float');g.setPost(post);g.tackle=s.tackle;s.tackle.config=starterConfig('float');g.equipment=rod;g.equipmentPower=ITEMS.find(i=>i.id===rod)!.power;g.combatMode=mode;
 const at=post==='cove'?{x:2.8,z:4.5}:{x:0,z:4.5};g.cast(at);
 // Même individu/taille/graines/présentation locale, indépendamment des poids de rencontre.
 g.fish=SPECIES.find(f=>f.id===species)!;(g as any).size=g.fish.min+(g.fish.max-g.fish.min)*.4;(g as any).combatSeed=127;g.phase='bite';g.strike();let duration=0,peak=0,snags=0;
 for(let i=0;i<180*60&&g.phase==='fighting';i++){
  if(g.snagged){snags++;g.orient(g.direction>.0?-.8:.8,.1);g.tryFreeSnag();}else g.orient(g.direction,g.pulling?.28:.55);
  if(g.tension<.72||g.slack>.05)g.reel(1.6/60);g.update(1/60);duration+=1/60;peak=Math.max(peak,g.tension);
 }
 const losses=s.tackle.active?.losses??{},cost=Object.entries(losses).reduce((n,[id,q])=>{const c=COMPONENTS.find(c=>c.id===id)!;return n+q*c.price/c.pack;},0);
 let reward=0;if(g.result){recordCatch(s,g.result);reward=s.journal[0].reward.coins;}
 rows.push({method:'float',mode,species,rod,post,seed:127,size:g.fishLength,durationSeconds:+duration.toFixed(2),outcome:g.phase,failure:g.failure,peakTension:+peak.toFixed(3),snagFrames:snags,losses,cost,firstDiscoveryReward:reward,repeatReward:g.result?REWARD_BASE[g.result.speciesId]*1.24:0});
}
for(const species of ['roach','perch','carp'])for(const rod of ['pole-starter','pole-elastic']){
 const s=emptySave(),g=new FishingGame(random(127));g.setMethod('pole');g.tackle=s.tackle;g.equipment=rod;g.equipmentPower=ITEMS.find(i=>i.id===rod)!.power;g.cast({x:0,z:3.2});g.fish=SPECIES.find(f=>f.id===species)!;(g as any).size=g.fish.min+(g.fish.max-g.fish.min)*.4;(g as any).combatSeed=127;g.phase='bite';g.strike();let duration=0;
 for(let i=0;i<180*60&&g.phase==='fighting';i++){g.orient(g.direction,Math.max(0,Math.min(1,(g.lineLength-g.fishDistance+(g.pulling?.12:.5)*1.1)/Math.max(1.5,g.lineLength-1.3))));g.update(1/60);duration+=1/60;}
 rows.push({method:'pole',mode:'manual',species,rod,post:'jetty',seed:127,size:g.fishLength,durationSeconds:+duration.toFixed(2),outcome:g.phase,failure:g.failure,lineLength:g.lineLength,dragSpeed:g.dragSpeed});
}
const sessions=[];
for(const method of ['pole','lure'] as MethodId[])for(const post of ['jetty','bank'] as const){
 const s=emptySave(),g=new FishingGame(random(127));g.setMethod(method);g.setPost(post);g.tackle=s.tackle;s.tackle.config=starterConfig(method);let seconds=0,waits=[],fights=[],spend=0;const discovered=new Set<string>();
 for(let cast=0;cast<12;cast++){
  g.cast(method==='pole'?{x:0,z:3.2}:{x:0,z:8});let wait=0;
  while(wait<90&&!['bite','lost','idle'].includes(g.phase)){if(method==='lure'){g.orient(Math.sin(wait)*.3,.5);g.reel(1.6/60);}g.update(1/60);wait+=1/60;}seconds+=wait;waits.push(+wait.toFixed(2));let fight=0;
  if(g.phase==='bite'){g.strike();while(fight<180&&g.phase==='fighting'){g.orient(g.direction,g.hasReel?(g.pulling?.28:.55):Math.max(0,Math.min(1,(g.lineLength-g.fishDistance+(g.pulling?.12:.5)*1.1)/Math.max(1.5,g.lineLength-1.3))));if(g.hasReel&&(g.tension<.72||g.slack>.05))g.reel(1.6/60);g.update(1/60);fight+=1/60;}seconds+=fight;fights.push(+fight.toFixed(2));if(g.result){recordCatch(s,g.result);discovered.add(g.result.speciesId);}}
  for(const [id,q] of Object.entries(s.tackle.active?.losses??{})){const c=COMPONENTS.find(c=>c.id===id)!;spend+=q*c.price/c.pack;}
  g.reset();seconds+=8; // hypothèse explicite de photo/préparation ; trajet nul
 }
 sessions.push({method,post,seed:127,casts:12,successes:s.total,discovered:[...discovered],discoveryFrequency:discovered.size/12,waits,fights,elapsedSeconds:+seconds.toFixed(2),coins:s.coins,spend,netCoinsPerMinute:+((s.coins-spend)/(seconds/60)).toFixed(2)});
}
mkdirSync('docs/apercus/progression',{recursive:true});
writeFileSync('docs/apercus/progression/simulation-bench.json',JSON.stringify({version:1,controller:'Suivi parfait de direction ; tension régulée. Pas une mesure humaine. Environnements dégagé/herbier libéré volontairement.',rows,sessions},null,2));
console.log(JSON.stringify({combatCases:rows.length,successes:rows.filter(r=>r.outcome==='caught').length,failures:rows.filter(r=>r.outcome!=='caught'),sessions},null,2));
