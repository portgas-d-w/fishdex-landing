# Couverture des 40 familles du plan de première carte

Lecture du manifest du chantier de carte établi précédemment. Ce tableau est un plan d’embellissement : il ne confirme pas que chaque objet existe actuellement dans le dépôt. Les besoins précis d’aulne/saule/chêne restent distincts des proxies de feuillus disponibles. Les numéros P01–P06 correspondent aux rôles du plan ; associer aux IDs réellement livrés.

| Famille | Priorité | Ressource proposée | Décision et limite |
|---|---|---|---|
| `bank_earth` — Berge de terre et racines fines | P0 | T01,T02 | Réutiliser le terrain/les modules et leurs UV ; mélange au contact, ne pas déplacer la rive. |
| `bank_rock` — Berge rocheuse basse | P1 | M01 ou M06; T07 | Module existant + pierres sélectionnées ; conserver l’accès et les volumes. |
| `bank_roots` — Berge avec racines exposées | P1 | T06; M01 partiel | Talus actuel ; racines spécifiques encore à fabriquer si absentes. Aucun module de racines exact vérifié. |
| `pebble_cluster` — Amas de galets | P1 | M01 ou M06; T04 | Quelques petites pierres en volume ; T04 pour le fond, pas des centaines de cailloux. |
| `tree_alder` — Aulne de berge | P1 | M01 provisoire | Feuillu générique provisoire seulement ; aulne exact non trouvé dans la sélection vérifiée. |
| `tree_willow` — Saule penché | P1 | T06; modèle actuel | Saule penché anatomiquement fidèle encore à fabriquer ; ne pas rebaptiser un érable. |
| `tree_oak` — Arbre de fond de rive | P1 | M01 provisoire | Feuillu générique pour la masse lointaine ; chêne exact à confirmer/créer plus tard. |
| `forest_backdrop` — Groupe forestier lointain | P1 | M01 | Instances par secteurs ; éventuellement imposteurs fabriqués depuis NOS modèles, pas les aperçus des sites. |
| `shrub` — Buisson bas | P1 | M01 | Choisir 2–3 silhouettes et conserver des verts cohérents. |
| `grass_clump` — Touffe d’herbe de rive | P1 | M01 | Quelques variantes instanciées ; limiter le recouvrement des cartes alpha. |
| `reeds` — Touffe de roseaux | P0 | M02 | Touffes irrégulières ; identité botanique et conversion à vérifier. |
| `sedges` — Laîches / plantes de bordure | P1 | M01 partiel; existant | Touffes basses génériques provisoires ; laîches exactes non garanties. |
| `lily_cluster` — Amas de nénuphars | P0 | M03 ou B02 | Groupes peu profonds ; garder des passages libres et un niveau cohérent avec l’eau. |
| `submerged_plants` — Herbiers visibles peu profonds | P1 | existant; M01 adaptation visuelle | Herbiers actuels prioritaires ; aucun pack aquatique spécifique vérifié, une herbe terrestre n’est pas une espèce aquatique. |
| `rock_small` — Pierre de rive | P1 | M01 ou M06 | Modèles adaptés à petite taille ; silhouette mesurée et matériaux mutualisés. |
| `rock_landmark` — Rocher repère | P1 | M06 ou M01 | 1–2 repères isolés, pas tout le pack à chaque poste. |
| `fallen_log` — Tronc tombé partiellement immergé | P0 | M01 arbres morts; T06 | Inspecter si une pièce convient comme tronc tombé, sinon garder le mesh actuel texturé ; pas de tronc exact promis. |
| `submerged_branches` — Branches immergées | P0 | M01 partiel; T06 | Conserver branches actuelles ou extraire un élément adapté ; volumes d’accrochage indépendants. |
| `stump` — Souche de rive | P2 | M07 option | LOD et réduction obligatoires avant duplication ; provisoire actuel si optimisation non concluante. |
| `pier_deck` — Module de ponton en bois | P0 | M04 ou T05 | Comparer au ponton actuel. Importer 1–2 modules seulement ; respecter les ancrages. |
| `pier_pile` — Pieux et traverse de ponton | P0 | M04 ou T06 | Pieux compatibles avec la structure du ponton ; bois humide local, pas métal. |
| `path_patch` — Portion de sentier en terre | P2 | T01; T04 | Réutiliser le terrain ; masque de transition ou vertex colors plutôt que overlays scintillants. |
| `bench` — Banc simple de rive | P2 | M05 option; existant | 900 tris annoncé comme point de départ ; style fonte à comparer au banc bois existant. |
| `sign_post` — Panneau de repère | P2 | existant; T05,T06 | Panneau simple actuel + écriture originale FishDex ; aucune signalétique spécifique vérifiée. |
| `angler_proxy` — Pêcheur occupant un poste | P2 | existant | Conserver le proxy pêcheur actuel. Aucun personnage complet réaliste gratuit validé ici. |
| `floating_leaves` — Petites feuilles de surface | P2 | géométrie existante; M01 adaptation | Quelques feuilles simples ; créer ses propres textures depuis l’asset si nécessaire. |
| `tex_ground_earth` — Terre sèche et humide | P0 | T01,T02 | Matière sèche/humide avec transitions continues. |
| `tex_shore_mud` — Vase et bordure humide | P0 | T02 | Éviter le vernis global ; varier la roughness selon humidité. |
| `tex_sand_gravel` — Sable et gravier | P1 | T04; T08 option | Terrain de l’étang prioritaire ; sable local si crédible. |
| `tex_grass_ground` — Sol végétalisé | P1 | T03 ou B03 | Une base principale ; B04 réservé aux zones entretenues. |
| `tex_wood_weathered` — Bois patiné | P0 | T05 ou B05; T06 | Planches pour faces planes, écorce pour troncs ; ne pas confondre les deux UV. |
| `tex_rock` — Pierre naturelle | P1 | M01/M06 existant; T07 option | Conserver les matériaux inclus s’ils sont bons. |
| `water_normals` — Normales d’eau répétables | P0 | génération procédurale originale | Deux textures répétables 256–512 px via code ; pas de photo d’eau collée. Aucun asset externe dédié retenu. |
| `water_contact_mask` — Masque de contact eau/berge | P0 | données du terrain existant | Masque original dérivé du contour/profondeur actuels ; une texture générique ne peut pas correspondre à notre rive. |
| `fx_ripple` — Atlas de rides locales | P0 | procédural original | Cercles irréguliers/masques 256–512 px, déclenchés par les événements existants. |
| `fx_splash` — Atlas gouttes et petit splash | P0 | F01 option; procédural original | 1–3 sprites choisis, impacts limités ; le sprite ne définit pas la logique de l’événement. |
| `fx_foam_local` — Mousse de contact locale | P2 | procédural original; F01 option | Mousse ponctuelle si justifiée ; pas de plage de surf autour de l’étang. |
| `sky_environment` — Ciel et environnement lumineux | P0 | A01 | HDR 1K de départ, préfiltrage et soleil cohérents avec l’heure. |
| `water_audio` — Familles de sons de contact d’eau | P1 | existant; hors sélection visuelle | Aucun nouveau fichier audio vérifié. Garder les sons actuels ; rechercher les six familles séparément si absentes. |
| `spot_previews` — Captures in-game des six postes | P1 | captures in-game | Six photos après intégration ; aucun aperçu d’auteur ni génération pour remplacer la scène. |
