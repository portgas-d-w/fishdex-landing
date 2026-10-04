import registry from './environment-registry.json';
import {MapMaterials} from './map-materials';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import {Effect} from '@babylonjs/core/Materials/effect';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import {Scene} from '@babylonjs/core/scene';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import {POND_MAP,pondGround,inPond,shoreDistance,localToPond} from '../game/pond-map';
import {POSTS,worldPoint} from '../game/posts';
import type {AssetContainer} from '@babylonjs/core/assetContainer';
interface EnvironmentEntry{id:string;version:number;resource:string|null;lightmap:string|null;dimensions:number[];dimensionTolerance:number;collision:string;sockets:unknown[]};
const ENTRIES=registry.entries as EnvironmentEntry[];
export interface Placement{id:string;family:string;x:number;y:number;z:number;yaw:number;scale:number}
export class PondScenery{
 readonly placements:Placement[]=[];readonly meshes:Mesh[]=[];readonly reflectors:AbstractMesh[]=[];private mapMaterials:MapMaterials;private detailTrees=new Set<string>();private detailHolders=new Map<string,TransformNode>();private quality:'eco'|'high'='eco';onAssetsChanged?:()=>void;private seed=127;private ambience='morning';private lightmaps=new Map<StandardMaterial|PBRMaterial,Texture>();private windMaterials:ShaderMaterial[]=[];private windCache=new Map<string,ShaderMaterial>();private materialCache=new Map<string,StandardMaterial>();private groups=new Map<string,Mesh[]>();private containers=new Map<string,AssetContainer>();private replacements=new Map<string,ReturnType<AssetContainer['instantiateModelsToScene']>[]>();readonly status=new Map<string,string>();
 constructor(private scene:Scene){this.mapMaterials=new MapMaterials(scene);Effect.ShadersStore.pondPlantVertexShader='precision highp float;attribute vec3 position;attribute vec3 normal;attribute vec4 color;uniform mat4 worldViewProjection;uniform mat4 world;uniform float time;uniform float wind;varying vec3 wp;varying vec3 norm;varying vec3 col;void main(){vec3 p=position;p.x+=sin(time*.8+position.z*.2)*color.a*(.025+abs(wind)*.09);wp=(world*vec4(p,1.)).xyz;norm=normal;col=color.rgb;gl_Position=worldViewProjection*vec4(p,1.);}';Effect.ShadersStore.pondPlantFragmentShader='precision highp float;varying vec3 wp;varying vec3 norm;varying vec3 col;uniform vec3 eye;uniform vec3 tint;void main(){float light=.58+max(0.,dot(normalize(norm),normalize(vec3(-.65,.8,.4))))*.42;float fog=1.-exp(-pow(length(eye-wp)*.0075,2.));gl_FragColor=vec4(mix(col*light*tint,vec3(.72,.77,.75),fog),1.);}';this.terrain();this.populate();this.batch();const ground=this.meshes.find(m=>m.name==='pond-shared-terrain')!;const previous=ground.material as StandardMaterial;ground.material=this.mapMaterials.ground();previous.dispose(false,true);this.materialCache.delete('#ffffff');ground.useVertexColors=false;for(const e of ENTRIES)if(e.resource)void this.replace(e.id,e.resource);}
 private rand(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 private mat(color:string){if(['#aa9e83','#b4a990'].includes(color))return this.mapMaterials.wood();if(['#65584a','#675646','#7c6d52'].includes(color))return this.mapMaterials.wood(true);let m=this.materialCache.get(color);if(!m){m=new StandardMaterial('pond-'+color,this.scene);m.diffuseColor=Color3.FromHexString(color);if(['#aa9e83','#b4a990'].includes(color)){const tex=new DynamicTexture('pier-wood-grain',{width:256,height:128},this.scene,true),ctx=tex.getContext() as CanvasRenderingContext2D;ctx.fillStyle='#d8c7a8';ctx.fillRect(0,0,256,128);for(let n=0;n<70;n++){ctx.strokeStyle=n%3?'#6b594531':'#eee4ca33';ctx.lineWidth=.4+n%2;ctx.beginPath();ctx.moveTo(0,n*2);ctx.bezierCurveTo(80,n*2+Math.sin(n)*3,170,n*2-2,256,n*2);ctx.stroke();}tex.update();m.diffuseTexture=tex;}m.specularColor=Color3.Black();this.materialCache.set(color,m);}return m;}
 private terrain(){const m=new Mesh('pond-shared-terrain',this.scene),p:number[]=[],idx:number[]=[],normal:number[]=[],colors:number[]=[],uv:number[]=[];const nx=90,nz=70;for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const x=-90+i*2,z=-31+j*2,y=pondGround({x,z}),wet=shoreDistance({x,z})<1.4||y<0,c=Color3.FromHexString(y<0?'#6e6e49':wet?'#575844':'#79815a');p.push(x,y,z);colors.push(c.r,c.g,c.b,1);uv.push((x+90)/180,(z+31)/140);}for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+nx+1;idx.push(a,a+1,b,a+1,b+1,b);}VertexData.ComputeNormals(p,idx,normal);const d=new VertexData();d.positions=p;d.indices=idx;d.normals=normal;d.colors=colors;d.uvs=uv;d.applyToMesh(m);const mat=this.mat('#ffffff') as StandardMaterial,tex=new DynamicTexture('pond-earth-grain',{width:256,height:256},this.scene,true),ctx=tex.getContext() as CanvasRenderingContext2D;ctx.fillStyle='#a7a58b';ctx.fillRect(0,0,256,256);for(let n=0;n<1600;n++){ctx.fillStyle=n%2?'#55593b20':'#ded9b526';ctx.fillRect(this.rand()*256,this.rand()*256,2,1);}tex.update();mat.diffuseTexture=tex;m.material=mat;m.isPickable=false;m.freezeWorldMatrix();this.meshes.push(m);this.reflectors.push(m);}
 private add(family:string,x:number,z:number,scale=1,y=pondGround({x,z}),yaw=this.rand()*Math.PI*2){const id=family+'-'+this.placements.length;this.placements.push({id,family,x,y,z,scale,yaw});return{id,family,x,y,z,scale,yaw};}
 private shape(p:Placement,kind:'box'|'stone'|'stem',offset:Vector3,size:Vector3,color:string,tilt=0){const m=kind==='box'?MeshBuilder.CreateBox(p.id,{size:1},this.scene):kind==='stem'?MeshBuilder.CreateCylinder(p.id,{height:1,diameter:1,tessellation:6},this.scene):MeshBuilder.CreateIcoSphere(p.id,{radius:1,subdivisions:1,flat:true},this.scene);m.position.set(p.x+offset.x*p.scale,p.y+offset.y*p.scale,p.z+offset.z*p.scale);m.scaling.copyFrom(size.scale(p.scale));m.rotation.set(0,p.yaw,tilt);m.material=this.mat(color);if(p.family==='pier_deck'){m.computeWorldMatrix(true);const pos=m.getVerticesData(VertexBuffer.PositionKind)!,uv:number[]=[];for(let n=0;n<pos.length;n+=3){const w=Vector3.TransformCoordinates(new Vector3(pos[n],pos[n+1],pos[n+2]),m.getWorldMatrix());const normal=m.getVerticesData(VertexBuffer.NormalKind)!;const ny=Math.abs(normal[n+1]),nx=Math.abs(normal[n]);uv.push((ny>.5||nx<.5?w.x:w.z)/2,(ny>.5?w.z:w.y)/2);}m.setVerticesData(VertexBuffer.UVKind,uv);}if(['#65584a','#675646','#7c6d52'].includes(color)&&kind==='stem'){const uv=m.getVerticesData(VertexBuffer.UVKind)!;for(let i=0;i<uv.length;i+=2){uv[i]*=Math.PI*size.x*p.scale/2.2;uv[i+1]*=size.y*p.scale/2.2;}m.setVerticesData(VertexBuffer.UVKind,uv);}if(['tree_alder','tree_willow','tree_oak','reeds','grass_clump','shrub'].includes(p.family)&&!['#65584a'].includes(color)){let mat=this.windCache.get(color);if(!mat){mat=new ShaderMaterial('pond-wind-'+color,this.scene,{vertex:'pondPlant',fragment:'pondPlant'},{attributes:['position','normal','color'],uniforms:['worldViewProjection','world','time','wind','eye','tint']});mat.setFloat('time',0);mat.setFloat('wind',0);mat.setVector3('eye',Vector3.Zero());mat.setColor3('tint',Color3.White());this.windCache.set(color,mat);this.windMaterials.push(mat);}const v=m.getVerticesData(VertexBuffer.PositionKind)!,cols:number[]=[],base=Color3.FromHexString(color);for(let n=0;n<v.length;n+=3)cols.push(base.r,base.g,base.b,Math.max(0,Math.min(1,(v[n+1]*size.y+offset.y)/8)));m.setVerticesData(VertexBuffer.ColorKind,cols);m.material=mat;}m.metadata={family:p.family,placement:p.id};m.isPickable=false;const key=p.family+':'+Math.floor(p.x/24)+':'+Math.floor(p.z/24)+':'+color+(this.detailTrees.has(p.id)?':@'+p.id:''),list=this.groups.get(key)??[];list.push(m);this.groups.set(key,list);return m;}
 private tree(p:Placement){const willow=p.family==='tree_willow',h=willow?7:8.5;this.shape(p,'stem',new Vector3(0,h*.34,0),new Vector3(.32,h*.68,.32),'#65584a',willow?.16:0);const near=Math.min(...POND_MAP.spots.map(s=>Math.hypot(p.x-s.origin.x,p.z-s.origin.z)))<35;for(let n=0;n<(near?4:2);n++){const a=n*2.1+p.yaw;this.shape(p,'stone',new Vector3(Math.sin(a)*(n%2?1.1:.7),h*(.6+n*.08),Math.cos(a)*1.2),new Vector3(1.3+(n%2)*.6,willow?1.4:1.7,.9+(n%3)*.4),['#405439','#52633f','#69744b'][n%3]);}if(willow)for(let n=0;n<3;n++)this.shape(p,'stem',new Vector3(-1+n,3.8,.6),new Vector3(.1,2.6,.1),'#566440',.18);}
 private populate(){
  const treePlacements:Placement[]=[];
  // Objets visibles associés aux volumes de fil déjà simulés.
  for(const post of POSTS)for(const o of post.obstacles){const at=worldPoint(post.id,o),p=this.add(post.id==='timber'?'submerged_branches':'reeds',at.x,at.z,1,-.25);if(post.id==='timber'){for(let n=0;n<3;n++)this.shape(p,'stem',new Vector3((n-1)*.5,.4,0),new Vector3(.12,2.5,.12),'#65584a',1.1+n*.15);}else for(let n=0;n<7;n++)this.shape(p,'stem',new Vector3(Math.cos(n*1.9)*o.radius*.75,.9,Math.sin(n*1.9)*o.radius*.75),new Vector3(.04,1.8+n%3*.13,.04),'#6d754c',Math.sin(n)*.1);}
  for(let n=0;n<90;n++){const a=n/90*Math.PI*2,x=Math.sin(a)*(65+this.rand()*15),z=39+Math.cos(a)*(50+this.rand()*13);if(inPond({x,z})||POND_MAP.spots.some(s=>Math.hypot(x-s.origin.x,z-s.origin.z)<13))continue;treePlacements.push(this.add(n%7===0?'tree_willow':n%3===0?'tree_alder':'tree_oak',x,z,.7+this.rand()*.5));}
  for(let n=0;n<55;n++){const a=n/55*Math.PI*2,x=Math.sin(a)*(76+this.rand()*8),z=39+Math.cos(a)*(60+this.rand()*8);if(inPond({x,z})||POND_MAP.spots.some(s=>Math.hypot(x-s.origin.x,z-s.origin.z)<13))continue;treePlacements.push(this.add(n%4?'tree_alder':'tree_oak',x,z,.65+this.rand()*.35));}
  for(const spot of POND_MAP.spots){const near=treePlacements.filter(p=>p.family!=='tree_willow').sort((a,b)=>Math.hypot(a.x-spot.origin.x,a.z-spot.origin.z)-Math.hypot(b.x-spot.origin.x,b.z-spot.origin.z)).slice(0,3);for(const p of near)this.detailTrees.add(p.id);}for(const p of treePlacements)this.tree(p);
  for(const id of ['cove','bank','reed-bank','point','timber'])for(const side of [-1,1])for(let n=0;n<3;n++){const at=localToPond(id,{x:side*(1.3+n*.3),z:-3-n*.5});if(inPond(at))continue;const p=this.add('grass_clump',at.x,at.z,.7+this.rand()*.3);for(let blade=0;blade<5;blade++)this.shape(p,'box',new Vector3((blade-2)*.08,.24,Math.sin(blade)*.08),new Vector3(.04,.48+blade*.04,.07),'#687348',Math.sin(blade)*.22);}
  for(let n=0;n<80;n++){const c=POND_MAP.contour[n%POND_MAP.contour.length],x=c.x+(this.rand()-.5)*8,z=c.z+(this.rand()-.5)*8;if(inPond({x,z})||POND_MAP.spots.some(s=>Math.hypot(x-s.origin.x,z-s.origin.z)<8))continue;const p=this.add(n%3?'grass_clump':'shrub',x,z,.6+this.rand()*.7);this.shape(p,n%3?'stem':'stone',new Vector3(0,.3,0),new Vector3(n%3?.22:.7,n%3?.55:.5,n%3?.22:.6),'#687348');}
  for(const id of ['cove','reed-bank'])for(let n=0;n<18;n++){const at=localToPond(id,{x:-2.5+(n%6)*.25,z:4+Math.floor(n/6)*1.1}),p=this.add('lily_cluster',at.x,at.z,1,.025);this.shape(p,'stem',new Vector3(0,0,0),new Vector3(.32,.01,.25),'#71804b');}
  for(const id of ['bank','point','timber'])for(let n=0;n<7;n++){const at=localToPond(id,{x:(n%2?1:-1)*(4+n*.25),z:-5}),p=this.add(id==='point'&&n===0?'rock_landmark':'rock_small',at.x,at.z,.5+this.rand());this.shape(p,'stone',new Vector3(0,.2,0),new Vector3(.7,.4,.6),'#8d8d7a');}
  const log=localToPond('timber',{x:3,z:5}),p=this.add('fallen_log',log.x,log.z,1,-.15);this.shape(p,'stem',new Vector3(0,.25,0),new Vector3(.4,5,.4),'#675646',Math.PI/2);
  for(let n=0;n<4;n++){const p=this.add('pier_deck',0,-7+n*2,1,.28,0);for(let j=0;j<7;j++)this.shape(p,'box',new Vector3(0,0,-.85+j*.285),new Vector3(2.4,.15,.27),j%2?'#aa9e83':'#b4a990');}for(const x of [-1.12,1.12])for(const z of [-6.5,-1.7]){const p=this.add('pier_pile',x,z,1,-.1,0);this.shape(p,'stem',Vector3.Zero(),new Vector3(.17,1.7,.17),'#7c6d52');}
  for(const s of POND_MAP.spots){for(let n=0;n<3;n++){const at=localToPond(s.id,{x:0,z:-9-n*3}),p=this.add('path_patch',at.x,at.z,1,pondGround(at)+.015,s.angle);this.shape(p,'box',Vector3.Zero(),new Vector3(1.4,.025,3),'#958e70');}}
 }
 private batch(){for(const [key,parts]of this.groups){const m=parts.length>1?Mesh.MergeMeshes(parts,true,true):parts[0];if(!m)continue;m.name='pond-asset-'+key;m.metadata={family:key.split(':')[0],placement:parts[0].metadata?.placement,treeDetail:key.includes(':@')};m.freezeWorldMatrix();m.isPickable=false;if(m.metadata.family==='path_patch')m.setEnabled(false);this.meshes.push(m);if(!['lily_cluster','grass_clump','path_patch','submerged_branches'].includes(m.metadata.family))this.reflectors.push(m);this.status.set(m.metadata.family,'procedural');}}
 private enabled=true;
 private requests=new Map<string,number>();
 private sources=new Map<string,{promise:Promise<AssetContainer>;users:number}>();
 private sourceKeys=new WeakMap<AssetContainer,string>();private adapted=new WeakSet<AssetContainer>();
 private async acquire(url:string){let source=this.sources.get(url);if(!source){source={promise:LoadAssetContainerAsync(url,this.scene),users:0};this.sources.set(url,source);}source.users++;try{const container=await source.promise;this.sourceKeys.set(container,url);return container;}catch(error){if(--source.users===0)this.sources.delete(url);throw error;}}
 private release(container:AssetContainer){const url=this.sourceKeys.get(container),source=url?this.sources.get(url):undefined;if(source&&--source.users>0)return;if(url)this.sources.delete(url);for(const m of container.materials)this.lightmaps.delete(m as StandardMaterial|PBRMaterial);container.dispose();}
 private disposeReplacement(family:string){
  for(const r of this.replacements.get(family)??[])r.dispose();for(const [id,holder]of this.detailHolders)if(holder.isDisposed())this.detailHolders.delete(id);
  this.replacements.delete(family);
  const container=this.containers.get(family);
  if(container)this.release(container);
  this.containers.delete(family);
  for(let n=this.reflectors.length-1;n>=0;n--)if(this.reflectors[n].isDisposed())this.reflectors.splice(n,1);
 }
 /** Une famille seulement : validation avant substitution, collision et sockets inchangés. */
 async replace(family:string,url:string|null){
  const contract=ENTRIES.find(e=>e.id===family);
  if(!contract||!this.placements.some(p=>p.family===family))return false;
  const token=(this.requests.get(family)??0)+1;this.requests.set(family,token);
  if(url&&!/^\/models\/environment\/[a-zA-Z0-9_-]+\.glb$/.test(url)){this.status.set(family,'invalid_path');return false;}
  if(!url){this.disposeReplacement(family);this.meshes.filter(m=>m.metadata?.family===family).forEach(m=>m.setEnabled(this.enabled));this.status.set(family,'procedural');return true;}
  let c:AssetContainer|undefined;const instances:ReturnType<AssetContainer['instantiateModelsToScene']>[]=[];
  try{
   c=await this.acquire(url);
   if(this.requests.get(family)!==token||this.scene.isDisposed){this.release(c);return false;}
   const meshes=c.meshes.filter(m=>m.getTotalVertices()>0);if(!meshes.length)throw Error('empty');
   const bounds=meshes.reduce((acc,m)=>{m.computeWorldMatrix(true);const b=m.getBoundingInfo().boundingBox;return{min:Vector3.Minimize(acc.min,b.minimumWorld),max:Vector3.Maximize(acc.max,b.maximumWorld)};},{min:new Vector3(Infinity,Infinity,Infinity),max:new Vector3(-Infinity,-Infinity,-Infinity)}),size=bounds.max.subtract(bounds.min);
   if(![size.x,size.y,size.z].every(v=>Number.isFinite(v)&&v>0&&v<25))throw Error('invalid_dimensions');
   if([size.x,size.y,size.z].some((v,i)=>v>contract.dimensions[i]*contract.dimensionTolerance||v<contract.dimensions[i]/contract.dimensionTolerance))throw Error('dimensions_outside_contract');
   // Matte vegetation shares the existing mobile lighting path, without per-pixel IBL.
   if(url.startsWith('/models/environment/free-')&&!this.adapted.has(c)){
    const converted=new Map<PBRMaterial,StandardMaterial>();
    for(const source of c.materials)if(source instanceof PBRMaterial){
     const material=new StandardMaterial(source.name+'-mobile',this.scene);
     material.diffuseColor=source.albedoColor.clone();material.diffuseTexture=source.albedoTexture;
     material.backFaceCulling=source.backFaceCulling;material.specularColor=new Color3(.015,.015,.015);
     if(source.albedoTexture?.hasAlpha||['grass_clump','lily_cluster'].includes(family))material.emissiveColor=new Color3(.02,.025,.01);
     if(family==='lily_cluster')material.diffuseColor=new Color3(.34,.43,.22);
     if(source.albedoTexture?.hasAlpha){material.useAlphaFromDiffuseTexture=true;material.transparencyMode=StandardMaterial.MATERIAL_ALPHATEST;material.alphaCutOff=.45;}
     converted.set(source,material);
    }
    for(const mesh of c.meshes)if(mesh.material instanceof PBRMaterial)mesh.material=converted.get(mesh.material)??mesh.material;
    for(const multi of c.multiMaterials)multi.subMaterials=multi.subMaterials.map(m=>m instanceof PBRMaterial?converted.get(m)??m:m);
    c.materials=c.materials.map(m=>m instanceof PBRMaterial?converted.get(m)??m:m);
    for(const source of converted.keys())source.dispose(false,false);this.adapted.add(c);
   }
   this.bindLightmap(c,contract);
   for(const p of this.placements.filter(p=>p.family===family&&(!family.startsWith('tree_')||this.detailTrees.has(p.id)))){
    const r=c.instantiateModelsToScene(n=>p.id+'-'+n,false,{doNotInstantiate:false});instances.push(r);
    const holder=new TransformNode('asset-instance-'+p.id,this.scene);holder.position.set(p.x,p.y,p.z);holder.rotation.y=p.yaw;holder.scaling.setAll(p.scale);holder.setEnabled(this.enabled);
    for(const node of r.rootNodes)node.parent=holder;r.rootNodes=[holder];if(family.startsWith('tree_'))this.detailHolders.set(p.id,holder);
    for(const m of holder.getChildMeshes()){m.metadata={family,placement:p.id};m.computeWorldMatrix(true);m.freezeWorldMatrix();if(!['grass_clump','lily_cluster'].includes(family))this.reflectors.push(m);}holder.freezeWorldMatrix();
   }
   this.disposeReplacement(family);this.containers.set(family,c);this.replacements.set(family,instances);
   this.meshes.filter(m=>m.metadata?.family===family&&(!family.startsWith('tree_')||m.metadata?.treeDetail)).forEach(m=>m.setEnabled(false));this.status.set(family,'glb:'+url);this.onAssetsChanged?.();return true;
  }catch(e){for(const r of instances)r.dispose();if(c)this.release(c);for(const [id,holder]of this.detailHolders)if(holder.isDisposed())this.detailHolders.delete(id);for(let n=this.reflectors.length-1;n>=0;n--)if(this.reflectors[n].isDisposed())this.reflectors.splice(n,1);if(this.requests.get(family)===token)this.status.set(family,'fallback:'+String(e));return false;}
 }
 private bindLightmap(c:AssetContainer,entry:EnvironmentEntry){if(!entry.lightmap)return;if(!/^\/models\/environment\/[a-zA-Z0-9_-]+\.png$/.test(entry.lightmap))throw Error('invalid_lightmap_path');const meshes=c.meshes.filter(m=>m.getTotalVertices()>0);if(meshes.some(m=>!m.isVerticesDataPresent(VertexBuffer.UV2Kind)))throw Error('missing_UV2');const tex=new Texture(entry.lightmap,this.scene);tex.coordinatesIndex=1;tex.gammaSpace=false;c.textures.push(tex);for(const m of c.materials)if(m instanceof StandardMaterial||m instanceof PBRMaterial){this.lightmaps.set(m,tex);m.useLightmapAsShadowmap=true;m.lightmapTexture=this.ambience==='morning'?tex:null;}}
 setAmbience(preset:string){this.ambience=preset;for(const [m,tex]of this.lightmaps){m.lightmapTexture=preset==='morning'?tex:null;}for(const m of this.windMaterials)m.setColor3('tint',Color3.FromHexString(preset==='evening'?'#edc89d':preset==='overcast'?'#e0e9e7':'#ffffff'));}
 setQuality(quality:'eco'|'high'){this.quality=quality;}
 updateWind(time:number,wind:number,eye:Vector3){let changed=false;const camera=this.scene.activeCamera,projection=this.scene.getEngine().getRenderHeight()/(2*Math.tan((camera?.fov??.8)/2));for(const [id,h]of this.detailHolders){const p=this.placements.find(p=>p.id===id)!;const pixels=8.5*p.scale*projection/Math.max(1,Vector3.Distance(eye,h.position)),near=this.enabled&&pixels>(this.quality==='high'?70:110);if(h.isEnabled()!==near){h.setEnabled(near);changed=true;}for(const proxy of this.meshes.filter(m=>m.metadata?.treeDetail&&m.metadata?.placement===id))proxy.setEnabled(this.enabled&&!near);}if(changed)this.onAssetsChanged?.();for(const m of this.windMaterials){m.setFloat('time',time);m.setFloat('wind',wind);m.setVector3('eye',eye);}}
 setEnabled(enabled:boolean){this.enabled=enabled;for(const m of this.meshes)m.setEnabled(enabled&&m.metadata?.family!=='path_patch'&&(!this.replacements.has(m.metadata?.family)||m.metadata?.family.startsWith('tree_')&&!m.metadata?.treeDetail));for(const list of this.replacements.values())for(const r of list)for(const n of r.rootNodes)if(n instanceof TransformNode)n.setEnabled(enabled);}
 diagnostics(){return{registryVersion:registry.version,contracts:ENTRIES.map(e=>({id:e.id,version:e.version,resource:e.resource,collision:e.collision,sockets:e.sockets})),placements:this.placements.length,families:Object.fromEntries(this.status),quantities:Object.fromEntries([...this.status.keys()].map(f=>[f,this.placements.filter(p=>p.family===f).length])),meshes:this.meshes.length,detailTrees:{available:this.detailHolders.size,enabled:[...this.detailHolders.values()].filter(h=>h.isEnabled()).length,thresholdPixels:this.quality==='high'?70:110},sharedSources:this.sources.size};}
}
