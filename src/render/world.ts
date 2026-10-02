import { component,floatLoad } from '../game/rig';
import { POSTS, postById, worldPoint, type PostId } from '../game/posts';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Effect } from '@babylonjs/core/Materials/effect';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import type { FishingGame } from '../game/fishing';
import type { CastAim } from '../game/casting';
import type {AssetContainer} from '@babylonjs/core/assetContainer';
import {loadFish} from './fish-model';
import {BodyWave} from './swim';

export class LakeWorld {
  readonly engine: Engine;
  readonly scene: Scene;
  readonly camera: FreeCamera;
  private fishingRoot!:TransformNode;
  private activePost:PostId='jetty';
  private boat!:Mesh;private landingNet!:Mesh;private landingMat!:Mesh;
  private landingRoot?:TransformNode;private landedContainer?:AssetContainer;private landingWave?:BodyWave;private actorId='';private actorRequest=0;private actorTime=0;
  private branchFlies:Mesh[]=[];
  private branchLines:ReturnType<typeof MeshBuilder.CreateLines>[]=[];
  private clonkPulse=0;
  private npc!:TransformNode;
  private precisionCircle!:Mesh;
  private bobber: TransformNode;
  private line: ReturnType<typeof MeshBuilder.CreateLines>;
  private rings: Mesh[] = [];
  private water: ShaderMaterial;
  private time = 0;
  private castPoint = new Vector3(0, 0, 7);
  private reeds: TransformNode[] = [];
  private resize = () => this.engine.resize();
  private seed = 127;
  private terrain: { x:number; z:number; y:number; rx:number; ry:number; rz:number }[] = [];
  private rod!: Mesh;
  private grip!: Mesh;
  private wasCasting = false;
  private impactAge = 9;
  private groundbaitPulse=0;
  private impactPoint = new Vector3();
  private sun!: DirectionalLight;
  private shadow?: ShadowGenerator;
  private splash: Mesh[] = [];
  private castOrigin = new Vector3();
  private thickLine!: Mesh;
  private aimRing!: Mesh;
  private lure!: Mesh;
  private trajectory!: ReturnType<typeof MeshBuilder.CreateLines>;
  private rodPath = Array.from({ length: 9 }, (_, i) => new Vector3(1.4, 0.8 + i * 0.16, -5.7 + i * 0.56));
  private random() { this.seed = (1664525 * this.seed + 1013904223) >>> 0; return this.seed / 4294967296; }

  rodTipOnScreen() {
    const width = this.engine.getRenderWidth(), height = this.engine.getRenderHeight();
    const point = Vector3.Project(Vector3.TransformCoordinates(this.rodPath[8],this.fishingRoot.getWorldMatrix()), Matrix.Identity(), this.scene.getTransformMatrix(), this.camera.viewport.toGlobal(width, height));
    return { x: point.x / width, y: point.y / height };
  }

