# Architecture — version 0.4.1, 1 octobre 2026

Babylon.js 9.28.0 core/loaders cohérents, TypeScript 5.9.3 et Vite 8.3.1 verrouillés. Production statique ; aucun backend, compte ou service externe pendant une partie.

## Règles indépendantes du navigateur

- src/game/catalog.ts : quinze espèces, habitats et pondérations appâts/méthodes.
- src/game/casting.ts : CastGesture : tiers inférieur, préparation continue, échantillons récents de projection (180 ms), amplitude secondaire, limite de matériel, relâchement central et limites d’eau/habitat.
- src/game/fishing.ts : machine idle → casting → waiting → bite → fighting → caught/lost ; simulation à pas 1/60 s. Coordonnées de poisson, orientation, puissance de canne, récupération, tension, casse/décrochage et capture contrôlée. Leurre et fond ont des règles distinctes.
- src/game/combat.ts : stepCombat : distance radiale, longueur de ligne disponible, offset de pointe (hauteur et angle), extension amortie canne/fil, résistance relative au matériel, frein automatique et fatigue sous tension modérée. Nage départ/calme/retour affaiblie par la fatigue. Aucun angle binaire ni durée de victoire.
- src/game/reeling.ts : conversion de molette ; budget de tours épuisé en moins de 0,2 s.
- src/game/specimens.ts : identité individuelle, forme/robe/Mirage et relation longueur/poids.
- src/game/economy.ts : récompenses, prix, matériel, niveaux et badges centralisés.
- src/game/save.ts : schéma v2, migration v1, parsing restrictif, records historiques/individuels, unicité et achats. Même clé au-fil-de-leau.save.v1 ; import 5 Mo/10 000 captures, validation et confirmation avant remplacement.
- src/game/swimming.ts : courbe centrale inextensible de nage ; rendu et DOM indépendants.
- src/game/fishdex.json : catalogue propre importé des fichiers réels, provenance/SHA256 ; aucune dépendance d’exécution au projet FishDex.

## Rendu et interface

src/render/world.ts : paysage procédural, shader eau, montage, fil épais attaché à la canne flexible, cible/trajectoire du lancer. Le bouchon s’immerge pendant le combat ; fond/leurre n’en utilisent pas. Eco plafonné à 30 rendus/s et résolution 1,25×, haute qualité à 2×. Limites configurées, pas garantie de fluidité appareil.

src/render/fish-preview.ts : moteur créé à la première fiche, GLB à la demande, première image attendue après matériaux WebGL. Robe exacte, débattement intermittent, tapis ≥60 cm, photo 480×240. Boucle arrêtée et modèle libéré à la fermeture. src/render/appearance.ts permet de remplacer modèle/forme/robe sans réécrire la progression ; src/render/swim.ts déforme géométrie et normales sans détacher les nageoires.

src/render/aquarium.ts : scène séparée seulement lorsqu’elle est ouverte, cinq individus maximum, proportion commune et niveaux espacés, trajectoires déphasées, fond/sol/lumière et décor. Chargements tardifs ignorés après fermeture, moteur/scène supprimés. Étang arrêté derrière toutes les modales ; aquarium arrêté derrière une fiche et lorsque la page est cachée.

src/main.ts : interface, gestes avec identifiants distincts, clavier, pauses, modales et orchestration. Deux commandes rondes canne/moulinet avec captures de pointeurs indépendantes ; glissement de scène et molette également disponibles. Appui maintenu : état explicite dans FishingGame, 1,6 tour/s sans mouvement du doigt. release et toutes les transitions le désactivent ; le clic et la molette ne cumulent pas leurs vitesses. Toute interruption annule les captures et vide les tours en attente. Menu et matériel compacts ; modales à retour explicite, aucun panneau de comportement ; jauge de tension compacte entre les commandes, ajoutée sur dernière instruction utilisateur. Elle affiche game.tension, saturée à 100 % en surcharge, et ne prend pas les gestes. Import confirmé remet la partie au repos avant de charger sa progression. L’interface reste regroupée ici ; extraire des contrôleurs si un changement le justifie.

Les protections CSS user-select/WebKit/callout et les événements contextmenu/selectstart sont attachés au canvas et à scene-controls, jamais à app/body qui portent aussi les dialogues. Les champs ont user-select:text, les dialogues défilent verticalement ; les canvas de fiche/bassin autorisent ce défilement. Les images ne déclenchent pas de drag natif. Annulation par doigt ; blur/pagehide/pause/resize nettoient les deux captures et la préparation.

src/ui/photos.ts : Blob IndexedDB indépendants du JSON, ≤100 Ko, 128 dernières images, erreur/délai non bloquant ; un souvenir peut régénérer son portrait. src/ui/audio.ts : Web Audio facultatif après geste, oscillateurs libérés, aucun appel à un service de sons.

## Validation et limites

Tests Node du TypeScript effaçable ; E2E Vite sur 5174 avec QA uniquement DEV + VITE_E2E=1. QA absente du build. Smoke du build et des déploiements en temps réel, sans QA, bureau et Chromium tactile. Une seule suite/worker à la fois sur ce PC en rendu logiciel.

Nage et robes provisoires sans rig ; respiration, suspension et épuisette absentes. Eau simplifiée sans réflexion physique, pas de météo, PWA ou synchronisation. Mesures locales ~22–24 FPS eco en SwiftShader, pas de test Safari/iPhone réel. Mesurer performances/chauffe puis optimiser avant effets lourds. Journal JSON fini : archivage nécessaire avant 10 000 captures/5 Mo.
