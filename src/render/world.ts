import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Matrix, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { Effect } from '@babylonjs/core/Materials/effect';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import type { FishingGame } from '../game/fishing';
import type { CastAim } from '../game/casting';

export class LakeWorld {
  readonly engine: Engine;
  readonly scene: Scene;
  readonly camera: FreeCamera;
  private bobber: TransformNode;
  private line: ReturnType<typeof MeshBuilder.CreateLines>;
  private rings: Mesh[] = [];
  private water: ShaderMaterial;
  private time = 0;
  private castPoint = new Vector3(0, 0, 7);
  private reeds: TransformNode[] = [];
  private resize = () => this.engine.resize();
  private seed = 127;
  private rod!: Mesh;
  private thickLine!: Mesh;
  private aimRing!: Mesh;
  private lure!: Mesh;
  private trajectory!: ReturnType<typeof MeshBuilder.CreateLines>;
  private rodPath = Array.from({ length: 9 }, (_, i) => new Vector3(1.4, 0.8 + i * 0.16, -5.7 + i * 0.56));
  private random() { this.seed = (1664525 * this.seed + 1013904223) >>> 0; return this.seed / 4294967296; }

  rodTipOnScreen() {
    const width = this.engine.getRenderWidth(), height = this.engine.getRenderHeight();
    const point = Vector3.Project(this.rodPath[8], Matrix.Identity(), this.scene.getTransformMatrix(), this.camera.viewport.toGlobal(width, height));
    return { x: point.x / width, y: point.y / height };
  }

