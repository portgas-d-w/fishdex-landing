import {writeFile} from 'node:fs/promises';
import {emptySave,parseSave} from '../src/game/save.ts';
import {FAMILIES,xpThreshold,questComplete} from '../src/game/curriculum.ts';
import {LearningSession} from '../src/game/learning.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {ITEMS} from '../src/game/economy.ts';
import {manageFight} from '../src/testing/combat-driver.ts';
const rows=[];
for(const f of FAMILIES){
 const normal=emptySave();normal.xp=xpThreshold(f.quest);const session=new LearningSession(normal,f.id),s=session.loan;
 let seed=147;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};const g=new FishingGame(random);g.tackle=s.tackle;g.rights=s.progression;g.equipment=s.equipped;g.equipmentPower=ITEMS.find(i=>i.id===s.equipped).power;g.method=s.preparation.method;g.setPost(s.preparation.post);
 const sample=()=>session.sample(g),tick=()=>{g.update(1/60);sample();};let frames=0,attempts=0;
 for(;attempts<12&&!questComplete(normal,f.id);attempts++){
  g.reset();s.tackle.config.depth=f.id==='profondeur'?6+attempts*2:f.id==='silure'?10.4:1.5;
  if(g.technique.engine==='feeder')g.fillFeeder();if(g.technique.engine==='fly'){g.prepareFly();g.prepareFly();}if(f.id==='traine')g.setBoat(1,0);
  if(!g.cast({x:0,z:f.id==='silure'?5:3.2}))break;sample();
  // Deux dépôts réels, puis la même zone ; pas de bouton de validation de quête.
  if(f.id==='precision'&&attempts===0){for(let n=0;n<100;n++)tick();continue;}
  for(let n=0;n<7200&&['casting','waiting'].includes(g.phase);n++,frames++){
   if(g.phase==='waiting'){
    if(g.technique.engine==='retrieve'){g.orient(n%30===0?.55:-.05,.5);g.holdReel(true);}
    if(g.technique.engine==='drift')g.holdRestraint(true);
    if(g.technique.engine==='vertical')g.orient(0,.5+Math.sin(n/20)*.2);
    if(g.technique.engine==='clonk')g.clonk();
   }tick();
  }
  sample();if(g.phase==='bite'){g.strike();sample();}
  if(['puissance','distance'].includes(f.id)){g.rig.drag=.6;s.tackle.config.drag=.6;}
  for(let n=0;n<18000&&['fighting','landing'].includes(g.phase);n++,frames++){
   if(g.manualMode&&g.manualRetrieved<.7){g.beginManual();g.pullManual(.06);}
   if(f.id==='puissance'&&g.pulling)g.orient(g.rodYaw,.3);
   sample();if(f.id==='puissance'&&g.pulling){g.orient(g.rodYaw,.3);g.holdReel(false);tick();}else if(f.id==='distance'&&n<60){g.orient(0,.05);g.holdReel(false);tick();}else{manageFight(g);}sample();
  }
  // La pause clonk continue réellement après la remise de ligne.
  if(f.id==='silure')for(let n=0;n<26*60;n++){tick();frames++;}
 }
 parseSave(JSON.stringify(normal));rows.push({family:f.id,normalQuestLevel:f.quest,attempts,seconds:frames/60,phase:g.phase,steps:normal.curriculum.quests[f.id]?.steps??[],missing:f.skills.filter(k=>!normal.curriculum.quests[f.id]?.steps.includes(k)),completed:questComplete(normal,f.id),normalCatches:normal.total,coins:normal.coins,forcedFish:false});
}
await writeFile('docs/gameplay-progression/EXERCICES.json',JSON.stringify({kind:'Gestes dans la logique réelle, rencontres naturelles ; aucune validation manuelle de compétence ni appareil',rows},null,2));console.log(JSON.stringify(rows,null,2));
