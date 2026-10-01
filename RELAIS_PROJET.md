# RELAIS PROJET — Codex ↔ Claude Code

**Dernière mise à jour : 30 septembre 2026. Agent : Codex. Version : 0.1.0.**

Ce fichier est la source de vérité du chantier. Lire au début de chaque session,
mettre à jour à la fin. Codex et Claude ne partagent pas automatiquement leur mémoire.

## 1. Ce que veut le propriétaire

Créer un jeu en pilotant les assistants par prompts, sans écrire lui-même de code
ou produire manuellement tous les assets. Jeu 3D de pêche, solo, sur navigateur et
jouable sur mobile. Un jeu plaisant à pratiquer et à collectionner.

Il dispose de Claude Pro, de ChatGPT Plus/Codex, de Tripo annuel et d’un compte Vercel
avec des sites déjà déployés. Il ne souhaite pas d’autre abonnement.
Le pack acheté de poissons est fourni. Blender peut être utilisé par les agents.
Codex commence maintenant ; Claude pourra reprendre après le rétablissement de son quota dimanche.
Ce relais n’implique aucune exécution automatique dimanche.

## 2. Périmètre retenu pour commencer

- Nom provisoire : **Au fil de l’eau**.
- Lieu provisoire : **L’étang des Saules**, à l’aube.
- 3 postes dans le même étang : roselière, eau libre, sous le saule.
- 2 appâts : ver, petit leurre ; les combinaisons modifient les espèces possibles.
- 5 poissons : gardon, perche, carpe, brochet, sandre.
- Boucle : choisir → lancer → attendre → ferrer → gérer le fil → découvrir la prise → remettre à l’eau.
- Carnet, records de longueur, nombre de rencontres et export/import.

Le nom, le décor et l’équilibrage sont des propositions de travail de Codex ;
ils n’ont pas encore été validés par un test du propriétaire.

## 3. Ce qui est réellement construit

- Dossier complet Vite + TypeScript strict + Babylon.js, dépendances exactes et `package-lock.json`.
- Infrastructure statique pour Vercel : `vercel.json`, `.vercelignore`, build `dist/`.
- Installation reproductible avec `node scripts/setup.mjs` ; Node 24 recommandé.
- Scène 3D procédurale : eau animée, berges, arbres, roseaux, nénuphars, ponton, canne, ligne et bouchon.
- Regroupement des objets statiques par matériau pour réduire les appels de rendu.
- Interface française responsive, boutons tactiles, contrôles souris et espace.
- Machine à états, touches temporisées, tension, casse du fil et décrochage.
- Victoire accessible pour les cinq espèces ; différences de force, pas encore de vrais comportements spécifiques.
- Carnet local versionné, validation des imports, confirmation avant remplacement, erreur de stockage non bloquante.
- Sons courts synthétisés, désactivés par défaut, réglage de qualité et pause.
- Vrais poissons présentés en 3D après capture.
- Documentation de reprise et backlog ; `AGENTS.md` pour les deux agents, `CLAUDE.md` comme point d’entrée Claude.

## 4. Assets

`assets-source/riverfishpack.zip` est la copie privée non modifiée du pack fourni.
Elle est exclue de Git et du déploiement. Aucun asset n’a été envoyé à un générateur.

Codex a utilisé **Blender 4.5.3 LTS en mode sans interface** et le script
`scripts/convert_fish.py` pour cinq GLB, textures 512² intégrées.
Les cinq GLB totalisent **833 376 octets** ; le manifeste contient les tailles individuelles.
Le modèle affiché mesure 2 unités de présentation, indépendamment de la longueur de la prise.

Le pack brut possède 50 FBX statiques, sans squelette ni animation dans ces fichiers.
La version actuelle ne contient **pas de nage articulée**. La caméra de la fiche
oscille simplement autour du poisson. Ne pas annoncer une animation de nage réalisée.

## 5. Vérifications réalisées

- Installation des dépendances dans l’environnement de création : réussie.
- `npm run check` : TypeScript + **9 tests de logique** + build réussis.
- **4 tests navigateur** réussis (2 scénarios × bureau et viewport mobile Chromium).
- Scénario de prise : lancer, ferrer, gérer le combat avec simulation de test,
  charger un vrai GLB, enregistrer, relâcher, recharger, retrouver le carnet.
- Test d’annulation d’appui, pause via carnet et rejet d’un import invalide.
- Contrôle visuel des captures ; cadrage corrigé pour rendre le bouchon visible sur mobile.
- Structure binaire des cinq GLB vérifiée : compteurs, tailles, textures embarquées.
- `npm audit --omit=dev --audit-level=high` : aucune vulnérabilité signalée à cette date.
- Interface de test absente du build de production par compilation conditionnelle.
- Essai du build de production servi localement : scène affichée, lancer, touche et
  ferrage réussis, aucune erreur JavaScript, absence de l’interface de test confirmée.

