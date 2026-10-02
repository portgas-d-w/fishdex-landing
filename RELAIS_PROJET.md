# RELAIS PROJET — Codex ↔ Claude Code

**Dernière mise à jour : 2 octobre 2026. Agent : Codex. Version 0.7.0 Basalte & Turquoise publiée et vérifiée sur www.fishdex.fr.**

## Direction artistique Basalte & Turquoise — 2 octobre 2026, Codex, 0.7.0 publiée et vérifiée

Guide du propriétaire lu et archivé dans docs/GUIDE_DA_BASALTE_TURQUOISE_CODEX_CLAUDE.md. Audit : Babylon.js core/loaders 9.28.0, Node 24.15.0, Vite 8.3.1, npm ci sans vulnérabilité. Base d511384, branche codex/basalte-turquoise-2026-10-02. Modification préexistante DEMARRER_AVEC_CODEX.md préservée et exclue des commits de cette mission.

Terminé et publié : lumière naturelle neutre, ciel et profondeur, eau olive/profonde avec deux échelles animées et reflets simplifiés en éco, rivages irréguliers et arbres/pierres ancrés sur leur terrain, bouquets de roseaux (quatre animés), décor statique regroupé, grain de sol et bois calculé une fois. Caméra, coordonnées, événements et pools d’effets existants conservés. Palette Basalte & Turquoise et police système sur commandes, panneaux principaux et secondaires, fiches/capture et aquarium ; en-têtes opaques, portraits naturels, progression compacte, états sélectionnés avec libellé et aria-pressed, champs 16 px et réduction d’animations. Photos futures sur fond neutre ; anciennes photos IndexedDB intactes.

Gameplay et données dans src/game inchangés ; sauvegarde v4 et même clé, aucune migration nouvelle. Aucun modèle ou portrait remplacé, nouvelle dépendance, pack, génération ou production Blender. Géométries actuelles stylisées conservées. Éco grand écran limité à 1024 px de largeur interne (1280 auparavant) après régression mesurée à résolution constante ; DOM natif et mobile 390×844 préservés. Qualité haute garde les ombres 512² et plafond DPR 1,5.

Contrôles réels : référence avant bureau/mobile 2/2, première passe monde 1/1, compléments graphiques/récupération 6/6. Débordement du carnet à 320 px corrigé ; sept panneaux à 320/390/430/paysage, cibles 44 px, contraste principal ≥4,5 et animations réduites vérifiés. Check final 47 tests + TypeScript/build ; navigateur complet 51 réussis / 3 exclusions prévues (4,3 min). Smoke build sans QA 8/8 (1,6 min), preview protégée 8/8 (1,7 min), public sans token 8/8 (1,7 min) : vraies prises souris/tactile, photos/transferts, quinze GLB, achats/favoris, atelier/presets/stock et catalogue futur.

Mesures et captures avant/après : docs/BASALTE_TURQUOISE.md et docs/apercus/basalte-turquoise. Mobile étang 23,2 → 23,3 FPS, sommets 70 320 → 55 294, zéro frame de pêche derrière le bassin. Bureau final 21,3 → 23,1 FPS avec budget de pixels réduit : aucun gain garanti à résolution constante. Chromium ANGLE SwiftShader Windows uniquement ; pas d’iPhone réel, de chauffe/autonomie ou de mesure GPU. Les captures historiques des versions précédentes sont préservées.

Fichiers modifiés : src/render/world.ts, fish-preview.ts, aquarium.ts ; src/ui/theme.css (tokens), structure.css/structure.ts/tackle.ts ; src/style.css/main.ts ; index.html/public/favicon.svg et package*.json (0.7.0). Test reproductible tests/browser/art-direction.spec.ts ; guide, rapport et captures/JSON, décisions et backlog.

Vercel existant confirmé : portgas-d-ws-projects/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, portgas-d-w/fishdex-landing, main, Vite/dist/Node24. Application af889954e1f77234e93ddb9eed085d87ee7f955a. Preview READY dpl_7M3iQRWsYSwdXtNz2QnGdKMFWmNh, build 27 s, https://fishdex-landing-dieyn27kj-portgas-d-ws-projects.vercel.app ; production READY dpl_DhSAgCTqwhWHNKckfJTmDifVL7w7, build 33 s, https://fishdex-landing-3wfnaw27u-portgas-d-ws-projects.vercel.app. Domaine fishdex.fr → www.fishdex.fr HTTP 200 ; 45 JS/CSS identiques au dist, manifeste identique en JSON. Principal index-DTjLNFbt.js SHA256 2e7f7418c56e28834ce0760c9f62d473a3976f9778d486de95ae3479150714a5. Scan erreurs 15 min sans événement ; zéro drain, pas de télémétrie appareil. Protection/domaines inchangés, token local ignoré/non publié, OIDC limité à l’origine de preview. Clôture documentaire seule ensuite, avec dernier déploiement et fichiers à contrôler avant fin.

