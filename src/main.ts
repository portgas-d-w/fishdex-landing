import {LearningSession} from './game/learning';
import {learnSkill,familyFor} from './game/curriculum';
import {installMemories,specimenArt,specimenLabel} from './ui/memories';
import {installWaterTools} from './ui/water-tools';
import {nextRenderDeadline} from './ui/render-clock';
import {installFieldTools} from './ui/field-tools';
import {ActionGesture} from './game/action-gesture';
import {installObservations} from './ui/observations';
import {discoveredFish} from './game/save';
import {appearanceName} from './game/fish-registry';
import './style.css';
import {ProfileStorage,wallet} from './game/development';
import {installTechniqueControls} from './ui/technique-controls';
import {techniqueById} from './game/techniques';
import {installDevelopment} from './ui/development';
import {setPhotoProfile} from './ui/photos';
declare const __TEST_MODE_ENABLED__:boolean;
import './ui/theme.css';
import './ui/structure.css';
import './ui/journey.css';
import './ui/presentation.css';
import {installUIResourceFallback} from './ui/presentation';
import { GameScreens } from './ui/structure';
import { specimenRarity, rarityName } from './game/rarity';
import { postById } from './game/posts';
import { equipRod,refreshRights,switchTechnique } from './game/progression';
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
<button id="prepare-open" class="compact prepare-toggle">Matériel</button><button id="map-open" class="compact map-toggle">Carte</button><div id="fishing-context" class="fishing-context"></div><button id="groundbait" class="compact groundbait-control" hidden>Amorcer ici</button><button id="snag-release" class="compact snag-control" hidden>Dégager la ligne</button><label id="retrieve-setting" class="retrieve-setting" hidden>Récupération<select id="retrieve-speed"><option value="0.8">Lente</option><option value="1.6" selected>Normale</option><option value="2.2">Rapide</option></select></label>
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
<dialog id="menu" class="modal menu-modal"><div class="modal-header"><div><div class="eyebrow">Au fil de l’eau</div><h2>Menu</h2></div><button class="close" data-close="menu">Pêcher</button></div><nav class="menu-links" aria-label="Navigation du jeu"><button id="equipment-open">Matériel <small>Préparer la prochaine ligne</small></button><button id="collection-open">Carnet <small id="collection-count">0 captures · 0 observations</small></button><button id="dex-open">FishDex <small>Encyclopédie</small></button><button id="aquarium-open">Aquarium <small>Mes cinq favoris</small></button><button id="shop-open">Boutique <small>Cannes et décorations</small></button><button id="progress-open">Progression <small>Niveaux et badges</small></button><button id="help-open">Réglages et aide <small>Son, qualité et gestes</small></button></nav><p class="modal-footnote">La pêche est en pause tant que ce menu est ouvert.</p></dialog>
<dialog id="preparation" class="modal"><div class="modal-header"><h2>Matériel</h2><button class="close" data-close="preparation">Retour</button></div><p id="equipment-summary" class="intro"></p><p id="preparation-note" class="intro"></p></dialog>
<dialog id="progression" class="modal"><div class="modal-header"><h2>Ma progression</h2><button class="close" data-close="progression">Retour</button></div><p id="player-progress" class="progress-summary"></p><p id="total-catches" class="intro"></p><div id="progress-badges" class="tools"></div></dialog>
<dialog id="collection" class="modal"><div class="modal-header"><div><div class="eyebrow">Les souvenirs de l’étang</div><h2>Mon carnet</h2></div><button class="close" data-close="collection" aria-label="Fermer le carnet">Retour</button></div><p class="intro">Chaque nouvelle espèce ouvre une page. Chaque belle prise peut devenir votre record.</p><div id="collection-list" class="collection-list"></div><div class="tools"><button class="secondary" id="export-save">Exporter le carnet</button><button class="secondary" id="import-save">Importer un carnet</button></div><input id="save-file" type="file" accept=".json,application/json" hidden><div id="import-review" hidden><p id="import-description" class="warning-line"></p><button class="secondary" id="confirm-import">Remplacer mon carnet</button><button class="secondary" id="cancel-import">Annuler</button></div><p class="modal-footnote">Votre carnet reste dans ce navigateur. Exportez-le pour le conserver ou le transférer sur un autre appareil.</p></dialog>
<dialog id="help" class="modal"><div class="modal-header"><h2>Réglages et aide</h2><button class="close" data-close="help" aria-label="Fermer l’aide">Retour</button></div><div class="help-steps"><div class="help-step"><b>01</b><div><strong>Trouvez votre coin.</strong><p>Le ver attire gardons, perches et carpes. Le petit leurre intéresse les perches, brochets et sandres. Changez de poste pour varier les rencontres.</p></div></div><div class="help-step"><b>02</b><div><strong>Gardez un œil sur le bouchon.</strong><p>Lancez, puis attendez la touche. Appuyez sur « Ferrer » dès que le poisson mord.</p></div></div><div class="help-step"><b>03</b><div><strong>Ressentez le combat.</strong><p>Maintenez le bouton pour mouliner. Relâchez quand le poisson tire ou que la tension monte. Si le fil reste détendu trop longtemps, le poisson se décroche.</p></div></div></div><p class="modal-footnote">Sur ordinateur : glissez pour lancer et guider la canne, tournez la molette pour récupérer ; espace peut ferrer. Tous les poissons sont remis à l’eau.</p><div class="setting-row"><span>Son</span><button id="sound" aria-pressed="false">Activer / couper</button></div><div class="setting-row"><span>Qualité graphique</span><button id="quality">Économie mobile</button></div></dialog>
<dialog id="caught" class="modal catch-modal"><div class="eyebrow" id="catch-heading">Une belle rencontre</div><h2 id="catch-name"></h2><p class="latin" id="catch-latin"></p><canvas class="fish-preview" id="fish-preview" aria-label="Aperçu 3D du poisson capturé"></canvas><p class="warning-line" id="preview-error" hidden>Aperçu indisponible. Votre prise est bien enregistrée.</p><p class="catch-size"><span id="catch-length"></span> <small>cm</small></p><div class="catch-badges" id="catch-badges"></div><p class="catch-description" id="catch-description"></p><button id="release-fish" class="action">Remettre à l’eau</button><p class="modal-footnote">La rencontre reste dans votre carnet.</p></dialog>
<div class="loading" id="loading"><div class="spinner"></div><h2>Au fil de l’eau</h2><p>Un instant… l’étang se réveille.</p></div>`;

const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
el('app').insertAdjacentHTML('beforeend', `
<dialog id="encyclopedia" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Les pages de FishDex</div><h2>Encyclopédie</h2></div><button class="close" data-close="encyclopedia" aria-label="Fermer l’encyclopédie">Retour</button></div><p class="intro">${SPECIES.filter(s=>s.mode==='capture').length} identités à pêcher · ${SPECIES.filter(s=>s.mode==='observation').length} à observer.</p><div class="filters"><input id="dex-search" type="search" placeholder="Nom, variété ou technique" aria-label="Rechercher un poisson"><select id="dex-category" aria-label="Catégorie"><option value="all">Toute eau</option><option value="paisibles">Paisibles</option><option value="predateurs">Prédateurs</option><option value="eaux-vives">Eaux vives</option></select><select id="dex-state" aria-label="Découvertes"><option value="all">Toutes</option><option value="playable">Jouables</option><option value="discovered">Découvertes</option><option value="mirage">Variantes Mirage</option></select></div><div id="dex-list"></div><p class="modal-footnote">Catalogue : ${fishdex.provenance.biologicalGroups} groupes, ${fishdex.provenance.sourceEntries} fiches avec variétés. Référence locale FishDex. La rareté du jeu classe la découverte ; l’habitat et la présentation déterminent les rencontres.</p></dialog>
<dialog id="shop" class="modal"><div class="modal-header"><div><div class="eyebrow">Le matériel du bord</div><h2>Boutique</h2></div><button class="close" data-close="shop" aria-label="Fermer la boutique">Retour</button></div><p class="intro" id="shop-balance"></p><div id="shop-list" class="collection-list"></div><p class="modal-footnote">Monnaie virtuelle gagnée avec vos souvenirs de pêche. Canne et appâts de base réutilisables, toujours disponibles.</p></dialog>`);
el('collection-list').insertAdjacentHTML('afterend', '<h3 class="section-title">Mes spécimens</h3><p class="intro" id="journal-intro"></p><div id="journal-list" class="journal-list"></div><button class="secondary" id="journal-more" hidden>Souvenirs suivants</button><div id="mastery-list" class="tools"></div>');
el('fish-preview').insertAdjacentHTML('afterend','<div id="specimen-illustration"></div>');
el('catch-length').parentElement!.insertAdjacentHTML('afterend', '<p id="catch-weight" class="intro"></p><p id="catch-reward" class="reward-line"></p><p id="photo-state" class="modal-footnote"></p><button id="favorite-catch" class="secondary">Ajouter aux favoris</button>');
el('app').insertAdjacentHTML('beforeend', '<dialog id="aquarium" class="modal wide-modal"><div class="modal-header"><div><div class="eyebrow">Une pause sous la surface</div><h2>Mon aquarium</h2></div><button class="close" data-close="aquarium" aria-label="Fermer l’aquarium">Retour</button></div><canvas id="aquarium-canvas" aria-label="Aquarium 3D de vos cinq favoris"></canvas><p class="intro" id="aquarium-state">Choisissez vos spécimens favoris dans le carnet.</p><div class="filters"><select id="aquarium-choice" aria-label="Choisir un spécimen"></select><button class="secondary" id="aquarium-add">Ajouter</button></div><div id="aquarium-favorites" class="collection-list"></div><h3 class="section-title">L’ambiance du bassin</h3><div class="aquarium-settings"><label>Sol<select id="aq-floor"><option value="sand">Sable clair</option><option value="gravel">Gravier sombre</option></select></label><label>Fond<select id="aq-background"><option value="dawn">Aube</option><option value="night">Nuit</option></select></label><label>Lumière<select id="aq-light"><option value="warm">Chaleureuse</option><option value="cool">Fraîche</option></select></label><label><input id="aq-plants" type="checkbox"> Plantes achetées</label><label><input id="aq-rocks" type="checkbox"> Rochers achetés</label></div><p class="modal-footnote">Cinq individus, leurs robes et leurs gabarits. Aucun entretien ni pénalité d’absence. Les plantes et rochers se trouvent en boutique.</p></dialog>');
const steps = document.querySelectorAll('.help-step');
steps[0].querySelector('strong')!.textContent = 'Choisissez votre méthode et votre cible.';
steps[0].querySelector('p')!.textContent = 'Posez le doigt dans le tiers inférieur, projetez vers l’eau puis relâchez au centre ou plus haut. La vitesse du geste donne sa puissance ; la direction choisit le point de chute. Un relâchement trop bas ou hors de l’eau annule le lancer.';
steps[1].querySelector('strong')!.textContent = 'Observez votre montage.';
steps[1].querySelector('p')!.textContent = 'Au coup ou au flotteur, attendez qu’il plonge. Au fond, regardez la pointe de la canne. Au leurre, utilisez Mouliner par appui maintenu et glissez pour animer : la récupération déclenche les rencontres. Ferrez dès la touche.';
steps[2].querySelector('p')!.textContent = 'Au coup sans moulinet, baissez la canne pendant un départ puis relevez progressivement pour rapprocher le poisson. Pour les autres pratiques, suivez le fil avec la canne à gauche et utilisez le moulinet à droite avec l’autre doigt par appui maintenu ; sur PC, utilisez la molette. Accompagnez les départs : le frein rend du fil sous résistance. Une pression modérée fatigue le poisson. Récupérez le mou s’il revient vers vous, puis ramenez-le au bord quand sa résistance diminue. Relâchez Mouliner dès que vous voulez arrêter la récupération.';
el('help').insertAdjacentHTML('beforeend','<fieldset class="control-settings"><legend>Commandes tactiles</legend><label>Canne<select id="control-side"><option value="left">À gauche</option><option value="right">À droite</option></select></label><label><input id="control-single" type="checkbox"> Un doigt, commandes successives</label><label><input id="control-tension" type="checkbox"> Petit repère de tension</label><label><input id="control-hints" type="checkbox"> Conseils contextuels</label><p>La canne conserve sa position entre les gestes. Aucun suivi automatique du poisson. En réception, placez la tête sous la prise puis faites un court geste vers le haut.</p></fieldset>');
el('catch-reward').insertAdjacentHTML('afterend','<p id="catch-progression" class="warning-line" aria-live="polite"></p>');
el('help').insertAdjacentHTML('beforeend','<button id="export-before-progression" class="secondary">Exporter le carnet avant progression</button>');
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* navigation privée restrictive */ }
const profiles=new ProfileStorage(storage,import.meta.env.DEV||__TEST_MODE_ENABLED__);
setPhotoProfile(profiles.active);
const loaded: ReturnType<typeof loadSave> = storage ? profiles.load() : { data: emptySave(), warning: 'Sauvegarde locale indisponible. Pensez à exporter le carnet.' };
let save = loaded.data;
let learning:LearningSession|undefined;
try{if(!profiles.getItem('au-fil-de-leau.save.v1')&&!save.development&&!loaded.recovery){refreshRights(save);switchTechnique(save,'coup');}}catch{/* Conservation du kit initial si stockage inaccessible. */}
// Original pré-migration gardé localement pour un éventuel retour au lecteur v4.
let migrationBackupPending=false;
try {const raw=storage?.getItem('au-fil-de-leau.save.v1');migrationBackupPending=profiles.active==='normal'&&!!raw&&JSON.parse(raw).version<7&&!storage?.getItem('au-fil-de-leau.save.before-v7');} catch { /* récupération existante */ }
let recoveryPreserved = !loaded.recovery;
const game = new FishingGame();
game.testMode=!!save.development;game.accessBypass=save.development?.kind==='sandbox';game.rights=save.progression;game.setMethod(save.preparation.method); game.setBait(save.preparation.bait);game.setPost(save.preparation.post);game.combatMode=save.settings.combatMode;
let hub: GameScreens | undefined;
let memories:ReturnType<typeof installMemories>|undefined;
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
function equip() { game.tackle=save.tackle;save.tackle.unlimitedStock=!!save.development?.unlimitedStock;game.testMode=!!save.development;game.rights=save.progression; const item = ITEMS.find(i => i.id === save.equipped)!; game.equipment = item.id; game.equipmentPower = item.power; }
equip();

function toast(message: string) { el('toast').textContent = message; el('toast').hidden = false; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => el('toast').hidden = true, 5000); }
function saveNow() {
  if(learning){persistSave(learning.normal,profiles);return;}
  if(migrationBackupPending){try{storage!.setItem('au-fil-de-leau.save.before-v7',storage!.getItem('au-fil-de-leau.save.v1')!);migrationBackupPending=false;}catch{toast('Exportez la progression avant migration : le stockage ne permet pas de conserver l’original.');return;}}
  if (!recoveryPreserved && loaded.recovery) { try { storage?.setItem('au-fil-de-leau.save.recovery', loaded.recovery); recoveryPreserved = !!storage; } catch { toast('Stockage plein. Exportez le fichier de récupération dans Réglages avant de sauvegarder.'); return; } if (!recoveryPreserved) return; }
  if ((!storage || !persistSave(save, profiles)) && !storageWarningShown) {
    storageWarningShown = true; toast('Sauvegarde locale impossible. Exportez votre carnet pour le conserver.');
  }
}
const modalLayers:HTMLDialogElement[]=[];
const managementLayers=new Set(['menu','preparation','rig-sheet','component-sheet','component-detail','research-sheet','shop','purchase-confirm','item-sheet','encyclopedia','species-sheet','progression','method-sheet','badge-sheet','map','locations','location-sheet','collection','help','settings','lesson-sheet','aquarium-fish','aquarium-decor']);
function openModal(id: string) { if(learning&&['shop','settings','test-tools','aquarium','collection'].includes(id)){toast('Quittez le prêt pour retrouver votre partie et ces écrans.');return;} if(id!=='aquarium')aquarium?.pause();if(id!=='caught')preview?.pause();hub?.opened(id); game.release();document.dispatchEvent(new Event('fishing-input-reset'));release(); cancelGesture(); el('line-alert').hidden = true; overlayPaused = true;const dialog=el<HTMLDialogElement>(id);const parent=modalLayers.filter(d=>d.open&&d!==dialog).at(-1);if(dialog.open&&managementLayers.has(id)&&modalLayers.at(-1)!==dialog)dialog.close();if(!dialog.open)dialog.showModal();const index=modalLayers.indexOf(dialog);if(index>=0)modalLayers.splice(index,1);modalLayers.push(dialog);const back=dialog.querySelector<HTMLButtonElement>(`[data-close="${id}"]`);if(back){const labels:Record<string,string>={menu:'au menu',preparation:'au matériel','rig-sheet':'au montage','component-sheet':'aux pièces',shop:'à la boutique',encyclopedia:'au FishDex','species-sheet':'à la fiche',collection:'au carnet',progression:'à la progression',map:'à la carte',locations:'aux lieux','location-sheet':'au lieu',help:'à l’aide',settings:'aux réglages','lesson-sheet':'au guide','aquarium-fish':'aux poissons','aquarium-decor':'au décor',aquarium:'à l’aquarium',caught:'à la rencontre'};back.textContent=id==='menu'?'Reprendre la pêche':parent?'Retour '+(labels[parent.id]??'à l’écran précédent'):'Retour à la pêche';} }
function closeModal(id: string) { el<HTMLDialogElement>(id).close(); }
let observationScreens:ReturnType<typeof installObservations>|undefined;
function refreshCollection() {
  observationScreens?.journal(hub?.journalFilter());
  memories?.refresh();
  el('player-progress').textContent = `Niveau ${levelFor(save.xp)} · ${save.xp} XP · ${wallet(save)} écus`;
  el('equipment-summary').textContent = ITEMS.find(i => i.id === save.equipped)!.name;
  el('collection-count').textContent = `${save.journal.length} captures · ${save.observations.length} observations`;
  el('total-catches').textContent = `${save.total} captures · ${save.observations.length} observations · ${discoveredFish(save).size} / ${SPECIES.length} identités`;
  el('collection-list').innerHTML = SPECIES.filter(s=>s.mode==='capture').map((species, i) => {
    const record = save.records[species.id];
    return `<article class="fish-entry ${record ? '' : 'undiscovered'}"><span class="fish-number">0${i + 1}</span><div><h3>${record ? species.name : 'À découvrir'}</h3><p>${record ? `${record.count} rencontre${record.count > 1 ? 's' : ''} · ${species.latin}` : (i === 0 || i === 2 ? 'Tentez votre chance au ver.' : 'Essayez le petit leurre.')}</p></div><div class="best">${record ? record.best.toLocaleString('fr-FR') : '—'}${record ? '<small> cm</small>' : ''}</div></article>`;
  }).join('');
  for (const url of photoUrls) URL.revokeObjectURL(url); photoUrls.length = 0;
  const matches = hub?.journal() ?? [...save.journal].reverse();
  const captures = matches.slice(0, journalLimit);
  el('journal-intro').textContent = save.journal.length ? `${save.journal.length} souvenir(s) · ${save.favorites.length} / 5 favoris · ${Object.keys(save.variants).length} apparence(s)` : 'Ton premier souvenir commence au bord de l’eau.';
  el('journal-list').innerHTML = captures.map(s => `<article class="specimen-card"><button class="specimen-view" data-specimen="${escape(s.id)}"><div class="photo-placeholder" data-photo="${escape(s.id)}">${specimenArt(s)}<small>Illustration · aperçu régénérable</small></div><div><strong>${SPECIES.find(f => f.id === s.speciesId)!.name}${s.mirage ? ' · Mirage' : ''}</strong><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg · ${appearanceName(s.appearanceId)??(s.coloration === 'golden' ? 'Reflets dorés' : 'Robe naturelle')}</p><small>${s.length===save.records[s.speciesId]?.best?'Record · ':''}${s.reward.discovery?'Première découverte · ':''}${save.favorites.includes(s.id)?'Favori · ':''}${rarityName(specimenRarity(s))} · ${s.post?postById(s.post).name+' · ':''}${new Date(s.date).toLocaleDateString('fr-FR')} · ${s.technique?techniqueById(s.technique).name:s.method==='pole'?'Coup':s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'}</small></div></button><button class="secondary" data-favorite="${escape(s.id)}" aria-pressed="${save.favorites.includes(s.id)}">${save.favorites.includes(s.id) ? 'Retirer le favori' : 'Favori'}</button></article>`).join('') || `<div class="empty-state"><h3>${save.journal.length?'Aucun souvenir avec ces filtres':'Ton premier souvenir commence au bord de l’eau'}</h3><p>${save.journal.length?'Retirez un filtre ou réinitialisez la recherche.':'Une capture conserve un individu, sa taille et sa robe.'}</p><button class="action" ${save.journal.length?'data-journal-reset':'data-return-fishing'}>${save.journal.length?'Réinitialiser':'Retourner pêcher'}</button></div>`;
  if(save.historical)el('journal-list').insertAdjacentHTML('beforeend',`<details><summary>Rencontres historiques non identifiées (${save.historical.journal.length})</summary><p class="intro">Identifiants conservés dans l’export. Ces souvenirs attendent une correspondance confirmée ; aucun modèle ni gain n’est inventé.</p>${save.historical.journal.map(s=>`<p>${escape(String(s.speciesId))} · ${escape(String(s.length??'?'))} cm · ${escape(String(s.date??''))}</p>`).join('')}</details>`);
  el('journal-more').hidden = matches.length <= journalLimit;
  el('mastery-list').innerHTML = save.badges.map(b => `<span class="badge">${BADGES[b as keyof typeof BADGES]}</span>`).join('');
  hub?.progression(); hub?.dex(); hub?.material();
  for (const s of captures) void getPhoto(s.id).then(blob => {
    const target = Array.from(document.querySelectorAll<HTMLElement>('[data-photo]')).find(e => e.dataset.photo === s.id);
    if (!blob || !target || !target.isConnected) return;
    const url = URL.createObjectURL(blob); photoUrls.push(url); const img = document.createElement('img'); img.src = url; img.alt = `Photo de ${SPECIES.find(f => f.id === s.speciesId)!.name}`; target.replaceChildren(img);target.insertAdjacentHTML('beforeend','<small>Photo locale du souvenir</small>');
  });
}
function refreshDex() { hub?.dex(); }
function refreshShop() { hub?.shop(); }
function refreshAquariumControls() {
  hub?.aquariumSlots();
  const favorites = save.favorites.map(id => save.journal.find(s => s.id === id)!);
  el('aquarium-choice').innerHTML = save.journal.filter(s => !save.favorites.includes(s.id)).slice().reverse().map(s => `<option value="${escape(s.id)}">${specimenLabel(s)}</option>`).join('') || '<option value="">Pêchez un nouveau souvenir</option>';
  el<HTMLButtonElement>('aquarium-add').disabled = !save.journal.some(s => !save.favorites.includes(s.id));
  el('aquarium-favorites').innerHTML = favorites.map((s,index) => `<article class="fish-entry aq-slot"><div class="aq-thumb">${specimenArt(s)}</div><div><small>Emplacement ${index+1}</small><h3>${SPECIES.find(f => f.id === s.speciesId)!.name}</h3><p>${s.length} cm · ${s.weight.toLocaleString('fr-FR')} kg${s.mirage ? ' · Mirage' : ''} · ${new Date(s.date).toLocaleDateString('fr-FR')}</p><button class="secondary" data-aq-view="${escape(s.id)}">Fiche</button><button class="secondary" data-aq-remove="${escape(s.id)}">Retirer</button></div></article>`).join('');
  el('aquarium-favorites').insertAdjacentHTML('beforeend', Array.from({length: 5 - favorites.length}, (_, i) => `<article class="fish-entry empty-slot"><div><small>Emplacement ${favorites.length + i + 1}</small><h3>Libre</h3><p>Choisissez un individu déjà capturé.</p></div></article>`).join(''));
  el<HTMLSelectElement>('aq-floor').value = save.aquarium.floor; el<HTMLSelectElement>('aq-background').value = save.aquarium.background; el<HTMLSelectElement>('aq-light').value = save.aquarium.light;
  for (const id of ['plants', 'rocks'] as const) { el<HTMLInputElement>(`aq-${id}`).checked = save.aquarium[id]; el<HTMLInputElement>(`aq-${id}`).disabled = !save.inventory.includes(id); }
}
async function loadAquarium() {
  if(!el<HTMLDialogElement>('aquarium').open)return;
  const request = ++aquariumRequest; aquarium?.dispose(); aquarium = undefined;
  el('aquarium-canvas').dataset.loaded = 'false'; el('aquarium-state').textContent = 'Le bassin se réveille…';el('aq-retry').hidden=true; refreshAquariumControls();memories?.refresh();
  try {
    if (request !== aquariumRequest) return;
    aquarium = new Aquarium(el<HTMLCanvasElement>('aquarium-canvas'), save.settings.quality);if(modalLayers.at(-1)?.id!=='aquarium')aquarium.pause();aquarium.customize(save.aquarium);
    const result = await aquarium.show(save.favorites.map(id => save.journal.find(s => s.id === id)!));
    if (request !== aquariumRequest) return;
    if(modalLayers.at(-1)?.id!=='aquarium')aquarium.pause();
    el('aquarium-canvas').dataset.loaded = 'true';el('aq-retry').hidden=!result.errors;memories?.refresh();
    el('aquarium-state').textContent = `${result.loaded} / 5 favoris dans le bassin.${result.errors ? ' Un modèle n’a pas pu être chargé ; vos favoris sont conservés.' : result.loaded ? ' Une nage paisible, chacun à son rythme.' : ' Ajoutez des spécimens depuis votre carnet.'}`;
  } catch { if(request===aquariumRequest){el('aquarium-state').textContent='3D indisponible. Mes poissons reste consultable en 2D ; vos favoris sont conservés.';el('aq-retry').hidden=false;} }
}
function refreshSettings() {
  el('sound').setAttribute('aria-pressed', String(save.settings.sound));
  el('sound').setAttribute('aria-label', save.settings.sound ? 'Couper le son' : 'Activer le son');
  el('sound').textContent=save.settings.sound?'Marche':'Arrêt';el('sound').style.opacity='1';
  el('reel-control').setAttribute('aria-label', 'Moulinet : maintenez pour mouliner ; relâchez pour arrêter');
  document.body.dataset.controlSide=save.settings.controls?.side??'left';el<HTMLSelectElement>('control-side').value=save.settings.controls?.side??'left';for(const [id,key]of [['control-single','singleFinger'],['control-tension','tension'],['control-hints','hints']] as const)el<HTMLInputElement>(id).checked=save.settings.controls?.[key]??key==='hints';
  el('quality').textContent = save.settings.quality === 'eco' ? 'Économie mobile' : 'Qualité élevée';
}
function renderPhase() {
  const phase = game.phase; document.body.dataset.phase = phase;
  el('prepare-open').hidden = phase !== 'idle';
  el('strike').hidden = phase !== 'bite';
  el('reel-control').hidden = !canSecondary();
  el('rod-control').hidden = !canRod();
  el('map-open').hidden=phase!=='idle';el('groundbait').hidden=true;el('retrieve-setting').hidden=game.method!=='lure'||phase!=='waiting';document.body.dataset.method=game.method;document.body.dataset.post=game.post;
  el('tension-display').hidden = !save.settings.controls?.tension||!['fighting','landing'].includes(phase);
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
  const reedsWereOpen=save.progression.posts.includes('reed-bank');
  if(learning){learning.sample(game);game.result.controlled=false;}
  const badges = recordCatch(save, game.result);if(learning){const specimen=save.journal.at(-1)!;save.coins-=specimen.reward.coins;save.xp-=specimen.reward.xp;specimen.reward={base:0,discovery:0,record:0,coins:0,xp:0};}else{for(const skill of game.cleanEvents)learnSkill(save,familyFor(game.technique.id).id,skill);} saveNow(); refreshCollection();
  if(badges.first||badges.variant)document.dispatchEvent(new CustomEvent('fishdex-discovery',{detail:{id:game.result.speciesId}}));
  el('catch-progression').textContent=!reedsWereOpen&&save.progression.posts.includes('reed-bank')?'Le pêcheur vous laisse la bordure des roseaux. Ce poste est désormais ouvert définitivement.':save.total===1&&!save.progression.initiation?'Première prise réussie. L’initiation aux leurres est disponible dans Ma canne.':'';
  const specimen = save.journal.find(s => s.id === game.result!.id)!;
  viewedSpecimen = specimen; liveCatchView = true;
  el('caught').classList.toggle('first-discovery', badges.first);
  const dexNumber = SPECIES.find(f=>f.id===specimen.speciesId)!.number;
  el('catch-heading').textContent = badges.first ? `FishDex #${String(dexNumber).padStart(3, '0')} · Nouvelle découverte` : badges.record ? 'Votre nouveau record' : 'Une belle rencontre';
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
  el('specimen-illustration').innerHTML=specimenArt(s);
  if(!reward)el('catch-progression').textContent='';
  el('catch-weight').textContent = `${s.weight.toLocaleString('fr-FR')} kg · ${appearanceName(s.appearanceId)??(s.coloration === 'golden' ? 'Reflets dorés' : 'Robe naturelle')}${s.mirage ? ' · Mirage' : ''}`;
  const r = s.reward;
  el('catch-reward').textContent = reward ? `+${r.coins} écus · +${r.xp} XP — Photo ${r.base}${r.discovery ? `, découverte +${r.discovery}` : ''}${r.record ? `, record +${r.record}` : ''}${r.appearance?`, robe +${r.appearance}`:''}` : `${new Date(s.date).toLocaleString('fr-FR')} · ${s.location}${s.baitItem?' · '+component(s.baitItem)?.name:''} · ${s.method==='pole'?'Coup':s.method === 'float' ? 'Flotteur' : s.method === 'lure' ? 'Leurre' : 'Fond'} · ${ITEMS.find(i => i.id === s.equipment)?.name ?? 'Canne de bordure'}`;
  el('favorite-catch').textContent = save.favorites.includes(s.id) ? 'Retirer des favoris' : 'Ajouter aux favoris';
  el('photo-state').textContent = 'La photo se prépare…';
  el('specimen-history').textContent=[s.post?postById(s.post).name:s.location,s.technique?techniqueById(s.technique).name:undefined,s.reward.discovery?'Première découverte enregistrée':undefined,s.reward.record?'Record établi lors de cette prise':undefined,s.controlled?'Réception contrôlée':undefined].filter(Boolean).join(' · ');
  el('release-fish').textContent = reward ? 'Continuer à pêcher' : el<HTMLDialogElement>('aquarium').open ? 'Retour à l’aquarium' : 'Retour au carnet';
}
async function photograph(s: Specimen, request: number) {
  let blob = await getPhoto(s.id);const original=!!blob;
  if (!blob && request === catchViewRequest) blob = await preview?.photo() ?? undefined;
  const ok = !!blob && await storePhoto(s.id, blob);
  if (request === catchViewRequest) el('photo-state').textContent = ok ? (liveCatchView?'Photo conservée sur cet appareil · prise photographiée.':original?'Photo conservée sur cet appareil · souvenir local.':'Photo conservée sur cet appareil · aperçu régénéré depuis le souvenir.') : 'Photo indisponible. Votre capture et ses gains sont conservés.';
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
  release();cancelGesture();document.dispatchEvent(new Event('fishing-input-reset'));
  if (game.phase === 'bite') { audio.tone('bite',game.modern?(game.config.components.float?'float':game.technique.engine==='surface'||game.rig.recipe==='seche'?'surface':['bottom','feeder'].includes(game.technique.engine)?'tip':'contact'):undefined); toast((game.modern?game.technique.signal+' : ':'')+'prise ! Ferrez.'); }
  if (game.phase === 'fighting') { el('toast').hidden = true; teach(2, game.hasReel? `Glissez sur la commande de canne à ${save.settings.controls?.side==='right'?'droite':'gauche'}, ou sur l’eau. Maintenez Mouliner de l’autre côté ; relâchez pour arrêter.`:'Au coup, suivez le fil avec la canne. Baissez-la pendant un départ, relevez progressivement pour rapprocher le poisson. Aucun moulinet.'); }
  if (game.phase === 'casting' || game.phase === 'lost' || game.phase === 'idle') saveNow();
  if (game.phase === 'lost') { const losses=Object.entries(save.tackle.active?.losses??{}).map(([id,n])=>`${component(id)?.name} : ${n}`); toast(game.failure+(losses.length?' Perdu : '+losses.join(' · '):' Aucun composant payant perdu.')); }
  if (game.phase === 'caught') {world?.flushWater(game);void showCatch();}
}
function activate() {
  if (!world || overlayPaused || manualPaused) return;
  if (game.phase === 'bite') { void audio.unlock(); game.strike(); phaseChanged(); }
}
let reelPointer: number | undefined;let actionGesture:ActionGesture|undefined;let netOrigin={x:0,z:0};
let reelAngle = 0;
let gesture: { id: number; x: number; y: number; yaw: number; lift: number; casting: boolean; time:number;cast?: CastGesture } | undefined;
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
  const id = reelPointer; reelPointer = undefined;actionGesture=undefined;game.holdReel(false); reel.classList.remove('reeling');
  if (id !== undefined && reel.hasPointerCapture(id)) reel.releasePointerCapture(id);
}
function canRod(){return !overlayPaused&&!manualPaused&&(['fighting','landing','bite'].includes(game.phase)||game.phase==='idle'&&game.modern&&game.technique.engine==='fly'||game.phase==='waiting'&&(game.canAnimate||game.snagged));}
function canSecondary(){return !overlayPaused&&!manualPaused&&(game.phase==='landing'||game.phase==='fighting'&&(game.hasReel||game.technique.sections)||game.phase==='waiting'&&game.hasReel&&game.canAnimate);}
function canReel() { return game.hasReel&&!overlayPaused && !manualPaused && (game.phase === 'fighting' || game.phase === 'waiting' && game.canAnimate); }
function turnReel(turns: number) {
  if (!canReel() || !turns) return;
  game.reel(turns); reelAngle += turns * 360; reel.style.setProperty('--reel-angle', `${reelAngle}deg`); void audio.unlock();
}
el('strike').onclick = activate;
el('retry').onclick = () => { game.reset(); phaseChanged(); };
reel.addEventListener('pointerdown',e=>{
 if(e.button!==0||reelPointer!==undefined||!canSecondary())return;if(save.settings.controls?.singleFinger)cancelGesture();
 reelPointer=e.pointerId;netOrigin={...game.netPosition};actionGesture=game.phase==='landing'?new ActionGesture(e.clientX,e.clientY,e.timeStamp,'net',game.netReady):game.technique.sections?new ActionGesture(e.clientX,e.clientY,e.timeStamp,'pole'):undefined;
 if(!actionGesture)game.holdReel(true);reel.setPointerCapture(e.pointerId);void audio.unlock();
});
reel.addEventListener('pointermove',e=>{if(e.pointerId!==reelPointer||!actionGesture)return;const action=actionGesture.move(e.clientX,e.clientY,e.timeStamp);if(actionGesture.kind==='pole'){if(actionGesture.axis==='vertical')game.movePole(action.retreat);if(action.detach&&!game.detachPole(action.reattach))toast(action.reattach?'Avancez le kit avant de réemboîter.':'Reculez jusqu’à la jonction, puis glissez latéralement.');}else if(actionGesture.liftEligible){if(action.lift)game.liftNet(action.lift); }else game.placeNet(netOrigin.x+action.dx*.02,netOrigin.z-action.dy*.025);});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) reel.addEventListener(type, e => { if ((e as PointerEvent).pointerId === reelPointer) release(); });
window.addEventListener('pointerup', e => { if (e.pointerId === reelPointer) release(); });
window.addEventListener('pointercancel', e => { if (e.pointerId === reelPointer) release(); if (e.pointerId === gesture?.id) cancelGesture(); });
rodControl.addEventListener('pointerdown', e => {
  if (e.button !== 0 || gesture || !canRod()) return;if(save.settings.controls?.singleFinger)release();
  gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: game.desiredYaw, lift: game.desiredLift, casting: false,time:e.timeStamp };
  rodControl.setPointerCapture(e.pointerId); void audio.unlock();
});
rodControl.addEventListener('pointermove', e => {
  if (!gesture || gesture.id !== e.pointerId || !rodControl.hasPointerCapture(e.pointerId)) return;
  const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
  // Déplacement relatif au doigt : pose conservée entre les gestes.
  game.orient(gesture.yaw + dx / 76, gesture.lift - dy / 130);if(game.phase==='bite'&&-dy>18&&e.timeStamp-gesture.time<=1500&&game.desiredLift>gesture.lift+.1)game.strike();
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
  if (!(['idle', 'fighting'].includes(game.phase) || game.phase === 'waiting' && (game.method === 'lure'||game.snagged))) return;
  if (game.phase === 'idle' && !CastGesture.canStart(e.clientY, innerHeight)) return;
  gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: game.desiredYaw, lift: game.desiredLift, casting: game.phase === 'idle',time:e.timeStamp };
  if (gesture.casting) { gesture.cast = new CastGesture({ x: e.clientX, y: e.clientY, time: e.timeStamp }, innerWidth, innerHeight, game.equipmentPower,point=>game.inspect(point),game.reach); game.orient(0, 0.15); }
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
window.addEventListener('resize', () => { game.release();document.dispatchEvent(new Event('fishing-input-reset'));release(); cancelGesture(); });
window.addEventListener('wheel', e => {
  if (!canReel() || !(e.target === canvas || (e.target as HTMLElement).closest?.('#reel-control'))) return;
  e.preventDefault(); turnReel(wheelTurns(e.deltaY || e.deltaX, e.deltaMode));
}, { passive: false });
window.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.repeat || overlayPaused || manualPaused || (e.target as HTMLElement).closest?.('input,select,button')) return;
  e.preventDefault(); activate();
});
installUIResourceFallback();
hub = new GameScreens({ save: () => save, game, open: openModal, close: closeModal, persist: saveNow, refresh: refreshCollection, toast,postChanged:()=>{world?.setPost(game.post);renderPhase();} });
observationScreens=installObservations({save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast});
const updateTechniqueControls=installTechniqueControls({isPaused:()=>overlayPaused||manualPaused,save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast});
const updateFieldTools=installFieldTools({save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast});
installDevelopment({save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast,postChanged:()=>{world?.setPost(game.post);renderPhase();}},profiles);
if (loaded.recovery) { el('help').insertAdjacentHTML('beforeend', '<div class="recovery-panel"><h3>Récupérer une sauvegarde</h3><p class="warning-line">Le fichier original est conservé. Exportez-le avant de poursuivre ; vous pourrez importer une sauvegarde saine dans le carnet.</p><button id="export-recovery" class="secondary">Exporter le fichier original</button></div>'); el('export-recovery').onclick = () => { const url = URL.createObjectURL(new Blob([loaded.recovery!], {type:'application/json'})), a=document.createElement('a');a.href=url;a.download='au-fil-de-leau-recuperation.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);recoveryPreserved=true; }; }
if (save.tackle.active?.outcome === 'return') saveNow();
el('menu-open').onclick = () => openModal('menu');
el('prepare-open').onclick = el('equipment-open').onclick = () => { renderPhase(); openModal('preparation'); };
installWaterTools({save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast,postChanged:()=>{world?.setPost(game.post);renderPhase();}},()=>world);
memories=installMemories({save:()=>save,game,open:openModal,close:closeModal,persist:saveNow,refresh:refreshCollection,toast},()=>void loadAquarium());
if(el('export-recovery'))el('settings-storage').append(el('export-recovery').closest('.recovery-panel')!);
document.addEventListener('click',e=>{if((e.target as HTMLElement).closest('[data-journal-reset]'))el('journal-reset').click();});
el('progress-open').onclick = () => { refreshCollection(); openModal('progression'); };

el('snag-release').onclick=()=>toast(game.tryFreeSnag()?'Ligne dégagée.':game.hint);
el('retrieve-speed').onchange=()=>{const value=Number(el<HTMLSelectElement>('retrieve-speed').value);if([.8,1.6,2.2].includes(value))game.retrievalSpeed=value;};
el('cancel-cast').onclick = () => { release(); cancelGesture(); game.reset(); phaseChanged(); };
el('collection-open').onclick = () => { refreshCollection(); openModal('collection'); };
el('help-open').onclick = () => openModal('help');
el('dex-open').onclick = () => { refreshDex(); openModal('encyclopedia'); };
for (const id of ['dex-search', 'dex-category', 'dex-state']) el(id).addEventListener('input', refreshDex);
el('shop-open').onclick = () => { el<HTMLSelectElement>('shop-family').value='all'; openModal('shop'); };
el('aquarium').addEventListener('aquarium-refresh',()=>void loadAquarium());
el('aquarium-open').onclick = () => { openModal('aquarium'); void loadAquarium(); };
el('aquarium-add').onclick = () => { const id = el<HTMLSelectElement>('aquarium-choice').value; if (!id) return;if(save.favorites.length===5){toast('Cinq favoris : choisissez l’emplacement à remplacer.');memories?.refresh();return;} const error = toggleFavorite(save, id); if (error) { toast(error); return; } saveNow(); refreshCollection(); void loadAquarium(); };
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
el('gear-list').onclick = event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button'); if (!button) return;
  if (button.dataset.buy) { hub?.buy(button.dataset.buy); return; }
  if (button.dataset.equip && game.phase === 'idle' && save.inventory.includes(button.dataset.equip as ItemId)) { const error=equipRod(save,button.dataset.equip as ItemId);if(error)toast(error);else equip(); }
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
  if(!dialog.open){const index=modalLayers.indexOf(dialog);if(index>=0)modalLayers.splice(index,1);}
  overlayPaused = !!document.querySelector('dialog[open]'); release();
  if (dialog.id === 'caught') { catchViewRequest++; preview?.dispose();preview=undefined; viewedSpecimen = undefined; if (liveCatchView) { game.reset(); phaseChanged(); } if (el<HTMLDialogElement>('aquarium').open) { refreshAquariumControls(); void loadAquarium(); } }
  if (dialog.id === 'aquarium') { aquariumRequest++; aquarium?.dispose(); aquarium = undefined; }
  if(modalLayers.at(-1)?.id==='aquarium')aquarium?.resume();if(modalLayers.at(-1)?.id==='caught')preview?.resume();
  if(dialog.id==='shop'&&el<HTMLDialogElement>('aquarium').open){refreshAquariumControls();memories?.refresh();}
}));
el('release-fish').onclick = () => {if(liveCatchView)game.releaseCaughtFish();closeModal('caught');};
el('sound').onclick = () => { save.settings.sound = !save.settings.sound; audio.enabled = save.settings.sound; void audio.unlock(); refreshSettings(); saveNow(); };
for(const id of ['control-side','control-single','control-tension','control-hints'])el(id).onchange=()=>{save.settings.controls={side:el<HTMLSelectElement>('control-side').value==='right'?'right':'left',singleFinger:el<HTMLInputElement>('control-single').checked,tension:el<HTMLInputElement>('control-tension').checked,hints:el<HTMLInputElement>('control-hints').checked};release();cancelGesture();refreshSettings();renderPhase();saveNow();};
el('quality').onclick = () => { save.settings.quality = save.settings.quality === 'eco' ? 'high' : 'eco'; world?.setQuality(save.settings.quality);world?.setWaterQuality(save.settings.waterQuality??'low'); refreshSettings(); saveNow(); };
el('export-save').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `au-fil-de-leau-${profiles.active}-carnet-${new Date().toISOString().slice(0, 10)}.json`; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
el('export-before-progression').onclick=()=>{let raw:string|null=null;try{raw=storage?.getItem('au-fil-de-leau.save.before-v7')??storage?.getItem('au-fil-de-leau.save.before-v6')??storage?.getItem('au-fil-de-leau.save.before-v5')??(migrationBackupPending?storage?.getItem('au-fil-de-leau.save.v1')??null:null);}catch{/* export courant disponible */}if(!raw){toast('Aucun carnet ancien sur cet appareil. Exportez votre progression actuelle.');return;}const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='au-fil-de-leau-avant-progression.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);};
el('import-save').onclick = () => el<HTMLInputElement>('save-file').click();
el<HTMLInputElement>('save-file').onchange = async event => {
  const input = event.target as HTMLInputElement; const file = input.files?.[0];
  if (!file) return;
  const request = ++importRequest; pendingImport = undefined; el('import-review').hidden = true;
  try {
    if (file.size > MAX_SAVE_BYTES) throw new Error('Fichier trop volumineux.');
    const parsed = parseSave(await file.text()); if (request !== importRequest) return; if(!profiles.accepts(parsed))throw Error('Carnet de test et partie normale ne peuvent pas être mélangés.'); pendingImport = parsed;
    el('import-description').textContent = `Profil ${profiles.active==='test'?'TEST':'normal'} : ${pendingImport.total} prises, ${pendingImport.observations.length} observations, ${pendingImport.coins} écus et niveau ${levelFor(pendingImport.xp)}. Remplace progression, stock, favoris et réglages actuels (${save.total} prises). Les photos locales ne sont pas dans le fichier. Exportez avant de confirmer.`;
    el('import-review').hidden = false;
  } catch (error) { if (request === importRequest) toast(error instanceof Error ? error.message : 'Fichier invalide.'); }
  input.value = '';
};
el('confirm-import').onclick = () => {
  if (!pendingImport) return;
  game.reset(); release(); cancelGesture(); phaseChanged();
  save = pendingImport; pendingImport = undefined; el('import-review').hidden = true;
  game.rights=save.progression;game.setMethod(save.preparation.method); game.setBait(save.preparation.bait);game.setPost(save.preparation.post);game.combatMode=save.settings.combatMode; equip(); renderPhase();
  audio.enabled = save.settings.sound; world?.setQuality(save.settings.quality);world?.setPost(game.post);world?.setWaterQuality(save.settings.waterQuality??'low');
  saveNow(); refreshCollection(); refreshSettings(); toast('Votre carnet a été restauré.');
};
el('cancel-import').onclick = () => { pendingImport = undefined; el('import-review').hidden = true; };
function pauseManually() { game.release();document.dispatchEvent(new Event('fishing-input-reset'));release(); cancelGesture(); aquarium?.pause(); preview?.pause(); if (!overlayPaused) { manualPaused = true; el('paused').hidden = false; } }
window.addEventListener('blur', pauseManually);
window.addEventListener('pagehide', () => { pauseManually(); preview?.pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseManually(); preview?.pause(); } else if (el<HTMLDialogElement>('caught').open) preview?.resume(); else if (el<HTMLDialogElement>('aquarium').open) aquarium?.resume(); });
window.addEventListener('focus', () => { if (el<HTMLDialogElement>('caught').open) preview?.resume(); else if (el<HTMLDialogElement>('aquarium').open) aquarium?.resume(); });
el('resume').onclick = () => { manualPaused = false; el('paused').hidden = true; };

