import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import '@babylonjs/loaders/glTF';
import type { Species } from '../game/catalog';
import type { Specimen } from '../game/specimens';
import { VISUALS, applyAppearance } from './appearance';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { BodyWave } from './swim';

export class FishPreview {
  private engine: Engine;
  private scene: Scene;
  private container?: AssetContainer;
  private request = 0;
  private camera: ArcRotateCamera;
  private render: (() => void) | undefined;
  private canvas: HTMLCanvasElement;
  private mat?: Mesh;
  private resize = () => this.engine.resize();
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true, { alpha: true, preserveDrawingBuffer: true, stencil: false, powerPreference: 'low-power' });
    this.engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, 1.5));
    this.scene = new Scene(this.engine); this.scene.clearColor = new Color4(0, 0, 0, 0);
    this.camera = new ArcRotateCamera('fish-camera', -Math.PI / 2, Math.PI / 2.15, 3.3, Vector3.Zero(), this.scene);
    this.camera.fov = 0.7;
    const light = new HemisphericLight('fish-softbox', new Vector3(0, 1, -1), this.scene);
    light.intensity = 1.6; light.groundColor = new Color3(0.4, 0.45, 0.4);
    const key = new DirectionalLight('fish-key', new Vector3(0.1, -0.4, 1), this.scene); key.intensity = 2.0;
    window.addEventListener('resize', this.resize);
  }
  async show(species: Species, specimen?: Specimen): Promise<boolean> {
    const request = ++this.request;
    this.engine.stopRenderLoop(); this.render = undefined; this.container?.dispose(); this.container = undefined;
    this.mat?.dispose(false, true); this.mat = undefined;
    try {
      const container = await LoadAssetContainerAsync(`/models/${VISUALS[species.id].model}.glb`, this.scene);
      if (request !== this.request) { container.dispose(); return false; }
      this.container = container; container.addAllToScene(); this.engine.resize();
      applyAppearance(container, specimen);
      this.camera.beta = specimen && specimen.length >= 60 ? 1.2 : Math.PI / 2.15;
      if (specimen && specimen.length >= 60) {
        let floor = Infinity;
        for (const mesh of container.meshes) { if (mesh.getTotalVertices() === 0) continue; mesh.computeWorldMatrix(true); floor = Math.min(floor, mesh.getBoundingInfo().boundingBox.minimumWorld.y); }
        this.mat = MeshBuilder.CreateBox('presentation-mat', { width: 2.6, height: 0.06, depth: 1.1 }, this.scene);
        this.mat.position.y = Number.isFinite(floor) ? floor - 0.035 : -0.45;
        const mat = new StandardMaterial('soft-mat', this.scene); mat.diffuseColor = Color3.FromHexString('#263c30'); mat.specularColor = Color3.Black(); this.mat.material = mat;
      }
      const wave = new BodyWave(container, VISUALS[species.id].tailSign);
      // Le fichier peut être chargé avant la compilation des matériaux WebGL.
      // Ne signaler l’aperçu prêt qu’une fois une première image rendue.
      await this.scene.whenReadyAsync();
      if (request !== this.request) return false;
      let time = 0;
      this.render = () => {
        time += Math.min(this.engine.getDeltaTime() / 1000, 0.05);
        this.camera.alpha = -Math.PI / 2 + Math.sin(time * 0.6) * 0.20;
        const twitch = time % 4.5 > 3.8; wave.update(time, twitch, twitch ? 0.6 : 0.04);
        this.scene.render();
      };
      this.scene.render(); this.resume();
      return true;
    } catch (error) { console.warn('Aperçu du poisson indisponible', error); return false; }
  }
  async photo(): Promise<Blob | null> {
    this.camera.alpha = -Math.PI / 2; this.scene.render();
    const thumb = document.createElement('canvas'); thumb.width = 480; thumb.height = 240;
    const ctx = thumb.getContext('2d'); if (!ctx) return null;
    ctx.fillStyle = '#294b40'; ctx.fillRect(0, 0, 480, 240);
    ctx.drawImage(this.canvas, 0, 0, 480, 240);
    return new Promise(resolve => thumb.toBlob(resolve, 'image/webp', 0.82));
  }
  pause() { this.engine.stopRenderLoop(); }
  resume() { if (this.render) this.engine.runRenderLoop(this.render); }
  hide() { this.request++; this.pause(); this.render = undefined; this.container?.dispose(); this.container = undefined; this.mat?.dispose(false, true); this.mat = undefined; }
  dispose() { this.hide(); window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); }
}
