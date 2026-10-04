# Lot 04 — Carnet, aquarium, aide, réglages et finition de l'accueil

## Constats et limite du diagnostic

Le carnet propose vues, tris et filtres, puis export/import et des textes de migration de l'ancien carnet. Dans une partie vierge, il invite peu à la première prise. L'aquarium présente cinq emplacements et des réglages de sol, fond, lumière, plantes et rochers ; son rendu 3D n'a pas pu être évalué dans le navigateur distant. Réglages et aide commencent par de longs paragraphes de tutoriel avant les options.

L'accueil regroupe toutes les destinations dans une grille presque uniforme, avec FishDex mis en avant. L'objectif est de finaliser cette organisation après les trois premiers lots, sans reconstruire leurs écrans.

## Carnet : les individus et leurs histoires

Le FishDex collectionne les identités et les formes ; le carnet conserve les spécimens et les observations. Garder cette distinction dans les noms, compteurs et liens. En-tête « Mon carnet », résumé discret de prises et observations, recherche accessible.

Vues rapides : Récentes ; Records ; Premières découvertes ; Formes ; Favoris. Afficher des noms compréhensibles et des filtres actifs faciles à retirer. Le tri reste indépendant : date, poids, longueur, rareté si cette donnée existe sur les spécimens.

Un filtre avancé permet identité, lieu/poste, technique, période et autres dimensions déjà renseignées. Ne pas ajouter des filtres vides alimentés par des métadonnées absentes. Les filtres se combinent de manière documentée ; remettre à zéro ne supprime pas de prise.

Cartes dominées par la photo ou illustration existante du spécimen, avec nom autorisé, taille/poids, date et une marque utile : record, première découverte, favori. Les dimensions de l'image sont réservées et son absence traitée explicitement. Les photos régénérables ne doivent pas être présentées comme des photos originales stockées si ce n'est pas le cas.

Fiche de prise : image dominante ; identité, forme, poids, longueur ; lieu et technique ; histoire ou événements réellement enregistrés ; actions Favori aquarium et Voir dans FishDex. Pas d'histoire inventée dans une ancienne prise sans ces données. Préserver les records historiques même si l'ancienne sauvegarde ne comporte pas tous les spécimens.

Un favori d'aquarium désigne un individu réel. Si un ancien record ne possède pas encore de spécimen exploitable, l'UI explique pourquoi il ne peut pas être ajouté, ou applique une migration déterministe explicitement vérifiée. Ne pas créer une nouvelle capture fictive pour remplir un aquarium.

Observations dans une vue séparée ou un onglet, avec lieu, date et image/description enregistrée. Leur présence complète la collection selon les règles mais n'ajoute pas automatiquement un poisson capturé dans l'aquarium.

### États vides

- Aucune prise : « Ton premier souvenir commence au bord de l'eau », avec Retourner pêcher et éventuellement un aperçu du parcours de première prise.
- Aucun résultat : « Aucun souvenir avec ces filtres », bouton Réinitialiser et filtres visibles.
- Aucun favori : proposer la sélection parmi les prises éligibles.
- Ancienne sauvegarde : préserver les données ; détails de migration dans un volet secondaire, sans texte technique permanent.

## Aquarium : observer d'abord, gérer ensuite

Le bassin occupe la majorité de l'écran disponible. En-tête compact, retour, deux accès « Mes poissons » et « Décorer ». Cinq individus maximum, avec leurs formes et tailles réelles. Ne pas charger cinq scènes indépendantes pour les emplacements.

« Mes poissons » ouvre une feuille avec cinq emplacements compacts, miniatures et nom du spécimen. Ajouter ouvre le carnet ou un sélecteur de prises éligibles. Montrer le poids/longueur/date pour distinguer deux individus de même identité. Un menu déroulant géant de noms ne suffit pas.

Quand le bassin est plein, l'UI demande quel emplacement remplacer. Remplacer ou retirer un favori ne supprime pas la prise du carnet. Ajouter le même individu deux fois suit la règle existante ; si les doublons sont interdits, l'expliquer et revalider à l'application.

« Décorer » regroupe Sol ; Fond ; Lumière ; Objets. Prévisualiser les choix si l'architecture le permet, avec une sémantique claire : changements immédiats ou Appliquer/Annuler. Ne pas laisser une présentation en brouillon modifier silencieusement la sauvegarde.

Un décor non acheté affiche prix et accès à la boutique du bon rayon. Aucun achat caché dans une prévisualisation. Le retour d'achat retrouve le contexte aquarium, sans perdre la sélection de poissons.

État vide : belle présentation du bassin si disponible, explication brève et accès aux prises. Pas de poisson acheté inventé pour le remplir. Pas de mécanique d'entretien, de faim ou de pénalité d'absence ajoutée.

Échec 3D : une explication utile, une commande de réessai lorsque possible et les favoris toujours consultables en 2D. L'échec ne doit ni effacer les favoris ni bloquer la fermeture. Démarrer le rendu uniquement lorsque l'aquarium est visible ; suspendre/libérer selon le moteur et les mécanismes existants, sans perdre les données.

