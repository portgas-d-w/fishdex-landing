# 05 — Interface console et préparation

## DA et lisibilité

Basalte sombre, turquoise comme accent, texte clair et paysage naturel. La palette complète de la référence est exportée dans `data/palette.json`. Convertir les valeurs en tokens Roblox ; aucune feuille CSS web ne devient une interface native par simple import.

Départ de conception pour 1080p : textes de lecture courante environ 24–28 px, secondaires au moins 20 px, titres plus grands ; zones de sécurité initiales 5 % à régler ; taille de texte ajustable. Ce sont des cibles à vérifier depuis un canapé, pas des exigences officielles chiffrées. Mettre échelles et contraintes pour éviter des textes minuscules en 4K ou coupés en faible résolution.

Chaque action est atteignable à la manette, sans survol souris. Focus très visible, retour toujours prévisible, retour au dernier élément sélectionné, défilement au focus, comportement des éléments désactivés et navigation entre panneaux testés. Montrer la raison d'un blocage ; cacher un objet incompatible ne doit pas rendre la navigation inexplicable. Voir S05.

## Organisation principale

Accueil de session : Pêcher/Continuer, FishDex, Ma canne, Boutique, Carnet, Aquarium, Progression, Réglages/Aide. Le FishDex reste le centre de collection. Spots accessibles depuis une carte lisible ou le contexte de pêche, sans exiger de recherche dans une liste technique.

L'interface en pêche affiche uniquement les indications nécessaires au contexte. En combat, pas d'argent, compteur d'espèces, catalogue ou inventaire permanent. Repère de contact facultatif discret, aide temporaire au démarrage, notifications de réussite brèves. Les signaux nécessaires restent visuels avec son ou vibrations désactivés.

## Parcours Matériel

1. **Mes cannes** : choix parmi les cannes possédées, usage clair, méthode et capacité principales ; détail à la demande.
2. **Ma canne** : modèle central, points Ensemble, Fil, Montage, Appât/Leurre, Réception. La méthode compatible est choisie ici.
3. **Personnaliser** : améliorations de canne/moulinet/fil compatibles, avec comparaison de deux ou trois effets concrets.
4. **Atelier Montage** : ligne agrandie, composants placés et réglages ; une explication utile à la fois.
5. **Mes équipements** : stock par catégories, quantités, favoris et rangement. La boutique vend, cet écran ne mélange pas tous les objets disponibles à l'achat.

Changer de méthode propose une recette en aperçu avec composants nécessaires et changements expliqués. Appliquer ou annuler. Garder ce qui est compatible et réutilisable ; aucune destruction ou dépense silencieuse.

## Atelier à la manette

Choisir composant → prévisualiser emplacements possibles → déplacer sur le segment au stick → ajuster finement avec la croix → confirmer. Annuler revient au brouillon précédent. Zoom et sélection de segment ont des actions dédiées ; les positions sont enregistrées en cm/m, pas en pixels. Les pièces fixées à un raccord ne se placent pas librement sur le fil.

Plombs fendus : placement autorisé, regroupement ou espacement. Flotteur fixe : profondeur. Coulissant : butées et mobilité. Feeder/lest : connexion compatible, charge totale. Bas de ligne : longueur, matière, résistance. Hameçon/leurre/cheveu : attache terminale prévue par la recette.

La vue de test dans l'eau doit reproduire les paramètres réels de descente, profondeur, équilibre et courant. Montrer d'abord « ton flotteur est trop chargé » ou « ton appât reste au-dessus du fond », pas dix chiffres. Les recettes préconfigurées donnent un accès rapide ; les puristes peuvent personnaliser la même simulation.

## Boutique

Premier écran : catégories avec vignette, rôle et sous-catégories. Rayons : Cannes ; Moulinets ; Fils et bas de ligne ; Flotteurs ; Lests et feeders ; Hameçons et raccords ; Appâts et leurres ; Réception ; Décorations d'aquarium. Ajouter les autres catégories réelles issues de l'audit, sans doublon de stock.

Dans un rayon : grille compacte paginée ou liste courte, filtres de compatibilité et de possession/déblocage, fiche latérale sur grand écran. L'achat se fait depuis la fiche et montre coût, quantité, effet utile et condition. Mettre « Compatible avec ma canne » comme filtre pratique. Un objet possédé peut avoir besoin d'un exemplaire supplémentaire ; distinguer modèle possédé et stock.

## Collection, carnet et aquarium

FishDex : cartes numérotées, silhouette des inconnus, progression par habitat/famille et apparences à découvrir, indice accessible, découverte célébrée brièvement. Les contenus futurs ne gonflent pas artificiellement la complétion du contenu accessible.

Carnet : prises individuelles filtrables par espèce, lieu, méthode, date, taille, poids, rareté/apparence et record ; plusieurs tris utiles et favoris. Il ne concurrence pas la grille d'espèces. Les fiches affichent une mise en scène de capture et les détails validés.

Aquarium : cinq spécimens favoris réellement capturés, nage animée, personnalisation et cycle de vie des modèles propre. Ne pas charger tous les poissons du jeu à chaque ouverture. Retour au jeu conservant spot et état autorisé.

## Aide novice et accessibilité

Chaque fiche explique rôle → effet → quand l'utiliser → détail réel. Guide contextuel court lors de la première utilisation, consultable ensuite. Signaux par forme/son/texte en plus de couleur ; vibrations réglables, taille de texte et sensibilité. La désactivation du son ne rend pas la touche illisible. Les recherches textuelles ne sont jamais obligatoires pour naviguer à la manette.
