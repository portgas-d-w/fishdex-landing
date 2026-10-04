import type {ScreenHooks} from './structure';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
export function installTechniqueControls(h:ScreenHooks){
 document.querySelector('.scene-controls')!.insertAdjacentHTML('beforeend',`<div class="technique-tools" id="technique-tools" hidden><button class="compact" id="tech-prep" hidden></button><button class="compact" id="tech-hold" hidden></button><button class="compact" id="tech-clonk" hidden>Série de clonk</button><button class="compact" id="tech-land" hidden>Recevoir</button><details id="tech-settings" hidden><summary>Réglages en pêche</summary><label id="tech-depth-wrap" hidden>Couche (m)<input id="tech-depth" type="range" min="0.2" max="18" step="0.2" value="6"></label><label id="tech-drag-wrap" hidden>Frein<input id="tech-drag" type="range" min="0.1" max="0.9" step="0.1" value="0.5"></label><label id="tech-speed-wrap" hidden>Vitesse bateau<select id="tech-speed"><option value="0">Arrêt</option><option value="0.6">Lente</option><option value="1.2">Croisière</option><option value="1.8">Rapide</option></select></label><label id="tech-course-wrap" hidden>Parcours<select id="tech-course"><option value="0">Droit</option><option value="-1">Courbe à gauche</option><option value="1">Courbe à droite</option></select></label></details></div>`);
 const g=h.game,hold=el('tech-hold');let pointer:number|undefined;
 const stop=()=>{g.holdRestraint(false);g.holdSections(false);const id=pointer;pointer=undefined;if(id!==undefined&&hold.hasPointerCapture(id))hold.releasePointerCapture(id);};
 hold.addEventListener('pointerdown',e=>{if(h.isPaused?.()||e.button!==0||pointer!==undefined)return;pointer=e.pointerId;hold.setPointerCapture(e.pointerId);if(g.phase==='waiting')g.holdRestraint(true);else g.holdSections(true);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])hold.addEventListener(type,stop);
 for(const type of ['blur','pagehide'])window.addEventListener(type,stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 el('tech-prep').onclick=()=>h.toast(g.technique.engine==='feeder'?(g.fillFeeder()?'Feeder garni pour le prochain lancer.':'Préparation impossible.'):(g.prepareFly()?`Soie préparée à ${Math.round(g.flyEnergy*100)} % ; projetez après deux gestes.`:'Préparation impossible.'));
 el('tech-clonk').onclick=()=>h.toast(g.clonk()?'Courte série ; attendez une éventuelle réaction.':`Pause sonore : ${Math.ceil(g.clonkRemaining)} secondes.`);
 el('tech-land').onclick=()=>{if(g.phase==='landing'){g.leaveLanding();}else if(!g.beginLanding())h.toast('Guidez la prise à portée avant de préparer la réception.');};
 document.addEventListener('fishing-input-reset',stop);el('tech-drag').insertAdjacentHTML('afterend','<output id=drag-value></output>');
 el('tech-depth').oninput=()=>{g.rig.depth=Number(el<HTMLInputElement>('tech-depth').value);if(g.tackle)g.tackle.config.depth=g.rig.depth;};
 el('tech-drag').oninput=()=>{g.rig.drag=Number(el<HTMLInputElement>('tech-drag').value);if(g.tackle){g.tackle.config.drag=g.rig.drag;if(g.tackle.active)g.tackle.active.config.drag=g.rig.drag;}};
 for(const id of ['tech-speed','tech-course'])el(id).onchange=()=>g.setBoat(Number(el<HTMLSelectElement>('tech-speed').value),Number(el<HTMLSelectElement>('tech-course').value));
 return ()=>{
  const phase=g.phase,t=g.technique,modern=g.modern;el('technique-tools').hidden=(!modern&&!['fighting','landing'].includes(phase))||['caught','lost'].includes(phase);
  el('tech-prep').hidden=!modern||phase!=='idle'||!['feeder','fly'].includes(t.engine);el('tech-prep').textContent=t.engine==='feeder'?(g.feederFilled?'Feeder garni':'Garnir le feeder'):`Préparer la soie · ${Math.round(g.flyEnergy*100)} %`;
  hold.hidden=!modern||!(phase==='waiting'&&['drift','surface','fixed','fly'].includes(t.engine)||false);hold.textContent=phase==='waiting'?'Retenir la dérive':`Déboîter · ${g.rodSections.toFixed(1)} m`;
  el('tech-clonk').hidden=!modern||phase!=='waiting'||t.engine!=='clonk';el<HTMLButtonElement>('tech-clonk').disabled=g.clonkRemaining>0;el('tech-clonk').textContent=g.clonkRemaining>0?`Clonk · pause ${Math.ceil(g.clonkRemaining)} s`:'Série de clonk';
  el('tech-land').hidden=!g.canReceive&&phase!=='landing';el('tech-land').textContent=phase==='landing'?'Revenir au fil':g.fishLength<=25?'Préparer la petite réception':'Prendre l’épuisette';el<HTMLButtonElement>('tech-land').disabled=false;
  el('drag-value').textContent=`Frein : ${Math.round((g.rig.drag??.5)*100)} %`;if(document.activeElement!==el('tech-drag'))el<HTMLInputElement>('tech-drag').value=String(g.rig.drag??.5);
  el('tech-settings').hidden=!modern||!['waiting','fighting'].includes(phase);
  el('tech-depth-wrap').hidden=phase!=='waiting'||!['vertical','clonk'].includes(t.engine);el('tech-drag-wrap').hidden=!g.hasReel||phase!=='fighting';
  el('tech-speed-wrap').hidden=g.post!=='boat'||phase!=='waiting';el('tech-course-wrap').hidden=g.post!=='boat'||phase!=='waiting';
  el('reel-control').setAttribute('aria-label',phase==='landing'?'Réception : positionnez puis relevez par un geste court':g.hasSections&&phase==='fighting'?'Grande canne : vers soi pour reculer, latéralement pour déboîter':'Récupération : maintenez pour tourner, relâchez pour arrêter');
  el('reel-control').querySelector('.reel-label')!.textContent=phase==='landing'?(g.netReady?'Relever':'Positionner'):g.hasSections&&phase==='fighting'?(g.canDetach?'Déboîter →':'Reculer ↓'):t.id==='mouche'&&phase==='waiting'?'Récupérer la soie':phase==='waiting'&&['bottom','feeder'].includes(t.engine)?'Prendre contact':'Mouliner';
 };
}
