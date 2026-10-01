import './style.css';
import { FishingGame } from './game/fishing';
import { SPECIES, SPOTS } from './game/catalog';
import type { SpotId, BaitId } from './game/catalog';
import { emptySave, loadSave, persistSave, recordCatch, parseSave, MAX_SAVE_BYTES, purchase, toggleFavorite } from './game/save';
import type { SaveData } from './game/save';
import { LakeWorld } from './render/world';
import { FishPreview } from './render/fish-preview';
import { GameAudio } from './ui/audio';
import { aimFromGesture } from './game/casting';
import fishdex from './game/fishdex.json';
import { ITEMS, BADGES, levelFor } from './game/economy';
import type { ItemId } from './game/economy';
import type { Specimen } from './game/specimens';
import { getPhoto, storePhoto } from './ui/photos';
import { Aquarium } from './render/aquarium';
import { Engine } from '@babylonjs/core/Engines/engine';

const icon = (path: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const icons = {
  book: icon('<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15M6 8h3M6 11h3M15 8h3M15 11h3"/>'),
  sound: icon('<path d="m11 4-5 5H3v6h3l5 5V4Z"/><path d="M15 8c3 2 3 6 0 8M18 5c5 4 5 10 0 14"/>'),
  cast: icon('<path d="M4 21 15 6M12 3c5 0 9 4 9 9v5a3 3 0 0 1-6 0v-2M6 16l3 2"/>'),
  fish: icon('<path d="M5 12c5-8 12-8 17 0-5 8-12 8-17 0ZM5 12 1 8v8l4-4Z"/><circle cx="17" cy="11" r=".7"/>'),
};
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<header class="topbar">
  <div class="brand"><div class="brand-mark">${icons.fish}</div><div><h1>Au fil de l’eau</h1><div class="eyebrow">Un instant au bord de l’eau</div></div></div>
  <nav class="nav" aria-label="Menu du jeu"><button id="collection-open" class="nav-button" aria-label="Ouvrir le carnet">${icons.book}<span>Mon carnet</span><small id="collection-count">0 / 5</small></button><button id="sound" class="nav-button icon-button" aria-label="Activer le son" aria-pressed="false">${icons.sound}</button></nav>
</header>
<section class="location" aria-label="Lieu de pêche"><div class="eyebrow">L’étang des Saules</div><p id="spot-name">La roselière</p><div class="time"><span class="sun-dot"></span>À l’aube · Eau calme</div></section>
<aside class="journal-note">Il suffit parfois<br>d’un peu de patience.<small>Votre parenthèse au grand air</small></aside>
<div class="water-label" id="water-label"><span class="target-ring"></span><span id="water-text">Votre coin de pêche</span></div>
<main class="bottom">
  <div class="spots" aria-label="Choisir un poste">${SPOTS.map(s => `<button class="spot" data-spot="${s.id}" aria-pressed="${s.id === 'reeds'}" title="${s.hint}"><span class="number">${s.number}</span>${s.name}</button>`).join('')}</div>
  <section class="play-card" aria-label="Commandes de pêche">
    <div class="card-heading"><span class="status-tag" id="status">À vous de jouer</span><div class="bait-switch" aria-label="Choisir un appât"><button data-bait="worm" aria-pressed="true">Ver</button><button data-bait="lure" aria-pressed="false">Petit leurre</button></div></div>
    <h2 class="instruction" id="instruction" aria-live="polite">L’eau vous attend.</h2><p class="hint" id="hint">Choisissez un coin, lancez votre ligne et prenez le temps.</p>
    <div class="progress-ui" id="progress-ui" hidden><div class="meter-labels"><span>Tension du fil</span><span id="tension-label">32 %</span></div><div class="tension-track" role="meter" aria-label="Tension du fil" aria-valuemin="0" aria-valuemax="100" aria-valuenow="32" id="tension-meter"><div class="tension-pointer" id="tension-pointer"></div></div><div class="distance-track" role="progressbar" aria-label="Poisson ramené" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="catch-meter"><div class="distance-fill" id="distance-fill"></div></div><p class="fight-note" id="fight-note">Moulinez entre ses départs.</p></div>
    <button id="action" class="action">${icons.cast}<span id="action-label">Lancer la ligne</span></button>
    <p class="key-hint" id="key-hint">Un geste pour lancer. Un peu de patience pour la suite.</p>
  </section>
  <footer class="footer"><span id="total-catches">Aucune prise, tout à découvrir</span><button id="help-open">Comment jouer&nbsp; ↗</button></footer>
</main>
<div class="toast" id="toast" role="status" hidden></div>
<div class="paused-banner" id="paused" hidden>Votre partie est en pause.<button id="resume">Reprendre au bord de l’eau</button></div>
<dialog id="collection" class="modal"><div class="modal-header"><div><div class="eyebrow">Les souvenirs de l’étang</div><h2>Mon carnet</h2></div><button class="close" data-close="collection" aria-label="Fermer le carnet">×</button></div><p class="intro">Chaque nouvelle espèce ouvre une page. Chaque belle prise peut devenir votre record.</p><div id="collection-list" class="collection-list"></div><div class="tools"><button class="secondary" id="export-save">Exporter le carnet</button><button class="secondary" id="import-save">Importer un carnet</button></div><input id="save-file" type="file" accept=".json,application/json" hidden><div id="import-review" hidden><p id="import-description" class="warning-line"></p><button class="secondary" id="confirm-import">Remplacer mon carnet</button><button class="secondary" id="cancel-import">Annuler</button></div><p class="modal-footnote">Votre carnet reste dans ce navigateur. Exportez-le pour le conserver ou le transférer sur un autre appareil.</p></dialog>
<dialog id="help" class="modal"><div class="modal-header"><h2>Le plaisir de la prise.</h2><button class="close" data-close="help" aria-label="Fermer l’aide">×</button></div><div class="help-steps"><div class="help-step"><b>01</b><div><strong>Trouvez votre coin.</strong><p>Le ver attire gardons, perches et carpes. Le petit leurre intéresse les perches, brochets et sandres. Changez de poste pour varier les rencontres.</p></div></div><div class="help-step"><b>02</b><div><strong>Gardez un œil sur le bouchon.</strong><p>Lancez, puis attendez la touche. Appuyez sur « Ferrer » dès que le poisson mord.</p></div></div><div class="help-step"><b>03</b><div><strong>Ressentez le combat.</strong><p>Maintenez le bouton pour mouliner. Relâchez quand le poisson tire ou que la tension monte. Si le fil reste détendu trop longtemps, le poisson se décroche.</p></div></div></div><p class="modal-footnote">Sur ordinateur : espace pour lancer, ferrer et maintenir le moulinet. Tous les poissons sont remis à l’eau.</p><div class="setting-row"><span>Qualité graphique</span><button id="quality">Économie mobile</button></div></dialog>
<dialog id="caught" class="modal catch-modal"><div class="eyebrow" id="catch-heading">Une belle rencontre</div><h2 id="catch-name"></h2><p class="latin" id="catch-latin"></p><canvas class="fish-preview" id="fish-preview" aria-label="Aperçu 3D du poisson capturé"></canvas><p class="warning-line" id="preview-error" hidden>Aperçu indisponible. Votre prise est bien enregistrée.</p><p class="catch-size"><span id="catch-length"></span> <small>cm</small></p><div class="catch-badges" id="catch-badges"></div><p class="catch-description" id="catch-description"></p><button id="release-fish" class="action">Remettre à l’eau</button><p class="modal-footnote">La rencontre reste dans votre carnet.</p></dialog>
<div class="loading" id="loading"><div class="spinner"></div><h2>Au fil de l’eau</h2><p>Un instant… l’étang se réveille.</p></div>`;

const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
el('app').insertAdjacentHTML('beforeend', `
<dialog id="encyclopedia" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Les pages de FishDex</div><h2>Encyclopédie</h2></div><button class="close" data-close="encyclopedia" aria-label="Fermer l’encyclopédie">×</button></div><p class="intro">${fishdex.provenance.biologicalGroups} groupes biologiques · ${fishdex.provenance.sourceEntries} fiches avec variétés. ${SPECIES.length} espèces jouables. Les autres sont prévues.</p><div class="filters"><input id="dex-search" type="search" placeholder="Nom, variété ou technique" aria-label="Rechercher un poisson"><select id="dex-category" aria-label="Catégorie"><option value="all">Toutes les eaux</option><option value="paisibles">Paisibles</option><option value="predateurs">Prédateurs</option><option value="eaux-vives">Eaux vives</option></select><select id="dex-state" aria-label="Découvertes"><option value="all">Toutes les fiches</option><option value="playable">Jouables</option><option value="discovered">Découvertes</option><option value="mirage">Variantes Mirage</option></select></div><div id="dex-list"></div><p class="modal-footnote">Référence locale FishDex. La rareté est une règle de rencontre du jeu, distincte de la conservation des espèces.</p></dialog>
<dialog id="shop" class="modal"><div class="modal-header"><div><div class="eyebrow">Le matériel du bord</div><h2>Boutique</h2></div><button class="close" data-close="shop" aria-label="Fermer la boutique">×</button></div><p class="intro" id="shop-balance"></p><div id="shop-list" class="collection-list"></div><p class="modal-footnote">Monnaie virtuelle gagnée avec vos souvenirs de pêche. Canne et appâts de base réutilisables, toujours disponibles.</p></dialog>`);
document.querySelector('.topbar')!.insertAdjacentHTML('afterend', '<nav class="travel-nav" aria-label="Explorer le jeu"><button id="dex-open">Encyclopédie</button><button id="shop-open">Boutique</button><button id="aquarium-open">Aquarium</button><span id="player-progress"></span></nav>');
el('collection-list').insertAdjacentHTML('afterend', '<h3 class="section-title">Mes spécimens</h3><p class="intro" id="journal-intro"></p><div id="journal-list" class="journal-list"></div><button class="secondary" id="journal-more" hidden>Souvenirs suivants</button><div id="mastery-list" class="tools"></div>');
el('catch-length').parentElement!.insertAdjacentHTML('afterend', '<p id="catch-weight" class="intro"></p><p id="catch-reward" class="reward-line"></p><p id="photo-state" class="modal-footnote"></p><button id="favorite-catch" class="secondary">Ajouter aux favoris</button>');
el('app').insertAdjacentHTML('beforeend', '<dialog id="aquarium" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Une pause sous la surface</div><h2>Mon aquarium</h2></div><button class="close" data-close="aquarium" aria-label="Fermer l’aquarium">×</button></div><canvas id="aquarium-canvas" aria-label="Aquarium 3D de vos cinq favoris"></canvas><p class="intro" id="aquarium-state">Choisissez vos spécimens favoris dans le carnet.</p><div class="filters"><select id="aquarium-choice" aria-label="Choisir un spécimen"></select><button class="secondary" id="aquarium-add">Ajouter</button></div><div id="aquarium-favorites" class="collection-list"></div><h3 class="section-title">L’ambiance du bassin</h3><div class="aquarium-settings"><label>Sol<select id="aq-floor"><option value="sand">Sable clair</option><option value="gravel">Gravier sombre</option></select></label><label>Fond<select id="aq-background"><option value="dawn">Aube</option><option value="night">Nuit</option></select></label><label>Lumière<select id="aq-light"><option value="warm">Chaleureuse</option><option value="cool">Fraîche</option></select></label><label><input id="aq-plants" type="checkbox"> Plantes achetées</label><label><input id="aq-rocks" type="checkbox"> Rochers achetés</label></div><p class="modal-footnote">Cinq individus, leurs robes et leurs gabarits. Aucun entretien ni pénalité d’absence. Les plantes et rochers se trouvent en boutique.</p></dialog>');
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* navigation privée restrictive */ }
const loaded = storage ? loadSave(storage) : { data: emptySave(), warning: 'Sauvegarde locale indisponible. Pensez à exporter le carnet.' };
let save = loaded.data;
const game = new FishingGame();
const audio = new GameAudio(); audio.enabled = save.settings.sound;
let world: LakeWorld | undefined;
let preview: FishPreview | undefined;
let overlayPaused = false;
let manualPaused = false;
let lastPhase = game.phase;
let toastTimer = 0;
let pendingImport: SaveData | undefined;
let catchViewRequest = 0;
let storageWarningShown = false;
let qaSimulationPaused = false;
let aquarium: Aquarium | undefined;
let aquariumRequest = 0;
let viewedSpecimen: Specimen | undefined;
let liveCatchView = false;
let journalLimit = 30;
const photoUrls: string[] = [];
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function equip() { const item = ITEMS.find(i => i.id === save.equipped)!; game.equipment = item.id; game.equipmentPower = item.power; }
equip();

function toast(message: string) { el('toast').textContent = message; el('toast').hidden = false; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el('toast').hidden = true, 5000); }
function saveNow() {
  if ((!storage || !persistSave(save, storage)) && !storageWarningShown) {
    storageWarningShown = true; toast('Sauvegarde locale impossible. Exportez votre carnet pour le conserver.');
  }
}
function openModal(id: string) { release(); cancelGesture(); overlayPaused = true; el<HTMLDialogElement>(id).showModal(); }
function closeModal(id: string) { el<HTMLDialogElement>(id).close(); }
function refreshCollection() {
  el('player-progress').textContent = `Niv. ${levelFor(save.xp)} · ${save.coins} écus`;
  el('collection-count').textContent = `${Object.keys(save.records).length} / ${SPECIES.length}`;
  el('total-catches').textContent = save.total ? `${save.total} rencontre${save.total > 1 ? 's' : ''} · ${Object.keys(save.records).length} espèce${Object.keys(save.records).length > 1 ? 's' : ''}` : 'Aucune prise, tout à découvrir';
  el('collection-list').innerHTML = SPECIES.map((species, i) => {
    const record = save.records[species.id];
    return `<article class="fish-entry ${record ? '' : 'undiscovered'}"><span class="fish-number">0${i + 1}</span><div><h3>${record ? species.name : 'À découvrir'}</h3><p>${record ? `${record.count} rencontre${record.count > 1 ? 's' : ''} · ${species.latin}` : (i === 0 || i === 2 ? 'Tentez votre chance au ver.' : 'Essayez le petit leurre.')}</p></div><div class="best">${record ? record.best.toLocaleString('fr-FR') : '—'}${record ? '<small> cm</small>' : ''}</div></article>`;
  }).join('');
  for (const url of photoUrls) URL.revokeObjectURL(url); photoUrls.length = 0;
  const captures = [...save.journal].reverse().slice(0, journalLimit);
  el('journal-intro').textContent = save.journal.length ? `${save.journal.length} souvenir(s) · ${save.favorites.length} / 5 favoris · ${Object.keys(save.variants).length} apparence(s)` : 'Les prises de l’ancien carnet gardent leurs records. Les nouvelles auront leur fiche et leur photo.';
  el('journal-list').innerHTML = captures.map(s => `<article class="specimen-card"><button class="specimen-view" data-specimen="${escape(s.id)}"><div class="photo-placeholder" data-photo="${escape(s.id)}">Souvenir 3D</div><div><strong>${SPECIES.find(f => f.id === s.speciesId)!.name}${s.mirage ? ' · Mirage' : ''}</strong><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg · ${s.coloration === 'golden' ? 'Reflets dorés' : 'Robe naturelle'}</p><small>${new Date(s.date).toLocaleDateString('fr-FR')} · ${s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'}</small></div></button><button class="secondary" data-favorite="${escape(s.id)}" aria-pressed="${save.favorites.includes(s.id)}">${save.favorites.includes(s.id) ? 'Retirer le favori' : 'Favori'}</button></article>`).join('');
  el('journal-more').hidden = save.journal.length <= journalLimit;
  el('mastery-list').innerHTML = save.badges.map(b => `<span class="badge">${BADGES[b as keyof typeof BADGES]}</span>`).join('');
  for (const s of captures) void getPhoto(s.id).then(blob => {
    const target = Array.from(document.querySelectorAll<HTMLElement>('[data-photo]')).find(e => e.dataset.photo === s.id);
    if (!blob || !target || !target.isConnected) return;
    const url = URL.createObjectURL(blob); photoUrls.push(url); const img = document.createElement('img'); img.src = url; img.alt = `Photo de ${SPECIES.find(f => f.id === s.speciesId)!.name}`; target.replaceChildren(img);
  });
}
function refreshDex() {
  const search = el<HTMLInputElement>('dex-search').value.trim().toLocaleLowerCase('fr');
  const category = el<HTMLSelectElement>('dex-category').value, state = el<HTMLSelectElement>('dex-state').value;
  const groups = new Map<string, typeof fishdex.entries>();
  for (const entry of fishdex.entries) { const rows = groups.get(entry.biologicalId) ?? []; rows.push(entry); groups.set(entry.biologicalId, rows); }
  const labels: Record<string, string> = { commun: 'Commun', 'peu commun': 'Peu commun', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire', mirage: 'Mirage' };
  const cards = [...groups.values()].filter(rows => rows.some(e => (category === 'all' || e.category === category) && (!search || `${e.name} ${e.latin} ${e.techniques.join(' ')}`.toLocaleLowerCase('fr').includes(search))) && (state === 'all' || state === 'mirage' && rows.some(e => e.rarity === 'mirage') || state === 'playable' && rows.some(e => e.gameId) || state === 'discovered' && rows.some(e => e.gameId && save.records[e.gameId as keyof typeof save.records])));
  el('dex-list').innerHTML = cards.map(rows => {
    const base = rows.find(e => e.gameId) ?? rows[0], known = base.gameId && save.records[base.gameId as keyof typeof save.records];
    return `<details class="dex-card"><summary><div class="dex-illustration">${known && base.image ? `<img src="${base.image}" loading="lazy" alt="${escape(base.name)}">` : '<span class="silhouette">◇</span>'}</div><div><strong>${escape(base.name)}</strong><p>${escape(base.latin)}</p><small>${base.gameId ? known ? 'Découverte · Jouable' : 'À découvrir · Jouable' : 'Prévue · Modèle absent'} · ${rows.length} fiche(s)</small></div></summary><p>${escape(base.description)}</p>${base.hint ? `<p>${escape(base.hint)}</p>` : ''}<p>${base.min ?? '—'}–${base.max ?? '—'} cm · ${labels[base.rarity] ?? base.rarity}</p><p>Référence : ${escape(base.techniques.join(' · '))}</p>${rows.length > 1 ? `<div class="variant-list">${rows.map(e => `<span>${escape(e.name)} · ${labels[e.rarity] ?? e.rarity}${e.gameId ? ' · jouable' : ' · prévue'}</span>`).join('')}</div>` : ''}</details>`;
  }).join('') || '<p class="intro">Aucune fiche avec ces filtres.</p>';
}
function refreshShop() {
  el('shop-balance').textContent = `${save.coins} écus · Niveau ${levelFor(save.xp)} (${save.xp} XP). Matériel actuel : ${ITEMS.find(i => i.id === save.equipped)!.name}.`;
  el('shop-list').innerHTML = ITEMS.map(i => `<article class="shop-item"><h3>${i.name}</h3><p>${i.description}</p><button class="secondary" data-buy="${i.id}" ${save.inventory.includes(i.id) ? 'disabled' : ''}>${save.inventory.includes(i.id) ? 'Possédé' : `${i.price} écus · Acheter`}</button>${i.kind === 'rod' && save.inventory.includes(i.id) ? `<button class="secondary" data-equip="${i.id}" ${save.equipped === i.id || game.phase !== 'idle' ? 'disabled' : ''}>${save.equipped === i.id ? 'Équipée' : game.phase !== 'idle' ? 'Après cette partie' : 'Équiper'}</button>` : ''}</article>`).join('');
}
function refreshAquariumControls() {
  const favorites = save.favorites.map(id => save.journal.find(s => s.id === id)!);
  el('aquarium-choice').innerHTML = save.journal.filter(s => !save.favorites.includes(s.id)).slice().reverse().map(s => `<option value="${escape(s.id)}">${SPECIES.find(f => f.id === s.speciesId)!.name} · ${s.length} cm · ${new Date(s.date).toLocaleDateString('fr-FR')}</option>`).join('') || '<option value="">Pêchez un nouveau souvenir</option>';
  el<HTMLButtonElement>('aquarium-add').disabled = !save.journal.some(s => !save.favorites.includes(s.id));
  el('aquarium-favorites').innerHTML = favorites.map(s => `<article class="fish-entry"><div><h3>${SPECIES.find(f => f.id === s.speciesId)!.name}</h3><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg${s.mirage ? ' · Mirage' : ''}</p><button class="secondary" data-aq-view="${escape(s.id)}">Fiche</button><button class="secondary" data-aq-remove="${escape(s.id)}">Retirer</button></div></article>`).join('');
  el<HTMLSelectElement>('aq-floor').value = save.aquarium.floor; el<HTMLSelectElement>('aq-background').value = save.aquarium.background; el<HTMLSelectElement>('aq-light').value = save.aquarium.light;
  for (const id of ['plants', 'rocks'] as const) { el<HTMLInputElement>(`aq-${id}`).checked = save.aquarium[id]; el<HTMLInputElement>(`aq-${id}`).disabled = !save.inventory.includes(id); }
}
async function loadAquarium() {
  const request = ++aquariumRequest; aquarium?.dispose(); aquarium = undefined;
  el('aquarium-canvas').dataset.loaded = 'false'; el('aquarium-state').textContent = 'Le bassin se réveille…'; refreshAquariumControls();
  try {
    if (request !== aquariumRequest) return;
    aquarium = new Aquarium(el<HTMLCanvasElement>('aquarium-canvas'), save.settings.quality); aquarium.customize(save.aquarium);
    const result = await aquarium.show(save.favorites.map(id => save.journal.find(s => s.id === id)!));
    if (request !== aquariumRequest) return;
    el('aquarium-canvas').dataset.loaded = 'true';
    el('aquarium-state').textContent = `${result.loaded} / 5 favoris dans le bassin.${result.errors ? ' Un modèle n’a pas pu être chargé ; vos favoris sont conservés.' : result.loaded ? ' Une nage paisible, chacun à son rythme.' : ' Ajoutez des spécimens depuis votre carnet.'}`;
  } catch { if (request === aquariumRequest) el('aquarium-state').textContent = 'Le bassin n’a pas pu démarrer. Fermez et réessayez ; vos favoris sont conservés.'; }
}
function refreshSettings() {
  el('sound').setAttribute('aria-pressed', String(save.settings.sound));
  el('sound').setAttribute('aria-label', save.settings.sound ? 'Couper le son' : 'Activer le son');
  el('sound').style.opacity = save.settings.sound ? '1' : '.6';
  el('quality').textContent = save.settings.quality === 'eco' ? 'Économie mobile' : 'Qualité élevée';
}
function renderPhase() {
  document.body.dataset.phase = game.phase;
  const phase = game.phase;
  const messages = {
    idle: ['À vous de jouer', 'L’eau vous attend.', 'Choisissez un coin, lancez votre ligne et prenez le temps.', 'Lancer la ligne'],
    casting: ['La ligne s’envole', 'Juste là…', 'Le bouchon rejoint votre coin de pêche.', 'Lancer en cours…'],
    waiting: ['À l’écoute de l’eau', 'Un peu de patience.', 'Gardez un œil sur le bouchon. La touche arrive.', 'En attente d’une touche…'],
    bite: ['Ça mord !', 'À vous de ferrer !', 'Le bouchon plonge. Appuyez maintenant pour accrocher le poisson.', 'Ferrer !'],
    fighting: ['Le combat commence', 'Gardez le fil.', 'Maintenez pour mouliner. Relâchez quand la tension monte.', 'Maintenir pour mouliner'],
    caught: ['Une rencontre de plus', 'Bien joué.', 'Votre prise rejoint le carnet.', 'Poisson capturé'],
    lost: ['Ce n’est que partie remise', 'Il a filé…', game.failure, 'Retenter ma chance'],
  }[phase];
  el('status').textContent = messages[0]; el('instruction').textContent = messages[1]; el('hint').textContent = messages[2]; el('action-label').textContent = messages[3];
  el<HTMLButtonElement>('action').disabled = ['casting', 'waiting', 'caught'].includes(phase);
  el('action').classList.toggle('bite', phase === 'bite'); el('progress-ui').hidden = phase !== 'fighting';
  document.querySelectorAll<HTMLButtonElement>('[data-spot], [data-bait]').forEach(button => button.disabled = phase !== 'idle');
  el('water-label').hidden = phase !== 'idle' && phase !== 'waiting';
  el('water-text').textContent = phase === 'waiting' ? 'Écoutez le calme' : 'Votre coin de pêche';
  el('key-hint').innerHTML = phase === 'fighting' ? 'Maintenez, puis relâchez · Au doigt ou au clavier' : 'Un geste pour lancer. Un peu de patience pour la suite.';
}
async function showCatch() {
  if (!game.result || !game.fish) return;
  const badges = recordCatch(save, game.result); saveNow(); refreshCollection();
  const specimen = save.journal.find(s => s.id === game.result!.id)!;
  viewedSpecimen = specimen; liveCatchView = true;
  el('catch-heading').textContent = badges.first ? 'Une nouvelle page du carnet' : badges.record ? 'Votre nouveau record' : 'Une belle rencontre';
  el('catch-name').textContent = game.fish.name; el('catch-latin').textContent = game.fish.latin;
  el('catch-length').textContent = game.result.length.toLocaleString('fr-FR');
  el('catch-description').textContent = game.fish.description;
  refreshSpecimenInfo(specimen, true);
  el('catch-badges').innerHTML = `${badges.first ? '<span class="badge">Nouvelle espèce</span>' : ''}${badges.record ? '<span class="badge">Record personnel</span>' : '<span class="badge">Ajouté au carnet</span>'}`;
  el('preview-error').hidden = true; el('fish-preview').dataset.loaded = 'false'; openModal('caught'); audio.tone('catch');
  const request = ++catchViewRequest;
  try {
    preview ??= new FishPreview(el<HTMLCanvasElement>('fish-preview'));
    const ok = await preview.show(game.fish, specimen);
    if (request === catchViewRequest) { el('preview-error').hidden = ok; el('fish-preview').dataset.loaded = String(ok); }
    if (ok && request === catchViewRequest) await photograph(specimen, request);
  } catch {
    if (request === catchViewRequest) el('preview-error').hidden = false;
  }
}
function refreshSpecimenInfo(s: Specimen, reward: boolean) {
  el('catch-weight').textContent = `${s.weight.toLocaleString('fr-FR')} kg · ${s.coloration === 'golden' ? 'Reflets dorés' : 'Robe naturelle'}${s.mirage ? ' · Mirage' : ''}`;
  const r = s.reward;
  el('catch-reward').textContent = reward ? `+${r.coins} écus · +${r.xp} XP — Photo ${r.base}${r.discovery ? `, découverte +${r.discovery}` : ''}${r.record ? `, record +${r.record}` : ''}` : `${new Date(s.date).toLocaleString('fr-FR')} · ${s.location} · ${s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'} · ${ITEMS.find(i => i.id === s.equipment)?.name ?? 'Canne de bordure'}`;
  el('favorite-catch').textContent = save.favorites.includes(s.id) ? 'Retirer des favoris' : 'Ajouter aux favoris';
  el('photo-state').textContent = 'La photo se prépare…';
  el('release-fish').textContent = reward ? 'Remettre à l’eau' : 'Retour au carnet';
}
async function photograph(s: Specimen, request: number) {
  let blob = await getPhoto(s.id);
  if (!blob && request === catchViewRequest) blob = await preview?.photo() ?? undefined;
  const ok = !!blob && await storePhoto(s.id, blob);
  if (request === catchViewRequest) el('photo-state').textContent = ok ? 'Photo conservée sur cet appareil. Votre souvenir reste dans le carnet.' : 'Photo indisponible. Votre capture et ses gains sont conservés.';
}
async function showSpecimen(s: Specimen) {
  aquarium?.pause();
  viewedSpecimen = s; liveCatchView = false; const fish = SPECIES.find(f => f.id === s.speciesId)!;
  el('catch-heading').textContent = 'Un souvenir au bord de l’eau'; el('catch-name').textContent = fish.name; el('catch-latin').textContent = fish.latin; el('catch-length').textContent = s.length.toLocaleString('fr-FR'); el('catch-description').textContent = fish.description;
  el('catch-badges').textContent = s.mirage ? 'Mirage · Variante du jeu' : '';
  refreshSpecimenInfo(s, false); el('fish-preview').dataset.loaded = 'false'; el('preview-error').hidden = true; openModal('caught');
  const request = ++catchViewRequest;
  try { preview ??= new FishPreview(el<HTMLCanvasElement>('fish-preview')); const ok = await preview.show(fish, s); if (request === catchViewRequest) { el('fish-preview').dataset.loaded = String(ok); el('preview-error').hidden = ok; if (ok) await photograph(s, request); } } catch { if (request === catchViewRequest) el('preview-error').hidden = false; }
}
function phaseChanged() {
  if (game.phase === lastPhase) return;
  lastPhase = game.phase; renderPhase();
  if (game.phase === 'bite') audio.tone('bite');
  if (game.phase === 'caught') void showCatch();
}
function activate() {
  if (!world || overlayPaused || manualPaused) return;
  void audio.unlock();
  if (game.phase === 'idle') { game.cast(); audio.tone('cast'); }
  else if (game.phase === 'bite') game.strike();
  else if (game.phase === 'lost') game.reset();
  phaseChanged();
}
let reelPointer: number | undefined;
let gesture: { id: number; x: number; y: number; yaw: number; lift: number; casting: boolean } | undefined;
function cancelGesture() { gesture = undefined; world?.aim(); }
function release() { reelPointer = undefined; game.release(); el('action').classList.remove('reeling'); }
function hold() {
  if (game.phase === 'fighting' && !overlayPaused && !manualPaused) { game.reeling = true; el('action').classList.add('reeling'); void audio.unlock(); }
}
el('action').addEventListener('click', activate);
el('action').addEventListener('pointerdown', event => { if (event.button !== 0) return; reelPointer = event.pointerId; el('action').setPointerCapture(event.pointerId); hold(); });
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) el('action').addEventListener(type, release);
window.addEventListener('pointerup', event => { if (event.pointerId === reelPointer) release(); });
const canvas = el<HTMLCanvasElement>('world');
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0 || gesture || overlayPaused || manualPaused || !['idle', 'fighting'].includes(game.phase)) return;
  gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: game.rodYaw, lift: game.rodLift, casting: game.phase === 'idle' };
  canvas.setPointerCapture(event.pointerId); void audio.unlock();
});
canvas.addEventListener('pointermove', event => {
  if (!gesture || gesture.id !== event.pointerId) return;
  const dx = event.clientX - gesture.x; const dy = event.clientY - gesture.y;
  if (gesture.casting) { const aim = aimFromGesture(dx, dy, innerWidth, innerHeight); world?.aim(aim); el('hint').textContent = aim.valid ? `Cible à ${Math.round(Math.hypot(aim.point.x, aim.point.z))} m · ${aim.depth} m de fond` : aim.reason; }
  else game.orient(gesture.yaw + dx / innerWidth * 3.5, gesture.lift - dy / innerHeight * 3);
});
canvas.addEventListener('pointerup', event => {
  if (!gesture || gesture.id !== event.pointerId) return;
  if (gesture.casting) {
    const aim = aimFromGesture(event.clientX - gesture.x, event.clientY - gesture.y, innerWidth, innerHeight);
    if (aim.valid && game.cast(aim.point)) { audio.tone('cast'); phaseChanged(); el('spot-name').textContent = SPOTS.find(s => s.id === game.spot)!.name; }
    else toast(aim.reason);
  }
  cancelGesture();
});
for (const type of ['pointercancel', 'lostpointercapture']) canvas.addEventListener(type, cancelGesture);
window.addEventListener('resize', cancelGesture);
window.addEventListener('keydown', event => {
  if (event.code !== 'Space' || event.repeat || event.target instanceof HTMLInputElement || overlayPaused || manualPaused) return;
  if (event.target instanceof HTMLElement && event.target.closest('button') && event.target !== el('action')) return;
  event.preventDefault(); if (game.phase === 'fighting') hold(); else activate();
});
window.addEventListener('keyup', event => { if (event.code === 'Space') { event.preventDefault(); release(); } });
document.querySelectorAll<HTMLButtonElement>('[data-spot]').forEach(button => button.addEventListener('click', () => {
  game.setSpot(button.dataset.spot as SpotId);
  document.querySelectorAll<HTMLElement>('[data-spot]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.spot === game.spot)));
  el('spot-name').textContent = SPOTS.find(s => s.id === game.spot)!.name;
}));
document.querySelectorAll<HTMLButtonElement>('[data-bait]').forEach(button => button.addEventListener('click', () => {
  game.setBait(button.dataset.bait as BaitId);
  document.querySelectorAll<HTMLElement>('[data-bait]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bait === game.bait)));
}));
el('collection-open').onclick = () => { refreshCollection(); openModal('collection'); };
el('help-open').onclick = () => openModal('help');
el('dex-open').onclick = () => { refreshDex(); openModal('encyclopedia'); };
for (const id of ['dex-search', 'dex-category', 'dex-state']) el(id).addEventListener('input', refreshDex);
el('shop-open').onclick = () => { refreshShop(); openModal('shop'); };
el('aquarium-open').onclick = () => { openModal('aquarium'); void loadAquarium(); };
el('aquarium-add').onclick = () => { const id = el<HTMLSelectElement>('aquarium-choice').value; if (!id) return; const error = toggleFavorite(save, id); if (error) { toast(error); return; } saveNow(); refreshCollection(); void loadAquarium(); };
el('aquarium-favorites').onclick = event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return;
  if (button.dataset.aqRemove) { toggleFavorite(save, button.dataset.aqRemove); saveNow(); refreshCollection(); void loadAquarium(); }
  if (button.dataset.aqView) { const s = save.journal.find(s => s.id === button.dataset.aqView); if (s) void showSpecimen(s); }
};
for (const key of ['floor', 'background', 'light', 'plants', 'rocks'] as const) el(`aq-${key}`).addEventListener('change', () => {
  if (key === 'plants' || key === 'rocks') save.aquarium[key] = save.inventory.includes(key) && el<HTMLInputElement>(`aq-${key}`).checked;
  else if (key === 'floor') save.aquarium.floor = el<HTMLSelectElement>('aq-floor').value as SaveData['aquarium']['floor'];
  else if (key === 'background') save.aquarium.background = el<HTMLSelectElement>('aq-background').value as SaveData['aquarium']['background'];
  else save.aquarium.light = el<HTMLSelectElement>('aq-light').value as SaveData['aquarium']['light'];
  saveNow(); aquarium?.customize(save.aquarium);
});
el('shop-list').onclick = event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return;
  if (button.dataset.buy) { const error = purchase(save, button.dataset.buy as ItemId); toast(error || 'Achat ajouté à votre inventaire.'); }
  if (button.dataset.equip && game.phase === 'idle' && save.inventory.includes(button.dataset.equip as ItemId)) { save.equipped = button.dataset.equip as ItemId; equip(); }
  saveNow(); refreshShop(); refreshCollection();
};
el('journal-more').onclick = () => { journalLimit += 30; refreshCollection(); };
el('journal-list').onclick = event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return;
  if (button.dataset.specimen) { const s = save.journal.find(s => s.id === button.dataset.specimen); if (s) void showSpecimen(s); }
  if (button.dataset.favorite) { const error = toggleFavorite(save, button.dataset.favorite); if (error) toast(error); saveNow(); refreshCollection(); }
};
el('favorite-catch').onclick = () => { if (!viewedSpecimen) return; const error = toggleFavorite(save, viewedSpecimen.id); if (error) toast(error); saveNow(); refreshCollection(); el('favorite-catch').textContent = save.favorites.includes(viewedSpecimen.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'; };
document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.onclick = () => closeModal(button.dataset.close!));
document.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog => dialog.addEventListener('close', () => {
  overlayPaused = !!document.querySelector('dialog[open]'); release();
  if (dialog.id === 'caught') { catchViewRequest++; preview?.hide(); viewedSpecimen = undefined; if (liveCatchView) { game.reset(); phaseChanged(); } if (el<HTMLDialogElement>('aquarium').open) { refreshAquariumControls(); void loadAquarium(); } }
  if (dialog.id === 'aquarium') { aquariumRequest++; aquarium?.dispose(); aquarium = undefined; }
}));
el('release-fish').onclick = () => closeModal('caught');
el('sound').onclick = () => { save.settings.sound = !save.settings.sound; audio.enabled = save.settings.sound; void audio.unlock(); refreshSettings(); saveNow(); };
el('quality').onclick = () => { save.settings.quality = save.settings.quality === 'eco' ? 'high' : 'eco'; world?.setQuality(save.settings.quality); refreshSettings(); saveNow(); };
el('export-save').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `au-fil-de-leau-carnet-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
el('import-save').onclick = () => el<HTMLInputElement>('save-file').click();
el<HTMLInputElement>('save-file').onchange = async event => {
  const input = event.target as HTMLInputElement; const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > MAX_SAVE_BYTES) throw new Error('Fichier trop volumineux.');
    pendingImport = parseSave(await file.text());
    el('import-description').textContent = `Ce carnet contient ${pendingImport.total} prise(s). Il remplacera votre carnet actuel (${save.total} prise(s)). Exportez le vôtre avant de continuer si vous souhaitez le garder.`;
    el('import-review').hidden = false;
  } catch (error) { toast(error instanceof Error ? error.message : 'Fichier invalide.'); }
  input.value = '';
};
el('confirm-import').onclick = () => {
  if (!pendingImport) return;
  save = pendingImport; pendingImport = undefined; el('import-review').hidden = true;
  equip();
  audio.enabled = save.settings.sound; world?.setQuality(save.settings.quality);
  saveNow(); refreshCollection(); refreshSettings(); toast('Votre carnet a été restauré.');
};
el('cancel-import').onclick = () => { pendingImport = undefined; el('import-review').hidden = true; };
function pauseManually() { release(); cancelGesture(); aquarium?.pause(); preview?.pause(); if (!overlayPaused) { manualPaused = true; el('paused').hidden = false; } }
window.addEventListener('blur', pauseManually);
window.addEventListener('pagehide', () => { pauseManually(); preview?.pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseManually(); preview?.pause(); } else if (el<HTMLDialogElement>('caught').open) preview?.resume(); else if (el<HTMLDialogElement>('aquarium').open) aquarium?.resume(); });
window.addEventListener('focus', () => { if (el<HTMLDialogElement>('caught').open) preview?.resume(); else if (el<HTMLDialogElement>('aquarium').open) aquarium?.resume(); });
el('resume').onclick = () => { manualPaused = false; el('paused').hidden = true; };

refreshCollection(); refreshSettings(); renderPhase();
try {
  world = new LakeWorld(el<HTMLCanvasElement>('world'), save.settings.quality);
  let lastTime = performance.now(); let accumulator = 0; let lastRender = 0;
  world.engine.runRenderLoop(() => {
    const now = performance.now(); const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
    if (document.hidden) { accumulator = 0; return; }
    if (!overlayPaused && !manualPaused && !qaSimulationPaused) {
      accumulator += dt;
      while (accumulator >= 1 / 60) { game.update(1 / 60); phaseChanged(); accumulator -= 1 / 60; }
    } else accumulator = 0;
    if (game.phase === 'fighting') {
      const tension = Math.round(game.tension * 100); const progress = Math.round(game.progress * 100);
      el('tension-label').textContent = `${tension} %`; el('tension-pointer').style.left = `${Math.max(1, Math.min(99, tension))}%`;
      el('tension-meter').setAttribute('aria-valuenow', String(tension)); el('catch-meter').setAttribute('aria-valuenow', String(progress));
      el('distance-fill').style.width = `${progress}%`; el('fight-note').textContent = game.pulling ? 'Il tire ! Relâchez pour protéger le fil.' : 'Il se calme. C’est le moment de mouliner.';
    }
    if (!overlayPaused && !manualPaused && now - lastRender >= (save.settings.quality === 'eco' ? 1000 / 30 : 0)) {
      world!.update((now - lastRender) / 1000 > 0.1 ? 1 / 30 : (now - lastRender) / 1000, game);
      world!.scene.render(); lastRender = now;
    }
  });
  world.scene.executeWhenReady(() => { el('loading').hidden = true; document.body.dataset.ready = 'true'; if (loaded.warning) toast(loaded.warning); });
  el<HTMLCanvasElement>('world').addEventListener('webglcontextlost', () => { pauseManually(); toast('Le rendu 3D a été interrompu. Rechargez la page si l’image ne revient pas.'); });
} catch (error) {
  console.error(error);
  el('loading').innerHTML = '<h2>L’étang ne s’affiche pas.</h2><p>Le navigateur n’a pas pu démarrer la 3D.<br>Essayez un navigateur récent avec WebGL activé.</p><button class="secondary" onclick="location.reload()">Réessayer</button>';
}

// Interface de test uniquement dans le serveur de développement E2E, supprimée du build.
if (import.meta.env.DEV && import.meta.env.VITE_E2E === '1') {
  Object.assign(window, { __fishingQA: {
    pauseSimulation: () => { qaSimulationPaused = true; },
    snapshot: () => ({ phase: game.phase, tension: game.tension, progress: game.progress, reeling: game.reeling, pulling: game.pulling, total: save.total, paused: manualPaused || overlayPaused, target: game.target, yaw: game.rodYaw, lift: game.rodLift, aquarium: aquarium?.diagnostics(), engines: Engine.Instances.length }),
    advance: (seconds: number, mode?: 'smart') => { for (let i = 0; i < seconds * 60; i++) { if (mode === 'smart') game.reeling = game.tension < (game.pulling ? 0.35 : 0.65); game.update(1 / 60); phaseChanged(); if (['caught', 'lost', 'bite'].includes(game.phase)) break; } },
  } });
}
