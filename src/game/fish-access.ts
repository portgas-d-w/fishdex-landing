import {SPECIES} from './catalog.ts';
import {TECHNIQUES,compatibleRecipes,techniqueContext,type TechniqueId} from './techniques.ts';
import {techniqueConfig} from './rig.ts';
import {ALL_POSTS,populationWeight,inspectPostTarget,type PostId} from './posts.ts';
import {techniqueEncounterWeight} from './profiles.ts';
import {initialPresentation,stepPresentation} from './presentation.ts';
// Suggestions issues du même filtre que les rencontres, sans activer de scénario forcé.
export interface FishRoute {post:PostId;technique:TechniqueId|null;recipe:string|null;depth:number;point:{x:number;z:number}}
const cache=new Map<string,FishRoute[]>();
export function fishRoutes(id:string):FishRoute[]{
 if(cache.has(id))return cache.get(id)!;
 const species=SPECIES.find(s=>s.id===id);if(!species)return [];
 const result=ALL_POSTS.flatMap<FishRoute>(post=>{
  if(species.mode==='observation')return populationWeight(post.id,id,'margin')>0?[{post:post.id,technique:null,recipe:null,depth:0,point:{x:0,z:5}}]:[];
  const routes=[];
  for(const t of TECHNIQUES.filter(t=>techniqueContext(t.id,post.context??'pond'))){
   const point={x:0,z:Math.min(t.reach-1,t.engine==='vertical'||t.base==='pole'?3.2:7)},aim=inspectPostTarget(post.id,point,t.base,t.reach);
   if(!aim.valid||populationWeight(post.id,id,aim.microzone)<=0)continue;
   for(const recipe of compatibleRecipes(t.id)){
    const config=techniqueConfig(t.id,recipe.id),depth=species.stratum==='surface'?.45:species.stratum==='bottom'?aim.depth:species.stratum==='middle'?Math.min(aim.depth*.65,1.2):Math.min(aim.depth,1.2);
    config.depth=Math.max(.2,depth);const state=initialPresentation();state.point={...point};state.feederRemaining=t.engine==='feeder'?45:0;state.flyEnergy=1;
    let possible=false;
    for(let n=0;n<240;n++){
     const local=inspectPostTarget(post.id,state.point,t.base,t.reach);
     stepPresentation(config,state,{dt:.05,waterDepth:local.depth,reelSpeed:['retrieve','bottom','feeder'].includes(t.engine)?.8:0,lift:.5+Math.sin(n/7)*.15,current:post.current??0,wind:post.wind??0,restrained:true,boatSpeed:t.engine==='troll'?1:0,boatTurn:0,clonk:t.engine==='clonk'});
     if(n>140&&local.valid&&populationWeight(post.id,id,local.microzone)>0&&techniqueEncounterWeight(id,config,local.depth,state.depth,state.activity,state.noise,state.contact)>0)possible=true;
    }
    if(possible)routes.push({post:post.id,technique:t.id,recipe:recipe.id,depth:config.depth,point});
   }
  }
  return routes;
 });
 const rank=(r:FishRoute)=>{
  if(!r.technique)return 0;const t=TECHNIQUES.find(t=>t.id===r.technique)!;
  if(id==='catfish'&&r.technique==='clonk')return -100;
  const preferred=['coregone','coregone-palee','cristivomer','omble-chevalier'].includes(id)?'gambe':species.max>80?t.base==='lure'?'leurre':'fond':null;
  return (preferred&&r.technique===preferred?-20:0)+((species.max>65||species.strength>.9)&&!t.reel?20:0)+(r.post===species.post?-2:0);
 };
 const sorted=result.sort((a,b)=>rank(a)-rank(b));cache.set(id,sorted);return sorted;
}
export const suggestedFishPost=(id:string):PostId|undefined=>fishRoutes(id)[0]?.post;
