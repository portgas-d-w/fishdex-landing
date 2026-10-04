import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import {Mesh} from '@babylonjs/core/Meshes/mesh';

/** Niveaux déclarés dans environment-registry.json : `lod.levels=[{level:1,distance:22},…]`. */
export interface LodLevel{level:number;distance:number}
const LOD_NAME=/^(.*)_lod(\d)(?:_primitive\d+)?$/;
export const lodLevelOf=(name:string)=>{const m=LOD_NAME.exec(name);return m?Number(m[2]):0;};
/**
 * Relie les meshes `<nom>_lodN` d’un même GLB : le niveau 0 reçoit les niveaux suivants aux distances
 * du registre (au-delà de `cull`, plus rien n’est dessiné). Les instances suivent le LOD de leur source.
 * Aucun LOD n’est déduit d’un nom de fichier : sans `levels` dans le registre, rien n’est relié.
 */
export function bindEmbeddedLods(meshes:AbstractMesh[],levels:LodLevel[]|undefined,cull?:number){
 if(!levels?.length)return 0;const chains=new Map<string,Map<number,Mesh>>();
 for(const mesh of meshes){const m=LOD_NAME.exec(mesh.name);if(!m||!(mesh instanceof Mesh))continue;const key=m[1]+(mesh.name.match(/_primitive\d+$/)?.[0]??'');const chain=chains.get(key)??new Map<number,Mesh>();chain.set(Number(m[2]),mesh);chains.set(key,chain);}
 let bound=0;
 for(const chain of chains.values()){const base=chain.get(0);if(!base||base.getLODLevels().length)continue;for(const l of [...levels].sort((a,b)=>a.distance-b.distance)){const level=chain.get(l.level);if(level){base.addLODLevel(l.distance,level);bound++;}}if(cull)base.addLODLevel(cull,null);}
 return bound;
}
