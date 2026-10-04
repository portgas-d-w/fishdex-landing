// Viewer moteur isolé : mêmes lumières de matin et même conversion de matériaux que l’étang.
// /production_3d/environment/viewer/index.html?glb=/chemin/a.glb,/chemin/b.glb&spacing=4
import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {FreeCamera} from '@babylonjs/core/Cameras/freeCamera';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {CubeTexture} from '@babylonjs/core/Materials/Textures/cubeTexture';
import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import '@babylonjs/loaders/glTF';
import {adaptEnvironmentMaterials,environmentLoadOptions} from '../../../src/render/environment-materials';

const params=new URLSearchParams(location.search),urls=(params.get('glb')??'').split(',').filter(Boolean),spacing=Number(params.get('spacing')??4);
const canvas=document.getElementById('c') as HTMLCanvasElement,engine=new Engine(canvas,true,{preserveDrawingBuffer:true});
const scene=new Scene(engine);scene.clearColor=Color4.FromHexString('#bacad0ff');
const ambient=new HemisphericLight('sky-light',new Vector3(-.2,1,-.2),scene);ambient.intensity=.76;ambient.diffuse=Color3.FromHexString('#e3ebed');ambient.groundColor=Color3.FromHexString('#454c3c');
const sun=new DirectionalLight('morning-light',new Vector3(.65,-.8,-.4),scene);sun.diffuse=Color3.FromHexString('#fff2d9');sun.intensity=.82;
scene.environmentTexture=CubeTexture.CreateFromPrefilteredData('/map-assets/sky-day.env',scene);scene.environmentIntensity=.35;
const floor=MeshBuilder.CreateGround('viewer-floor',{width:40,height:40},scene);const fm=new StandardMaterial('floor',scene);fm.diffuseColor=Color3.FromHexString('#7d8270');fm.specularColor=Color3.Black();floor.material=fm;floor.position.y=-.002;
for(let i=-10;i<=10;i++){MeshBuilder.CreateLines('gx'+i,{points:[new Vector3(i,0,-10),new Vector3(i,0,10)]},scene).color=Color3.FromHexString('#5d6152');MeshBuilder.CreateLines('gz'+i,{points:[new Vector3(-10,0,i),new Vector3(10,0,i)]},scene).color=Color3.FromHexString('#5d6152');}
const axis=(name:string,to:Vector3,c:string)=>{const l=MeshBuilder.CreateLines(name,{points:[new Vector3(0,.01,0),to]},scene);l.color=Color3.FromHexString(c);};axis('axis-x',new Vector3(2,.01,0),'#e04040');axis('axis-y',new Vector3(0,2,0),'#40c040');axis('axis-z',new Vector3(0,.01,2),'#4060ff');
const camera=new FreeCamera('viewer-camera',new Vector3(0,2,-6),scene);camera.minZ=.05;camera.fov=.8;camera.attachControl(canvas,true);
const roots:TransformNode[]=[];const info:any[]=[];
function worldBounds(nodes:TransformNode){const ms=nodes.getChildMeshes().filter(m=>m.getTotalVertices()>0);let min=new Vector3(1e9,1e9,1e9),max=new Vector3(-1e9,-1e9,-1e9);for(const m of ms){m.computeWorldMatrix(true);const b=m.getBoundingInfo().boundingBox;min=Vector3.Minimize(min,b.minimumWorld);max=Vector3.Maximize(max,b.maximumWorld);}return{min,max};}
function frame(view:string){const all=roots.map(worldBounds);if(!all.length)return;const min=all.reduce((a,b)=>Vector3.Minimize(a,b.min),new Vector3(1e9,1e9,1e9)),max=all.reduce((a,b)=>Vector3.Maximize(a,b.max),new Vector3(-1e9,-1e9,-1e9));const c=min.add(max).scale(.5),r=Math.max(.6,max.subtract(min).length()*.62);const d:Record<string,Vector3>={game:new Vector3(0,.45,-1),side:new Vector3(1,.12,0),back:new Vector3(0,.3,1),top:new Vector3(0,1,-.001),persp:new Vector3(.75,.55,-1),low:new Vector3(.8,.08,-1)};const dir=(d[view]??d.persp).normalize();camera.position=c.add(dir.scale(r/Math.tan(camera.fov/2)));camera.setTarget(c);}
async function main(){
 let x=-(urls.length-1)*spacing/2;
 for(const url of urls){
  const t0=performance.now();const c=await LoadAssetContainerAsync(url,scene,environmentLoadOptions(url));const loadMs=performance.now()-t0;const converted=adaptEnvironmentMaterials(c,scene,params.get('family')??'',url);c.addAllToScene();
  const root=new TransformNode('viewer-'+url,scene);for(const n of c.rootNodes)n.parent=root;root.position.x=x;x+=spacing;roots.push(root);
  const meshes=root.getChildMeshes().filter(m=>m.getTotalVertices()>0);const b=worldBounds(root);
  info.push({url,loadMs:Math.round(loadMs),convertedMaterials:converted,meshes:meshes.map(m=>{const bb=m.getBoundingInfo().boundingBox;return{name:m.name,triangles:m.getTotalIndices()/3,material:m.material?.name,materialClass:m.material?.getClassName(),centerWorld:bb.centerWorld.asArray().map(v=>+v.toFixed(3)),hasNormalMap:!!(m.material as any)?.bumpTexture,vertexColors:m.isVerticesDataPresent('color')};}),triangles:meshes.reduce((n,m)=>n+m.getTotalIndices()/3,0),boundsMin:b.min.asArray().map(v=>+(v-(root.position.x&&0)).toFixed(3)),boundsMax:b.max.asArray().map(v=>+v.toFixed(3)),sizeXYZ:b.max.subtract(b.min).asArray().map(v=>+v.toFixed(3)),offsetX:root.position.x,textures:c.textures.map(t=>({name:t.name,...t.getSize()}))});
 }
 frame(params.get('view')??'persp');
 document.getElementById('info')!.textContent=info.map(i=>`${i.url.split('/').pop()} ${i.triangles} tri · ${i.sizeXYZ.join('×')} m`).join('\n');
 await scene.whenReadyAsync();(window as any).__viewer={ready:true,info,frame:(v:string)=>frame(v),scene};
}
engine.runRenderLoop(()=>scene.render());window.addEventListener('resize',()=>engine.resize());
main().catch(e=>{document.getElementById('info')!.textContent='ERREUR '+e;(window as any).__viewer={ready:true,error:String(e),info};});
