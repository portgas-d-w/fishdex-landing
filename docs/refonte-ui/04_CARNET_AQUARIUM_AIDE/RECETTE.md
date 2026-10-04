# Recette — Carnet, aquarium et aide

Les scénarios ci-dessous sont des validations à réaliser par Codex. Aucun n'est annoncé comme déjà passé dans le jeu.

## Scénarios fonctionnels

| ID | Situation | Résultat attendu |
|---|---|---|
| 04-A | Carnet vierge puis filtre sans résultat | Deux états distincts, chacun avec une action utile ; aucune suppression par réinitialisation. |
| 04-B | Prises récentes, records et observations | Bonne unité collectionnée, filtres combinés, tri indépendant et métadonnées réelles. |
| 04-C | Ancien carnet incomplet | Records conservés ; absence de métadonnées expliquée ; aucun spécimen fictif créé. |
| 04-D | Ajouter cinq individus puis un sixième | Limite respectée et remplacement explicite ; carnet intact. |
| 04-E | Deux poissons de même identité | Spécimens distinguables par leurs attributs ; règle de doublon appliquée. |
| 04-F | Retirer un favori et recharger | Favori retiré, prise conservée ; aquarium sauvegardé. |
| 04-G | Décor possédé, verrouillé et non acheté | État clair ; prévisualisation et achat distincts ; retour au contexte aquarium. |
| 04-H | WebGL indisponible | Favoris consultables, aucune donnée perdue, fermeture et réessai utilisables. |
| 04-I | Réglages avec clavier et réduction des animations | Contrôles lisibles et états annoncés ; données persistantes. |
| 04-J | Export puis import valide et invalide | Format/version validés avant mutation ; conséquences comprises ; sauvegarde conservée en cas d’erreur. |
| 04-K | Aide d’une technique ou pièce | Texte lié à la méthode actuelle et au côté choisi ; retour à l’écran appelant. |
| 04-L | Parcours croisés des quatre lots | Une seule couche interactive ; filtres, scroll et focus restaurés ; aucune duplication de contenus. |

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
