# Profils des poissons — biologie et propositions de jeu

Recherche du 2026-10-02. 62 profils, dont 3 identités non résolues. Toutes les entrées restent à confronter au catalogue du dépôt.

Les faits et leur source figurent séparément des actions proposées. Les six notes 0–1 sont des réglages de gameplay : elles ne sont pas des mesures scientifiques ni des probabilités de capture.

| Attribut | Signification dans le jeu |
|---|---|
| burst | Intensité relative d’un départ brusque |
| endurance | Persistance relative d’un effort |
| agility | Fréquence/amplitude relative des changements de direction |
| head_shakes | Poids relatif des séquences de secousses |
| cover_seeking | Tendance proposée à viser un abri accessible |
| slack_pressure | Tendance proposée à créer du mou par retour vers le joueur |

Ces réglages se combinent au poids, au stade, aux conditions, à la fatigue et au matériel. Un barbeau de 500 g ne tire pas plus fort qu’un silure de 30 kg à cause d’un score d’endurance. Les événements ne se répètent pas à chaque combat.

Les taxons d’observation restent présents dans le FishDex et peuvent se découvrir sans capture. Le nom d’une image ne prouve pas l’espèce : voir correspondances_images.csv.

## Grande alose — `grande-alose`

**Taxon :** Alosa alosa. **Recherche :** documented. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Consomme principalement du zooplancton en mer ; arrête de s'alimenter pendant la remontée reproductrice.

Habitat indicatif : estuaire, riviere_migratoire. Activité : selon_stade.

**Proposition de comportement en jeu :** Espèce distincte de l'alose feinte ; observation et approche spécialiste à définir avant capture.

