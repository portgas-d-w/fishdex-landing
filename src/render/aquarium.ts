import {speciesById} from '../game/catalog';
import {PROFILES} from '../game/profiles';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import '@babylonjs/loaders/glTF';
import type { Specimen } from '../game/specimens';
import type { SaveData } from '../game/save';
import { applyAppearance, VISUALS } from './appearance';
import { BodyWave } from './swim';
import {loadFish} from './fish-model';

export class Aquarium {
  readonly engine: Engine;
  readonly scene: Scene;
  private disposed = false;
  private enabled = true;
  private fish: { root: TransformNode; wave: BodyWave; baseY: number; height: number; phase: number; speed: number;amplitude:number }[] = [];
  private time = 0;
  private frames = 0;
  private light: HemisphericLight;
  private floor: StandardMaterial;
  private background: StandardMaterial;
  private plants: TransformNode;
  private rocks: TransformNode;
  private resize = () => this.engine.resize();
  constructor(canvas: HTMLCanvasElement, quality: SaveData['settings']['quality']) {
    this.engine = new Engine(canvas, true, { stencil: false, powerPreference: 'low-power' });
    this.engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, quality === 'eco' ? 1 : 1.5));
    this.scene = new Scene(this.engine);
    const camera = new ArcRotateCamera('aquarium-camera', -Math.PI / 2, Math.PI / 2.4, 10, new Vector3(0, 2, 0), this.scene);
    camera.fov = 0.75;
    this.light = new HemisphericLight('water-light', new Vector3(0.2, 1, -0.5), this.scene); this.light.intensity = .9;
    this.light.groundColor=Color3.FromHexString('#485756');
    const key = new DirectionalLight('water-key', new Vector3(-0.4, -1, 0.7), this.scene); key.intensity = .75;
    const material = (name: string, hex: string) => { const m = new StandardMaterial(name, this.scene); m.diffuseColor = Color3.FromHexString(hex); m.specularColor = Color3.Black(); return m; };
    this.floor = material('floor-material', '#8e876f');
    const floor = MeshBuilder.CreateBox('aquarium-floor', { width: 8, height: 0.18, depth: 3 }, this.scene); floor.position.set(0, 0, 0.5); floor.material = this.floor;
    const frame = material('glass-edges', '#728386');
    for (const x of [-4, 4]) for (const z of [-1, 2]) { const rail = MeshBuilder.CreateBox('tank-corner', { width: 0.04, depth: 0.04, height: 4.1 }, this.scene); rail.position.set(x, 2, z); rail.material = frame; }
    const back = MeshBuilder.CreateBox('tank-background', {width:8,height:4.4,depth:.08}, this.scene); back.position.set(0,2.2,2.1);back.material=this.background=material('deep-water-background','#293e46');
    const sand=material('sand-detail','#b7a781');for(let i=0;i<22;i++){const pebble=MeshBuilder.CreateSphere('sand-pebble',{diameter:.04+(i%4)*.015,segments:4},this.scene);pebble.scaling.y=.4;pebble.position.set(Math.sin(i*3.17)*3.8,.12,.5+Math.cos(i*2.36));pebble.material=sand;}
    this.plants = new TransformNode('purchased-plants', this.scene);
    const plantMat = material('plants-material', '#487a55');
    for (let i = 0; i < 18; i++) {
      const stem = MeshBuilder.CreateTube('plant-stem', { path: [new Vector3(0, 0, 0), new Vector3(Math.sin(i) * 0.15, 0.7, 0), new Vector3(0.1, 1.4 + i % 3 * 0.2, 0)], radius: 0.045, tessellation: 5 }, this.scene);
      stem.position.set((i % 2 ? -1 : 1) * (2.8 + (i % 4) * 0.18), 0.1, 1.4); stem.parent = this.plants; stem.material = plantMat;
    }
    this.rocks = new TransformNode('purchased-rocks', this.scene);
    const stone = material('rocks-material', '#777e73');
    for (let i = 0; i < 5; i++) { const rock = MeshBuilder.CreateSphere('tank-rock', { diameter: 0.55 + i * 0.08, segments: 5 }, this.scene); rock.scaling.y = 0.7; rock.position.set(-2 + i, 0.24, 1.5); rock.parent = this.rocks; rock.material = stone; }
    window.addEventListener('resize', this.resize);
    let lastRender = 0;
    this.engine.runRenderLoop(() => {
      const now = performance.now(); if (!this.enabled || document.hidden || now - lastRender < 1000 / 30) return;
      this.time += lastRender ? Math.min((now - lastRender) / 1000, 0.1) : 0; lastRender = now;
      for (const fish of this.fish) {
        const t = this.time * fish.speed + fish.phase;
        fish.root.position.set(2.6 * Math.cos(t), fish.baseY + Math.sin(t * 2) * 0.03, 0.4 + Math.sin(t) * 0.65);
        fish.root.rotation.y = Math.atan2(0.65 * Math.cos(t), 2.6 * Math.sin(t));
        fish.wave.update(this.time + fish.phase,false,fish.amplitude);
      }
      this.scene.render();
      this.frames++;
    });
  }
  customize(settings: SaveData['aquarium']) {
    this.scene.clearColor = Color4.FromHexString(settings.background === 'night' ? '#121e2aff' : '#1d2d34ff');
    this.background.diffuseColor = Color3.FromHexString(settings.background === 'night' ? '#192b38' : '#293e46');
    this.floor.diffuseColor = Color3.FromHexString(settings.floor === 'sand' ? '#8e876f' : '#687b70');
    this.light.diffuse = Color3.FromHexString(settings.light === 'warm' ? '#fff0ce' : '#c6eafa');
    this.plants.setEnabled(settings.plants); this.rocks.setEnabled(settings.rocks);
  }
  async show(specimens: Specimen[]): Promise<{ loaded: number; errors: number }> {
    let errors = 0;
    const relativeScale=2.5/Math.max(1,...specimens.slice(0,5).map(s=>s.length));
    for (const [i, specimen] of specimens.slice(0, 5).entries()) {
      if (this.disposed) return { loaded: 0, errors };
      try {
        const visual = VISUALS[specimen.speciesId];
        const container = await loadFish(this.scene,specimen.speciesId,specimen);
        if (this.disposed) { container.dispose(); return { loaded: 0, errors }; }
        container.addAllToScene(); applyAppearance(container, specimen);
        const root = new TransformNode(`specimen-${specimen.id}`, this.scene);
        for (const node of container.rootNodes) node.parent = root;
        const initial=root.getHierarchyBoundingVectors(true),span=Math.max(.01,initial.max.x-initial.min.x);
        root.scaling.setAll(specimen.length*relativeScale/span);
        let minY = Infinity, maxY = -Infinity;
        for (const mesh of container.meshes) { mesh.computeWorldMatrix(true); const bounds = mesh.getBoundingInfo().boundingBox; minY = Math.min(minY, bounds.minimumWorld.y); maxY = Math.max(maxY, bounds.maximumWorld.y); }
        const species=speciesById(specimen.speciesId)!,profile=PROFILES[specimen.speciesId];
        this.fish.push({ root, wave: new BodyWave(container, visual.tailSign), baseY: 0.65 + i * 0.67, height: Math.max(0.12, maxY - minY), phase: (specimen.seed??i*127)%100/17, speed: .16+profile.attributes.agility*.07,amplitude:species.family==='eel'?1.4:species.family==='bream'?.65:1 });
      } catch { if (!this.disposed) errors++; }
    }
    if (!this.disposed) {
      const height = this.fish.reduce((sum, fish) => sum + fish.height, 0);
      const fit = Math.min(1, (3.5 - this.fish.length * 0.17) / Math.max(0.1, height));
      let y = 0.3;
      for (const fish of this.fish) { fish.root.scaling.scaleInPlace(fit); fish.height *= fit; fish.baseY = y + fish.height / 2; y += fish.height + 0.17; }
      await this.scene.whenReadyAsync(); this.engine.resize();if(this.enabled)this.scene.render();
    }
    return { loaded: this.fish.length, errors };
  }
  inspectOrbit(){const time=this.time,samples=[];for(let n=0;n<=80;n++){for(const f of this.fish){const t=n/80*Math.PI*2;f.root.position.set(2.6*Math.cos(t),f.baseY,.4+Math.sin(t)*.65);f.root.rotation.y=Math.atan2(.65*Math.cos(t),2.6*Math.sin(t));}samples.push(this.diagnostics().specimens);}for(const f of this.fish){const t=time*f.speed+f.phase;f.root.position.set(2.6*Math.cos(t),f.baseY,.4+Math.sin(t)*.65);f.root.rotation.y=Math.atan2(.65*Math.cos(t),2.6*Math.sin(t));}return samples;}
  pause() { this.enabled = false; }
  diagnostics() { return { count: this.fish.length, frames: this.frames, enabled: this.enabled, plants: this.plants.isEnabled(), rocks: this.rocks.isEnabled(), specimens: this.fish.map(f => ({ id: f.root.name, scale: f.root.scaling.x, position: f.root.position.asArray(), bounds: (()=>{const b=f.root.getHierarchyBoundingVectors(true);return {min:b.min.asArray(),max:b.max.asArray()};})() })) }; }
  resume() { this.enabled = true; this.engine.resize(); }
  dispose() { this.disposed = true; this.enabled = false; this.engine.stopRenderLoop(); window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); this.fish = []; }
}
