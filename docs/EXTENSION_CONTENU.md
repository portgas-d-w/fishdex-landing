# Extension du contenu — 0.5.0

Les catalogues statiques restent dans src/game ; les règles ne dépendent pas du DOM ou de Babylon. GameScreens lit les catalogues, crée les catégories/fiches et réutilise les états. FishingGame, recordCatch et les rendus restent les systèmes existants.

## Espèce et ressource

Exemple réel : roach / Rutilus rutilus → modèle Roach.glb, illustration /encyclopedia/gardon.webp. Ajouter un ID stable à SpeciesId et une entrée SPECIES dans catalog.ts ; enregistrer le binôme biologique et gameId dans fishdex.json, la formule de poids dans specimens.ts et la récompense de base dans economy.ts. Définir ses pondérations dans catalog.ts, son intervalle de tailles/force et son lien VISUALS dans render/appearance.ts. Livrer le GLB optimisé et actualiser models/manifest.json. Append à la fin du catalogue FishDex pour conserver les numéros existants ; ne réordonner ni réutiliser les IDs publiés. Le Dex, carnet, filtres, badge diversité et aquarium lisent ces données sans nouvelle route ou panneau. Ne pas rendre une fiche future jouable avant la disponibilité de son modèle et de ses règles. Les parcours modèles testent toutes les espèces disponibles.

Remplacer seulement VISUALS[id].model et le fichier associé conserve journal, favoris et progression. Le modèle n'est pas l'identité enregistrée. Référence 3D/photos/illustrations dans docs/ASSETS_STRUCTURE.md.

## Forme et coloration

Exemples actuels : forme common, coloration natural/golden et état exceptionnel mirage. VariantKey assemble espèce:forme:coloration:exceptionnel ; individu ID et gabarit restent séparés. Une nouvelle forme exige un ID, un tirage contrôlé dans FishingGame, l'acceptation par le schéma de specimens/save, une apparence réellement disponible et une entrée liée au même biologicalId. Une fiche carpe miroir ou trophée est actuellement « À venir », pas une espèce supplémentaire ni une variante capturable fictive. Ajouter une coloration réelle exige aussi applyAppearance et un test de fidélité photo/aquarium. La fiche Dex lit les formes de référence et les apparences enregistrées séparément.

## Objet et décoration

Exemple réel acheté : ITEMS.rocks, 40 écus, décoration ; GEAR le dérive automatiquement. Ajouter l'ID dans ITEMS avec prix/propriétés, puis sa famille et ses compatibles dans GEAR lorsque nécessaire. L'inventaire, la boutique, l'import et les boutons utilisent ces IDs. accessLevel centralise les seuils ; possession prévaut pour préserver le matériel des anciennes sauvegardes. Les objets de base sont inclus dans starter, sans monnaie ni consommation. Une fiche future peut être ajoutée uniquement dans GEAR avec state: future ; elle apparaît dans sa famille sans bouton d'achat. Exemple nouvellement intégré et testé : future-feeder, famille feeder, méthode feeder, état future.

Pour une décoration jouable, ajouter aussi son choix validé au schéma aquarium et sa géométrie/visibilité dans Aquarium.customize ; tester achat, activation, rechargement. Exemple réel : plants, 35 écus, transform purchased-plants activé uniquement après achat. Ne jamais activer « available » pour un décor sans effet de rendu.

## Technique et montage

Exemple réel METHODS.bottom : bait worm, slots rod/reel/line/leader/hook/rig/weight/bait/landing, sans flotteur. Ajouter une définition METHODS, les GEAR compatibles et la famille manquante dans FAMILIES. Une technique future se construit avec available:false (feeder/fly existent) ; fiche et emplacements sont visibles et aucune commande de lancer n'est activée. La rendre jouable exige MethodId, le schéma de préparation/import, setMethod, l'attente/touche et ses rencontres dans FishingGame/catalog, puis son montage dans LakeWorld et ses tests. Les emplacements sont pris sur la méthode ; aucun flotteur ou moulinet n'est ajouté par l'interface indépendamment de cette liste.

## Lieu et habitat

LOCATIONS.willow-pond est la scène réelle ; habitats SPOTS dérivés du point inspectTarget. running-river est une nouvelle configuration future qui apparaît dans le menu/fiches sans fausse sélection. Ajouter un lieu disponible exige un ID accepté en sauvegarde, un adaptateur de scène réel et ses rencontres/cible/profondeur avant d'autoriser la sélection. Les fiches et catégories restent automatiques ; ne pas multiplier les routes. Conditions présentes : matin et eau calme fixes. Les paramètres météo futurs ne modifient pas les probabilités tant qu'ils ne sont pas simulés.

## Badge et déblocage

Exemple BADGE_RULES.collector : target 10, value(save) = save.total, lien journal ; BADGES.collector fournit le libellé. Ajouter règle + libellé ; recordCatch évalue toutes les règles en une seule opération, l'import valide les IDs sans rejouer les gains, et la progression construit sa fiche et le lien. Pour un nouvel objet verrouillé, accessLevel fournit un seuil réellement franchissable. Un contenu sans implémentation utilise future, pas locked.

## Vérification d'une extension

Les tests structure vérifient l'exhaustivité familles/emplacements, montages actuels valides et futurs refusés, migration v2/v3 et états d'un objet configuré. Le navigateur consulte feeder et rivière nouvellement déclarés, vérifie absence de faux achat/lancer, affiche les fiches et revient à la préparation. Ajouter à cette suite le contenu devenu disponible ; vérifier capture réelle/modèle, sauvegarde/import et rendu, sans créer une nouvelle navigation.
