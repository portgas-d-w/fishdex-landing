import {inPond,pondDepth,pondToLocal} from './pond-map.ts';
import {WaterEvents} from './water-events.ts';
import { inspectPostTarget, worldPoint, postById, populationWeight, localSizeExponent, lineObstacle, ENCOUNTER_CONFIG, type PostId, type Microzone } from './posts.ts';
import type { Rights } from './progression.ts';
import { SPECIES,LEGACY_SPECIES } from './catalog.ts';
import { starterConfig, reserveRig, available, resolveRig, rigControl, weakestLink, component } from './rig.ts';
import type { RigConfig, Tackle, Outcome } from './rig.ts';
import { PROFILES, presentation, encounterWeight,techniqueEncounterWeight,activityWeight } from './profiles.ts';
import type { BaitId, Species, SpotId } from './catalog.ts';
import type { WaterPoint } from './casting.ts';
import { uniqueId } from './specimens.ts';
import {chooseAppearance,appearanceFor} from './fish-registry.ts';
import type { MethodId, Specimen } from './specimens.ts';
import { stepCombat,rodGeometry,COMBAT_CONFIG } from './combat.ts';
import {techniqueFor,techniqueContext,TECHNIQUE_CONFIG} from './techniques.ts';
import {initialPresentation,stepPresentation,recipeMechanics,offeredComponent,strikeWindow} from './presentation.ts';