Retour conservé : tag publié archive/au-fil-de-leau-before-basalte-2026-10-02, base d511384 ; précédente production dpl_9SusEzAY2H3PNR4Jy2ft4jdjhuW1 conservée. Même sauvegarde v4, pas de migration inverse nécessaire pour 0.6. Voir docs/VERCEL.md. Serveur de preview temporaire 4175 arrêté ; autres serveurs préservés.

Prochaine tâche : Safari/iPhone 14 Pro réel et téléphone modeste, échauffement 5–10 minutes, portrait/paysage, reprise, menus/clavier, réseau et confort. Problèmes restants : assets stylisés, performances GPU mobile non mesurées, chunk Babylon encore ~1,81 Mo / 442 Ko gzip. Aucun 30 FPS, chauffe ou autonomie garanti.


## Module canne / montages — 2 octobre 2026, Codex, 0.6.0 publiée et vérifiée

Branche codex/canne-montages-2026-10-02, base 8b646ad. Consigne jointe et docs/Dossier_Au_Fil_De_Leau lus ; validation du dossier PASS, 6 151 contrôles. Modifications utilisateur de DEMARRER_AVEC_CODEX.md préservées. Référence FishDex lue par git show (checkout de contenu partiellement supprimé) : six empreintes identiques à l’import, aucune modification de la référence.

Terminé et publié : Ma canne / Mon sac / Ensembles, montage schématique contextuel, choix des possessions, réglages de profondeur/plombée, catalogues complets différés et variantes groupées, boutique/stock communs, réservations atomiques, résolution de casse localisée et idempotente, kit illimité sans protection des ajouts payants, trois méthodes raccordées, quinze profils et rencontres habitat/profondeur/régime, moulinage uniquement par appui. Version 4 migre v1/v2/v3 et préserve achats, prises, photos, XP, écus et cinq favoris. Reload d’une ligne = retour conservateur sans prise, esche utilisée débitée une fois.

Partiel : atelier SVG et forces normalisées de jeu, frein automatique ; sortie d’un coulissant, branches et clip traités par le graphe, seulement les fixations activées de base sont proposées. Futur : 274 exemples de SKU sans paramètres ni achat, autres méthodes, autres GLB/habitats, observation et identités douteuses, rig squelettique, positions libres de plombs et usure. Les prix et notes sont des hypothèses d’équilibrage. Aucun test Safari/iPhone physique.

Vérifications réelles : Node 24.15.0, npm ci (0 vulnérabilité), npm run check réussi (47 tests, TypeScript et build). Suite navigateur complète : 48 réussis / 2 ignorés (4,2 min ; multitouch bureau et modèles mobile exclus par leur configuration). Après correction visuelle des cases du sac : atelier 6/6 (42,6 s), nouveau check réussi. Smoke local du build sans QA : 8/8 (1,8 min), capture réelle, photo/transfert, quinze GLB, achats/favoris et atelier/catalogue/presets. Mobile 390×844 et bureau inspectés. Les premières passes partielles ont révélé sélecteurs ambigus et attentes de combat anciennes, corrigés ; elles ne constituent pas le résultat global. Comparaison quinze espèces : suivi 13–41 s contre canne fixe 15–55 s, matériel 1,32, graine/gabarit contrôlés ; toutes les espèces ramenées dans les deux stratégies, orientation accélère et améliore le contact.

Liaison Vercel vérifiée : portgas-d-w / portgas-d-ws-projects / fishdex-landing, ID prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, GitHub portgas-d-w/fishdex-landing, production main, Vite/dist/Node24. CLI 62.0.0 déjà disponible. Domaines fishdex.fr → www.fishdex.fr conservés ; production précédente dpl_668C9o4wZNaKFtskyRQ9qR21saFP. Application c4731a366df7e437db9e95ae412c8a2c90117c4d. Préproduction READY dpl_34hLQuHZBhbpfjFxELwV3WWzMdTR, https://fishdex-landing-lb8daqmwh-portgas-d-ws-projects.vercel.app, build 27 s ; smoke protégé 8/8 (1,8 min). env run incompatible avec les arguments Windows : accès obtenu par env pull puis node --env-file, token non affiché/committé et header limité à cette origine. Tag de retour publié archive/au-fil-de-leau-before-montages-2026-10-02. Fusion fast-forward et push main après ces contrôles. Production READY dpl_2a3os5G1xDbnUkhiYWpkjNejrfv8, https://fishdex-landing-50au3tgze-portgas-d-ws-projects.vercel.app, build 24 s. Smoke public www.fishdex.fr sans token : 8/8 (1,8 min). JS/CSS initiaux identiques au dist ; manifeste JSON identique, fins de ligne différentes. Bundle principal SHA256 f78e9904e5ddfdac50edbb513fc3ad6a1c6dc00e50fad43ac0d902a19fd7ee7d. Scan erreurs 15 min sans événement ; aucun drain, pas de télémétrie des appareils. Serveur de preview temporaire arrêté ; aucun changement aux autres projets. Le commit de clôture est documentaire, sans changement applicatif.