document.addEventListener('learning-start',e=>{if(learning||game.phase!=='idle'){toast('Terminez la ligne ou quittez l’exercice en cours.');return;}try{learning=new LearningSession(save,(e as CustomEvent).detail);save=learning.loan;game.reset();game.accessBypass=true;equip();game.setMethod(save.preparation.method);game.setPost(save.preparation.post);world?.setPost(game.post);setPhotoProfile('test');for(const d of [...modalLayers].reverse())if(d.open)d.close();refreshCollection();renderPhase();el('app').insertAdjacentHTML('beforeend','<button id="learning-exit" class="secondary learning-exit">Prêt d’apprentissage · Quitter</button>');el('learning-exit').onclick=()=>{game.reset();save=learning!.normal;learning=undefined;game.accessBypass=save.development?.kind==='sandbox';equip();game.setMethod(save.preparation.method);game.setPost(save.preparation.post);world?.setPost(game.post);setPhotoProfile(profiles.active);el('learning-exit').remove();saveNow();refreshCollection();renderPhase();toast('Matériel rendu. Vos exercices acquis sont conservés.');};toast('Prêt gratuit : préparation puis pêche. Captures exclues de votre carnet normal.');}catch(error){learning=undefined;toast(String(error));}});
refreshCollection(); refreshSettings(); renderPhase();saveNow();
try {
  world = new LakeWorld(el<HTMLCanvasElement>('world'), save.settings.quality);world.setPost(game.post);world.setWaterQuality(save.settings.waterQuality??'low');world.pondWater.onEvent=e=>audio.water(e);
  let lastTime = performance.now(); let accumulator = 0; let lastRender = 0; let renderDeadline=0;
  world.engine.runRenderLoop(() => {
    const now = performance.now(); const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now;
    if (document.hidden) { accumulator = 0; return; }
    if ((game.reeling || game.phase === 'fighting' && game.dragSpeed > 0.08) && !overlayPaused && !manualPaused && now - lastReelSound > 180) { audio.tone(game.dragSpeed > 0.08 ? 'drag' : 'reel'); lastReelSound = now; }
    if (!overlayPaused && !manualPaused && !qaSimulationPaused) {
      accumulator += dt;
      while (accumulator >= 1 / 60) { game.update(1 / 60); learning?.sample(game); phaseChanged(); accumulator -= 1 / 60; }
    } else accumulator = 0;
    reel.classList.toggle('reeling', game.reeling);el('snag-release').hidden=!game.snagged;el('rod-control').hidden=!canRod();reel.hidden=!canSecondary();el('tension-display').hidden=!save.settings.controls?.tension||!['fighting','landing'].includes(game.phase);if(gesture&&!gesture.casting&&!canRod())cancelGesture();updateTechniqueControls();updateFieldTools();const context=`${postById(game.post).name} · ${game.phase==='idle'?(game.method==='pole'?'Placement proche · coup sans moulinet':'Préparez votre présentation'):`${game.presentationDepth.toFixed(1)} m · ${game.hint||(game.modern&&game.encounterState!=='none'?({approach:'Approche',examine:'Inspection : attendez la prise',follow:'Suit la présentation',attack:'Prise',refuse:'Refus',none:''})[game.encounterState]:'')||(game.microzone==='plants'?'Herbiers':game.microzone==='margin'?'Bordure':'Eau ouverte')}`}`;if(el('fishing-context').textContent!==context)el('fishing-context').textContent=context;
    if (reelPointer !== undefined && canReel() && !qaSimulationPaused) {
      reelAngle += game.reelSpeed * dt * 360; reel.style.setProperty('--reel-angle', `${reelAngle}deg`);
    }
    if (game.phase === 'fighting' && game.dragSpeed > 0.02 && !overlayPaused && !manualPaused && !qaSimulationPaused) {
      reelAngle -= game.dragSpeed * dt * 180; reel.style.setProperty('--reel-angle', `${reelAngle}deg`);
    }
    if (['fighting','landing'].includes(game.phase) && !overlayPaused && !manualPaused) {
      const angle = Math.round(Math.atan2(game.fishPosition.x, game.fishPosition.z + 1) * 180 / Math.PI);
      // Le repère de la jauge affiche exactement la tension qui courbe la canne.
      const percent = Math.round(Math.min(1, game.tension) * 100);
      el('tension-display').style.setProperty('--tension', `${percent}%`);
      el('tension-meter').setAttribute('aria-valuenow', String(percent));
      canvas.setAttribute('aria-description', `Fil à ${angle} degrés, tension ${percent} pour cent. Canne latérale ${Math.round(game.rodYaw*100)} pour cent, hauteur ${Math.round(game.rodLift*100)} pour cent.`);
      const danger = game.tension > .85?'Charge forte : accompagnez le départ.':game.tension<.04?'Contact perdu : reprenez le fil ou relevez la canne.':game.phase==='landing'&&game.netReady?'Réception sous la prise : relevez.':game.returning&&game.hasReel?'Il revient : reprenez le fil.':game.canDetach?'Jonction accessible : glissez latéralement.':game.canReceive&&game.phase==='fighting'?'À portée : préparez la réception.':'';
      if (save.settings.controls?.hints&&danger && danger !== lastLineAlert && now > alertUntil + 2000+Math.min(6000,save.total*750)) { el('line-alert').textContent = danger; el('line-alert').hidden = false; alertUntil = now + 1800; }
      lastLineAlert = danger;
    } else if (!['fighting','landing'].includes(game.phase)) { canvas.removeAttribute('aria-description'); el('line-alert').hidden = true; }
    if (now > alertUntil) el('line-alert').hidden = true;
    if (!overlayPaused && !manualPaused && now + .25 >= renderDeadline) {
      world!.update((now - lastRender) / 1000 > 0.1 ? 1 / 30 : (now - lastRender) / 1000, game);
      world!.scene.render(); lakeFrames++; lastRender = now; renderDeadline=nextRenderDeadline(now,renderDeadline,save.settings.quality==='eco'?1000/30:0);
    }
  });
  world.scene.executeWhenReady(() => { el('loading').hidden = true; document.body.dataset.ready = 'true'; if (loaded.warning) toast(loaded.warning); else teach(1, 'Partez du bas, projetez vers l’eau puis relâchez au centre pour lancer.'); });
  el<HTMLCanvasElement>('world').addEventListener('webglcontextlost', () => { pauseManually(); toast('Le rendu 3D a été interrompu. Rechargez la page si l’image ne revient pas.'); });
} catch (error) {
  console.error(error);
  el('loading').innerHTML = '<h2>L’étang ne s’affiche pas.</h2><p>Le navigateur n’a pas pu démarrer la 3D.<br>Essayez un navigateur récent avec WebGL activé.</p><button class="secondary" onclick="location.reload()">Réessayer</button><button id="loading-menu" class="action">Consulter les menus</button>';
  el('loading-menu').onclick=()=>{el('loading').hidden=true;openModal('menu');};document.body.dataset.ready='error';
}

