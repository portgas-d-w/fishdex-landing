import {SPECIES,type SpeciesId} from '../game/catalog';
import {APPEARANCES} from '../game/fish-registry';
import {PROFILES} from '../game/profiles';
import {ALL_POSTS,postById,type PostId} from '../game/posts';
import {techniqueById,recipeById} from '../game/techniques';
import {fishRoutes,accessibleFishRoutes} from '../game/fish-access';
import {speciesMastery} from '../game/structure';
import {discoveredFish} from '../game/save';
import {rarityName,SPECIES_RARITY} from '../game/rarity';
import type {ScreenHooks} from './structure';
import type fishdex from '../game/fishdex.json';
import {assetURL} from './asset-art';
import {escapeUI as esc,emptyState} from './presentation';
type Entry=typeof fishdex.entries[number];
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const meter=(n:number,max:number)=>`<progress value="${Math.min(n,max)}" max="${max}"></progress><span class="meter-value">${Math.min(n,max)} / ${max}</span>`;
const bandNames={surface:'Surface',middle:'Entre deux eaux',bottom:'Fond',mixed:'Plusieurs couches'};
export class FishDexScreen {
 private unread=new Set<string>();
 constructor(private h:ScreenHooks,private groups:Entry[][]){
  document.addEventListener('fishdex-discovery',event=>{this.unread.add((event as CustomEvent<{id:string}>).detail.id);});
  document.addEventListener('close',event=>{if((event.target as HTMLElement).id==='species-sheet'&&el<HTMLDialogElement>('encyclopedia').open)this.dex();},true);
  const background=assetURL('fishdex-bg','backgrounds');if(background)el('encyclopedia').style.backgroundImage=`linear-gradient(#171f22ed,#171f22f7),url("${background}")`;
  el('dex-state').innerHTML='<option value="all">Toutes les découvertes</option><option value="playable">À capturer</option><option value="observation">À observer</option><option value="discovered">Découvertes</option><option value="missing">Manquantes</option><option value="mirage">Souvenirs Mirage</option>';
  el('dex-category').setAttribute('aria-label','Profil');el('dex-category').firstElementChild!.textContent='Tous les profils';
  el('dex-search').setAttribute('placeholder','Numéro, indice ou nom découvert');
  const filters=el('dex-search').parentElement!;filters.insertAdjacentHTML('afterend','<details id="dex-filters"><summary>Affiner ma collection</summary><div class="filters" id="dex-filter-fields"></div><p class="intro">Profil regroupe les catégories du catalogue : Paisibles, Prédateurs et Eaux vives. Les inconnus se recherchent par numéro et couche d’eau ; leurs noms restent à découvrir.</p><button id="dex-reset" class="secondary">Réinitialiser les filtres</button></details>');
  el('dex-filter-fields').append(el('dex-category'),el('dex-state'));el('dex-filter-fields').insertAdjacentHTML('beforeend','<select id="dex-forms" aria-label="Formes"><option value="all">Toutes les formes</option><option value="seen">Formes découvertes</option><option value="missing">Formes manquantes</option></select>');el('dex-forms').onchange=()=>this.dex();
  filters.insertAdjacentHTML('beforeend','<label>Habitat<select id="dex-habitat"><option value="all">Tout le catalogue</option><option value="here">Ici</option>'+ALL_POSTS.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')+'</select></label>');
  el('dex-habitat').onchange=()=>this.dex();
  el('dex-reset').onclick=()=>{for(const id of ['dex-category','dex-state','dex-habitat','dex-forms'])el<HTMLSelectElement>(id).value='all';el<HTMLInputElement>('dex-search').value='';this.dex();};
  el('encyclopedia').querySelector('.modal-footnote')!.textContent='Une découverte correspond à une espèce ou un hybride confirmé. Taille, robe et maîtrise restent distinctes. La rareté de collection ne mesure pas la difficulté de combat.';
 }
 dex(){
  const s=this.h.save(),known=discoveredFish(s),count=known.size,mastered=SPECIES.filter(f=>speciesMastery(s,f.id)===5).length;
  const appearances=new Set([...s.journal,...s.observations].flatMap(f=>f.appearanceId?[f.appearanceId]:[])),total=SPECIES.length;
  el('dex-menu-progress').textContent=`${count} / ${total} découvertes`;
  const next=SPECIES.find(f=>!known.has(f.id)&&accessibleFishRoutes(s,f.id).some(r=>r.ready));
  el('dex-progress').innerHTML=`<div><strong>Découvertes ${count} / ${total}</strong>${meter(count,total)}<button class="text-action" id="dex-next">${next?'Prochain indice accessible':'Mes objectifs'}</button></div><details><summary>Formes et maîtrise</summary><p>${appearances.size} / ${APPEARANCES.length} formes · ${mastered} / ${total} maîtrisées</p><p class="intro">Les formes restent rattachées au poisson. Une nouvelle taille enrichit le record, sans créer une espèce.</p><button class="secondary" id="dex-objectives">Mes objectifs</button></details>`;
  el('dex-next').onclick=()=>next?this.species(this.groups.findIndex(g=>g[0].gameId===next.id)):this.h.open('progression');el('dex-objectives').onclick=()=>this.h.open('progression');
  const search=el<HTMLInputElement>('dex-search').value.trim().toLocaleLowerCase('fr'),category=el<HTMLSelectElement>('dex-category').value,state=el<HTMLSelectElement>('dex-state').value,habitat=el<HTMLSelectElement>('dex-habitat').value,formFilter=el<HTMLSelectElement>('dex-forms').value;
  const currentPosts=['jetty','cove','bank','reed-bank','point','timber'].includes(this.h.game.post)?['jetty','cove','bank','reed-bank','point','timber']:[this.h.game.post];
  el('dex-list').className='dex-grid';
  el('dex-list').innerHTML=this.groups.map((rows,index)=>{
   const fish=SPECIES.find(f=>f.id===rows[0].gameId)!,found=known.has(fish.id),number=String(fish.number).padStart(3,'0');
   const searchText=found?`${number} ${fish.name} ${fish.latin}`:`${number} ${bandNames[fish.stratum]} ${fish.mode==='observation'?'observation':'capture'}`;
   const forms=APPEARANCES.filter(a=>a.parent===fish.id);if(formFilter==='seen'&&!forms.some(a=>appearances.has(a.id))||formFilter==='missing'&&!forms.some(a=>!appearances.has(a.id)))return '';
   if(!rows.some(e=>category==='all'||e.category===category)||search&&!searchText.toLocaleLowerCase('fr').includes(search)||state==='playable'&&fish.mode!=='capture'||state==='observation'&&fish.mode!=='observation'||state==='discovered'&&!found||state==='missing'&&found||state==='mirage'&&!s.journal.some(f=>f.speciesId===fish.id&&f.mirage)||habitat!=='all'&&!fishRoutes(fish.id).some(r=>habitat==='here'?currentPosts.includes(r.post):r.post===habitat))return '';
   return `<button class="dex-tile ${found?'discovered':'unknown'}" data-dex="${index}" aria-label="${found?esc(fish.name):'Poisson à découvrir numéro '+number}"><span class="dex-number">#${number}</span><div class="dex-picture">${fish.image?`<img class="${found?'':'fish-silhouette'}" src="${fish.image}" loading="lazy" width="160" height="90" alt="${found?esc(fish.name):'Silhouette du poisson numéro '+number}">`:'<span class="image-fallback">Illustration indisponible</span>'}</div><strong>${found?esc(fish.name):'À découvrir'}</strong><small>${fish.mode==='observation'?'Observation':'Capture'} · ${found?this.unread.has(fish.id)?'Nouveau':'Découvert':bandNames[fish.stratum]}</small>${found?`<span class="tile-state">${speciesMastery(s,fish.id)===5?'Maîtrisé':'Voir la fiche'}</span>`:'<span class="tile-state">Voir un indice</span>'}</button>`;
  }).join('')||emptyState('Aucun résultat','Les noms ne sont recherchables qu’après découverte. Essayez un numéro ou une couche d’eau.');
 }
 species(index:number){
  const rows=this.groups[index];if(!rows)return;const id=rows[0].gameId as SpeciesId,fish=SPECIES.find(f=>f.id===id)!,s=this.h.save(),record=s.records[id],known=discoveredFish(s).has(id),profile=PROFILES[id];
  this.unread.delete(id);
  const routes=accessibleFishRoutes(s,id),best=routes[0],seen=[...s.journal,...s.observations],number=String(fish.number).padStart(3,'0');
  el('species-sheet-title').textContent=`#${number} · ${known?fish.name:'À découvrir'}`;
  const hero=`<div class="species-hero">${fish.image?`<img class="${known?'':'fish-silhouette'}" src="${fish.image}" alt="${known?esc(fish.name):'Silhouette du poisson numéro '+number}" width="320" height="180">`:'<span class="image-fallback">Portrait indisponible</span>'}<span class="state-pill">${known?'Découvert':'Indice'}</span></div>`;
  const encounter=`<section class="ui-section"><h3>${known?'Où le rencontrer':'Un habitat adapté'}</h3><p class="intro">${best?esc(postById(best.post).name):'À venir : aucun habitat jouable confirmé.'}</p><p class="intro">${fish.mode==='observation'?'Suivez sa nage pendant 12 secondes, puis photographiez. Aucun ferrage ni favori d’aquarium.':best?.technique?'Premier repère : '+esc(techniqueById(best.technique).name)+' · '+esc(recipeById(best.recipe!)!.name)+' · couche '+best.depth.toFixed(1)+' m. À adapter au fond du point choisi.':'Aucune présentation disponible.'}</p>${best&&!best.ready?`<p class="warning-line">${best.reasons.map(esc).join(' · ')}</p><button id="species-unlock" class="secondary">Voir le déblocage</button>`:''}${best?'<button id="species-prepare" class="action">'+(fish.mode==='observation'?'Voir un habitat à observer':'Préparer une rencontre')+'</button>':''}<details><summary>Autres présentations</summary>${routes.slice(1).map(r=>`<p class="intro">${esc(postById(r.post).name)} · ${r.technique?esc(techniqueById(r.technique).name)+' / '+esc(recipeById(r.recipe!)!.name):'Observation'} · ${r.ready?'Accessible':r.reasons.map(esc).join(' · ')}</p>`).join('')||'<p class="intro">Aucune autre présentation confirmée.</p>'}</details><p class="intro">La préparation ne garantit aucune rencontre. Consulter ce conseil ne change ni poste, ni recette, ni stock.</p></section>`;
  if(!known){el('species-sheet-body').innerHTML=hero+`<p class="intro">Indice : ${bandNames[fish.stratum].toLowerCase()}. ${fish.mode==='capture'?'À découvrir par capture.':'À découvrir par observation.'}</p>`+encounter;}
  else{
   const catches=s.journal.filter(f=>f.speciesId===id),weight=catches.length?Math.max(...catches.map(f=>f.weight)):undefined;
   el('species-sheet-body').innerHTML=hero+`<p class="intro">${esc(fish.description||profile.biological_facts)}</p><p class="rarity-label">${rarityName(SPECIES_RARITY[id])} · rareté de collection, distincte du combat</p><details><summary>Profil</summary><p class="intro">${esc(profile.biological_facts)}</p><p class="intro">Cherchez ${bandNames[fish.stratum].toLowerCase()}.</p><p class="latin">${esc(fish.latin)}</p></details>`+encounter+`<details><summary>Formes et robes</summary><div class="variant-list"><div>Naturelle · ${seen.some(f=>f.speciesId===id&&!f.appearanceId)||record?'Découverte':'À découvrir'}</div>${APPEARANCES.filter(a=>a.parent===id).map(a=>{const found=seen.some(f=>f.appearanceId===a.id);return `<div>${a.image?`<img class="variant-image ${found?'':'fish-silhouette'}" src="${a.image}" alt="${found?esc(a.name):'Forme à découvrir'}" loading="lazy">`:''}${found?esc(a.name):'Forme à découvrir'} · ${found?'Découverte':'Indice disponible'}${a.post?' · '+esc(postById(a.post as PostId).name):''}</div>`;}).join('')||'<p class="intro">Pas d’autre forme confirmée.</p>'}</div><p class="intro">La robe ne change pas la puissance du combat. ${catches.some(f=>f.coloration==='golden')?'Souvenir historique : Dorée. ':''}${catches.some(f=>f.mirage)?'Souvenir historique : Mirage.':''}</p></details><details open><summary>Mes records et maîtrise</summary><div class="facts"><div><small>Longueur</small><strong>${record?record.best+' cm':'Aucune capture'}</strong></div><div><small>Poids</small><strong>${weight!==undefined?weight.toLocaleString('fr-FR')+' kg':'Aucun poids conservé'}</strong></div></div>${meter(speciesMastery(s,id),5)}<p class="intro">${record?.count??0} captures · ${s.observations.filter(o=>o.speciesId===id).length} observations</p><button id="species-journal" class="secondary">Voir mes souvenirs</button></details>`;
  }
  if(el('species-journal'))el('species-journal').onclick=()=>{el<HTMLSelectElement>('journal-species').value=id;this.h.refresh();this.h.open('collection');};
  if(el('species-unlock'))el('species-unlock').onclick=()=>this.h.open('progression');
  if(el('species-prepare'))el('species-prepare').onclick=()=>{if(!best)return;this.h.open(fish.mode==='observation'?'map':'preparation');document.dispatchEvent(new CustomEvent('fishdex-encounter-preview',{detail:{identity:id,known,route:best}}));};
  this.h.open('species-sheet');
 }
}
