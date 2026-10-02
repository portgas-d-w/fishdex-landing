import './style.css';
import './ui/structure.css';
import { GameScreens } from './ui/structure';
import { component, validateRig } from './game/rig';
import { FishingGame } from './game/fishing';
import { SPECIES } from './game/catalog';
import { emptySave, loadSave, persistSave, recordCatch, parseSave, MAX_SAVE_BYTES, toggleFavorite } from './game/save';
import type { SaveData } from './game/save';
import { LakeWorld } from './render/world';
import { FishPreview } from './render/fish-preview';
import { GameAudio } from './ui/audio';
import { CastGesture } from './game/casting';
import { wheelTurns } from './game/reeling';
import fishdex from './game/fishdex.json';
import { ITEMS, BADGES, levelFor } from './game/economy';
import type { ItemId } from './game/economy';
import type { Specimen } from './game/specimens';
import { getPhoto, storePhoto } from './ui/photos';
import { Aquarium } from './render/aquarium';
import { Engine } from '@babylonjs/core/Engines/engine';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div class="scene-controls" aria-label="Commandes de pêche">
<button id="menu-open" class="compact menu-toggle" aria-label="Ouvrir le menu">☰ <span>Menu</span></button>
<button id="prepare-open" class="compact prepare-toggle">Matériel</button>
<button id="strike" class="compact strike-control" hidden>Ferrer</button>
<button id="rod-control" class="rod-control" aria-label="Canne : glissez dans les quatre directions" hidden><span class="rod-arrows" aria-hidden="true"><i>▴</i><i>▸</i><i>▾</i><i>◂</i></span><span class="rod-thumb" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M12 39 Q22 13 40 8 M14 34L9 32L6 39L12 41 M21 23L25 25 M29 15L32 18"/></svg></span></button>
<button id="reel-control" class="reel-control" aria-label="Moulinet : maintenez pour mouliner ; relâchez pour arrêter" hidden><span class="reel-disc"><span class="reel-handle"></span></span><span class="reel-label">Mouliner</span></button>
<div id="tension-display" class="tension-display" hidden><span id="tension-label">Tension du fil</span><div id="tension-meter" class="tension-meter" role="progressbar" aria-labelledby="tension-label" aria-valuemin="0" aria-valuemax="100" aria-valuenow="32"><span class="tension-rest"></span><span class="tension-marker"></span></div></div>
<button id="cancel-cast" class="compact cancel-control" hidden>Ramener</button>
<button id="retry" class="compact retry-control" hidden>Reprendre</button>
</div>
<div id="fishing-status" class="sr-only" role="status" aria-live="polite"></div>
<div class="toast" id="toast" role="status" hidden></div>
<div class="line-alert" id="line-alert" role="status" hidden></div>
<div class="paused-banner" id="paused" hidden>Partie en pause<button id="resume">Reprendre</button></div>
<dialog id="menu" class="modal menu-modal"><div class="modal-header"><div><div class="eyebrow">Au fil de l’eau</div><h2>Menu</h2></div><button class="close" data-close="menu">Pêcher</button></div><nav class="menu-links" aria-label="Navigation du jeu"><button id="equipment-open">Matériel <small>Préparer la prochaine ligne</small></button><button id="collection-open">Carnet <small id="collection-count">0 / 15</small></button><button id="dex-open">FishDex <small>Encyclopédie</small></button><button id="aquarium-open">Aquarium <small>Mes cinq favoris</small></button><button id="shop-open">Boutique <small>Cannes et décorations</small></button><button id="progress-open">Progression <small>Niveaux et badges</small></button><button id="help-open">Réglages et aide <small>Son, qualité et gestes</small></button></nav><p class="modal-footnote">La pêche est en pause tant que ce menu est ouvert.</p></dialog>
<dialog id="preparation" class="modal"><div class="modal-header"><h2>Matériel</h2><button class="close" data-close="preparation">Retour</button></div><p id="equipment-summary" class="intro"></p><p id="preparation-note" class="intro"></p></dialog>
<dialog id="progression" class="modal"><div class="modal-header"><h2>Ma progression</h2><button class="close" data-close="progression">Retour</button></div><p id="player-progress" class="progress-summary"></p><p id="total-catches" class="intro"></p><div id="progress-badges" class="tools"></div></dialog>
<dialog id="collection" class="modal"><div class="modal-header"><div><div class="eyebrow">Les souvenirs de l’étang</div><h2>Mon carnet</h2></div><button class="close" data-close="collection" aria-label="Fermer le carnet">Retour</button></div><p class="intro">Chaque nouvelle espèce ouvre une page. Chaque belle prise peut devenir votre record.</p><div id="collection-list" class="collection-list"></div><div class="tools"><button class="secondary" id="export-save">Exporter le carnet</button><button class="secondary" id="import-save">Importer un carnet</button></div><input id="save-file" type="file" accept=".json,application/json" hidden><div id="import-review" hidden><p id="import-description" class="warning-line"></p><button class="secondary" id="confirm-import">Remplacer mon carnet</button><button class="secondary" id="cancel-import">Annuler</button></div><p class="modal-footnote">Votre carnet reste dans ce navigateur. Exportez-le pour le conserver ou le transférer sur un autre appareil.</p></dialog>
<dialog id="help" class="modal"><div class="modal-header"><h2>Réglages et aide</h2><button class="close" data-close="help" aria-label="Fermer l’aide">Retour</button></div><div class="help-steps"><div class="help-step"><b>01</b><div><strong>Trouvez votre coin.</strong><p>Le ver attire gardons, perches et carpes. Le petit leurre intéresse les perches, brochets et sandres. Changez de poste pour varier les rencontres.</p></div></div><div class="help-step"><b>02</b><div><strong>Gardez un œil sur le bouchon.</strong><p>Lancez, puis attendez la touche. Appuyez sur « Ferrer » dès que le poisson mord.</p></div></div><div class="help-step"><b>03</b><div><strong>Ressentez le combat.</strong><p>Maintenez le bouton pour mouliner. Relâchez quand le poisson tire ou que la tension monte. Si le fil reste détendu trop longtemps, le poisson se décroche.</p></div></div></div><p class="modal-footnote">Sur ordinateur : glissez pour lancer et guider la canne, tournez la molette pour récupérer ; espace peut ferrer. Tous les poissons sont remis à l’eau.</p><div class="setting-row"><span>Son</span><button id="sound" aria-pressed="false">Activer / couper</button></div><div class="setting-row"><span>Qualité graphique</span><button id="quality">Économie mobile</button></div></dialog>
<dialog id="caught" class="modal catch-modal"><div class="eyebrow" id="catch-heading">Une belle rencontre</div><h2 id="catch-name"></h2><p class="latin" id="catch-latin"></p><canvas class="fish-preview" id="fish-preview" aria-label="Aperçu 3D du poisson capturé"></canvas><p class="warning-line" id="preview-error" hidden>Aperçu indisponible. Votre prise est bien enregistrée.</p><p class="catch-size"><span id="catch-length"></span> <small>cm</small></p><div class="catch-badges" id="catch-badges"></div><p class="catch-description" id="catch-description"></p><button id="release-fish" class="action">Remettre à l’eau</button><p class="modal-footnote">La rencontre reste dans votre carnet.</p></dialog>
<div class="loading" id="loading"><div class="spinner"></div><h2>Au fil de l’eau</h2><p>Un instant… l’étang se réveille.</p></div>`;

const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
el('app').insertAdjacentHTML('beforeend', `
<dialog id="encyclopedia" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Les pages de FishDex</div><h2>Encyclopédie</h2></div><button class="close" data-close="encyclopedia" aria-label="Fermer l’encyclopédie">Retour</button></div><p class="intro">${fishdex.provenance.biologicalGroups} groupes biologiques · ${fishdex.provenance.sourceEntries} fiches avec variétés. ${SPECIES.length} espèces jouables. Les autres sont prévues.</p><div class="filters"><input id="dex-search" type="search" placeholder="Nom, variété ou technique" aria-label="Rechercher un poisson"><select id="dex-category" aria-label="Catégorie"><option value="all">Toutes les eaux</option><option value="paisibles">Paisibles</option><option value="predateurs">Prédateurs</option><option value="eaux-vives">Eaux vives</option></select><select id="dex-state" aria-label="Découvertes"><option value="all">Toutes les fiches</option><option value="playable">Jouables</option><option value="discovered">Découvertes</option><option value="mirage">Variantes Mirage</option></select></div><div id="dex-list"></div><p class="modal-footnote">Référence locale FishDex. La rareté est une règle de rencontre du jeu, distincte de la conservation des espèces.</p></dialog>
<dialog id="shop" class="modal"><div class="modal-header"><div><div class="eyebrow">Le matériel du bord</div><h2>Boutique</h2></div><button class="close" data-close="shop" aria-label="Fermer la boutique">Retour</button></div><p class="intro" id="shop-balance"></p><div id="shop-list" class="collection-list"></div><p class="modal-footnote">Monnaie virtuelle gagnée avec vos souvenirs de pêche. Canne et appâts de base réutilisables, toujours disponibles.</p></dialog>`);
el('collection-list').insertAdjacentHTML('afterend', '<h3 class="section-title">Mes spécimens</h3><p class="intro" id="journal-intro"></p><div id="journal-list" class="journal-list"></div><button class="secondary" id="journal-more" hidden>Souvenirs suivants</button><div id="mastery-list" class="tools"></div>');
el('catch-length').parentElement!.insertAdjacentHTML('afterend', '<p id="catch-weight" class="intro"></p><p id="catch-reward" class="reward-line"></p><p id="photo-state" class="modal-footnote"></p><button id="favorite-catch" class="secondary">Ajouter aux favoris</button>');
el('app').insertAdjacentHTML('beforeend', '<dialog id="aquarium" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Une pause sous la surface</div><h2>Mon aquarium</h2></div><button class="close" data-close="aquarium" aria-label="Fermer l’aquarium">Retour</button></div><canvas id="aquarium-canvas" aria-label="Aquarium 3D de vos cinq favoris"></canvas><p class="intro" id="aquarium-state">Choisissez vos spécimens favoris dans le carnet.</p><div class="filters"><select id="aquarium-choice" aria-label="Choisir un spécimen"></select><button class="secondary" id="aquarium-add">Ajouter</button></div><div id="aquarium-favorites" class="collection-list"></div><h3 class="section-title">L’ambiance du bassin</h3><div class="aquarium-settings"><label>Sol<select id="aq-floor"><option value="sand">Sable clair</option><option value="gravel">Gravier sombre</option></select></label><label>Fond<select id="aq-background"><option value="dawn">Aube</option><option value="night">Nuit</option></select></label><label>Lumière<select id="aq-light"><option value="warm">Chaleureuse</option><option value="cool">Fraîche</option></select></label><label><input id="aq-plants" type="checkbox"> Plantes achetées</label><label><input id="aq-rocks" type="checkbox"> Rochers achetés</label></div><p class="modal-footnote">Cinq individus, leurs robes et leurs gabarits. Aucun entretien ni pénalité d’absence. Les plantes et rochers se trouvent en boutique.</p></dialog>');
const steps = document.querySelectorAll('.help-step');
steps[0].querySelector('strong')!.textContent = 'Choisissez votre méthode et votre cible.';
steps[0].querySelector('p')!.textContent = 'Posez le doigt dans le tiers inférieur, projetez vers l’eau puis relâchez au centre ou plus haut. La vitesse du geste donne sa puissance ; la direction choisit le point de chute. Un relâchement trop bas ou hors de l’eau annule le lancer.';
steps[1].querySelector('strong')!.textContent = 'Observez votre montage.';
steps[1].querySelector('p')!.textContent = 'Au flotteur, attendez qu’il plonge. Au fond, regardez la pointe de la canne. Au leurre, utilisez Mouliner selon votre réglage (appui ou cercle) et glissez pour animer : la récupération déclenche les rencontres. Ferrez dès la touche.';
steps[2].querySelector('p')!.textContent = 'Suivez le fil avec la canne à gauche et utilisez le moulinet à droite avec l’autre doigt (appui ou cercle, réglable ci-dessous) ; sur PC, utilisez la molette. Accompagnez les départs : le frein rend du fil sous résistance. Une pression modérée fatigue le poisson. Récupérez le mou s’il revient vers vous, puis ramenez-le au bord quand sa résistance diminue. Relâchez Mouliner dès que vous voulez arrêter la récupération.';
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* navigation privée restrictive */ }
const loaded: ReturnType<typeof loadSave> = storage ? loadSave(storage) : { data: emptySave(), warning: 'Sauvegarde locale indisponible. Pensez à exporter le carnet.' };
let save = loaded.data;
let recoveryPreserved = !loaded.recovery;
const game = new FishingGame();
game.setMethod(save.preparation.method); game.setBait(save.preparation.bait);
let hub: GameScreens | undefined;
const audio = new GameAudio(); audio.enabled = save.settings.sound;
let world: LakeWorld | undefined;
let preview: FishPreview | undefined;
let overlayPaused = false;
let manualPaused = false;
let lastPhase = game.phase;
let toastTimer = 0;
let pendingImport: SaveData | undefined;
let importRequest = 0;
let catchViewRequest = 0;
let storageWarningShown = false;
let qaSimulationPaused = false;
let aquarium: Aquarium | undefined;
let aquariumRequest = 0;
let lakeFrames = 0;
let lastReelSound = 0;
let lastLineAlert = ''; let alertUntil = 0;
let viewedSpecimen: Specimen | undefined;
let liveCatchView = false;
let journalLimit = 30;
const photoUrls: string[] = [];
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function equip() { game.tackle=save.tackle; const item = ITEMS.find(i => i.id === save.equipped)!; game.equipment = item.id; game.equipmentPower = item.power; }
equip();

function toast(message: string) { el('toast').textContent = message; el('toast').hidden = false; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el('toast').hidden = true, 5000); }
function saveNow() {
  if (!recoveryPreserved && loaded.recovery) { try { storage?.setItem('au-fil-de-leau.save.recovery', loaded.recovery); recoveryPreserved = !!storage; } catch { toast('Stockage plein. Exportez le fichier de récupération dans Réglages avant de sauvegarder.'); return; } if (!recoveryPreserved) return; }
  if ((!storage || !persistSave(save, storage)) && !storageWarningShown) {
    storageWarningShown = true; toast('Sauvegarde locale impossible. Exportez votre carnet pour le conserver.');
  }
}
function openModal(id: string) { hub?.opened(id); release(); cancelGesture(); el('line-alert').hidden = true; overlayPaused = true; if (!el<HTMLDialogElement>(id).open) el<HTMLDialogElement>(id).showModal(); }
function closeModal(id: string) { el<HTMLDialogElement>(id).close(); }
function refreshCollection() {
  el('player-progress').textContent = `Niveau ${levelFor(save.xp)} · ${save.xp} XP · ${save.coins} écus`;
  el('equipment-summary').textContent = ITEMS.find(i => i.id === save.equipped)!.name;
  el('collection-count').textContent = `${Object.keys(save.records).length} / ${SPECIES.length}`;
  el('total-catches').textContent = save.total ? `${save.total} rencontre${save.total > 1 ? 's' : ''} · ${Object.keys(save.records).length} espèce${Object.keys(save.records).length > 1 ? 's' : ''}` : 'Aucune prise, tout à découvrir';
  el('collection-list').innerHTML = SPECIES.map((species, i) => {
    const record = save.records[species.id];
    return `<article class="fish-entry ${record ? '' : 'undiscovered'}"><span class="fish-number">0${i + 1}</span><div><h3>${record ? species.name : 'À découvrir'}</h3><p>${record ? `${record.count} rencontre${record.count > 1 ? 's' : ''} · ${species.latin}` : (i === 0 || i === 2 ? 'Tentez votre chance au ver.' : 'Essayez le petit leurre.')}</p></div><div class="best">${record ? record.best.toLocaleString('fr-FR') : '—'}${record ? '<small> cm</small>' : ''}</div></article>`;
  }).join('');
  for (const url of photoUrls) URL.revokeObjectURL(url); photoUrls.length = 0;
  const matches = hub?.journal() ?? [...save.journal].reverse();
  const captures = matches.slice(0, journalLimit);
  el('journal-intro').textContent = save.journal.length ? `${save.journal.length} souvenir(s) · ${save.favorites.length} / 5 favoris · ${Object.keys(save.variants).length} apparence(s)` : 'Les prises de l’ancien carnet gardent leurs records. Les nouvelles auront leur fiche et leur photo.';
  el('journal-list').innerHTML = captures.map(s => `<article class="specimen-card"><button class="specimen-view" data-specimen="${escape(s.id)}"><div class="photo-placeholder" data-photo="${escape(s.id)}">Souvenir 3D</div><div><strong>${SPECIES.find(f => f.id === s.speciesId)!.name}${s.mirage ? ' · Mirage' : ''}</strong><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg · ${s.coloration === 'golden' ? 'Reflets dorés' : 'Robe naturelle'}</p><small>${new Date(s.date).toLocaleDateString('fr-FR')} · ${s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'}</small></div></button><button class="secondary" data-favorite="${escape(s.id)}" aria-pressed="${save.favorites.includes(s.id)}">${save.favorites.includes(s.id) ? 'Retirer le favori' : 'Favori'}</button></article>`).join('');
  el('journal-more').hidden = matches.length <= journalLimit;
  el('mastery-list').innerHTML = save.badges.map(b => `<span class="badge">${BADGES[b as keyof typeof BADGES]}</span>`).join('');
  hub?.progression(); hub?.dex(); hub?.material();
  for (const s of captures) void getPhoto(s.id).then(blob => {
    const target = Array.from(document.querySelectorAll<HTMLElement>('[data-photo]')).find(e => e.dataset.photo === s.id);
    if (!blob || !target || !target.isConnected) return;
    const url = URL.createObjectURL(blob); photoUrls.push(url); const img = document.createElement('img'); img.src = url; img.alt = `Photo de ${SPECIES.find(f => f.id === s.speciesId)!.name}`; target.replaceChildren(img);
  });
}
function refreshDex() { hub?.dex(); }
function refreshShop() { hub?.shop(); }
function refreshAquariumControls() {
  hub?.aquariumSlots();
  const favorites = save.favorites.map(id => save.journal.find(s => s.id === id)!);
  el('aquarium-choice').innerHTML = save.journal.filter(s => !save.favorites.includes(s.id)).slice().reverse().map(s => `<option value="${escape(s.id)}">${SPECIES.find(f => f.id === s.speciesId)!.name} · ${s.length} cm · ${new Date(s.date).toLocaleDateString('fr-FR')}</option>`).join('') || '<option value="">Pêchez un nouveau souvenir</option>';
  el<HTMLButtonElement>('aquarium-add').disabled = !save.journal.some(s => !save.favorites.includes(s.id));
  el('aquarium-favorites').innerHTML = favorites.map(s => `<article class="fish-entry"><div><h3>${SPECIES.find(f => f.id === s.speciesId)!.name}</h3><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg${s.mirage ? ' · Mirage' : ''}</p><button class="secondary" data-aq-view="${escape(s.id)}">Fiche</button><button class="secondary" data-aq-remove="${escape(s.id)}">Retirer</button></div></article>`).join('');
  el('aquarium-favorites').insertAdjacentHTML('beforeend', Array.from({length: 5 - favorites.length}, (_, i) => `<article class="fish-entry empty-slot"><div><small>Emplacement ${favorites.length + i + 1}</small><h3>Libre</h3><p>Choisissez un individu déjà capturé.</p></div></article>`).join(''));
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
  el('reel-control').setAttribute('aria-label', 'Moulinet : maintenez pour mouliner ; relâchez pour arrêter');
  el('quality').textContent = save.settings.quality === 'eco' ? 'Économie mobile' : 'Qualité élevée';
}
function renderPhase() {
  const phase = game.phase; document.body.dataset.phase = phase;
  el('prepare-open').hidden = phase !== 'idle';
  el('strike').hidden = phase !== 'bite';
  el('reel-control').hidden = !(phase === 'fighting' || phase === 'waiting' && game.method === 'lure');
  el('rod-control').hidden = el('reel-control').hidden;
  el('tension-display').hidden = phase !== 'fighting';
  el('cancel-cast').hidden = !['casting', 'waiting', 'bite'].includes(phase);
  el('retry').hidden = phase !== 'lost';
  el('preparation-note').textContent = phase === 'idle' ? 'Le point de lancer se choisit uniquement par glissement sur l’eau.' : 'Ramenez la ligne avant de modifier le montage.';
  hub?.material();
  el('fishing-status').textContent = phase === 'bite' ? 'Ça mord. Ferrez.' : phase === 'fighting' ? 'Poisson ferré. Le fil et la canne indiquent sa traction.' : phase === 'waiting' ? game.method === 'lure' ? 'Récupérez et animez le leurre.' : 'Montage en place.' : phase === 'idle' ? 'Prêt à lancer par glissement.' : '';
}
let tutorial = 0;
try { tutorial = Number(storage?.getItem('au-fil-de-leau.gestures.v3') ?? 0); } catch { /* facultatif */ }
function teach(bit: number, message: string) {
  if (tutorial & bit) return; tutorial |= bit; toast(message);
  try { storage?.setItem('au-fil-de-leau.gestures.v3', String(tutorial)); } catch { /* session seulement */ }
}
async function showCatch() {
  if (!game.result || !game.fish) return;
  const badges = recordCatch(save, game.result); saveNow(); refreshCollection();
  const specimen = save.journal.find(s => s.id === game.result!.id)!;
  viewedSpecimen = specimen; liveCatchView = true;
  el('caught').classList.toggle('first-discovery', badges.first);
  const dexNumber = hub?.groups.findIndex(rows => rows.some(e => e.gameId === specimen.speciesId)) ?? -1;
  el('catch-heading').textContent = badges.first ? `FishDex #${String(dexNumber + 1).padStart(3, '0')} · Nouvelle découverte` : badges.record ? 'Votre nouveau record' : 'Une belle rencontre';
  el('catch-name').textContent = game.fish.name; el('catch-latin').textContent = game.fish.latin;
  el('catch-length').textContent = game.result.length.toLocaleString('fr-FR');
  el('catch-description').textContent = game.fish.description;
  refreshSpecimenInfo(specimen, true);
  el('catch-badges').innerHTML = `${badges.first ? '<span class="badge">Nouvelle espèce</span>' : badges.variant ? '<span class="badge">Nouvelle apparence</span>' : ''}${badges.record ? '<span class="badge">Record personnel</span>' : '<span class="badge">Ajouté au carnet</span>'}`;
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
  el('catch-reward').textContent = reward ? `+${r.coins} écus · +${r.xp} XP — Photo ${r.base}${r.discovery ? `, découverte +${r.discovery}` : ''}${r.record ? `, record +${r.record}` : ''}` : `${new Date(s.date).toLocaleString('fr-FR')} · ${s.location}${s.baitItem?' · '+component(s.baitItem)?.name:''} · ${s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'} · ${ITEMS.find(i => i.id === s.equipment)?.name ?? 'Canne de bordure'}`;
  el('favorite-catch').textContent = save.favorites.includes(s.id) ? 'Retirer des favoris' : 'Ajouter aux favoris';
  el('photo-state').textContent = 'La photo se prépare…';
  el('release-fish').textContent = reward ? 'Continuer à pêcher' : el<HTMLDialogElement>('aquarium').open ? 'Retour à l’aquarium' : 'Retour au carnet';
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
  if (!(game.phase === 'fighting' || game.phase === 'waiting' && game.method === 'lure')) { release(); cancelGesture(); }
  if (game.phase === 'bite') { audio.tone('bite'); toast('Ça mord ! Ferrez.'); }
  if (game.phase === 'fighting') { el('toast').hidden = true; teach(2, 'Glissez sur la commande de canne à gauche, ou sur l’eau. Maintenez Mouliner à droite avec l’autre doigt ; relâchez pour arrêter.'); }
  if (game.phase === 'casting' || game.phase === 'lost' || game.phase === 'idle') saveNow();
  if (game.phase === 'lost') { const losses=Object.entries(save.tackle.active?.losses??{}).map(([id,n])=>`${component(id)?.name} : ${n}`); toast(game.failure+(losses.length?' Perdu : '+losses.join(' · '):' Aucun composant payant perdu.')); }
  if (game.phase === 'caught') void showCatch();
}
function activate() {
  if (!world || overlayPaused || manualPaused) return;
  if (game.phase === 'bite') { void audio.unlock(); game.strike(); phaseChanged(); }
}
let reelPointer: number | undefined;
let reelAngle = 0;
let gesture: { id: number; x: number; y: number; yaw: number; lift: number; casting: boolean; cast?: CastGesture } | undefined;
const canvas = el<HTMLCanvasElement>('world');
const reel = el('reel-control');
const rodControl = el('rod-control');
// Ces écouteurs ne remontent pas depuis les dialogues, qui sont des frères de la scène.
for (const surface of [canvas, document.querySelector<HTMLElement>('.scene-controls')!]) {
  for (const type of ['contextmenu', 'dragstart', 'selectstart']) surface.addEventListener(type, event => event.preventDefault());
}
// Les photos restent défilables dans les menus, mais ne démarrent pas un glissement natif.
el('app').addEventListener('dragstart', event => { if (event.target instanceof HTMLImageElement) event.preventDefault(); });
function cancelGesture() {
  const id = gesture?.id;
  if (gesture?.casting && game.phase === 'idle') game.orient(gesture.yaw, gesture.lift);
  gesture = undefined; world?.aim();
  if (id !== undefined && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
  if (id !== undefined && rodControl.hasPointerCapture(id)) rodControl.releasePointerCapture(id);
  rodControl.style.setProperty('--stick-x', '0px'); rodControl.style.setProperty('--stick-y', '0px');
}
function release() {
  const id = reelPointer; reelPointer = undefined; game.release(); reel.classList.remove('reeling');
  if (id !== undefined && reel.hasPointerCapture(id)) reel.releasePointerCapture(id);
}
function canReel() { return !overlayPaused && !manualPaused && (game.phase === 'fighting' || game.phase === 'waiting' && game.method === 'lure'); }
function turnReel(turns: number) {
  if (!canReel() || !turns) return;
  game.reel(turns); reelAngle += turns * 360; reel.style.setProperty('--reel-angle', `${reelAngle}deg`); void audio.unlock();
}
el('strike').onclick = activate;
el('retry').onclick = () => { game.reset(); phaseChanged(); };
reel.addEventListener('pointerdown', e => {
  if (e.button !== 0 || reelPointer !== undefined || !canReel()) return;
  reelPointer = e.pointerId; game.holdReel(true); void audio.unlock();
  reel.setPointerCapture(e.pointerId);
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) reel.addEventListener(type, e => { if ((e as PointerEvent).pointerId === reelPointer) release(); });
window.addEventListener('pointerup', e => { if (e.pointerId === reelPointer) release(); });
window.addEventListener('pointercancel', e => { if (e.pointerId === reelPointer) release(); if (e.pointerId === gesture?.id) cancelGesture(); });
rodControl.addEventListener('pointerdown', e => {
  if (e.button !== 0 || gesture || !canReel()) return;
  gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: game.rodYaw, lift: game.rodLift, casting: false };
  rodControl.setPointerCapture(e.pointerId); void audio.unlock();
});
rodControl.addEventListener('pointermove', e => {
  if (!gesture || gesture.id !== e.pointerId || !rodControl.hasPointerCapture(e.pointerId)) return;
  const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
  // Une excursion de 32 px donne l’amplitude complète, sans répétition automatique.
  game.orient(gesture.yaw + dx / 32, gesture.lift - dy / 64);
  const radius = Math.hypot(dx, dy), scale = radius > 22 ? 22 / radius : 1;
  rodControl.style.setProperty('--stick-x', `${dx * scale}px`); rodControl.style.setProperty('--stick-y', `${dy * scale}px`);
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) rodControl.addEventListener(type, e => {
  if ((e as PointerEvent).pointerId === gesture?.id) cancelGesture();
});
canvas.addEventListener('pointerdown', e => {
  if (e.button !== 0 || gesture || overlayPaused || manualPaused) return;
  if (game.phase === 'bite') { activate(); return; }
  if (game.phase === 'lost') { game.reset(); phaseChanged(); }
  if (!(['idle', 'fighting'].includes(game.phase) || game.phase === 'waiting' && game.method === 'lure')) return;
  if (game.phase === 'idle' && !CastGesture.canStart(e.clientY, innerHeight)) return;
  gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: game.rodYaw, lift: game.rodLift, casting: game.phase === 'idle' };
  if (gesture.casting) { gesture.cast = new CastGesture({ x: e.clientX, y: e.clientY, time: e.timeStamp }, innerWidth, innerHeight, game.equipmentPower); game.orient(0, 0.15); }
  canvas.setPointerCapture(e.pointerId); void audio.unlock();
});
canvas.addEventListener('pointermove', e => {
  if (!gesture || gesture.id !== e.pointerId) return;
  const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
  if (gesture.cast) {
    const sample = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    const samples = e.getCoalescedEvents?.() ?? [];
    for (const point of samples) gesture.cast.move({ x: point.clientX, y: point.clientY, time: point.timeStamp });
    gesture.cast.move(sample); const pose = gesture.cast.pose(sample); game.orient(pose.yaw, pose.lift);
    world?.aim(gesture.cast.aim(sample));
  }
  else game.orient(gesture.yaw + dx / (Math.min(600, innerWidth) * 0.28), gesture.lift - dy / (Math.min(600, innerHeight) * 0.35));
});
canvas.addEventListener('pointerup', e => {
  if (!gesture || gesture.id !== e.pointerId) return;
  if (gesture.casting) {
    const aim = gesture.cast!.aim({ x: e.clientX, y: e.clientY, time: e.timeStamp });
    if (aim.valid && game.cast(aim.point)) { audio.tone('cast'); phaseChanged(); } else if(aim.valid) { toast(game.failure || validateRig(save.tackle).join(' ')); }
    else toast(aim.reason);
  }
  cancelGesture();
});
for (const type of ['pointercancel', 'lostpointercapture']) canvas.addEventListener(type, e => { if ((e as PointerEvent).pointerId === gesture?.id) cancelGesture(); });
window.addEventListener('resize', () => { release(); cancelGesture(); });
window.addEventListener('wheel', e => {
  if (!canReel() || !(e.target === canvas || (e.target as HTMLElement).closest?.('#reel-control'))) return;
  e.preventDefault(); turnReel(wheelTurns(e.deltaY || e.deltaX, e.deltaMode));
}, { passive: false });
window.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.repeat || overlayPaused || manualPaused || (e.target as HTMLElement).closest?.('input,select,button')) return;
  e.preventDefault(); activate();
});
hub = new GameScreens({ save: () => save, game, open: openModal, close: closeModal, persist: saveNow, refresh: refreshCollection, toast });
if (loaded.recovery) { el('help').insertAdjacentHTML('beforeend', '<div class="recovery-panel"><h3>Récupérer une sauvegarde</h3><p class="warning-line">Le fichier original est conservé. Exportez-le avant de poursuivre ; vous pourrez importer une sauvegarde saine dans le carnet.</p><button id="export-recovery" class="secondary">Exporter le fichier original</button></div>'); el('export-recovery').onclick = () => { const url = URL.createObjectURL(new Blob([loaded.recovery!], {type:'application/json'})), a=document.createElement('a');a.href=url;a.download='au-fil-de-leau-recuperation.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);recoveryPreserved=true; }; }
if (save.tackle.active?.outcome === 'return') saveNow();
el('menu-open').onclick = () => openModal('menu');
el('prepare-open').onclick = el('equipment-open').onclick = () => { renderPhase(); openModal('preparation'); };
el('progress-open').onclick = () => { refreshCollection(); openModal('progression'); };
el('cancel-cast').onclick = () => { release(); cancelGesture(); game.reset(); phaseChanged(); };
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
  if (button.dataset.buy) { hub?.buy(button.dataset.buy); return; }
  if (button.dataset.equip && game.phase === 'idle' && save.inventory.includes(button.dataset.equip as ItemId)) { save.equipped = button.dataset.equip as ItemId; equip(); }
  saveNow(); refreshShop(); refreshCollection();
};
el('gear-list').onclick = el('shop-list').onclick;
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
  const request = ++importRequest; pendingImport = undefined; el('import-review').hidden = true;
  try {
    if (file.size > MAX_SAVE_BYTES) throw new Error('Fichier trop volumineux.');
    const parsed = parseSave(await file.text()); if (request !== importRequest) return; pendingImport = parsed;
    el('import-description').textContent = `Ce carnet contient ${pendingImport.total} prise(s). Il remplacera votre carnet actuel (${save.total} prise(s)). Exportez le vôtre avant de continuer si vous souhaitez le garder.`;
    el('import-review').hidden = false;
  } catch (error) { if (request === importRequest) toast(error instanceof Error ? error.message : 'Fichier invalide.'); }
  input.value = '';
};
el('confirm-import').onclick = () => {
  if (!pendingImport) return;
  game.reset(); release(); cancelGesture(); phaseChanged();
  save = pendingImport; pendingImport = undefined; el('import-review').hidden = true;
  game.setMethod(save.preparation.method); game.setBait(save.preparation.bait); equip(); renderPhase();
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
    if ((game.reeling || game.phase === 'fighting' && game.dragSpeed > 0.08) && !overlayPaused && !manualPaused && now - lastReelSound > 180) { audio.tone(game.dragSpeed > 0.08 ? 'drag' : 'reel'); lastReelSound = now; }
    if (!overlayPaused && !manualPaused && !qaSimulationPaused) {
      accumulator += dt;
      while (accumulator >= 1 / 60) { game.update(1 / 60); phaseChanged(); accumulator -= 1 / 60; }
    } else accumulator = 0;
    reel.classList.toggle('reeling', game.reeling);
    if (reelPointer !== undefined && canReel() && !qaSimulationPaused) {
      reelAngle += game.reelSpeed * dt * 360; reel.style.setProperty('--reel-angle', `${reelAngle}deg`);
    }
    if (game.phase === 'fighting' && game.dragSpeed > 0.02 && !overlayPaused && !manualPaused && !qaSimulationPaused) {
      reelAngle -= game.dragSpeed * dt * 180; reel.style.setProperty('--reel-angle', `${reelAngle}deg`);
    }
    if (game.phase === 'fighting' && !overlayPaused && !manualPaused) {
      const angle = Math.round(Math.atan2(game.fishPosition.x, game.fishPosition.z + 1) * 180 / Math.PI);
      // Le repère de la jauge affiche exactement la tension qui courbe la canne.
      const percent = Math.round(Math.min(1, game.tension) * 100);
      el('tension-display').style.setProperty('--tension', `${percent}%`);
      el('tension-meter').setAttribute('aria-valuenow', String(percent));
      canvas.setAttribute('aria-description', `Fil à ${angle} degrés, tension ${percent} pour cent.`);
      const danger = game.tension > 0.85 ? 'Fil trop tendu' : game.tension < 0.04 ? 'Contact perdu' : '';
      if (danger && danger !== lastLineAlert && now > alertUntil + 2000) { el('line-alert').textContent = danger; el('line-alert').hidden = false; alertUntil = now + 1800; }
      lastLineAlert = danger;
    } else if (game.phase !== 'fighting') { canvas.removeAttribute('aria-description'); el('line-alert').hidden = true; }
    if (now > alertUntil) el('line-alert').hidden = true;
    if (!overlayPaused && !manualPaused && now - lastRender >= (save.settings.quality === 'eco' ? 1000 / 30 : 0)) {
      world!.update((now - lastRender) / 1000 > 0.1 ? 1 / 30 : (now - lastRender) / 1000, game);
      world!.scene.render(); lakeFrames++; lastRender = now;
    }
  });
  world.scene.executeWhenReady(() => { el('loading').hidden = true; document.body.dataset.ready = 'true'; if (loaded.warning) toast(loaded.warning); else teach(1, 'Partez du bas, projetez vers l’eau puis relâchez au centre pour lancer.'); });
  el<HTMLCanvasElement>('world').addEventListener('webglcontextlost', () => { pauseManually(); toast('Le rendu 3D a été interrompu. Rechargez la page si l’image ne revient pas.'); });
} catch (error) {
  console.error(error);
  el('loading').innerHTML = '<h2>L’étang ne s’affiche pas.</h2><p>Le navigateur n’a pas pu démarrer la 3D.<br>Essayez un navigateur récent avec WebGL activé.</p><button class="secondary" onclick="location.reload()">Réessayer</button>';
}

