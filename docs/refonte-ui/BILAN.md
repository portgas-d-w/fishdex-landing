# Bilan des quatre refontes FishDex

4 octobre 2026 · Codex · Basalte & Turquoise · 0.14.0. Lots réalisés successivement, avec conservation des contrats, catalogue et sauvegardes v7. Aucun modèle généré, abonnement, moteur ou dépendance ajouté. Les chantiers eau/assets gardent leurs sources et anciens justificatifs.

| Lot | Résultat concret | Contrôles au terme du lot | Commit |
|---|---|---|---|
| 01 Matériel/Boutique | Ma canne, montage schématisé, sac par familles, kit gratuit, ensembles et achats expliqués ; sous-fiche de pièce distincte et retours conservés | 205 tests + TS/build, 12 Chromium ; 320/390/430/paysage/bureau, stocks/achats/réparation | d4d2d95 |
| 02 FishDex | 66 identités, inconnus masqués sans fuite de nom, filtres habitat/formes, fiches et conseils réellement éligibles ; préparation explicite, nouveautés de session | 207 tests + TS/build, 12 Chromium ; gardon découvert, filtres/recharge, consultation sans trajet ni débit | df0f70e |
| 03 Progression/Exploration | Objectif suivi, chemins alternatifs réels, 22 profils, badges, six postes locaux et neuf destinations ; liens vers habitats observables | 210 tests + TS/build, 14 Chromium ; migration et deux captures gestuelles accélérées QA, déblocage permanent et initiation | aa91fc8 |
| 04 Carnet/Aquarium/Aide | Prises/observations, recherche et photos explicites ; bassin central, cinq individus/remplacement/décor ; réglages séparés, aide spécifique et accueil organisé | 211 tests + TS/build ; transversal 32/32, finitions 18/18, TEST/eau/assets 4/4, cycle aquarium 4/4 | 4a1d9d7 + correctif d8bc998 |

Les séries ciblées recouvrent des scénarios de la série transversale ; ne pas additionner ces chiffres comme des tests uniques. Correction complémentaire de sélection dans le test de revue : 78955c8, application inchangée. Correction aquarium : suspension dès sa reconstruction sous un panneau, aucun frame forcé quand suspendu ; compteur stable puis reprise, sans modifier les favoris.

## Captures et passations par lot

- 01 : [relais](01_MATERIEL_BOUTIQUE/RELAIS_A_COMPLETER.md), [avant](../apercus/refonte-ui/avant/mobile-vierge-preparation.png), [après](../apercus/refonte-ui/01-apres/mobile-vierge-preparation.png).
- 02 : [relais](02_FISHDEX/RELAIS_A_COMPLETER.md), [avant](../apercus/refonte-ui/avant/mobile-vierge-encyclopedia.png), [après](../apercus/refonte-ui/02-apres/mobile-vierge-encyclopedia.png), [fiche découverte](../apercus/refonte-ui/02-apres/mobile-gardon-decouvert.png).
- 03 : [relais](03_PROGRESSION_EXPLORATION/RELAIS_A_COMPLETER.md), [avant](../apercus/refonte-ui/avant/mobile-vierge-progression.png), [après](../apercus/refonte-ui/03-apres/mobile-vierge-progression.png), [poste verrouillé](../apercus/refonte-ui/03-apres/mobile-riviere-verrouillee.png).
- 04 : [relais](04_CARNET_AQUARIUM_AIDE/RELAIS_A_COMPLETER.md), [carnet avant](../apercus/refonte-ui/public-avant/mobile-avance-collection.png), [carnet après](../apercus/refonte-ui/public-apres/mobile-avance-collection.png), [aquarium avant](../apercus/refonte-ui/public-avant/mobile-avance-aquarium.png), [aquarium après](../apercus/refonte-ui/public-apres/mobile-avance-aquarium.png), [réglages](../apercus/refonte-ui/04-apres/mobile-390-reglages.png), [erreur WebGL et favoris 2D](../apercus/refonte-ui/04-apres/mobile-aquarium-erreur-2d.png).

Les dossiers avant/01-apres/02-apres/03-apres/04-apres comprennent aussi le bureau et états vierges/avancés. Les premières fixtures avancées ont droits/monnaie, sans prises ; la comparaison publique finale utilise exactement trois souvenirs et une favorite, mêmes données, poste/caméra/ambiance par défaut et formats 1440×900 / 390×844. Aucun historique personnel utilisé. Photos/captures artificiellement préparées pour les fixtures sont distinguées des prises naturelles du smoke public.

## Parcours transversaux réellement contrôlés

| Parcours ou état | Résultat et preuve |
|---|---|
| FishDex → habitat/poste → préparation → retour | Conservation de la recherche et fiche ; consultation sans trajet ni débit, installation/application explicites ; ui-refonte/structure et smoke ui-review |
| Boutique → composant/équipement → montage/ensemble | Confirmation, quantité, stock et incompatibilité ; ensemble incomplet et secours préservant original ; tackle/structure |
| Objectif → déblocage → matériel | Suivi persistant, seuils OR vérifiés contre droits réels ; deux captures QA puis initiation, leurre et achat/canne persistés ; ui-advice/journey/structure |
| Carnet → fiche/favori → aquarium → remplacement/retrait | Individus distincts, limite cinq, carnet intact, reload et décoration achetée ; memories/aquarium |
| Aide d’une pièce → retour au montage | Retour à sa sous-fiche puis sélecteur ; focus restitué, 22 leçons et côtés issus des profils/réglages ; memories/ui-refonte |
| Sauvegarde invalide / ancienne / import-export | Validation avant mutation, confirmation et annulation, recovery conservée, v7/IDs/droits ; node tests, graphics/memories et smoke production |
| Ressource absente et WebGL indisponible | Libellé de remplacement, menus accessibles, favoris 2D conservés et réessai ; aquarium/memories |
| Mode test public | ∞, profil/photos séparés, achats avec stocks/règles conservés et retour normal ; development, smoke ui-review/map-water |
| Gestes et pause | Deux commandes indépendantes et interruptions, callbacks de rendu suspendus sous panneaux ; structure/aquarium/memories |

## Publication, mesures et points restants

[Publication et procédure téléphone](PUBLICATION.md) : identité vérifiée, revue avant production, empreintes et contrôle public sans token ni QA ; retour arrière conservé. Script reproductible : `node --experimental-strip-types scripts/capture-ui-review.mjs https://www.fishdex.fr public-apres` (profil isolé, fixtures de revue, pas la sauvegarde du navigateur utilisateur). Ne pas l’exécuter contre un ancien site sans conserver le dossier de comparaison souhaité.

Aucun point UI connu bloqué. Les contextes étrangers restent ceux réellement simulés et leurs aperçus sans photo sont signalés. Les formes sans asset exact gardent la présentation provisoire du chantier précédent. Les menus issus du Menu y reviennent ; les raccourcis de scène Matériel/Carte retournent à la pêche pour conserver le contrat direct existant.

Aucun essai physique iPhone 14 Pro/Safari : sensations de glissement/deux doigts, double toucher, clavier virtuel, VoiceOver, safe areas matérielles, rotation/verrouillage, audio, transfert de fichier iOS, chauffe, mémoire et FPS restent à contrôler. L’émulation Chromium valide les dispositions et les événements automatisés, sans certifier 30 FPS sur appareil. Les préférences de réduction des mouvements sont exercées ; pas de tutoriel interactif simulé inventé.
