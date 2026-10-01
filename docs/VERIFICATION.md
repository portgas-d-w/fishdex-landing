# Vérifications — livraisons 0.1 et 0.2

Les résultats actuels du 1 octobre 2026 (version 0.2) sont dans la dernière section. Les résultats 0.1 ci-dessous sont conservés comme historique ; ils ne remplacent pas les mesures récentes.

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
