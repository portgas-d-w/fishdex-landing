import { writeFileSync } from 'node:fs';
import { FishingGame } from '../src/game/fishing.ts';
import { SPECIES, pickSpecies, type BaitId, type SpotId } from '../src/game/catalog.ts';
const points = { reeds: {x:0,z:8.45}, open:{x:0,z:14}, willow:{x:4.2,z:8.5} };
const rows = [];
for (const fish of SPECIES) {
 let encounter: {spot:SpotId,bait:BaitId,r:number}|undefined;
 for (const spot of ['reeds','open','willow'] as const) for (const bait of ['worm','lure'] as const) for(let i=0;i<1000&&!encounter;i++) if(pickSpecies(spot,bait,i/1000,bait==='lure'?'lure':'float').id===fish.id) encounter={spot,bait,r:i/1000};
 if(!encounter) throw Error(fish.id);
 const outcomes=[];
 for(const follow of [false,true]){
  const rolls=[encounter.r,.5,.2,.2,.2]; const g=new FishingGame(()=>rolls.shift()??.2);
  g.setBait(encounter.bait);g.cast(points[encounter.spot]);g.phase='bite';g.strike();g.equipmentPower=1.32;
  let time=0,at2:any,peakFatigue=0,maxTension=0;
  while(time<120&&g.phase==='fighting'){
   if(follow)g.orient(g.direction,g.pulling?.28:.55);
   if(g.tension<.72||g.slack>.05)g.reel(1.6/60);
   g.update(1/60);time+=1/60;peakFatigue=Math.max(peakFatigue,g.fatigue);maxTension=Math.max(maxTension,g.tension);
   if(!at2&&time>=2)at2={progress:Number(g.progress.toFixed(3)),tension:Number(g.tension.toFixed(3))};
  }
  outcomes.push({strategy:follow?'follow':'fixed',phase:g.phase,seconds:Number(time.toFixed(2)),length:g.fishLength,peakFatigue:Number(peakFatigue.toFixed(3)),maxTension:Number(maxTension.toFixed(3)),at2});
 }
 rows.push({species:fish.id,name:fish.name,encounter,outcomes});
}
writeFileSync('docs/apercus/physics-combat-comparison.json',JSON.stringify({date:'2026-10-01',dt:1/60,equipmentPower:1.32,reeling:'identical: 1.6 turns/s when tension < 0.72 or slack > 0.05',fixed:'yaw 0, lift .5',follow:'yaw follows fish, lift .28 during burst / .55 otherwise',fixedCatches:rows.filter(r=>r.outcomes[0].phase==='caught').length,followCatches:rows.filter(r=>r.outcomes[1].phase==='caught').length,rows},null,2)+'\n');
console.log(rows.map(r=>`${r.name}: ${r.outcomes.map(o=>`${o.strategy} ${o.phase} ${o.seconds}s, 2s=${JSON.stringify(o.at2)}`).join(' / ')}`).join('\n'));
