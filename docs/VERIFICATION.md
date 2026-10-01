# Vérifications — livraisons 0.1 à 0.4.1

Les derniers résultats du 1 octobre 2026 (version 0.4.1) sont dans la section suivante. Les livraisons précédentes ci-dessous sont conservées comme historique ; elles ne remplacent pas les vérifications récentes.

## Appui maintenu 0.4.1 — publiée et vérifiée

Dernière instruction : appui immobile sur Mouliner, relâchement pour arrêter ; canne au second doigt. Au leurre, même geste pour conserver une commande cohérente. Moulinet animé sans rotation du doigt ; molette PC conservée.

Node 24.15.0, npm ci sans vulnérabilité. npm run check : **31 tests + TypeScript/build réussis**. E2E ciblés game/multitouch/touch/methods/physics/framing : **19 réussis / 1 ignoré (1,9 min)**. Deux doigts CDP, appui long immobile, relâchement individuel, annulation, perte de capture, blur/pagehide/pause/rotation, défilement et texte éditable ; physique et lancer conservés. Portrait 390×844, paysage et bureau 1440×900 inspectés ; captures hold-* dans docs/apercus.

Smoke ciblé du build sans QA (`-g 'Le build permet une vraie prise'`) : **2/2 (1,7 min)**. Vraies captures en temps réel bureau/mobile, moulinage tactile par maintien immobile, modèle différé, photo, sauvegarde/reload/export/import. Les six scénarios de la livraison 0.4 restent l'historique ; cette correction exécute les deux scénarios pertinents. Préproduction protégée : **2/2 (2,0 min)** sur le même build, accès OIDC limité à son origine ; production publique sur www.fishdex.fr : **2/2 (2,1 min)**, sans token ni QA. JavaScript index-C3HMXfaE.js SHA256 1829019d1e0f6d2aeca81d545f837a80bacf9f065a69fa21c5b78b43384b187c et manifeste quinze modèles identiques au dist local. Rendus de prises publics bureau/mobile inspectés. Aucun essai Safari/iPhone physique.

## Complément sur le PC Windows — 30 septembre 2026

Node 24.15.0, npm 11.12.1, Playwright 1.58.2 / Chromium 145, rendu logiciel.
`npm ci`, `npm run check` : réussis, 9 tests. E2E actuels 6/6, serveur dédié 5174,
un worker, bureau 1440 × 900, mobile 390 × 844.
Le scénario E2E accéléré fige la simulation automatique pendant ses captures :
le temps de capture logiciel ne doit pas faire décrocher le poisson. Le smoke
continue à tester le combat en temps réel. Exécuter les deux suites successivement.
Smoke production local 4/4 et première préproduction Vercel protégée 4/4.
Le smoke joue une vraie partie en temps réel sans QA : événements tactiles Chromium,
relâchement hors bouton, capture, GLB, sauvegarde/rechargement, export/import,
cinq fichiers GLB intacts, aucun modèle au démarrage, archive source exclue.
Après inspection des captures, le signal `data-loaded` a été corrigé pour attendre
les matériaux WebGL et une première image. Les captures smoke attendent ensuite 400 ms.
Publication et résultats définitifs : voir `docs/VERCEL.md` et la clôture du relais.
Clôture : preview Git corrigée 4/4 (56,2 s), production publique 4/4 (52,2 s),
poissons visibles sur captures inspectées, redirection/HTTP 200 confirmés.
Les résultats Linux ci-dessous sont ceux de la livraison initiale, pas ceux de ce PC.

## Environnement de création