Détails : docs/MONTAGES_IMPLEMENTATION.md et docs/CORRESPONDANCES_MONTAGES.md. Prochaine tâche : essai propriétaire sur Safari/iPhone réel (portrait/paysage, reprise, sensation du combat), puis ajuster profondeur, prix des lots et profils selon ce retour. Problèmes restants : équilibre non validé sur appareil ; bundle Babylon encore lourd. Futurs contenus restent non activés. En cas de retour v3, exporter auparavant la sauvegarde v4 et la préserver pour reprise ; l’ancien lecteur ne lit pas v4.

## Clôture structure complète 0.5.0 — 1 octobre 2026

Mission `MISSION_STRUCTURE_COMPLETE_DU_JEU.md` exécutée sur la branche `codex/structure-complete`, fusionnée fast-forward dans `main` et publiée sur `portgas-d-ws-projects/fishdex-landing`. Commit applicatif `be65152f623de8f6d109c957ff0c128697360bfb`; tag de reprise `archive/au-fil-de-leau-before-structure-2026-10-01` conservé. FishDex de référence contrôlé en lecture seule, six empreintes inchangées.

Structure ajoutée : FishDex principal avec numéros/fiches/variantes/maîtrise, carnet filtrable, catalogues de méthodes/familles/slots, préparation et compatibilités, boutique avec confirmation, lieux et techniques futures, progression/badges/objectifs, aquarium à cinq emplacements et remplacement, sauvegarde v3 migrée depuis v1/v2 avec récupération d'original. Le combat garde la jauge compacte, l'appui maintenu par défaut et le geste circulaire sélectionnable ; les commandes tactiles restent isolées des panneaux défilants. Eau, lumière, matières, ponton, végétation et bassin ont été repris avec qualité haute limitée et mode eco mobile. Captures avant/après dans `docs/apercus/structure/` et détails dans `docs/STRUCTURE_COMPLETE.md`, `docs/EXTENSION_CONTENU.md`, `docs/QUALITE_VISUELLE.md`.

Validation réelle : `npm ci` sans vulnérabilité ; `npm run check` **35 tests + TypeScript/build réussis** ; E2E complet **38 réussis / 2 ignorés** ; rendu/graphismes/récupération **8 réussis** ; smoke local **6/6**, preview protégée **6/6 (2,2 min)**, production publique **6/6 (2,1 min)**. Vérification hébergée : JavaScript `/assets/index-CNngu06Z.js`, SHA256 `62a4bbae2be4bd6325f982c1885e114b3daa7a36385fd114be9f60c493917886`, quinze modèles et manifeste identiques au `dist` contrôlé. Production fonctionnelle READY : `https://fishdex-landing-c67y0vcte-portgas-d-ws-projects.vercel.app`, déploiement `dpl_3xuUNgMLk5D8FV1M6QqXpyDkD1qR`; après la clôture documentaire, le dernier déploiement de `main` est READY `dpl_A4bYbGcRyVfTD7B5AyzXAvHX3App` et conserve les domaines `www.fishdex.fr`, `fishdex.fr` et les alias.

Problème restant : mesures Safari/iPhone réel, chauffe, autonomie et ressenti humain non réalisés ; les FPS documentés sont Chromium/SwiftShader Windows. Prochaine tâche : essai appareil réel puis réglages mesurés. Serveur temporaire 4175 à arrêter après clôture ; `.env.local` reste ignoré et le token OIDC n'est pas publié.

## Mission structure complète — en cours

