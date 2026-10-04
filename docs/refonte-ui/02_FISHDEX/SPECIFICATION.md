# Lot 02 — FishDex

## Constats et vigilance

L'interface observée affiche 52 identités à capturer, 14 à observer, une progression de 66 identités, 29 formes/écotypes et plusieurs filtres. Ces valeurs décrivent cette visite ; recalculer sur les données courantes. La grille est numérotée. Les images des silhouettes sont chargées, mais celles-ci paraissent presque invisibles dans le rendu distant : vérifier contraste, masque et styles sur plusieurs appareils.

La fiche d'une identité non découverte révèle déjà son nom, son portrait de référence et de nombreuses informations. Elle présente aussi « Gabarits du prototype », « Modèle exact du pack existant » et des textes internes. La fiche du gardon propose comme premier repère « Carpe au posé · Chod rig » ; vérifier la recommandation contre les recettes réelles et les droits du joueur. Il s'agit d'un problème possible de choix du conseil, pas d'une preuve que toutes les compatibilités sont fausses.

## Intention et modèle de collection

Une collection inspirée du plaisir de compléter un Pokédex : numéros stables, silhouettes reconnaissables, découverte progressive, belle révélation et objectifs accessibles. Créer une identité FishDex originale dans la DA existante ; ne pas reprendre logos, illustrations ou interface propriétaire Pokémon.

Séparer identité taxonomique/catalogue, forme ou robe, spécimen individuel et maîtrise. La capture d'un spécimen n'ajoute pas une nouvelle espèce à chaque taille. Les variantes restent rattachées à leur identité. Ne pas fusionner des espèces ou déplacer leurs IDs pour arranger la grille.

## Écran collection

En-tête « FishDex » et retour. Résumé compact : « Découvertes [n] / [total] », barre et raccourci vers le prochain objectif. Un filtre « Ici » montre les identités présentes dans le lieu courant selon les données du jeu. Un second filtre permet tout le catalogue.

La grille est la partie dominante. Recherche visible ou accessible immédiatement. Les filtres secondaires s'ouvrent dans une feuille : découvertes/manquantes, capture/observation, habitat, formes et éventuellement favoris de collection si la fonctionnalité existe. Ne pas inventer un nouveau favori distinct de celui du carnet sans besoin.

Clarifier les catégories : le sélecteur observé « Toute eau » contient Paisibles, Prédateurs, Eaux vives, qui mélangent comportement et milieu. Séparer ces dimensions quand les données le permettent, ou renommer le groupe en « Profil » en expliquant sa portée. Éviter d'inventer des attributs absents pour remplir un filtre.

Les formes et la maîtrise restent accessibles dans un résumé secondaire dépliable. Les mots « identité », « écotype » et « groupes biologiques » peuvent figurer dans une fiche explicative ; le résumé doit rester compris au premier regard.

Un contenu non disponible dans la version jouable apparaît avec « À venir » et une explication. Il n'entre pas dans un objectif actuellement impossible à terminer. Distinguer indisponible dans cette version, présent dans une destination verrouillée et absent du lieu courant. Les destinations déblocables restent des objectifs réalisables.

## Cartes et états

| État | Portrait et texte | Action |
|---|---|---|
| Inconnu | Silhouette claire sur basalte, numéro, « À découvrir », indice autorisé | Voir un indice |
| Découvert par observation | Portrait, nom, badge Observation | Voir la fiche |
| Capturé | Portrait, nom, marque Capture | Voir la fiche |
| Nouvelle forme | Miniature de la forme autorisée, marque Nouveau ponctuelle | Voir les formes |
| Maîtrisé | Petit badge explicite, portrait inchangé | Consulter la maîtrise |
| Contenu futur | Statut À venir, aperçu autorisé selon les règles | Consulter l'état |

Ces états peuvent se combiner. La capture et l'observation sont des acquis indépendants lorsque les règles le permettent. La marque Nouveau est dérivée d'un événement ou d'un état de lecture réel ; elle se retire sans effacer la découverte.

Silhouettes produites depuis les images propres à chaque identité : conserver nageoires et proportions, couleur claire suffisamment contrastée, fond transparent correctement traité. Ne pas utiliser simplement une image noircie sur un fond presque noir. Miniatures homogènes en taille, cadrage contain et marge autour des nageoires. Prévoir un vrai fallback si image absente, sans laisser un cadre vide ni faire passer un mauvais poisson pour l'identité recherchée.

