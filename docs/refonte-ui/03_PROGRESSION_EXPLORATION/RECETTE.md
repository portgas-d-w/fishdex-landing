# Recette — Progression et exploration

Les scénarios ci-dessous sont des validations à réaliser par Codex. Aucun n'est annoncé comme déjà passé dans le jeu.

## Scénarios fonctionnels

| ID | Situation | Résultat attendu |
|---|---|---|
| 03-A | Niveau 1 | Un objectif réalisable apparaît avant la liste complète des techniques ; action compréhensible. |
| 03-B | Condition avec deux chemins alternatifs | Chaque chemin suit sa règle ; un seul chemin réussi suffit si la condition est OR. |
| 03-C | Droit acquis puis chargement/import | Les déblocages permanents restent acquis ; les menus montrent le même état. |
| 03-D | Objectif suivi, abandonné puis repris | Choix UI sans récompense ou progression fictive ; état sauvegardé correctement si ajouté. |
| 03-E | Toutes les techniques et badges | Catalogue complet consultable ; obtenus, ouverts et verrouillés distingués. |
| 03-F | Lieu courant et autre destination | Destination séparée des postes ; pas de trajet automatique au simple aperçu. |
| 03-G | Carte et poste sélectionné | Coordonnées liées aux données du lieu ; nom accessible et fiche cohérente. |
| 03-H | Poste verrouillé/occupé | Raison et condition exactes ; lien utile et aucun droit accordé par l’affichage. |
| 03-I | Changement de poste avec ligne en service | Contraintes respectées ; pas de capture ou montage effacé silencieusement. |
| 03-J | Observation impossible au poste | Proposition d’un poste réellement adapté ; pas seulement des boutons désactivés. |
| 03-K | Suggestion de poisson inconnu | Indices autorisés et populations réelles ; pas de révélation ou taux inventé. |
| 03-L | Comparer boutique, progression et carte | Conditions identiques pour un même droit ; prix et difficulté du combat inchangés. |

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