export type Phase = 'idle' | 'casting' | 'waiting' | 'bite' | 'fighting' | 'landing' | 'caught' | 'lost';
export interface Catch { technique?:import('./techniques.ts').TechniqueId;recipe?:string;location?:string; speciesId: Species['id']; length: number; date: string; id?: string; coloration?: Specimen['coloration']; mirage?: boolean;appearanceId?:string;seed?:number; method?: MethodId; equipment?: string; bait?: BaitId; baitItem?: string; target?: WaterPoint; controlled?: boolean; post?:PostId; microzone?:Microzone }
export class FishingGame {
  readonly waterEvents=new WaterEvents();simulationTime=0;private releasedSpecimen='';
  testMode=false;accessBypass=false;testTarget?:WaterPoint;private forcedSnag=false;
  testEncounter(id:Species['id'],size:number,seed:number,direct=false){if(!this.testMode||this.phase!=='idle')return 'Scénario réservé au profil TEST au repos.';const fish=SPECIES.find(f=>f.id===id);if(!fish||fish.mode!=='capture'||!Number.isFinite(size)||!Number.isInteger(seed)||seed<0||seed>4294967295)return 'Individu invalide.';let value=seed>>>0;this.random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};if(!this.cast(this.testTarget??{x:0,z:Math.min(this.reach-1,this.method==='pole'?3.2:7)}))return this.failure;this.fish=fish;this.size=Math.max(fish.min,Math.min(fish.max,size));this.combatSeed=seed>>>0;this.individual=1;this.identifyFish();if(this.tackle?.active)this.tackle.active.used=true;this.transition('bite');if(direct)this.strike();return ''; }
  testFailure(outcome:Outcome){if(!this.testMode||!['waiting','bite','fighting'].includes(this.phase))return false;this.lose('Scénario TEST : '+outcome,outcome);return true;}
  testSnag(){if(!this.testMode||!['waiting','fighting','landing'].includes(this.phase))return false;this.forcedSnag=true;this.snagged=true;return true;}
  phase: Phase = 'idle';
  spot: SpotId = 'reeds';
  post:PostId='jetty'; rights?:Rights; microzone:Microzone='margin';
  combatMode:'manual'|'assisted'='manual'; retrievalSpeed=1.6; snagged=false; private snagTime=0; private snagClear=0;abrasion=0;
  private lurePause=0; private baiting?:{point:WaterPoint;remaining:number;portions:number};
  groundbaitPulse=0;
  get config(){return this.tackle?.config??this.rig;}
  get technique(){return techniqueFor(this.config);}
  get modern(){return !!this.config.technique;}
  get hasReel(){return this.modern?this.technique.reel:this.method!=='pole';}
  get reach(){return this.modern?this.technique.reach:this.method==='pole'?6.4:23;}
  get canAnimate(){return this.modern?['retrieve','vertical','clonk','drift','fly','bottom','feeder','surface','troll'].includes(this.technique.engine):this.method==='lure';}
  presentationState=initialPresentation();
  encounterState:'none'|'approach'|'examine'|'follow'|'attack'|'refuse'='none';private encounterTime=0;
  feederFilled=false;restrained=false;shortening=false;rodSections=12;flyEnergy=0;
  boatSpeed=0;boatTurn=0;clonkRemaining=0;private clonkAttraction=0;clonkPulse=0;
  testEnvironment?:{current:number;wind:number;time:'day'|'dusk'|'night'};
  get environment(){const p=postById(this.post);return this.testMode&&this.testEnvironment?this.testEnvironment:{current:p.current??0,wind:p.wind??0,time:'day' as const};}
  fillFeeder(){if(this.phase!=='idle'||!this.config.components.feeder||!this.config.components.groundbait)return false;this.feederFilled=true;return true;}
  prepareFly(){if(this.phase!=='idle'||this.technique.engine!=='fly')return false;this.flyEnergy=Math.min(1,this.flyEnergy+.34);return true;}
  clonk(){if(this.phase!=='waiting'||this.technique.engine!=='clonk'||this.clonkRemaining>0)return false;this.clonkRemaining=TECHNIQUE_CONFIG.clonkCooldown;this.clonkAttraction=8;this.clonkPulse++;this.waterEvents.emit(this,'ambient_surface',{x:0,z:1.5},.25);this.presentationState.noise=Math.max(.1,this.presentationState.noise-.25);return true;}
  setBoat(speed:number,turn:number){if(this.post!=='boat'||!Number.isFinite(speed)||!Number.isFinite(turn))return false;this.boatSpeed=Math.max(0,Math.min(1.8,speed));this.boatTurn=Math.max(-1,Math.min(1,turn));return true;}
  holdRestraint(active:boolean){this.restrained=active&&this.phase==='waiting';}
  holdSections(active:boolean){this.shortening=active&&['fighting','landing'].includes(this.phase)&&this.technique.sections;}
  get landingAction(){return this.size<=25?'Recevoir la petite prise':this.size>65?'Épuisette puis tapis':'Recevoir à l’épuisette';}
  receive(){if(!this.netReady||this.netLift<COMBAT_CONFIG.netLift){this.failure=this.size>(component(this.rig.components.landing??'')?.capacity??120)?'Épuisette trop petite : adaptez la réception.':'Placez la réception sous le poisson, puis relevez-la par un geste court.';return false;}this.waterEvents.emit(this,'net_capture',this.netPosition,.3);this.waterEvents.emit(this,'net_exit',this.netPosition,.15,false);this.finishCatch();return true;}
  releaseCaughtFish(){if(this.phase!=='caught'||!this.result||this.releasedSpecimen===this.result.id)return false;this.releasedSpecimen=this.result.id??this.specimenId;this.waterEvents.emit(this,'fish_release',this.netPosition,.25);return true;}
  get hint(){return this.snagged?'Ligne accrochée : baissez la canne, orientez-la à l’opposé et dégagez.':this.modern&&this.phase==='waiting'&&this.presentationState.baitLife===0?'L’esche fragile a quitté l’hameçon. Ramenez et regarnissez le montage.':this.phase==='waiting'&&this.waitingActivity>12&&!this.fish?'Pas d’activité ici : ajustez profondeur, présentation ou microzone.':'';}
  inspect(point:WaterPoint){const at=inspectPostTarget(this.post,point,this.method,this.reach);if(this.modern&&!techniqueContext(this.technique.id,postById(this.post).context??'pond'))return {...at,valid:false,reason:'Cette pratique demande un autre milieu : '+this.technique.context.join(', ')+'.'};if(Math.hypot(point.x,point.z+1)>this.reach)return {...at,valid:false,reason:'Présentation hors de portée de cet ensemble.'};return at;}
  setPost(id:PostId){if(this.phase!=='idle'||!postById(id).implemented||!this.accessBypass&&this.rights&&!this.rights.posts.includes(id))return false;this.post=id;this.target={x:0,z:3.2};this.baiting=undefined;this.presentationState=initialPresentation();this.boatSpeed=0;this.feederFilled=false;this.flyEnergy=0;this.waterEvents.transition(this);return true;}
  sounding?:{point:WaterPoint;depth:number;microzone:Microzone};
  survey(point:WaterPoint){if(!['waiting','idle'].includes(this.phase))return false;const at=this.inspect(point);if(!at.valid){this.failure=at.reason;return false;}this.sounding={point:{...point},depth:at.depth,microzone:at.microzone};return true;}
  get groundbaitPoint(){return this.baiting?.point??this.target;}
  get groundbaitRemaining(){return Math.max(0,this.baiting?.remaining??0);}
  groundbait(point:WaterPoint=this.target,portions=1,id=this.config.components.groundbait??'kit2:groundbait'){if(!['pole','float','bottom'].includes(this.method)||!['waiting','idle'].includes(this.phase)||!Number.isSafeInteger(portions)||portions<1||portions>3)return false;const at=this.inspect(point),item=component(id);if(!at.valid||!item||item.slot!=='groundbait'||!item.methods.includes(this.method)||item.techniques&&!item.techniques.includes(this.technique.id)){this.failure=at.reason||'Amorce incompatible.';return false;}if(!item.free){if(!this.tackle||available(this.tackle,id)<portions){this.failure='Pas assez de portions libres dans le sac.';return false;}if(!this.tackle.unlimitedStock)this.tackle.stock[id]-=portions;}this.baiting={point:{...point},remaining:ENCOUNTER_CONFIG.groundbaitSeconds,portions};this.groundbaitPulse++;this.waterEvents.emit(this,'groundbait_impact',point,.2+.12*portions);return true;}
  tryFreeSnag(){if(!this.snagged||this.rodLift>.35||Math.abs(this.rodYaw-this.direction)<.45)return false;this.forcedSnag=false;this.snagged=false;this.snagTime=0;this.snagClear=4;return true;}
  bait: BaitId = 'worm';
  elapsed = 0;
  tension = 0.25;
  progress = 0;
  pulling = false;
  target: WaterPoint = { x: -1.5, z: 7 };
  fishPosition = { x: -1.5, y: -0.7, z: 7 };
  desiredYaw=0;desiredLift=.5;
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
  private motion: 'burst' | 'cruise' | 'return' | 'rest' = 'cruise';
  private combatVelocity={x:0,z:0}; poleRetreat=0; detachedSections=0;elasticExtension=0; netPosition={x:.7,z:1};netHeading=0;netLift=0;
  get rodLength(){return this.hasReel?4.6:this.rodSections;}
  get rodGeometry(){return rodGeometry(this.rodYaw,this.rodLift,this.rodLength,this.poleRetreat,this.tension,this.fishPosition);}
  get lineEntry(){const tip=this.rodGeometry.tip,fish=this.fishPosition,t=Math.max(0,Math.min(1,tip.y/Math.max(.001,tip.y-fish.y)));return {x:tip.x+(fish.x-tip.x)*t,z:tip.z+(fish.z-tip.z)*t};}
  get receptionReach(){return this.size<=25?2.8:COMBAT_CONFIG.netReach;}
  get canReceive(){return !!this.fish&&['fighting','landing'].includes(this.phase)&&this.fishDistance<=this.receptionReach+1&&(!this.technique.sections||this.rodSections<=COMBAT_CONFIG.kitLength+.1);}
  beginLanding(){if(!this.canReceive)return false;this.netLift=0;this.transition('landing');return true;}
  leaveLanding(){if(this.phase!=='landing')return false;this.netLift=0;this.transition('fighting');return true;}
  placeNet(x:number,z:number){if(this.phase!=='landing'||!Number.isFinite(x)||!Number.isFinite(z))return false;const dx=x-this.netPosition.x,dz=z-this.netPosition.z;if(Math.hypot(dx,dz)>.03)this.netHeading=Math.atan2(dx,dz);this.netPosition={x:Math.max(-2.8,Math.min(2.8,x)),z:Math.max(.15,Math.min(this.receptionReach,z))};this.netLift=0;return true;}
  get netReady(){const speed=Math.hypot(this.combatVelocity.x,this.combatVelocity.z),alignment=speed<.25?1:Math.abs((Math.sin(this.netHeading)*this.combatVelocity.x+Math.cos(this.netHeading)*this.combatVelocity.z)/speed);return alignment>.15&&this.fishPosition.y>-.7&&!this.pulling&&this.phase==='landing'&&this.size<=(component(this.rig.components.landing??'')?.capacity??120)&&Math.hypot(this.fishPosition.x-this.netPosition.x,this.fishPosition.z-this.netPosition.z)<COMBAT_CONFIG.netRadius&&this.tension<.95&&this.tension>.025&&(!this.technique.sections||this.rodSections<=COMBAT_CONFIG.kitLength+.1)&&Math.abs(this.fishVelocity)<(this.size>65?.8:2.3);}
  liftNet(amount:number){if(!this.netReady||!Number.isFinite(amount)||amount<=0)return false;this.netLift=Math.min(.6,this.netLift+amount);return this.netLift>=COMBAT_CONFIG.netLift?this.receive():false;}
  movePole(metres:number){if(!this.technique.sections||!['fighting','landing'].includes(this.phase)||!Number.isFinite(metres))return false;this.poleRetreat=Math.max(0,Math.min(COMBAT_CONFIG.maxRetreat,this.poleRetreat+Math.max(-.32,Math.min(.32,metres))));return true;}
  get canDetach(){return this.technique.sections&&this.rodSections>COMBAT_CONFIG.kitLength+.1&&this.poleRetreat>=COMBAT_CONFIG.sectionLength-.01;}
  detachPole(reattach=false){if(!this.technique.sections||!['fighting','landing'].includes(this.phase))return false;if(reattach){if(!this.detachedSections||this.poleRetreat+COMBAT_CONFIG.sectionLength>COMBAT_CONFIG.maxRetreat)return false;this.rodSections+=COMBAT_CONFIG.sectionLength;this.poleRetreat+=COMBAT_CONFIG.sectionLength;this.detachedSections--;}else{if(!this.canDetach)return false;const removed=Math.min(COMBAT_CONFIG.sectionLength,this.rodSections-COMBAT_CONFIG.kitLength);this.rodSections-=removed;this.poleRetreat-=removed;this.detachedSections++;}return true;}
  testCombatScenario(kind:'departure'|'return'|'quiet'|'obstacle'){if(!this.testMode||!['fighting','landing'].includes(this.phase))return false;this.motion=kind==='departure'?'burst':kind==='return'?'return':kind==='quiet'?'rest':'cruise';this.eventRemaining=5;const cover=postById(this.post).obstacles[0];this.coverTarget=kind==='obstacle'&&cover?{x:cover.x,z:cover.z}:undefined;this.bearingTarget=kind==='obstacle'&&cover?Math.atan2(cover.x-this.fishPosition.x,cover.z-this.fishPosition.z):.25;return kind!=='obstacle'||!!cover;}
  private bearingTarget = 0;private coverTarget?:WaterPoint;
  private engagedRig?: string;
  private encounterBudget = 0;
  retrieveProgress = 0;
  private waitingActivity = 0;
  private lureAnimation = 0;
  appearance: Pick<Specimen, 'coloration' | 'mirage'|'appearanceId'> = { coloration: 'natural', mirage: false };
  specimenId='';specimenSeed=127;testAppearance?:string;
  private identifyFish(){if(!this.fish)return;if(!LEGACY_SPECIES.some(s=>s.id===this.fish!.id))this.appearance={coloration:'natural',mirage:false};this.specimenId=uniqueId();this.specimenSeed=this.combatSeed;const appearanceId=this.testMode&&this.testAppearance!==undefined?this.testAppearance==='natural'?undefined:appearanceFor(this.fish.id,this.testAppearance)?.id:chooseAppearance(this.fish.id,this.post,this.random);if(this.testMode&&this.testAppearance==='natural')this.appearance={coloration:'natural',mirage:false};if(appearanceId)this.appearance={coloration:'natural',mirage:false,appearanceId};}
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
    if(!active){this.heldReeling=false;this.queuedTurns=0;this.reelSpeed=0;return;}
    this.heldReeling = this.hasReel && (this.phase === 'fighting' || this.phase === 'waiting' && this.canAnimate);
  }
  reel(turns: number) {
    if (!this.hasReel || !Number.isFinite(turns) || turns <= 0 || !(this.phase === 'fighting' || this.phase === 'waiting' && this.canAnimate)) return;
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
  setBait(bait: BaitId) { if (this.phase === 'idle') {const method=bait==='lure'?'lure':this.method==='lure'?'float':this.method;if(this.rights&&!this.rights.methods.includes(method))return;this.bait = bait;this.method=method; } }
  get fishLength() { return this.size; }
  orient(yaw: number, lift: number) {
    if(this.modern&&this.phase==='idle'&&this.technique.engine==='fly')this.flyEnergy=Math.min(1,this.flyEnergy+Math.abs(lift-this.desiredLift)*.7);
    if(this.modern&&this.phase==='waiting'){const motion=Math.abs(yaw-this.desiredYaw)+Math.abs(lift-this.desiredLift);this.presentationState.animation=Math.min(1,this.presentationState.animation+motion);if(this.technique.engine==='surface')this.presentationState.noise=Math.min(1,this.presentationState.noise+motion*.15);}
    this.lureAnimation = Math.min(1, this.lureAnimation + Math.abs(yaw - this.desiredYaw) + Math.abs(lift - this.desiredLift));
    this.desiredYaw=Math.max(-1,Math.min(1,yaw));this.desiredLift=Math.max(0,Math.min(1,lift));
  }
  setMethod(method: MethodId) { if (this.phase !== 'idle'||this.rights&&!this.rights.methods.includes(method)) return; if(method==='pole')this.equipment='pole-starter';else if(this.method==='pole')this.equipment='starter'; this.method = method; this.bait = method === 'lure' ? 'lure' : 'worm'; }
  cast(point?: WaterPoint) {
    if (this.phase !== 'idle') return false;
    if(!this.accessBypass&&this.rights&&(!this.rights.methods.includes(this.method)||this.modern&&!this.rights.techniques?.includes(this.technique.id))){this.failure='Pratique non ouverte.';return false;}
    if(this.modern&&this.technique.engine==='feeder'&&!this.feederFilled){this.failure='Remplissez le feeder avant ce lancer.';return false;}
    if(this.modern&&this.technique.engine==='fly'&&this.flyEnergy<.6){this.failure='Préparez la soie par un aller-retour avant de projeter.';return false;}
    const aim = this.inspect(point ?? (this.method==='pole'?{x:0,z:3.2}:{ x: this.spot === 'reeds' ? -1.5 : this.spot === 'willow' ? 3 : 0, z: this.spot === 'open' ? 14 : 7 }));
    if (!aim.valid) { this.failure = aim.reason; return false; }
    if(this.modern&&this.technique.engine==='fly'&&Math.hypot(aim.point.x,aim.point.z+1)>this.reach*(.5+.5*this.flyEnergy)){this.failure='Préparez davantage de soie pour cette distance.';return false;}
    if(!this.hasReel)this.desiredLift=.18;
    this.target = { ...aim.point }; this.spot = aim.habitat;
    this.distance = Math.hypot(aim.point.x, aim.point.z + 1);
    this.fishPosition = { ...aim.point, y: -aim.depth * 0.5 };
    this.result = null;this.specimenId='';
    this.rig = structuredClone(this.tackle?.config ?? starterConfig(this.method));
    this.rig.method = this.method;
    if (this.tackle) { const id = uniqueId(); const errors = reserveRig(this.tackle, id, this.equipment); if(errors.length) { this.failure=errors.join(' '); return false; } this.engagedRig=id; }
    this.waterDepth=aim.depth;this.microzone=aim.microzone; this.presentationDepth=0; this.fish=null;this.snagged=false;this.snagTime=0;this.snagClear=0;this.abrasion=0;this.lurePause=0;
    this.encounterBudget = -Math.log(Math.max(.001,1-this.random()));
    this.individual=.9+this.random()*.2; this.combatSeed=(this.random()*4294967296)>>>0;this.eventRemaining=0;
    this.controlled = true;
    this.retrieveProgress = 0; this.waitingActivity = 0; this.lureAnimation = 0;
    this.appearance = { coloration: this.random() > 0.96 ? 'golden' : 'natural', mirage: this.random() > 0.995 };
    this.waitDuration = 3 + this.random() * 4;
    this.encounterState='none';this.encounterTime=0;this.rodSections=this.reach;
    if(this.modern){const m=recipeMechanics(this.rig);this.presentationState=initialPresentation();this.presentationState.point={...aim.point};this.presentationState.flyEnergy=this.flyEnergy;this.presentationState.noise=this.technique.engine==='surface'?(this.technique.id==='stalking'?.18:.3):.1;this.presentationState.pvaRemaining=m.pva;this.presentationState.feederRemaining=this.feederFilled?component(this.rig.components.feeder??'')?.diffusion??TECHNIQUE_CONFIG.feederDiffusion:0;this.presentationState.tangled=!m.antiTangle&&Math.abs(this.rodYaw)>.8&&this.random()<.12*m.tangleFactor;this.flyEnergy=0;this.feederFilled=false;}
    this.transition('casting');
    return true;
  }
  get deposition(){return this.modern&&(!this.hasReel||['vertical','clonk'].includes(this.technique.engine));}
  get castDuration(){return this.deposition?.7:1.1;}
  strike() {
    if (this.phase !== 'bite') return;
    if(!this.specimenId)this.identifyFish();
    if (this.method === 'lure') { this.target = { x: this.fishPosition.x, z: Math.max(1.5, this.fishPosition.z) }; this.distance = Math.hypot(this.target.x, this.target.z + 1); }
    this.tension = 0.32; this.progress = 0; this.slackTime = 0; this.highTensionTime = 0;
    this.rodYaw=this.desiredYaw;this.rodLift=this.desiredLift;
this.poleRetreat=0;this.detachedSections=0;this.rodSections=this.hasReel?4.6:this.reach;this.combatVelocity={x:0,z:0};this.netLift=0;this.netPosition={x:.7,z:1};
    this.fishPosition.y=-Math.min(1.2,Math.max(.35,this.presentationDepth*.3));this.fishDistance=Math.hypot(this.fishPosition.x,this.fishPosition.z+1);
    const tip=this.rodGeometry.tip;this.lineLength=Math.max(.35,Math.hypot(this.fishPosition.x-tip.x,this.fishPosition.y-tip.y,this.fishPosition.z-tip.z)-.15);
    this.fatigue = 0; this.slack = 0; this.dragSpeed = 0; this.fishVelocity = 0; this.returning = false;
    this.transition('fighting');
  }
  reset() {
    this.forcedSnag=false;this.feederFilled=false;this.flyEnergy=0;this.encounterState='none';this.presentationState=initialPresentation();this.boatSpeed=0;this.resolve('return'); this.transition('idle'); this.result = null; this.fish = null;
    this.tension = 0.25; this.progress = 0; this.pulling = false; this.failure = '';
    this.dragSpeed = 0; this.fatigue = 0; this.slack = 0;this.abrasion=0;
  }
  release() { this.restrained=false;this.shortening=false;this.heldReeling = false; this.queuedTurns = 0; this.reelSpeed = 0; }
  private transition(phase: Phase) { this.phase = phase; this.elapsed = 0; this.release(); }
  private resolve(outcome:Outcome) { if(this.tackle && this.engagedRig) resolveRig(this.tackle,this.engagedRig,outcome,Math.max(this.distance,this.lineLength)); }
  private lose(reason: string, outcome:Outcome='unhook') { this.resolve(outcome); this.failure = reason; this.transition('lost'); }
  update(delta:number){let remaining=Math.min(Math.max(delta,0),COMBAT_CONFIG.maxGap);while(remaining>1e-8){const dt=Math.min(remaining,COMBAT_CONFIG.step);this.updateStep(dt);remaining-=dt;}}
  private updateStep(delta: number) {
    // Simulation fixed step in the caller; large gaps never consume a bite or break the line.
    const dt = Math.min(Math.max(delta, 0), 0.05);this.simulationTime+=dt;
    const smoothing=1-Math.exp(-dt*28);this.rodYaw+=(this.desiredYaw-this.rodYaw)*smoothing;this.rodLift+=(this.desiredLift-this.rodLift)*smoothing;
    const pulse = Math.min(this.queuedTurns, dt * 2.4);
    const turns = this.heldReeling ? Math.max(pulse, dt * this.retrievalSpeed) : pulse;
    this.queuedTurns -= pulse; this.reelSpeed = dt > 0 ? turns / dt : 0;
    this.elapsed += dt;this.clonkRemaining=Math.max(0,this.clonkRemaining-dt);this.clonkAttraction=Math.max(0,this.clonkAttraction-dt);this.snagClear=Math.max(0,this.snagClear-dt);if(this.baiting)this.baiting.remaining-=dt;
    if(['waiting','fighting','landing'].includes(this.phase)){this.snagged=this.forcedSnag||this.snagClear<=0&&!!lineObstacle(this.post,['fighting','landing'].includes(this.phase)?this.fishPosition:this.method==='lure'?this.fishPosition:this.target,['fighting','landing'].includes(this.phase)?this.lineEntry:undefined);this.snagTime=this.snagged?this.snagTime+dt:Math.max(0,this.snagTime-dt);this.abrasion=Math.max(0,this.abrasion+(this.snagged&&['fighting','landing'].includes(this.phase)?this.tension*COMBAT_CONFIG.abrasionRate:-COMBAT_CONFIG.abrasionRecovery)*dt);if(this.abrasion>1){this.lose('Abrasion prolongée contre un obstacle : rupture du segment le plus fragile.',weakestLink(this.rig));return;}if(this.snagTime>COMBAT_CONFIG.snagSeconds/(this.modern?recipeMechanics(this.rig).snagFactor:1)){this.lose('La ligne a rompu dans les herbiers. Dégagez-la en baissant la canne et en changeant son angle.',weakestLink(this.rig));return;}}
    if (this.phase === 'casting' && this.elapsed >= this.castDuration) {if(this.tackle?.active)this.tackle.active.used=true;this.transition('waiting');}
    else if(this.phase==='waiting'&&this.modern)this.updatePresentation(dt);
    else if (this.phase === 'waiting') {
      this.lureAnimation = Math.max(0, this.lureAnimation - dt * 0.5);
      this.lurePause=this.reelSpeed>0?1.8:Math.max(0,this.lurePause-dt);
      const lureActivity=this.reelSpeed>0?this.reelSpeed*(.5+this.lureAnimation):this.lurePause>0&&this.presentationDepth>.3?.28:0;
      this.waitingActivity += this.method === 'lure' ? dt * lureActivity : dt * (this.method === 'bottom' ? 0.75 : 1);
      if (this.method === 'lure' && this.reelSpeed > 0) {
        this.retrieveProgress = Math.min(1, this.retrieveProgress + dt * this.reelSpeed * 0.035);
        this.fishPosition.x = this.target.x * (1 - this.retrieveProgress); this.fishPosition.z = this.target.z * (1 - this.retrieveProgress);
      }
      const at=this.inspect(this.method==='lure'?{x:this.fishPosition.x,z:this.fishPosition.z}:this.target);this.microzone=at.microzone;
      this.waterDepth=at.depth;
      const shown=presentation(this.rig,this.waterDepth);
      if(this.method==='lure'){const desired=this.reelSpeed>0?Math.min(this.waterDepth,shown.depth+this.reelSpeed*.18-this.lureAnimation*.35):this.waterDepth;this.presentationDepth=Math.max(.05,Math.min(desired,this.presentationDepth+dt*(.18+(component(this.rig.components.lure??'')?.mass??5)*.035)));}else this.presentationDepth=Math.min(shown.depth,this.presentationDepth+dt*shown.sinkSpeed);
      this.fishPosition.y=-this.presentationDepth;
      if(this.waitingActivity >= this.waitDuration) {
        const candidates=SPECIES.map(f=>({fish:f,weight:at.valid?encounterWeight(f.id,at.habitat,this.rig,this.waterDepth,this.presentationDepth)*populationWeight(this.post,f.id,at.microzone)*(this.baiting&&this.baiting.remaining>0&&this.method!=='lure'&&Math.hypot(this.target.x-this.baiting.point.x,this.target.z-this.baiting.point.z)<ENCOUNTER_CONFIG.groundbaitRadius?1+(this.baiting?.portions??1)*.4:1):0})).filter(f=>f.weight>0);
        const total=candidates.reduce((n,c)=>n+c.weight,0);
        // Taux de rencontre par seconde, cumulant l'activité (leurre immobile : aucun événement).
        const activity=this.method==='lure'?lureActivity:1;
        this.encounterBudget-=dt*Math.min(.9,total*ENCOUNTER_CONFIG.rate)*activity;
        if(total>0 && this.encounterBudget<=0) {
          let roll=this.random()*total;this.fish=candidates.at(-1)!.fish;
          for(const c of candidates) {roll-=c.weight;if(roll<=0){this.fish=c.fish;break;}}
          this.size=Math.round((this.fish.min+Math.pow(this.random(),localSizeExponent(this.post))*(this.fish.max-this.fish.min))*10)/10;this.identifyFish();this.transition('bite');
        }
      }
      if (this.phase==='waiting' && this.retrieveProgress >= 1) this.reset();
    }
    else if (this.phase === 'bite' && this.elapsed >= (this.modern?strikeWindow(this.rig):4.5)) this.lose('Il a relâché l’appât. La prochaine touche sera la bonne.');
    else if (['fighting','landing'].includes(this.phase) && this.fish) {
      const profile=PROFILES[this.fish.id].attributes;
      this.eventRemaining-=dt;
      if(this.eventRemaining<=0) {
        this.coverTarget=undefined;const roll=this.combatRandom(), burst=.16+profile.burst*.25, returning=.14+profile.slack_pressure*.2;
        this.motion=roll<burst*(1-this.fatigue*.55)?'burst':roll<burst+returning?'return':roll>.92-this.fatigue*.15?'rest':'cruise';
        this.eventRemaining=(1+this.combatRandom()*2)*(1+profile.endurance*.6);
        this.bearingTarget=(this.combatRandom()*2-1)*(.3+profile.agility*.5);
        const obstacles=postById(this.post).obstacles;
        if(obstacles.length&&this.combatRandom()<profile.cover_seeking*.35){const cover=obstacles.reduce((a,b)=>Math.hypot(a.x-this.fishPosition.x,a.z-this.fishPosition.z)<Math.hypot(b.x-this.fishPosition.x,b.z-this.fishPosition.z)?a:b);this.coverTarget={x:cover.x,z:cover.z};}
      }
      this.pulling=this.motion==='burst';this.returning=this.motion==='return';
      const sizeFactor=.68+(this.size-this.fish.min)/(this.fish.max-this.fish.min)*.5;
      const force=this.fish.strength*sizeFactor*this.individual*(this.pulling?.85+profile.burst*.3:1);
      this.direction+=(this.bearingTarget-this.direction)*Math.min(1,dt*(.6+profile.agility));
      this.direction=Math.max(-.9,Math.min(.9,this.direction+Math.sin(this.elapsed*(2+profile.head_shakes*3))*profile.head_shakes*.72*dt));
      const response=stepCombat({distance:this.fishDistance,lineLength:this.lineLength,tension:this.tension,fatigue:this.fatigue,position:this.fishPosition,velocity:this.combatVelocity},
       {yaw:this.rodYaw,lift:this.rodLift,bearing:this.direction,force,power:this.equipmentPower*rigControl(this.rig),reelSpeed:this.snagged?0:this.reelSpeed,motion:this.motion,endurance:profile.endurance,adapter:this.hasReel?'reel':'pole',elasticity:this.hasReel?.85:1.1*(component(this.rig.components.elastic??'')?.control??1),drag:this.rig.drag,rodLength:this.rodLength,retreat:this.poleRetreat,current:this.environment.current,reserve:45,escapeTarget:this.coverTarget},dt);
      this.alignment=response.alignment;this.tension=response.tension;this.fatigue=response.fatigue;this.fishDistance=response.distance;this.lineLength=response.lineLength;this.slack=response.slack;this.dragSpeed=response.dragSpeed;this.fishVelocity=response.radialVelocity;this.combatVelocity=response.velocity;this.fishPosition=response.position;if(!postById(this.post).context){const previous=worldPoint(this.post,{x:response.position.x-response.velocity.x*dt,z:response.position.z-response.velocity.z*dt}),next=worldPoint(this.post,response.position);if(!inPond(next)){const at=pondToLocal(this.post,previous);this.fishPosition.x=at.x;this.fishPosition.z=at.z;this.combatVelocity={x:0,z:0};}this.fishPosition.y=Math.max(-Math.max(.1,pondDepth(worldPoint(this.post,this.fishPosition))-.08),this.fishPosition.y);this.fishDistance=Math.hypot(this.fishPosition.x,this.fishPosition.z+1);}this.elasticExtension=response.elasticExtension;
      if(this.tension>.92||this.slackTime>1)this.controlled=false;
      this.progress=Math.max(0,Math.min(1,1-(this.fishDistance-1.8)/Math.max(1,this.distance)));
      if(this.phase==='landing'&&this.fishDistance>this.receptionReach+1.8)this.leaveLanding();
      this.highTensionTime = this.tension >= 0.97 ? this.highTensionTime + dt : Math.max(0, this.highTensionTime - dt);
      this.slackTime = this.tension < 0.025 ? this.slackTime + dt : Math.max(0, this.slackTime - dt * 0.7);
      if (this.highTensionTime > (this.fish.id==='pike' && this.rig.components.leader!=='tooth-leader' ? 1.9 : COMBAT_CONFIG.overloadSeconds)) this.lose('Rupture du ' + (weakestLink(this.rig)==='leader'?'bas de ligne':'fil principal') + '. Accompagnez le départ et baissez la canne.', weakestLink(this.rig));
      else if (this.slackTime > COMBAT_CONFIG.slackSeconds) this.lose('Le poisson s’est décroché. Garde un peu de tension dans le fil.');
      else if(this.lineLength>=44.99&&this.tension>1.15)this.failure='Réserve presque épuisée : accompagnez le départ.';
    }
    this.waterEvents.observe(this);
  }
  private finishCatch(){
    if(!this.fish)return;
    this.result={id:this.specimenId||uniqueId(),seed:this.specimenSeed,speciesId:this.fish.id,length:Math.max(this.fish.min,Math.min(this.fish.max,this.size)),date:new Date().toISOString(),...this.appearance,method:this.method,equipment:this.equipment,bait:this.bait,baitItem:offeredComponent(this.rig)?.id,post:this.post,microzone:this.microzone,target:{...this.target},controlled:this.controlled,...(this.modern?{technique:this.technique.id,recipe:this.rig.recipe,location:postById(this.post).name}:{})};
    this.resolve('catch');this.transition('caught');
    this.waterEvents.observe(this);
  }

  private updatePresentation(dt:number){
    const s=this.presentationState,t=this.technique,e=this.environment;
    const at=t.engine==='troll'?inspectPostTarget(this.post,{x:s.point.x+s.boat.x,z:s.point.z+s.boat.z},this.method):this.inspect(s.point);this.waterDepth=at.depth;this.microzone=at.microzone;
    stepPresentation(this.rig,s,{dt,waterDepth:this.waterDepth,reelSpeed:this.reelSpeed,lift:this.rodLift,current:e.current,wind:e.wind,restrained:this.restrained,boatSpeed:this.boatSpeed,boatTurn:this.boatTurn,clonk:this.clonkAttraction>0});
    this.presentationDepth=s.depth;this.retrieveProgress=s.retrieved;this.fishPosition={...s.point,y:-s.depth};this.waitingActivity+=dt*s.activity;
    if(this.encounterState!=='none'){
      this.encounterTime+=dt;
      if(this.encounterState==='refuse'&&this.encounterTime>1.5){if(recipeMechanics(this.rig).hookReset){s.contact=.2;s.animation=0;}this.fish=null;this.encounterState='none';this.encounterBudget=-Math.log(Math.max(.001,1-this.random()));return;}
      if(this.encounterState==='approach'&&this.encounterTime>1){this.encounterState='examine';this.encounterTime=0;}
      else if(this.encounterState==='examine'&&this.encounterTime>1){const refuse=!at.valid||s.tangled||s.noise>.6||s.activity<=0;this.encounterState=refuse?'refuse':['retrieve','troll','vertical'].includes(t.engine)?'follow':'attack';this.encounterTime=0;}
      else if(this.encounterState==='follow'&&this.encounterTime>.8){this.encounterState=s.activity>0?'attack':'refuse';this.encounterTime=0;}
      if(this.encounterState==='attack'){this.target={...s.point};this.distance=Math.hypot(s.point.x,s.point.z+1);this.transition('bite');const m=recipeMechanics(this.rig);if(m.autoHook&&m.boltMass>=2&&s.contact>=.35)this.strike();}
      return;
    }
    if(this.waitingActivity<this.waitDuration)return;
    const depths=s.branches.length?s.branches:[s.depth];
    const weights=SPECIES.map(f=>({fish:f,branch:0,weight:depths.reduce((best,depth)=>{const w=techniqueEncounterWeight(f.id,this.rig,this.waterDepth,depth,s.activity,s.noise,s.contact);if(w>best){return w;}return best;},0)*populationWeight(this.post,f.id,at.microzone)*(s.feederRemaining>0||this.baiting&&this.baiting.remaining>0&&Math.hypot(s.point.x-this.baiting.point.x,s.point.z-this.baiting.point.z)<ENCOUNTER_CONFIG.groundbaitRadius?1.4:1)*activityWeight(f.id,e.time)*(t.engine==='clonk'&&this.clonkAttraction>0?1.8:1)})).filter(c=>at.valid&&c.weight>0);
    const total=weights.reduce((n,c)=>n+c.weight,0);this.encounterBudget-=dt*Math.min(.9,total*ENCOUNTER_CONFIG.rate)*s.activity;
    if(total>0&&this.encounterBudget<=0){let roll=this.random()*total;this.fish=weights.at(-1)!.fish;for(const c of weights){roll-=c.weight;if(roll<=0){this.fish=c.fish;break;}}this.size=Math.round((this.fish.min+Math.pow(this.random(),localSizeExponent(this.post))*(this.fish.max-this.fish.min))*10)/10;
      if(s.branches.length&&this.tackle?.active){const branch=s.branches.findIndex(depth=>techniqueEncounterWeight(this.fish!.id,this.rig,this.waterDepth,depth,s.activity,s.noise,s.contact)>0);this.tackle.active.hookedBranch=Math.max(0,branch);}
      this.identifyFish();this.encounterState='approach';this.encounterTime=0;
    }
    if(s.retrieved>=1)this.reset();
  }

}
