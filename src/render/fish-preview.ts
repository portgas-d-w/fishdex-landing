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

export class FishPreview {
  private engine: Engine;
  private scene: Scene;
  private container?: AssetContainer;
  private request = 0;
  private camera: ArcRotateCamera;
  private render: (() => void) | undefined;
  private resize = () => this.engine.resize();
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine(canvas, true, { alpha: true, stencil: false, powerPreference: 'low-power' });
    this.engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, 1.5));
    this.scene = new Scene(this.engine); this.scene.clearColor = new Color4(0, 0, 0, 0);
    this.camera = new ArcRotateCamera('fish-camera', -Math.PI / 2, Math.PI / 2.15, 3.3, Vector3.Zero(), this.scene);
    this.camera.fov = 0.7;
    const light = new HemisphericLight('fish-softbox', new Vector3(0, 1, -1), this.scene);
    light.intensity = 1.6; light.groundColor = new Color3(0.4, 0.45, 0.4);
    const key = new DirectionalLight('fish-key', new Vector3(0.1, -0.4, 1), this.scene); key.intensity = 2.0;
    window.addEventListener('resize', this.resize);
  }
  async show(species: Species): Promise<boolean> {
    const request = ++this.request;
    this.engine.stopRenderLoop(); this.render = undefined; this.container?.dispose(); this.container = undefined;
    try {
      const container = await LoadAssetContainerAsync(`/models/${species.model}.glb`, this.scene);
      if (request !== this.request) { container.dispose(); return false; }
      this.container = container; container.addAllToScene(); this.engine.resize();
      // Le fichier peut être chargé avant la compilation des matériaux WebGL.
      // Ne signaler l’aperçu prêt qu’une fois une première image rendue.
      await this.scene.whenReadyAsync();
      if (request !== this.request) return false;
      let time = 0;
      this.render = () => {
        time += Math.min(this.engine.getDeltaTime() / 1000, 0.05);
        this.camera.alpha = -Math.PI / 2 + Math.sin(time * 0.6) * 0.20;
        this.scene.render();
      };
      this.scene.render(); this.resume();
      return true;
    } catch (error) { console.warn('Aperçu du poisson indisponible', error); return false; }
  }
  pause() { this.engine.stopRenderLoop(); }
  resume() { if (this.render) this.engine.runRenderLoop(this.render); }
  hide() { this.request++; this.pause(); this.render = undefined; this.container?.dispose(); this.container = undefined; }
  dispose() { this.hide(); window.removeEventListener('resize', this.resize); this.scene.dispose(); this.engine.dispose(); }
}