1 octobre 2026, Codex. Document Downloads/MISSION_STRUCTURE_COMPLETE_DU_JEU.md lu intégralement, remplace les anciennes consignes séparées. Audit dans docs/STRUCTURE_COMPLETE.md. Git propre au départ 5fd5748 ; branche codex/structure-complete et tag de reprise avant structure. Systèmes existants conservés, FishDex référence en lecture seule. Priorités : données/fiches communes, FishDex principal et carnet filtrable, matériel/boutique/lieux/objectifs, aquarium, puis rendu et vérifications complètes. Baseline avant rendu enregistrée dans docs/apercus/structure (étang et tous les panneaux, mobile/bureau). Mesures eco SwiftShader, échantillons 3 s : étang 23,0/22,5 FPS, aquarium 5,3/23,2 FPS, zéro frame de pêche derrière le bassin. Catalogues communs et interfaces/fiches intégrés ; migration v3 conserve v1/v2 et ajoute préparation et choix appui/cercle. Check actuel 35 tests + TypeScript/build réussis. Première passe navigateur structure/carnet/tactile/aquarium : 16/16 (1,3 min), fiches, variantes/records, retour/filtres, annulation/confirmation achat, kit/méthodes futures/lieux, cercle et deux doigts, menus et erreurs modèle. Rendu première passe inspecté ; étang 22,6/20,9 FPS, aquarium 22,5/23,5, toujours zéro frame de pêche derrière aquarium. Illustrations de matériel locales importées en lecture seule (empreintes docs/ILLUSTRATIONS_MATERIEL.json), rides/éclaboussures à l’arrivée ajoutées. Suite complète : 38 réussis / 2 ignorés (4,2 min). Remplacement de favori testé, fonds/illustrations/photo et états futurs intégrés. Compléments réussis : cadrage/performance 4/4 (44,6 s), graphiques haute qualité/retour eco et récupération d’original 4/4 (14,4 s), filtres finaux 6/6 (24,1 s), aquarium après correction du sable trop clair/fond réellement personnalisable 4/4 (38,2 s). Dernier check 35 tests + TypeScript/build réussi. Ombres statiques haute qualité seulement, 512², défaut eco sans ombres ; petites éclaboussures à l’arrivée et près de la surface réelle. Filtres premières découvertes basés sur récompenses enregistrées, pas une nouvelle prise d’espèce déjà connue dans l’ancien carnet. Audit visuel et premier smoke build final sans QA 6/6 (2,3 min), captures réelles/photo/transfert, quinze GLB et achats/bassin. Dernière correction visuelle : sable trop clair corrigé, fond du bassin personnalisable, bandes fines de l’eau remplacées par irrégularités locales ; contrôles graphiques/performance et nouveau smoke à effectuer avant publication. Docs structure/extensions/décisions/ressources écrites. Publication autorisée sur le projet existant après preview validée ; aucune fonction annoncée terminée avant ses tests.

## Correction 0.4.1 — appui maintenu, publiée et vérifiée

1 octobre 2026, Codex. Dernière instruction utilisateur : remplacer la rotation du doigt par un appui pour mouliner. Appui maintenu dès le contact, récupération constante 1,6 tour/s, arrêt immédiat au relâchement/annulation/perte de capture/focus/pause et changement de phase. Canne au second doigt et molette PC conservées. Même bouton au leurre pour conserver un geste cohérent. Aide et libellés actualisés. Node 24.15.0, npm ci sans vulnérabilité ; npm run check : 31 tests + TypeScript/build réussis. E2E ciblés : 19 réussis / 1 ignoré (1,9 min), appui immobile, deux doigts, interruptions, menus/saisie et physique. Smoke local du build sans QA : 2/2 (1,7 min), captures réelles bureau/mobile et sauvegarde/transfert. Portrait 390×844, paysage et bureau inspectés, captures hold-* dans docs/apercus. Application 882035b86373c4f419f00a18b6fbdc217f80910e, preview READY https://fishdex-landing-n7hk9lqag-portgas-d-ws-projects.vercel.app (dpl_2uQcvDbThTWFPdFNcHG9oSktXkfE), smoke protégé ciblé 2/2 (2,0 min), vraies captures bureau/mobile, modèle, photo et sauvegarde/transfert. Retour 0.4 publié : archive/au-fil-de-leau-before-hold-2026-10-01, base d6d9f907. Préproduction validée ; main a815a10f755e611300add63a897237168c3237cb, production READY https://fishdex-landing-80jc171um-portgas-d-ws-projects.vercel.app (dpl_8vfANFSZkN3qvZbt4SjN7e2XQFnz). Domaine public : bundle index-C3HMXfaE.js SHA256 1829019d1e0f6d2aeca81d545f837a80bacf9f065a69fa21c5b78b43384b187c et manifeste quinze modèles identiques au dist vérifié ; smoke public ciblé sur www.fishdex.fr **2/2 (2,1 min)**, sans QA ni token : captures bureau/mobile, modèle différé, photo et sauvegarde/reload/export/import. Aucun changement applicatif depuis la preview. Clôture documentaire seule ensuite, dernier déploiement/fichiers contrôlés avant fin. Serveur temporaire 4175 arrêté, serveurs utilisateur conservés. Cette décision remplace les passages historiques indiquant qu’un appui immobile ne récupère pas de fil.

Problème restant : Safari/iPhone réel et ressenti humain non mesurés ; aucun blocage connu dans les scénarios vérifiés. Prochaine tâche : essai sur appareil, confort du maintien avec canne au second doigt, durée des combats et chauffe. Reprise : npm run dev ; npm run check puis suites pertinentes successivement. Git main vérifié propre à la clôture ; FishDex de référence inchangé. Les paragraphes 0.4 et antérieurs ci-dessous décrivent les anciennes commandes ; la décision par appui ci-dessus les remplace.

