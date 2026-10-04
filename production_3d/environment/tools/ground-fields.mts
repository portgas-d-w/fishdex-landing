// Champs du terrain réel (pond-map) pour la cuisson de la macro-couleur du sol.
// node --experimental-strip-types production_3d/environment/tools/ground-fields.mts
// Grille alignée sur les UV du terrain : x∈[-90,90], z∈[-31,109], ligne 0 = z=-31 (texture invertY=false).
import {POND_MAP,inPond,shoreDistance,pondDepth,pondGround,localToPond} from '../../../src/game/pond-map.ts';
import {POSTS} from '../../../src/game/posts.ts';
import {mkdir,writeFile} from 'node:fs/promises';
const W=1024,H=800,F=7,out=new Float32Array(W*H*F);
const spots=POND_MAP.spots;
// Sentiers : derrière chaque poste, vers l'arrière-pays (axe local -z), et dégagement autour du pêcheur.
const trails=spots.map(s=>({a:localToPond(s.id,{x:0,z:-2.5}),b:localToPond(s.id,{x:0,z:-22})}));
const segDist=(p:{x:number,z:number},a:{x:number,z:number},b:{x:number,z:number})=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);};
const stands=spots.map(s=>localToPond(s.id,{x:0,z:-3.2}));
const gravelSpots=spots.filter(s=>['bank','point'].includes(s.id)).map(s=>localToPond(s.id,{x:0,z:-2}));
const reedSpots=spots.filter(s=>['reed-bank','cove'].includes(s.id)).map(s=>localToPond(s.id,{x:0,z:1}));
for(let j=0;j<H;j++)for(let i=0;i<W;i++){
 const x=-90+(i+.5)/W*180,z=-31+(j+.5)/H*140,p={x,z},inside=inPond(p),at=(j*W+i)*F;
 const wobble=Math.sin(x*.21+z*.07)*.9+Math.sin(z*.17-x*.11)*.7;
 const trail=Math.min(...trails.map(t=>segDist(p,t.a,t.b)+wobble*.25));
 out[at]=inside?1:0;out[at+1]=inside?pondDepth(p):0;out[at+2]=shoreDistance(p);out[at+3]=pondGround(p);
 out[at+4]=Math.max(0,1-trail/1.1);
 out[at+5]=Math.max(0,1-Math.min(...stands.map(s=>Math.hypot(x-s.x,z-s.z)))/3.2);
 out[at+6]=Math.max(Math.max(0,1-Math.min(...gravelSpots.map(s=>Math.hypot(x-s.x,z-s.z)))/7)*1,Math.max(0,1-Math.min(...reedSpots.map(s=>Math.hypot(x-s.x,z-s.z)))/9)*-1);
}
await mkdir('production_3d/environment/textures/fields',{recursive:true});
await writeFile('production_3d/environment/textures/fields/ground-fields.f32',Buffer.from(out.buffer));
await writeFile('production_3d/environment/textures/fields/ground-fields.json',JSON.stringify({width:W,height:H,fields:['inPond','depth','shoreDistance','height','trail','stand','gravel(+)/reedMarsh(-)'],x:[-90,90],z:[-31,109],row0:'z=-31',posts:POSTS.filter(p=>spots.some(s=>s.id===p.id)).map(p=>p.id)},null,1));
console.log('fields',W,H);
