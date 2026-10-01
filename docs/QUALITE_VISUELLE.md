# Qualité visuelle — structure complète 0.5.0

## Intention

La scène conserve le décor de pêche lisible sur mobile tout en gagnant une hiérarchie
visuelle claire : eau et rive plus profondes, ponton mieux détaché, végétation variée,
matériaux moins plats et panneaux cohérents. Les règles de jeu restent dans `src/game/`;
le rendu ne modifie ni les coordonnées de simulation ni les sauvegardes existantes.

## Changements visibles

- eau avec vagues irrégulières multi-échelles, reflets doux et anneaux d'impact liés au
  lancer, à la touche et à l'approche du poisson ;
- ciel, brouillard, éclairage et palettes de rive harmonisés pour séparer l'horizon,
  le plan d'eau et le premier plan ;
- herbes et arbres différenciés, ponton avec grain local partagé et ombres limitées en
  qualité haute ;
- bassin plus sombre avec fond et galets visibles, poissons et aperçus éclairés sans
  surexposition ;
- cartes, boutons, filtres et emplacements d'équipement unifiés autour du vert profond,
  du crème et de l'or ; illustrations locales de la canne et des appâts dans la boutique.

## Captures vérifiées

Les captures avant/après sont archivées dans `docs/apercus/structure/` : accueil et
combat, menu mobile, FishDex, préparation, boutique, carnet, aquarium et qualité haute.
Elles ont été prises à 390×844 et 1440×900 avec le build courant. Les parcours principaux
ont aussi été contrôlés en paysage 844×390.

## Performance et limites

Les mesures Chromium/SwiftShader Windows du dernier passage donnent environ 22–25 FPS
dans l'étang et 22–24 FPS dans l'aquarium selon la taille de fenêtre ; aucune frame de
pêche ne reste active derrière le bassin. La qualité haute ajoute seulement une ombre
limitée et le mode mobile réduit la résolution interne. Ces chiffres sont des mesures de
référence, pas une certification de fluidité sur iPhone ou Android réel. Safari, la
chauffe, l'autonomie et le ressenti humain restent à mesurer sur appareils physiques.

## Validation

`npm run check` passe avec 35 tests, compilation TypeScript et build Vite. Les tests
navigateur complets passent avec 38 réussites et 2 scénarios ignorés ; le rendu et la
récupération de sauvegarde passent avec 8 réussites ; le smoke local du build public
passe avec 6 réussites. Les erreurs de shader sont absentes dans le scénario qualité
haute.
