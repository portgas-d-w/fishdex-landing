import {PondScenery} from './pond-scenery';
import {PondWater,type WaterQuality} from './pond-water';
import {terminalPosition,type WaterType} from '../game/water-events';
import {localToPond,pondToLocal,pondGround,pondDepth,inPond,POND_MAP} from '../game/pond-map';
import { inspectPostTarget, postById, worldPoint, type PostId } from '../game/posts';
import {SceneInstrumentation} from '@babylonjs/core/Instrumentation/sceneInstrumentation';
import { POSTS } from '../game/posts';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
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
  private mapDebug?:TransformNode;private instrumentation?:SceneInstrumentation;
  private contextGround!:Mesh;private contextBanks:Mesh[]=[];
  private fishingRoot!:TransformNode;
  private activePost:PostId='jetty';
  private boat!:Mesh;private landingNet!:Mesh;private landingMat!:Mesh;
  private landingRoot?:TransformNode;private landedContainer?:AssetContainer;private landingWave?:BodyWave;private actorId='';private actorRequest=0;private actorTime=0;
  private releaseUntil=0;private lastRelease=0;private releasePoint={x:0,z:1};
  private branchFlies:Mesh[]=[];
  private branchLines:ReturnType<typeof MeshBuilder.CreateLines>[]=[];

  private parkedSections:Mesh[]=[];
  private elasticLine!:ReturnType<typeof MeshBuilder.CreateLines>;
  private netHandle!:ReturnType<typeof MeshBuilder.CreateLines>;
  private npc!:TransformNode;
  private precisionCircle!:Mesh;
  private bobber: TransformNode;
  private line: ReturnType<typeof MeshBuilder.CreateLines>;
  private rings: Mesh[] = [];
  private water: ShaderMaterial;
  readonly pondScenery:PondScenery;readonly pondWater:PondWater;
  private time = 0;

  private reeds: TransformNode[] = [];
  private resize = () => this.engine.resize();


  private rod!: Mesh;
  private grip!: Mesh;
  private wasCasting = false;



  private sun!: DirectionalLight;private ambient!:HemisphericLight;private ambience='morning';
  private shadow?: ShadowGenerator;
  private splash: Mesh[] = [];
  private castOrigin = new Vector3();
  private thickLine!: Mesh;
  private aimRing!: Mesh;
  private lure!: Mesh;
  private trajectory!: ReturnType<typeof MeshBuilder.CreateLines>;
  private rodPath = Array.from({ length: 9 }, (_, i) => new Vector3(1.4, 0.8 + i * 0.16, -5.7 + i * 0.56));


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
    const ambient = this.ambient = new HemisphericLight('sky-light', new Vector3(-0.2, 1, -0.2), this.scene);
    ambient.intensity = 0.76;
    ambient.diffuse = Color3.FromHexString('#e3ebed');
    ambient.groundColor = Color3.FromHexString('#454c3c');
    const sun = this.sun = new DirectionalLight('morning-light', new Vector3(.65, -.8, -.4), this.scene);
    sun.diffuse = Color3.FromHexString('#fff2d9'); sun.intensity = 0.82;
    this.sky();
    this.pondScenery=new PondScenery(this.scene);
    this.pondWater=new PondWater(this.scene,this.pondScenery.reflectors,this.pondScenery.placements);
    this.water=this.pondWater.material;
    this.contextGround=new Mesh('context-shared-floor',this.scene);this.contextGround.material=this.material('#6a7252');this.contextGround.setEnabled(false);for(const x of [-19,19]){const bank=MeshBuilder.CreateBox('context-bank',{width:4,height:2,depth:50},this.scene);bank.position.set(x,0,12);bank.material=this.material('#70785c');bank.setEnabled(false);this.contextBanks.push(bank);}
    this.dock();

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
    for(let n=0;n<6;n++){const part=MeshBuilder.CreateCylinder('parked-pole-'+n,{height:1.6,diameter:.035,tessellation:6},this.scene);part.material=carbon;part.parent=this.fishingRoot;part.position.set(-.65-n*.1,.12,-3.2);part.rotation.x=Math.PI/2;part.setEnabled(false);this.parkedSections.push(part);}
    this.elasticLine=MeshBuilder.CreateLines('pole-elastic',{points:[Vector3.Zero(),new Vector3(0,0,.1)],updatable:true},this.scene);this.elasticLine.parent=this.fishingRoot;this.elasticLine.color=Color3.FromHexString('#e6c48d');this.elasticLine.setEnabled(false);
    this.netHandle=MeshBuilder.CreateLines('landing-handle',{points:[Vector3.Zero(),new Vector3(0,0,.1)],updatable:true},this.scene);this.netHandle.parent=this.fishingRoot;this.netHandle.color=Color3.FromHexString('#afbfbe');this.netHandle.setEnabled(false);
    // Recycled procedural silhouette only during reception. The species GLB remains
    // lazy-loaded in the photo sheet; this marker does not create a second specimen.
    for(let n=0;n<3;n++){const fly=MeshBuilder.CreateSphere('gambe-fly-'+n,{diameter:.07,segments:4},this.scene);fly.material=this.material('#caa37a');fly.parent=this.fishingRoot;fly.setEnabled(false);this.branchFlies.push(fly);const branch=MeshBuilder.CreateLines('gambe-branch-'+n,{points:[Vector3.Zero(),new Vector3(.3,0,0)],updatable:true},this.scene);branch.parent=this.fishingRoot;branch.color=Color3.FromHexString('#ebddb3');branch.setEnabled(false);this.branchLines.push(branch);}
    for(const mesh of [this.rod,this.grip,this.bobber,this.line,this.thickLine,this.aimRing,this.trajectory,this.lure,...this.rings,...this.splash])mesh.parent=this.fishingRoot;
    this.precisionCircle=MeshBuilder.CreateTorus('precision-placement',{diameter:2.4,thickness:.014,tessellation:32},this.scene);const circleAt=worldPoint('jetty',{x:0,z:3.2});this.precisionCircle.position.set(circleAt.x,.05,circleAt.z);this.precisionCircle.material=this.material('#4cc6c2');
    this.npc=new TransformNode('fisher-at-reeds',this.scene);const npcAt=localToPond('reed-bank',{x:-3,z:-4.7});this.npc.position.set(npcAt.x,.25,npcAt.z);
    const body=MeshBuilder.CreateCylinder('fisher-coat',{diameter:.45,height:.8,tessellation:8},this.scene);body.position.y=.6;body.material=this.material('#415255');body.parent=this.npc;
    const head=MeshBuilder.CreateSphere('fisher-head',{diameter:.32,segments:8},this.scene);head.position.y=1.2;head.material=this.material('#bca68a');head.parent=this.npc;
    const hat=MeshBuilder.CreateCylinder('fisher-hat',{diameter:.55,height:.1,tessellation:10},this.scene);hat.position.y=1.37;hat.material=this.material('#5f6c48');hat.parent=this.npc;
    const seat=MeshBuilder.CreateCylinder('fisher-stone',{diameter:1.6,height:.65,tessellation:8},this.scene);seat.position.set(npcAt.x,-.07,npcAt.z);seat.material=this.material('#85877d');
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
    Effect.ShadersStore.lakeSkyFragmentShader = `precision highp float; varying float height;uniform vec3 tone; void main(){ float h=clamp(height/100.,0.,1.); vec3 col=mix(vec3(.79,.84,.83),vec3(.45,.63,.73),pow(h,.45)); gl_FragColor=vec4(col*tone,1.); }`;
    const mat = new ShaderMaterial('sky-gradient', this.scene, { vertex: 'lakeSky', fragment: 'lakeSky' }, { attributes: ['position'], uniforms: ['worldViewProjection','tone'] });
    mat.setColor3('tone',Color3.White());mat.backFaceCulling = false; mat.disableDepthWrite = true;
    const sky = MeshBuilder.CreateSphere('sky-dome', { diameter: 240, segments: 12 }, this.scene);
    sky.material = mat; sky.isPickable = false;
    const sunMat = this.material('#f3e9cd'); sunMat.disableLighting = true; sunMat.emissiveColor = Color3.FromHexString('#f3e9cd');
    this.ellipsoid('sun', new Vector3(-27, 28, 90), new Vector3(2.3, 2.3, 1), sunMat, 16);
  }
  private dock() {
    this.grip = MeshBuilder.CreateTube('cork-grip', { path: [new Vector3(1.4, 0.8, -5.7), new Vector3(1.415, 1.0, -5.1)], radius: 0.06, tessellation: 8, updatable: true }, this.scene);
    this.grip.material = this.material('#c2a46d');
  }
  setQuality(quality: 'eco' | 'high') {
    this.pondWater.setQuality(quality==='high'?'high':'low');
    this.shadow?.dispose(); this.shadow=undefined;
    if(quality==='high'){this.shadow=new ShadowGenerator(512,this.sun);this.shadow.usePercentageCloserFiltering=true;this.shadow.filteringQuality=ShadowGenerator.QUALITY_LOW;this.shadow.setDarkness(.3);for(const mesh of this.pondScenery.reflectors.slice(0,30)){if(['tree_','fallen_log','pier_'].some(c=>mesh.name.includes(c)))this.shadow.addShadowCaster(mesh);if(mesh.name==='pond-shared-terrain')mesh.receiveShadows=true;}const map=this.shadow.getShadowMap();if(map)map.refreshRate=0;}
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
    this.landingNet.setEnabled(game.phase==='landing');this.netHandle.setEnabled(game.phase==='landing');this.landingNet.scaling.setAll(game.fishLength>25?1.63:1.2);this.landingNet.position.set(game.netPosition.x,.03+game.netLift,game.netPosition.z);this.landingNet.rotation.y=game.netHeading;this.parkedSections.forEach((part,n)=>part.setEnabled(['fighting','landing'].includes(game.phase)&&n<game.detachedSections));if(game.phase==='landing')MeshBuilder.CreateLines('landing-handle',{points:[new Vector3(.7,.4,-.4),this.landingNet.position],instance:this.netHandle},this.scene);this.landingMat.setEnabled(game.phase==='landing'&&game.fishLength>65);
    if(game.fish&&['fighting','landing'].includes(game.phase)&&this.actorId!==game.specimenId){void this.prepareFishActor(game);}
    const released=game.waterEvents.events.find(e=>e.type==='fish_release'&&e.id>this.lastRelease);if(released){this.lastRelease=released.id;this.releasePoint=pondToLocal(game.post,released.position);this.releaseUntil=game.simulationTime+1.6;}
    const releasing=game.simulationTime<this.releaseUntil&&!['fighting','landing'].includes(game.phase);if(!['fighting','landing','caught'].includes(game.phase)&&!releasing&&this.actorId)this.clearFishActor();
    this.landingRoot?.setEnabled(game.phase==='landing'||releasing);if(releasing&&this.landingRoot){const t=1.6-(this.releaseUntil-game.simulationTime);this.landingRoot.position.set(this.releasePoint.x,-.12-t*.2,this.releasePoint.z+t*.7);this.landingWave?.update(this.actorTime+=dt,true,.25);}
    if(game.phase==='landing'&&this.landingRoot){const size=Math.max(.1,Math.min(1.2,game.fishLength*.006));this.landingRoot.scaling.setAll(size);this.landingRoot.position.set(game.fishPosition.x,game.fishPosition.y,game.fishPosition.z);this.landingRoot.rotation.y=Math.PI/2+game.direction;this.actorTime+=Math.min(dt,.05);this.landingWave?.update(this.actorTime,true,.14);}

    this.branchFlies.forEach((fly,n)=>{const show=game.modern&&game.technique.id==='gambe'&&game.phase==='waiting'&&n<game.presentationState.branches.length;fly.setEnabled(show);this.branchLines[n].setEnabled(show);if(show){const y=-game.presentationState.branches[n];fly.position.set(game.fishPosition.x+.3,y,game.fishPosition.z);MeshBuilder.CreateLines('gambe-branch-'+n,{points:[new Vector3(game.fishPosition.x,y,game.fishPosition.z),fly.position],instance:this.branchLines[n]},this.scene);}});
    this.npc.setEnabled(!postById(game.post).context&&!game.rights?.posts.includes('reed-bank'));
    this.precisionCircle.setEnabled(game.post==='jetty'&&game.method==='pole'&&['idle','casting','waiting'].includes(game.phase));
    this.time = game.simulationTime;
    this.pondScenery.updateWind(game.simulationTime,game.environment.wind,this.camera.position);
    this.pondWater.update(game.simulationTime,this.camera.position,game.waterEvents.events,game.environment.wind);
    this.water.setFloat('time', this.time); this.water.setVector3('eye', this.camera.position);
    const terminal=terminalPosition(game);


    const show = ['casting', 'waiting', 'bite', 'fighting','landing'].includes(game.phase);
    this.bobber.setEnabled(show && (game.modern?!!game.config.components.float||!!game.config.components.indicator: ['pole','float'].includes(game.method))); this.line.setEnabled(false); this.thickLine.setEnabled(show);
    this.lure.setEnabled(show && (game.modern?!!game.config.components.lure||!!game.config.components.fly||game.technique.engine==='surface':game.method === 'lure') && !['fighting','landing'].includes(game.phase));
    const fighting = game.phase === 'fighting'||game.phase==='landing';
    if (game.phase === 'casting' && !this.wasCasting) this.castOrigin.copyFrom(this.rodPath[8]);

    this.rings.forEach(r=>r.setEnabled(false));this.splash.forEach(r=>r.setEnabled(false));
    this.wasCasting = game.phase === 'casting';

    const bend = Math.min(1.1, game.tension);
    // L’amplitude visuelle suit le champ horizontal : la pointe reste visible en portrait.
    // Les règles gardent la même orientation et les mêmes forces sur tous les formats.
    const geometry=game.rodGeometry,base=new Vector3(geometry.base.x,geometry.base.y,geometry.base.z),tip3=new Vector3(geometry.tip.x,geometry.tip.y,geometry.tip.z);
    this.rodPath=Array.from({length:9},(_,i)=>{const f=i/8,p=Vector3.Lerp(base,tip3,f);p.y+=Math.sin(f*Math.PI)*Math.min(.35,bend*.25);return p;});
    MeshBuilder.CreateTube('moving-rod', { path: this.rodPath, instance: this.rod }, this.scene);
    MeshBuilder.CreateTube('cork-grip', { path: [this.rodPath[0], this.rodPath[1]], instance: this.grip }, this.scene);
    this.bobber.position.set(terminal.position.x,terminal.position.y,terminal.position.z);
    this.lure.position.copyFrom(this.bobber.position);this.lure.rotation.y=game.rodYaw+(game.modern?game.presentationState.terminalAngle:0);
    const tip=this.rodPath[8],fish=new Vector3(game.fishPosition.x,game.fishPosition.y,game.fishPosition.z);const entry=fighting?Vector3.Lerp(tip,fish,Math.max(0,Math.min(1,tip.y/Math.max(.001,tip.y-fish.y)))):this.bobber.position.add(new Vector3(0,.15,0));
    const end=entry;this.line.setEnabled(show&&!fighting);this.elasticLine.setEnabled(fighting&&!game.hasReel&&game.elasticExtension>.03);const elasticEnd=Vector3.Lerp(tip,fish,Math.min(.8,game.elasticExtension/Math.max(.1,Vector3.Distance(tip,fish))));if(fighting&&!game.hasReel)MeshBuilder.CreateLines('pole-elastic',{points:[tip,elasticEnd],instance:this.elasticLine},this.scene);
    this.bobber.setEnabled(show&&terminal.floating&&terminal.position.y>-.4);
    // Le segment immergé est occulté par l’eau ; le point d’entrée suit le poisson.
    const path = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8; const p = Vector3.Lerp(fighting&&!game.hasReel?elasticEnd:tip, end, t);
      p.y -= Math.sin(t * Math.PI) * (fighting ? Math.min(2,game.slack*.7) : 0.15); return p;
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
  dispose() { this.instrumentation?.dispose();this.clearFishActor();window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); }
  renderDiagnostics(){this.instrumentation??=new SceneInstrumentation(this.scene);this.instrumentation.captureFrameTime=true;return {fps:this.pondWater.diagnostics().renderedFPS,engineRafFPS:this.engine.getFps(),cpuFrameMs:this.instrumentation.frameTimeCounter.current,drawCalls:this.instrumentation.drawCallsCounter.current,width:this.engine.getRenderWidth(),height:this.engine.getRenderHeight(),totalMeshes:this.scene.meshes.length,activeMeshes:this.scene.getActiveMeshes().length,visibleTriangles:this.scene.getActiveMeshes().data.slice(0,this.scene.getActiveMeshes().length).reduce((n,m)=>n+m.getTotalIndices()/3,0),textures:this.scene.textures.map(t=>({name:t.name,...t.getSize()})),renderTargets:this.scene.customRenderTargets.length};}
  showMapDebug(enabled:boolean){if(!this.mapDebug){this.mapDebug=new TransformNode('map-inspection',this.scene);const add=(name:string,points:Vector3[],color:Color3)=>{const line=MeshBuilder.CreateLines(name,{points},this.scene);line.color=color;line.parent=this.mapDebug!;};add('shoreline',[...POND_MAP.contour,POND_MAP.contour[0]].map(p=>new Vector3(p.x,.07,p.z)),Color3.FromHexString('#e6c48d'));for(let z=-5;z<85;z+=8)for(let x=-60;x<64;x+=8)if(inPond({x,z})){const depth=pondDepth({x,z});add('depth-'+x+'-'+z,[new Vector3(x-.7,.075,z),new Vector3(x+.7,.075,z)],new Color3(.2,1-depth/9,.9));}for(const h of POND_MAP.habitats)add('habitat-'+h.id,Array.from({length:33},(_,i)=>new Vector3(h.center_xz_m[0]+Math.sin(i/32*Math.PI*2)*h.radius_m,.085,h.center_xz_m[1]+Math.cos(i/32*Math.PI*2)*h.radius_m)),Color3.FromHexString('#d8cf6b'));for(const p of POSTS){const sector=[{x:-p.sector,z:10},{x:0,z:-1},{x:p.sector,z:10}].map(v=>{const w=worldPoint(p.id,v);return new Vector3(w.x,.08,w.z);});add('sector-'+p.id,sector,Color3.FromHexString('#68d9d4'));for(const o of p.obstacles){const w=worldPoint(p.id,o);add('obstacle-'+p.id,Array.from({length:25},(_,i)=>new Vector3(w.x+Math.sin(i/24*Math.PI*2)*o.radius,.09,w.z+Math.cos(i/24*Math.PI*2)*o.radius)),Color3.FromHexString('#e68181'));}}}this.mapDebug.setEnabled(enabled);}
  setAmbience(preset:'morning'|'overcast'|'evening'){this.ambience=preset;this.pondScenery.setAmbience(preset);const cloud=preset==='overcast',late=preset==='evening';this.sun.intensity=cloud?.38:late?.6:.82;this.ambient.intensity=cloud?.8:late?.62:.76;this.sun.direction.set(late?.8:.65,late?-.3:-.8,late?.25:-.4);this.sun.diffuse=Color3.FromHexString(late?'#f4bd84':cloud?'#d5e0e1':'#fff2d9');this.scene.fogColor=Color3.FromHexString(late?'#b6ac98':cloud?'#aebebc':'#b7c4c2');(this.scene.getMaterialByName('sky-gradient') as ShaderMaterial).setColor3('tone',new Color3(late?1.06:cloud?.92:1,late?.86:1,late?.74:cloud?1.04:1));this.water.setColor3('sky',this.scene.fogColor);this.pondWater.refresh();this.shadow?.getShadowMap()?.resetRefreshCounter();}
  flushWater(game:FishingGame){this.pondWater.update(game.simulationTime,this.camera.position,game.waterEvents.events,game.environment.wind);}
  setWaterQuality(q:WaterQuality){this.pondWater.setQuality(q);}
  waterDiagnostics(){return {ambience:this.ambience,water:this.pondWater.diagnostics(),assets:this.pondScenery.diagnostics()};}
  waterDemo(type:WaterType,seed=127){const p=worldPoint(this.activePost,{x:0,z:3.2});this.pondWater.demo(type,new Vector3(p.x,0,p.z),seed);}
  setPost(id:PostId){const p=postById(id);this.pondWater.setContext(!!p.context,inspectPostTarget(id,{x:0,z:3.2}).depth);this.pondScenery.setEnabled(!p.context);this.contextGround.setEnabled(!!p.context);this.contextBanks.forEach(b=>b.setEnabled(p.context==='river'));if(p.context){const pos:number[]=[],indices:number[]=[],normals:number[]=[];for(let j=0;j<=20;j++)for(let i=0;i<=20;i++){const x=-20+i*2,z=-13+j*2.5,depth=inspectPostTarget(id,{x,z}).depth;pos.push(x+p.origin.x,z<-.5?pondGround({x:0,z:-10}):-depth,z+p.origin.z+1);}for(let j=0;j<20;j++)for(let i=0;i<20;i++){const a=j*21+i,b=a+21;indices.push(a,a+1,b,a+1,b+1,b);}VertexData.ComputeNormals(pos,indices,normals);const vd=new VertexData();vd.positions=pos;vd.indices=indices;vd.normals=normals;vd.applyToMesh(this.contextGround);this.pondWater.contextMesh.position.set(p.origin.x,0,p.origin.z+13);this.contextBanks.forEach((b,n)=>b.position.set(p.origin.x+(n?-19:19),0,p.origin.z+13));}this.activePost=id;this.fishingRoot.rotation.y=p.angle;this.fishingRoot.position.set(p.origin.x+Math.sin(p.angle),0,p.origin.z+Math.cos(p.angle));this.fishingRoot.computeWorldMatrix(true);const eye=worldPoint(id,{x:0,z:-8.5}),target=worldPoint(id,{x:0,z:5.5});this.camera.position.set(eye.x,4.2,eye.z);this.camera.setTarget(new Vector3(target.x,.1,target.z));this.wasCasting=false;}
}
