import test from 'node:test';
import assert from 'node:assert/strict';
import {POND_MAP,inPond,pondDepth,pondGround,localToPond,pondToLocal} from '../src/game/pond-map.ts';
import {POSTS,worldPoint,inspectPostTarget} from '../src/game/posts.ts';
import {FishingGame} from '../src/game/fishing.ts';
import {manageFight} from './support/combat.ts';
import {terminalPosition,WATER_TYPES} from '../src/game/water-events.ts';
test('Carte : six anciens identifiants, relief continu, réception en eau et coordonnées réversibles',()=>{
 assert.deepEqual(POSTS.map(p=>p.id),['jetty','cove','bank','reed-bank','point','timber']);
 for(const p of POSTS){for(const v of [{x:0,z:3.2},{x:0,z:1.5}]){const w=worldPoint(p.id,v);assert.equal(inPond(w),true,p.id);assert.deepEqual(w,localToPond(p.id,v));const back=pondToLocal(p.id,w);assert.ok(Math.hypot(back.x-v.x,back.z-v.z)<1e-10);const depth=pondDepth(w);assert.ok(depth>0&&depth<=8);assert.equal(pondGround(w),-depth);assert.equal(inspectPostTarget(p.id,v).depth,depth);}assert.equal(inspectPostTarget(p.id,{x:40,z:3}).valid,false);}
 assert.equal(pondDepth({x:90,z:-30}),0);assert.equal(inPond({x:NaN,z:0}),false);assert.ok(pondDepth({x:12,z:48})>7);
});
test('Événements : vrai impact et touche, aucun impact terrestre, horloge et journal bornés',()=>{
 const g=new FishingGame(()=>0);g.method='pole';assert.equal(g.cast({x:0,z:3.2}),true);for(let n=0;n<900&&g.phase!=='bite';n++)g.update(1/60);
 assert.equal(g.phase,'bite');for(const t of ['cast_impact','float_enter','bite_float'])assert.ok(g.waterEvents.events.some(e=>e.type===t),t);assert.equal(g.waterEvents.events.filter(e=>e.type==='cast_impact').length,1);
 const clock=g.simulationTime;g.update(0);assert.equal(g.simulationTime,clock);const count=g.waterEvents.events.length;g.waterEvents.emit(g,'cast_impact',{x:900,z:900});assert.equal(g.waterEvents.events.length,count);
 for(let n=0;n<90;n++)g.waterEvents.emit(g,'groundbait_impact',g.target);assert.equal(g.waterEvents.events.length,64);assert.ok(g.waterEvents.since(g.waterEvents.events.at(-1)!.id).length===0);assert.equal(WATER_TYPES.length,28);
});
for(const p of POND_MAP.spots)test('Capture géométrique et relâcher unique au poste '+p.id,()=>{
 const g=new FishingGame(()=>0);g.testMode=true;g.accessBypass=true;g.method='pole';assert.equal(g.setPost(p.id as typeof g.post),true);assert.equal(g.testEncounter('roach',10,127,true),'');for(let n=0;n<15000&&!['caught','lost'].includes(g.phase);n++)manageFight(g);assert.equal(g.phase,'caught',g.failure);assert.ok(g.result);assert.equal(g.releaseCaughtFish(),true);assert.equal(g.releaseCaughtFish(),false);assert.equal(g.waterEvents.events.filter(e=>e.type==='fish_release').length,1);assert.ok(g.waterEvents.events.some(e=>e.type==='net_capture'));assert.ok(g.waterEvents.events.every(e=>inPond(e.position)||e.type==='spot_transition'));
});
test('Pose du flotteur liée à sa charge, indépendante de la fatigue',()=>{const g=new FishingGame(()=>0);g.method='pole';g.cast({x:0,z:3.2});g.update(1);g.update(1);g.fatigue=0;const a=terminalPosition(g);g.fatigue=1;assert.deepEqual(terminalPosition(g),a);});

