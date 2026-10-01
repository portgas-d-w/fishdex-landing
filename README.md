# Au fil de l’eau — 0.4.0

Jeu de pêche 3D solo pour navigateur mobile, Babylon.js + TypeScript + Vite. Nom, décor et équilibrage provisoires. Sans compte, paiement, backend ni clé API.

## Jouer et reprendre

Production : [www.fishdex.fr](https://www.fishdex.fr), projet existant fishdex-landing. État de la publication : docs/VERCEL.md et RELAIS_PROJET.md. Le jeu remplace la landing autorisée ; le projet FishDex de référence reste inchangé.

Partir du tiers inférieur, projeter vers l’eau puis relâcher au centre ou plus haut pour lancer. La vitesse récente donne la puissance, l’amplitude contribue et le matériel borne la portée ; cible/trajectoire et refus hors eau conservés. Aucun bouton de lancer automatique. En combat : deux commandes rondes en bas, canne à gauche (glissement dans les quatre directions), moulinet à droite (second doigt en cercle). Le glissement sur l’eau continue aussi à orienter la canne. Sur PC : glissement de souris et molette simultanés. Un appui immobile ne récupère rien ; espace peut ferrer uniquement. Suivre le fil et accompagner les départs : le frein rend du fil sous résistance. La pression modérée fatigue le poisson ; récupérer le mou s’il revient, puis le ramener au bord quand il faiblit. La canne et le fil montrent la traction ; une jauge compacte Tension du fil, verte/jaune/orange, occupe l’espace entre les commandes. Aucun panneau décrivant le poisson.

Menu compact : matériel, carnet/FishDex, aquarium, boutique, progression et réglages. Les écrans ont un retour ; le menu suspend le combat et bloque les gestes de scène. Hors combat, accès Matériel direct. Le jeu bloque la sélection et les actions natives d’appui long uniquement sur ses surfaces ; le carnet et la boutique défilent, les champs restent éditables et sélectionnables. Trois méthodes effectives : flotteur, leurre animé/récupéré et fond.

Quinze espèces du pack, carnet individuel avec photos, records, robes et Mirage. Encyclopédie issue des fichiers FishDex : 96 fiches regroupées en 59 binômes déclarés, contenus non jouables indiqués prévus. XP, badges, écus et boutique de trois cannes/deux décorations. Aquarium personnalisable avec cinq spécimens favoris, nage procédurale provisoire et fiches personnelles.

La sauvegarde appartient au navigateur et au domaine. Migration de l’ancienne version conservant les records ; export/import JSON pour le transfert. Photos locales IndexedDB séparées, non incluses dans le JSON et régénérables depuis les souvenirs. Pas de synchronisation ni PWA hors connexion.

## Installation et commandes

Node.js 24 LTS recommandé, minimum 22.12. Ouvrir le dossier dans Codex ou Claude, lire AGENTS.md puis RELAIS_PROJET.md. Ne pas ouvrir index.html par double-clic.

```sh
node scripts/setup.mjs
npm run dev
```

| Commande | Rôle |
| --- | --- |
| npm ci | Installer les versions verrouillées |
| npm run dev | Serveur Vite et adresse réseau pour essai Wi-Fi |
| npm run check | TypeScript strict, tests de logique et build |
| npx playwright install chromium | Navigateur des vérifications automatisées |
| npm run test:e2e | Bureau 1440×900 et Chromium tactile 390×844, serveur dédié 5174 |
| npm run preview | Servir dist localement après build |
| npm run test:smoke | Vraie partie sur build servi, sans QA ; GAME_URL pour cible distante |

Exécuter E2E et smoke successivement. Validation 0.4 : npm run check, 30 tests de logique + TypeScript/build ; 23 scénarios E2E ciblés validés en deux passes finales (1 ignoré selon viewport), dont appuis longs, deux doigts, défilement/saisie, frein et lancer lent/rapide. Smoke du build, de la preview protégée et de la production publique : 6/6 sur chaque cible. Résultats détaillés dans docs/VERIFICATION.md et docs/VERCEL.md. Les mesures Chromium logiciel de ce PC ne valident pas les 30 FPS sur iPhone 14 Pro ; Safari, chauffe et autonomie restent à tester sur appareil.

## Organisation et ressources

Règles indépendantes dans src/game/, scènes dans src/render/, photos et audio dans src/ui/. Quinze GLB et 88 miniatures dans public/. Conversion, inventaire et import reproductible dans scripts/. Tests et documents de reprise dans tests/ et docs/.

Pack River fish / TricksUp fourni par l’utilisateur sous sa licence d’origine. Archive privée assets-source/ exclue de Git et Vercel, jamais envoyée à un générateur. Quinze GLB optimisés 1,73 Mo, chargés à la demande. Les 50 FBX n’ont pas de rig livré ; respiration, présentation suspendue et épuisette restent à faire. Voir docs/ASSETS_POISSONS.md et docs/MISSION_AUTONOME.md.

Pas de test iPhone réel annoncé, pas de nouvelle souscription, pas de modification du dépôt FishDex de référence. Lire et actualiser RELAIS_PROJET.md à chaque session ; suivre docs/BACKLOG.md.
