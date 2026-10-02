# Basalte & Turquoise — version 0.7.0

Direction artistique du propriétaire appliquée au jeu existant le 2 octobre 2026 par Codex. Référence textuelle archivée dans [le guide](GUIDE_DA_BASALTE_TURQUOISE_CODEX_CLAUDE.md). Le pack reste stylisé ; aucun rendu photographique promis, modèle remplacé, service, dépendance ou production Blender ajouté.

## Audit et périmètre

Base `d511384`, Babylon.js core/loaders **9.28.0**, Vite **8.3.1**, Node **24.15.0**. `npm ci` : zéro vulnérabilité. Le projet possédait déjà eau animée, regroupement statique, ombres 512² optionnelles, pools de trois rides/quatre gouttes et résolutions distinctes du DOM. Ces mécanismes ont été conservés.

Les fichiers `src/game/` et les quinze GLB/portraits restent inchangés. Sauvegarde **v4**, même clé ; aucune migration supplémentaire. Anciennes photos IndexedDB conservées ; les nouvelles photos utilisent un fond anthracite. Identités, économie, progression, stock, rencontres, casting et commandes simultanées ne changent pas. Caméra, cible et projection sont identiques avant/après. Le comportement existant des menus suspend la pêche ; l’aquarium reste limité à cinq favoris.

## Changements

- `src/render/world.ts` : ciel gris-bleu, lumière neutre et chaude mesurée, palette naturelle moins saturée, reliefs/rives en masses irrégulières. Arbres, touffes et pierres utilisent la hauteur des ellipsoïdes de terrain ; roseaux et nénuphars en bouquets, quatre roseaux animés contre dix auparavant. Static meshes regroupés par matériau ; aucun gel des objets de jeu.
- Eau opaque, deux échelles animées, variation olive proche/profonde et reflet de ciel analytique. Pas de caméra miroir ni post-traitement ajouté. Détail spéculaire réservé à haute qualité. Rides et gouttes existantes suivent toujours l’arrivée du lancer, la touche et la proximité réelle du poisson ; durée et nettoyage conservés.
- Grain de sol partagé **256×256**, bois **512×128**, calculés une fois au chargement. Bois moins jaune et moins brillant, pierre mate ; famille StandardMaterial conservée. Aucun correctif gamma ou tone mapping cumulé.
- `src/ui/theme.css`, `src/style.css`, `src/ui/structure.css` : tokens communs Basalte & Turquoise, police système, titres compacts, surfaces opaques, suppression du flou des backdrops, focus visible et animations 120–300 ms réduites selon préférence. Champs à 16 px, cibles principales au moins 44 px, état explicite en plus de la couleur.
- FishDex compact, portraits statiques cadrés avec marges, silhouettes propres aux espèces, vraie progression des quinze espèces séparée des fiches futures. Informations de catalogue déplacées en pied de panneau ; valeurs de maîtrise et apparences inchangées. Sélecteurs de matériel affichent « Équipé »/« Sélectionnée » et `aria-pressed`, sans action supplémentaire.
- `fish-preview.ts`, `aquarium.ts` : éclairage plus sobre et fonds neutres. Aucun nouveau rig ; mouvements existants conservés. Favicon et couleur du navigateur raccordés au thème.

## Captures comparables

Même étang, matin, caméra et profil **éco**, sauvegarde de référence fixe avec cinq spécimens/favoris. Scènes animées : l’instant précis des vagues varie. Le budget de pixels éco sur grand écran a changé, explicitement indiqué ci-dessous.

| Vue | Avant | Après |
|---|---|---|
| Étang bureau | [Capture](apercus/basalte-turquoise/before/desktop-lake.png) | [Capture](apercus/basalte-turquoise/after/desktop-lake.png) |
| Étang mobile | [Capture](apercus/basalte-turquoise/before/mobile-lake.png) | [Capture](apercus/basalte-turquoise/after/mobile-lake.png) |
| FishDex mobile | [Capture](apercus/basalte-turquoise/before/mobile-encyclopedia.png) | [Capture](apercus/basalte-turquoise/after/mobile-encyclopedia.png) |
| Ma canne | [Capture](apercus/basalte-turquoise/before/mobile-preparation.png) | [Capture](apercus/basalte-turquoise/after/mobile-preparation.png) |
| Montage | [Capture](apercus/basalte-turquoise/before/mobile-rig.png) | [Capture](apercus/basalte-turquoise/after/mobile-rig.png) |
| Boutique | [Capture](apercus/basalte-turquoise/before/mobile-shop.png) | [Capture](apercus/basalte-turquoise/after/mobile-shop.png) |
| Aquarium à cinq | [Capture](apercus/basalte-turquoise/before/mobile-aquarium.png) | [Capture](apercus/basalte-turquoise/after/mobile-aquarium.png) |
| Capture | [Capture](apercus/basalte-turquoise/before/mobile-catch.png) | [Capture](apercus/basalte-turquoise/after/mobile-catch.png) |