// Interface de test uniquement dans le serveur de développement E2E, supprimée du build.
if (world && import.meta.env.DEV && import.meta.env.VITE_E2E === '1') {
  const {manageFight} = await import('./testing/combat-driver');
  const { SceneInstrumentation } = await import('@babylonjs/core/Instrumentation/sceneInstrumentation');
  const instrumentation = new SceneInstrumentation(world!.scene);
  instrumentation.captureFrameTime = true;
  Object.assign(window, { __fishingQA: {
    aquariumOrbit:()=>aquarium?.inspectOrbit(),
    fishActor:()=>world?.fishActorDiagnostics(),
    waterScene:()=>world?.scene,waterReflectors:()=>world?.pondScenery.reflectors,water:()=>world?.waterDiagnostics(),waterDemo:(type:import('./game/water-events').WaterType)=>world?.waterDemo(type),waterQuality:(q:import('./render/pond-water').WaterQuality)=>world?.setWaterQuality(q),ambience:(p:'morning'|'overcast'|'evening')=>world?.setAmbience(p),compareWater:(simple:boolean)=>world?.pondWater.compare(simple),environmentPlacements:()=>world?.pondScenery.placements,replaceAsset:(family:string,url:string|null)=>world?.pondScenery.replace(family,url),
    rendering: () => ({ drawCalls: instrumentation.drawCallsCounter.current, cpuFrameMs: instrumentation.frameTimeCounter.current,
      vertices: world!.scene.getTotalVertices(), meshes: world!.scene.getActiveMeshes().length,
      width: world!.engine.getRenderWidth(), height: world!.engine.getRenderHeight(),
      textures: world!.scene.textures.map(t => ({ name: t.name, ...t.getSize() })) }),
    pauseSimulation: () => { qaSimulationPaused = true; },
    resumeSimulation: () => { qaSimulationPaused = false; },
    snapshot: () => ({sceneId:world?.scene.uid,totalMeshes:world?.scene.meshes.length,fish:game.fish?.id,specimen:game.specimenId,seed:game.specimenSeed,appearance:game.appearance,post:game.post,method:game.method,hasReel:game.hasReel,presentationDepth:game.presentationDepth,microzone:game.microzone,snagged:game.snagged,rights:save.progression,camera:world?.camera.position.asArray(),technique:game.config.technique,recipe:game.config.recipe,boat:game.presentationState.boat,sections:game.rodSections,retreat:game.poleRetreat,detached:game.detachedSections,geometry:game.rodGeometry,fishPosition:game.fishPosition,net:game.netPosition,netReady:game.netReady,netLift:game.netLift,canReceive:game.canReceive,encounter:game.encounterState,phase: game.phase, tension: game.tension, abrasion:game.abrasion,fatigue: game.fatigue, slack: game.slack, dragSpeed: game.dragSpeed, lineLength: game.lineLength, fishDistance: game.fishDistance, returning: game.returning, progress: game.progress, reeling: game.reeling, pulling: game.pulling, total: save.total, paused: manualPaused || overlayPaused, direction: game.direction, reelSpeed: game.reelSpeed, alignment: game.alignment, rodTip: world?.rodTipOnScreen(), target: game.target, yaw: game.rodYaw, lift: game.rodLift, aquarium: aquarium?.diagnostics(), engines: Engine.Instances.length, lakeFrames, meshes: world?.scene.getActiveMeshes().length }),
    advance: (seconds:number,mode?:'smart')=>{const initialPhase=game.phase;for(let i=0;i<seconds*60;i++){if(mode==='smart'&&['fighting','landing'].includes(game.phase))manageFight(game,false,false);else game.update(1/60);phaseChanged();if(mode==='smart'&&game.canReceive&&game.fishPosition.y>-.65||['caught','lost','bite'].includes(game.phase)||game.phase==='landing'&&initialPhase!=='landing')break;}},
  } });
}
