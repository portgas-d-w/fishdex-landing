import { pickSpecies } from './catalog.ts';
import type { BaitId, Species, SpotId } from './catalog.ts';
import { inspectTarget } from './casting.ts';
import type { WaterPoint } from './casting.ts';
import { uniqueId } from './specimens.ts';
import type { MethodId, Specimen } from './specimens.ts';

export type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fighting' | 'caught' | 'lost';
export interface Catch { speciesId: Species['id']; length: number; date: string; id?: string; coloration?: Specimen['coloration']; mirage?: boolean; method?: MethodId; equipment?: string; bait?: BaitId; target?: WaterPoint; controlled?: boolean }
export class FishingGame {
  phase: Phase = 'idle';
  spot: SpotId = 'reeds';
  bait: BaitId = 'worm';
  elapsed = 0;
  tension = 0.25;
  progress = 0;
  pulling = false;
  target: WaterPoint = { x: -1.5, z: 7 };
  fishPosition = { x: -1.5, y: -0.7, z: 7 };
  rodYaw = 0;
  rodLift = 0.5;
  direction = 0;
  distance = 8;
  equipmentPower = 1;
  equipment = 'starter';
  method: MethodId = 'float';
  retrieveProgress = 0;
  private waitingActivity = 0;
  private lureAnimation = 0;
  appearance: Pick<Specimen, 'coloration' | 'mirage'> = { coloration: 'natural', mirage: false };
  private size = 20;
  private controlled = true;
  reeling = false;
  failure = '';
  result: Catch | null = null;
  fish: Species | null = null;
  private waitDuration = 4;
  private slackTime = 0;
  private highTensionTime = 0;
  private random: () => number;
  constructor(random: () => number = Math.random) { this.random = random; }

