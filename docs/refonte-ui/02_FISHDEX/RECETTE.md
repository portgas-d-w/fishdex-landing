# Recette — FishDex

Les scénarios ci-dessous sont des validations à réaliser par Codex. Aucun n'est annoncé comme déjà passé dans le jeu.

## Scénarios fonctionnels

| ID | Situation | Résultat attendu |
|---|---|---|
| 02-A | Collection vierge | Silhouettes identifiables, numéros stables, progression réelle et état vide clair. |
| 02-B | Carte inconnue puis fiche et lecteur d’écran | La politique de découverte reste cohérente ; pas de fuite involontaire par titre ou texte alternatif. |
| 02-C | Recherche inconnus/découverts et aucun résultat | Recherche et filtres respectent les règles ; zéro résultat n’est pas zéro découverte. |
| 02-D | Capture ou observation initiale | Découverte affichée une fois, compteur juste et sauvegarde conservée. |
| 02-E | Même identité, nouvelle taille puis nouvelle robe | Pas de nouvelle espèce pour une taille ; formes et records mis à jour selon leurs règles. |
| 02-F | Contenus futurs et destinations verrouillées | État et dénominateur distinguent à venir et déblocable ; objectif terminable. |
| 02-G | Conseil de rencontre pour débutant | Technique ouverte et recette compatible priorisées ; aucune sélection du seul premier élément du catalogue. |
| 02-H | Rencontre non accessible | Condition précise et lien utile ; aucun achat ni trajet automatique. |
| 02-I | Ouverture préparation puis retour | Fiche, filtres et défilement retrouvés ; IDs conservés. |
| 02-J | Portrait manquant ou très sombre | Fallback explicite, silhouette contrastée, nageoires non coupées. |
| 02-K | Import ou rechargement d’une partie avancée | Découvertes persistantes et pas de cascade de notifications anciennes. |
| 02-L | Réduction des animations et grille complète mobile | Collection utilisable et chargement des portraits maîtrisé. |

## Matrice transversale

- Largeurs CSS 320, 390, 430 et bureau ; paysage et changement d'orientation.
- Nouvelle partie, partie avancée, catalogues longs, contenu verrouillé/futur, image absente.
- Ouverture/fermeture et retours successifs ; clavier ; touches Tab/Entrée/Échap si disponibles.
- Défilement jusqu'au dernier élément, safe areas, clavier virtuel et action principale accessible.
- Contrastes et libellés accessibles, état sélectionné et indisponibilités non fondés uniquement sur la couleur.
- Préférence de réduction des mouvements, son coupé, rendu 3D indisponible.
- Chargement de ressources uniquement lorsque nécessaire, pas de fuite lors des ouvertures répétées.
- Contrôles de données pertinents : pas de stock, monnaie, découverte ou favori modifiés par une simple consultation.

## Fin du lot

1. Passer les vérifications pertinentes du dépôt et les scénarios touchant des règles réelles.
2. Documenter toute différence entre la spécification et l'implémentation finale avec sa raison.
3. Capturer les principaux écrans avant/après dans les mêmes conditions et au moins les états vierge/avancé.
4. Vérifier l'appareil réel si disponible ; indiquer précisément les tests non exécutés.
5. Déployer sur le projet autorisé et vérifier la version publique si son identité est établie.
6. Mettre à jour le relais du dépôt et `RELAIS_A_COMPLETER.md` ; indiquer ce que le lot suivant doit réutiliser.

Un contrôle de syntaxe de ces documents ne valide pas le jeu. Aucune capture de bureau ne constitue une preuve de performance iPhone.