// Interface de test uniquement dans le serveur de développement E2E, supprimée du build.
if (import.meta.env.DEV && import.meta.env.VITE_E2E === '1') {
  Object.assign(window, { __fishingQA: {
    pauseSimulation: () => { qaSimulationPaused = true; },
    resumeSimulation: () => { qaSimulationPaused = false; },
    snapshot: () => ({ phase: game.phase, tension: game.tension, fatigue: game.fatigue, slack: game.slack, dragSpeed: game.dragSpeed, lineLength: game.lineLength, fishDistance: game.fishDistance, returning: game.returning, progress: game.progress, reeling: game.reeling, pulling: game.pulling, total: save.total, paused: manualPaused || overlayPaused, direction: game.direction, reelSpeed: game.reelSpeed, alignment: game.alignment, rodTip: world?.rodTipOnScreen(), target: game.target, yaw: game.rodYaw, lift: game.rodLift, aquarium: aquarium?.diagnostics(), engines: Engine.Instances.length, lakeFrames, meshes: world?.scene.getActiveMeshes().length }),
    advance: (seconds: number, mode?: 'smart') => { for (let i = 0; i < seconds * 60; i++) { if (mode === 'smart') { game.orient(game.direction, game.pulling ? 0.28 : 0.55); if (game.tension < 0.72 || game.slack > 0.05) game.reel(1.6 / 60); } game.update(1 / 60); phaseChanged(); if (['caught', 'lost', 'bite'].includes(game.phase)) break; } },
  } });
}
