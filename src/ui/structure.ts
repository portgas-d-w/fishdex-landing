import {DESTINATIONS,trackedObjective} from '../game/objectives';
import {postById} from '../game/posts';
import {postAccess,postCondition} from '../game/progression';
import {EQUIPMENT_FAMILIES,emptyState,unlockReason} from './presentation';
import {wallet} from '../game/development';
import { JourneyScreens } from './journey';
import { RARITIES, catalogueRarity, rarityName } from '../game/rarity';
import {techniqueAccess,techniqueCondition,methodAccess, itemCondition } from '../game/progression';
import { TackleWorkshop } from './tackle';
import {TECHNIQUES,TECHNIQUE_IDS,RECIPES,type TechniqueId} from '../game/techniques';
import {APPEARANCES} from '../game/fish-registry';
import {ALL_POSTS} from '../game/posts';
import {SLOT_NAMES} from '../game/rig';
import {FishDexScreen} from './fishdex';
import fishdex from '../game/fishdex.json';
import { SPECIES } from '../game/catalog';
import { METHODS, FAMILIES, GEAR, BADGE_RULES, gearState, filterJournal, type Gear, type JournalFilter } from '../game/structure';
import { BADGES, levelFor } from '../game/economy';
import { purchase } from '../game/save';
import type { SaveData } from '../game/save';
import type { FishingGame } from '../game/fishing';
import type { Specimen } from '../game/specimens';
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const option = (value: string, label: string) => `<option value="${esc(value)}">${esc(label)}</option>`;
const meter = (n: number, max: number) => `<progress value="${Math.min(n, max)}" max="${max}"></progress><span class="meter-value">${Math.min(n, max)} / ${max}</span>`;
const gearFallback = (family: string) => `<svg class="gear-art" viewBox="0 0 160 90" aria-hidden="true"><path d="${family === 'rod' ? 'M20 78Q40 20 142 12M23 69L13 65L8 82L19 84M62 33L66 39M105 19L109 25' : family === 'reel' ? 'M80 20a26 26 0 1 0 1 0M80 31a15 15 0 1 0 1 0M107 47L130 55L130 70' : family === 'decor' ? 'M20 80Q35 45 20 25M35 80Q52 30 45 10M110 80L95 60L115 40L140 64L145 80' : family === 'lure' ? 'M30 45Q70 8 125 45Q70 80 30 45M30 45L12 28L12 63ZM98 36L99 36M75 61V76Q80 86 88 76' : family === 'float' ? 'M80 9V27M80 65V84M80 27C58 27 58 65 80 65C102 65 102 27 80 27Z' : family === 'hook' || family === 'landing' ? 'M95 10V65Q95 88 66 72Q60 64 66 50L72 60M95 10H105' : family === 'feeder' || family === 'weight' ? 'M48 25H112V72H48ZM60 25V72M80 25V72M100 25V72M48 45H112M80 25V10' : 'M25 65Q40 15 90 28Q135 40 115 68Q85 90 50 66Q20 42 70 20'}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const GEAR_IMAGES: Record<string, string> = { rod: 'grande-canne', lure: 'petit-leurre', bait: 'ver-terre', feeder: 'feeder' };
export const gearArt = (family: string) => GEAR_IMAGES[family] ? `<img class="gear-art gear-image" src="/equipment/${GEAR_IMAGES[family]}.webp" alt="Illustration de la famille de matériel" loading="lazy">` : gearFallback(family);
type Entry = typeof fishdex.entries[number];
export interface ScreenHooks {
    save: () => SaveData;
    game: FishingGame;
    open: (id: string) => void;
    close: (id: string) => void;
    persist: () => void;
    refresh: () => void;
    toast: (s: string) => void;
    postChanged?:()=>void;
    isPaused?:()=>boolean;
}
export class GameScreens {
    readonly groups: Entry[][];
    private pending?: Gear;
    private workshop: TackleWorkshop;
    private journey:JourneyScreens;
    private dexScreen:FishDexScreen;
    constructor(private h: ScreenHooks) {
        const groups = new Map<string, Entry[]>();
        for (const e of fishdex.entries) {
            const rows = groups.get(e.biologicalId) ?? [];
            rows.push(e);
            groups.set(e.biologicalId, rows);
        }
        this.groups = SPECIES.map(f=>[...(groups.get(f.id)??[])].sort((a,b)=>Number(b.id===f.sourceId)-Number(a.id===f.sourceId)));
        this.dexScreen=new FishDexScreen(h,this.groups);
        const primary = el('dex-open');
        el('menu').querySelector('nav')!.prepend(primary);
        primary.classList.add('primary-dex');
        primary.innerHTML = '<span class="device-light"></span><strong>FishDex</strong><small id="dex-menu-progress">Mes découvertes et objectifs</small>';
        el('collection-open').innerHTML = 'Carnet<small id="collection-count">Historique des rencontres</small>';
        el('encyclopedia').querySelector('h2')!.textContent = 'FishDex';
        el('encyclopedia').querySelector('.intro')!.insertAdjacentHTML('afterend', '<div id="dex-progress" class="dex-progress"></div>');

        el('menu').querySelector('nav')!.insertAdjacentHTML('beforeend', '<button id="locations-open">Lieux<small>Habitats et prochaines escales</small></button>');
        el('app').insertAdjacentHTML('beforeend', ['species-sheet', 'item-sheet', 'location-sheet', 'method-sheet', 'badge-sheet', 'purchase-confirm'].map(id => `<dialog id="${id}" class="modal detail-modal"><div class="modal-header"><h2 id="${id}-title"></h2><button class="close" data-close="${id}">Retour</button></div><div id="${id}-body"></div></dialog>`).join('') + '<dialog id="locations" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Explorer les habitats</div><h2>Lieux de pêche</h2></div><button class="close" data-close="locations">Retour</button></div><div id="locations-list" class="content-grid"></div></dialog>');
        el('locations-open').onclick = () => this.h.open('locations');
        el('shop-list').insertAdjacentHTML('beforebegin', '<div class="filters"><label>Catégorie<select id="shop-family">' + option('all', 'Toute la boutique') + FAMILIES.map(([id, name]) => option(id, name)).join('') + '</select></label></div>');
        el('shop-family').insertAdjacentHTML('afterend','<div class="shop-toolbar"><label>Recherche<input id="shop-query" type="search" placeholder="Nom ou usage"></label><label>Vue<select id="shop-view"><option value="all">Tout le catalogue</option><option value="equipment">Pour mon équipement</option><option value="available">Disponible</option></select></label></div>');
        el('shop-family').innerHTML=option('all','Toute la boutique')+EQUIPMENT_FAMILIES.map(([id,name])=>option(id,name)).join('')+'<optgroup label="Sous-familles">'+FAMILIES.filter(([id])=>!EQUIPMENT_FAMILIES.some(f=>f[0]===id)).map(([id,name])=>option(id,name)).join('')+'</optgroup>';
        for(const id of ['shop-query','shop-view'])el(id).addEventListener('input',()=>this.shop());
        el('collection').querySelector('.intro')!.textContent = 'Vos prises individuelles, leurs photos et leurs histoires. La collection des espèces se trouve dans le FishDex.';
        el('collection-list').insertAdjacentHTML('beforebegin', '<details id="legacy-records"><summary>Records des espèces et de l’ancien carnet</summary></details>');
        el('legacy-records').append(el('collection-list'));
        el('journal-list').insertAdjacentHTML('beforebegin', this.journalControls());
        el('help').insertAdjacentHTML('beforeend', '<div class="setting-row"><span>Moulinage</span><small>Appui maintenu ; canne indépendante, arrêt au relâchement.</small></div><h3 class="section-title">Ma sauvegarde</h3><p class="intro">Progression locale, photos régénérables. Le fichier JSON permet de changer d’appareil.</p><button class="secondary" id="settings-save">Exporter / importer ma progression</button>');
        el('settings-save').onclick = () => this.h.open('collection');
        el('aquarium').insertAdjacentHTML('beforeend', '<div class="filters"><label>Remplacer l’emplacement<select id="aq-replace-slot"></select></label><button class="secondary" id="aq-replace">Remplacer par le spécimen choisi</button></div><button class="secondary" id="aq-shop">Décorations du bassin</button>');
        el('aq-shop').onclick = () => { el<HTMLSelectElement>('shop-family').value = 'decor'; this.h.open('shop'); };
        el('aq-replace').onclick = () => { const id = el<HTMLSelectElement>('aquarium-choice').value, index = Number(el<HTMLSelectElement>('aq-replace-slot').value), s = this.h.save(); if (!id || !s.journal.some(f => f.id === id) || s.favorites.includes(id) || !s.favorites[index])
            return; s.favorites[index] = id; this.h.persist(); this.h.refresh(); el('aquarium-open').click(); };
        el('caught').insertAdjacentHTML('beforeend', '<button id="catch-dex" class="secondary">Voir sa fiche FishDex</button>');
        el('catch-dex').onclick = () => { const name = el('catch-name').textContent; const group = this.groups.findIndex(rows => rows.some(e => e.name === name || e.gameId && SPECIES.find(s => s.id === e.gameId)?.name === name)); if (group >= 0)
            this.species(group); };
        el('journal-reset').onclick = () => { el('journal-controls').querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select').forEach(e => { if (e instanceof HTMLInputElement && e.type === 'checkbox')
            e.checked = false;
        else
            e.value = e.id === 'journal-sort' ? 'date' : ''; }); this.h.refresh(); };
        for (const id of ['shop-family'])
            el(id).addEventListener('change', () => id === 'gear-family' ? this.material() : this.shop());
        el('journal-controls').addEventListener('input', () => this.h.refresh());
        document.addEventListener('click', e => {
            const b = (e.target as HTMLElement).closest<HTMLElement>('[data-dex],[data-gear],[data-location],[data-tech],[data-objective],[data-unlock]');
            if (!b)
                return;
            if (b.dataset.dex !== undefined)
                this.species(Number(b.dataset.dex));
            if (b.dataset.gear)
                this.item(b.dataset.gear);
            if (b.dataset.location)
                this.location(b.dataset.location);
            if (b.dataset.tech)
                this.method(b.dataset.tech);
            if (b.dataset.objective)
                this.badge(b.dataset.objective);
            if (b.dataset.unlock) {
                el<HTMLSelectElement>('shop-family').value = 'rod';
                this.h.open('shop');
            }
        });
        this.workshop = new TackleWorkshop(this.h);
        this.journey=new JourneyScreens(this.h);
        el('progress-badges').insertAdjacentHTML('beforebegin','<div id="practice-masteries"></div>');
    }
    private journalControls() { return `<div id="journal-controls"><div class="quick-views"><label>Vue<select id="journal-view">${option('', 'Toutes') + option('latest', 'Dernières prises') + option('records', 'Records personnels') + option('first', 'Premières découvertes') + option('variants', 'Variantes') + option('favorites', 'Favoris')}</select></label><label>Tri<select id="journal-sort">${option('date', 'Récentes') + option('weight', 'Poids') + option('length', 'Longueur') + option('rarity', 'Rareté')}</select></label></div><details class="filter-panel"><summary>Affiner mes souvenirs</summary><div class="filter-grid"><label>Espèce<select id="journal-species">${option('', 'Toutes') + SPECIES.map(s => option(s.id, s.name)).join('')}</select></label><label>Apparence<select id="journal-variant">${option('', 'Toutes') + option('natural', 'Naturelle') + option('golden', 'Dorée') + option('mirage', 'Mirage')+APPEARANCES.map(a=>option(a.id,a.name)).join('')}</select></label><label>Rareté du jeu<select id="journal-rarity">${option('', 'Toutes') + RARITIES.map(r=>option(String(r.rank),r.name)).join('')}</select></label><label>Lieu<select id="journal-location">${option('', 'Tous') + option('L’étang des Saules', 'L’étang des Saules')+ALL_POSTS.map(p=>p.name).map(n=>option(n,n)).join('')}</select></label><label>Méthode<select id="journal-method">${option('', 'Toutes') + METHODS.filter(m=>['pole','float','bottom','lure'].includes(m.id)).map(m=>option(m.id,m.name+' · ancien carnet')).join('')+TECHNIQUES.map(m => option(m.id, m.name)).join('')}</select></label><label>Poste<select id="journal-post">${option('','Tous')+ALL_POSTS.map(p=>option(p.id,p.name)).join('')}</select></label><label>Montage<select id="journal-recipe">${option('','Tous')+RECIPES.map(r=>option(r.id,r.name)).join('')}</select></label><label>Depuis<input id="journal-after" type="date"></label><label>Jusqu’au<input id="journal-before" type="date"></label><label>Longueur min. (cm)<input id="journal-minLength" type="number" min="0"></label><label>Longueur max. (cm)<input id="journal-maxLength" type="number" min="0"></label><label>Poids min. (kg)<input id="journal-minWeight" type="number" min="0" step="0.01"></label><label>Poids max. (kg)<input id="journal-maxWeight" type="number" min="0" step="0.01"></label><label><input id="journal-favorite" type="checkbox"> Favoris seulement</label></div></details><p id="journal-results" class="intro" aria-live="polite"></p><button id="journal-reset" class="secondary">Réinitialiser les filtres</button></div>`; }
    opened(id: string) { if(id==='map')this.journey.opened();if(id==='initiation')this.journey.render(); if (id === 'encyclopedia')
        this.dex(); if (id === 'preparation')
        this.workshop.opened(); if (id === 'progression')
        this.progression(); if (id === 'locations')
        this.locations(); if (id === 'shop')
        this.shop(); }
    journalFilter():JournalFilter { const f: JournalFilter = {}; for (const key of ['species', 'variant', 'rarity', 'location', 'method','post','recipe', 'after', 'before', 'view', 'sort'] as const)
        f[key] = el<HTMLInputElement>(`journal-${key}`).value; for (const key of ['minLength', 'maxLength', 'minWeight', 'maxWeight'] as const) {
        const value = el<HTMLInputElement>(`journal-${key}`).value;
        if (value)
            f[key] = Number(value);
    } f.favorite = el<HTMLInputElement>('journal-favorite').checked;return f;}
    journal():Specimen[]{const f=this.journalFilter();const matches = filterJournal(this.h.save(), f), active = Object.entries(f).filter(([k, v]) => v && k !== 'sort' && k !== 'view').length; el('journal-results').textContent = `${matches.length} capture(s) filtrée(s) sur ${this.h.save().journal.length} · ${active} filtre(s) actif(s)`; return matches; }
    dex(){this.dexScreen.dex();}
    species(index:number){this.dexScreen.species(index);}
    material() { this.workshop.render(); }
    private gearCard(i: Gear, inventory: boolean) { const s = this.h.save(), state = gearState(i, s); return `<article class="gear-card">${gearArt(i.family)}<span class="state-pill">${state === 'future' ? 'À venir' : state === 'locked' ? 'Verrouillé' : state === 'owned' ? 'Possédé' : 'Disponible'}</span><h3>${i.name}</h3><small class="rarity-label">${rarityName(catalogueRarity(i.id))}</small><p class="intro">${i.description}</p>${state==='locked'?`<p class="warning-line">${unlockReason(s,i.id)}</p>`:''}<button class="secondary" data-gear="${i.id}">Fiche</button>${i.purchaseId ? `<button class="secondary" ${state === 'owned' || state === 'locked' ? 'disabled' : ''} data-buy="${i.purchaseId}">${state === 'owned' ? 'Possédé' : state === 'locked' ? 'Verrouillé' : `${i.price} écus · Acheter`}</button>${i.family === 'rod' && state === 'owned' ? `<button class="secondary" data-equip="${i.purchaseId}" ${s.equipped === i.purchaseId || this.h.game.phase !== 'idle' ? 'disabled' : ''}>${s.equipped === i.purchaseId ? 'Équipée' : this.h.game.phase === 'idle' ? 'Équiper' : 'Après cette partie'}</button>` : ''}` : !inventory && i.state === 'included' ? '<small>Compris dans votre kit gratuit</small>' : ''}</article>`; }
    shop() {const save=this.h.save();el('shop-balance').textContent=`${save.development?'Mode test · ':''}${wallet(save)} écus · Niveau ${levelFor(save.xp)}`;el('shop-list').className='content-grid';const family=el<HTMLSelectElement>('shop-family').value,query=el<HTMLInputElement>('shop-query').value.toLocaleLowerCase(),view=el<HTMLSelectElement>('shop-view').value;el('shop-list').innerHTML=GEAR.filter(i=>!!i.purchaseId&&(family==='all'||i.family===family)&&`${i.name} ${i.description}`.toLocaleLowerCase().includes(query)&&(view!=='available'||!itemCondition(save,i.id))&&(view!=='equipment'||i.methods.includes(save.tackle.config.method))).map(i=>this.gearCard(i,false)).join('')||((family==='rod'||family==='decor')?emptyState('Aucun objet trouvé','Élargissez les filtres du catalogue.'):'');this.workshop.refreshShopComponents();}

    item(id: string) { const i = GEAR.find(i => i.id === id); if (!i)
        return; const state = gearState(i, this.h.save()); el('item-sheet-title').textContent = i.name; el('item-sheet-body').innerHTML = `${gearArt(i.family)}<p class="intro">${i.description}</p><div class="facts"><div><small>Possession</small><strong>${state === 'owned' ? '1' : '0'}</strong></div><div><small>Accès</small><strong>${state === 'future' ? 'À venir' : `Niveau ${i.level}`}</strong></div></div><p class="intro">${i.methods.length ? 'Compatible : ' + i.methods.map(id => METHODS.find(m => m.id === id)?.name).join(' · ') : 'Personnalisation de l’aquarium'}</p><p class="intro">${i.state === 'included' ? 'Inclus dans la canne gratuite, réutilisable.' : i.state === 'future' ? 'La logique de cet objet n’est pas disponible. Aucun achat.' : `${i.price} écus · ${state === 'locked' ? itemCondition(this.h.save(),i.id) : state === 'owned' ? 'Acheté / possédé ; équiper reste une action distincte.' : 'Disponible en boutique.'}`}</p>${i.purchaseId && state === 'available' ? `<button id="item-buy" class="action">Acheter · ${i.price} écus</button>` : ''}`; if (i.purchaseId && state === 'available')
        el('item-buy').onclick = () => this.buy(i.id); this.h.open('item-sheet'); }
    buy(id: string) { const i = GEAR.find(i => i.id === id); if (!i?.purchaseId || gearState(i, this.h.save()) !== 'available')
        return; this.pending = i; el('purchase-confirm-title').textContent = 'Confirmer mon achat'; el('purchase-confirm-body').innerHTML = `${gearArt(i.family)}<h3>${i.name}</h3><p class="intro">${i.price} écus · Solde ${wallet(this.h.save())} écus. L’achat n’équipe pas automatiquement cet objet.</p><button id="purchase-yes" class="action" ${!this.h.save().development?.unlimitedMoney && this.h.save().coins < i.price ? 'disabled' : ''}>Confirmer · ${i.price} écus</button>${!this.h.save().development?.unlimitedMoney && this.h.save().coins < i.price ? '<p class="warning-line">Solde insuffisant. Le kit gratuit permet de continuer à pêcher.</p>' : ''}`; el('purchase-yes').onclick = () => { const item = this.pending; if (!item?.purchaseId)
        return; const message = purchase(this.h.save(), item.purchaseId); this.h.toast(message || 'Achat ajouté à votre inventaire.'); this.pending = undefined; this.h.persist(); this.h.close('purchase-confirm'); if (el<HTMLDialogElement>('item-sheet').open)
        this.h.close('item-sheet'); this.shop(); this.material(); this.h.refresh(); }; this.h.open('purchase-confirm'); }
    locations(){const s=this.h.save();el('locations-list').innerHTML=DESTINATIONS.map(d=>{const posts=d.posts.map(id=>postById(id as import('../game/posts').PostId)),open=posts.some(p=>postAccess(s,p.id)),current=d.posts.includes(this.h.game.post);return `<article class="location-card">${d.id==='willow-pond'?'<img class="post-preview" src="/map-assets/post-jetty.jpg" alt="Vue de l’étang depuis le jeu" width="576" height="360" loading="lazy">':'<div class="empty-state">Schéma du milieu · '+(posts[0].context==='river'?'Courant et dérive':'Profondeur et présentation')+'<p>Aperçu photographique indisponible</p></div>'}<span class="state-pill">${current?'Lieu actuel':open?'Accessible':'À débloquer'}</span><h3>${esc(d.name)}</h3><p class="intro">${esc(posts[0].hint)}</p>${d.id==='deep-lake'?'<p class="intro">Embarcation légère : contexte de déplacement et de pêche sur le lac.</p>':''}<button class="secondary" data-location="${d.id}">Milieu et conditions</button>${current?`<button ${d.id==='willow-pond'?'id="open-pond-map"':''} class="action" data-preview-post="${this.h.game.post}">Choisir mon poste</button>`:''}</article>`;}).join('');}
    location(id:string){const d=DESTINATIONS.find(d=>d.id===id)||DESTINATIONS.find(d=>id==='light-boat'&&d.id==='deep-lake');if(!d)return;const s=this.h.save();el('location-sheet-title').textContent=d.name;el('location-sheet-body').innerHTML=`<p class="intro">Consultez un poste avant de vous installer. Aucun trajet au simple aperçu.</p>${d.posts.map(id=>{const p=postById(id as import('../game/posts').PostId);return `<article class="next-step"><h3>${esc(p.name)}</h3><span class="state-pill">${postAccess(s,p.id)?'Accessible':'À débloquer'}</span><p class="intro">${esc(p.hint)}</p><p class="intro">${postAccess(s,p.id)?'Accès permanent':esc(postCondition(s,p.id))}</p>${p.id==='boat'?'<p class="intro">Contexte embarqué : vitesse et orientation animent la traîne.</p>':''}<button ${p.id===d.posts[0]?'id="location-select"':''} class="secondary" data-preview-post="${p.id}">Voir ce poste</button></article>`;}).join('')}`;this.h.open('location-sheet');}

    method(id: string) { const m = METHODS.find(m => m.id === id); if (!m)
        return; el('method-sheet-title').textContent = m.name; el('method-sheet-body').innerHTML = `<p class="intro">${m.description}</p><span class="state-pill">${!m.available?'À venir':(TECHNIQUE_IDS.includes(m.id as TechniqueId)?techniqueAccess(this.h.save(),m.id as TechniqueId):methodAccess(this.h.save(),m.id as import('../game/specimens').MethodId))?'Ouverte':'Initiation requise'}</span><h3 class="section-title">Emplacements prévus</h3><div class="slot-list">${m.slots.map(id => `<span>${FAMILIES.find(f => f[0] === id)?.[1]??SLOT_NAMES[id as keyof typeof SLOT_NAMES]??id}</span>`).join('')}</div><p class="warning-line">${m.available ? (TECHNIQUES.some(t=>t.id===m.id)?techniqueCondition(this.h.save(),m.id as TechniqueId)||'Technique ouverte ; canne et recette compatibles requises.':'Pratique conservée du carnet précédent.') : 'À venir : montage, animation et rencontres à implémenter avant de pouvoir lancer.'}</p>`; this.h.open('method-sheet'); }
    progression(){el('total-catches').hidden=true;const s=this.h.save(),level=levelFor(s.xp),next=80*level*level;el('player-progress').innerHTML=`<strong>Niveau ${level}</strong><span>${s.xp} XP · ${wallet(s)} écus</span>${meter(s.xp-80*(level-1)**2,next-80*(level-1)**2)}<small>${Math.max(0,next-s.xp)} XP avant le niveau ${level+1}</small><small>${Object.keys(s.records).length+new Set(s.observations.filter(o=>!s.records[o.speciesId]).map(o=>o.speciesId)).size} / ${SPECIES.length} découvertes</small>`;this.journey.progression();let summary=el('menu-next-step');if(!summary){el('menu').insertAdjacentHTML('beforeend','<button id="menu-next-step" class="next-step"></button>');summary=el('menu-next-step');summary.onclick=()=>this.h.open('progression');}summary.innerHTML=this.journey.summary();summary.setAttribute('aria-label','Prochaine étape : '+trackedObjective(s).title);}

    badge(id: string) { const b = BADGE_RULES.find(b => b.id === id); if (!b)
        return; const s = this.h.save(); el('badge-sheet-title').textContent = BADGES[id as keyof typeof BADGES]; el('badge-sheet-body').innerHTML = `<p class="intro">${b.description}</p>${meter(s.badges.includes(id) ? b.target : b.value(s), b.target)}<p class="intro">${s.badges.includes(id) ? 'Badge obtenu et enregistré.' : 'Objectif accessible avec le contenu actuel.'}</p><button id="badge-target" class="action">Poursuivre cet objectif</button>`; el('badge-target').onclick = () => { this.h.close('badge-sheet'); this.h.open(b.link === 'dex' ? 'encyclopedia' : b.link === 'journal' ? 'collection' : b.link); }; this.h.open('badge-sheet'); }
    aquariumSlots() { el('aq-replace-slot').innerHTML = this.h.save().favorites.map((id, i) => option(String(i), `Emplacement ${i + 1} · ${SPECIES.find(f => f.id === this.h.save().journal.find(s => s.id === id)?.speciesId)?.name}`)).join(''); el<HTMLButtonElement>('aq-replace').disabled = !this.h.save().favorites.length; }
}
