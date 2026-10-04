# Cadre commun — Refonte des menus FishDex

Version 1 · 3 octobre 2026 · Basalte & Turquoise

## Statut et source de vérité

Ce dossier est une spécification pour Codex sur le PC du propriétaire. Aucun code du jeu n'a été modifié ici. Les constats proviennent d'une visite du site https://www.fishdex.fr/ le 3 octobre 2026, dans un navigateur distant avec une nouvelle partie. Les menus étaient accessibles malgré l'échec du démarrage 3D. L'aquarium animé, les parties avancées, les gestes iPhone et les performances GPU n'ont pas été vérifiés lors de cet audit.

Lire d'abord les instructions du dépôt, son fichier de passation et les données actuelles. Un constat de cet audit peut avoir été corrigé depuis : vérifier avant d'agir. Les nombres vus dans les menus sont un état d'interface, pas un contrat pour modifier le catalogue. Les tâches poissons et techniques ont déjà été réalisées selon le propriétaire. Cette refonte s'appuie dessus.

## Quatre lots et responsabilités

| Ordre | Lot | Responsable fonctionnel de la refonte |
|---|---|---|
| 01 | Matériel et boutique | Ma canne, montage, inventaire, ensembles, achats ; socle UI commun |
| 02 | FishDex | Collection, fiches, découvertes, variantes et liens vers une rencontre |
| 03 | Progression et exploration | Objectifs, déblocages, destinations, postes, accès à l'observation |
| 04 | Carnet, aquarium et aide | Souvenirs, favoris, personnalisation, réglages, apprentissage ; finition de l'accueil |

Exécuter dans cet ordre. Chaque dossier contient les règles indispensables et reste exploitable seul. Si un lot précédent n'est pas présent, réutiliser le socle existant et réaliser uniquement les composants partagés nécessaires au lot actuel. Ne pas refaire les autres lots comme prérequis. Un seul chantier doit posséder un composant commun ; documenter les contrats dans la passation pour le suivant.

## Direction artistique

| Token | Valeur |
|---|---|
| Fond | #171F22 |
| Surface | #232D31 |
| Surface relevée | #2C393D |
| Fond de poisson | #1D282C |
| Bordure | #415255 |
| Texte | #F0F5F4 |
| Texte secondaire | #AFBFBE |
| Accent | #4CC6C2 |
| Accent doux | #203E3F |
| Texte sur accent | #102526 |
| Focus | #9DEBE7 |
| Succès / attention / erreur | #82C99A / #E5C785 / #E68181 |

Surfaces mates, argent discret, turquoise réservé aux sélections, à la progression et à l'action prioritaire. Poissons et illustrations conservent leurs couleurs naturelles. Utiliser les assets déjà disponibles et des pictogrammes cohérents, idéalement SVG. Pas de nouveau service payant, de pack obligatoire ou de génération 3D pour ces lots. Lire le guide DA du dépôt s'il existe ; ces tokens en reprennent la base actuelle.

## Composants et règles mobiles

- Panneau ou écran de section, en-tête opaque, titre et retour explicite.
- Une seule zone principale de défilement par écran ; l'action finale reste accessible sans couvrir le dernier élément.
- Sur mobile, consacrer l'espace disponible au contenu. Ne pas enfermer une page longue dans une minuscule fenêtre.
- Tester 320, 390 et 430 px de largeur CSS, paysage, ordinateur et clavier virtuel. L'iPhone 14 Pro est la référence de test réel ; l'émulation valide seulement la disposition.
- Texte courant 14–16 px, champs de saisie au moins 16 px, titres 20–24 px, annotations rares et lisibles. Cibles de projet d'au moins 44 × 44 px.
- Marges cohérentes : 4 / 8 / 12 / 16 / 24 px ; une action principale par groupe de décision.
- Deux colonnes de cartes seulement si contenu et noms restent lisibles. Sinon une colonne. Inventaires compacts, fiches détaillées à la demande.
- Statuts accompagnés d'un mot ou d'une icône, pas uniquement d'une couleur. Contrastes de texte visés : 4,5:1 courant et 3:1 grand texte ; mesurer les couples réellement utilisés.
- Focus visible, libellés accessibles, navigation clavier. Les onglets doivent annoncer un choix exclusif et leur état sélectionné ; ne pas employer de fausses cases à cocher indépendantes.
- Respecter les safe areas iOS, le clavier et la réduction des animations. Transitions brèves de 120–180 ms ; aucun clignotement permanent.
- Les menus gardent défilement et champs éditables. Limiter les protections contre la sélection et les gestes natifs aux surfaces de jeu qui les nécessitent.
- Aucun timer permanent ou rendu 3D supplémentaire dans une grille de gestion. Miniatures statiques chargées à la demande.

## Navigation et données

Un écran de premier niveau revient au menu. Une fiche revient à son écran appelant avec recherche, filtres, défilement et sélection restaurés. Une sous-fiche retourne à son sélecteur, et non directement au montage. Une ouverture croisée conserve une destination de retour explicite.

Un seul panneau doit accepter les interactions et le focus à la fois. Les panneaux de fond sont masqués ou rendus inertes selon l'architecture ; restaurer le focus au retour. Les événements de clic ne doivent pas atteindre le jeu derrière le menu. Le comportement de pause suit le projet existant.

Réutiliser les IDs stables, les règles d'éligibilité, les recettes et la sauvegarde. Éviter de dupliquer ces règles dans une couche UI. Présenter les données au travers de sélecteurs/adaptateurs purs quand utile. Aucun nom de fichier source ni framework n'est présumé dans ce dossier.

Les états à traiter partout : chargement, disponible, sélectionné, équipé, verrouillé, stock insuffisant, incompatibilité, vide, recherche sans résultat et erreur de ressource. Une indisponibilité indique une cause et l'action qui permet d'avancer quand elle existe.

Les textes visibles doivent expliquer un choix de joueur. Garder en espace de développement les sources internes, le catalogue de conception, les noms du pack, les paramètres du prototype, les migrations et les limites de la génération. Les règles utiles telles que sauvegarde locale, perte de matériel ou contenu à venir restent clairement expliquées.

## Réalisation et compte rendu

Faire un état de référence des écrans touchés. Implémenter par étapes réversibles et compléter le catalogue existant sans supprimer des contenus pour raccourcir l'écran. Un contenu non jouable conserve une fiche et un état réel, sans faux achat ni progression impossible.

Exécuter les contrôles pertinents du dépôt et les scénarios de recette du lot. Ajouter seulement les tests qui protègent une règle réelle : filtres, droits, achats, persistance, favoris ou recommandations. Ne pas multiplier des tests qui ne vérifient que la présence de texte statique.

Préparer des captures avant/après et un compte rendu séparant tests exécutés, échecs et tests réels sur appareil restant à faire. Ne pas annoncer une validation iPhone sur la seule base d'un navigateur de bureau.

Le projet Vercel du jeu est déjà autorisé par le propriétaire. Vérifier son identité dans le dépôt avant le déploiement, utiliser son workflow et contrôler la version servie par fishdex.fr. Ne pas choisir un autre projet par supposition. Terminer le lot et mettre à jour le relais avant de commencer le suivant.

Références de conception : guide DA Basalte & Turquoise lu dans sa version courante le 3 octobre 2026 ; visite directe des interfaces. Les règles de présentation de ce dossier sont des choix de projet. Références utiles pour les vérifications : https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html et https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ; vérifier leurs instructions courantes lors de l'intégration si nécessaire.
