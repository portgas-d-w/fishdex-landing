import { SPECIES } from './catalog.ts';
import { starterConfig, reserveRig, resolveRig, rigControl, weakestLink } from './rig.ts';
import type { RigConfig, Tackle, Outcome } from './rig.ts';
import { PROFILES, presentation, encounterWeight } from './profiles.ts';
import type { BaitId, Species, SpotId } from './catalog.ts';
import { inspectTarget } from './casting.ts';
import type { WaterPoint } from './casting.ts';
import { uniqueId } from './specimens.ts';
import type { MethodId, Specimen } from './specimens.ts';
import { stepCombat } from './combat.ts';

export type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fighting' | 'caught' | 'lost';
export interface Catch { speciesId: Species['id']; length: number; date: string; id?: string; coloration?: Specimen['coloration']; mirage?: boolean; method?: MethodId; equipment?: string; bait?: BaitId; baitItem?: string; target?: WaterPoint; controlled?: boolean }
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
  tackle?: Tackle;
  rig: RigConfig = starterConfig();
  presentationDepth = 0;
  waterDepth = 1.2;
  private individual = 1;
  private combatSeed = 0;
  private combatRandom() { this.combatSeed=(Math.imul(this.combatSeed,1664525)+1013904223)>>>0;return this.combatSeed/4294967296; }
  private eventRemaining = 0;
  private motion: 'burst' | 'cruise' | 'return' = 'cruise';
  private bearingTarget = 0;
  private engagedRig?: string;
  private encounterBudget = 0;
  retrieveProgress = 0;
  private waitingActivity = 0;
  private lureAnimation = 0;
  appearance: Pick<Specimen, 'coloration' | 'mirage'> = { coloration: 'natural', mirage: false };
  private size = 20;
  private controlled = true;
  private queuedTurns = 0;
  private heldReeling = false;
  reelSpeed = 0;
  alignment = 1;
  fishDistance = 8;
  lineLength = 8;
  fatigue = 0;
  slack = 0;
  dragSpeed = 0;
  fishVelocity = 0;
  returning = false;
  get reeling() { return this.heldReeling || this.queuedTurns > 0 || this.reelSpeed > 0; }
  holdReel(active: boolean) {
    if (!active) { this.release(); return; }
    this.heldReeling = this.phase === 'fighting' || this.phase === 'waiting' && this.method === 'lure';
  }
  reel(turns: number) {
    if (!Number.isFinite(turns) || turns <= 0 || !(this.phase === 'fighting' || this.phase === 'waiting' && this.method === 'lure')) return;
    this.queuedTurns = Math.min(0.45, this.queuedTurns + turns);
  }
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
    this.rig = structuredClone(this.tackle?.config ?? starterConfig(this.method));
    this.rig.method = this.method;
    if (this.tackle) { const id = uniqueId(); const errors = reserveRig(this.tackle, id, this.equipment); if(errors.length) { this.failure=errors.join(' '); return false; } this.engagedRig=id; }
    this.waterDepth=aim.depth; this.presentationDepth=0; this.fish=null;
    this.encounterBudget = -Math.log(Math.max(.001,1-this.random()));
    this.individual=.9+this.random()*.2; this.combatSeed=(this.random()*4294967296)>>>0;this.eventRemaining=0;
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
    this.fishDistance = this.distance + 1.8;
    this.lineLength = this.fishDistance + 0.5 * 0.85 - 0.32 * 0.85;
    this.fatigue = 0; this.slack = 0; this.dragSpeed = 0; this.fishVelocity = 0; this.returning = false;
    this.transition('fighting');
  }
  reset() {
    this.resolve('return'); this.transition('idle'); this.result = null; this.fish = null;
    this.tension = 0.25; this.progress = 0; this.pulling = false; this.failure = '';
    this.dragSpeed = 0; this.fatigue = 0; this.slack = 0;
  }
  release() { this.heldReeling = false; this.queuedTurns = 0; this.reelSpeed = 0; }
  private transition(phase: Phase) { this.phase = phase; this.elapsed = 0; this.release(); }
  private resolve(outcome:Outcome) { if(this.tackle && this.engagedRig) resolveRig(this.tackle,this.engagedRig,outcome,Math.max(this.distance,this.lineLength)); }
  private lose(reason: string, outcome:Outcome='unhook') { this.resolve(outcome); this.failure = reason; this.transition('lost'); }
  update(delta: number) {
    // Simulation fixed step in the caller; large gaps never consume a bite or break the line.
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const pulse = Math.min(this.queuedTurns, dt * 2.4);
    const turns = this.heldReeling ? Math.max(pulse, dt * 1.6) : pulse;
    this.queuedTurns -= pulse; this.reelSpeed = dt > 0 ? turns / dt : 0;
    this.elapsed += dt;
    if (this.phase === 'casting' && this.elapsed >= 1.1) this.transition('waiting');
    else if (this.phase === 'waiting') {
      this.lureAnimation = Math.max(0, this.lureAnimation - dt * 0.5);
      this.waitingActivity += this.method === 'lure' ? dt * this.reelSpeed * (0.50 + this.lureAnimation) : dt * (this.method === 'bottom' ? 0.75 : 1);
      if (this.method === 'lure' && this.reelSpeed > 0) {
        this.retrieveProgress = Math.min(1, this.retrieveProgress + dt * this.reelSpeed * 0.035);
        this.fishPosition.x = this.target.x * (1 - this.retrieveProgress); this.fishPosition.z = this.target.z * (1 - this.retrieveProgress);
      }
      const at=this.method==='lure'?inspectTarget({x:this.fishPosition.x,z:this.fishPosition.z}):inspectTarget(this.target);
      this.waterDepth=at.depth;
      const shown=presentation(this.rig,this.waterDepth);
      this.presentationDepth=Math.min(shown.depth,this.presentationDepth+dt*shown.sinkSpeed);
      this.fishPosition.y=-this.presentationDepth;
      if(this.waitingActivity >= this.waitDuration) {
        const candidates=SPECIES.map(f=>({fish:f,weight:at.valid?encounterWeight(f.id,at.habitat,this.rig,this.waterDepth,this.presentationDepth):0})).filter(f=>f.weight>0);
        const total=candidates.reduce((n,c)=>n+c.weight,0);
        // Taux de rencontre par seconde, cumulant l'activité (leurre immobile : aucun événement).
        const activity=this.method==='lure'?this.reelSpeed*(.5+this.lureAnimation):1;
        this.encounterBudget-=dt*Math.min(.9,total*.16)*activity;
        if(total>0 && this.encounterBudget<=0) {
          let roll=this.random()*total;this.fish=candidates.at(-1)!.fish;
          for(const c of candidates) {roll-=c.weight;if(roll<=0){this.fish=c.fish;break;}}
          this.size=Math.round((this.fish.min+Math.pow(this.random(),1.6)*(this.fish.max-this.fish.min))*10)/10;this.transition('bite');
        }
      }
      if (this.phase==='waiting' && this.retrieveProgress >= 1) this.reset();
    }
    else if (this.phase === 'bite' && this.elapsed >= 4.5) this.lose('Il a relâché l’appât. La prochaine touche sera la bonne.');
    else if (this.phase === 'fighting' && this.fish) {
      const profile=PROFILES[this.fish.id].attributes;
      this.eventRemaining-=dt;
      if(this.eventRemaining<=0) {
        const roll=this.combatRandom(), burst=.16+profile.burst*.25, returning=.14+profile.slack_pressure*.2;
        this.motion=roll<burst?'burst':roll<burst+returning?'return':'cruise';
        this.eventRemaining=(1+this.combatRandom()*2)*(1+profile.endurance*.6);
        this.bearingTarget=(this.combatRandom()*2-1)*(.3+profile.agility*.5);
        if(this.spot!=='open' && this.combatRandom()<profile.cover_seeking*.35) this.bearingTarget=this.spot==='willow'?.8:-.8;
      }
      this.pulling=this.motion==='burst';this.returning=this.motion==='return';
      const sizeFactor=.68+(this.size-this.fish.min)/(this.fish.max-this.fish.min)*.5;
      const force=this.fish.strength*sizeFactor*this.individual*(this.pulling?.85+profile.burst*.3:1);
      this.direction+=(this.bearingTarget-this.direction)*Math.min(1,dt*(.6+profile.agility));
      this.direction=Math.max(-.9,Math.min(.9,this.direction+Math.sin(this.elapsed*(2+profile.head_shakes*3))*profile.head_shakes*.012));
      const response = stepCombat({ distance: this.fishDistance, lineLength: this.lineLength, tension: this.tension, fatigue: this.fatigue },
        { yaw: this.rodYaw, lift: this.rodLift, bearing: this.direction, force, power: this.equipmentPower * rigControl(this.rig), reelSpeed: this.reelSpeed, motion: this.motion, endurance: profile.endurance }, dt);
      this.alignment = response.alignment;
      this.tension = response.tension; this.fatigue = response.fatigue;
      this.fishDistance = response.distance; this.lineLength = response.lineLength;
      this.slack = response.slack; this.dragSpeed = response.dragSpeed; this.fishVelocity = response.velocity;
      if (this.tension > 0.92 || this.slackTime > 1) this.controlled = false;
      this.progress = Math.min(1, Math.max(0, 1 - (this.fishDistance - 1.8) / this.distance));
      const remaining = this.fishDistance;
      this.fishPosition.x = this.target.x * (1 - this.progress) * 0.25 + this.direction * remaining * 0.40;
      this.fishPosition.z = -1 + Math.sqrt(Math.max(0, remaining ** 2 - this.fishPosition.x ** 2));
      this.fishPosition.y = -Math.min(1.6, Math.max(0.10, remaining * 0.10)) - (this.pulling ? 0.2 : 0);
      this.highTensionTime = this.tension >= 0.97 ? this.highTensionTime + dt : Math.max(0, this.highTensionTime - dt);
      this.slackTime = this.tension < 0.025 ? this.slackTime + dt : Math.max(0, this.slackTime - dt * 0.7);
      if (this.highTensionTime > (this.fish.id==='pike' && this.rig.components.leader!=='tooth-leader' ? .65 : .8)) this.lose('Rupture du ' + (weakestLink(this.rig)==='leader'?'bas de ligne':'fil principal') + '. Accompagnez le départ et baissez la canne.', weakestLink(this.rig));
      else if (this.slackTime > 4) this.lose('Le poisson s’est décroché. Garde un peu de tension dans le fil.');
      else if (remaining > 45) this.lose('Le poisson a trouvé refuge. Ligne détachée ; suivez le fil avec la canne.', this.rig.components.attachment==='lead-clip'?'lead_release':weakestLink(this.rig));
      else if (remaining <= 1.81 && this.tension > 0.08 && this.tension < 0.94) {
        this.result = { id: uniqueId(), speciesId: this.fish.id, length: Math.max(this.fish.min, Math.min(this.fish.max, this.size)), date: new Date().toISOString(), ...this.appearance, method: this.method, equipment: this.equipment, bait: this.bait, baitItem:this.rig.components[this.method==='lure'?'lure':'bait'], target: { ...this.target }, controlled: this.controlled };
        this.resolve('catch'); this.transition('caught');
      }
    }
  }
}