Voir `docs/VERIFICATION.md` pour les limites. Le navigateur de test était Chromium
Linux avec rendu logiciel, pas un iPhone réel. La fluidité mobile n’est pas certifiée.
Le build émet un avertissement de taille de chunk Babylon (environ 1,57 Mo brut,
373 Ko gzip pour le plus gros chunk). Le build réussit ; optimiser le chargement
à partir des mesures réseau réelles si nécessaire, sans masquer l’avertissement.

## 6. Infrastructure sur le PC et Vercel — session locale du 30/09

Installation dans `C:\Users\alexy\Desktop\JEUPECHE\au-fil-de-leau` réalisée.
Node 24.15.0, npm 11.12.1, Git 2.54.0 ; Vercel CLI 62.0.0 installée.
Authentification officielle réussie : `portgas-d-w`, équipe Hobby `portgas-d-ws-projects`.
Aucun achat ni abonnement supplémentaire.

Cible autorisée : `fishdex-landing`, ID `prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x`.
Dépôt existant `https://github.com/portgas-d-w/fishdex-landing`, production `main`.
Domaines conservés : `www.fishdex.fr`, `fishdex.fr` (redirection www),
`fishdex-landing.vercel.app`. Les URL vercel.app restent protégées.
Configuration réellement réglée : Vite, racine `.`, Node 24.x, installation
`npm ci`, build `npm run build`, sortie `dist`, aucune variable applicative.

Le dossier extrait n’avait pas de Git. L’historique existant est maintenant attaché
sans remplacer les sources du jeu. Ancien main : `00613d1e72fba5291e50c568cad6f3e976a57bb4`.
Tag publié : `archive/fishdex-before-au-fil-de-leau-2026-09-30`.
Bundle complet vérifié : `.migration/fishdex-before-2026-09-30.bundle` (privé, ignoré).
Ancien déploiement conservé : `dpl_DhwVxfAjFKwy1TsbCddjPoG1iiTk`.
Paramètres précédents : `.vercel/project-before-migration.json` (privé).
Ne pas committer `.vercel`, `.env.local`, `.migration` ou `assets-source`.

Préproduction CLI READY : https://fishdex-landing-3nj1ud5e4-portgas-d-ws-projects.vercel.app
(`dpl_2uxax1Q97qz5s1uhMvsfxgtQDSsK`). Étape initiale conservée pour historique ;
la version finale et la production sont indiquées ci-dessous.

Corrections : arrêt du moulinet sur `pagehide`, état visuel « reeling » nettoyé
à l’ouverture des modales, rendu de l’étang suspendu pendant les modales et la pause.
Aucun changement de sauvegarde. E2E isolés sur 5174, 1 worker, mobile 390 × 844.
L’aperçu attend les matériaux WebGL et rend une première image avant de signaler
`data-loaded=true` ; l’ancienne version signalait seulement le fichier chargé.
Nouvelle suite `npm run test:smoke` pour build/URL distante, sans `__fishingQA`.

Résultats Windows : `npm ci` (0 vulnérabilité), `npm run check` (TypeScript,
9 tests et build), Chromium Playwright installé, E2E 6/6 (16,9 s), smoke local
4/4 (51,9 s). Smoke en temps réel : appuis tactiles Chromium, relâchement hors
bouton, capture/GLB, sauvegarde/rechargement, export/import. Cinq GLB vérifiés,
aucun au démarrage, un seul à la prise, archive originale non exposée.
Captures bureau/mobile inspectées. Premiers E2E ralentis par concurrence logicielle ;
un essai a réutilisé le serveur sans QA. Corrigé par isolation, sans retries automatiques.
Chunk Babylon ~1,57 Mo brut / 373 Ko gzip. FPS/chauffe/Safari réels non mesurés.
Après correction du premier rendu : check réussi et E2E 6/6 (24,4 s).
Le scénario E2E accéléré fige désormais l’auto-simulation pendant ses screenshots,
car un rendu logiciel lent pouvait faire décrocher le poisson pendant une capture.
Ne pas exécuter E2E et smoke simultanément (GPU et artefacts partagés).
Code final committé/poussé : `ffe65508436c882e7e056ef8b893d82214217c11`.
Préproduction Git `dpl_HvX3f8fhR1ozxzw6jugttRjfDjME`,
https://fishdex-landing-i6hgrro7f-portgas-d-ws-projects.vercel.app : READY,
smoke 4/4 (56,2 s), poissons visibles sur captures inspectées. Smoke local final
4/4 (48,2 s). Le push sur `main` suit cette validation ; branche locale actuelle `main`.