## Livraison 0.4 — gestes et combat publiés

1 octobre 2026, Codex. Travail parti de main a6ef66b, branche codex/gestes-combat puis fusion fast-forward vers main ; Git propre à la clôture. FishDex de référence inchangé. Babylon/TypeScript/Vite, sauvegarde v2, quinze modèles et jauge compacte conservés.

Protections tactiles limitées au canvas et aux commandes : user-select/WebKit/callout, contextmenu/selectstart et glissement natif des images. Aucun blocage de gestes sur app/body ; carnet et boutique défilent naturellement, champs éditables et sélectionnables. Captures indépendantes des deux doigts ; relâchement, annulation, perte de capture, blur/pagehide/pause et rotation nettoient les gestes et tours en attente.

Mission jointe exécutée : fil disponible, tension amortie, frein automatique avec rotation/son du moulinet, fatigue sous pression modérée, reprise du mou et force relative au matériel. Angles progressifs et capture proche sous contrôle, sans délai de victoire. Lancer exclusivement depuis le tiers bas, préparation continue, puissance surtout liée à la vitesse récente, relâchement central/haut et annulation/restauration ; trajectoire et arrivée cohérentes. Détails : docs/GESTES_COMBAT.md et docs/ARCHITECTURE.md.

Validation réelle : Node 24.15.0 ; npm ci sans vulnérabilité ; npm run check final **30 tests + TypeScript/build réussis**. E2E initial 23 réussis / 2 ignorés / 3 échecs corrigés ; passe ciblée finale 22 réussis / 1 ignoré, puis physique 4/4 après adaptation du test au cercle mobile. Les **23 scénarios ciblés distincts sont validés**, un ignoré selon viewport. Appuis longs, deux doigts CDP, glissements, interruptions, défilement natif et saisie/selection ; frein sans moulinage réellement animé, surcharge, reprise du mou et lancers doux/rapides. Portrait 390×844, bureau 1440×900 et paysage inspectés. Comparaison des quinze rencontres, matériel 1,32 : le suivi réduit les durées ; une canne fixe peut réussir avec une récupération bien dosée. Ancien critère binaire 0/15 remplacé. Rapport et captures physics-* dans docs/apercus.

Application **3a2d06b19b27dec74cab8728e6952dc6cdf0ae42** ; smoke du build sans QA **6/6 (2,3 min)**. Preview READY https://fishdex-landing-561eij874-portgas-d-ws-projects.vercel.app, **dpl_7BHB69jgcKBK7x26wiW9DcjyQ4MC**, smoke protégé **6/6 (2,9 min)**. Main **2dd0c5ab242088da316af70dcf5bd133d9e71099**, production READY https://fishdex-landing-m21grnm16-portgas-d-ws-projects.vercel.app, **dpl_9y5pAom2WLtKxdZhEP3Xxq4qDKco**, smoke public sur www.fishdex.fr **6/6 (2,7 min)**. Vraies captures souris/tactile, quinze GLB, sauvegarde/reload/export/import, photos, achats et bassin. QA absente du build ; token limité à la preview et jamais publié. Domaines/protection conservés ; fishdex.fr redirige vers www (HTTP 307).

JavaScript **index-DkrQEhJk.js**, SHA256 **111776c16a88eed3f2fec3c331b6e9d7c0a184c4cccb7a5c27346d82e065163c**, identique octet par octet au dist testé ; manifeste quinze modèles identique. Clôture documentaire seulement ensuite, dernier déploiement/fichiers contrôlés avant fin. Retour 0.3.1 : tag publié **archive/au-fil-de-leau-before-touch-combat-2026-10-01**, base a6ef66b ; déploiement READY https://fishdex-landing-52juimmn5-portgas-d-ws-projects.vercel.app, dpl_EjnkbkyJA9GibQ7H7ZHatzyRjr5x. Anciens retours conservés, aucun force-push.

Limite restante : Chromium/SwiftShader Windows, aucun Safari/iPhone physique ni mesure de chauffe. Prochaine tâche : essai propriétaire sur Safari/iPhone réel, confort des deux doigts, projection douce/rapide, équilibre et durée des combats, puis réglages/optimisations mesurés. Aucun assistant programmé pour poursuivre après la session. Serveur temporaire 4175 arrêté après tests ; serveurs utilisateur conservés. Reprise : npm run dev ; npm run check, E2E puis smoke successivement.

## Précision utilisateur — jauge compacte 0.3.1