Les mêmes dossiers contiennent menu, sac, fiche d’espèce, carnet, progression, aide, lieux, lancer, combat, paysage, FishDex 320/430. Les PNG mobile sont capturés au DPR émulé 3 ; le viewport est **390×844**. `art-direction.spec.ts` reproduit le parcours ; `ART_DIRECTION_STAGE=before` doit être exécuté sur la base historique pour recréer la référence, pas sur les sources finales.

## Mesures réellement accessibles

**Chromium headless / ANGLE SwiftShader sur PC Windows**, rendu logiciel, éco. Échauffement initial 1,2 s, vingt échantillons espacés de 150 ms pour l’étang et le combat, 3 s pour le bassin. Durées courtes et variance d’ordonnancement ; ces mesures ne démontrent ni 30 FPS sur iPhone, ni chauffe/autonomie, ni mémoire GPU.

| Mesure | Bureau avant | Bureau après | 390 px avant | 390 px après |
|---|---:|---:|---:|---:|
| Étang au repos, FPS | 21,3 | 23,1 | 23,2 | 23,3 |
| Combat, FPS | 19,9 | 23,9 | 23,5 | 22,9 |
| Aquarium à cinq, FPS | 21,4 | 23,2 | 22,8 | 23,2 |
| Appels de rendu au repos | 40 | 21 | 21 | 21 |
| Sommets de scène | 70 320 | 55 294 | 70 320 | 55 294 |
| Canvas interne | 1280×800 | 1024×640 | 390×844 | 390×844 |
| Frames d’étang pendant le bassin | 0 | 0 | 0 | 0 |

À largeur interne constante **1280**, la première passe du décor mesurait **18,1 FPS**, contre 21,3 avant. Le rendu n’a pas été déclaré meilleur en performance à résolution égale : le détail éco a été simplifié puis le plafond grand écran réduit à **1024**. Cela diminue le travail rasterisé ; les menus DOM restent nets à leur résolution native. À 390 px, aucune réduction supplémentaire et cadence proche de la référence. Qualité haute conserve le plafond DPR 1,5 et les ombres optionnelles ; sa fluidité réelle n’est pas certifiée.

Les JSON `before/*-metrics.json`, `world/desktop-metrics.json` et `after/*-metrics.json` conservent les valeurs brutes, les dimensions, textures et médiane/P95 de soumission CPU Babylon. **Temps CPU de `scene.render`, pas temps GPU ni intervalle de présentation complet** ; aucune extrapolation à l’appareil. Deux textures locales, environ 0,5 Mio RGBA8 de niveau de base ensemble ; estimation théorique, hors buffers/mips/driver/poissons. Bundle principal ~1,81 Mo brut / 442 Ko gzip, bibliothèque future différée ~511 Ko / 50 Ko gzip ; avertissement de taille Babylon conservé.

## Vérifications et limites

`npm run check` : **47 tests**, TypeScript et build réussis. Référence avant 2/2, première passe monde 1/1, rendu/shaders/récupération intermédiaire 6/6. Le test de largeur a révélé le carnet à 320 px, corrigé avant la livraison ; sept panneaux vérifiés à 320/390/430 et 844×390, contraste principal ≥4,5 et animations réduites. Suite navigateur complète finale : **51 réussis / 3 ignorés (4,3 min)**, exclusions prévues pour les scénarios réservés au mobile ou au bureau. Smoke et déploiement validés ci-dessous.

Smoke local du build final sans instrumentation QA : **8/8 (1,6 min)**, vraie prise souris et commandes tactiles, photo/export/import, quinze GLB intacts, atelier/presets/stock, catalogue futur, achats et aquarium à cinq. Captures finales inspectées à 390×844 et bureau ; les tests de largeur complètent l’inspection. Preview protégée **8/8 (1,7 min)** puis production publique **8/8 (1,7 min)** sur www.fishdex.fr, sans token. Application af88995, production READY ; 45 fichiers JS/CSS identiques au build local, manifeste des quinze modèles identique. Preuve : [production-files.json](apercus/basalte-turquoise/production-files.json). Déploiements et retour détaillés dans [VERCEL.md](VERCEL.md).

Prochain essai : Safari sur l’iPhone 14 Pro du propriétaire et téléphone plus modeste, portrait/paysage, retour d’arrière-plan, menus/clavier, 5–10 minutes d’échauffement, cadence/GPU, chauffe, autonomie et réseau mobile. Les reliefs et poissons actuels restent stylisés ; aucun asset futur activé. Voir `RELAIS_PROJET.md`, `RELAIS_CODEX_CLAUDE.md` et `VERCEL.md` pour la passation et le retour.

Les regroupements statiques et mesures sont adaptés aux APIs du moteur installé, conformément à la [documentation Babylon.js](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/scene/optimize_your_scene.md). Les seuils de contraste sont ceux du guide du propriétaire, appuyé par [WCAG Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
