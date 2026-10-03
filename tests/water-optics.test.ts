import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rippleTexture,surfaceStrength,boundedTurbidity} from '../src/render/water-optics.ts';
import {nextRenderDeadline} from '../src/ui/render-clock.ts';
import type {WaterEvent} from '../src/game/water-events.ts';
test('Eau : tuile déterministe sans couture de hauteur ou de normale',()=>{
 const data=rippleTexture(128);assert.deepEqual(data,rippleTexture(128));
 for(let k=0;k<128;k++)for(const channel of [0,1,2]){
  assert.ok(Math.abs(data[(k*128)*4+channel]-data[(k*128+127)*4+channel])<35);
  assert.ok(Math.abs(data[k*4+channel]-data[(127*128+k)*4+channel])<35);
 }
 assert.ok(new Set(data.filter((_,i)=>i%4===0)).size>60);
});
test('Eau : mouvements lents et contacts profonds perturbent moins la surface',()=>{
 const e:WaterEvent={id:1,type:'fish_near_surface',time:0,position:{x:0,y:0,z:0},intensity:.4,source:'fish',direction:0,essential:true,seed:127};
 assert.ok(surfaceStrength({...e,speed:.05})<surfaceStrength({...e,speed:1}));
 assert.ok(surfaceStrength({...e,depth:2})<surfaceStrength({...e,depth:.1})*.02);
 assert.equal(boundedTurbidity(Infinity),.85);assert.equal(boundedTurbidity(-1),.35);assert.equal(boundedTurbidity(10),2.5);
});
test('Cadence : budget conservé à 30 FPS malgré le jitter RAF, sans rattrapage après pause',()=>{
 let deadline=0,count=0;for(let frame=1;frame<=600;frame++){const now=frame*1000/60+Math.sin(frame)*.7;if(now+.25>=deadline){count++;deadline=nextRenderDeadline(now,deadline,1000/30);}}
 assert.ok(count>=299&&count<=302,`Rendered ${count}`);
 deadline=nextRenderDeadline(90_000,deadline,1000/30);assert.ok(deadline>90_000&&deadline<=90_034);
 assert.equal(nextRenderDeadline(90_010,deadline,0),90_010);
});
