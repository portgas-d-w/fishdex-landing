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
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import type { Specimen } from '../game/specimens';
import type { SaveData } from '../game/save';
import { applyAppearance, VISUALS } from './appearance';
import { BodyWave } from './swim';

export class Aquarium {
  readonly engine: Engine;
  readonly scene: Scene;
  private disposed = false;
  private enabled = true;
  private fish: { root: TransformNode; wave: BodyWave; baseY: number; height: number; phase: number; speed: number }[] = [];
  private time = 0;
  private frames = 0;
  private light: HemisphericLight;
  private floor: StandardMaterial;
  private plants: TransformNode;
  private rocks: TransformNode;
  private resize = () => this.engine.resize();
  constructor(canvas: HTMLCanvasElement, quality: SaveData['settings']['quality']) {
    this.engine = new Engine(canvas, true, { stencil: false, powerPreference: 'low-power' });
    this.engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, quality === 'eco' ? 1 : 1.5));
    this.scene = new Scene(this.engine);
    const camera = new ArcRotateCamera('aquarium-camera', -Math.PI / 2, Math.PI / 2.4, 10, new Vector3(0, 2, 0), this.scene);
    camera.fov = 0.75;
    this.light = new HemisphericLight('water-light', new Vector3(0.2, 1, -0.5), this.scene); this.light.intensity = 0.95;
    const key = new DirectionalLight('water-key', new Vector3(-0.4, -1, 0.7), this.scene); key.intensity = 1.0;
    const material = (name: string, hex: string) => { const m = new StandardMaterial(name, this.scene); m.diffuseColor = Color3.FromHexString(hex); m.specularColor = Color3.Black(); return m; };
    this.floor = material('floor-material', '#b7a780');
    const floor = MeshBuilder.CreateBox('aquarium-floor', { width: 8, height: 0.18, depth: 3 }, this.scene); floor.position.set(0, 0, 0.5); floor.material = this.floor;
    const frame = material('glass-edges', '#769d99');
    for (const x of [-4, 4]) for (const z of [-1, 2]) { const rail = MeshBuilder.CreateBox('tank-corner', { width: 0.04, depth: 0.04, height: 4.1 }, this.scene); rail.position.set(x, 2, z); rail.material = frame; }
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
        fish.wave.update(this.time + fish.phase);
      }
      this.scene.render();
      this.frames++;
    });
  }
  customize(settings: SaveData['aquarium']) {
    this.scene.clearColor = Color4.FromHexString(settings.background === 'night' ? '#102c40ff' : '#396b70ff');
    this.floor.diffuseColor = Color3.FromHexString(settings.floor === 'sand' ? '#b7a780' : '#687b70');
    this.light.diffuse = Color3.FromHexString(settings.light === 'warm' ? '#fff0ce' : '#c6eafa');
    this.plants.setEnabled(settings.plants); this.rocks.setEnabled(settings.rocks);
  }
  async show(specimens: Specimen[]): Promise<{ loaded: number; errors: number }> {
    let errors = 0;
    for (const [i, specimen] of specimens.slice(0, 5).entries()) {
      if (this.disposed) return { loaded: 0, errors };
      try {
        const visual = VISUALS[specimen.speciesId];
        const container = await LoadAssetContainerAsync(`/models/${visual.model}.glb`, this.scene);
        if (this.disposed) { container.dispose(); return { loaded: 0, errors }; }
        container.addAllToScene(); applyAppearance(container, specimen);
        const root = new TransformNode(`specimen-${specimen.id}`, this.scene);
        for (const node of container.rootNodes) node.parent = root;
        root.scaling.setAll(Math.max(0.25, Math.min(1.25, specimen.length / 65)));
        let minY = Infinity, maxY = -Infinity;
        for (const mesh of container.meshes) { mesh.computeWorldMatrix(true); const bounds = mesh.getBoundingInfo().boundingBox; minY = Math.min(minY, bounds.minimumWorld.y); maxY = Math.max(maxY, bounds.maximumWorld.y); }
        this.fish.push({ root, wave: new BodyWave(container, visual.tailSign), baseY: 0.65 + i * 0.67, height: Math.max(0.12, maxY - minY), phase: i * 1.7, speed: 0.18 + i * 0.025 });
      } catch { if (!this.disposed) errors++; }
    }
    if (!this.disposed) {
      const height = this.fish.reduce((sum, fish) => sum + fish.height, 0);
      const fit = Math.min(1, (3.5 - this.fish.length * 0.17) / Math.max(0.1, height));
      let y = 0.3;
      for (const fish of this.fish) { fish.root.scaling.scaleInPlace(fit); fish.height *= fit; fish.baseY = y + fish.height / 2; y += fish.height + 0.17; }
      await this.scene.whenReadyAsync(); this.engine.resize(); this.scene.render();
    }
    return { loaded: this.fish.length, errors };
  }
  pause() { this.enabled = false; }
  diagnostics() { return { count: this.fish.length, frames: this.frames, enabled: this.enabled, plants: this.plants.isEnabled(), rocks: this.rocks.isEnabled(), specimens: this.fish.map(f => ({ id: f.root.name, scale: f.root.scaling.x, position: f.root.position.asArray() })) }; }
  resume() { this.enabled = true; this.engine.resize(); }
  dispose() { this.disposed = true; this.enabled = false; this.engine.stopRenderLoop(); window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); this.fish = []; }
}
