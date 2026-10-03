import type {WaterEvent} from '../game/water-events.ts';

export const SURFACE_WAVES=8;
export const WATER_TURBIDITY={min:.35,max:2.5,default:.85};
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
function hash(x:number,y:number){let n=Math.imul(x+127,374761393)^Math.imul(y+97,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
/** Periodic value noise: both the height and its derivatives join across tiles. */
function periodic(x:number,y:number,period:number){
 const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const h=(a:number,b:number)=>hash((a%period+period)%period,(b%period+period)%period);
 return (h(ix,iy)*(1-u)+h(ix+1,iy)*u)*(1-v)+(h(ix,iy+1)*(1-u)+h(ix+1,iy+1)*u)*v;
}
export function rippleTexture(size=128){
 const height=(x:number,y:number)=>periodic(x/size*8,y/size*8,8)*.60+periodic(x/size*16+3.7,y/size*16+9.3,16)*.28+periodic(x/size*32+7.1,y/size*32+1.8,32)*.12;
 const pixels=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const at=(y*size+x)*4,dx=(height(x+1,y)-height(x-1,y))*5,dy=(height(x,y+1)-height(x,y-1))*5;
  pixels[at]=Math.round((clamp(dx,-1,1)*.5+.5)*255);pixels[at+1]=Math.round((clamp(dy,-1,1)*.5+.5)*255);
  pixels[at+2]=Math.round(height(x,y)*255);pixels[at+3]=255;
 }return pixels;
}
export function surfaceStrength(e:WaterEvent){
 // No extra disturbance for contacts well below the surface. Metadata is visual only.
 const depth=Math.max(0,e.depth??0),motion=clamp(e.speed??1,.04,2.5);
 const factor=['bait_sink','lure_submerge'].includes(e.type)?.35:['float_motion','line_surface_drag'].includes(e.type)?.45:1;
 return clamp(e.intensity,0,1)*Math.exp(-depth*2.6)*Math.sqrt(motion)*factor;
}
export function isWake(type:string){return ['boat_wake','lure_surface','line_surface_drag','float_motion','fish_near_surface','fish_surface_turn'].includes(type);}
export function boundedTurbidity(value:number){return Number.isFinite(value)?clamp(value,WATER_TURBIDITY.min,WATER_TURBIDITY.max):WATER_TURBIDITY.default;}
