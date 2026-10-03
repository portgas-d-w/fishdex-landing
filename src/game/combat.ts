/** Géométrie en mètres ; charge normalisée (une unité = résistance nominale du kit).
 * La masse du poisson n'est pas une tension. Coefficients de prototype centralisés. */
export const COMBAT_CONFIG={version:3,step:1/120,maxGap:.05,stiffness:1.15,waterDamping:2.4,traction:1.6,retrievePerTurn:.85,brakeRate:9,overloadSeconds:2.3,slackSeconds:5,snagSeconds:3,abrasionRate:.8,abrasionRecovery:.12,sectionLength:1.6,kitLength:2.4,maxRetreat:2.6,retreatSpeed:1.3,netReach:3.5,netRadius:.9,netLift:.26};
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export interface Point3 {x:number;y:number;z:number}
export function rodGeometry(yaw:number,lift:number,length=4.6,retreat=0,tension=0,fish?:Point3){
 const pitch=.12+clamp(lift,0,1)*.9,angle=clamp(yaw,-1,1)*.72;
 const axis={x:Math.sin(angle)*Math.cos(pitch),y:Math.sin(pitch),z:Math.cos(angle)*Math.cos(pitch)};
 const base={x:.4-axis.x*retreat,y:.8-axis.y*retreat,z:-5.7-axis.z*retreat};
 const tip={x:base.x+axis.x*length,y:base.y+axis.y*length,z:base.z+axis.z*length};
 if(fish&&tension>0){const dx=fish.x-tip.x,dy=fish.y-tip.y,dz=fish.z-tip.z,d=Math.hypot(dx,dy,dz)||1,bend=Math.min(.85,tension*.65);tip.x+=dx/d*bend;tip.y+=dy/d*bend;tip.z+=dz/d*bend;}
 return {base,tip,axis,length};
}
export interface CombatState {distance:number;lineLength:number;tension:number;fatigue:number;position?:Point3;velocity?:{x:number;z:number}}
export interface CombatInput {yaw:number;lift:number;bearing:number;force:number;power:number;reelSpeed:number;motion:'burst'|'cruise'|'return'|'rest';endurance?:number;adapter?:'pole'|'reel';assisted?:boolean;elasticity?:number;drag?:number;sectionPull?:number;rodLength?:number;retreat?:number;reserve?:number;current?:number;escapeTarget?:{x:number;z:number}}
// Ancien export de diagnostic, jamais un contrôleur de direction.
export function fishBearing(time:number,strength:number){return clamp(Math.sin(time*.48+strength)*.78,-.9,.9);}
function stepCombatOnce(state:CombatState,input:CombatInput,delta:number){
 const dt=clamp(delta,0,COMBAT_CONFIG.step),pole=input.adapter==='pole',power=Math.max(.3,input.power),force=Math.max(.15,input.force);
 const position=state.position??{x:Math.sin(input.bearing)*state.distance*.4,y:-.6,z:-1+Math.cos(input.bearing*.4)*state.distance};
 const rod=rodGeometry(input.yaw,input.lift,input.rodLength??(pole?6.4:4.6),input.retreat??0,state.tension,position);
 const dx=position.x-rod.tip.x,dy=position.y-rod.tip.y,dz=position.z-rod.tip.z,span=Math.hypot(dx,dy,dz),ux=dx/Math.max(.001,span),uz=dz/Math.max(.001,span);
 const compliance=Math.max(.45,(input.elasticity??.85)),slack=Math.max(0,state.lineLength-span);
 let lineLength=state.lineLength;
 const initialLoad=Math.max(0,span-lineLength)*COMBAT_CONFIG.stiffness/compliance;
 // Le moulinet retire d'abord le mou. Sous charge sa récupération ralentit/stalle ;
 // aucune pénalité pour le bouton lui-même, aucune action sur l'orientation.
 const retrieve=pole?0:Math.max(0,input.reelSpeed)*COMBAT_CONFIG.retrievePerTurn*power*(slack>.01?1:clamp(1-initialLoad/(power*.95),0,1));
 lineLength=Math.max(.35,lineLength-retrieve*dt);
 const brakeThreshold=.3+clamp(input.drag??.5,.1,.9)*.72;
 const preBrake=Math.max(0,span-lineLength)*COMBAT_CONFIG.stiffness/compliance;
 const dragSpeed=pole?0:Math.max(0,preBrake-brakeThreshold)*COMBAT_CONFIG.brakeRate;
 const paid=Math.min(dragSpeed*dt,Math.max(0,(input.reserve??60)-lineLength));lineLength+=paid;
 const load=clamp(Math.max(0,span-lineLength)*COMBAT_CONFIG.stiffness/compliance,0,1.5);
 const tension=span<=lineLength?0:load;
 const distance=Math.hypot(position.x,position.z+1),rx=position.x/Math.max(.1,distance),rz=(position.z+1)/Math.max(.1,distance);
 const capacity=force*(1-clamp(state.fatigue,0,1)*.8);
 const radial=input.motion==='burst'?1.35:input.motion==='return'?-.6:input.motion==='rest'?0:.25;
 const side=input.motion==='rest'?0:Math.sin(input.bearing)*.8;
 const aim=input.escapeTarget&&['burst','cruise'].includes(input.motion)?input.escapeTarget:undefined,ad=aim?Math.max(.1,Math.hypot(aim.x-position.x,aim.z-position.z)):1;
 const swimming=aim?{x:capacity*(aim.x-position.x)/ad+(input.current??0)*.18,z:capacity*(aim.z-position.z)/ad}:{x:capacity*(rx*radial+rz*side)+(input.current??0)*.18,z:capacity*(rz*radial-rx*side)};
 const pull=tension*power*COMBAT_CONFIG.traction;
 const targetVelocity={x:swimming.x-ux*pull,z:swimming.z-uz*pull};
 const old=state.velocity??{x:0,z:0},smooth=1-Math.exp(-COMBAT_CONFIG.waterDamping*dt);
 const velocity={x:old.x+(targetVelocity.x-old.x)*smooth,z:old.z+(targetVelocity.z-old.z)*smooth};
 const nextPosition={x:clamp(position.x+velocity.x*dt,-18,18),y:clamp(position.y+(pull*Math.max(0,-dy/Math.max(.1,span))*.22-(input.motion==='burst'?.035:0))*dt,-2.5,-.08),z:Math.max(.12,position.z+velocity.z*dt)};
 // Effort du poisson contre la traction + nage, sans bonus 'doigt du bon côté'.
 const effort=Math.hypot(swimming.x,swimming.z);const work=(effort*(.003+tension*.06))/(.65+(input.endurance??.5)*.85);
 const recovery=input.motion==='rest'&&tension<.08?.003:0;
 const fatigue=clamp(state.fatigue+(work-recovery)*dt,0,1);
 return {distance:Math.hypot(nextPosition.x,nextPosition.z+1),lineLength,tension,fatigue,position:nextPosition,velocity,
  alignment:clamp(Math.abs(ux*rx+uz*rz),.05,1),relativeForce:capacity/power,dragSpeed:dt?paid/dt:0,slack:Math.max(0,lineLength-span),span,rod,effort,elasticExtension:pole?load*compliance/COMBAT_CONFIG.stiffness:0,radialVelocity:velocity.x*rx+velocity.z*rz,retrieved:retrieve};
}

export function stepCombat(state:CombatState,input:CombatInput,delta:number){let remaining=clamp(delta,0,COMBAT_CONFIG.maxGap),next=stepCombatOnce(state,input,Math.min(remaining,COMBAT_CONFIG.step));remaining-=Math.min(remaining,COMBAT_CONFIG.step);while(remaining>1e-8){const dt=Math.min(remaining,COMBAT_CONFIG.step);next=stepCombatOnce(next,input,dt);remaining-=dt;}return next;}