Sur mobile, deux colonnes quand les noms tiennent ; sinon une. Sur bureau, grille plus large. Pas de modèle 3D animé par carte. Utiliser les portraits actuels, chargement différé et dimensions réservées pour éviter les déplacements de mise en page.

## Fiche inconnue et fiche découverte

### Avant découverte

Afficher le numéro, la silhouette et les indices réellement autorisés : habitat, zone de l'eau, taille générale ou type de présentation selon les règles existantes. Ne pas cacher le nom sur la carte puis le dévoiler automatiquement dans le titre et l'image de la fiche inconnue. Respecter les libellés accessibles : « Poisson à découvrir numéro … » plutôt qu'un nom caché visuellement mais révélé au lecteur d'écran.

La recherche ne doit pas constituer une fuite involontaire de l'identité cachée. Définir explicitement la politique conforme au projet : recherche par numéro/indices pour les inconnus, noms pour les découverts ; si l'identité est déjà connue via une autre découverte, elle n'est plus traitée comme secrète. Une saisie du nom d'une espèce ne doit pas simuler une découverte.

Action « Préparer une rencontre » ou « Voir un habitat adapté » selon l'éligibilité. Un indice ne garantit pas une capture et n'ignore ni stock ni déblocage.

### Après découverte

Portrait dominant ; numéro, nom, rareté de collection ; résumé naturel en deux phrases. Onglets ou sections courtes : Profil ; Où le rencontrer ; Formes ; Mes records et maîtrise. Les données scientifiques peuvent être approfondies, mais le joueur trouve d'abord son prochain choix.

Records de taille/poids issus du carnet. Aucun record fictif dans un état vide. Nom scientifique et explications taxonomiques sont secondaires. Les comportements sont exprimés en signes utiles à observer, pas en chiffres de prototype ni noms de variables.

Les robes ne deviennent pas artificiellement plus puissantes selon leur couleur. La rareté de collection ne doit pas être présentée comme une difficulté de combat universelle.

## Aider à préparer une rencontre

Construire le conseil depuis le même système d'éligibilité que le jeu. Choisir une présentation compatible avec l'espèce, le milieu et le poste. Favoriser pour le premier conseil une technique ouverte, un montage utilisable et un équipement possédé ou gratuit. Ne pas choisir arbitrairement la première recette d'une liste.

Si aucune solution n'est actuellement accessible, montrer la prochaine condition utile, sans prétendre que le poisson est disponible ici. Les listes complètes de techniques restent consultables sous « Autres présentations ».

Le bouton de préparation ouvre le lot 01 ou sa version existante avec le contexte espèce/habitat. Il prévisualise un choix et respecte les confirmations et transactions normales ; pas d'achat, changement de poste ou consommation automatique. Conserver la fiche de retour.

Exemple de contrat conceptuel, à adapter aux services réels : identityId, discoveryMode, habitatId, suggestedRecipeId, eligibilityReasons, returnDestination. La source de vérité reste le catalogue et les droits actuels, pas cet exemple.

## Révélation et envie de compléter

Réutiliser l'événement de découverte réellement émis par capture ou observation. Mettre en valeur la première identité, puis la première forme et le record avec une importance différente. Révélation courte de silhouette vers portrait, nom lisible et progression réelle actualisée. Pas de nouvel écran bloquant obligatoire après chaque prise commune.

Éviter les doubles notifications lors d'une réouverture, d'un import ou du remontage d'un composant. Les animations respectent la réduction des mouvements. Le son ne se lance que selon les préférences et la politique du navigateur.

Montrer un objectif proche et réel : nouvelle identité du lieu, forme manquante accessible ou étape de maîtrise. Ne pas ajouter de série quotidienne punitive, de hasard payant ou de récompense monétaire inventée dans ce lot.

## Nettoyage éditorial

Sortir les sections Représentation 3D, gabarits de prototype, source du pack, paramètres et limites internes vers le mode de développement. Conserver au besoin une provenance documentaire discrète dans les détails. Revoir les traductions et noms avec le catalogue validé, sans réécrire la taxonomie au hasard.

Ne pas présenter les 66 identités de lieux multiples comme toutes présentes dans l'étang courant. Les totaux, badges et filtres utilisent la même définition documentée de l'unité collectionnée. Toute migration éventuelle doit préserver les découvertes, formes, captures et liens vers les spécimens.