Dernier message : ajouter une jauge comme sur l’image de référence. Cette instruction remplace le retrait de jauge en 0.3. Barre Tension du fil verte/jaune/orange et repère mobile entre les deux commandes, uniquement en combat ; même valeur que la courbure de canne, aucun descriptif du poisson ni interception des gestes. Règles, commandes et sauvegarde v2 inchangées.

Validation 0.3.1 : npm run check **23 tests + TypeScript + build réussis** ; **9 E2E ciblés réussis / 1 ignoré (1,2 min)**, jauge égale à la simulation, masquée hors combat, extrêmes de canne, annulations et deux doigts ; rendu portrait/bureau/paysage inspecté. Smoke final local sans QA **6/6 (1,5 min)**. Aucun test iPhone physique. Captures gauge-* dans docs/apercus, détails dans docs/INTERFACE_COMBAT.md.

Application `e2af6e7688901cf59271b1ed3dad3fafb90132ef`, preview READY https://fishdex-landing-f8xmkxn5u-portgas-d-ws-projects.vercel.app, dpl_Dm6dVWPsknzwA4qF2JPJYZzTzGmy ; **smoke protégé 6/6 (2,0 min)**. Fusion fast-forward main `6431fb23742d0409f4ad5f31ecf603489e375993`, production READY https://fishdex-landing-n1kgqi4fm-portgas-d-ws-projects.vercel.app, dpl_5pZsvDXk4HwvcFjsWibzvz55M6iG ; **smoke public 6/6 (1,7 min)** sur www.fishdex.fr. Jauge visible, capture souris et tactile réel Chromium, portraits, progression, achats/bassin, sauvegarde/reload/export/import et quinze GLB conservés. Bundle index-D2VdAQ0C.js SHA256 **afa1e0b368ddd2d564cb45af53cfc7e4539e96d6887d648b30936674b1263a3f**, identique au dist vérifié ; manifeste identique. Clôture documentaire seule ensuite, dernier statut/fichiers contrôlés avant fin.

Retour 0.3 publié : tag archive/au-fil-de-leau-before-gauge-2026-10-01, base bd335a6 ; ancien déploiement READY https://fishdex-landing-krqp4rbrw-portgas-d-ws-projects.vercel.app. Projet, domaines, protection et précédents retours conservés. Serveur temporaire 4175 arrêté après tests ; serveurs utilisateur conservés. Prochaine tâche : essai Safari/iPhone réel pour confort des commandes, lisibilité, durée et fluidité/chauffe ; aucune autre fonction ajoutée en attendant. Les informations 0.3 ci-dessous restent l’historique de la correction immersive.

## Livraison 0.3 — correction immersive terminée

Demande et précision par image utilisateur appliquées. Scène entière, Menu et Matériel compacts ; carnet/FishDex, aquarium, boutique, progression et réglages dans des écrans avec retour. Menu suspend le combat et bloque les gestes de scène. Lancer exclusivement par glissement, prévisualisation/cible réelle et annulation/refus hors eau/portée ; aucun bouton/poste automatique.

Combat : deux commandes rondes en bas, canne à gauche, moulinet à droite ; ni jauge ni encadré décrivant le poisson. Canne glissée dans les quatre directions (ou scène), second doigt en cercle ; PC glissement + molette simultanés. Appui immobile inopérant. Orientation/hauteur, résistance et départs déterminent récupération, contact, tension et guidage dans src/game/combat.ts/reeling.ts/fishing.ts. Canne et fil affichent le même état ; cadrage adapté au portrait pour garder la pointe visible. Flotteur immergé jusqu’au bord, aucun bouchon fond/leurre. Interruption/pause/pagehide annulent gestes et tours en attente. Retour de fiche adapté à aquarium/carnet.

Sauvegarde v2 et clé inchangées, photos IndexedDB et unicité des récompenses conservées. Conseils brefs de première utilisation par clé séparée. FishDex de référence en lecture seule ; aucun ZIP source, token ou modèle envoyé à un générateur. Babylon/TypeScript/Vite conservés.

Validation réelle : Node 24.15.0, npm ci sans vulnérabilité ; npm run check **23 tests + TypeScript + build réussis**. E2E complet **20 réussis / 2 ignorés selon viewport (4,3 min)** ; après cadrage **11 ciblés réussis / 1 ignoré (1,1 min)**, puis capture paysage sans conseil transitoire contrôlée. Quatre orientations extrêmes avec pointe projetée dans le cadre ; souris, vrais doigts CDP simultanés, cercle/molette, refus/annulations, menus, méthodes, modèles, photos, achats/bassin et rechargement. Smoke du build final sans QA **6/6 (1,2 min)**, captures en temps réel. Avant/après et contrôles dans docs/INTERFACE_COMBAT.md. Comparaison reproductible quinze scénarios, même moulinage et puissance 1,32 : canne fixe **0/15**, suivi **15/15** ; paramètres de simulation, pas mesure du ressenti humain.

