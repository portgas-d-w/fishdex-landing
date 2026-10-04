# Lot 01 — Matériel et boutique

## Constats vérifiés dans l'interface

Ma canne / Mon sac / Ensembles existent. Ma canne utilise un dessin central et des boutons Canne, Méthode, Élastique, Fil et Montage. La préparation du montage commence par un bloc de conseil et un graphique accompagné de nombreuses valeurs. Mon sac présente une longue liste de composants d'initiation et de secours. La boutique possède plusieurs dizaines de catégories et affiche un catalogue de conception à la suite des achats.

La fiche d'un ver répond « Esche proposée aux poissons compatibles », sans donner les poissons concernés. Plusieurs verrous indiquent « Ouvrez une pratique compatible » sans guider vers la pratique. Dans le parcours observé, le retour depuis le détail du ver revenait au montage au lieu de retrouver la liste d'esches. Vérifier ces constats dans la version actuelle.

## Résultat attendu

Le joueur doit pouvoir répondre à quatre questions sans ouvrir une documentation : qu'ai-je équipé, que puis-je pratiquer, pourquoi changer cette pièce, et que me manque-t-il pour pêcher à cet endroit ? L'utilisateur expérimenté doit accéder à tous les composants et réglages existants.

## Écrans et ordre de lecture

### Ma canne

En-tête « Matériel », retour vers le menu, onglets Ma canne / Mon sac / Ensembles. Première ligne : nom de l'ensemble ou canne actuelle et état de préparation.

Au centre, illustration crédible de la canne actuelle. Les repères ouvrent les sélecteurs de pièces : Canne, Méthode, Moulinet ou Élastique lorsqu'il existe réellement pour cette canne, Fil et Montage. Les repères correspondent à des zones cohérentes. Ne pas représenter un moulinet sur une canne qui n'en possède pas ; pas besoin d'un modèle 3D pour cette illustration.

Sous l'illustration, trois informations utiles : usage principal, présentation actuelle, stock prêt ou élément manquant. Les effets affichés proviennent des règles du jeu. Les contraintes telles que taille d'appât, portée ou résistance sont expliquées dans une fiche, sans inventer un nouveau score de puissance global.

Action principale « Préparer mon montage ». Kit gratuit dans une action secondaire discrète et toujours retrouvable. Réception accessible sans mélanger l'épuisette à une pièce de la ligne ; son emplacement distingue équipement associé et montage.

### Choisir une canne ou une méthode

Chaque option montre une miniature, son nom, les usages, l'état actuel et la cause d'indisponibilité. Comparaison avec l'équipement actuel sur quelques différences réelles, suivie du compromis. Exemples de libellés à renseigner avec les données : « Meilleur amortissement », « Portée de placement », « Moins adaptée à cette présentation ».

Regrouper les méthodes par grandes familles de navigation : flotteur et coup, fond et amorçage, leurres, mouche et dérive, techniques spécialisées. Cette taxonomie est une organisation UI ; conserver les méthodes et la distinction entre technique et amélioration matérielle. Une meilleure canne n'est pas présentée comme une nouvelle méthode.

Afficher d'abord les méthodes compatibles avec la canne, puis « Voir toutes les techniques ». Pour une autre technique, expliquer la canne requise et proposer son aperçu ; aucune sélection d'une technique incompatible par simple filtrage UI.

### Mon montage

Ordre : recette choisie et état ; dessin du montage sous l'eau ; composants essentiels ; action « Utiliser ce montage ». Le dessin montre le rôle relatif du flotteur, du lest, du bas de ligne et de l'appât lorsque la méthode les utilise. Il peut être SVG/Canvas léger et piloté par la recette actuelle.

La méthode détermine les slots et réglages proposés. Ne pas ajouter un flotteur à tous les montages. Réception est un équipement associé, montré à part du dessin de la ligne.

Deux entrées : « Montage conseillé » et « Personnaliser ». Le conseil est dérivé du matériel disponible, des compatibilités et éventuellement du poste choisi. Le kit gratuit est explicitement proposé s'il manque une pièce ; aucun achat automatique. Une action confirme l'utilisation et applique les règles de stock déjà existantes, sans nouvelle consommation déclenchée par la seule consultation.

Les réglages fréquents sont visibles et expliqués : profondeur, répartition et longueur si pertinents. Afficher un repère de sens, par exemple « L'appât se place plus près du fond », lorsque la simulation le justifie. Le graphique de descente reste disponible sous « Voir la présentation sous l'eau », avec légende et valeurs lisibles. Les calculs complets et tous les slots vont dans « Détails du montage ».

Si les changements sont immédiats dans le système actuel, ne pas les transformer accidentellement en brouillon. Si un brouillon existe, différencier clairement « Appliquer » et « Annuler ». Dans les deux cas documenter ce qui est enregistré, restauré et consommé.

### Sélecteur de composant et fiche

Présentation courte : image, nom, dimensions pertinentes, stock, état équipé et rôle en une phrase. Variantes de taille regroupées ; détail au toucher. Garder une entrée « Pourquoi certaines pièces ne conviennent pas ? », avec motifs précis.