  constructor(canvas: HTMLCanvasElement, quality: 'eco' | 'high') {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false, powerPreference: 'low-power' });
    this.scene = new Scene(this.engine);
    this.scene.clearColor = Color4.FromHexString('#bacad0ff');
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = Color3.FromHexString('#b7c4c2');
    this.scene.fogDensity = 0.0075;
    this.camera = new FreeCamera('lake-camera', new Vector3(0, 4.2, -8.5), this.scene);
    this.camera.setTarget(new Vector3(0, 0.1, 5.5));
    this.camera.fov = 0.88;
    this.camera.minZ = 0.1;
    const ambient = new HemisphericLight('sky-light', new Vector3(-0.2, 1, -0.2), this.scene);
    ambient.intensity = 0.76;
    ambient.diffuse = Color3.FromHexString('#e3ebed');
    ambient.groundColor = Color3.FromHexString('#454c3c');
    const sun = this.sun = new DirectionalLight('morning-light', new Vector3(.65, -.8, -.4), this.scene);
    sun.diffuse = Color3.FromHexString('#fff2d9'); sun.intensity = 0.82;
    this.sky();
    this.landscape();
    this.water = this.createWater();
    this.dock();
    this.batchScenery();
    this.rod = MeshBuilder.CreateTube('moving-rod', { path: this.rodPath, radius: 0.025, tessellation: 6, updatable: true }, this.scene);
    const carbon=this.material('#313c3e'); carbon.specularColor=Color3.FromHexString('#586467');carbon.specularPower=32;this.rod.material=carbon;
    this.thickLine = MeshBuilder.CreateTube('visible-line', { path: Array.from({ length: 9 }, (_, i) => new Vector3(1, 2, i)), radius: 0.012, tessellation: 4, updatable: true }, this.scene);
    const lineMat = this.material('#fff2bf'); lineMat.disableLighting = true; lineMat.emissiveColor = Color3.FromHexString('#fff2bf'); this.thickLine.material = lineMat;
    this.aimRing = MeshBuilder.CreateTorus('cast-target', { diameter: 0.8, thickness: 0.035, tessellation: 32 }, this.scene);
    this.aimRing.material = this.material('#4cc6c2'); this.aimRing.setEnabled(false);
    this.lure = MeshBuilder.CreateSphere('surface-lure', { diameter: 0.13, segments: 8 }, this.scene); this.lure.scaling.set(0.45, 0.4, 1.4); this.lure.material = this.material('#d8c476'); this.lure.setEnabled(false);
    this.trajectory = MeshBuilder.CreateLines('trajectory', { points: Array.from({ length: 17 }, () => Vector3.Zero()), updatable: true }, this.scene);
    this.trajectory.color = Color3.FromHexString('#68d9d4'); this.trajectory.setEnabled(false);
    this.bobber = new TransformNode('float', this.scene);
    const cork = MeshBuilder.CreateSphere('float-red', { diameter: 0.15, segments: 10 }, this.scene);
    cork.scaling.y = 1.65; cork.material = this.material('#dd704a'); cork.parent = this.bobber; cork.position.y = 0.075;
    const tip = MeshBuilder.CreateCylinder('float-tip', { diameter: 0.025, height: 0.20, tessellation: 6 }, this.scene);
    tip.position.y = 0.27; tip.parent = this.bobber; tip.material = this.material('#f8e9c6');
    for (let i = 0; i < 3; i++) {
      const ring = MeshBuilder.CreateTorus('ripple', { diameter: 0.5, thickness: 0.009, tessellation: 36 }, this.scene);
      const mat = this.material('#d2dac0'); mat.alpha = 0.3; mat.disableLighting = true;
      ring.material = mat; this.rings.push(ring);
    }
    const splashMat = this.material('#c2ddd3'); splashMat.alpha=.45; splashMat.disableLighting=true;
    for(let i=0;i<4;i++){const drop=MeshBuilder.CreateSphere('arrival-drop',{diameter:.055,segments:4},this.scene);drop.material=splashMat;drop.setEnabled(false);this.splash.push(drop);}
    this.line = MeshBuilder.CreateLines('fishing-line', { points: [new Vector3(1.3, 1.8, -2.3), new Vector3(0, 0.3, 7)], updatable: true }, this.scene);
    this.line.color = Color3.FromHexString('#d2c6a4'); this.line.alpha = 0.55;
    this.fishingRoot=new TransformNode('post-fishing-root',this.scene);
    this.boat=MeshBuilder.CreateBox('procedural-boat',{width:2.4,depth:3.3,height:.45},this.scene);this.boat.material=this.material('#435b5d');this.boat.position.set(0,.1,-3.2);this.boat.parent=this.fishingRoot;this.boat.setEnabled(false);
    this.landingNet=MeshBuilder.CreateTorus('landing-net',{diameter:1.1,thickness:.025,tessellation:16},this.scene);this.landingNet.parent=this.fishingRoot;this.landingNet.material=this.material('#4cc6c2');this.landingNet.position.set(.6,.08,.7);this.landingNet.setEnabled(false);
    this.landingMat=MeshBuilder.CreateBox('landing-mat',{width:1.4,depth:.8,height:.05},this.scene);this.landingMat.parent=this.fishingRoot;this.landingMat.material=this.material('#394845');this.landingMat.position.set(-.6,.05,-.5);this.landingMat.setEnabled(false);
    // Recycled procedural silhouette only during reception. The species GLB remains
    // lazy-loaded in the photo sheet; this marker does not create a second specimen.
    for(let n=0;n<3;n++){const fly=MeshBuilder.CreateSphere('gambe-fly-'+n,{diameter:.07,segments:4},this.scene);fly.material=this.material('#caa37a');fly.parent=this.fishingRoot;fly.setEnabled(false);this.branchFlies.push(fly);const branch=MeshBuilder.CreateLines('gambe-branch-'+n,{points:[Vector3.Zero(),new Vector3(.3,0,0)],updatable:true},this.scene);branch.parent=this.fishingRoot;branch.color=Color3.FromHexString('#ebddb3');branch.setEnabled(false);this.branchLines.push(branch);}
    for(const mesh of [this.rod,this.grip,this.bobber,this.line,this.thickLine,this.aimRing,this.trajectory,this.lure,...this.rings,...this.splash])mesh.parent=this.fishingRoot;
    this.precisionCircle=MeshBuilder.CreateTorus('precision-placement',{diameter:2.4,thickness:.014,tessellation:32},this.scene);this.precisionCircle.position.set(0,.05,3.2);this.precisionCircle.material=this.material('#4cc6c2');
    this.npc=new TransformNode('fisher-at-reeds',this.scene);this.npc.position.set(-11,.25,7);
    const body=MeshBuilder.CreateCylinder('fisher-coat',{diameter:.45,height:.8,tessellation:8},this.scene);body.position.y=.6;body.material=this.material('#415255');body.parent=this.npc;
    const head=MeshBuilder.CreateSphere('fisher-head',{diameter:.32,segments:8},this.scene);head.position.y=1.2;head.material=this.material('#bca68a');head.parent=this.npc;
    const hat=MeshBuilder.CreateCylinder('fisher-hat',{diameter:.55,height:.1,tessellation:10},this.scene);hat.position.y=1.37;hat.material=this.material('#5f6c48');hat.parent=this.npc;
    const seat=MeshBuilder.CreateCylinder('fisher-stone',{diameter:1.6,height:.65,tessellation:8},this.scene);seat.position.set(-11,-.07,7);seat.material=this.material('#85877d');
    // Les mêmes contraintes ont un repère de végétation visible ; un seul maillage partagé.
    const herb=this.material('#596247');
    const obstacleReeds:Mesh[]=[];
    for(const post of POSTS.filter(p=>p.implemented))for(const o of post.obstacles){const at=worldPoint(post.id,o);for(let i=0;i<4;i++){const reed=MeshBuilder.CreateCylinder('post-obstacle-reed',{diameter:.045,height:.75+i*.12,tessellation:4},this.scene);reed.position.set(at.x+Math.cos(i*1.6)*o.radius*.6,.4,at.z+Math.sin(i*1.6)*o.radius*.6);reed.material=herb;obstacleReeds.push(reed);}}
    const mergedObstacles=Mesh.MergeMeshes(obstacleReeds,true,true);mergedObstacles?.freezeWorldMatrix();
    this.setQuality(quality);
    window.addEventListener('resize', this.resize);
  }

  private material(hex: string): StandardMaterial {
    const mat = new StandardMaterial('mat-' + hex, this.scene);
    mat.diffuseColor = Color3.FromHexString(hex); mat.specularColor = Color3.Black();
    return mat;
  }
  private ellipsoid(name: string, at: Vector3, scale: Vector3, mat: StandardMaterial, segments = 8) {
    const mesh = MeshBuilder.CreateSphere(name, { diameter: 2, segments }, this.scene);
    mesh.position = at; mesh.scaling = scale; mesh.material = mat;
    return mesh;
  }
  private sky() {
    Effect.ShadersStore.lakeSkyVertexShader = `precision highp float; attribute vec3 position; uniform mat4 worldViewProjection; varying float height; void main(){ height=position.y; gl_Position=worldViewProjection*vec4(position,1.0); }`;
    Effect.ShadersStore.lakeSkyFragmentShader = `precision highp float; varying float height; void main(){ float h=clamp(height/100.,0.,1.); vec3 col=mix(vec3(.79,.84,.83),vec3(.45,.63,.73),pow(h,.45)); gl_FragColor=vec4(col,1.); }`;
    const mat = new ShaderMaterial('sky-gradient', this.scene, { vertex: 'lakeSky', fragment: 'lakeSky' }, { attributes: ['position'], uniforms: ['worldViewProjection'] });
    mat.backFaceCulling = false; mat.disableDepthWrite = true;
    const sky = MeshBuilder.CreateSphere('sky-dome', { diameter: 240, segments: 12 }, this.scene);
    sky.material = mat; sky.isPickable = false;
    const sunMat = this.material('#f3e9cd'); sunMat.disableLighting = true; sunMat.emissiveColor = Color3.FromHexString('#f3e9cd');
    this.ellipsoid('sun', new Vector3(-27, 28, 90), new Vector3(2.3, 2.3, 1), sunMat, 16);
  }
  private bankHeight(x:number,z:number) {
    return Math.max(0, ...this.terrain.map(t => {
      const q=1-((x-t.x)/t.rx)**2-((z-t.z)/t.rz)**2;
      return q>0 ? t.y+t.ry*Math.sqrt(q) : 0;
    }));
  }
  private ground(name:string,at:Vector3,scale:Vector3,mat:StandardMaterial) {
    this.terrain.push({x:at.x,z:at.z,y:at.y,rx:scale.x,ry:scale.y,rz:scale.z});
    this.ellipsoid(name,at,scale,mat,12);
  }
  private landscape() {
    const bank = this.material('#596247'), edge = this.material('#938872');
    // Grain partagé, calculé une seule fois ; aucun bruit CPU par frame.
    const soil = new DynamicTexture('local-soil',{width:256,height:256},this.scene,false);
    const ctx=soil.getContext() as CanvasRenderingContext2D;ctx.fillStyle='#b3b09e';ctx.fillRect(0,0,256,256);
    for(let i=0;i<1800;i++){ctx.fillStyle=i%3?'#53584118':'#eee5c41a';ctx.fillRect(this.random()*256,this.random()*256,1+this.random()*3,1+this.random()*2);}soil.update();
    bank.diffuseTexture=soil;edge.diffuseTexture=soil;
    const trunk = this.material('#625344');
    const greens = ['#334a3a', '#465b3b', '#6a7650', '#5f6c48'].map(c => this.material(c));
    for (let layer = 0; layer < 3; layer++) {
      const hillMat = this.material(['#708579', '#94a79e', '#b4c3bd'][layer]);
      for (let i = 0; i < 5; i++) this.ellipsoid('distant-hill', new Vector3((i - 2) * 27, -2, 60 + layer * 17), new Vector3(24, 5 + this.random() * 7, 17), hillMat, 10);
    }
    this.ground('far-bank', new Vector3(0,-1.3,35), new Vector3(60,2.2,11),bank);
    for(let i=0;i<5;i++)this.ground('bank-inlet',new Vector3((i-2)*19,-.75,31+(i%2)*2),new Vector3(14,1.4,7),i%2?bank:edge);
    for (const side of [-1, 1]) {
      for(let i=0;i<4;i++) {
        const radius=9+this.random()*2, x=side*(13+radius+this.random()*2),z=-4+i*10;
        this.ground('shore-sand',new Vector3(x,-.45,z),new Vector3(radius+.5,.9,10),edge);
        this.ground('shore-grass',new Vector3(x+side*.6,-.35,z+1),new Vector3(radius,1.3,10),bank);
      }
    }
    this.ground('landing',new Vector3(0,-.7,-12),new Vector3(8,.95,5),edge);
    for (let i = 0; i < 48; i++) {
      const x = i < 30 ? (this.random() - 0.5) * 92 : (i % 2 ? -1 : 1) * (17 + this.random() * 8);
      const z = i < 30 ? 29 + this.random() * 8 : -2 + this.random() * 27;
      const h = 3 + this.random() * 4.5, base=this.bankHeight(x,z)-.08;
      const stem = MeshBuilder.CreateCylinder('tree-trunk', { height: h * 0.72, diameterBottom:.22+h*.025,diameterTop:.12, tessellation: 6 }, this.scene);
      stem.position.set(x, base+h*.36, z); stem.material = trunk;
      if (i % 3 === 0) {
        for (let j = 0; j < 3; j++) {
          const crown = MeshBuilder.CreateCylinder('pine-crown', { height: h * 0.55, diameterBottom: h * (0.48 - j * 0.08), diameterTop: 0, tessellation: 7 }, this.scene);
          crown.position.set(x, base+h * (0.44 + j * 0.18), z); crown.material = greens[i % 4];
        }
      } else {
        const crown = this.ellipsoid('leaf-crown', new Vector3(x, base+h*.77, z), new Vector3(h*.36,h*.23,h*.31), greens[i%4], 8);crown.rotation.y=this.random()*Math.PI;
        this.ellipsoid('leaf-crown',new Vector3(x-h*.2,base+h*.65,z+.3),new Vector3(h*.26,h*.21,h*.27),greens[(i+2)%4],8);
        this.ellipsoid('leaf-crown',new Vector3(x+h*.18,base+h*.63,z-.2),new Vector3(h*.27,h*.22,h*.24),greens[(i+1)%4],8);
      }
    }
    const grassMat = this.material('#63704b');
    for (let i = 0; i < 30; i++) { const side=i%2?-1:1,x=side*(14+this.random()*6),z=this.random()*24,h=.3+this.random()*.4;const tuft=MeshBuilder.CreateCylinder('shore-tuft',{height:h,diameterBottom:.22,diameterTop:0,tessellation:5},this.scene);tuft.position.set(x,this.bankHeight(x,z)+h*.45,z);tuft.rotation.z=(this.random()-.5)*.3;tuft.material=grassMat; }
    const stalk = this.material('#7b8154'), head = this.material('#574737');
    for (let i = 0; i < 48; i++) {
      const side = i % 2 ? -1 : 1;
      const root = new TransformNode('reed-root', this.scene);
      const cluster=Math.floor(i/12);
      root.position.set(side*(8.2+cluster*.55+(this.random()-.5)*1.8),-.12,-1+cluster*2.5+(this.random()-.5)*1.7);
      root.rotation.y=this.random()*Math.PI*2;
      const height = .8 + this.random() * 1.2;
      const stem = MeshBuilder.CreateCylinder('reed', { diameter: 0.022, height, tessellation: 4 }, this.scene);
      stem.position.y = height / 2; stem.material = stalk; stem.parent = root;
      const cattail = MeshBuilder.CreateCylinder('cattail', { diameter: 0.075, height: 0.27, tessellation: 6 }, this.scene);
      cattail.position.y = height - 0.13; cattail.parent = root; cattail.material = head;
      const leaf=MeshBuilder.CreatePlane('reed-leaf',{width:.05,height:height*.65,sideOrientation:Mesh.DOUBLESIDE},this.scene);leaf.position.set(.08,height*.5,0);leaf.rotation.z=-.22;leaf.material=stalk;leaf.parent=root;
      if (i < 4) this.reeds.push(root);
      else { for(const mesh of [stem,cattail,leaf])mesh.setParent(null);root.dispose(); }
    }
    const lilyMat = this.material('#64754c');
    for (let i = 0; i < 22; i++) {
      const pad = MeshBuilder.CreateCylinder('lily-pad', { diameter: 0.35 + this.random() * 0.4, height: 0.014, tessellation: 10 }, this.scene);
      const cluster=i%3;pad.position.set(-4.7+cluster*.8+(this.random()-.5)*1.4,.045,4+cluster*2.9+(this.random()-.5)*2);pad.scaling.z=.8+this.random()*.2;pad.rotation.y=this.random()*Math.PI;pad.material=lilyMat;
    }
    const rock=this.material('#85877d');rock.diffuseTexture=soil;rock.specularColor=Color3.FromHexString('#161c1d');rock.specularPower=12;
    for(let i=0;i<12;i++){const x=(i%2?-1:1)*(13.5+this.random()*2),z=this.random()*22,h=.3+this.random()*.35;const stone=this.ellipsoid('rock',new Vector3(x,this.bankHeight(x,z)+h*.45,z),new Vector3(.35+this.random()*.45,h,.5+this.random()*.5),rock,5);stone.rotation.y=this.random()*Math.PI;}
  }
  private createWater() {
    Effect.ShadersStore.lakeWaterVertexShader = `precision highp float; attribute vec3 position; uniform mat4 worldViewProjection; uniform mat4 world; uniform float time; varying vec3 wp; void main(){vec3 p=position; p.y+=sin(p.x*1.5+time*.6)*.018+cos(p.z*2.-time*.75)*.014; wp=(world*vec4(p,1.)).xyz; gl_Position=worldViewProjection*vec4(p,1.);}`;
    Effect.ShadersStore.lakeWaterFragmentShader = `precision highp float; varying vec3 wp; uniform float time; uniform vec3 eye; uniform float detail;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 p=wp.xz;float n=noise(p*.26+vec2(time*.018,-time*.012));
float a=dot(p,vec2(.7,1.1))+time*.32+n*2.,b=dot(p,vec2(-2.1,1.4))-time*.47;
float w=sin(a)*.6+sin(b)*.22;vec3 view=normalize(eye-wp);float f=1.-max(0.,view.y);float fres=f*f*f;
float depth=smoothstep(3.,23.,p.y),shore=smoothstep(8.,15.,abs(p.x));
vec3 col=mix(vec3(.17,.25,.20),vec3(.085,.19,.20),depth);col=mix(col,vec3(.28,.32,.22),shore*.38);
vec3 reflection=mix(vec3(.40,.49,.44),vec3(.62,.70,.72),n*.7);col=mix(col,reflection,fres*.63);
col+=vec3(.024,.032,.025)*w+vec3(.018,.024,.021)*(noise(p*2.4+vec2(time*.03,n))-.5);
if(detail>.5){vec3 normal=normalize(vec3(-cos(a)*.045+cos(b)*.018,1.,-cos(a)*.06-cos(b)*.012));float glint=pow(max(0.,dot(reflect(-normalize(vec3(-.65,.8,.4)),normal),view)),48.);col+=vec3(.75,.69,.51)*glint*.17;}
col=mix(col,col*vec3(.72,.79,.72),smoothstep(23.,34.,p.y)*(1.-n)*.45);gl_FragColor=vec4(col,1.);}`;
    const mat = new ShaderMaterial('lake-water', this.scene, { vertex: 'lakeWater', fragment: 'lakeWater' }, { attributes: ['position'], uniforms: ['worldViewProjection', 'world', 'time', 'eye','detail'] });
    const water = MeshBuilder.CreateGround('water', { width: 140, height: 140, subdivisions: 32 }, this.scene);
    water.position.z = 20; water.material = mat; water.isPickable = false;
    return mat;
  }
  private batchScenery() {
    const groups = new Map<StandardMaterial, Mesh[]>();
    for (const mesh of [...this.scene.meshes]) {
      if (mesh instanceof Mesh && !mesh.parent && mesh.material instanceof StandardMaterial) {
        const list = groups.get(mesh.material) ?? [];
        list.push(mesh); groups.set(mesh.material, list);
      }
    }
    for (const [material, meshes] of groups) {
      if (meshes.length > 1) {
        const merged = Mesh.MergeMeshes(meshes, true, true);
        if (merged) { merged.name = 'scenery-' + material.name; merged.isPickable = false; merged.freezeWorldMatrix(); }
      }
    }
  }
  private dock() {
    const grain = new DynamicTexture('local-timber', {width:512,height:128}, this.scene, false);
    const ctx=grain.getContext() as CanvasRenderingContext2D;ctx.fillStyle='#b2a891';ctx.fillRect(0,0,512,128);
    for(let i=0;i<140;i++){ctx.strokeStyle=i%3?'#5d564222':'#e9e2d422';ctx.lineWidth=.4+this.random()*.6;ctx.beginPath();const y=this.random()*128;ctx.moveTo(0,y);ctx.bezierCurveTo(170,y+this.random()*3,340,y-this.random()*3,512,y);ctx.stroke();}
    for(let i=0;i<3;i++){ctx.strokeStyle='#625c452a';ctx.beginPath();ctx.ellipse(this.random()*512,this.random()*128,16,2,0,0,Math.PI*2);ctx.stroke();}grain.update();
    const woods = ['#b8b2a5','#ada79a','#c0b7a4'].map(c=>{const mat=this.material(c);mat.diffuseTexture=grain;mat.specularColor=Color3.FromHexString('#0c0e0d');mat.specularPower=8;return mat;});
    for (let i = 0; i < 16; i++) {
      const board = MeshBuilder.CreateBox('dock-plank', { width: 3.5, height: 0.16, depth: 0.39 }, this.scene);
      board.position.set(0, 0.30, -8 + i * 0.43); board.material = woods[i % 3];
    }
    for (const x of [-1.65, 1.65]) for (const z of [-5.8, -1.6]) {
      const post = MeshBuilder.CreateCylinder('dock-post', { diameter: 0.20, height: 1.5, tessellation: 8 }, this.scene);
      post.position.set(x, 0.25, z); post.material = woods[2];
    }
    this.grip = MeshBuilder.CreateTube('cork-grip', { path: [new Vector3(1.4, 0.8, -5.7), new Vector3(1.415, 1.0, -5.1)], radius: 0.06, tessellation: 8, updatable: true }, this.scene);
    this.grip.material = this.material('#c2a46d');
  }
  setQuality(quality: 'eco' | 'high') {
    this.water.setFloat('detail',quality==='high'?1:0);
    this.shadow?.dispose(); this.shadow=undefined;
    if(quality==='high'){this.shadow=new ShadowGenerator(512,this.sun);this.shadow.usePercentageCloserFiltering=true;this.shadow.filteringQuality=ShadowGenerator.QUALITY_LOW;this.shadow.setDarkness(.3);for(const mesh of this.scene.meshes){if(['#334a3a','#465b3b','#6a7650','#5f6c48','#625344'].some(c=>mesh.name.includes(c)))this.shadow.addShadowCaster(mesh);if(mesh.name.includes('#596247')||mesh.name.includes('#938872'))mesh.receiveShadows=true;}const map=this.shadow.getShadowMap();if(map)map.refreshRate=0;}
    const dpr = Math.min(window.devicePixelRatio || 1, quality === 'eco' ? 1 : 1.5);
    const canvas = this.engine.getRenderingCanvas()!;
    // Budget éco ajusté après mesures locales ; le DOM garde sa résolution native.
    this.engine.setHardwareScalingLevel(Math.max(1 / dpr, quality === 'eco' ? canvas.clientWidth / 1024 : 0));
  }
  aim(aim?: CastAim) {
    this.aimRing.setEnabled(!!aim); this.trajectory.setEnabled(!!aim);
    if (!aim) return;
    this.aimRing.position.set(aim.point.x, 0.07, aim.point.z);
    (this.aimRing.material as StandardMaterial).diffuseColor = Color3.FromHexString(aim.valid ? '#4cc6c2' : '#e68181');
    const start = this.rodPath[8];
    MeshBuilder.CreateLines('trajectory', { points: Array.from({ length: 17 }, (_, i) => {
      const t = i / 16; return Vector3.Lerp(start, new Vector3(aim.point.x, 0.1, aim.point.z), t).add(new Vector3(0, Math.sin(t * Math.PI) * 2.3, 0));
    }), instance: this.trajectory }, this.scene);
  }
  update(dt: number, game: FishingGame) {
    if(game.post!==this.activePost)this.setPost(game.post);
    this.boat.setEnabled(game.post==='boat');
    if(game.post==='boat'){const p=postById(game.post),move=game.presentationState.boat;this.fishingRoot.position.set(p.origin.x+move.x,0,p.origin.z+1+move.z);const eye=worldPoint(game.post,{x:move.x,z:move.z-8.5}),look=worldPoint(game.post,{x:move.x,z:move.z+5.5});this.camera.position.set(eye.x,4.2,eye.z);this.camera.setTarget(new Vector3(look.x,.1,look.z));}
    this.landingNet.setEnabled(game.phase==='landing'&&game.fishLength>25);this.landingMat.setEnabled(game.phase==='landing'&&game.fishLength>65);
    if(game.fish&&['fighting','landing'].includes(game.phase)&&this.actorId!==game.specimenId){void this.prepareFishActor(game);}
    if(!['fighting','landing'].includes(game.phase)&&this.actorId)this.clearFishActor();
    this.landingRoot?.setEnabled(game.phase==='landing');
    if(game.phase==='landing'&&this.landingRoot){const size=Math.max(.1,Math.min(1.2,game.fishLength*.006));this.landingRoot.scaling.setAll(size);this.landingRoot.position.set(game.fishPosition.x,.18+Math.min(1,game.elapsed)*.1,game.fishPosition.z);this.landingRoot.rotation.y=Math.PI/2+game.direction;this.actorTime+=Math.min(dt,.05);this.landingWave?.update(this.actorTime,true,.14);this.landingNet.position.set(game.fishPosition.x,.06,game.fishPosition.z);}
    if(game.clonkPulse!==this.clonkPulse){this.clonkPulse=game.clonkPulse;this.impactAge=0;this.impactPoint.set(game.target.x,0,game.target.z);}
    this.branchFlies.forEach((fly,n)=>{const show=game.modern&&game.technique.id==='gambe'&&game.phase==='waiting'&&n<game.presentationState.branches.length;fly.setEnabled(show);this.branchLines[n].setEnabled(show);if(show){const y=-game.presentationState.branches[n];fly.position.set(game.fishPosition.x+.3,y,game.fishPosition.z);MeshBuilder.CreateLines('gambe-branch-'+n,{points:[new Vector3(game.fishPosition.x,y,game.fishPosition.z),fly.position],instance:this.branchLines[n]},this.scene);}});
    this.npc.setEnabled(!game.rights?.posts.includes('reed-bank'));
    this.precisionCircle.setEnabled(game.post==='jetty'&&game.method==='pole'&&['idle','casting','waiting'].includes(game.phase));
    this.time += dt;
    this.water.setFloat('time', this.time); this.water.setVector3('eye', this.camera.position);
    const targetX = game.target.x;
    const targetZ = game.target.z;
    this.castPoint.set(targetX, 0, targetZ);
    const show = ['casting', 'waiting', 'bite', 'fighting','landing'].includes(game.phase);
    this.bobber.setEnabled(show && (game.modern?!!game.config.components.float||!!game.config.components.indicator: ['pole','float'].includes(game.method))); this.line.setEnabled(false); this.thickLine.setEnabled(show);
    this.lure.setEnabled(show && (game.modern?!!game.config.components.lure||!!game.config.components.fly||game.technique.engine==='surface':game.method === 'lure') && !['fighting','landing'].includes(game.phase));
    const fighting = game.phase === 'fighting'||game.phase==='landing';
    if (game.phase === 'casting' && !this.wasCasting) this.castOrigin.copyFrom(this.rodPath[8]);
    if (this.wasCasting && game.phase === 'waiting') { this.impactAge = 0; this.impactPoint.set(targetX, 0, targetZ); }
    if (fighting && game.progress > .9 && Math.abs(game.fishVelocity) > .05 && this.impactAge > 1.3) { this.impactAge=0; this.impactPoint.set(game.fishPosition.x,0,game.fishPosition.z); }
    this.impactAge += dt;
    if(game.groundbaitPulse!==this.groundbaitPulse){this.groundbaitPulse=game.groundbaitPulse;this.impactAge=0;this.impactPoint.set(targetX,0,targetZ);}
    this.splash.forEach((drop,i)=>{const t=this.impactAge;drop.setEnabled(t<.65 && show);drop.position.set(this.impactPoint.x+Math.cos(i*1.57)*t*.4, .1+Math.sin(t/.65*Math.PI)*.25,this.impactPoint.z+Math.sin(i*1.57)*t*.4);});
    this.wasCasting = game.phase === 'casting';
    const cast = game.phase === 'casting' ? Math.min(1, game.elapsed / 1.1) : 1;
    const lift = game.phase === 'casting' ? game.rodLift * (1 - cast) + 0.5 * cast : game.rodLift;
    const bend = Math.min(1.1, game.tension);
    // L’amplitude visuelle suit le champ horizontal : la pointe reste visible en portrait.
    // Les règles gardent la même orientation et les mêmes forces sur tous les formats.
    const framing = Math.min(1, this.engine.getAspectRatio(this.camera));
    const base = new Vector3(1.4 * framing ** 1.5, 0.8, -5.7),sectionScale=game.modern&&game.technique.sections?Math.max(.4,game.rodSections/game.reach):1;
    this.rodPath = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      return base.add(new Vector3((game.rodYaw * 3 * framing ** 2 - 0.1 * framing) * t + (fighting ? game.direction * bend * t * t * 0.7 * framing : 0),
        (0.8 + lift * 2.3) * t - (fighting ? bend * t * t * 1.1 : game.phase === 'bite' ? (0.35 + Math.sin(this.time * 12) * 0.12) * t * t : 0), 4.5 * t*sectionScale));
    });
    MeshBuilder.CreateTube('moving-rod', { path: this.rodPath, instance: this.rod }, this.scene);
    MeshBuilder.CreateTube('cork-grip', { path: [this.rodPath[0], this.rodPath[1]], instance: this.grip }, this.scene);
    this.bobber.position.set(targetX * cast, 0.035 + Math.sin(this.time * 2) * 0.022, -1 + (targetZ + 1) * cast);
    if (game.phase === 'casting') this.bobber.position.copyFrom(Vector3.Lerp(this.castOrigin, new Vector3(targetX, 0.1, targetZ), cast).add(new Vector3(0, Math.sin(cast * Math.PI) * 2.3, 0)));
    if (game.method === 'lure' && ['waiting', 'bite'].includes(game.phase)) this.bobber.position.set(game.fishPosition.x, 0.04, game.fishPosition.z);
    if(game.modern&&['waiting','bite'].includes(game.phase)){this.bobber.position.set(game.fishPosition.x,game.config.components.float?.04:game.config.components.indicator?.25:-game.presentationDepth,game.fishPosition.z);if(game.technique.engine==='surface'||game.rig.recipe==='seche')this.bobber.position.y=.04;}
    if (!['pole','float'].includes(game.method) && ['waiting', 'bite'].includes(game.phase)) this.bobber.position.y = -game.presentationDepth;
    if(['pole','float'].includes(game.method) && ['waiting','bite'].includes(game.phase)) { const f=component(game.rig.components.float??'');this.bobber.position.y-=Math.max(0,floatLoad(game.rig)-(f?.capacity??2))*.2; }
    this.lure.position.copyFrom(this.bobber.position); this.lure.rotation.y = game.rodYaw+(game.modern?game.presentationState.terminalAngle:0);this.lure.rotation.z=game.modern&&['ned','neko','tokyo'].includes(game.rig.recipe??'')?-Math.PI/2:0;
    if (game.phase === 'bite') {
      this.bobber.position.y -= Math.abs(Math.sin(this.time * 12)) * 0.1;
      this.bobber.position.x += Math.sin(this.time * 4) * (game.pulling ? 0.28 : 0.05);
    }
    if (fighting) {
      this.bobber.position.set(game.fishPosition.x, game.progress > 0.90 ? 0.01 : game.fishPosition.y, game.fishPosition.z);
    }
    this.rings.forEach((ring, i) => {
      const impact = this.impactAge < 1.5;
      ring.setEnabled(show && (impact || game.method !== 'bottom' && game.phase !== 'casting' && (!fighting || game.progress > 0.9)));
      if (impact) ring.position.set(this.impactPoint.x, .047, this.impactPoint.z);
      const t = (this.time * (game.phase === 'bite' ? 1.8 : 0.5) + i / 3) % 1;
      if (!impact) ring.position.copyFrom(this.bobber.position); ring.position.y = 0.047;
      ring.scaling.setAll(0.25 + t * 2.5);
      (ring.material as StandardMaterial).alpha = (1 - t) * 0.3;
    });
    const end = this.bobber.position.add(new Vector3(0, 0.15, 0));
    const tip = this.rodPath[8];
    // Le segment immergé est occulté par l’eau ; le point d’entrée suit le poisson.
    const path = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8; const p = Vector3.Lerp(tip, end, t);
      p.y -= Math.sin(t * Math.PI) * (fighting ? Math.min(2, game.slack * 0.7 + Math.max(0, 1 - game.tension) * 0.2) : 0.15); return p;
    });
    MeshBuilder.CreateLines('fishing-line', { points: [tip, end], instance: this.line }, this.scene);
    MeshBuilder.CreateTube('visible-line', { path, instance: this.thickLine }, this.scene);
    this.reeds.forEach((reed, i) => { reed.rotation.z = Math.sin(this.time * 1.2 + i) * 0.035; });
  }
  private clearFishActor(){this.actorRequest++;this.actorId='';this.landingWave=undefined;this.landedContainer?.dispose();this.landedContainer=undefined;this.landingRoot?.dispose();this.landingRoot=undefined;}
  fishActorDiagnostics(){return {specimen:this.actorId,loaded:!!this.landingRoot,meshes:this.landedContainer?.meshes.filter(m=>m.getTotalVertices()>0).length??0,scale:this.landingRoot?.scaling.x,enabled:this.landingRoot?.isEnabled()??false};}
  private async prepareFishActor(game:FishingGame){
    this.clearFishActor();this.actorId=game.specimenId;const token=this.actorRequest,id=game.fish!.id;
    try{const container=await loadFish(this.scene,id,{...game.appearance,seed:game.specimenSeed});if(token!==this.actorRequest||this.scene.isDisposed){container.dispose();return;}this.landedContainer=container;container.addAllToScene();const root=this.landingRoot=new TransformNode('landing-'+game.specimenId,this.scene);root.parent=this.fishingRoot;for(const node of container.rootNodes)node.parent=root;root.setEnabled(false);this.landingWave=new BodyWave(container);this.actorTime=0;}catch{this.actorId=game.specimenId;}
  }
  dispose() { this.clearFishActor();window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); }
  setPost(id:PostId){const p=postById(id);this.activePost=id;this.fishingRoot.rotation.y=p.angle;this.fishingRoot.position.set(p.origin.x+Math.sin(p.angle),0,p.origin.z+Math.cos(p.angle));this.fishingRoot.computeWorldMatrix(true);const eye=worldPoint(id,{x:0,z:-8.5}),target=worldPoint(id,{x:0,z:5.5});this.camera.position.set(eye.x,4.2,eye.z);this.camera.setTarget(new Vector3(target.x,.1,target.z));this.wasCasting=false;this.impactAge=9;}
}
