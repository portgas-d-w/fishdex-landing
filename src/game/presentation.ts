import {descentFactor} from './rig-layout.ts';
import {component,type RigConfig} from './rig.ts';
import {techniqueFor,TECHNIQUE_CONFIG} from './techniques.ts';
import type {WaterPoint} from './casting.ts';

const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export const offeredComponent=(c:RigConfig)=>component(c.components.fly??c.components.lure??c.components.bait??'');
// Parameters describe prototype geometry and controls. They are not catch probabilities
// supplied by manufacturers. See docs/RECHERCHE_TECHNIQUES_V2.md for source boundaries.
export function recipeMechanics(c:RigConfig) {
  const id=c.recipe??'',r=component(c.components.weight??c.components.feeder??c.components.jig_head??c.components.nail_weight??''),bait=offeredComponent(c);
  const sliding=['fond_coulissant','cheveu_coulissant','feeder_coulissant','feeder_potence','waggler_coulissant','carolina','texas'].includes(id);
  const separated=['fond_potence','feeder_potence','carolina','drop_shot','split_shot','tokyo'].includes(id);
  const antiTangle=['fond_anti_tangle','feeder_potence','feeder_helicoptere','carpe_helicoptere','combi','pva_solide','pva_filet'].includes(id);
  const shielded=['texas','spinnerbait','tokyo'].includes(id);
  const autoHook=['method_inline','method_elastique','carpe_inline','carpe_clip','d_rig','blowback','combi','chod','ronnie','surface_controleur'].includes(id);
  const terminalHeight=id==='drop_shot'?.55:id==='tokyo'?.25:id==='chod'?.2:id==='ronnie'?.12:['ned','neko'].includes(id)?.08:bait?.buoyancy==='float'&&c.components.hair?.15:bait?.buoyancy==='balanced'?.04:0;
  const sink=id==='weightless'||id==='wacky'?.14:id==='neko'?.34:id==='ned'?.42:id==='split_shot'?.3:id==='jig_trailer'?.55:.18+(r?.mass??bait?.mass??1)*(c.shots?.length??1)*.035;
  const pva=id==='pva_solide'?TECHNIQUE_CONFIG.pvaSolidDissolve:id==='pva_filet'?TECHNIQUE_CONFIG.pvaMeshDissolve:0;
  return {sliding,separated,antiTangle,shielded,autoHook,terminalHeight:bait?.buoyancy==='float'&&c.positions?.hair?c.positions.hair.metres:terminalHeight,sink:sink*descentFactor(c),pva,
    snagFactor:shielded?.35:separated?.7:1,tangleFactor:antiTangle?.15:separated?.45:1,
    // A bolting presentation still needs tension and an adequate terminal mass.
    boltMass:autoHook?(id==='surface_controleur'?(component(c.components.float??'')?.integrated??0)+2:r?.mass??0):0,
    hookReset:['d_rig','blowback','ronnie','combi'].includes(id),
    rotating:['feeder_helicoptere','carpe_helicoptere','cuiller'].includes(id),
    standUp:['ned','neko','tokyo'].includes(id)};
}
export interface PresentationState {
  point:WaterPoint;depth:number;retrieved:number;activity:number;contact:number;
  noise:number;animation:number;recentMotion:number;feederRemaining:number;pvaRemaining:number;
  branches:number[];tangled:boolean;boat:WaterPoint;boatHeading:number;flyEnergy:number;
  baitLife:number;terminalAngle:number;
}
export const initialPresentation=():PresentationState=>({point:{x:0,z:3.2},depth:0,retrieved:0,activity:0,contact:.2,noise:0,animation:0,recentMotion:0,feederRemaining:0,pvaRemaining:0,branches:[],tangled:false,boat:{x:0,z:0},boatHeading:0,flyEnergy:0,baitLife:1,terminalAngle:0});
export interface PresentationInput {dt:number;waterDepth:number;reelSpeed:number;lift:number;current:number;wind:number;restrained:boolean;boatSpeed:number;boatTurn:number;clonk:boolean}
export function stepPresentation(c:RigConfig,s:PresentationState,i:PresentationInput) {
  const t=techniqueFor(c),m=recipeMechanics(c),bait=offeredComponent(c),dt=clamp(i.dt,0,.05);
  s.noise=Math.max(0,s.noise-dt/TECHNIQUE_CONFIG.noiseDecay);
  s.animation=Math.max(0,s.animation-dt*.5);
  s.recentMotion=i.reelSpeed>0||s.animation>.015?1.8:Math.max(0,s.recentMotion-dt);
  s.contact=clamp(s.contact+dt*(i.reelSpeed*(m.sliding?.65:.8)+i.lift*.16-(m.sliding?.1:.08)*(1+(c.leaderLength??.6)*.15)-Math.abs(i.wind)*.06),0,1);
  const dissolving=s.pvaRemaining>0;
  s.pvaRemaining=Math.max(0,s.pvaRemaining-dt);
  s.feederRemaining=Math.max(0,s.feederRemaining-dt);
  if(dissolving&&s.pvaRemaining===0)s.feederRemaining=component(c.components.groundbait??'')?.diffusion??TECHNIQUE_CONFIG.feederDiffusion;
  // A fragile edible bait can be washed off by sustained vigorous animation.
  // It remains a single reserved portion: resolution consumes it exactly once.
  if(bait?.consumable!==false&&c.components.bait)s.baitLife=Math.max(0,s.baitLife-dt*(1-(bait?.retention??1))*s.animation*.2);
  if(m.rotating)s.terminalAngle+=dt*(i.reelSpeed*8+s.animation*3);
  else s.terminalAngle=m.standUp?-Math.PI/2:0;
  let desired=clamp(c.depth,0,i.waterDepth),speed=m.sink,activity=1;
  const moving=['retrieve','vertical','troll','fly'].includes(t.engine);
  if(t.engine==='fixed') {speed=(c.distribution==='spread'?.28:c.distribution==='touch'?.42:.65)*Math.max(.4,(component(c.components.weight??'')?.mass??1.7)/1.7)*descentFactor(c);}
  if(c.recipe==='waggler_coulissant')speed*=1.4;
  if(t.engine==='bottom'||t.engine==='feeder')desired=i.waterDepth-m.terminalHeight;
  if(t.engine==='surface'||c.recipe==='topwater'||c.recipe==='seche') {desired=.03;speed=.8;activity=Math.max(.08,1-s.noise);}
  if(t.engine==='drift') {desired=Math.min(c.depth,i.waterDepth-.08);speed*=c.distribution==='grouped'?1.4:.75;activity=clamp(.35+s.contact*.65,.1,1);}
  if(t.engine==='retrieve'||t.engine==='troll'||t.engine==='fly'&&c.recipe==='streamer') {
    desired=c.recipe==='topwater'? .03:c.recipe==='drop_shot'?i.waterDepth-m.terminalHeight:c.recipe==='weightless'||c.recipe==='wacky'?Math.min(i.waterDepth,2):Math.min(i.waterDepth,.6+(bait?.mass??5)*.12+(t.engine==='troll'?i.boatSpeed*1.2:0));
    if(['texas','carolina','split_shot','neko','ned','tokyo','jig_trailer','tete_plombee','mort_manie_monture'].includes(c.recipe??''))desired=Math.max(.03,i.waterDepth-m.terminalHeight-i.reelSpeed*.2);
    desired=Math.max(.03,desired-s.animation*.35);
    activity=i.reelSpeed>0?i.reelSpeed*(.5+s.animation):s.recentMotion>0&&(s.depth>.2||c.recipe==='topwater')?.28:0;
    if(t.engine==='troll')activity=Math.max(0,i.boatSpeed)*(.5+s.animation);
    if(t.engine==='retrieve'||t.engine==='fly') {const fraction=dt*i.reelSpeed*.035;s.retrieved=clamp(s.retrieved+fraction,0,1);s.point.x*=Math.max(0,1-fraction/Math.max(.01,1-s.retrieved+fraction));s.point.z*=Math.max(0,1-fraction/Math.max(.01,1-s.retrieved+fraction));}
  }
  if(t.engine==='fly'&&c.recipe!=='streamer'){desired=c.recipe==='seche'?.03:c.recipe==='noyee'?Math.min(c.depth,i.waterDepth*.65):Math.min(c.depth,i.waterDepth-.08);speed=component(c.components.fly_line??'')?.sinkSpeed??.12;activity=Math.max(.1,1-s.noise);}
  if(t.id==='bombette') {const carrier=component(c.components.bombette??'');desired=carrier?.buoyancy==='float'?Math.min(i.waterDepth,c.leaderLength??2.4):Math.min(c.depth,i.waterDepth);speed=carrier?.buoyancy==='float'?.12:.6;}
  if(t.engine==='vertical'||t.engine==='clonk'){desired=clamp(c.depth-i.lift*.45,.05,i.waterDepth);activity=t.engine==='clonk'?.35+(i.clonk?.9:0):s.animation>.015?.75:s.recentMotion>0?.25:0;speed=.8;}
  const floating=bait?.buoyancy==='float';
  if(floating&&!c.components.weight&&!c.components.jig_head&&!c.components.feeder&&!c.components.bombette)desired=.03;
  if(t.engine==='drift'||t.engine==='surface'||t.engine==='fly'&&c.recipe!=='streamer') {s.point.x+=dt*(i.current*(i.restrained?.12:1)+i.wind*(i.restrained?.15:.35));s.point.z+=dt*i.current*.08;}
  else if(t.engine==='fixed')s.point.x+=dt*i.wind*(i.restrained?.03:.12);
  if(t.engine==='troll'){s.boatHeading+=dt*i.boatTurn*.2;s.boat.x+=Math.sin(s.boatHeading)*i.boatSpeed*dt;s.boat.z+=Math.cos(s.boatHeading)*i.boatSpeed*dt;s.boat.x=clamp(s.boat.x,-6,6);s.boat.z=clamp(s.boat.z,0,14);if(s.boat.z>=14)s.boatHeading+=dt*.8;}
  s.depth=clamp(s.depth+clamp(desired-s.depth,-speed*dt,speed*dt),.03,i.waterDepth);
  s.branches=t.id==='gambe'?Array.from({length:c.branchCount??3},(_,n)=>clamp(s.depth-n*TECHNIQUE_CONFIG.branchSpacing,.03,i.waterDepth)):[];
  if(s.pvaRemaining>0||s.tangled||s.baitLife===0)activity=0;
  if((t.engine==='bottom'||t.engine==='feeder')&&s.contact<.35)activity*=.25;
  if(!moving&&t.engine!=='surface'&&t.engine!=='clonk')activity*=Math.max(.25,1-s.noise*.35);
  s.activity=Math.max(0,activity);
  return s;
}
export function strikeWindow(c:RigConfig) {const t=techniqueFor(c);return t.engine==='drift'?2.2:t.engine==='surface'?2.8:t.engine==='fly'&&c.recipe==='seche'?2.4:t.engine==='vertical'?3:4.5;}
