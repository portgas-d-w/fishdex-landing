import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {AssetContainer} from '@babylonjs/core/assetContainer';
import type {Scene} from '@babylonjs/core/scene';
import {FoliageWindPlugin,WIND_AMPLITUDE} from './environment-wind';

/**
 * Les GLB du décor (fdx-* Blender FishDex, free-* gratuits) sont rendus par StandardMaterial (espace gamma) : la base color doit rester encodée sRGB
 * dans le GPU. Sans cette option, le chargeur glTF crée des textures sRGB matérielles qui renvoient des
 * valeurs linéaires, environ quatre fois trop sombres une fois affichées sans conversion.
 */
export const environmentLoadOptions=(url:string)=>/\/(fdx|free)-[^/]+\.glb$/.test(url)?{pluginOptions:{gltf:{useSRGBBuffers:false}}}:undefined;

/**
 * Chemin d’éclairage mobile partagé : les GLB du décor arrivent en PBR glTF et sont convertis
 * en StandardMaterial mats, sans IBL par pixel. Les GLB `fdx-*` (Blender FishDex) gardent leur
 * normal map ; les anciens `free-*` conservent leurs réglages historiques.
 */
export function adaptEnvironmentMaterials(c:AssetContainer,scene:Scene,family:string,url:string){
 const fdx=/\/fdx-[^/]+\.glb$/.test(url),free=/\/free-[^/]+\.glb$/.test(url);if(!fdx&&!free)return 0;
 const converted=new Map<PBRMaterial,StandardMaterial>();
 for(const source of c.materials)if(source instanceof PBRMaterial){
  const material=new StandardMaterial(source.name+'-mobile',scene);
  material.diffuseColor=source.albedoColor.clone();material.diffuseTexture=source.albedoTexture;
  material.backFaceCulling=source.backFaceCulling;material.twoSidedLighting=!source.backFaceCulling;
  const alpha=source.transparencyMode===PBRMaterial.MATERIAL_ALPHATEST||!!source.albedoTexture?.hasAlpha;
  if(fdx){
   // Rugosité glTF → reflet spéculaire discret ; aucune matière naturelle métallique.
   // Matières mates (rugosité ≥ 0,85, feuillage) : pas de terme spéculaire, shader plus léger sur mobile.
   const rough=Math.max(.35,Math.min(1,source.roughness??.9));material.specularColor=rough>=.85||alpha?Color3.Black():Color3.Gray().scale(.12*(1-rough)+.01);material.specularPower=10+40*(1-rough);
   // Écorce : arbres vus surtout de loin, la normal map n’apporte rien et coûte un repère tangent par pixel.
   if(source.name==='fdx_bark')source.bumpTexture=null;
   if(source.bumpTexture){material.bumpTexture=source.bumpTexture;material.bumpTexture.level=source.bumpTexture.level||1;material.invertNormalMapX=source.invertNormalMapX;material.invertNormalMapY=source.invertNormalMapY;}
   // Feuillage/imposteurs : normales de volume exportées depuis Blender ; pas d’inversion pour les faces arrière
   // (twoSidedLighting assombrirait la moitié des cartes et des plans croisés).
   if(alpha){material.useAlphaFromDiffuseTexture=true;material.transparencyMode=StandardMaterial.MATERIAL_ALPHATEST;material.alphaCutOff=source.alphaCutOff||.5;material.backFaceCulling=false;material.twoSidedLighting=false;}
  }else{
   material.specularColor=new Color3(.015,.015,.015);
   if(source.albedoTexture?.hasAlpha||['grass_clump','lily_cluster'].includes(family))material.emissiveColor=new Color3(.02,.025,.01);
   if(family==='lily_cluster')material.diffuseColor=new Color3(.34,.43,.22);
   if(source.albedoTexture?.hasAlpha){material.useAlphaFromDiffuseTexture=true;material.transparencyMode=StandardMaterial.MATERIAL_ALPHATEST;material.alphaCutOff=.45;}
  }
  if(fdx&&WIND_AMPLITUDE[source.name]!==undefined)new FoliageWindPlugin(material,WIND_AMPLITUDE[source.name]);
  converted.set(source,material);
 }
 for(const mesh of c.meshes)if(mesh.material instanceof PBRMaterial)mesh.material=converted.get(mesh.material)??mesh.material;
 for(const multi of c.multiMaterials)multi.subMaterials=multi.subMaterials.map(m=>m instanceof PBRMaterial?converted.get(m)??m:m);
 c.materials=c.materials.map(m=>m instanceof PBRMaterial?converted.get(m)??m:m);
 for(const source of converted.keys())source.dispose(false,false);
 return converted.size;
}
