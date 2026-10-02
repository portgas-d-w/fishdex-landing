import {AssetContainer} from '@babylonjs/core/assetContainer';
import type {Scene} from '@babylonjs/core/scene';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import {speciesById,type SpeciesId} from '../game/catalog';
import type {Specimen} from '../game/specimens';
import {applyAppearance} from './appearance';

export type FishLook=Pick<Specimen,'coloration'|'mirage'|'appearanceId'|'seed'>;
// Géométries légères de remplacement ; aucun modèle d'une autre espèce présenté comme exact.
export function proceduralFish(scene:Scene,id:SpeciesId,look?:FishLook):AssetContainer {
 const species=speciesById(id);if(!species)throw Error('Identité inconnue');
 const family=species.family,elongated=family==='eel'||family==='loach',flat=family==='bream',sturgeon=family==='sturgeon',goby=family==='goby',apron=id==='apron-du-rhone',lamprey=id.includes('lamproie'),tiger=id==='truite-tiger';
 const sunfish=id==='perche-soleil';
 const height=sturgeon?.12:sunfish?.39:apron?.11:elongated?.085:flat?.34:family==='pike'?.13:family==='catfish'?.18:family==='salmon'?.18:goby?.16:.25;
 const width=sturgeon?.08:elongated?.07:flat?.095:family==='goby'?.19:family==='catfish'?.16:.12;
 const head=sturgeon?-1.08:family==='pike'?-.96:-.9,bodyEnd=elongated?.97:.72;
 const app=look?.appearanceId??'',albino=app.includes('albinos'),gold=app.includes('gold')||app.includes('dore')||app.includes('jaune')||app.includes('ogon')||look?.coloration==='golden',platinum=app.includes('platinum');
 const base=Color3.FromHexString(albino?'#e7ddd2':platinum?'#e1e5dd':gold?'#ddb352':tiger?'#b7a575':species.color);
 const parts:Mesh[]=[],materials:StandardMaterial[]=[];
 const material=(name:string,color:Color3)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=color;m.specularColor=Color3.Black();m.backFaceCulling=false;materials.push(m);return m;};
 const skin=material('fish-skin-'+id,Color3.White()),fin=material('fish-fin-'+id,gold?base:Color3.FromHexString(id==='carpe-koi'?'#ddd9bc':tiger?'#c59551':sturgeon?'#818e86':family==='salmon'?'#898d72':family==='perch'?'#bf7e48':'#8c8f76')),eye=material('fish-eye-'+id,albino?Color3.FromHexString('#b54c59'):Color3.FromHexString('#172528'));
 const positions:number[]=[],indices:number[]=[],colors:number[]=[],normals:number[]=[];
 const rings=32,sides=16,seed=look?.seed??127;
 for(let i=0;i<=rings;i++){
  const t=i/rings,x=head+(bodyEnd-head)*t;
  const bulge=sturgeon?Math.max(.035,Math.sin(Math.PI*t)**.9*(t<.25?t/.25:1)):elongated?Math.max(.06,Math.sin(Math.PI*t)**.35):goby||family==='catfish'?Math.max(.08,Math.sin(Math.PI*(.13+t*.87))**.8*(1.15-t*.65)):Math.max(.06,Math.sin(Math.PI*t)**.8*(1.1-t*.45));
  for(let j=0;j<=sides;j++){
   const a=j/sides*Math.PI*2,y=Math.sin(a)*height*bulge,z=Math.cos(a)*width*bulge;
   positions.push(x,y,z);
   let tint=Color3.Lerp(base,Color3.FromHexString('#40534d'),Math.max(0,Math.sin(a))*.45);
   if(!albino&&!platinum){
    const koi=id==='carpe-koi',spot=Math.sin(i*.67+seed*.01)+Math.cos(Math.cos(a)*1.8+i*.19);
    if(koi){tint=Color3.FromHexString('#e7e4d2');if(!app||app.includes('kohaku')||app.includes('sanke')||app.includes('showa'))if(spot>.5)tint=Color3.FromHexString('#c65b3d');if(app.includes('showa')||app.includes('sanke'))if(spot<-.6)tint=Color3.FromHexString('#303c38');if(gold)tint=base;if(platinum)tint=Color3.FromHexString('#e1e5dd');}
    else if(tiger){
     // Réticulations sombres sur les flancs ; la tiger n'est pas une robe de l'arc-en-ciel.
     const reticulation=Math.sin(i*1.7+Math.sin(a*5)*1.3+seed*.013);
     tint=Math.sin(a)<-.55?Color3.FromHexString('#d9d2a5'):reticulation>.30?Color3.FromHexString('#354832'):base;
    }else if(family==='perch'&&i%7<2||family==='salmon'&&!id.startsWith('coregone')&&spot>.78||goby&&i%8<3&&Math.abs(Math.sin(a))<.55)tint=Color3.FromHexString('#4b6255');
    if(app==='carpe-cuir')tint=Color3.Lerp(base,Color3.FromHexString('#6b7360'),Math.max(0,y/height)*.5);
    if((app.includes('miroir')&&i%4===0||app.includes('lineaire')&&j%6===0||app.includes('fully-scaled')&&(i+j)%2===0))tint=Color3.Lerp(tint,Color3.FromHexString('#d7c29c'),.38);
   }
   colors.push(tint.r,tint.g,tint.b,1);
   if(i<rings&&j<sides){const p=i*(sides+1)+j;indices.push(p,p+sides+1,p+1,p+1,p+sides+1,p+sides+2);}
  }
 }
 VertexData.ComputeNormals(positions,indices,normals);const data=new VertexData();Object.assign(data,{positions,indices,normals,colors});
 const body=new Mesh('procedural-'+id,scene);data.applyToMesh(body);body.material=skin;parts.push(body);
 const plate=(name:string,points:Vector3[],mat=fin)=>{const m=new Mesh(name,scene),v=new VertexData(),p=points.flatMap(p=>p.asArray()),ix=[];for(let i=1;i<points.length-1;i++)ix.push(0,i,i+1);const n:number[]=[];VertexData.ComputeNormals(p,ix,n);v.positions=p;v.indices=ix;v.normals=n;v.applyToMesh(m);m.material=mat;parts.push(m);return m;};
 if(!elongated){
  const tailHeight=sturgeon?.19:flat?.27:.22;
  if(tiger)plate('fish-tail',[new Vector3(bodyEnd-.06,0,0),new Vector3(.98,.19,0),new Vector3(1.02,.16,0),new Vector3(1.02,-.16,0),new Vector3(.98,-.19,0)]);
  else if(goby)plate('fish-tail',[new Vector3(bodyEnd-.06,0,0),new Vector3(.99,.17,0),new Vector3(1.06,.10,0),new Vector3(1.08,0,0),new Vector3(1.06,-.10,0),new Vector3(.99,-.17,0)]);
  else plate('fish-tail',[new Vector3(bodyEnd-.06,0,0),new Vector3(sturgeon?1.06:.99,sturgeon?.30:tailHeight,0),new Vector3(sturgeon?.88:.9,.025,0),new Vector3(sturgeon?.94:.99,sturgeon?-.12:-tailHeight,0)]);
 }
 const dorsal=family==='perch'?.48:flat?.44:family==='pike'?.24:family==='salmon'?.34:elongated?.13:.37;
 if(goby||apron){
  plate('fish-dorsal-front',[new Vector3(-.48,height*.7,0),new Vector3(-.36,.32,0),new Vector3(-.15,.30,0),new Vector3(-.08,height*.8,0)]);
  plate('fish-dorsal-rear',[new Vector3(.01,height*.9,0),new Vector3(.15,.27,0),new Vector3(.48,.21,0),new Vector3(.61,height*.25,0)]);
  if(id==='gobie')plate('fish-dorsal-spot',[new Vector3(-.22,.23,-.001),new Vector3(-.16,.27,-.001),new Vector3(-.11,.23,-.001),new Vector3(-.16,.19,-.001)],eye);
 }else if(lamprey){
  plate('fish-dorsal-front',[new Vector3(.04,height*.8,0),new Vector3(.26,.13,0),new Vector3(.42,height*.7,0)]);
  plate('fish-dorsal-rear',[new Vector3(.47,height*.6,0),new Vector3(.69,.16,0),new Vector3(bodyEnd,0,0)]);
 }else plate('fish-dorsal',[new Vector3(sturgeon?.35:elongated?-.2:-.35,height*.7,0),new Vector3(sturgeon?.50:family==='pike'?.45:-.06,sturgeon?.25:dorsal,0),new Vector3(sturgeon?.66:.45,height*.25,0)]);
 if(family==='salmon'||family==='catfish')plate('fish-adipose',[new Vector3(.44,.08,0),new Vector3(.57,.17,0),new Vector3(.64,.07,0)]);
 plate('fish-anal',[new Vector3(.2,-height*.5,0),new Vector3(.45,-height*1.5,0),new Vector3(.58,-height*.3,0)]);
 for(const side of [-1,1]){
  plate('fish-pectoral',[new Vector3(-.44,0,side*width),new Vector3(-.12,-height*.6,side*(family==='goby'?.43:.27)),new Vector3(-.14,.01,side*width)]);
  const e=MeshBuilder.CreateSphere('fish-eye',{diameter:elongated?.027:.052,segments:6},scene);e.position.set(head+(sturgeon?.38:.22),height*.24,side*width*.77);e.material=eye;parts.push(e);
  if(family==='catfish'||sturgeon||family==='loach'||id==='barbeau')for(let n=0;n<(family==='loach'?3:family==='catfish'||sturgeon?2:1);n++){const b=MeshBuilder.CreateTube('fish-barbel',{path:[new Vector3(head+.18,-height*.2,side*width*.45),new Vector3(head+.29,-height*(sturgeon?1.1:.65),side*(sturgeon?.06+n*.025:family==='loach'?.06+n*.015:.22+n*.1)),new Vector3(head+.4,-height*(sturgeon?1.2:.5),side*(sturgeon?.08+n*.025:family==='loach'?.09+n*.025:.28+n*.12))],radius:family==='loach'?.004:.008,tessellation:4},scene);b.material=fin;parts.push(b);}
 }
 if(sturgeon)for(const row of [-1,0,1])for(let i=0;i<9;i++){const scute=MeshBuilder.CreateCylinder('fish-scute',{diameter:.036,height:.032,tessellation:4},scene),bulge=Math.sin((i+1)/10*Math.PI);scute.position.set(-.55+i*.13,row===0?.13*bulge:.015,row*.078*bulge);if(row)scute.rotation.x=Math.PI/2;scute.material=fin;parts.push(scute);}
 if(id==='gobie'){const pelvic=MeshBuilder.CreateCylinder('fish-pelvic-disc',{diameter:.19,height:.012,tessellation:10},scene);pelvic.position.set(-.32,-height*.9,0);pelvic.material=fin;parts.push(pelvic);}
 if(id.includes('lamproie')){const mouth=MeshBuilder.CreateCylinder('fish-suction-mouth',{diameter:.12,height:.018,tessellation:10},scene);mouth.rotation.z=Math.PI/2;mouth.position.x=head;mouth.material=eye;parts.push(mouth);}
 // Baking brings all fins, eyes and barbels into the same longitudinal coordinates for BodyWave.
 for(const p of parts){p.bakeCurrentTransformIntoVertices();p.removeVerticesData(VertexBuffer.UVKind);p.removeVerticesData(VertexBuffer.UV2Kind);if(!p.getVerticesData(VertexBuffer.ColorKind)){const c=(p.material as StandardMaterial).diffuseColor??Color3.White(),array=[];for(let i=0;i<p.getTotalVertices();i++)array.push(c.r,c.g,c.b,1);p.setVerticesData(VertexBuffer.ColorKind,array);p.material=skin;}}
 const merged=Mesh.MergeMeshes(parts,true,true)??body;merged.material=skin;
 for(const m of materials.filter(m=>m!==skin))m.dispose();
 const container=new AssetContainer(scene);container.meshes.push(merged);container.materials.push(skin);container.populateRootNodes();container.removeAllFromScene();
 merged.metadata={identity:id,representation:'procedural-provisional',triangles:merged.getTotalIndices()/3};
 return container;
}
export async function loadFish(scene:Scene,id:SpeciesId,look?:FishLook){
 const species=speciesById(id);if(!species)throw Error('Identité inconnue');
 const container=species.model&&!look?.appearanceId?await LoadAssetContainerAsync(`/models/${species.model}.glb`,scene):proceduralFish(scene,id,look);
 applyAppearance(container,look);return container;
}