La fiche répond dans cet ordre : rôle ; effet concret ; usages ou poissons éligibles dans le jeu ; compromis ; paramètres détaillés facultatifs. Expliquer au premier usage « Esche = appât fixé à l'hameçon ». Un terme spécialisé conserve son nom, accompagné d'une définition courte accessible.

Pour une esche, montrer les groupes ou poissons effectivement éligibles, sans révéler les identités cachées ni promettre une prise. Distinguer « peut convenir » et « favorisé par les conditions ». Le contexte et la présentation restent déterminants ; pas de tableau de pourcentages inventés.

Le retour depuis la fiche retrouve le sélecteur et sa position. Le retour du sélecteur retrouve le slot du montage. Aucun panneau du dessous ne reste cliquable.

### Mon sac

Entrées visuelles : Cannes ; Moulinets et élastiques ; Fils et bas de ligne ; Pièces de montage ; Appâts et leurres ; Amorces ; Réception. Sous-familles complètes à l'intérieur, sans supprimer le catalogue. Décorations accessibles par l'aquarium ou une rubrique secondaire, et non mêlées aux pièces de pêche.

Ligne compacte avec miniature, nom, quantité et unité réelle, statut équipé et accès à la fiche. Filtres : recherche, compatible avec la méthode, stock faible. Quantités en mètres, pièces et portions correctement pluralisées. Définir « stock faible » par le seuil actuel, pas une valeur UI arbitraire.

Regrouper les secours renouvelables sous « Kit gratuit » : consultables et utilisables, mais pas cinquante lignes ajoutées aux achats possédés dès la première visite. Ne pas déduire que ces composants ont tous la même rareté ni les fusionner en un objet unique. Détecter les véritables doublons par ID et usage ; les ressemblances de nom ne suffisent pas.

### Ensembles

Un ensemble mémorise la préparation, pas une copie du matériel. En-tête avec la phrase courte correspondante. Cartes : nom, canne, technique, aperçu du montage et état « prêt » ou pièces manquantes. Actions utiles : utiliser, consulter, renommer ; suppression selon le mécanisme réversible déjà disponible.

Chargement d'un ensemble : valider stock et droits avant application. Montrer les pièces manquantes et proposer un remplacement compatible ou le kit gratuit quand possible ; jamais dupliquer le stock. État vide : aperçu de l'équipement actuel et « Enregistrer mon premier ensemble ».

### Boutique

Accueil avec solde, recherche et rayons visuels partageant les familles du sac. Trois vues : Pour mon équipement ; Disponible ; Tout le catalogue. Le catalogue complet reste accessible, y compris contenu futur explicitement marqué. Un filtre ne débloque pas un article.

Les recommandations affichent leur raison : compatible, remplace une pièce manquante ou améliore un attribut réel. Le joueur peut parcourir tout le rayon sans être enfermé dans ces recommandations.

Carte : image, nom, taille ou lot, prix, stock possédé, disponibilité. Une action principale pertinente ; Possédé/Équipé sont des statuts. La compatibilité, le déblocage et la solvabilité sont trois informations distinctes. Expliquer le prix par lot et montrer la quantité obtenue avant achat.

Un verrou indique sa condition exacte : niveau, captures dans une famille nommée, initiation ou destination. Lien « Voir le déblocage » vers la progression avec contexte ; si le lot 03 n'est pas encore là, ouvrir son écran existant. Revalider transaction, droits et solde au moment d'acheter. Prévenir les doubles achats pendant l'attente.

Le mode test utilise le portefeuille de développement existant ; il est clairement identifié et ne modifie pas les règles de la partie normale. Les textes et prix proviennent du même catalogue que les transactions. Corriger les contradictions d'interface, sans rééquilibrer tous les prix ou niveaux dans ce lot.

## Textes à remplacer

| Actuel observé | Nouvelle présentation |
|---|---|
| Composants jouables | Nom du rayon ou « Pièces de montage » |
| Catalogue de conception | Espace de développement, séparé du parcours d'achat |
| Ouvrez une pratique compatible | Condition précise et lien de déblocage |
| Esche proposée aux poissons compatibles | Rôle simple + groupes éligibles issus des données |
| Paramètres de prototype et stock | « Caractéristiques » ; détails internes hors parcours joueur |
| Une portion / 5 pièce | « 1 portion » / « 5 pièces » selon la valeur |

## Socle commun à livrer dans ce premier lot

Tokens, en-tête, navigation exclusive, état vide, carte/ligne d'objet, statut, filtre, panneau de détail et gestion des retours. Réutiliser l'existant plutôt que créer un second système. Les anciens écrans sont remplacés une fois les parcours vérifiés ; ne pas maintenir deux boutiques concurrentes.

Préparer les points d'intégration pour objectifs (lot 03), ouverture depuis un poisson (lot 02) et décorations (lot 04). Les noms des services et fichiers sont à découvrir dans le dépôt. Aucun changement du shader d'eau ni chantier Blender dans ce lot.