  constructor(canvas: HTMLCanvasElement, quality: 'eco' | 'high') {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false, powerPreference: 'low-power' });
    this.scene = new Scene(this.engine);
    this.scene.clearColor = Color4.FromHexString('#b8cec4ff');
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogColor = Color3.FromHexString('#aec5b5');
    this.scene.fogDensity = 0.015;
    this.camera = new FreeCamera('lake-camera', new Vector3(0, 4.2, -8.5), this.scene);
    this.camera.setTarget(new Vector3(0, 0.1, 5.5));
    this.camera.fov = 0.88;
    this.camera.minZ = 0.1;
    const ambient = new HemisphericLight('sky-light', new Vector3(-0.2, 1, -0.2), this.scene);
    ambient.intensity = 0.85;
    ambient.groundColor = Color3.FromHexString('#324c39');
    const sun = new DirectionalLight('morning-light', new Vector3(-1, -0.7, 0.5), this.scene);
    sun.diffuse = Color3.FromHexString('#fff0c9'); sun.intensity = 0.65;
    this.sky();
    this.landscape();
    this.water = this.createWater();
    this.dock();
    this.batchScenery();
    this.rod = MeshBuilder.CreateTube('moving-rod', { path: this.rodPath, radius: 0.025, tessellation: 6, updatable: true }, this.scene);
    this.rod.material = this.material('#344337');
    this.thickLine = MeshBuilder.CreateTube('visible-line', { path: Array.from({ length: 9 }, (_, i) => new Vector3(1, 2, i)), radius: 0.012, tessellation: 4, updatable: true }, this.scene);
    const lineMat = this.material('#fff2bf'); lineMat.disableLighting = true; lineMat.emissiveColor = Color3.FromHexString('#fff2bf'); this.thickLine.material = lineMat;
    this.aimRing = MeshBuilder.CreateTorus('cast-target', { diameter: 0.8, thickness: 0.035, tessellation: 32 }, this.scene);
    this.aimRing.material = this.material('#f5dda1'); this.aimRing.setEnabled(false);
    this.lure = MeshBuilder.CreateSphere('surface-lure', { diameter: 0.13, segments: 8 }, this.scene); this.lure.scaling.set(0.45, 0.4, 1.4); this.lure.material = this.material('#d8c476'); this.lure.setEnabled(false);
    this.trajectory = MeshBuilder.CreateLines('trajectory', { points: Array.from({ length: 17 }, () => Vector3.Zero()), updatable: true }, this.scene);
    this.trajectory.color = Color3.FromHexString('#f5dda1'); this.trajectory.setEnabled(false);
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
    this.line = MeshBuilder.CreateLines('fishing-line', { points: [new Vector3(1.3, 1.8, -2.3), new Vector3(0, 0.3, 7)], updatable: true }, this.scene);
    this.line.color = Color3.FromHexString('#d2c6a4'); this.line.alpha = 0.55;
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
    Effect.ShadersStore.lakeSkyFragmentShader = `precision highp float; varying float height; void main(){ float h=clamp(height/100.,0.,1.); vec3 col=mix(vec3(.88,.85,.67),vec3(.41,.65,.66),pow(h,.48)); gl_FragColor=vec4(col,1.); }`;
    const mat = new ShaderMaterial('sky-gradient', this.scene, { vertex: 'lakeSky', fragment: 'lakeSky' }, { attributes: ['position'], uniforms: ['worldViewProjection'] });
    mat.backFaceCulling = false; mat.disableDepthWrite = true;
    const sky = MeshBuilder.CreateSphere('sky-dome', { diameter: 240, segments: 12 }, this.scene);
    sky.material = mat; sky.isPickable = false;
    const sunMat = this.material('#ffedb5'); sunMat.disableLighting = true; sunMat.emissiveColor = Color3.FromHexString('#ffedb5');
    this.ellipsoid('sun', new Vector3(-25, 18, 82), new Vector3(3.2, 3.2, 1), sunMat, 24);
  }
  private landscape() {
    const bank = this.material('#657751'); const edge = this.material('#9b9364');
    const trunk = this.material('#514f35');
    const greens = ['#314f42', '#42664c', '#547558', '#294e41'].map(c => this.material(c));
    for (let layer = 0; layer < 3; layer++) {
      const hillMat = this.material(['#6e8e7b', '#87a492', '#9db7a4'][layer]);
      for (let i = 0; i < 9; i++) this.ellipsoid('distant-hill', new Vector3((i - 4) * 16, -1, 55 + layer * 14), new Vector3(13, 4 + this.random() * 6, 10), hillMat, 12);
    }
    this.ellipsoid('far-bank', new Vector3(0, -1.3, 33), new Vector3(60, 2.4, 10), bank, 16);
    for (const side of [-1, 1]) {
      this.ellipsoid('shore-sand', new Vector3(side * 24, -0.25, 9), new Vector3(12, 0.7, 27), edge, 12);
      this.ellipsoid('shore-grass', new Vector3(side * 25, -0.2, 9), new Vector3(12, 1.1, 28), bank, 12);
    }
    for (let i = 0; i < 70; i++) {
      const x = i < 42 ? (this.random() - 0.5) * 90 : (i % 2 ? -1 : 1) * (16 + this.random() * 10);
      const z = i < 42 ? 28 + this.random() * 12 : -1 + this.random() * 29;
      const h = 2.5 + this.random() * 6;
      const stem = MeshBuilder.CreateCylinder('tree-trunk', { height: h * 0.75, diameter: 0.28, tessellation: 6 }, this.scene);
      stem.position.set(x, h * 0.375 + 0.3, z); stem.material = trunk;
      if (i % 3 === 0) {
        for (let j = 0; j < 3; j++) {
          const crown = MeshBuilder.CreateCylinder('pine-crown', { height: h * 0.55, diameterBottom: h * (0.48 - j * 0.08), diameterTop: 0, tessellation: 7 }, this.scene);
          crown.position.set(x, h * (0.44 + j * 0.18), z); crown.material = greens[i % 4];
        }
      } else {
        this.ellipsoid('leaf-crown', new Vector3(x, h * 0.78, z), new Vector3(h * 0.3, h * 0.4, h * 0.28), greens[i % 4]);
        this.ellipsoid('leaf-crown', new Vector3(x + h * 0.15, h * 0.62, z), new Vector3(h * 0.26, h * 0.28, h * 0.26), greens[(i + 1) % 4]);
      }
    }
    const stalk = this.material('#7d8d53'); const head = this.material('#655332');
    for (let i = 0; i < 44; i++) {
      const side = i % 2 ? -1 : 1;
      const root = new TransformNode('reed-root', this.scene);
      root.position.set(side * (4 + this.random() * 5), 0, -2 + this.random() * 7);
      const height = 0.7 + this.random() * 1.3;
      const stem = MeshBuilder.CreateCylinder('reed', { diameter: 0.022, height, tessellation: 4 }, this.scene);
      stem.position.y = height / 2; stem.material = stalk; stem.parent = root;
      const cattail = MeshBuilder.CreateCylinder('cattail', { diameter: 0.075, height: 0.27, tessellation: 6 }, this.scene);
      cattail.position.y = height - 0.13; cattail.parent = root; cattail.material = head;
      if (i < 10) this.reeds.push(root);
      else { stem.setParent(null); cattail.setParent(null); root.dispose(); }
    }
    const lilyMat = this.material('#648450');
    for (let i = 0; i < 22; i++) {
      const pad = MeshBuilder.CreateCylinder('lily-pad', { diameter: 0.35 + this.random() * 0.4, height: 0.014, tessellation: 10 }, this.scene);
      pad.position.set(-4 + this.random() * 2.7, 0.045, 3 + this.random() * 9); pad.material = lilyMat;
    }
    const rock = this.material('#8c9280');
    for (let i = 0; i < 12; i++) this.ellipsoid('rock', new Vector3((i % 2 ? -1 : 1) * (12.5 + this.random() * 2), 0.15, this.random() * 19), new Vector3(0.6, 0.5, 0.85), rock, 5);
  }
  private createWater() {
    Effect.ShadersStore.lakeWaterVertexShader = `precision highp float; attribute vec3 position; uniform mat4 worldViewProjection; uniform mat4 world; uniform float time; varying vec3 wp; void main(){vec3 p=position; p.y+=sin(p.x*1.5+time*.6)*.018+cos(p.z*2.-time*.75)*.014; wp=(world*vec4(p,1.)).xyz; gl_Position=worldViewProjection*vec4(p,1.);}`;
    Effect.ShadersStore.lakeWaterFragmentShader = `precision highp float; varying vec3 wp; uniform float time; uniform vec3 eye; void main(){ float d=length(wp-eye); float ripple=sin(wp.z*12.+sin(wp.x*4.+time*.5)*1.6-time)*.5+.5; float streak=pow(ripple,18.); float far=clamp(d/70.,0.,1.); vec3 col=mix(vec3(.10,.30,.28),vec3(.59,.69,.55),far); float reflection=exp(-pow((wp.x+6.)/(2.+d*.08),2.))*smoothstep(7.,50.,wp.z); col+=vec3(.49,.37,.17)*reflection*streak*.62; col+=vec3(.11,.19,.15)*pow(ripple,9.)*.34; gl_FragColor=vec4(col,1.);}`;
    const mat = new ShaderMaterial('lake-water', this.scene, { vertex: 'lakeWater', fragment: 'lakeWater' }, { attributes: ['position'], uniforms: ['worldViewProjection', 'world', 'time', 'eye'] });
    const water = MeshBuilder.CreateGround('water', { width: 140, height: 140, subdivisions: 65 }, this.scene);
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
    const woods = ['#867154', '#927c59', '#7a684e'].map(c => this.material(c));
    for (let i = 0; i < 16; i++) {
      const board = MeshBuilder.CreateBox('dock-plank', { width: 3.5, height: 0.16, depth: 0.39 }, this.scene);
      board.position.set(0, 0.30, -8 + i * 0.43); board.material = woods[i % 3];
    }
    for (const x of [-1.65, 1.65]) for (const z of [-5.8, -1.6]) {
      const post = MeshBuilder.CreateCylinder('dock-post', { diameter: 0.20, height: 1.5, tessellation: 8 }, this.scene);
      post.position.set(x, 0.25, z); post.material = woods[2];
    }
    const grip = MeshBuilder.CreateTube('cork-grip', { path: [new Vector3(1.4, 0.8, -5.7), new Vector3(1.415, 1.0, -5.1)], radius: 0.06, tessellation: 8 }, this.scene);
    grip.material = this.material('#c2a46d');
  }
  setQuality(quality: 'eco' | 'high') {
    const dpr = Math.min(window.devicePixelRatio || 1, quality === 'eco' ? 1.25 : 2);
    this.engine.setHardwareScalingLevel(1 / dpr);
  }
  aim(aim?: CastAim) {
    this.aimRing.setEnabled(!!aim); this.trajectory.setEnabled(!!aim);
    if (!aim) return;
    this.aimRing.position.set(aim.point.x, 0.07, aim.point.z);
    (this.aimRing.material as StandardMaterial).diffuseColor = Color3.FromHexString(aim.valid ? '#f5dda1' : '#f37c62');
    const start = this.rodPath[8];
    MeshBuilder.CreateLines('trajectory', { points: Array.from({ length: 17 }, (_, i) => {
      const t = i / 16; return Vector3.Lerp(start, new Vector3(aim.point.x, 0.1, aim.point.z), t).add(new Vector3(0, Math.sin(t * Math.PI) * 2.3, 0));
    }), instance: this.trajectory }, this.scene);
  }
  update(dt: number, game: FishingGame) {
    this.time += dt;
    this.water.setFloat('time', this.time); this.water.setVector3('eye', this.camera.position);
    const targetX = game.target.x;
    const targetZ = game.target.z;
    this.castPoint.set(targetX, 0, targetZ);
    const show = ['casting', 'waiting', 'bite', 'fighting'].includes(game.phase);
    this.bobber.setEnabled(show && game.method === 'float'); this.line.setEnabled(false); this.thickLine.setEnabled(show);
    this.lure.setEnabled(show && game.method === 'lure' && game.phase !== 'fighting');
    const fighting = game.phase === 'fighting';
    // L’amplitude visuelle suit le champ horizontal : la pointe reste visible en portrait.
    // Les règles gardent la même orientation et les mêmes forces sur tous les formats.
    const framing = Math.min(1, this.engine.getAspectRatio(this.camera));
    const base = new Vector3(1.4 * framing ** 1.5, 0.8, -5.7);
    this.rodPath = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      return base.add(new Vector3((game.rodYaw * 3 * framing ** 2 - 0.1 * framing) * t + (fighting ? game.direction * game.tension * t * t * 0.7 * framing : 0),
        (0.8 + game.rodLift * 2.3) * t - (fighting ? game.tension * t * t * 1.1 : game.phase === 'bite' ? (0.35 + Math.sin(this.time * 12) * 0.12) * t * t : 0), 4.5 * t));
    });
    MeshBuilder.CreateTube('moving-rod', { path: this.rodPath, instance: this.rod }, this.scene);
    const cast = game.phase === 'casting' ? Math.min(1, game.elapsed / 1.1) : 1;
    this.bobber.position.set(targetX * cast, 0.035 + Math.sin(this.time * 2) * 0.022, -1 + (targetZ + 1) * cast);
    if (game.phase === 'casting') this.bobber.position.y += Math.sin(cast * Math.PI) * 2;
    if (game.method === 'lure' && ['waiting', 'bite'].includes(game.phase)) this.bobber.position.set(game.fishPosition.x, 0.04, game.fishPosition.z);
    if (game.method === 'bottom' && ['waiting', 'bite'].includes(game.phase)) this.bobber.position.y = -game.target.z * 0.2;
    this.lure.position.copyFrom(this.bobber.position); this.lure.rotation.y = game.rodYaw;
    if (game.phase === 'bite') {
      this.bobber.position.y -= Math.abs(Math.sin(this.time * 12)) * 0.1;
      this.bobber.position.x += Math.sin(this.time * 4) * (game.pulling ? 0.28 : 0.05);
    }
    if (fighting) {
      this.bobber.position.set(game.fishPosition.x, game.progress > 0.90 ? 0.01 : game.fishPosition.y, game.fishPosition.z);
    }
    this.rings.forEach((ring, i) => {
      ring.setEnabled(show && game.method !== 'bottom' && game.phase !== 'casting' && (!fighting || game.progress > 0.9));
      const t = (this.time * (game.phase === 'bite' ? 1.8 : 0.5) + i / 3) % 1;
      ring.position.copyFrom(this.bobber.position); ring.position.y = 0.047;
      ring.scaling.setAll(0.25 + t * 2.5);
      (ring.material as StandardMaterial).alpha = (1 - t) * 0.3;
    });
    const end = this.bobber.position.add(new Vector3(0, 0.15, 0));
    const tip = this.rodPath[8];
    // Le segment immergé est occulté par l’eau ; le point d’entrée suit le poisson.
    const path = Array.from({ length: 9 }, (_, i) => {
      const t = i / 8; const p = Vector3.Lerp(tip, end, t);
      p.y -= Math.sin(t * Math.PI) * (fighting ? (1 - game.tension) * 0.65 : 0.15); return p;
    });
    MeshBuilder.CreateLines('fishing-line', { points: [tip, end], instance: this.line }, this.scene);
    MeshBuilder.CreateTube('visible-line', { path, instance: this.thickLine }, this.scene);
    this.reeds.forEach((reed, i) => { reed.rotation.z = Math.sin(this.time * 1.2 + i) * 0.035; });
  }
  dispose() { window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); }
}
