import map from './pond-map.json' with {type:'json'};
import type {WaterPoint} from './casting.ts';
export const POND_MAP=map;
export const surfaceLevel=(_point:WaterPoint,_time=0)=>0; // Normales visuelles : niveau physique constant.
export function inPond(p:WaterPoint){if(!Number.isFinite(p.x+p.z))return false;let inside=false;const c=map.contour;for(let i=0,j=c.length-1;i<c.length;j=i++){const a=c[i],b=c[j];if((a.z>p.z)!==(b.z>p.z)&&p.x<(b.x-a.x)*(p.z-a.z)/(b.z-a.z)+a.x)inside=!inside;}return inside;}
export function shoreDistance(p:WaterPoint){let best=Infinity;const c=map.contour;for(let n=0;n<c.length;n++){const a=c[n],b=c[(n+1)%c.length],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));best=Math.min(best,Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz));}return best;}
/** Version 1 : même fonction continue pour fond, couleur, sondage et présentation. */
export function pondDepth(p:WaterPoint){if(!inPond(p))return 0;const shore=shoreDistance(p),shelf=Math.min(1,shore/8),basin=Math.exp(-(((p.x-12)/24)**2+((p.z-48)/22)**2)),bay=Math.exp(-(((p.x+34)/20)**2+((p.z-21)/18)**2));return Math.max(.05,Math.min(8,shelf*(1.55+6.45*basin)*(1-.48*bay)));}
export function pondGround(p:WaterPoint){return inPond(p)?-pondDepth(p):.08+Math.min(2.8,shoreDistance(p)*.17)+.12*Math.sin(p.x*.13)*Math.sin(p.z*.11)*Math.min(1,shoreDistance(p)/3);}
export function pondMicrozone(p:WaterPoint):'margin'|'plants'|'open-water'|'dropoff'|'wood'{
 const zones=map.habitats.filter(h=>Math.hypot(p.x-h.center_xz_m[0],p.z-h.center_xz_m[1])<h.radius_m);
 if(zones.some(h=>h.kind==='submerged_cover'))return 'wood';
 if(zones.some(h=>['surface_vegetation','reed_corridor'].includes(h.kind)))return 'plants';
 return pondDepth(p)>3?'dropoff':shoreDistance(p)<9?'margin':'open-water';
}
export function pondSpot(id:string){return map.spots.find(s=>s.id===id);}
export function localToPond(id:string,p:WaterPoint){const s=pondSpot(id);if(!s)return p;const a=s.angle;return{x:s.origin.x+p.x*Math.cos(a)+(p.z+1)*Math.sin(a),z:s.origin.z-p.x*Math.sin(a)+(p.z+1)*Math.cos(a)};}
export function pondToLocal(id:string,p:WaterPoint){const s=pondSpot(id);if(!s)return p;const dx=p.x-s.origin.x,dz=p.z-s.origin.z;return{x:dx*Math.cos(s.angle)-dz*Math.sin(s.angle),z:dx*Math.sin(s.angle)+dz*Math.cos(s.angle)-1};}
