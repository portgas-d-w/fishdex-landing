import type { WaterPoint, CastAim } from './casting.ts';
import { inspectTarget } from './casting.ts';
import type { MethodId } from './specimens.ts';
import type { SpeciesId } from './catalog.ts';
export type PostId = 'jetty'|'cove'|'bank'|'reed-bank'|'point'|'timber'|'river'|'deep'|'boat';
export type Microzone = 'margin'|'plants'|'open-water'|'dropoff'|'wood';
export interface Obstacle { x:number;z:number;radius:number }
export interface Post {
  id:PostId;name:string;implemented:boolean;initial:boolean;origin:WaterPoint;angle:number;
  tier:'discovery'|'exploration'|'specialisation'|'mastery';
  sector:number;landing:number;difficulty:string;constraints:string[];hint:string;obstacles:Obstacle[];context?:import('./techniques.ts').ContextId;current?:number;wind?:number;
}
export const POSTS:readonly Post[] = [
  {id:'jetty',tier:'discovery',name:'Ponton dégagé',implemented:true,initial:true,origin:{x:0,z:-1},angle:0,sector:11,landing:1.8,difficulty:'Accessible',constraints:['Secteur ouvert','Réception dégagée'],hint:'Petits éclats près de la bordure, bancs au large.',obstacles:[]},
  {id:'cove',tier:'discovery',name:'Anse abritée',implemented:true,initial:true,origin:{x:-7,z:1},angle:.35,sector:7,landing:1.8,difficulty:'Accessible',constraints:['Fond peu profond','Herbiers à contourner'],hint:'Bulles entre les feuilles, poissons près du fond.',obstacles:[{x:2.8,z:4.5,radius:.6}]},
  {id:'bank',tier:'discovery',name:'Rive ouverte',implemented:true,initial:true,origin:{x:7,z:1},angle:-.35,sector:9,landing:1.8,difficulty:'Accessible',constraints:['Profondeur variable','Distance de présentation'],hint:'Petites chasses plus loin de la rive.',obstacles:[]},
  {id:'reed-bank',tier:'exploration',name:'Bordure des roseaux',implemented:true,initial:false,origin:{x:-9,z:6},angle:.75,sector:5,landing:1.8,difficulty:'Technique',constraints:['Couloir de lancer étroit','Accrochages dans les herbiers'],hint:'Passez la ligne entre les bouquets ; relevez-la après le couloir.',obstacles:[{x:-2.4,z:5.5,radius:.75},{x:2.2,z:8,radius:1}]},
  {id:'point',tier:'specialisation',name:'Pointe et cassure',implemented:true,initial:false,origin:{x:8,z:10},angle:-.9,sector:6,landing:1.8,difficulty:'Technique',constraints:['Vent latéral sur la bannière','Cassure de profondeur'],hint:'Contrôlez la dérive et la couche atteinte au-delà de la cassure.',obstacles:[],wind:.35},
  {id:'timber',tier:'mastery',name:'Bois immergé',implemented:true,initial:false,origin:{x:-8,z:15},angle:1.2,sector:4,landing:1.8,difficulty:'Exigeant',constraints:['Branches immergées','Couloir de réception étroit'],hint:'Réorientez la canne avant la fuite vers les branches.',obstacles:[{x:-2,z:6,radius:.7},{x:2.1,z:10,radius:.8}]},
];
export const ALL_POSTS:readonly Post[]=[...POSTS,
 {id:'river',tier:'specialisation',name:'Rivière des Aulnes',implemented:true,initial:false,origin:{x:0,z:4},angle:0,sector:7,landing:1.8,difficulty:'Technique',constraints:['Courant réel','Dérive à accompagner'],hint:'Le gravier accueille goujons, chevesnes et poissons de courant.',obstacles:[{x:3,z:10,radius:.6}],context:'river',current:.45},
 {id:'deep',tier:'mastery',name:'Ponton du lac profond',implemented:true,initial:false,origin:{x:0,z:11},angle:0,sector:7,landing:1.8,difficulty:'Technique',constraints:['Couche de 6 à 18 m','Réserve de fil'],hint:'Prospectez les couches sous le poste ; petits poissons et prédateurs présents.',obstacles:[],context:'deep'},
 {id:'boat',tier:'specialisation',name:'Embarcation légère',implemented:true,initial:false,origin:{x:3,z:10},angle:0,sector:10,landing:1.8,difficulty:'Technique',constraints:['Déplacement du point de pêche','Contrôle de profondeur'],hint:'Vitesse et parcours animent la traîne ; arrêtez pour la verticale et le clonk.',obstacles:[],context:'boat'},
];
export const postById = (id:PostId) => ALL_POSTS.find(p=>p.id===id)!;
export function worldPoint(post:PostId,local:WaterPoint):WaterPoint {
  const p=postById(post),sin=Math.sin(p.angle),cos=Math.cos(p.angle);
  return {x:p.origin.x+local.x*cos+(local.z+1)*sin,z:p.origin.z-local.x*sin+(local.z+1)*cos};
}
export function inspectPostTarget(post:PostId,point:WaterPoint,method:MethodId='float',reach=23):CastAim & {microzone:Microzone} {
  const p=postById(post),world=worldPoint(post,point),base=inspectTarget(p.context?point:world),distance=Math.hypot(point.x,point.z+1);
  const sector=point.z>=1.5&&Math.abs(point.x)<=p.sector,within=method!=='pole'||distance<=reach;
  const depth=post==='deep'?6+Math.min(12,Math.max(0,distance-2.5)*4):post==='boat'?8+Math.min(8,distance*.4):post==='river'?1+distance*.08:post==='point'?distance<8?1.5:5+distance*.15:post==='cove'?Math.min(1.6,.65+distance*.07):post==='reed-bank'?Math.min(2.8,.8+distance*.1):base.depth;
  const microzone:Microzone=post==='timber'?'wood':post==='deep'||post==='boat'?'dropoff':post==='reed-bank'&&distance<12?'plants':Math.abs(point.x)>2&&point.z<12?'plants':distance<7?'margin':distance>14?'dropoff':'open-water';
  return {...base,point,depth,habitat:microzone==='open-water'||microzone==='dropoff'?'open':microzone==='plants'||microzone==='wood'?'willow':'reeds',microzone,
    valid:p.implemented&&base.valid&&sector&&within,
    reason:!p.implemented?'Ce poste est en préparation.':!within?'Hors de portée de la canne au coup. Rapprochez le placement.':!sector?'Restez dans le couloir devant ce poste.':base.reason};
}
export function lineObstacle(post:PostId,point:WaterPoint):Obstacle|undefined {
  const dx=point.x,dz=point.z+1,length=dx*dx+dz*dz;
  return postById(post).obstacles.find(o=>{const t=Math.max(0,Math.min(1,(o.x*dx+(o.z+1)*dz)/Math.max(.001,length)));return Math.hypot(o.x-dx*t,o.z+1-dz*t)<o.radius;});
}
// Abondances et tailles de jeu versionnées : aucune estimation de population réelle.
export const ENCOUNTER_CONFIG = {version:1,rate:.16,groundbaitSeconds:45,groundbaitRadius:1.8,precisionRadius:1.2};
const COMMON:Partial<Record<SpeciesId,number>>={roach:3,perch:1.5,carp:.6,pike:.35,bream:1.3,tench:.55,rudd:1.6,bleak:2,crucian:.8,whitebream:1.1,gudgeon:1.4,chub:.5,ide:.45};
export const POPULATIONS:Record<PostId,Partial<Record<SpeciesId,number>>>={
  jetty:{...COMMON,zander:.2,catfish:.12},cove:{...COMMON,tench:1.7,crucian:1.5,carp:1.1,pike:.12},
  bank:{...COMMON,perch:2.3,pike:.6,zander:.6,catfish:.2,tench:0},
  'reed-bank':{...COMMON,tench:2,pike:.8,carp:1.4,perch:2,zander:0},point:{...COMMON,perch:2,zander:1,bream:2,catfish:.5},timber:{...COMMON,perch:2,pike:1,carp:1,catfish:.6},
  river:{roach:2,perch:1,chub:3,ide:1,gudgeon:3,bleak:1},deep:{perch:3,zander:2,bream:2,roach:1,catfish:.4},boat:{perch:3,pike:1,zander:2,bream:1,catfish:1.5},
};
export function populationWeight(post:PostId,id:SpeciesId,zone:Microzone) {
  const abundance=POPULATIONS[post][id]??0;
  const affinity=(zone==='plants'||zone==='wood')&&['perch','pike','tench','rudd','carp'].includes(id)?1.6:
    zone==='dropoff'&&['zander','bream','catfish'].includes(id)?1.8:
    zone==='margin'&&['roach','bleak','gudgeon','crucian'].includes(id)?1.5:1;
  return abundance*affinity;
}
export const localSizeExponent = (post:PostId) => post==='cove'?2.1:post==='reed-bank'?1.4:1.8;
