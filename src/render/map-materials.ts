import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {Scene} from '@babylonjs/core/scene';
/** Local photographs, offline ground blending and a shared mobile lighting path. */
export class MapMaterials{
 private cache=new Map<string,StandardMaterial>();
 constructor(private scene:Scene){}
 wood(bark=false){
  const name=bark?'bark_willow_02':'wood_planks_dirt';let m=this.cache.get(name);if(m)return m;
  m=new StandardMaterial('map-'+name,this.scene);const material=m;
  m.diffuseColor=Color3.White();m.specularColor=new Color3(.02,.02,.02);m.specularPower=24;
  const load=(kind:string,failed:()=>void)=>{const t=new Texture(`/map-assets/${name}-${kind}.${kind==='color'?'jpg':'png'}`,this.scene,false,false,Texture.TRILINEAR_SAMPLINGMODE,undefined,failed);t.gammaSpace=kind==='color';t.anisotropicFilteringLevel=2;return t;};
  m.diffuseTexture=load('color',()=>{material.diffuseTexture=null;material.diffuseColor=Color3.FromHexString(bark?'#65584a':'#aa9e83');});
  m.bumpTexture=load('normal',()=>{material.bumpTexture=null;});m.bumpTexture.level=.22;m.invertNormalMapX=!this.scene.useRightHandedSystem;m.invertNormalMapY=this.scene.useRightHandedSystem;
  m.specularTexture=load('specular',()=>{material.specularTexture=null;});m.useGlossinessFromSpecularMapAlpha=true;this.cache.set(name,m);return m;
 }
 ground(){
  // Macro-couleur cuite depuis la carte réelle + détail tuilé tous les 3 m (une lecture de plus, pas de splat multi-lectures).
  const m=new StandardMaterial('map-ground',this.scene);m.diffuseColor=Color3.White();m.specularColor=new Color3(.004,.004,.004);m.specularPower=10;
  const tex=new Texture('/map-assets/ground-macro.jpg',this.scene,false,false,Texture.TRILINEAR_SAMPLINGMODE,undefined,()=>{m.diffuseTexture=null;m.diffuseColor=Color3.FromHexString('#66713f');});
  tex.wrapU=tex.wrapV=Texture.CLAMP_ADDRESSMODE;tex.anisotropicFilteringLevel=4;m.diffuseTexture=tex;
  const detail=new Texture('/map-assets/ground-detail.png',this.scene,false,false,Texture.TRILINEAR_SAMPLINGMODE,undefined,()=>{m.detailMap.isEnabled=false;});
  detail.gammaSpace=false;detail.uScale=180/3;detail.vScale=140/3;detail.anisotropicFilteringLevel=4;
  m.detailMap.texture=detail;m.detailMap.diffuseBlendLevel=1;m.detailMap.bumpLevel=0;m.detailMap.isEnabled=true;return m;
 }
}
