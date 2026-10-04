# Eau et événements visuels — correspondance et recette (lot 4)

Date : 4 octobre 2026. Source de vérité : `src/game/water-events.ts` (28 types, journal borné de 64 événements, horloge de simulation). Rendu : `src/render/pond-water.ts` + `water-shaders.ts`. Aucun événement inventé : les types déclarés mais non émis restent sans effet.

## Correspondance avec `evenements_eau_reference.json`

| Référence | Émetteur réel | Rendu | Couronne |
| --- | --- | --- | --- |
| `cast_impact` | water-events.ts (fin du lancer) | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `line_deposit` | water-events.ts (dépôt) | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `float_enter` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `float_motion` | water-events.ts (trail) | sillage orienté (vague shader de type sillage) + ride | — |
| `bite_float` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `float_submerge` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `float_resurface` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `strike_surface` | water-events.ts (ferrage près surface) | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `lure_surface` | water-events.ts (trail) | sillage orienté (vague shader de type sillage) + ride | — |
| `lure_submerge` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `bait_sink` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `feeder_impact` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `groundbait_impact` | fishing.ts (amorçage) | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `fish_near_surface` | water-events.ts (combat) | sillage orienté (vague shader de type sillage) + ride | — |
| `fish_surface_turn` | water-events.ts (combat, traction) | sillage orienté (vague shader de type sillage) + ride | — |
| `fish_surface_break` | **type déclaré, non émis par la simulation actuelle** | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `fish_dive` | **type déclaré, non émis par la simulation actuelle** | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `line_surface_drag` | water-events.ts (combat) | sillage orienté (vague shader de type sillage) + ride | — |
| `obstacle_disturbance` | water-events.ts (accroche réelle) | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `net_enter` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `net_capture` | fishing.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `net_exit` | water-events.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `fish_release` | fishing.ts + world.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | oui (si intensité > 0,12) |
| `ambient_surface` | fishing.ts | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `rain_surface` | **type déclaré, non émis par la simulation actuelle** | ride + vague shader (8 emplacements, essentiels prioritaires) | — |
| `wind_change` | water-events.ts (ignoré par le rendu) | aucun (vent commun lu par shader/plantes) | — |
| `boat_wake` | water-events.ts (poste bateau, contexte) | sillage orienté (vague shader de type sillage) + ride | — |
| `spot_transition` | water-events.ts (nettoyage des effets) | vide les pools, rafraîchit le reflet | — |

## Changements de ce lot (rendu uniquement)

- Rides lisibles : anneau 1,6 cm (au lieu de 0,8), opacité ∝ perturbation réelle plafonnée à 0,38 (au lieu de ~0,04 invisible), extinction en (1−t)^1,6.
- Gouttes 4,5 cm (au lieu de 3,5) ; nombre inchangé (∝ intensité, plafond du profil).
- Couronne d’éclaboussure en pool (low 2 / standard 4 / high 6) pour les franchissements massifs réels : cylindre ouvert à opacité dégradée vers le haut, 0,45 s, aucune mousse permanente.
- Reflet planaire : liste triée par taille apparente (rayon/distance) au lieu de la distance seule, plafond 60 objets (48 avant) : la rive boisée opposée apparaît dans le reflet.
- Atlas de contacts : branches immergées (0,8 m), massifs de roseaux de rive (∝ échelle) et bouquets de nénuphars (1,1 m × échelle) ajoutés ; pieux alignés sur le ponton Blender.

## Recette (Chromium SwiftShader 390×844, `production_3d/environment/tools/water-scenarios.mjs`) — pas un iPhone

| Profil | Rides max / capacité | Gouttes max / capacité | Couronnes max / capacité | Vagues shader | Nettoyé après 3 s | Objets du reflet |
| --- | --- | --- | --- | --- | --- | --- |
| low | 12 / 12 | 3 / 16 | 2 / 2 | 8 / 8 | oui | 72 |
| standard | 20 / 20 | 3 / 32 | 4 / 4 | 8 / 8 | oui | 72 |
| high | 23 / 28 | 3 / 48 | 6 / 6 | 8 / 8 | oui | 72 |

Trente impacts consécutifs par profil : aucune croissance de meshes/matériaux/textures. Dix transitions de poste avec impact à chaque poste : croissance meshes 0, matériaux 0, textures 0, géométries 0, cibles de rendu 0 ; effets vides à la fin : oui. Erreurs console : 0.

Captures : `docs/apercus/visuels-blender/eau/<profil>-<événement>.jpg` (impact de lancer, feeder, sillage de flotteur, émergence en démo, capture à l’épuisette).

## Limites

- `fish_surface_break`, `fish_dive`, `rain_surface` ne sont pas émis par la simulation : leur rendu existe (démo) mais n’apparaît pas en jeu tant que le gameplay ne les produit pas.
- Le vent n’anime pas les GLB de végétation (feuillage statique) ; les rides de surface suivent `game.environment.wind`.
- Mesures sur rendu logiciel : la cadence réelle et le coût du reflet planaire restent à mesurer sur iPhone.