Réglages provisoires : burst=0.73 · endurance=0.74 · agility=0.71 · head_shakes=0.65 · cover_seeking=0.10 · slack_pressure=0.70.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_aloses](https://doris.ffessm.fr/Especes/Alosa-alosa-fallax-Alose-vraie-Alose-feinte-4490).

Règles de stade à préserver : [{"stage": "adult_reproductive_return", "hunger_bite_rate": 0, "reaction_to_artificial": "separate_specialist_system_needs_validation"}].

## Carassin doré / poisson rouge — `carassin-dore`

**Taxon :** Carassius auratus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore ; taxon distinct du carassin commun et du carassin argenté, même lorsque la coloration varie.

Habitat indicatif : fond, herbiers, eau_calme. Activité : selon_conditions.

**Proposition de comportement en jeu :** Petites tractions latérales et pauses ; l'image carassin-doré doit confirmer ce taxon avant rattachement définitif.

Réglages provisoires : burst=0.40 · endurance=0.42 · agility=0.43 · head_shakes=0.30 · cover_seeking=0.50 · slack_pressure=0.40.

Appâts/leurres candidats : ver_terre, mais, pain. Méthodes candidates : coup, anglaise.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_carassins](https://doris.ffessm.fr/Especes/Carassius-spp.-Carassin-commun-carassin-argente-et-carassin-dore-2552).

## Ablette — `ablette`

**Taxon :** Alburnus alburnus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore de petite taille consommant invertébrés et débris végétaux.

Habitat indicatif : surface, pleine_eau, eau_calme. Activité : jour.

**Proposition de comportement en jeu :** Touches rapides et fuite latérale courte ; combat bref mais mou possible au rapprochement.

Réglages provisoires : burst=0.30 · endurance=0.16 · agility=0.70 · head_shakes=0.25 · cover_seeking=0.10 · slack_pressure=0.60.

Appâts/leurres candidats : asticot, pinkie, ver_vase. Méthodes candidates : coup, anglaise.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_ablette](https://doris.ffessm.fr/Especes/Alburnus-alburnus-Ablette-1020/%28rOffset%29/2).

## Alose feinte — `alose-feinte`

**Taxon :** Alosa fallax. **Recherche :** documented. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Adulte principalement piscivore en mer ; cesse de se nourrir lors de la remontée reproductrice.

Habitat indicatif : estuaire, riviere_migratoire. Activité : selon_stade.

**Proposition de comportement en jeu :** Départs rapides et changements de direction ; réaction aux artificiels distincte de la faim en remontée.

Réglages provisoires : burst=0.76 · endurance=0.63 · agility=0.78 · head_shakes=0.66 · cover_seeking=0.10 · slack_pressure=0.73.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : leurre, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_aloses](https://doris.ffessm.fr/Especes/Alosa-alosa-fallax-Alose-vraie-Alose-feinte-4490).

Règles de stade à préserver : [{"stage": "adult_reproductive_return", "hunger_bite_rate": 0, "reaction_to_artificial": "separate_specialist_system_needs_validation"}].

## Carpe argentée — `amour-argente`

**Taxon :** Hypophthalmichthys molitrix. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Filtre surtout le phytoplancton, avec d'autres petites particules alimentaires.

Habitat indicatif : pleine_eau, eau_calme. Activité : selon_temperature.

**Proposition de comportement en jeu :** Découverte visuelle d'abord ; aucun combat classique activé sans mécanique de capture documentée.

Réglages provisoires : burst=0.72 · endurance=0.70 · agility=0.53 · head_shakes=0.40 · cover_seeking=0.10 · slack_pressure=0.42.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_argentee](https://doris.ffessm.fr/Especes/Hypophthalmichthys-molitrix-Carpe-argentee-3428).

Règles de stade à préserver : [{"stage": "adult", "feeding": "filtering", "standard_hook_bait_system": false}].

## Amour blanc / carpe herbivore — `amour-blanc`

**Taxon :** Ctenopharyngodon idella. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** L'adulte consomme principalement des végétaux aquatiques ; jeunes et adultes ont des régimes différents.

Habitat indicatif : herbiers, eau_calme. Activité : selon_temperature.

**Proposition de comportement en jeu :** Départ puissant, récupération possible puis nouveau départ près du bord ; variation individuelle importante.

Réglages provisoires : burst=0.84 · endurance=0.76 · agility=0.52 · head_shakes=0.45 · cover_seeking=0.54 · slack_pressure=0.47.

Appâts/leurres candidats : mais, pain, vegetaux. Méthodes candidates : fond, carpe, stalking.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_herbivore](https://doris.ffessm.fr/Especes/Ctenopharyngodon-idella-Amour-blanc-3888).

Règles de stade à préserver : [{"stage": "juvenile_vs_adult", "rule": "Ne pas appliquer le régime végétal adulte à tous les juvéniles."}].

## Carpe à grosse tête / amour marbré — `amour-marbre`

**Taxon :** Hypophthalmichthys nobilis. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Espèce filtrante dont le zooplancton occupe une place importante dans l'alimentation.

Habitat indicatif : pleine_eau, eau_calme. Activité : selon_temperature.

**Proposition de comportement en jeu :** Profil visible en collection ; capture spécialisée future, sans préférence universelle pour les bouillettes.

Réglages provisoires : burst=0.62 · endurance=0.82 · agility=0.38 · head_shakes=0.26 · cover_seeking=0.08 · slack_pressure=0.32.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FAO — bio_marbree](https://www.fao.org/fishery/docs/CDrom/aquaculture/I1129m/file/fr/fr_bigheadcarp.htm).

Règles de stade à préserver : [{"stage": "adult", "feeding": "filtering", "standard_hook_bait_system": false}].

## Anguille européenne — `anguille-europeenne`

**Taxon :** Anguilla anguilla. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Chasse au crépuscule ; consomme invertébrés et poissons. Certaines phases migratoires ne sont plus alimentaires.

Habitat indicatif : fond, abris, eau_calme. Activité : crepuscule_nuit.

**Proposition de comportement en jeu :** Cherche les abris et oppose des tractions sinueuses ; ne pas confondre avec les départs rectilignes d'un prédateur pélagique.

Réglages provisoires : burst=0.56 · endurance=0.70 · agility=0.70 · head_shakes=0.54 · cover_seeking=0.91 · slack_pressure=0.50.

Appâts/leurres candidats : ver_terre, morceau_poisson. Méthodes candidates : fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_anguille](https://doris.ffessm.fr/Especes/Anguilla-anguilla-Anguille-856).

## Apron du Rhône — `apron-du-rhone`

**Taxon :** Zingel asper. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Poisson du cours moyen des rivières ; consomme des larves d'insectes et des vers.

Habitat indicatif : fond, riviere_courante, gravier. Activité : a_documenter.

**Proposition de comportement en jeu :** Observation sur le fond ; aucun appât de capture attribué pour cette proposition de découverte.

Réglages provisoires : burst=0.22 · endurance=0.26 · agility=0.32 · head_shakes=0.21 · cover_seeking=0.80 · slack_pressure=0.35.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_apron](https://doris.ffessm.fr/Especes/Apron-du-Rhone3/%28rOffset%29/11).

## Aspe — `aspe`

**Taxon :** Leuciscus aspius. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** L'adulte chasse surtout de petits poissons près de la surface ; les jeunes ont un régime plus invertébré.

Habitat indicatif : surface, riviere_courante, pleine_eau. Activité : jour.

**Proposition de comportement en jeu :** Départ très rapide, longues traversées et retour vers le joueur pouvant produire du mou.

Réglages provisoires : burst=0.95 · endurance=0.72 · agility=0.85 · head_shakes=0.46 · cover_seeking=0.20 · slack_pressure=0.73.

Appâts/leurres candidats : petit_poisson_nageur, cuiller_ondulante, stickbait. Méthodes candidates : leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_aspe](https://doris.ffessm.fr/Especes/Leuciscus-aspius-Aspe-2994/%28rOffset%29/0).

## Barbeau méridional — `barbeau-meridional`

**Taxon :** Barbus meridionalis. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Vit dans des eaux courantes claires et oxygénées ; consomme de petits invertébrés.

Habitat indicatif : fond, riviere_courante, gravier. Activité : a_documenter.

**Proposition de comportement en jeu :** Résistance orientée vers le courant et maintien près du fond ; moins de force absolue qu'un grand barbeau.

Réglages provisoires : burst=0.48 · endurance=0.65 · agility=0.54 · head_shakes=0.31 · cover_seeking=0.53 · slack_pressure=0.36.

Appâts/leurres candidats : ver_terre, asticot, nymphe. Méthodes candidates : coup, toc, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FishBase — bio_barbeau_meridional](https://www.fishbase.se/FieldGuide/FieldGuideSummary.php?GenusName=Barbus&SpeciesName=meridionalis&pda=1&sps=).

## Barbeau commun — `barbeau`

**Taxon :** Barbus barbus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Se nourrit surtout d'invertébrés benthiques ; les grands adultes peuvent consommer de petits poissons.

Habitat indicatif : fond, riviere_courante, gravier. Activité : selon_conditions.

**Proposition de comportement en jeu :** Tient le fond et exploite le courant ; longs efforts et récupération progressive.

Réglages provisoires : burst=0.78 · endurance=0.94 · agility=0.42 · head_shakes=0.36 · cover_seeking=0.60 · slack_pressure=0.33.

Appâts/leurres candidats : ver_terre, pellet, asticot, fromage. Méthodes candidates : feeder, fond, coup.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_barbeau](https://doris.ffessm.fr/Especes/Barbeau-commun3).

## Achigan à petite bouche — `black-bass-petite-bouche`

**Taxon :** Micropterus dolomieu. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Recherche notamment les zones rocheuses ; régime carnivore incluant écrevisses, insectes et poissons.

Habitat indicatif : roches, riviere_courante, pleine_eau. Activité : jour_crepuscule.

**Proposition de comportement en jeu :** Combinaison de déplacements vifs et secousses ; les sauts restent des événements pondérés de gameplay.

Réglages provisoires : burst=0.86 · endurance=0.75 · agility=0.90 · head_shakes=0.88 · cover_seeking=0.56 · slack_pressure=0.86.

Appâts/leurres candidats : shad, ecrevisse_souple, crankbait, ver_souple. Méthodes candidates : leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_bass_petite](https://doris.ffessm.fr/Especes/Micropterus-dolomieu-Achigan-a-petite-bouche-1502).

## Achigan à grande bouche — `black-bass`

**Taxon :** Micropterus salmoides. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Carnivore opportuniste consommant poissons et autres proies animales ; chasse notamment de jour.

Habitat indicatif : herbiers, abris, eau_calme. Activité : jour.

**Proposition de comportement en jeu :** Départs courts vers les couverts, secousses et sauts occasionnels ; faibles marges de mou dans ces phases.

Réglages provisoires : burst=0.84 · endurance=0.61 · agility=0.83 · head_shakes=0.92 · cover_seeking=0.88 · slack_pressure=0.87.

Appâts/leurres candidats : shad, ver_souple, grenouille_souple, spinnerbait, crankbait. Méthodes candidates : leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_bass](https://doris.ffessm.fr/Especes/Micropterus-salmoides-Achigan-a-grande-bouche-2778/%28rOffset%29/17).

## Blageon — `blageon`

**Taxon :** Telestes souffia. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Consomme des proies de surface et du fond ; compétition rapide au sein du banc pour les insectes dérivants.

Habitat indicatif : riviere_courante, pleine_eau, surface. Activité : jour.

**Proposition de comportement en jeu :** Touches furtives en dérive et courtes accélérations de banc.

Réglages provisoires : burst=0.45 · endurance=0.31 · agility=0.80 · head_shakes=0.30 · cover_seeking=0.17 · slack_pressure=0.66.

Appâts/leurres candidats : asticot, pinkie, mouche_seche, nymphe. Méthodes candidates : coup, toc, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_blageon](https://doris.ffessm.fr/Especes/Leuciscus-souffia-Blageon-2168/%28rOffset%29/0).

## Bouvière — `bouviere`

**Taxon :** Rhodeus amarus. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Alimentation surtout végétale complétée par de petits invertébrés ; reproduction associée à des moules d'eau douce.

Habitat indicatif : eau_calme, herbiers. Activité : a_documenter.

**Proposition de comportement en jeu :** Observation près des plantes et moules ; espèce de découverte, sans combat spectaculaire artificiel.

Réglages provisoires : burst=0.16 · endurance=0.12 · agility=0.42 · head_shakes=0.18 · cover_seeking=0.34 · slack_pressure=0.47.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_bouviere](https://doris.ffessm.fr/Especes/Rhodeus-amarus-Bouviere-1325/%28rOffset%29/17).

## Brème bordelière — `breme-bordeliere`

**Taxon :** Blicca bjoerkna. **Recherche :** partial. **Découverte proposée :** capture.

**Faits documentés / limite :** Une étude au lac Balaton décrit un régime comprenant mollusques, crustacés et insectes ; proportions non généralisées.

Habitat indicatif : fond, eau_calme. Activité : a_documenter.

**Proposition de comportement en jeu :** Traction modérée et mouvements latéraux ; peu de sauts, récupération accessible au matériel léger.

Réglages provisoires : burst=0.25 · endurance=0.38 · agility=0.31 · head_shakes=0.28 · cover_seeking=0.12 · slack_pressure=0.50.

Appâts/leurres candidats : ver_vase, asticot, ver_terre. Méthodes candidates : coup, feeder.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FishBase / Specziár, Tölg et Biró 1997 — bio_bordeliere](https://fishbase.se/TrophicEco/DietCompoSummary.php?dietcode=2139&genusname=Blicca&speciesname=bjoerkna).

## Brème commune — `breme-commune`

**Taxon :** Abramis brama. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Fréquente les eaux calmes ou lentes ; consomme notamment insectes, crustacés, mollusques et plantes.

Habitat indicatif : fond, eau_calme, vase. Activité : selon_conditions.

**Proposition de comportement en jeu :** Résistance lourde et régulière, mouvements de flanc et accalmies lisibles.

Réglages provisoires : burst=0.30 · endurance=0.48 · agility=0.23 · head_shakes=0.25 · cover_seeking=0.15 · slack_pressure=0.51.

Appâts/leurres candidats : ver_vase, asticot, ver_terre, mais. Méthodes candidates : coup, feeder, fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_breme](https://doris.ffessm.fr/Especes/Abramis-brama-Breme-commune-237/%28rOffset%29/4).

## Brochet — `brochet`

**Taxon :** Esox lucius. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Prédateur chassant à l'affût dans les plantes aquatiques ; attaque brusque depuis son couvert.

Habitat indicatif : herbiers, abris, eau_calme. Activité : jour.

**Proposition de comportement en jeu :** Premier départ fort, secousses et tentatives de rejoindre un refuge ; protection contre les dents réellement utile.

Réglages provisoires : burst=0.96 · endurance=0.66 · agility=0.73 · head_shakes=0.92 · cover_seeking=0.76 · slack_pressure=0.82.

Appâts/leurres candidats : shad, swimbait, spinnerbait, cuiller_ondulante, poisson_mort. Méthodes candidates : leurre, mort_manie, fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_brochet](https://doris.ffessm.fr/Especes/Esox-lucius-Brochet-366).

## Carassin argenté — `carassin-argente`

**Taxon :** Carassius gibelio. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Taxon distinct du carassin commun ; omnivore consommant végétaux, détritus et petits invertébrés.

Habitat indicatif : eau_calme, fond, herbiers. Activité : selon_conditions.

**Proposition de comportement en jeu :** Départs courts répétés et résistance moyenne ; la taille fait varier la difficulté.

Réglages provisoires : burst=0.39 · endurance=0.45 · agility=0.44 · head_shakes=0.34 · cover_seeking=0.29 · slack_pressure=0.46.

Appâts/leurres candidats : mais, asticot, ver_terre, pain. Méthodes candidates : coup, feeder.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_carassins](https://doris.ffessm.fr/Especes/Carassius-spp.-Carassin-commun-carassin-argente-et-carassin-dore-2552).

## Carassin commun — `carassin`

**Taxon :** Carassius carassius. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore de milieux calmes consommant végétaux et invertébrés, notamment larves de chironomes.

Habitat indicatif : eau_calme, herbiers, fond. Activité : selon_conditions.

**Proposition de comportement en jeu :** Touches discrètes proposées et fuite vers la végétation ; pas de puissance augmentée par une coloration.

Réglages provisoires : burst=0.35 · endurance=0.47 · agility=0.35 · head_shakes=0.33 · cover_seeking=0.37 · slack_pressure=0.44.

Appâts/leurres candidats : ver_vase, mais, asticot, ver_terre. Méthodes candidates : coup, feeder.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_carassins](https://doris.ffessm.fr/Especes/Carassius-spp.-Carassin-commun-carassin-argente-et-carassin-dore-2552).

## Carpe commune — `carpe-commune`

**Taxon :** Cyprinus carpio. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore fouillant le sédiment ; consomme invertébrés et matières végétales. Les formes d'écaillure ne sont pas de nouvelles espèces.

Habitat indicatif : fond, eau_calme, vase, herbiers. Activité : selon_conditions.

**Proposition de comportement en jeu :** Longs départs, phases de pression soutenue et relance près de la berge ; prudence variable selon individu.

Réglages provisoires : burst=0.87 · endurance=0.90 · agility=0.46 · head_shakes=0.41 · cover_seeking=0.70 · slack_pressure=0.42.

Appâts/leurres candidats : mais, bouillette, pellet, wafter, pop_up, pain. Méthodes candidates : carpe, method_feeder, fond, stalking.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_carpe](https://doris.ffessm.fr/Especes/Cyprinus-carpio-Carpe-commune-248/%28rOffset%29/8).

## Chabot commun — `chabot`

**Taxon :** Cottus gobio. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Chasse de petits invertébrés du fond ; les œufs et larves de poissons ne sont pas sa nourriture habituelle selon la référence.

Habitat indicatif : fond, roches, riviere_courante. Activité : aube_crepuscule.

**Proposition de comportement en jeu :** Petits déplacements entre les pierres ; découverte par observation proposée.

Réglages provisoires : burst=0.25 · endurance=0.19 · agility=0.29 · head_shakes=0.30 · cover_seeking=0.91 · slack_pressure=0.35.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_chabot](https://doris.ffessm.fr/Especes/Cottus-gobio-Chabot-commun-241).

## Chevesne / chevaine — `chevesne`

**Taxon :** Squalius cephalus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Régime opportuniste : invertébrés, matières végétales puis davantage de petits poissons chez les grands individus.

Habitat indicatif : riviere_courante, abris, surface. Activité : selon_conditions.

**Proposition de comportement en jeu :** Premier départ rapide depuis la bordure puis résistance latérale ; bonus au choix de présentation, pas à une canne magique.

Réglages provisoires : burst=0.72 · endurance=0.58 · agility=0.71 · head_shakes=0.54 · cover_seeking=0.65 · slack_pressure=0.68.

Appâts/leurres candidats : pain, ver_terre, asticot, petit_poisson_nageur, mouche_seche. Méthodes candidates : coup, fond, leurre, mouche, stalking.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_chevesne](https://doris.ffessm.fr/Especes/Squalius-cephalus-Chevaine-615).

## Corégone / lavaret — groupe à préciser — `coregone`

**Taxon :** Coregonus lavaretus sensu source. **Recherche :** partial. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Le profil consulté consomme surtout du zooplancton et aussi des insectes ; identité des populations locales à confirmer.

Habitat indicatif : lac_froid, pleine_eau. Activité : jour.

**Proposition de comportement en jeu :** Fuite en pleine eau et faibles variations de profondeur ; technique de gambe non activée sans développement spécifique.

Réglages provisoires : burst=0.52 · endurance=0.57 · agility=0.62 · head_shakes=0.45 · cover_seeking=0.10 · slack_pressure=0.68.

Appâts/leurres candidats : nymphe, micro_leurre. Méthodes candidates : gambe, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_coregone](https://doris.ffessm.fr/Especes/Coregone3/%28rOffset%29/4).

## Cristivomer — `cristivomer`

**Taxon :** Salvelinus namaycush. **Recherche :** partial. **Découverte proposée :** capture.

**Faits documentés / limite :** Salmonidé lacustre d'eau froide ; profil de référence nord-américain.

Habitat indicatif : lac_froid, fond, pleine_eau. Activité : selon_conditions.

**Proposition de comportement en jeu :** Résistance profonde et longue remontée ; moins de sauts que les profils de surface dans cette proposition.

Réglages provisoires : burst=0.68 · endurance=0.89 · agility=0.46 · head_shakes=0.55 · cover_seeking=0.21 · slack_pressure=0.49.

Appâts/leurres candidats : shad, cuiller_ondulante, streamer. Méthodes candidates : verticale, traine, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [U.S. Fish & Wildlife Service — bio_cristivomer](https://www.fws.gov/species/lake-trout-salvelinus-namaycush).

## Éperlan d'Europe — `eperlan`

**Taxon :** Osmerus eperlanus. **Recherche :** partial. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Synopsis FAO d'un petit poisson de banc ; les données historiques ne doivent pas être confondues avec l'éperlan arc-en-ciel.

Habitat indicatif : estuaire, pleine_eau, lac_froid. Activité : selon_conditions.

**Proposition de comportement en jeu :** Petite prise de banc et faible effort absolu ; présentation précise à approfondir.

Réglages provisoires : burst=0.34 · endurance=0.22 · agility=0.62 · head_shakes=0.31 · cover_seeking=0.09 · slack_pressure=0.55.

Appâts/leurres candidats : micro_leurre. Méthodes candidates : leurre, gambe.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FAO — bio_eperlan](https://www.fao.org/4/96024e/96024e.pdf).

## Esturgeon sibérien / Baeri — `esturgeon-siberien`

**Taxon :** Acipenser baerii. **Recherche :** partial. **Découverte proposée :** capture.

**Faits documentés / limite :** Profil FAO d'une espèce élevée en aquaculture ; les pellets d'élevage ne constituent pas une preuve d'appât universel.

Habitat indicatif : fond, eau_calme, riviere_courante. Activité : selon_conditions.

**Proposition de comportement en jeu :** Longue traction au fond et virages larges ; envisager d'abord un lieu de pêche aménagé cohérent.

Réglages provisoires : burst=0.70 · endurance=0.95 · agility=0.29 · head_shakes=0.28 · cover_seeking=0.17 · slack_pressure=0.39.

Appâts/leurres candidats : pellet_esturgeon, ver_terre. Méthodes candidates : fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FAO — bio_baeri](https://www.fao.org/fishery/docs/CDrom/aquaculture/I1129m/file/fr/fr_acipenser.htm).

Règles de stade à préserver : [{"stage": "managed_pond", "rule": "Pellet d’élevage lié au contexte géré, pas préférence sauvage automatique."}].

## Esturgeon russe / diamant — `esturgeon-diamant`

**Taxon :** Acipenser gueldenstaedtii. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Recherche la nourriture sur le fond grâce aux barbillons ; les mollusques font partie de son régime adulte.

Habitat indicatif : fond, estuaire. Activité : selon_conditions.

**Proposition de comportement en jeu :** Résistance régulière et lourde ; accès proposé en lieu aménagé, sans confondre avec l'esturgeon européen.

Réglages provisoires : burst=0.67 · endurance=0.96 · agility=0.24 · head_shakes=0.25 · cover_seeking=0.15 · slack_pressure=0.35.

Appâts/leurres candidats : pellet_esturgeon, ver_terre. Méthodes candidates : fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [Caspian Environment Programme / IW:LEARN — bio_diamant](https://archive.iwlearn.net/caspianenvironment.org/CaspBIS/Taxons/Taxon8254.html?taxonid=4).

## Esturgeon européen — `esturgeon-europeen`

**Taxon :** Acipenser sturio. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Poisson amphihalin vivant sur le fond ; recherche des invertébrés avec rostre et barbillons.

Habitat indicatif : fond, estuaire, riviere_migratoire. Activité : selon_stade.

**Proposition de comportement en jeu :** Découverte d'observation proposée ; aucun classement comme trophée ordinaire à partir de la seule rareté.

Réglages provisoires : burst=0.74 · endurance=0.96 · agility=0.26 · head_shakes=0.20 · cover_seeking=0.16 · slack_pressure=0.35.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_europeen](https://doris.ffessm.fr/Especes/Acipenser-sturio-Esturgeon-europeen-1321).

## Gardon — `gardon`

**Taxon :** Rutilus rutilus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore ; les adultes consomment beaucoup de végétaux. Activité alimentaire surtout diurne et réduite au froid.

Habitat indicatif : eau_calme, pleine_eau, herbiers. Activité : jour.

**Proposition de comportement en jeu :** Petites touches successives et fuite latérale ; les gros spécimens prolongent le combat sans devenir une autre espèce.

Réglages provisoires : burst=0.39 · endurance=0.30 · agility=0.59 · head_shakes=0.34 · cover_seeking=0.18 · slack_pressure=0.56.

Appâts/leurres candidats : asticot, pinkie, ver_vase, pain, chenevis. Méthodes candidates : coup, anglaise, feeder.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_gardon](https://doris.ffessm.fr/Especes/Rutilus-rutilus-Gardon-289/%28rOffset%29/1).

## Goujon — identification locale à contrôler — `goujon`

**Taxon :** Gobio gobio sensu source. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Fouille le fond pour consommer larves, crustacés, vers et mollusques.

Habitat indicatif : fond, riviere_courante, gravier. Activité : selon_conditions.

**Proposition de comportement en jeu :** Touches basses et courtes résistances près du fond ; le complexe de goujons doit être confirmé dans le catalogue source.

Réglages provisoires : burst=0.23 · endurance=0.23 · agility=0.35 · head_shakes=0.21 · cover_seeking=0.41 · slack_pressure=0.35.

Appâts/leurres candidats : ver_vase, petit_ver, asticot. Méthodes candidates : coup, toc.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_goujon](https://doris.ffessm.fr/Especes/Gobio-gobio-Goujon-363).

## Hotu / nase — `hotu`

**Taxon :** Chondrostoma nasus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Broute les diatomées fixées aux cailloux et galets ; les jeunes sont moins spécialisés.

Habitat indicatif : fond, riviere_courante, gravier. Activité : selon_conditions.

**Proposition de comportement en jeu :** Traction dans le courant et déplacements bas ; éviter de le traiter comme un carnassier au shad.

Réglages provisoires : burst=0.56 · endurance=0.76 · agility=0.39 · head_shakes=0.27 · cover_seeking=0.28 · slack_pressure=0.40.

Appâts/leurres candidats : asticot, chenevis. Méthodes candidates : coup, feeder.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_hotu](https://doris.ffessm.fr/Especes/Chondrostoma-nasus-Hotu-2164/%28rOffset%29/8).

## Huchon — `huchon`

**Taxon :** Hucho hucho. **Recherche :** documented. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Salmonidé d'eau courante froide et oxygénée ; prédateur de grandes proies animales selon la synthèse.

Habitat indicatif : riviere_courante, abris, fond. Activité : selon_conditions.

**Proposition de comportement en jeu :** Départ lourd et soutenu dans le courant ; lieu et matériel spécialisé requis avant activation.

Réglages provisoires : burst=0.90 · endurance=0.93 · agility=0.54 · head_shakes=0.67 · cover_seeking=0.58 · slack_pressure=0.65.

Appâts/leurres candidats : swimbait, streamer. Méthodes candidates : leurre, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FishBase — bio_huchon](https://www.fishbase.se/Ecology/Hucho_hucho).

## Ide mélanote — `ide-melanote`

**Taxon :** Leuciscus idus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Les jeunes consomment beaucoup de végétaux ; les adultes prennent invertébrés et parfois petits poissons.

Habitat indicatif : riviere_courante, eau_calme, pleine_eau. Activité : selon_conditions.

**Proposition de comportement en jeu :** Fuite en pleine eau plus soutenue qu'un gardon ; varier l'intérêt pour petites esches et artificiels selon le gabarit.

Réglages provisoires : burst=0.63 · endurance=0.61 · agility=0.60 · head_shakes=0.38 · cover_seeking=0.38 · slack_pressure=0.54.

Appâts/leurres candidats : pain, asticot, ver_terre, mouche_seche, micro_leurre. Méthodes candidates : coup, feeder, mouche, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_ide](https://doris.ffessm.fr/Especes/Leuciscus-idus-Ide-melanote-2167/%28rOffset%29/6).

## Lamproie de Planer — `lamproie-de-planer`

**Taxon :** Lampetra planeri. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Les larves filtrent des micro-organismes ; après métamorphose, l'individu ne s'alimente plus.

Habitat indicatif : fond, riviere_courante, vase. Activité : selon_stade.

**Proposition de comportement en jeu :** Observation uniquement dans cette conception ; pas de morsure au ver inventée pour l'adulte.

Réglages provisoires : burst=0.00 · endurance=0.00 · agility=0.00 · head_shakes=0.00 · cover_seeking=0.00 · slack_pressure=0.00.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_lamproie_planer](https://doris.ffessm.fr/Especes/Lampetra-planeri-Lamproie-de-Planer-1636).

Règles de stade à préserver : [{"stage": "larva", "feeding": "filtering"}, {"stage": "adult", "hunger_bite_rate": 0}].

## Lamproie fluviatile — `lamproie-fluviatile`

**Taxon :** Lampetra fluviatilis. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Larve filtrante ; phase adulte parasitaire en mer. Le cycle ne correspond pas à une pêche ordinaire aux esches.

Habitat indicatif : fond, estuaire, riviere_migratoire. Activité : selon_stade.

**Proposition de comportement en jeu :** Observation et explication du cycle dans le FishDex ; mécanique dédiée seulement si documentée ultérieurement.

Réglages provisoires : burst=0.00 · endurance=0.00 · agility=0.00 · head_shakes=0.00 · cover_seeking=0.00 · slack_pressure=0.00.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_lamproie_fluviatile](https://doris.ffessm.fr/Especes/Lampetra-fluviatilis-Lamproie-de-riviere-1122).

Règles de stade à préserver : [{"stage": "adult", "feeding": "parasitic_not_standard_bait_search"}].

## Loche franche — `loche-franche`

**Taxon :** Barbatula barbatula. **Recherche :** documented. **Découverte proposée :** observation.

**Faits documentés / limite :** Recherche de nuit de petits animaux vivant sur le fond, à l'aide de ses barbillons.

Habitat indicatif : fond, roches, riviere_courante. Activité : nuit.

**Proposition de comportement en jeu :** Petits déplacements entre les pierres ; découverte naturaliste proposée plutôt que combat surdimensionné.

Réglages provisoires : burst=0.20 · endurance=0.24 · agility=0.32 · head_shakes=0.25 · cover_seeking=0.87 · slack_pressure=0.33.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_loche](https://doris.ffessm.fr/Especes/Barbatula-barbatula-Loche-franche-269).

## Lotte de rivière — `lotte`

**Taxon :** Lota lota. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Adulte carnassier consommant poissons et petits animaux de fond ; biologie associée aux eaux froides.

Habitat indicatif : fond, abris, lac_froid. Activité : a_documenter.

**Proposition de comportement en jeu :** Reste basse, traction lourde et tentatives de rejoindre les abris ; proposer une activité accrue de nuit à tester.

Réglages provisoires : burst=0.46 · endurance=0.75 · agility=0.41 · head_shakes=0.43 · cover_seeking=0.83 · slack_pressure=0.40.

Appâts/leurres candidats : ver_terre, morceau_poisson, poisson_mort. Méthodes candidates : fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_lotte](https://doris.ffessm.fr/Especes/Lota-lota-Lotte-de-riviere-204).

## Mulet-porc — `mulet-porc`

**Taxon :** Chelon ramada. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore adulte consommant notamment biofilm et matière organique benthique ; recherche alimentaire diurne.

Habitat indicatif : estuaire, fond, surface. Activité : jour.

**Proposition de comportement en jeu :** Approche prudente proposée puis longue fuite ; poisson d'estuaire et de rivière, pas résident universel d'un étang.

Réglages provisoires : burst=0.81 · endurance=0.84 · agility=0.65 · head_shakes=0.44 · cover_seeking=0.33 · slack_pressure=0.65.

Appâts/leurres candidats : pain, petit_ver. Méthodes candidates : anglaise, fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_mulet](https://doris.ffessm.fr/Especes/Chelon-ramada-Mulet-porc-1985).

## Omble chevalier — `omble-chevalier`

**Taxon :** Salvelinus alpinus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Poisson d'eaux fraîches consommant crustacés planctoniques, mollusques, larves et alevins.

Habitat indicatif : lac_froid, pleine_eau. Activité : selon_conditions.

**Proposition de comportement en jeu :** Alternance de plongées et traversées ; présentation à la bonne couche d'eau déterminante.

Réglages provisoires : burst=0.62 · endurance=0.69 · agility=0.62 · head_shakes=0.48 · cover_seeking=0.19 · slack_pressure=0.58.

Appâts/leurres candidats : nymphe, cuiller_ondulante, streamer. Méthodes candidates : mouche, leurre, verticale.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_omble_chevalier](https://doris.ffessm.fr/Especes/Salvelinus-alpinus-Omble-chevalier-1751/%28rOffset%29/18).

## Omble de fontaine — `omble-de-fontaine`

**Taxon :** Salvelinus fontinalis. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Vit en eaux fraîches et oxygénées ; régime surtout invertébré complété par œufs, alevins et petites proies.

Habitat indicatif : riviere_courante, lac_froid, abris. Activité : selon_conditions.

**Proposition de comportement en jeu :** Départs courts, changements de direction et retour vers les caches ; ne pas copier exactement l'arc-en-ciel.

Réglages provisoires : burst=0.66 · endurance=0.50 · agility=0.73 · head_shakes=0.61 · cover_seeking=0.58 · slack_pressure=0.71.

Appâts/leurres candidats : ver_terre, nymphe, mouche_seche, cuiller_tournante. Méthodes candidates : toc, mouche, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_omble_fontaine](https://doris.ffessm.fr/Especes/Salvelinus-fontinalis-Omble-de-fontaine-1657).

## Ombre commun — `ombre`

**Taxon :** Thymallus thymallus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Consomme de petites proies du fond et en dérive ; peut gober les insectes émergents.

Habitat indicatif : riviere_courante, fond, surface. Activité : selon_conditions.

**Proposition de comportement en jeu :** Résistance dans la veine d'eau et virages larges ; touches sur dérive naturelle plutôt que gros leurres automatiques.

Réglages provisoires : burst=0.54 · endurance=0.67 · agility=0.66 · head_shakes=0.51 · cover_seeking=0.22 · slack_pressure=0.62.

Appâts/leurres candidats : nymphe, mouche_seche, mouche_noyee. Méthodes candidates : mouche, toc.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_ombre](https://doris.ffessm.fr/Especes/Thymallus-thymallus-Ombre-commun-2169/%28rOffset%29/12).

## Perche fluviatile — `perche`

**Taxon :** Perca fluviatilis. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Carnassier souvent en banc, grands sujets plus solitaires ; régime devenant piscivore avec la taille et chasse visuelle.

Habitat indicatif : abris, pleine_eau, herbiers. Activité : jour_aube_crepuscule.

**Proposition de comportement en jeu :** Succession d'accélérations courtes et secousses rapides ; faible endurance relative mais gros sujets réellement plus forts.

Réglages provisoires : burst=0.62 · endurance=0.40 · agility=0.75 · head_shakes=0.77 · cover_seeking=0.49 · slack_pressure=0.74.

Appâts/leurres candidats : petit_ver, shad, micro_leurre, cuiller_tournante. Méthodes candidates : coup, leurre, verticale.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_perche](https://doris.ffessm.fr/Especes/Perca-fluviatilis-Perche-330).

## Perche-soleil — `perche-soleil`

**Taxon :** Lepomis gibbosus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Chasse à vue de jour ; consomme de petites proies aquatiques variées.

Habitat indicatif : bordure, herbiers, eau_calme. Activité : jour.

**Proposition de comportement en jeu :** Touches brèves près des bordures et petits virages serrés ; pas de longue lutte pour un minuscule poisson.

Réglages provisoires : burst=0.37 · endurance=0.27 · agility=0.57 · head_shakes=0.45 · cover_seeking=0.47 · slack_pressure=0.54.

Appâts/leurres candidats : petit_ver, asticot, micro_leurre. Méthodes candidates : coup, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_soleil](https://doris.ffessm.fr/Especes/Lepomis-gibbosus-Perche-soleil-287/).

## Poisson-chat — `poisson-chat`

**Taxon :** Ameiurus melas. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore de fond consommant de nombreuses ressources animales et végétales ; activité surtout nocturne.

Habitat indicatif : fond, vase, eau_calme. Activité : nuit.

**Proposition de comportement en jeu :** Résistance basse et régulière ; ne pas le rendre aussi puissant qu'un grand silure à poids comparable sans justification.

Réglages provisoires : burst=0.34 · endurance=0.45 · agility=0.29 · head_shakes=0.37 · cover_seeking=0.61 · slack_pressure=0.36.

Appâts/leurres candidats : ver_terre, asticot, mais. Méthodes candidates : fond, feeder, coup.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_chat](https://doris.ffessm.fr/Especes/Ameiurus-melas-Poisson-chat-990/%28rOffset%29/1).

## Pseudorasbora — `pseudorasbora`

**Taxon :** Pseudorasbora parva. **Recherche :** partial. **Découverte proposée :** observation.

**Faits documentés / limite :** La synthèse consultée indique une alimentation surtout animale ; données locales et rythme d'activité à compléter.

Habitat indicatif : eau_calme, bordure. Activité : a_documenter.

**Proposition de comportement en jeu :** Observation de petits bancs ; aucune préférence détaillée d'appât affirmée par cette recherche partielle.

Réglages provisoires : burst=0.18 · endurance=0.13 · agility=0.46 · head_shakes=0.20 · cover_seeking=0.23 · slack_pressure=0.47.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [FishBase — bio_pseudorasbora](https://www.fishbase.se/Ecology/Pseudorasbora_parva).

## Rotengle — `rotengle`

**Taxon :** Scardinius erythrophthalmus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore avec préférence végétale plus marquée chez les adultes ; alimentation réduite au froid.

Habitat indicatif : herbiers, surface, eau_calme. Activité : selon_conditions.

**Proposition de comportement en jeu :** Touches hautes proposées et fuite vers les herbiers ; distinguer sa présentation préférée de celle du gardon.

Réglages provisoires : burst=0.42 · endurance=0.37 · agility=0.64 · head_shakes=0.33 · cover_seeking=0.54 · slack_pressure=0.60.

Appâts/leurres candidats : pain, asticot, mouche_seche. Méthodes candidates : coup, anglaise, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_rotengle](https://doris.ffessm.fr/Especes/Scardinius-erythrophthalmus-Rotengle-1078).

## Sandre — `sandre`

**Taxon :** Sander lucioperca. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Chasse petits poissons et écrevisses ; vision adaptée aux eaux troubles ou peu lumineuses.

Habitat indicatif : fond, pleine_eau, abris. Activité : faible_lumiere.

**Proposition de comportement en jeu :** Première traction nette, secousses et maintien en profondeur ; le géant reste un gabarit, pas un nouveau taxon.

Réglages provisoires : burst=0.69 · endurance=0.61 · agility=0.48 · head_shakes=0.77 · cover_seeking=0.46 · slack_pressure=0.65.

Appâts/leurres candidats : shad, finesse, poisson_mort, morceau_poisson. Méthodes candidates : leurre, verticale, fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_sandre](https://doris.ffessm.fr/Especes/Sander-lucioperca-Sandre-290).

## Saumon atlantique — `saumon-atlantique`

**Taxon :** Salmo salar. **Recherche :** documented. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Les adultes se nourrissent en mer et cessent de s'alimenter lors du retour dans leur rivière.

Habitat indicatif : riviere_migratoire, estuaire. Activité : selon_stade.

**Proposition de comportement en jeu :** Longs départs et changements de profondeur ; réaction aux artificiels en remontée séparée de l'attraction alimentaire.

Réglages provisoires : burst=0.91 · endurance=0.94 · agility=0.84 · head_shakes=0.73 · cover_seeking=0.22 · slack_pressure=0.80.

Appâts/leurres candidats : mouche_noyee, streamer, cuiller_ondulante. Méthodes candidates : mouche, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_saumon](https://doris.ffessm.fr/Especes/Salmo-salar-Saumon-769).

Règles de stade à préserver : [{"stage": "adult_reproductive_return", "hunger_bite_rate": 0, "reaction_to_artificial": "separate_specialist_system_needs_validation"}].

## Saumon royal / Chinook — `saumon-roi`

**Taxon :** Oncorhynchus tshawytscha. **Recherche :** partial. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Saumon anadrome du Pacifique ; l'écologie ne doit pas être copiée du saumon atlantique sans contexte.

Habitat indicatif : riviere_migratoire, estuaire. Activité : selon_stade.

**Proposition de comportement en jeu :** Départ puissant et effort long ; espace nord-américain futur, pas mélange automatique avec l'étang initial.

Réglages provisoires : burst=0.95 · endurance=0.97 · agility=0.60 · head_shakes=0.66 · cover_seeking=0.22 · slack_pressure=0.71.

Appâts/leurres candidats : cuiller_ondulante, streamer. Méthodes candidates : leurre, mouche, traine.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [NOAA Fisheries — bio_saumon_roi](https://www.fisheries.noaa.gov/species/chinook-salmon).

## Silure glane — `silure-glane`

**Taxon :** Silurus glanis. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Prédateur opportuniste surtout nocturne, consommant poissons et autres animaux ; les jeunes prennent de petits invertébrés.

Habitat indicatif : fond, abris, pleine_eau. Activité : nuit_crepuscule.

**Proposition de comportement en jeu :** Forte pression prolongée, larges virages et plongées ; aucune vitesse maximale exagérée dérivée de sa taille seule.

Réglages provisoires : burst=0.90 · endurance=0.98 · agility=0.30 · head_shakes=0.49 · cover_seeking=0.80 · slack_pressure=0.36.

Appâts/leurres candidats : ver_terre, morceau_poisson, poisson_mort, gros_shad. Méthodes candidates : fond, leurre, verticale, clonk.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_silure](https://doris.ffessm.fr/Especes/Silurus-glanis-Silure-glane-364).

## Spirlin — `spirlin`

**Taxon :** Alburnoides bipunctatus. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Se nourrit de petites proies transportées par le courant et d'insectes pris en surface.

Habitat indicatif : riviere_courante, pleine_eau, surface. Activité : jour.

**Proposition de comportement en jeu :** Toucher bref pendant la dérive puis fuite courte dans le courant.

Réglages provisoires : burst=0.38 · endurance=0.26 · agility=0.73 · head_shakes=0.29 · cover_seeking=0.16 · slack_pressure=0.62.

Appâts/leurres candidats : pinkie, asticot, mouche_seche, nymphe. Méthodes candidates : coup, toc, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_spirlin](https://doris.ffessm.fr/Especes/Alburnoides-bipunctatus-Spirlin-2163).

## Tanche — `tanche`

**Taxon :** Tinca tinca. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Omnivore fouillant vase et herbiers ; recherche de nourriture accrue au crépuscule et la nuit.

Habitat indicatif : fond, vase, herbiers, eau_calme. Activité : crepuscule_nuit.

**Proposition de comportement en jeu :** Résistance lourde en cercles et recherche d'herbiers proposées ; les touches peuvent demander une lecture fine du flotteur.

Réglages provisoires : burst=0.56 · endurance=0.75 · agility=0.34 · head_shakes=0.36 · cover_seeking=0.89 · slack_pressure=0.38.

Appâts/leurres candidats : ver_terre, ver_vase, mais, pellet. Méthodes candidates : coup, feeder, fond.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_tanche](https://doris.ffessm.fr/Especes/Tinca-tinca-Tanche-249/%28rOffset%29/15).

## Toxostome — `toxostome`

**Taxon :** Parachondrostoma toxostoma. **Recherche :** documented. **Découverte proposée :** specialist_future.

**Faits documentés / limite :** Racle algues et diatomées des substrats et consomme des micro-invertébrés associés.

Habitat indicatif : fond, riviere_courante, gravier. Activité : selon_conditions.

**Proposition de comportement en jeu :** Petite résistance de fond ; acquisition d'une fiche par observation possible avant une technique ciblée.

Réglages provisoires : burst=0.37 · endurance=0.49 · agility=0.41 · head_shakes=0.23 · cover_seeking=0.26 · slack_pressure=0.39.

Appâts/leurres candidats : asticot. Méthodes candidates : coup.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_toxostome](https://doris.ffessm.fr/Especes/Toxostome3/%28rOffset%29/fiche_fiche.asp?fiche_numero=2164).

## Truite arc-en-ciel — `truite-arc-en-ciel`

**Taxon :** Oncorhynchus mykiss. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Consomme invertébrés et petites proies animales ; recherche alimentaire principalement diurne.

Habitat indicatif : riviere_courante, lac_froid, pleine_eau. Activité : jour.

**Proposition de comportement en jeu :** Changements de direction rapides et sauts pondérés ; pâte à truite liée aux lieux adaptés, pas appât naturel universel.

Réglages provisoires : burst=0.79 · endurance=0.65 · agility=0.88 · head_shakes=0.79 · cover_seeking=0.38 · slack_pressure=0.85.

Appâts/leurres candidats : ver_terre, pate_truite, nymphe, mouche_seche, cuiller_tournante. Méthodes candidates : toc, mouche, leurre, bombette.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_arc](https://doris.ffessm.fr/Especes/Oncorhynchus-mykiss-Truite-arc-en-ciel-2308).

## Truite commune — formes rivière, lac et mer — `truite-fario`

**Taxon :** Salmo trutta. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Le profil de rivière consomme invertébrés et davantage de poissons avec l'âge ; contexte lac/mer à documenter séparément.

Habitat indicatif : riviere_courante, abris, lac_froid. Activité : selon_conditions.

**Proposition de comportement en jeu :** Départ vers les caches, retour dans le courant et secousses ; profil de rivière ne suffit pas aux formes migratrices et lacustres.

Réglages provisoires : burst=0.80 · endurance=0.67 · agility=0.79 · head_shakes=0.73 · cover_seeking=0.83 · slack_pressure=0.77.

Appâts/leurres candidats : ver_terre, nymphe, mouche_seche, streamer, cuiller_tournante. Méthodes candidates : toc, mouche, leurre.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_fario](https://doris.ffessm.fr/Especes/Salmo-trutta-fario-Truite-de-riviere-388/%28rOffset%29/8).

## Vairon — complexe à contrôler — `vairon`

**Taxon :** Phoxinus phoxinus sensu source. **Recherche :** documented. **Découverte proposée :** capture.

**Faits documentés / limite :** Petit omnivore d'eaux fraîches consommant animaux aquatiques, insectes et matières végétales.

Habitat indicatif : riviere_courante, bordure, lac_froid. Activité : selon_conditions.

**Proposition de comportement en jeu :** Combat très bref et petites oscillations ; taxon local à confirmer au lieu de forcer tous les vairons dans un seul nom.

Réglages provisoires : burst=0.27 · endurance=0.14 · agility=0.66 · head_shakes=0.24 · cover_seeking=0.41 · slack_pressure=0.54.

Appâts/leurres candidats : pinkie, petit_ver. Méthodes candidates : coup, toc.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_vairon](https://doris.ffessm.fr/Especes/Phoxinus-phoxinus-Vairon-1656).

## Vandoise — `vandoise`

**Taxon :** Leuciscus leuciscus. **Recherche :** partial. **Découverte proposée :** capture.

**Faits documentés / limite :** Poisson de rivière traité dans la fiche DORIS ; alimentation précise à compléter dans le profil d'intégration.

Habitat indicatif : riviere_courante, pleine_eau. Activité : a_documenter.

**Proposition de comportement en jeu :** Petite fuite dans le courant et touche en dérive ; préférences initiales de jeu à confirmer.

Réglages provisoires : burst=0.42 · endurance=0.33 · agility=0.66 · head_shakes=0.31 · cover_seeking=0.18 · slack_pressure=0.55.

Appâts/leurres candidats : asticot, mouche_seche. Méthodes candidates : coup, mouche.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_vandoise](https://doris.ffessm.fr/ref/specie/2166).

## Gobie — espèce à identifier — `gobie-a-identifier`

**Taxon :** À identifier. **Recherche :** identity_pending. **Découverte proposée :** identity_pending.

**Faits documentés / limite :** Le nom de fichier ne suffit pas à distinguer les différentes espèces de gobies.

Habitat indicatif : À préciser. Activité : À préciser.

**Proposition de comportement en jeu :** Aucun profil de combat activé avant identification du taxon dans FishDex.

Réglages provisoires : burst=0.00 · endurance=0.00 · agility=0.00 · head_shakes=0.00 · cover_seeking=0.00 · slack_pressure=0.00.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : Identification nécessaire avant recherche de comportement..

## Sandre doré — identité à contrôler — `sandre-dore-a-identifier`

**Taxon :** À identifier. **Recherche :** identity_pending. **Découverte proposée :** identity_pending.

**Faits documentés / limite :** Peut désigner Sander vitreus ou une apparence du sandre européen ; vérifier le catalogue source, pas seulement l'image.

Habitat indicatif : À préciser. Activité : À préciser.

**Proposition de comportement en jeu :** Si Sander vitreus est confirmé, créer un profil nord-américain distinct ; sinon rattacher l'apparence au taxon correct.

Réglages provisoires : burst=0.00 · endurance=0.00 · agility=0.00 · head_shakes=0.00 · cover_seeking=0.00 · slack_pressure=0.00.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : [DORIS / FFESSM — bio_dore](https://doris.ffessm.fr/Especes/Sander-vitreus-Dore-jaune-1503/%28rOffset%29/11).

## Silure mandarin — identité à contrôler — `silure-mandarin-a-identifier`

**Taxon :** À identifier. **Recherche :** identity_pending. **Découverte proposée :** identity_pending.

**Faits documentés / limite :** Le nom commercial ou artistique ne permet pas d'établir un taxon et une alimentation.

Habitat indicatif : À préciser. Activité : À préciser.

**Proposition de comportement en jeu :** Ne pas recopier le silure glane et inventer une nouvelle espèce.

Réglages provisoires : burst=0.00 · endurance=0.00 · agility=0.00 · head_shakes=0.00 · cover_seeking=0.00 · slack_pressure=0.00.

Appâts/leurres candidats : Aucun attribué. Méthodes candidates : À définir.

**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.

Sources : Identification nécessaire avant recherche de comportement..