Publication : application `9347d750e8f5f0cc1709e5e095e5fe3466fb603d` sur codex/peche-immersive ; preview Git READY https://fishdex-landing-j1s16fb54-portgas-d-ws-projects.vercel.app, dpl_2RG6wgaLULPseUF5PXrXjEZN1v9q, **smoke protégé 6/6 (1,7 min)**. Fusion fast-forward puis main `dae5e9371fee6e1ba3d2c3b89b3ec04d2a52dcf9`, production Git READY https://fishdex-landing-q9hvlj65k-portgas-d-ws-projects.vercel.app, dpl_GSB2NcKv2ApQsswD8WMvgEeVXycs, **smoke public 6/6 (1,5 min)** sur www.fishdex.fr, aucun token. Domaines/protection conservés, HTTP 200 et redirection fishdex.fr vers www confirmés. Bundle index-CX0qA7ip.js SHA256 **104b4e5a1ad703ddfec262791acc566b443fb6acbb52817494c8851d9eb3406e**, identique octet par octet au dist vérifié, manifeste quinze modèles identique. Clôture documentaire seule ensuite ; statut et identité du dernier déploiement contrôlés avant fin de session.

Retour 0.2 : tag publié archive/au-fil-de-leau-before-immersion-2026-10-01, base 8b2ea0f ; déploiement READY dpl_BXmZ3LgpdKPrkZjDs9uegmFfVPGy. Même sauvegarde v2. Ancien FishDex et retour 0.1 conservés dans docs/VERCEL.md ; aucun force-push.

Limite restante : aucun Safari/iPhone physique. Mesures Chromium/SwiftShader Windows, échantillons 3 s : étang 23,2–23,8 FPS ; bassin bureau 6,9 / mobile 22,2 FPS ; zéro frame de pêche derrière le bassin. Aucune garantie de fluidité/chauffe sur téléphone. Prochaine tâche : test propriétaire Safari/iPhone 14 Pro, lisibilité de la canne, confort des deux commandes et durée/plaisir des combats, puis paramètres et optimisations mesurées. Aucun agent programmé pour continuer après cette session. Seul le serveur temporaire 4175 est arrêté ; serveurs utilisateur préexistants conservés. Reprise : npm run dev, npm run check ; E2E puis smoke successivement.

## Historique 0.2 — mission autonome du 1 octobre

La mission explicite P0–P4 autorise économie virtuelle, aquarium, extension et publication après vérification. Les sections 0.1 ci-dessous sont l’historique initial, pas l’état fonctionnel actuel. Branche `codex/mission-autonome-2026-10-01` ; FishDex de référence conservé en lecture seule.

Livré : lancer libre, orientation et moulinage simultanés, combat spatial canne/fil et capture sous contrôle ; quinze espèces GLB ; encyclopédie 96 fiches/59 groupes déclarés ; journal individuel, poids, robes/Mirage, photos IndexedDB, migration v1/v2 ; XP, sept badges, écus et boutique effective ; aquarium de cinq individus avec décor persistant ; trois méthodes effectives (flotteur, leurre animé/récupéré, fond sans bouchon). Nage procédurale corps/queue, débattement intermittent et tapis ≥60 cm provisoires. Pas de respiration, suspension au fil ni arrivée à l’épuisette.

Validation P4 : `npm run check` **19 tests + TypeScript + build réussis**, E2E **20 réussis/2 ignorés selon viewport (1 min 30 s)** ; smoke du build sans QA **6/6 (1 min)**, vraie capture temps réel souris/tactile, export/import, achats/équipement, aquarium/portrait et quinze GLB. Captures inspectées et conservées dans `docs/apercus/`. Inventaire Blender 5.1.2 : 50 FBX sans rig/animation ; quinze GLB 1 731 232 octets, aucun chargement initial. Chromium/SwiftShader Windows, qualité eco : étang 22,1–23,5 FPS, aquarium 22,5–23,3 FPS, aucune frame de pêche derrière le bassin. Aucun test iPhone physique.

Publication terminée : P4 `3319536`, preview Git `b77a4ee` après deux uploads CLI échoués avant création. Preview READY https://fishdex-landing-9jbp3yk7v-portgas-d-ws-projects.vercel.app, **smoke protégé 6/6 (1,2 min)**. Fusion fast-forward main `affa933`, production Git READY https://fishdex-landing-3xmhe25e1-portgas-d-ws-projects.vercel.app, **smoke public 6/6 (1,1 min)** sur https://www.fishdex.fr, vraie prise et quinze GLB, achats, bassin, souvenirs et sauvegardes. HTTP 200 et redirection fishdex.fr vers www confirmés, captures inspectées. Application identique à la preview ; seuls les documents changent ensuite. Token local jamais affiché/committé, traces de preview désactivées. Retour 0.1 conservé par tag publié et déploiement exact dans docs/VERCEL.md. Domaines/protection et ancienne archive FishDex conservés.

