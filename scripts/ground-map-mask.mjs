import {POND_MAP,inPond,shoreDistance,pondDepth,localToPond} from '../src/game/pond-map.ts';
import {mkdir,writeFile} from 'node:fs/promises';
const n=256,mask=Buffer.alloc(n*n*4),paths=POND_MAP.spots.flatMap(s=>[0,1,2].map(i=>localToPond(s.id,{x:0,z:-9-i*3}))),gravelPosts=POND_MAP.spots.filter(s=>['bank','point'].includes(s.id));
for(let j=0;j<n;j++)for(let i=0;i<n;i++){
 const x=-90+(i+.5)/n*180,z=-31+(j+.5)/n*140,p={x,z},inside=inPond(p),shore=shoreDistance(p),noise=Math.sin(x*.39+Math.cos(z*.22))*.15+Math.sin(z*.61-x*.13)*.08;
 const trail=Math.max(0,1-Math.min(...paths.map(p=>Math.hypot(x-p.x,z-p.z)))/2.2);
 let mud=inside?Math.min(.92,.65+pondDepth(p)*.05):Math.max(0,1-shore/3.5)*.72;
 let gravel=inside?0:Math.max(0,1-Math.min(...gravelPosts.map(s=>Math.hypot(x-s.origin.x,z-s.origin.z)))/8)*.7;
 let grass=inside?0:Math.max(0,Math.min(.88,.55+noise))*(1-mud)*(1-gravel)*(1-trail);
 const sum=mud+gravel+grass;if(sum>1){mud/=sum;grass/=sum;gravel/=sum;}
 const at=(j*n+i)*4;mask[at]=Math.round(Math.max(0,1-mud-grass-gravel)*255);mask[at+1]=Math.round(mud*255);mask[at+2]=Math.round(grass*255);mask[at+3]=Math.round(gravel*255);
}
await mkdir('assets-source/free-map-01',{recursive:true});await writeFile('assets-source/free-map-01/ground-mask.rgba',mask);
