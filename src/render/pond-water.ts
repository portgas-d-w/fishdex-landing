import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { MirrorTexture } from '@babylonjs/core/Materials/Textures/mirrorTexture';
import { Effect } from '@babylonjs/core/Materials/effect';
import { Plane } from '@babylonjs/core/Maths/math.plane';
import { Vector3,Matrix } from '@babylonjs/core/Maths/math.vector';
import {Frustum} from '@babylonjs/core/Maths/math.frustum';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { POND_MAP, pondDepth, shoreDistance, inPond } from '../game/pond-map';
import type { WaterEvent, WaterType } from '../game/water-events';
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { waterVertex, waterFragment } from "./water-shaders";
import { rippleTexture, surfaceStrength, isWake, boundedTurbidity, WATER_TURBIDITY, SURFACE_WAVES } from "./water-optics";
export type WaterQuality = 'low' | 'standard' | 'high';
export const WATER_PROFILES = { low: { rings: 12, drops: 16, crowns: 2, mirror: 128, cadence: 0 }, standard: { rings: 20, drops: 32, crowns: 4, mirror: 256, cadence: 6 }, high: { rings: 28, drops: 48, crowns: 6, mirror: 512, cadence: 3 } };
/** Événements réels qui franchissent la surface avec masse : couronne d’éclaboussure brève (pool borné). */
const SPLASH_TYPES = ['cast_impact', 'feeder_impact', 'groundbait_impact', 'fish_surface_break', 'fish_dive', 'net_exit', 'fish_release'];
export class PondWater {
    readonly mesh: Mesh;
    readonly contextMesh: Mesh;
    readonly material: ShaderMaterial;
    private depthTexture!: RawTexture;
    private mirror?: MirrorTexture;
    private quality: WaterQuality = 'low';
    private effects: {
        mesh: Mesh;
        event?: WaterEvent;
        drop?: number;
    }[] = [];
    private lastId = 0;
    private debugId = -1;
    private now = 0;
    private context = false;
    private simple: StandardMaterial;
    readonly counts: Partial<Record<WaterType, number>> = {};
    private crowns: { mesh: Mesh; event?: WaterEvent }[] = [];
    onEvent?: (e: WaterEvent) => void;
    private turbidity = WATER_TURBIDITY.default;
    private mirrorRenders = 0;
    private mirrorCpuMs = 0;
    private mirrorStarted = 0;
    private waves = Array(32).fill(0);
    private motions = Array(32).fill(0);
    private activeWaves = 0;
    private surfaceStarted=0;private surfaceSubmissionCpuMs=0;
    private fpsStart=performance.now();private fpsFrames=0;private renderedFPS=0;
    private selectedEvents:WaterEvent[]=[];
    constructor(private scene: Scene, private reflectors: AbstractMesh[], contacts: {
        family: string;
        x: number;
        z: number;
        scale: number;
    }[] = []) {
        const c = POND_MAP.contour, p = [0, 0, 39], idx: number[] = [], normals: number[] = [], uv: number[] = [];
        for (const v of c)
            p.push(v.x, 0, v.z);
        for (let i = 0; i < c.length; i++)
            idx.push(0, i + 1, (i + 1) % c.length + 1);
        for (let n = 0; n < p.length / 3; n++) {
            normals.push(0, 1, 0);
            uv.push(p[n * 3] / 8, p[n * 3 + 2] / 8);
        }
        const v = new VertexData();
        v.positions = p;
        v.indices = idx;
        v.normals = normals;
        v.uvs = uv;
        this.mesh = new Mesh('water', scene);
        v.applyToMesh(this.mesh);
        Effect.ShadersStore.pondWaterVertexShader = waterVertex;
        Effect.ShadersStore.pondWaterFragmentShader = waterFragment;
        this.material = new ShaderMaterial('pond-water', scene, { vertex: 'pondWater', fragment: 'pondWater' }, { attributes: ['position'], uniforms: ['worldViewProjection', 'world', 'time', 'eye', 'mirrorOn', 'wind', 'contextDepth', 'sky', 'view', 'turbidity', 'fineDetail', 'waveCount', 'waves', 'waveMotion'], samplers: ['depthMap', 'reflection', 'ripples'], needAlphaBlending: true });
        this.material.backFaceCulling = false;
        this.material.setFloat('mirrorOn', 0);
        this.material.setFloat('wind', 0);
        this.material.setFloat('contextDepth', 0);
        this.material.setColor3('sky', Color3.FromHexString('#b8c9ca'));
        this.material.setFloat("turbidity", this.turbidity);
        this.material.setFloat("fineDetail", .45);
        this.material.setFloat("waveCount", 0);
        this.material.setArray4("waves", this.waves);
        this.material.setArray4("waveMotion", this.motions);
        const pixels = new Uint8Array(256 * 256 * 4);
        for (let y = 0; y < 256; y++)
            for (let x = 0; x < 256; x++) {
                const point = { x: -90 + (x + .5) / 256 * 180, z: -31 + (y + .5) / 256 * 140 }, at = (y * 256 + x) * 4;
                pixels[at] = Math.round(pondDepth(point) / 8 * 255);
                pixels[at + 1] = Math.round(Math.min(1, shoreDistance(point) / 8) * 255);
                pixels[at + 3] = Math.round(127 + 35 * Math.sin(point.x * .81) * Math.sin(point.z * .67));
            }
        for (const c of contacts.filter(p => ["pier_pile", "lily_cluster", "reeds", "reeds_shore", "fallen_log", "submerged_branches"].includes(p.family))) {
            const radius = c.family === "reeds" ? 1.1 : c.family === "reeds_shore" ? 1.05 * c.scale : c.family === "fallen_log" ? .9 : c.family === "submerged_branches" ? .8 : c.family === "lily_cluster" ? 1.1 * c.scale : .55;
            const cx = (c.x + 90) / 180 * 256 - .5, cy = (c.z + 31) / 140 * 256 - .5;
            for (let y = Math.max(0, Math.floor(cy - radius * 256 / 140)); y <= Math.min(255, Math.ceil(cy + radius * 256 / 140)); y++)
                for (let x = Math.max(0, Math.floor(cx - radius * 256 / 180)); x <= Math.min(255, Math.ceil(cx + radius * 256 / 180)); x++) {
                    const d = Math.hypot((x - cx) * 180 / 256, (y - cy) * 140 / 256) / radius;
                    const at = (y * 256 + x) * 4 + 2;
                    pixels[at] = Math.max(pixels[at], Math.round(Math.max(0, 1 - d) * 255));
                }
        }
        const tex = RawTexture.CreateRGBATexture(pixels, 256, 256, scene, false, false, Texture.BILINEAR_SAMPLINGMODE);
        tex.name = "pond-bathymetry-contacts";
        tex.gammaSpace = false;
        tex.wrapU = tex.wrapV = Texture.CLAMP_ADDRESSMODE;
        this.depthTexture = tex;
        this.material.setTexture("depthMap", tex);
        this.material.setTexture("reflection", tex);
        const rippleNormals = RawTexture.CreateRGBATexture(rippleTexture(), 128, 128, scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
        rippleNormals.name = "pond-ripple-normals";
        rippleNormals.gammaSpace = false;
        rippleNormals.wrapU = rippleNormals.wrapV = Texture.WRAP_ADDRESSMODE;
        rippleNormals.anisotropicFilteringLevel = 2;
        this.material.setTexture("ripples", rippleNormals);
        this.mesh.material = this.material;
        this.mesh.isPickable = false;
        this.contextMesh = MeshBuilder.CreateGround('context-water', { width: 40, height: 50 }, scene);
        this.contextMesh.position.z = 12;
        this.contextMesh.material = this.material;
        this.contextMesh.setEnabled(false);
        for(const surface of [this.mesh,this.contextMesh]){
            surface.onBeforeRenderObservable.add(()=>{this.surfaceStarted=performance.now();});
            surface.onAfterRenderObservable.add(()=>{
                const now=performance.now();this.surfaceSubmissionCpuMs=now-this.surfaceStarted;this.fpsFrames++;
                if(now-this.fpsStart>=1000){this.renderedFPS=this.fpsFrames*1000/(now-this.fpsStart);this.fpsFrames=0;this.fpsStart=now;}
            });
        }
        this.simple = new StandardMaterial('water-comparison-simple', scene);
        this.simple.diffuseColor = Color3.FromHexString('#304c42');
        this.simple.specularColor = Color3.FromHexString('#182a24');
        const mat = new StandardMaterial('water-contact', scene);
        mat.disableLighting = true;
        mat.emissiveColor = Color3.FromHexString('#b7c7a6');
        mat.alpha = .22;
        mat.backFaceCulling = false;
        for (let n = 0; n < 28; n++) {
            const mesh = MeshBuilder.CreateTorus('water-contact-' + n, { diameter: 1, thickness: .016, tessellation: 28 }, scene);
            mesh.material = mat.clone('water-contact-mat-' + n);
            mesh.setEnabled(false);
            this.effects.push({ mesh });
        }
        for (let n = 0; n < 48; n++) {
            const mesh = MeshBuilder.CreateSphere('water-drop-' + n, { diameter: .045, segments: 4 }, scene);
            mesh.material = mat;
            mesh.setEnabled(false);
            this.effects.push({ mesh, drop: n });
        }
        // Couronne d’éclaboussure : cylindre ouvert translucide, quelques dixièmes de seconde, jamais de mousse permanente.
        const crownMat = new StandardMaterial('water-splash-crown', scene);
        crownMat.disableLighting = true; crownMat.emissiveColor = Color3.FromHexString('#d6e2da'); crownMat.alpha = 0; crownMat.backFaceCulling = false;
        for (let n = 0; n < 6; n++) {
            const mesh = MeshBuilder.CreateCylinder('water-splash-' + n, { height: 1, diameterTop: 1.35, diameterBottom: .7, tessellation: 18, cap: Mesh.NO_CAP }, scene);
            // Opacité par sommet : base dense au contact de l’eau, bord supérieur dissipé (gerbe, pas un bol).
            const pos = mesh.getVerticesData('position')!, cols: number[] = [];
            for (let i = 0; i < pos.length; i += 3) cols.push(1, 1, 1, pos[i + 1] > 0 ? 0 : 1);
            mesh.setVerticesData('color', cols, false, 4); mesh.hasVertexAlpha = true; mesh.useVertexColors = true;
            mesh.material = crownMat.clone('water-splash-mat-' + n); mesh.isPickable = false; mesh.setEnabled(false);
            this.crowns.push({ mesh });
        }
    }
    setQuality(q: WaterQuality) { if (this.quality === q && this.mirror) {
        this.refresh();
        return;
    } this.quality = q; this.material.setFloat("fineDetail", q === "high" ? 1 : q === "standard" ? .8 : .45); this.effects.forEach((e, n) => { if (n >= WATER_PROFILES[q].rings && n < 28 || n >= 28 + WATER_PROFILES[q].drops) {
        e.event = undefined;
        e.mesh.setEnabled(false);
    } }); const p = WATER_PROFILES[q]; this.mirror?.dispose(); this.mirror = undefined; this.material.setTexture('reflection', this.depthTexture); this.material.setFloat('mirrorOn', 0); if (p.mirror) {
        this.mirror = new MirrorTexture('pond-selective-reflection', p.mirror, this.scene, true, 0, Texture.TRILINEAR_SAMPLINGMODE);
        this.mirror.mirrorPlane = new Plane(0, -1, 0, -.01);
        this.mirror.renderList = this.reflectionList();
        this.mirror.refreshRate = p.cadence;
        this.mirror.onBeforeRenderObservable.add(() => { this.mirrorStarted = performance.now(); this.mirrorRenders++; });
        this.mirror.onAfterRenderObservable.add(() => { this.mirrorCpuMs = performance.now() - this.mirrorStarted; });
        this.scene.customRenderTargets.push(this.mirror);
        this.material.setTexture('reflection', this.mirror);
        this.material.setFloat('mirrorOn', 1);
    } this.effects.forEach(e => { if (!e.event)
        e.mesh.setEnabled(false); }); }
    private reflectionList() {
        const sky=this.scene.getMeshByName('sky-dome'),camera=this.scene.activeCamera;
        if(!camera)return sky?[sky]:[];
        const transform=Matrix.Reflection(new Plane(0,-1,0,-.01)).multiply(camera.getViewMatrix()).multiply(camera.getProjectionMatrix());
        const planes=Frustum.GetPlanes(transform);
        const meshes=this.reflectors.filter(m=>{
            if(m.isDisposed()||!m.isEnabled())return false;
            m.computeWorldMatrix(true);return m.isInFrustum(planes);
        });
        // Priorité à la taille apparente (rayon / distance) : la rive opposée boisée, qui domine le reflet,
        // passe avant les petits objets proches ; les instances d’arbres partagent leur lot de rendu.
        const size=(m:AbstractMesh)=>{const b=m.getBoundingInfo().boundingSphere;return b.radiusWorld/Math.max(1,Vector3.Distance(b.centerWorld,camera.position));};
        meshes.sort((a,b)=>size(b)-size(a));
        return [...(sky?[sky]:[]),...meshes].slice(0,60);
    }
    setTurbidity(value: number) { this.turbidity = boundedTurbidity(value); this.material.setFloat("turbidity", this.turbidity); }
    refresh() { if (this.mirror) {
        this.mirror.renderList = this.reflectionList();
        this.mirror.resetRefreshCounter();
    } }
    setContext(enabled: boolean, depth = 2) { this.context = enabled; this.mesh.setEnabled(!enabled); this.contextMesh.setEnabled(enabled); this.material.setFloat('contextDepth', enabled ? depth : 0); this.clearEffects(); this.refresh(); }
    compare(simple: boolean) { this.mesh.material = simple ? this.simple : this.material; }
    trigger(e: WaterEvent) { if (!this.context && !inPond(e.position))
        return; this.counts[e.type] = (this.counts[e.type] ?? 0) + 1; if (e.type === 'spot_transition') {
        this.clearEffects();
        this.refresh();
        return;
    } if (e.type === 'wind_change')
        return; const p = WATER_PROFILES[this.quality], rings = this.effects.slice(0, p.rings), empty = rings.find(f => !f.event || this.now - f.event.time > 2.4), slot = empty ?? rings.filter(f => !f.event?.essential).sort((a, b) => (a.event?.time ?? 0) - (b.event?.time ?? 0))[0] ?? rings.sort((a, b) => (a.event?.time ?? 0) - (b.event?.time ?? 0))[0]; slot.event = e; slot.mesh.position.set(e.position.x, .025, e.position.z); slot.mesh.rotation.y = e.direction; if (['cast_impact', 'feeder_impact', 'groundbait_impact', 'fish_surface_break', 'fish_dive', 'net_exit', 'fish_release'].includes(e.type))
        for (const f of this.effects.slice(28, 28 + Math.min(p.drops, Math.ceil(surfaceStrength(e) * 6))))
            if (!f.event || this.now - f.event.time > .65)
                f.event = e; if (SPLASH_TYPES.includes(e.type) && surfaceStrength(e) > .12) { const pool = this.crowns.slice(0, p.crowns), free = pool.find(c => !c.event || this.now - c.event.time > .5) ?? pool.sort((a, b) => (a.event?.time ?? 0) - (b.event?.time ?? 0))[0]; if (free) { free.event = e; free.mesh.position.set(e.position.x, 0, e.position.z); } } this.onEvent?.(e); }
    demo(type: WaterType, position: Vector3, seed = 127) { this.trigger({ id: this.debugId--, type, time: this.now, position: { x: position.x, y: 0, z: position.z }, intensity: .4, source: 'visual_test', direction: 0, essential: true, seed }); }
    update(time: number, eye: Vector3, events: WaterEvent[], wind = 0) { this.now = time; this.material.setFloat('time', time); this.material.setVector3('eye', eye); this.material.setFloat('wind', wind); for (const e of events)
        if (e.id > this.lastId) {
            this.lastId = e.id;
            this.trigger(e);
        } const p = WATER_PROFILES[this.quality]; for (const f of this.effects) {
        const age = f.event ? time - f.event.time : 99, drop = f.drop !== undefined, enabled = !!f.event && age >= 0 && age < (drop ? .65 : 2.4) && (!drop || f.drop! < p.drops);
        f.mesh.setEnabled(enabled);
        if (!enabled) {
            f.event = undefined;
            continue;
        }
        const e = f.event!;
        if (drop) {
            const n = f.drop!, angle = n * 2.399 + e.seed * .001;
            f.mesh.position.set(e.position.x + Math.cos(angle) * age * .45, e.position.y + .03 + Math.sin(age / .65 * Math.PI) * (.08 + e.intensity * .3), e.position.z + Math.sin(angle) * age * .45);
        }
        else {
            f.mesh.scaling.set(.15 + age * (.3 + e.intensity), 1, .15 + age * (.3 + e.intensity));
            // Ride lisible mais sobre : opacité proportionnelle à la perturbation réelle, extinction douce.
            (f.mesh.material as StandardMaterial).alpha = Math.pow(1 - age / 2.4, 1.6) * Math.min(.38, surfaceStrength(e) * .7);
        }
    } for (let n = 0; n < this.crowns.length; n++) {
        const c = this.crowns[n], age = c.event ? time - c.event.time : 99, on = !!c.event && age >= 0 && age < .45 && n < p.crowns;
        c.mesh.setEnabled(on);
        if (!on) { c.event = undefined; continue; }
        const k = age / .45, s = surfaceStrength(c.event!), r = (.18 + .5 * s) * (.6 + k);
        c.mesh.scaling.set(r, (.06 + .3 * s) * Math.sin(Math.min(1, k * 1.4) * Math.PI), r);
        c.mesh.position.y = c.mesh.scaling.y / 2 - .01;
        (c.mesh.material as StandardMaterial).alpha = (1 - k) * Math.min(.32, .12 + s * .4);
    } this.uploadWaves(); }
    private uploadWaves() {
        this.waves.fill(0);this.motions.fill(0);this.selectedEvents.length=0;
        for(const f of this.effects)if(f.drop===undefined&&f.event&&this.now-f.event.time>=0&&this.now-f.event.time<2.4&&surfaceStrength(f.event)>.01)this.selectedEvents.push(f.event);
        this.selectedEvents.sort((a,b)=>Number(b.essential)-Number(a.essential)||b.time-a.time);
        this.activeWaves=Math.min(SURFACE_WAVES,this.selectedEvents.length);
        for(let i=0;i<this.activeWaves;i++){
            const e=this.selectedEvents[i],at=i*4;
            this.waves[at]=e.position.x;this.waves[at+1]=e.position.z;this.waves[at+2]=this.now-e.time;this.waves[at+3]=surfaceStrength(e);
            this.motions[at]=Math.sin(e.direction);this.motions[at+1]=Math.cos(e.direction);this.motions[at+3]=isWake(e.type)?1:0;
        }
        this.material.setFloat('waveCount',this.activeWaves);this.material.setArray4('waves',this.waves);this.material.setArray4('waveMotion',this.motions);
    }
    clearEffects() { this.activeWaves = 0; this.material.setFloat("waveCount", 0); this.crowns.forEach(c => { c.event = undefined; c.mesh.setEnabled(false); }); this.effects.forEach(e => { e.event = undefined; e.mesh.setEnabled(false); }); }
    diagnostics() { return { renderedFPS:this.renderedFPS,turbidity: this.turbidity, activeSurfaceWaves: this.activeWaves, surfaceCapacity: SURFACE_WAVES, normalTexture: 128, depthTexture: 256, reflectionRenders: this.mirrorRenders, reflectionObjects:this.mirror?.renderList?.length??0,surfaceSubmissionCpuMs:this.surfaceSubmissionCpuMs,reflectionCpuMs: this.mirrorCpuMs, reflectionPasses: this.mirror ? 1 : 0, quality: this.quality, activeRings: this.effects.filter(f => f.drop === undefined && !!f.event).length, activeDrops: this.effects.filter(f => f.drop !== undefined && !!f.event).length, activeCrowns: this.crowns.filter(c => !!c.event).length, capacity: WATER_PROFILES[this.quality], events: { ...this.counts }, lastId: this.lastId, mirror: this.mirror?.getSize(), surfaceLevel: 0 }; }
}
