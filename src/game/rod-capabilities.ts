import type {RigConfig} from './rig.ts';import {component} from './rig.ts';
export interface RodCapabilities {reelInterface:boolean;sections:boolean;length:number;manualLine:boolean;elastic:boolean;controller:'fixed'|'kit'|'reel'|'manual'}
export function rodCapabilities(id:string,c:RigConfig):RodCapabilities {
 const fixed=['pole-starter','pole-elastic','long-pole'].includes(id)||c.method==='pole',sections=id==='long-pole'&&fixed,manualLine=!fixed&&['fly-rod','bolo-rod'].includes(id)&&['mouche','nymphe_fil','toc'].includes(c.technique??'');
 const reelInterface=!fixed&&component(c.components.reel??'')?.slot==='reel';
 return {reelInterface,sections,length:sections?12:fixed?6.4:4.6,manualLine,elastic:fixed&&component(c.components.elastic??'')?.slot==='elastic',controller:sections?'kit':fixed?'fixed':manualLine?'manual':'reel'};
}
