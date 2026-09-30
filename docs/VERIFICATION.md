# Vérification de la livraison 0.1 — 30 septembre 2026

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
- Publication Vercel, domaine réel, intégration au dépôt existant.
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
