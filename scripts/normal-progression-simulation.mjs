import {writeFile} from 'node:fs/promises';
import {emptySave,recordCatch,purchase,parseSave} from '../src/game/save.ts';
import {refreshRights,switchTechnique} from '../src/game/progression.ts';
import {curriculumLevel,familyFor,learnSkill} from '../src/game/curriculum.ts';
import {ITEMS} from '../src/game/economy.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {manageFight} from '../src/testing/combat-driver.ts';

// Budgets de gestes déclarés ; attente et combat exécutés dans la vraie simulation.
// Ce pilote géométrique ne modélise ni la compréhension ni les erreurs humaines.
const rows=[];
for(const profile of [{name:'Débutant prudent',prep:20,initial:180,miss:5},{name:'Expérimenté',prep:5,initial:20,miss:0},{name:'Pratique préférée : coup',prep:10,initial:45,miss:0}]){
 const s=emptySave();refreshRights(s);switchTechnique(s,'coup');let seed=147;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const g=new FishingGame(random);g.rights=s.progression;g.tackle=s.tackle;g.method='pole';
 let seconds=profile.initial,preparation=profile.initial,waiting=0,fighting=0,attempts=0,failures=0,firstBuy=null;const combats=[];
 while(curriculumLevel(s.xp)<15&&attempts<180){
  attempts++;g.reset();seconds+=profile.prep;preparation+=profile.prep;
  if(!firstBuy&&s.coins>=65&&curriculumLevel(s.xp)>=3){const error=purchase(s,'pole-elastic');if(!error){s.equipped='pole-elastic';firstBuy={seconds,attempt:attempts,price:65};}}
  g.equipment=s.equipped;g.equipmentPower=ITEMS.find(i=>i.id===s.equipped).power;
  if(!g.cast({x:0,z:3.2})){failures++;continue;}
  let ticks=0;for(;ticks<120*60&&['casting','waiting'].includes(g.phase);ticks++)g.update(1/60);
  waiting+=ticks/60;seconds+=ticks/60;
  if(g.phase==='bite'){
   if(profile.miss&&attempts%profile.miss===0){for(let n=0;n<8*60;n++)g.update(1/60);seconds+=8;waiting+=8;}
   else{g.strike();}
  }
  let fight=0;for(;fight<180*60&&['fighting','landing'].includes(g.phase);fight++)manageFight(g);
  fighting+=fight/60;seconds+=fight/60;
  if(g.phase==='caught'){combats.push(fight/60);recordCatch(s,g.result);for(const event of g.cleanEvents)learnSkill(s,familyFor('coup').id,event);refreshRights(s);}
  else failures++;
  parseSave(JSON.stringify(s));
 }
 combats.sort((a,b)=>a-b);rows.push({profile:profile.name,normal:true,forcedFish:false,goal:'Niveau direct 15 en restant au coup',level:curriculumLevel(s.xp),seconds,preparationSecondsAssumed:preparation,waitingSecondsSimulated:waiting,fightAndReceptionSecondsSimulated:fighting,attempts,failures,catches:s.total,firstEquipment:firstBuy,xp:s.xp,coins:s.coins,medianFight:combats[Math.floor(combats.length/2)],p90Fight:combats[Math.floor(combats.length*.9)],inventory:s.inventory});
}
await writeFile('docs/gameplay-progression/PARCOURS_NORMAUX.json',JSON.stringify({kind:'Simulation sans bac à sable ni captures forcées ; budgets de préparation hypothétiques ; pas de joueur humain',rows},null,2));
console.log(JSON.stringify(rows,null,2));
if(rows.some(r=>r.level<15))process.exitCode=1;
