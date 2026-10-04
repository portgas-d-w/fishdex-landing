# Recette — Matériel et boutique

Les scénarios ci-dessous sont des validations à réaliser par Codex. Aucun n'est annoncé comme déjà passé dans le jeu.

## Scénarios fonctionnels

| ID | Situation | Résultat attendu |
|---|---|---|
| 01-A | Nouvelle partie | Ma canne montre la technique et les slots corrects ; le kit gratuit est retrouvable sans longue liste. |
| 01-B | Canne sans moulinet puis canne avec moulinet | Illustration et sélecteurs respectent les composants réellement présents. |
| 01-C | Montage → esche → fiche → retour | Retrouver le sélecteur, puis le montage, sans perdre filtres ni sélection. |
| 01-D | Changement de méthode incompatible | Cause compréhensible et canne requise ; aucune recette invalide appliquée. |
| 01-E | Achat disponible, verrouillé et trop cher | Condition, quantité et prix exacts ; seule une transaction valide modifie le stock et le solde. |
| 01-F | Double clic sur acheter | Pas de double transaction inattendue ; état d’attente et résultat visibles. |
| 01-G | Sac plein et recherche sans résultat | Liste lisible, unités correctes, filtre réinitialisable ; tout le catalogue reste consultable. |
| 01-H | Secours et stocks faibles | Kit gratuit groupé, objets distincts conservés, aucun faux stock ou seuil inventé. |
| 01-I | Ensemble dont une pièce manque | État explicite, substitution compatible proposée, aucun objet dupliqué. |
| 01-J | Montage vu sans achat ni application | Aucune consommation de stock induite par la consultation. |
| 01-K | Retour et clavier mobile | Une seule couche interactive ; action finale accessible ; navigation et saisie utilisables. |
| 01-L | Mode test puis partie normale | Portefeuilles et progression respectent la séparation existante. |

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