Linux, Node.js 24.19.0, npm 11.9.0, Blender 4.5.3 LTS.
Tests de navigateur avec Playwright 1.58.2 et Chromium 138 en rendu logiciel.
Le téléchargement standard Chromium de Playwright était indisponible dans cet
environnement ; un binaire Chromium de test installé séparément a été utilisé.
Sur le PC, utiliser `npx playwright install chromium`, puis `npm run test:e2e`.
Le chemin alternatif est optionnel : `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Résultats

| Vérification | Résultat |
| --- | --- |
| Dépendances installées | Oui, versions verrouillées |
| TypeScript strict | Réussi |
| Tests de logique / sauvegarde | 9/9 réussis |
| Tests navigateur | 4/4 réussis |
| Cycle de prise et carnet après rechargement | Réussi en bureau et viewport mobile |
| Chargement d’un vrai GLB lors d’une prise | Réussi dans les scénarios navigateur |
| Annulation de l’appui et pause via modale | Réussies |
| Import invalide | Refusé sans perdre les données |
| Débordement horizontal au format testé | Aucun |
| Erreurs JS / console lors de la partie testée | Aucune |
| Build production | Réussi |
| Build servi localement : scène, lancer, touche et ferrage | Réussis sans erreur JavaScript |
| Interface de test dans le build production | Absente, vérifié dans le navigateur |
| Structure des cinq GLB | Valide, une texture embarquée par modèle |
| Audit des dépendances de production | 0 vulnérabilité signalée |

Les tests navigateur accélèrent la simulation via un point d’entrée de développement,
pour vérifier les transitions et la persistance. Ils ne prouvent pas que le combat
est plaisant ou bien équilibré en temps réel. Un essai humain reste nécessaire.

Le build conserve un avertissement sur un gros chunk lié à Babylon, environ
1,57 Mo brut / 373 Ko gzip. La distribution complète est d’environ 6,6 Mo avant
compression, avec les ressources et des modules chargés à la demande.
La taille du dossier n’est pas le volume exact téléchargé à l’ouverture.

## Inspections visuelles

Captures de l’étang, du combat et d’une prise sous `docs/apercus/`.
Après la première inspection, caméra abaissée vers l’eau et panneau de combat
compacté pour garder le bouchon visible. Matériaux du décor rééquilibrés et
géométrie statique regroupée par matériau.

## Non testé / non livré

- Safari iOS réel, Chrome Android réel, chauffe et autonomie.
- Objectif de 30 images/s sur téléphone mesuré avec le rendu matériel.
- Longue session de plusieurs heures, appareil à faible mémoire ou connexion instable.
- Validation artistique de toutes les faces de tous les modèles.
- Mode hors connexion, synchronisation multiappareil automatique.
- Équilibrage final, progression longue, animation de nage et physique réaliste.

## Test manuel court pour le propriétaire

1. Lancer au ver à la roselière et attendre la touche.
2. Ferrer puis alterner appui et relâchement ; obtenir une prise.
3. Remettre à l’eau, ouvrir le carnet et recharger la page.
4. Essayer le leurre à l’eau libre, puis volontairement laisser casser le fil.
5. Quitter l’onglet pendant un combat ; vérifier qu’il revient en pause.
6. Exporter le carnet et vérifier qu’un import restitue les prises.

Noter ce qui semble trop lent, peu clair, trop facile ou désagréable sur le téléphone.

## Livraison autonome 0.2.0 — 1 octobre 2026, Codex

Node 24.15.0, npm 11.12.1, Playwright 1.58.2/Chromium 145, Windows headless ANGLE SwiftShader. Qualité eco, bureau 1440×900 et viewport tactile 390×844. Aucun iPhone/Safari physique.

- npm ci : réussi ; npm audit --omit=dev : zéro vulnérabilité.
- npm run check : TypeScript strict, 19 tests de logique, build réussis.
- npm run test:e2e : 20 réussis et 2 ignorés (1 min 30 s). Atlas quinze modèles au bureau ; vrai CDP multitouch uniquement en tactile. Aucun scénario bloquant ignoré.
- Smoke du build sur 4175 : 6/6, 1 min, sans QA. Vraie capture temps réel souris/tactile, relâchement hors bouton, portraits, export/import, récompenses uniques, équipement, aquarium, décor, reload et intégrité des quinze GLB. Aucun modèle au démarrage, ZIP absent.
- Captures inspectées et archivées dans apercus/ ; modèle manquant volontairement simulé conserve le journal et permet de revenir à la pêche. Ouvertures répétées du bassin libèrent son moteur, étang réellement suspendu.
- Mesures de 3 s, aucun seuil de FPS artificiellement validé : étang 22,1/23,5 FPS et aquarium cinq poissons 23,3/22,5 FPS (bureau/mobile). Zéro frame d’étang derrière aquarium. Résultats JSON dans apercus/performance-*.json.
- Build : chunk principal 1 672,35 Ko brut / 405,31 Ko gzip, avertissement Vite ; quinze GLB 1 731 232 octets ; 88 WebP 556 892 octets. Ressources chargées à la demande.

Les tests de logique couvrent cible/refus, orientation, casse/décrochage, capture de toutes les espèces accessibles, migration, unicité, imports invalides, achats, limite des favoris, longueur de la courbe de nage et différences leurre/fond. Les tests ne prouvent pas le plaisir du combat ni la plausibilité anatomique finale. Respiration, suspension, arrivée à l’épuisette et performances réelles restent non validées. Publication distante : docs/VERCEL.md.

Préproduction Git b77a4ee : smoke protégé **6/6 (1,2 min)** sur URL exacte dans VERCEL.md. Même scénarios sans QA que le build local. OIDC uniquement pour l’origine de preview, aucune trace contenant le token ; captures de preview conservées. Première fiche et aquarium effectivement visibles.

Production main affa933 : **smoke public 6/6 (1,1 min)** sur www.fishdex.fr sans OIDC. Captures bureau et mobile inspectées, HTTP 200 et redirection domaine nu confirmés. Bundle principal et manifeste servis correspondent au build vérifié. URL/ID exacts dans VERCEL.md. Clôture documentaire uniquement ; contrôle READY et identité des fichiers de l’application après le dernier push, sans répéter des combats déjà validés quand aucune source applicative ne change.


## Correction immersive 0.3 — 1 octobre 2026

Node 24.15.0, npm ci sans vulnérabilité. npm run check : 23 tests, TypeScript strict et build réussis. Bundle index-CX0qA7ip.js (1 673,42 Ko brut / 405,42 Ko gzip) ; avertissement Vite de taille >900 Ko conservé, aucune erreur de compilation.

E2E complet : 20 réussis / 2 ignorés selon viewport (4,3 min). Après correction du cadrage mobile : 11 ciblés réussis / 1 ignoré (1,1 min). Quatre orientations extrêmes, pointe projetée dans le cadre, scènes et menus inspectés à 390×844, 1440×900, paysage 844×390 ; lancer manuel/refus/cancel, rod glissé et cercle simultanés via vrais doigts CDP, molette, maintien immobile inopérant, pause/menu/pagehide et capture/reload. Toutes les fonctionnalités précédentes (quinze modèles, carnet/photos, bassin/achats) restent couvertes.

Smoke du build final sans QA : 6/6 (1,2 min). Partie en temps réel sur souris et tactile Chromium : lancer manuel, glissement de scène + molette ou commande gauche + cercle second doigt, capture effective, chargement différé, portrait, sauvegarde/rechargement/export/import. Le contrôleur lit l’équivalent accessible non visuel de l’angle du fil et sa tension, sans API interne ni accélération. Aléa fixé au gardon dans le contexte de test ; cadence réelle. Favoris/décor/achats/photos et intégrité des quinze GLB conservés ; original ZIP exclu.

Les premiers essais ont révélé des attentes asynchrones incorrectes dans les tests (molette/fermeture de modale, visibilité body de hauteur nulle). Corrections des attentes, sans désactiver les scénarios. Les captures ont révélé une canne hors cadre à fort angle portrait : amplitude visuelle adaptée au champ horizontal, forces inchangées ; projection et images aux extrêmes contrôlées ensuite.

Comparaison reproductible : scripts/compare-combat.mts et docs/apercus/immersion-combat-comparison.json. Même poisson/matériel/moulinage, canne fixe 0/15 vs suivi 15/15 dans les quinze scénarios. Tests purs de contact, hauteur, angle, résistance, casse et épuisement de budget ; aucun maintien implicite.

Échantillons 3 s Chromium SwiftShader Windows : étang 23,2–23,8 FPS, aquarium bureau 6,9 / mobile 22,2 FPS ; aucune frame de pêche derrière le bassin. Ces nombres variables ne certifient aucun téléphone. Aucun test Safari/iPhone physique ni mesure de chauffe. Images avant/après dans docs/INTERFACE_COMBAT.md ; résultats distants dans docs/VERCEL.md.

Preview Vercel protégée : 9347d75, READY, smoke 6/6 (1,7 min), mêmes commandes réelles et fonctionnalités ; détails exacts dans docs/VERCEL.md.

Production publique : main dae5e93, READY, smoke 6/6 (1,5 min), vrais gestes/captures/persistance et quinze fichiers GLB intacts. HTTP 200 et redirection vers www ; bundle index-CX0qA7ip.js SHA256 104b4e5a1ad703ddfec262791acc566b443fb6acbb52817494c8851d9eb3406e et manifeste identiques au dist vérifié. Captures de production inspectées/conservées ; clôture uniquement documentaire, contrôle d’identité répété sur le dernier déploiement.


## Précision jauge 0.3.1 — 1 octobre 2026

Dernière instruction utilisateur : ajouter une jauge comme sur l’image. Barre compacte non interactive entre les deux commandes, visible au combat, repère correspondant exactement à la tension de canne ; aucun panneau sur le poisson. npm run check : 23 tests, TypeScript/build réussis. E2E ciblés 9 réussis / 1 ignoré (1,2 min), valeur de jauge comparée à la simulation, hors combat masquée, quatre orientations extrêmes, menus et deux doigts. Portrait 390×844, bureau 1440×900 et paysage 844×390 inspectés ; images gauge-* conservées. Smoke build final sans QA 6/6 (1,5 min), captures réelles souris/tactile, achats/bassin/photos/persistance/export-import et quinze GLB. Règles et schéma v2 inchangés ; aucune nouvelle promesse de performance ni test téléphone physique.

Preview 0.3.1 e2af6e7 READY, smoke protégé 6/6 (2,0 min), jauge visible vérifiée, captures réelles et fonctions conservées.

Production 0.3.1 main 6431fb2 READY : smoke public 6/6 (1,7 min), jauge visible, captures réelles et fonctions conservées. Bundle index-D2VdAQ0C.js SHA256 afa1e0b368ddd2d564cb45af53cfc7e4539e96d6887d648b30936674b1263a3f et manifeste identiques au dist local ; captures publiques inspectées et conservées. Clôture documentaire seule, dernier déploiement contrôlé.

## Correction gestes/combat 0.4.0 — 1 octobre 2026

Node 24.15.0 / npm 11.12.1, npm ci sans vulnérabilité. npm run check final : 30 tests réussis, TypeScript et build ; avertissement de taille du chunk Babylon conservé, sans hausse notable. Règles indépendantes dans src/game.

E2E initial complet : 23 réussis / 2 ignorés / 3 échecs, utilisés pour corriger la résistance d’un poisson fatigué et deux attentes de recherche (perche = deux fiches). Vérification finale ciblée : 22 réussis / 1 ignoré, un test mobile de reprise du mou restant ; reprise physique 4/4 (14,2 s) après avoir utilisé le cercle du moulinet sur mobile, au lieu de la molette PC. Au total, 23 scénarios ciblés distincts validés et 1 ignoré, mêmes sources finales. Les parcours modèles, aquarium et collection de la première passe ont également réussi ; ces systèmes n’ont pas changé ensuite.

Appui long ≥1,1 s sur la scène/deux doigts, aucune sélection ; contextmenu/dragstart/selectstart bloqués sur canvas/commandes, user-select/WebKit et touch-action vérifiés. Captures indépendantes, fin/annulation/perte de capture/blur/pagehide/pause/rotation : commandes arrêtées. Défilement réellement natif du carnet et de la boutique par événements tactiles CDP ; recherche, sélection complète du champ, effacement et saisie conservés. Aucun blocage de gestes sur app.

Départ puissant sans moulinage : tension utile et fil sortant ; rotation automatique du moulinet observée en laissant avancer la simulation réelle. Insister crée une tension dangereuse et une casse ; le moulinet récupère le mou pendant le retour du poisson. Quinze captures gérées et comparaison de stratégies archivées. Lancer commencé trop haut ignoré, préparation visible, traversée sans relâchement inopérante, annulation/restauration, projection douce plus courte que rapide. Cadrage portrait 390×844, bureau 1440×900 et paysage inspectés. Captures physics-* dans docs/apercus.

Le support des propriétés Safari est implémenté ; ces mesures sont Chromium/SwiftShader Windows, pas Safari ni iPhone physique. La chauffe et le ressenti humain restent à mesurer. Smoke local du build public sur 4175 : 6/6 (2,3 min), aucune QA, vraie capture souris/tactile, quinze GLB, sauvegarde/rechargement/export/import, achats et aquarium. Preview Git protégée 3a2d06b : smoke 6/6 (2,9 min), READY ; vrai gameplay et sauvegardes sans QA. Production main 2dd0c5a READY : smoke public 6/6 (2,7 min), vraies captures et fonctions persistantes ; JavaScript index-DkrQEhJk.js SHA256 111776c16a88eed3f2fec3c331b6e9d7c0a184c4cccb7a5c27346d82e065163c et manifeste identiques au dist local. Aucun fichier applicatif changé après preview ; clôture documentaire seule. Captures physics-public-* inspectées. Serveur temporaire 4175 arrêté.
