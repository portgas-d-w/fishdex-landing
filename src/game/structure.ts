import { SPECIES, SPOTS, type SpeciesId } from './catalog.ts';
import { ITEMS, accessLevel, rodCompatible } from './economy.ts';
import type { SaveData } from './save.ts';
import type { Specimen, MethodId } from './specimens.ts';
import { itemCondition } from './progression.ts';
import {COMPONENTS} from './rig.ts';
import {TECHNIQUES,recipeById} from './techniques.ts';
import { RARITIES, specimenRarity } from './rarity.ts';
export const METHODS = [
    {id:'pole',tier:'initiation',name:'Coup sans moulinet',available:true,bait:'worm',slots:['rod','elastic','line','leader','float','weight','hook','bait','groundbait','landing'],description:'Placement proche, profondeur et amorçage local. Canne et élastique après ferrage, aucune récupération au moulinet.'},
    { id: 'float', tier:'specialisation', name: 'Flotteur', available: true, bait: 'worm', slots: ['rod', 'reel', 'line', 'leader', 'hook', 'rig', 'float', 'weight', 'bait', 'landing'], description: 'Attendre la plongée du flotteur, puis ferrer.' },
    { id: 'bottom', tier:'specialisation', name: 'Fond', available: true, bait: 'worm', slots: ['rod', 'reel', 'line', 'leader', 'hook', 'rig', 'weight', 'bait', 'landing'], description: 'Montage posé, touche visible à la pointe. Favorise les poissons de fond.' },
    { id: 'lure', tier:'initiation', name: 'Leurre', available: true, bait: 'lure', slots: ['rod', 'reel', 'line', 'leader', 'lure', 'landing'], description: 'Récupérer et animer pour provoquer une attaque. Le leurre immobile ne suffit pas.' },
    ...TECHNIQUES.map(t=>({id:t.id,tier:t.level===1?'initiation':'specialisation',name:t.name,available:true,bait:t.base==='lure'?'lure':'worm',slots:[...new Set(['rod',t.reel?'reel':'elastic',...recipeById(t.defaultRecipe)!.slots.map(s=>s==='main_line'?'line':s==='attachment'?'rig':s),'landing'])],description:t.instruction})),
] as const;
export const FAMILIES = [
    ['rod', 'Cannes'], ['reel', 'Moulinets'], ['elastic','Élastiques'], ['line', 'Lignes'], ['leader', 'Bas de ligne'], ['hook', 'Hameçons'], ['rig', 'Montages'], ['float', 'Flotteurs'], ['weight', 'Plombs'], ['feeder', 'Feeders'], ['bait', 'Appâts naturels'], ['lure', 'Leurres'], ['groundbait', 'Amorces'], ['landing', 'Réception'], ['decor', 'Décorations'],['backing','Backing'],['fly_line','Soies'],['tippet','Pointes'],['bombette','Bombettes'],['fly','Mouches'],['swivel','Émerillons'],['snap','Agrafes'],['stop','Stops'],['bead','Perles'],['lead_clip','Clips'],['tube','Tubes'],['boom','Potences'],['hair','Cheveux'],['pva','PVA'],['indicator','Indicateurs'],['jig_head','Têtes plombées'],['nail_weight','Inserts'],['wire_arm','Tiges déportées'],['harness','Montures'],['clonk','Clonks'],
] as const;
export type Family = typeof FAMILIES[number][0];
export interface Gear {
    id: string;
    name: string;
    family: Family;
    state: 'available' | 'included' | 'future';
    price: number;
    level: number;
    methods: readonly string[];
    description: string;
    purchaseId?: typeof ITEMS[number]['id'];
}
const currentMethods = ['pole','float', 'bottom', 'lure'];
export const GEAR: readonly Gear[] = [
 ...COMPONENTS.filter((c,n,a)=>c.free&&a.findIndex(x=>x.free&&x.slot===c.slot)===n&&!['main_line','attachment'].includes(c.slot)).map(c=>({id:c.id,name:c.name,family:c.slot as Family,state:'included' as const,price:0,level:1,methods:c.methods,description:c.description})),
    ...ITEMS.map(i => ({ id: i.id, name: i.name, family: i.kind === 'rod' ? 'rod' as const : 'decor' as const, state: 'available' as const, price: i.price, level: accessLevel(i.id), methods: i.kind === 'rod' ? currentMethods.filter(m=>rodCompatible(i.id,m)) : [], description: i.description, purchaseId: i.id })),
    ...([
        ['elastic','Élastique au coup',['pole'],'Amortissement de la canne ; aucun moulinet ni frein.'],
        ['reel', 'Moulinet polyvalent', ['float','bottom','lure'], 'Frein automatique et récupération. Inclus dans le kit de bordure.'],
        ['line', 'Nylon de bordure', currentMethods, 'Élasticité et résistance liées à la canne équipée.'],
        ['leader', 'Bas de ligne universel', currentMethods, 'Liaison au montage, comprise dans le kit.'],
        ['hook', 'Hameçon simple', ['pole','float', 'bottom'], 'Pour le ver ; compris dans le montage de base.'],
        ['rig', 'Montage réutilisable', ['pole','float', 'bottom'], 'Flotteur ou fond selon la méthode choisie.'],
        ['float', 'Flotteur de bordure', ['pole','float'], 'Signal de touche en surface, immergé pendant le combat.'],
        ['weight', 'Plomb de montage', ['pole','float', 'bottom'], 'Lest adapté automatiquement à la méthode.'],
        ['bait', 'Ver', ['pole','float', 'bottom'], 'Réutilisable sans coût, pour les rencontres au naturel.'],
        ['lure', 'Petit leurre', ['lure'], 'Réutilisable. La récupération et l’animation déclenchent les touches.'],
        ['groundbait','Amorçage local',['pole','float'],'Attraction localisée 45 secondes, sans coût ; aucune capture garantie.'],
        ['landing', 'Tapis de réception', currentMethods, 'Présentation sur tapis pour les spécimens de 60 cm ou plus.'],
    ] as [
        Family,
        string,
        string[],
        string
    ][]).map(([family, name, methods, description]) => ({ id: `base-${family}`, name, family, state: 'included' as const, price: 0, level: 1, methods, description })),
    { id: 'base-feeder', name: 'Cage feeder de secours', family: 'feeder', state: 'included', price: 0, level: 1, methods: ['feeder','method_feeder'], description: 'Garniture avant le lancer, diffusion du dépôt et pertes attachées au montage.' },


];
export function gearState(g: Gear, save: SaveData) {
    if (g.state === 'future')
        return 'future';
    if (g.state === 'included' || g.purchaseId && save.inventory.includes(g.purchaseId))
        return 'owned';
    return itemCondition(save,g.id) ? 'locked' : 'available';
}
export function preparation(method: string, rod: string, bait: string) {
    const m = METHODS.find(m => m.id === method), r = GEAR.find(g => g.id === rod);
    if (!m?.available)
        return { valid: false, reason: 'Cette méthode est à venir.' };
    const technique=TECHNIQUES.find(t=>t.id===method);
    if (!r || !(technique?rodCompatible(rod,technique.base,technique.id):r.methods.includes(method)))
        return { valid: false, reason: 'Canne incompatible avec cette méthode.' };
    if (bait !== m.bait)
        return { valid: false, reason: 'Appât incompatible avec ce montage.' };
    return { valid: true, reason: 'Montage complet, prêt à lancer.' };
}
export const LOCATIONS = [
    { id: 'willow-pond', name: 'L’étang des Saules', available: true, description: 'Un matin calme. Quinze espèces selon poste, profondeur et présentation. Trois postes ouverts au début.', habitats: SPOTS.map(s => ({ id: s.id, name: s.name, description: s.hint, depth: s.id === 'open' ? '2–4 m' : '0,5–2 m' })), conditions: 'Matin fixe, eau calme. La profondeur et la végétation découlent du point de lancer.' },
    {id:'running-river',name:'La rivière des Aulnes',available:true,description:'Courant réel, dérive accompagnée et populations compatibles avec les modèles actuels.',habitats:[{id:'current',name:'Courant et graviers',description:'Retenez la ligne et contrôlez son immersion.',depth:'1–3 m'}],conditions:'Courant configuré du poste, réglable dans le profil de test.'},
 {id:'deep-lake',name:'Lac profond',available:true,description:'Couches profondes pour verticale et gambe ; espèces actuellement représentées.',habitats:[{id:'deep',name:'Ponton profond',description:'Couche et animation verticale.',depth:'6–18 m'}],conditions:'La profondeur du montage reste limitée par le fond réel.'},
 {id:'light-boat',name:'Embarcation légère',available:true,description:'Traîne mobile et clonk vertical.',habitats:[{id:'boat',name:'Parcours borné',description:'Vitesse et orientation influencent le point de pêche.',depth:'8–16 m'}],conditions:'Mouvement en traîne ; arrêt lors de la prise et du combat.'},
];
export const BADGE_RULES = [
    { id: 'first', description: 'Capturer un premier poisson.', target: 1, value: (s: SaveData) => s.total, link: 'dex' },
    { id: 'diversity', description: 'Découvrir les quinze espèces jouables de l’étang.', target: SPECIES.length, value: (s: SaveData) => Object.keys(s.records).length, link: 'dex' },
    { id: 'contact', description: 'Terminer un combat avec un contact contrôlé.', target: 1, value: (s: SaveData) => s.journal.filter(f => f.controlled).length, link: 'help' },
    { id: 'lure', description: 'Réussir une prise au leurre.', target: 1, value: (s: SaveData) => s.journal.filter(f => f.method === 'lure').length, link: 'preparation' },
    { id: 'bottom', description: 'Réussir une prise au fond.', target: 1, value: (s: SaveData) => s.journal.filter(f => f.method === 'bottom').length, link: 'preparation' },
    { id: 'collector', description: 'Conserver dix rencontres dans le carnet.', target: 10, value: (s: SaveData) => s.total, link: 'journal' },
    { id: 'record', description: 'Améliorer un record après la première capture.', target: 1, value: (s: SaveData) => s.journal.filter(f => f.reward.record > 0).length, link: 'journal' },
];
export interface JournalFilter {
    species?: string;
    variant?: string;
    rarity?: string;
    location?: string;
    method?: string;
    after?: string;
    before?: string;
    minLength?: number;
    maxLength?: number;
    minWeight?: number;
    maxWeight?: number;
    favorite?: boolean;
    view?: string;
    sort?: string;
}
export const rarityOf = (s: Specimen) => RARITIES.find(r=>r.id===specimenRarity(s))!.rank;
export function filterJournal(save: SaveData, f: JournalFilter): Specimen[] {
    const results = save.journal.filter(s => (!f.species || s.speciesId === f.species) && (!f.variant || f.variant === 'mirage' && s.mirage || f.variant === s.coloration) && (!f.rarity || rarityOf(s) === Number(f.rarity)) && (!f.location || s.location === f.location) && (!f.method || s.method === f.method || s.technique===f.method) && (!f.after || s.date.slice(0, 10) >= f.after) && (!f.before || s.date.slice(0, 10) <= f.before) && s.length >= (f.minLength ?? 0) && s.length <= (f.maxLength ?? Infinity) && s.weight >= (f.minWeight ?? 0) && s.weight <= (f.maxWeight ?? Infinity) && (!f.favorite || save.favorites.includes(s.id)) && (!f.view || f.view === 'latest' || f.view === 'records' && s.length === save.records[s.speciesId]?.best || f.view === 'first' && s.reward.discovery > 0 || f.view === 'variants' && (s.mirage || s.coloration !== 'natural') || f.view === 'favorites' && save.favorites.includes(s.id))).sort((a, b) => f.sort === 'weight' ? b.weight - a.weight : f.sort === 'length' ? b.length - a.length : f.sort === 'rarity' ? rarityOf(b) - rarityOf(a) || b.date.localeCompare(a.date) : b.date.localeCompare(a.date));
    return f.view === 'latest' ? results.slice(0, 10) : results;
}
export const speciesMastery = (save: SaveData, id: SpeciesId) => Math.min(5, save.records[id]?.count ?? 0);
export const ANIMATION_STATES = { calm: 'procedural', fast: 'procedural', suspended: 'absent', mat: 'procedural', breathing: 'absent' } as const;
export const methodName = (id: MethodId) => METHODS.find(m => m.id === id)!.name;