## Réglages et sauvegarde

Séparer « Réglages » et « Apprendre à pêcher ». Dans les réglages, groupes courts : Audio ; Graphismes ; Commandes ; Accessibilité ; Sauvegarde. Afficher immédiatement les valeurs actuelles.

Graphismes : profils existants et qualité de l'eau, avec description de leur compromis visuel et de coût. Ne pas promettre 60 images/s parce qu'un profil s'appelle Élevé. Aucun changement du shader dans cette tâche.

Commandes : main de la canne, mode à un doigt, repère de tension, conseils contextuels et options existantes. Les explications reflètent le gameplay courant et le choix du côté. Une phrase indiquant toujours canne à gauche serait fausse après inversion.

Utiliser des contrôles visuellement harmonisés avec la DA, avec les sémantiques accessibles adéquates. Un interrupteur annonce Marche/Arrêt. Ne pas masquer l'état dans un bouton « Activer / couper » ambigu. Les sélecteurs ne doivent pas devenir des petites surfaces blanches illisibles sur basalte.

Sauvegarde : expliquer ce qui reste local, ce que le fichier contient et comment changer d'appareil. Export/import dans cette rubrique, avec éventuellement un raccourci discret depuis le carnet. Déplacer les actions ne doit pas supprimer leur fonctionnalité.

Import : vérifier le format et la version avant toute mutation. Décrire fusion ou remplacement selon les règles actuelles ; afficher les conséquences avant une opération qui écrase la progression. Préserver les sauvegardes invalides et proposer une récupération seulement si elle est réellement implémentée. Aucun journal de secrets ni données personnelles ajoutées.

Les fonctionnalités de développement restent accessibles dans un espace clairement distinct. « Mode test » peut rester disponible pour le propriétaire mais ne se mélange pas aux choix de difficulté ou à la progression normale. Garder la séparation existante des portefeuilles et états.

## Apprendre : expliquer par contexte

Page d'entrée courte : Premiers pas ; Techniques ; Préparer son montage ; Combat et réception ; Glossaire. Chaque leçon a une action à comprendre, un geste illustré et une raison utile. Employer images et SVG existants ; pas besoin de nouvelle vidéo payante.

Les différences entre techniques sont montrées dans les leçons qui les concernent. L'aide d'une méthode vient de son profil réel et des commandes installées, pas d'un texte générique identique pour 22 techniques.

En matériel, un bouton d'aide ouvre la définition ou le guide correspondant avec retour à la pièce en cours. En pêche, les conseils contextuels suivent l'option du joueur et évitent les pavés au centre de l'eau. Si aucun tutoriel interactif existe, un court guide illustré suffit ; ne pas prétendre qu'il simule des actions.

Expliquer les erreurs sans blâmer : pièce incompatible, stock manquant, profondeur impossible, sauvegarde invalide, ressource non chargée. Les valeurs et règles affichées doivent suivre le moteur actuel.

## Accueil final

Conserver FishDex comme destination visuellement principale, avec progression compacte et marque de nouvelle découverte réelle. Ajouter le résumé « Prochaine étape » du lot 03, s'il existe, sans répéter toutes les statistiques.

Organiser les accès par intention :

| Groupe | Accès |
|---|---|
| Préparer et explorer | Matériel ; Lieux / carte ; Observer selon contexte |
| Ma collection | FishDex ; Carnet ; Aquarium |
| Mon parcours | Progression ; Boutique |
| Utilitaires | Réglages ; Aide |

Ces groupes structurent la grille, pas quatre sous-menus obligatoires. Les destinations fréquentes restent directement accessibles. Pêcher est l'action de retour à la scène, avec un libellé clair. Ne pas ajouter une barre globale persistante qui surcharge la vue de pêche.

Chaque tuile possède un signe visuel léger et une information utile adaptée : ensemble actif, dernière prise, nombre de favoris, objectif. État vierge accueillant ; partie avancée sans chiffres partout. Une notification ne s'affiche que si un événement ou état non lu la justifie.

Mettre à jour les textes devenus faux : « Boutique : Cannes et décorations » alors qu'elle vend tous les équipements, « Lieux : prochaines escales » si ces lieux sont déjà accessibles, et les anciens textes de migration visibles sans besoin.

## Recette finale des quatre lots

Réaliser les parcours croisés : FishDex → habitat → poste → préparation ; boutique → équipement → ensemble ; carnet → favori → aquarium ; objectif → déblocage → matériel ; aide d'une pièce → retour au montage. Restaurer contexte et focus à chaque retour.

Vérifier l'accueil en partie vierge et avancée, les erreurs de 3D, portraits manquants, long catalogue, import ancien et clavier mobile. Les quatre lots doivent partager les mêmes composants, états et libellés, sans retour au thème vert/doré dans une sous-fiche oubliée.