  setSpot(spot: SpotId) { if (this.phase === 'idle') this.spot = spot; }
  setBait(bait: BaitId) { if (this.phase === 'idle') { this.bait = bait; if (bait === 'lure') this.method = 'lure'; else if (this.method === 'lure') this.method = 'float'; } }
  get fishLength() { return this.size; }
  orient(yaw: number, lift: number) {
    this.lureAnimation = Math.min(1, this.lureAnimation + Math.abs(yaw - this.rodYaw) + Math.abs(lift - this.rodLift));
    this.rodYaw = Math.max(-1, Math.min(1, yaw)); this.rodLift = Math.max(0, Math.min(1, lift));
  }
  setMethod(method: MethodId) { if (this.phase !== 'idle') return; this.method = method; this.bait = method === 'lure' ? 'lure' : 'worm'; }
  cast(point?: WaterPoint) {
    if (this.phase !== 'idle') return false;
    const aim = inspectTarget(point ?? { x: this.spot === 'reeds' ? -1.5 : this.spot === 'willow' ? 3 : 0, z: this.spot === 'open' ? 14 : 7 });
    if (!aim.valid) { this.failure = aim.reason; return false; }
    this.target = { ...aim.point }; this.spot = aim.habitat;
    this.distance = Math.hypot(aim.point.x, aim.point.z + 1);
    this.fishPosition = { ...aim.point, y: -aim.depth * 0.5 };
    this.result = null;
    this.fish = pickSpecies(this.spot, this.bait, this.random(), this.method);
    this.size = Math.round((this.fish.min + Math.pow(this.random(), 1.6) * (this.fish.max - this.fish.min)) * 10) / 10;
    this.controlled = true;
    this.retrieveProgress = 0; this.waitingActivity = 0; this.lureAnimation = 0;
    this.appearance = { coloration: this.random() > 0.96 ? 'golden' : 'natural', mirage: this.random() > 0.995 };
    this.waitDuration = 3 + this.random() * 4;
    this.transition('casting');
    return true;
  }
  strike() {
    if (this.phase !== 'bite') return;
    if (this.method === 'lure') { this.target = { x: this.fishPosition.x, z: Math.max(1.5, this.fishPosition.z) }; this.distance = Math.hypot(this.target.x, this.target.z + 1); }
    this.tension = 0.32; this.progress = 0; this.slackTime = 0; this.highTensionTime = 0;
    this.rodYaw = 0; this.rodLift = 0.5;
    this.transition('fighting');
  }
  reset() {
    this.transition('idle'); this.result = null; this.fish = null;
    this.tension = 0.25; this.progress = 0; this.pulling = false; this.failure = '';
  }
  release() { this.reeling = false; }
  private transition(phase: Phase) { this.phase = phase; this.elapsed = 0; this.reeling = false; }
  private lose(reason: string) { this.failure = reason; this.transition('lost'); }
  update(delta: number) {
    // Simulation fixed step in the caller; large gaps never consume a bite or break the line.
    const dt = Math.min(Math.max(delta, 0), 0.05);
    this.elapsed += dt;
    if (this.phase === 'casting' && this.elapsed >= 1.1) this.transition('waiting');
    else if (this.phase === 'waiting') {
      this.lureAnimation = Math.max(0, this.lureAnimation - dt * 0.5);
      this.waitingActivity += this.method === 'lure' ? this.reeling ? dt * (0.50 + this.lureAnimation) : 0 : dt * (this.method === 'bottom' ? 0.75 : 1);
      if (this.method === 'lure' && this.reeling) {
        this.retrieveProgress = Math.min(1, this.retrieveProgress + dt * 0.035);
        this.fishPosition.x = this.target.x * (1 - this.retrieveProgress); this.fishPosition.z = this.target.z * (1 - this.retrieveProgress);
      }
      if (this.waitingActivity >= this.waitDuration) this.transition('bite');
      else if (this.retrieveProgress >= 1) this.reset();
    }
    else if (this.phase === 'bite' && this.elapsed >= 4.5) this.lose('Il a relâché l’appât. La prochaine touche sera la bonne.');
    else if (this.phase === 'fighting' && this.fish) {
      const cycle = this.fish.id === 'perch' ? 3.6 : ['carp', 'catfish', 'tench'].includes(this.fish.id) ? 6.2 : this.fish.id === 'pike' ? 4.2 : this.fish.id === 'zander' ? 5.4 : 4.8;
      this.pulling = this.elapsed % cycle > cycle * 0.60;
      const sizeFactor = 0.85 + (this.size - this.fish.min) / (this.fish.max - this.fish.min) * 0.3;
      const force = this.fish.strength * Math.max(0.75, Math.min(1.15, sizeFactor));
      this.direction = Math.sin(this.elapsed * (this.fish.id === 'pike' ? 1.2 : 0.65)) * 0.65;
      const alignment = 1 - Math.min(1, Math.abs(this.rodYaw - this.direction));
      const damping = (0.8 + this.rodLift * 0.4) * this.equipmentPower;
      this.tension += (this.reeling ? (this.pulling ? 0.44 * force / damping : 0.12 * force) : -0.40) * dt;
      this.tension += (this.pulling ? (1 - alignment) * 0.10 - this.rodLift * 0.045 : 0) * dt;
      this.tension = Math.min(1, Math.max(0, this.tension));
      if (this.tension > 0.92 || this.slackTime > 1) this.controlled = false;
      const gain = (this.pulling ? 0.012 : 0.12 / force) * (0.7 + alignment * 0.6) * this.equipmentPower;
      this.progress = Math.min(1, Math.max(0, this.progress + (this.reeling ? gain : -0.012) * dt));
      const remaining = this.distance * (1 - this.progress) + 1.8;
      this.fishPosition.x = this.target.x * (1 - this.progress) + this.direction * Math.min(2, remaining * 0.2);
      this.fishPosition.z = -1 + Math.sqrt(Math.max(0, remaining ** 2 - this.fishPosition.x ** 2));
      this.fishPosition.y = -Math.min(1.6, Math.max(0.10, remaining * 0.10)) - (this.pulling ? 0.2 : 0);
      this.highTensionTime = this.tension >= 0.97 ? this.highTensionTime + dt : Math.max(0, this.highTensionTime - dt);
      this.slackTime = this.tension < 0.025 ? this.slackTime + dt : 0;
      if (this.highTensionTime > 0.8) this.lose('Le fil a cassé. Relâche le moulinet quand le poisson tire.');
      else if (this.slackTime > 4) this.lose('Le poisson s’est décroché. Garde un peu de tension dans le fil.');
      else if (this.elapsed > 90) this.lose('Le poisson a trouvé refuge. Essaie de mouliner entre ses départs.');
      else if (remaining <= 1.81 && this.tension > 0.04 && this.tension < 0.94) {
        this.result = { id: uniqueId(), speciesId: this.fish.id, length: Math.max(this.fish.min, Math.min(this.fish.max, this.size)), date: new Date().toISOString(), ...this.appearance, method: this.method, equipment: this.equipment, bait: this.bait, target: { ...this.target }, controlled: this.controlled };
        this.transition('caught');
      }
    }
  }
}
