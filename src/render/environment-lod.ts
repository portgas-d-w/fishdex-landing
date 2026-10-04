import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import {Mesh} from '@babylonjs/core/Meshes/mesh';

/** Niveaux déclarés dans environment-registry.json : `lod.levels=[{level:1,distance:22},…]`. */
export interface LodLevel{level:number;distance:number}
const LOD_NAME=/^(.*)_lod(\d)(?:_primitive(\d+))?$/;
export const isLodNode=(name:string)=>LOD_NAME.test(name);
export const lodLevelOf=(name:string)=>{const m=LOD_NAME.exec(name);return m?Number(m[2]):0;};
/**
 * Relie les meshes `<nom>_lodN[_primitiveK]` d’un même GLB : chaque primitive du niveau 0 reçoit la même
 * primitive des niveaux suivants aux distances du registre. Un niveau à primitive unique (imposteur) remplace
 * la dernière primitive (feuillage) ; les autres primitives disparaissent à cette distance. Au-delà de `cull`,
 * plus rien n’est dessiné. Les instances suivent le LOD de leur source. Sans `levels`, rien n’est relié.
 */
export function bindEmbeddedLods(meshes:AbstractMesh[],levels:LodLevel[]|undefined,cull?:number){
 if(!levels?.length)return 0;const groups=new Map<string,Map<number,Map<number,Mesh>>>();
 for(const mesh of meshes){const m=LOD_NAME.exec(mesh.name);if(!m||!(mesh instanceof Mesh)||!mesh.getTotalVertices())continue;const byLevel=groups.get(m[1])??new Map<number,Map<number,Mesh>>();const prims=byLevel.get(Number(m[2]))??new Map<number,Mesh>();prims.set(m[3]===undefined?-1:Number(m[3]),mesh);byLevel.set(Number(m[2]),prims);groups.set(m[1],byLevel);}
 let bound=0;const sorted=[...levels].sort((a,b)=>a.distance-b.distance);
 for(const byLevel of groups.values()){const lod0=byLevel.get(0);if(!lod0)continue;const last=Math.max(...lod0.keys());
  for(const [k,base]of lod0){if(base.getLODLevels().length)continue;
   for(const l of sorted){const level=byLevel.get(l.level);if(!level)continue;const target=level.get(k)??(level.size===1&&level.has(-1)&&k===last?level.get(-1)!:null);base.addLODLevel(l.distance,target);if(target)bound++;}
   if(cull)base.addLODLevel(cull,null);}}
 return bound;
}
