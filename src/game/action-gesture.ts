/** Interprétation verrouillée sur l'axe initial ; aucune conséquence de jeu ici. */
export class ActionGesture {
 axis:'pending'|'vertical'|'horizontal'='pending';private previousY:number;private previousTime:number;done=false;
 readonly x:number;readonly y:number;readonly time:number;readonly kind:'pole'|'net';readonly liftEligible:boolean;
 constructor(x:number,y:number,time:number,kind:'pole'|'net',liftEligible=false){this.x=x;this.y=y;this.time=time;this.kind=kind;this.liftEligible=liftEligible;this.previousY=y;this.previousTime=time;}
 move(x:number,y:number,time:number){const dx=x-this.x,dy=y-this.y,wasPending=this.axis==='pending';if(this.axis==='pending'&&Math.hypot(dx,dy)>=9)this.axis=Math.abs(dx)>Math.abs(dy)?'horizontal':'vertical';const dt=Math.max(0,Math.min(.08,(time-this.previousTime)/1000));const retreat=Math.max(-1.3*dt,Math.min(1.3*dt,(y-this.previousY)*.025));const lifted=Math.max(0,wasPending?-dy:this.previousY-y)*.016;this.previousY=y;this.previousTime=time;const detach=!this.done&&this.axis==='horizontal'&&Math.abs(dx)>24;if(detach)this.done=true;return {dx,dy,retreat,detach,reattach:dx<0,lift:this.kind==='net'&&this.liftEligible&&this.axis==='vertical'?lifted:0};}
}