**Clôture de session : jeu publié et vérifié sur https://www.fishdex.fr.**
Production Git READY `dpl_97wFheK6unbYaN84pT9of1oP7XUG`,
https://fishdex-landing-4pju52c45-portgas-d-ws-projects.vercel.app, build 19 s.
Smoke public sans token : **4/4, 52,2 s**, souris + vrai appui tactile Chromium,
capture et poisson visible, carnet après reload, export/import, cinq GLB intacts,
aucun modèle au démarrage, interface QA absente et aucune erreur JS/console.
Capture mobile de production inspectée. HTTP 200 et redirection `fishdex.fr` → www
confirmés. Requête de logs Vercel erreurs / 15 min : aucun événement (site statique,
ce n’est pas une mesure de toutes les consoles utilisateurs).
Les futurs pushes main publient le jeu : prouvé par le déploiement Git de `ffe6550`.
Un dernier commit de docs pousse ce relais ; les fichiers applicatifs restent identiques.
Serveur local utilisateur lancé sur 5173 ; build local servi sur 4173.
Git distant et sauvegarde FishDex conservés, ZIP original jamais ajouté/déployé.

Prochaine tâche pour Claude dimanche : recueillir le test Safari/iPhone réel et les
sensations du propriétaire (lisibilité/tension/durée), mesurer fluidité/chauffe puis
suivre P1. Aucun test appareil réel, aucune nouvelle animation, aucun nouveau comportement
par espèce livrés pendant cette session. Ne pas annoncer ces points comme validés.

## 7. Prochaine tâche pour Codex sur le PC

1. Lire la clôture, `docs/VERCEL.md` et vérifier Git.
2. `npm run check`, `npm run test:e2e` ; serveur utilisateur sur 5173.
3. Faire tester le téléphone réel ; relever fluidité/chauffe et retour sur le combat.
4. Corriger les problèmes constatés avant nouveaux comportements et effets.

## 8. Reprise conseillée pour Claude

Lire l’état mis à jour par Codex. Ne pas supposer qu’il correspond encore exactement
à cette livraison initiale. Lancer les vérifications puis suivre `docs/BACKLOG.md`.
Après validation du socle, priorité aux sensations de combat et aux comportements
des poissons, puis aux petits objectifs de collection. Ne pas multiplier les lieux,
monnaies, services ou espèces avant d’avoir rendu cette boucle satisfaisante.

## 9. Journal de session à maintenir

### Mission autonome en cours — 1 octobre 2026, Codex

Étape P1/P2 : check **16/16 + TypeScript + build**, E2E **10/10 (26,2 s)**. Migration v1/v2, journal individuel, unicité des récompenses, achats et équipement, cinq favoris, poids cohérent, images IndexedDB séparées. Catalogue local importé : 96 fiches, 59 groupes biologiques déclarés, 88 illustrations/557 Ko ; cinq espèces jouables. FishDex inchangé. Photos limitées à 128 Blob, régénération depuis un souvenir après transfert JSON. Captures mobile/bureau inspectées. Détails dans `docs/DECISIONS_JEU.md` et `docs/ASSETS_POISSONS.md`. Prochaine étape : aquarium puis méthodes et extension/animations.

Mission explicite `docs/MISSION_CODEX_AUTONOME_AU_FIL_DE_LEAU.md` : P0 à P4 autorisés, y compris économie purement virtuelle et aquarium. Elle remplace l’attente de retour téléphone pour progresser ; les mesures appareil restent à faire. Branche `codex/mission-autonome-2026-10-01`, FishDex en lecture seule. `npm ci` : réussi, 0 vulnérabilité. Check initial : 9/9 + build. P0 : lancer libre normalisé, habitats par coordonnées, orientation de canne, comportement spatial par espèce, fil épais attaché à la canne et montage immergé, capture proche sous contrôle. Check P0 : 12 tests à vérifier. Premier E2E perturbé par une modification pendant son exécution (rechargement Vite) : 5/6, rerun stable requis. Voir `docs/MISSION_AUTONOME.md` pour la suite.

| Date | Agent | Réalisé | Prochaine action |
| --- | --- | --- | --- |
| 2026-09-30 | Codex | Projet 0.1, prototype complet, cinq conversions Blender, tests et docs de relais | Installation sur PC, choix cible Vercel, essai sur téléphone |
| 2026-09-30 | Codex local Windows | Installation ; pauses/commandes/premier rendu corrigés ; check 9 tests, E2E 6/6, smoke local 4/4, preview Git 4/4, production Git 4/4 sur www.fishdex.fr ; FishDex conservé | Essai téléphone réel et retour combat ; mesurer fluidité/chauffe avant P1 |

Pour chaque nouvelle session : ajouter les changements, les résultats réels de test,
les éventuels bugs, la décision prise et la prochaine tâche. Mettre à jour le résumé
ci-dessus si le périmètre ou l’architecture évolue.