Prochaine tâche pour Claude/Codex : faire tester le propriétaire sur Safari/iPhone 14 Pro réel, relever lisibilité/durée des combats et FPS/chauffe/chargement, puis ajuster les paramètres avant d’ajouter des effets. Respiration anatomique, présentation suspendue et épuisette restent à développer. Aucun agent n’est programmé pour continuer après cette session. Lancement local : npm run dev ; npm run check puis npm run test:e2e pour reprise. Seul le serveur de preview temporaire 4175 de cette mission est arrêté ; les serveurs utilisateur préexistants ne sont pas arrêtés.

Sources de vérité détaillées : `docs/MISSION_AUTONOME.md`, `docs/ASSETS_POISSONS.md`, `docs/DECISIONS_JEU.md`, `docs/BACKLOG.md`. Journal/import finis (10 000 captures/5 Mo), photos limitées à 128 ; prévoir archivage de très longue durée avant cette limite.

## Historique de la version 0.1

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

Étape P3 : check **17/17 + build**, E2E **14/14 (49,5 s)** après correction du premier import Vite et attente de l’événement close. Aquarium à cinq spécimens, apparence et tailles persistées, ajout/retrait/remplacement, fiches, sol/fond/lumière et plantes/rochers achetés. Déformation procédurale continue du corps/queue, sans squelette ni respiration. Navigation répétée : moteur aquarium libéré, compteur retombe à un moteur sans aperçu, pêche suspendue. Tests de modèle manquant conservent la progression. Captures aquarium mobile et bureau inspectées. P4 commence : conversion locale de dix modèles supplémentaires avec Blender 5.1.2, métadonnées zéro armature/zéro animation pour les quinze sources converties.

Étape P1/P2 : check **16/16 + TypeScript + build**, E2E **10/10 (26,2 s)**. Migration v1/v2, journal individuel, unicité des récompenses, achats et équipement, cinq favoris, poids cohérent, images IndexedDB séparées. Catalogue local importé : 96 fiches, 59 groupes biologiques déclarés, 88 illustrations/557 Ko ; cinq espèces jouables. FishDex inchangé. Photos limitées à 128 Blob, régénération depuis un souvenir après transfert JSON. Captures mobile/bureau inspectées. Détails dans `docs/DECISIONS_JEU.md` et `docs/ASSETS_POISSONS.md`. Prochaine étape : aquarium puis méthodes et extension/animations.

Mission explicite `docs/MISSION_CODEX_AUTONOME_AU_FIL_DE_LEAU.md` : P0 à P4 autorisés, y compris économie purement virtuelle et aquarium. Elle remplace l’attente de retour téléphone pour progresser ; les mesures appareil restent à faire. Branche `codex/mission-autonome-2026-10-01`, FishDex en lecture seule. `npm ci` : réussi, 0 vulnérabilité. Check initial : 9/9 + build. P0 : lancer libre normalisé, habitats par coordonnées, orientation de canne, comportement spatial par espèce, fil épais attaché à la canne et montage immergé, capture proche sous contrôle. Check P0 : 12 tests à vérifier. Premier E2E perturbé par une modification pendant son exécution (rechargement Vite) : 5/6, rerun stable requis. Voir `docs/MISSION_AUTONOME.md` pour la suite.

| Date | Agent | Réalisé | Prochaine action |
| --- | --- | --- | --- |
| 2026-09-30 | Codex | Projet 0.1, prototype complet, cinq conversions Blender, tests et docs de relais | Installation sur PC, choix cible Vercel, essai sur téléphone |
| 2026-09-30 | Codex local Windows | Installation ; pauses/commandes/premier rendu corrigés ; check 9 tests, E2E 6/6, smoke local 4/4, preview Git 4/4, production Git 4/4 sur www.fishdex.fr ; FishDex conservé | Essai téléphone réel et retour combat ; mesurer fluidité/chauffe avant P1 |
| 2026-10-01 | Codex local Windows | Mission P0–P4 : 0.2 publiée, quinze modèles, catalogue/journal/photos, économie, aquarium et trois méthodes ; check 19, E2E 20 + 2 ignorés, smoke local/preview/production 6/6 chacune ; animations partielles documentées, FishDex inchangé | Safari/iPhone 14 Pro réel, mesures et sensations ; respiration/suspension/épuisette après validation |

Pour chaque nouvelle session : ajouter les changements, les résultats réels de test,
les éventuels bugs, la décision prise et la prochaine tâche. Mettre à jour le résumé
ci-dessus si le périmètre ou l’architecture évolue.
