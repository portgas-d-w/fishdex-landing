import {SPECIES,type SpeciesId} from '../game/catalog';
import {APPEARANCES,FISH_REGISTRY} from '../game/fish-registry';
import {PROFILES} from '../game/profiles';
import {ALL_POSTS,postById,type PostId} from '../game/posts';
import {techniqueById,recipeById} from '../game/techniques';
import {fishRoutes} from '../game/fish-access';
import {speciesMastery} from '../game/structure';
import {discoveredFish} from '../game/save';
import {rarityName,SPECIES_RARITY} from '../game/rarity';
import type {ScreenHooks} from './structure';
import type fishdex from '../game/fishdex.json';
import {assetURL} from './asset-art';
type Entry=typeof fishdex.entries[number];
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const meter=(n:number,max:number)=>`<progress value="${Math.min(n,max)}" max="${max}"></progress><span class="meter-value">${Math.min(n,max)} / ${max}</span>`;
export class FishDexScreen {
 constructor(private h:ScreenHooks,private groups:Entry[][]){
  const background=assetURL('fishdex-bg','backgrounds');if(background)el('encyclopedia').style.backgroundImage=`linear-gradient(#171f22ed,#171f22f7),url("${background}")`;
  el('dex-state').innerHTML='<option value="all">Toutes les identités</option><option value="playable">Capturables</option><option value="observation">À observer</option><option value="discovered">Découvertes</option><option value="missing">Manquantes</option><option value="mirage">Souvenirs Mirage</option>';
  el('dex-state').insertAdjacentHTML('afterend',`<select id="dex-habitat" aria-label="Habitat"><option value="all">Tous les habitats</option>${ALL_POSTS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>`);
  el('dex-habitat').onchange=()=>this.dex();
 }
 dex(){
  const s=this.h.save(),known=discoveredFish(s),count=known.size,mastered=SPECIES.filter(f=>speciesMastery(s,f.id)===5).length;
  const appearances=new Set([...s.journal,...s.observations].flatMap(f=>f.appearanceId?[f.appearanceId]:[]));
  el('dex-menu-progress').textContent=`${count} / ${SPECIES.length} identités · Explorer le FishDex`;
  el('dex-progress').innerHTML=`<div><span class="eyebrow">64 espèces · 2 hybrides</span><strong>${Math.round(count/SPECIES.length*100)} %</strong>${meter(count,SPECIES.length)}</div><div><span class="eyebrow">Formes et écotypes</span><strong>${appearances.size} / ${APPEARANCES.length}</strong><small>Couleur, écaillure et milieu</small></div><div><span class="eyebrow">Maîtrise</span><strong>${mastered} / ${SPECIES.length}</strong><button class="text-action" id="dex-objectives">Mes objectifs</button></div>`;
  el('dex-objectives').onclick=()=>this.h.open('progression');
  const search=el<HTMLInputElement>('dex-search').value.trim().toLocaleLowerCase('fr'),category=el<HTMLSelectElement>('dex-category').value,state=el<HTMLSelectElement>('dex-state').value,habitat=el<HTMLSelectElement>('dex-habitat').value;
  el('dex-list').className='dex-grid';
  el('dex-list').innerHTML=this.groups.map((rows,index)=>{
   const base=rows[0],fish=SPECIES.find(f=>f.id===base.gameId)!;
   const found=known.has(fish.id);
   if(!rows.some(e=>(category==='all'||e.category===category)&&(!search||`${e.name} ${e.latin} ${e.techniques.join(' ')}`.toLocaleLowerCase('fr').includes(search)))||state==='playable'&&fish.mode!=='capture'||state==='observation'&&fish.mode!=='observation'||state==='discovered'&&!found||state==='missing'&&found||state==='mirage'&&!s.journal.some(f=>f.speciesId===fish.id&&f.mirage)||habitat!=='all'&&!fishRoutes(fish.id).some(r=>r.post===habitat))return '';
   return `<button class="dex-tile ${found?'discovered':'unknown'}" data-dex="${index}"><span class="dex-number">#${String(fish.number).padStart(3,'0')}</span><div class="dex-picture">${fish.image?`<img class="${found?'':'fish-silhouette'}" src="${fish.image}" loading="lazy" alt="${found?esc(fish.name):'Silhouette de '+esc(fish.name)}">`:`<span class="silhouette morph-${fish.family}" aria-label="Silhouette ${fish.family}">Ͻ</span>`}</div><strong>${found?esc(fish.name):'À découvrir'}</strong><small>${fish.mode==='observation'?'Observation':fish.kind==='hybrid'?'Hybride domestique':'Capture'} · ${found?'Identifié':'Indice disponible'}</small>${found?meter(speciesMastery(s,fish.id),5):'<span class="tile-state">Voir son habitat</span>'}</button>`;
  }).join('')||'<p class="intro">Aucune entrée avec ces filtres.</p>';
 }
 species(index:number){
  const rows=this.groups[index];if(!rows)return;const id=rows[0].gameId as SpeciesId,fish=SPECIES.find(s=>s.id===id)!,s=this.h.save(),record=s.records[id],known=discoveredFish(s).has(id),profile=PROFILES[id];
  const routes=fishRoutes(id),posts=[...new Set(routes.map(r=>r.post))],appearance=APPEARANCES.filter(a=>a.parent===id),seen=[...s.journal,...s.observations];
  const description=fish.mode==='observation'?'Suivez la nage pendant 12 secondes et photographiez. Aucun ferrage, combat ni favori d’aquarium.':'Préparez un montage adapté, rencontrez le poisson, ferrez puis recevez sous tension contrôlée.';
  el('species-sheet-title').textContent=`#${String(fish.number).padStart(3,'0')} · ${fish.name}`;
  el('species-sheet-body').innerHTML=`<div class="species-hero">${fish.image?`<img src="${fish.image}" alt="Illustration de référence de ${esc(fish.name)}">`:''}<span class="state-pill">${known?'Identifié':'À découvrir'}</span></div><p class="latin">${esc(fish.latin)}${fish.kind==='hybrid'?' · hybride domestique':''}</p><small class="rarity-label">Rareté de collection : ${rarityName(SPECIES_RARITY[id])} · taille et robe distinctes</small><p class="intro">${esc(profile.biological_facts)}</p><div class="facts"><div><small>Gabarits du prototype</small><strong>${fish.min}–${fish.max} cm</strong></div><div><small>Record personnel de capture</small><strong>${record?`${record.best} cm`:'Aucune capture'}</strong></div></div><h3 class="section-title">Où commencer ?</h3><p class="intro">${posts.map(p=>esc(postById(p).name)).join(' · ')}</p><p class="intro">${description}</p>${fish.mode==='capture'?`<p class="intro">Présentations possibles : ${[...new Set(routes.map(r=>r.technique).filter((t):t is NonNullable<typeof t>=>!!t))].map(t=>esc(techniqueById(t).name)).join(' · ')}.</p><p class="intro">Premier repère : ${routes[0]?.technique?esc(techniqueById(routes[0].technique).name)+' · '+esc(recipeById(routes[0].recipe!)!.name)+' · couche '+routes[0].depth.toFixed(1)+' m':''}. Réglez ensuite sur le fond du point choisi.</p>`:''}<h3 class="section-title">Formes, robes et écotypes</h3><div class="variant-list"><div>Naturelle<small>${seen.some(f=>f.speciesId===id&&!f.appearanceId)?'Découverte':'À découvrir'}</small></div>${appearance.map(a=>`<div>${a.image?`<img class="variant-image" src="${a.image}" alt="Illustration ${esc(a.name)}" loading="lazy">`:''}${esc(a.name)}<small>${seen.some(f=>f.appearanceId===a.id)?'Découverte':'À découvrir'}${a.post?' · '+esc(postById(a.post as PostId).name):''}</small></div>`).join('')||'<p class="intro">Pas d’autre forme confirmée dans la source.</p>'}</div><p class="intro">Les records et les alias n’ajoutent aucune espèce. La robe ne modifie pas la puissance du combat. ${rows.filter(e=>e.type==='record'||e.type==='alias').map(e=>esc(e.name)).join(' · ')}</p><h3 class="section-title">Représentation 3D</h3><p class="intro">${fish.model?'Modèle exact du pack existant.':'Silhouette procédurale provisoire de la famille '+esc(fish.family)+'. Illustration de référence affichée ci-dessus ; remplaçable sans changer le carnet.'}</p><h3 class="section-title">Comportement de jeu</h3><p class="intro">${esc(profile.combat_proposal)} Les six attributs et les variations bornées sont des propositions de jeu. Les caches ne sont recherchées que lorsqu’un obstacle existe au poste.</p><p class="intro">Habitat documenté : ${esc(profile.habitats.join(' · '))}. Régime : ${esc(profile.diet_tags.join(' · '))}. Température et météo ne sont pas simulées.</p><p class="intro">${seen.some(f=>'coloration' in f&&f.speciesId===id&&f.coloration==='golden')?'Souvenir historique : Dorée. ':''}${seen.some(f=>'mirage' in f&&f.speciesId===id&&f.mirage)?'Souvenir historique : Mirage. ':''}</p><h3 class="section-title">Mes rencontres</h3>${meter(speciesMastery(s,id),5)}<p class="intro">${record?.count??0} capture(s) · ${s.observations.filter(o=>o.speciesId===id).length} observation(s).</p><div class="tools"><button id="species-journal" class="secondary">Voir mes souvenirs</button><button id="species-prepare" class="secondary">${fish.mode==='observation'?'Observer cet habitat':'Préparer une rencontre'}</button></div><details><summary>Provenance et limites</summary><p class="intro">Catalogue local FishDex + recherche fournie du 02/10/2026. ${esc(profile.research_status)}. Paramètres numériques de prototype, non mesures biologiques.</p>${[...FISH_REGISTRY.provenance.suppliedSources,...FISH_REGISTRY.provenance.additionalSources].filter(source=>profile.source_ids.includes(source.id)).map(source=>`<a href="${source.url}" target="_blank" rel="noopener noreferrer">${esc(source.id)}</a>`).join(' · ')}</details>`;
  el('species-journal').onclick=()=>{this.h.close('species-sheet');el<HTMLSelectElement>('journal-species').value=id;this.h.refresh();this.h.open('collection');};
  el('species-prepare').onclick=()=>{this.h.close('species-sheet');this.h.open(fish.mode==='observation'?'map':'preparation');};
  this.h.open('species-sheet');
 }
}
