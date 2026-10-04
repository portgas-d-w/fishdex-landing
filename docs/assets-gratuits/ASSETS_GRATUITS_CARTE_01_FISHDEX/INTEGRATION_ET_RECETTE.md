# Intégration, budgets et recette

## 1. Audit du dépôt

Ce dossier ne contient pas le code source du jeu. Vérifier ce qui est déjà livré avant toute modification : carte, noms/IDs, échelle, postes, assets, renderer, version moteur, UV, éclairage, loader, eau, obstacles, profils de qualité et pipeline Vercel. Une amélioration des menus peut être en cours : limiter ce chantier aux fichiers visuels de carte et coordonner les modifications des fichiers communs dans la passation.

Mesurer un état initial, puis comparer à heure, caméra et profil identiques : frame time médian et p95, résolution réelle de rendu, triangles soumis, draw calls, taille des textures décodées/VRAM estimée, octets transférés à froid, durée de chargement et chargements en double. Séparer la scène principale des passes de reflet/ombre.

## 2. Un panier cohérent

Six matières initiales au maximum, une famille de végétation, roseaux/nénuphars et un environnement suffisent pour une première passe. Tout le catalogue n’est pas un panier obligatoire. Les feuillus Quaternius sont une approximation de production : verts modérés, silhouettes variées et tailles plausibles. Ne pas peupler un étang tempéré de palmiers ni garantir une espèce d’arbre absente du pack.

Comparer M04 à notre ponton ; conserver le meilleur mesh utile. Le trimsheet du pack exige ses propres UV. Remplacer sa texture par T05 sans retoucher les UV peut casser le rendu : conserver le matériau de l’auteur ou adapter la géométrie/UV expressément. Éviter un matériau par planche.

Choisir M01 ou M06 pour une famille de rochers, puis rapprocher couleur, détail et roughness des autres matières. Les modèles scannés M06/M07 demandent parfois une réduction et un bake : conserver une source intacte, vérifier la silhouette après chaque export. Une décimation automatique peut dégrader les cartes alpha, les UV et les branches fines ; ne pas l’appliquer uniformément aux arbres.

## 3. Export et chargement

Livrable modèle : GLB glTF 2.0, échelle métrique validée avec un étalon 1 m, pivot conforme au registre actuel, transformations cohérentes. Ne pas inverser une deuxième fois la handedness ou la verticale. Garder collisions et volumes d’accrochage simples, séparés des meshes visibles. Les noms LOD0/1/2 ne suffisent pas : programmer explicitement leur sélection dans le registre.

Préparer 512–1024 px pour les matières usuelles ; 2048 seulement pour une surface proche qui le justifie. Télécharger 1K puis générer 512 si utile. Normales et masques sans compression destructrice visible ; ne pas envoyer height/displacement non utilisés. Préférer PNG/JPEG comme première version sûre. Évaluer KTX2 ensuite si loader/transcoder disponibles, en contrôlant la qualité et le cache des décodeurs. Partager les images/matériaux entre modèles sans copier les mêmes textures dans vingt GLB.

Outil gratuit utile : [glTF Transform CLI](https://gltf-transform.dev/cli). Sa documentation couvre inspection, validation, déduplication, réduction et compression. Utiliser une version compatible/pinnée dans le projet, consulter son aide actuelle. Le passage par `optimize` avec des options par défaut n’est pas un certificat de qualité ; inspection avant/après, validation et essai réel obligatoires.

Charger localement depuis l’hébergement du jeu ; les sites d’assets ne servent pas de CDN au runtime. Cache HTTP versionné selon le framework existant. Pas de préchargement de tous les modèles source ni de téléchargements d’assets lointains inutiles dès l’accueil. Montrer le jeu quand les ressources essentielles sont prêtes, puis charger les finitions sans blocage gênant.

## 4. Cibles de départ, à mesurer

| Ressource | Cible de conception |
|---|---|
| Pierre petite | 200–600 triangles proche, moins à distance |
| Rocher repère | 1 500–3 000 triangles proche |
| Buisson | 500–1 500 triangles selon cartes alpha |
| Feuillu proche | 3 000–8 000 triangles, silhouette contrôlée |
| Touffe d’herbe | 20–180 triangles |
| Groupe de roseaux | 200–750 triangles |
| Groupe de nénuphars | 100–500 triangles |
| Souche/tronc | 1 000–2 500 triangles proche |
| Module ponton | 400–1 200 triangles |
| Banc | version 900 triangles comme point de départ |
| Matière opaque | généralement 1 matériau ; 2 si utile |
| Texture répétitive | 512–1024 px, mipmaps |
| Ciel mobile | HDR source 1K ; environnement préfiltré réduit |

Ces valeurs sont des choix de prototype, pas des chiffres mesurés sur les archives ni des limites universelles. Réviser après analyse. Définir les seuils LOD selon taille projetée à l’écran et caméra portrait. Instancier par secteurs spatiaux pour éviter de rendre toute la forêt ; de grandes collections d’instances peuvent avoir une boîte de visibilité globale. Évaluer ombres et reflets séparément : un arbre invisible dans la vue principale peut encore coûter dans une passe.

Objectif de premier jalon : viser au moins 30 images/s stables sur l’iPhone réel et limiter les nouveaux assets essentiels à environ 15 Mo transférés à froid (cible ajustable, pas garantie). Mesurer également l’ensemble jeu + assets et la mémoire décodée ; une image PNG compressée petite peut occuper davantage de mémoire une fois chargée. Ne pas prétendre avoir mesuré le téléphone avec une fenêtre de bureau étroite.

## 5. Composition des postes

| Poste fonctionnel du plan | Composition et ressources |
|---|---|
| Ponton dégagé | Bois T05 ou M04 ; rive T01/T03 ; laisser lancer et épuisette libres |
| Anse abritée | T02, T03 et petits groupes M03 ; végétation basse M01 |
| Rive ouverte | T01/T04 ; quelques arbres M01 en arrière, recul de canne dégagé |
| Bordure de roseaux | M02 en bouquets, T02 ; petites trouées de lancer ; pas un mur uniforme |
| Pointe et cassure | T04 et 1–2 rochers M01/M06 ; fosse du gameplay inchangée |
| Bois immergé | Meshes de tronc/branches actuels + T06 ; souche M07 facultative ; voie de réception libre |

Associer ces rôles aux IDs actuels. Les coordonnées et conditions de déblocage du vieux plan ne remplacent pas silencieusement celles du jeu livré. Placer les végétaux au sol et les feuilles flottantes sur la surface prévue. Les rochers doivent toucher le terrain, sans flottement ni chevauchement absurde. Garder des masses irrégulières, premier plan sobre et une silhouette reconnaissable depuis l’autre rive.

Les décorations ne changent pas toutes la population des poissons. Conserver les habitats existants ; si un nouvel obstacle doit être fonctionnel, faire une décision explicite et synchroniser son volume visible/de jeu. Ne pas simuler un accrochage invisible simplement parce qu’un arbre décoratif a été chargé.

## 6. Eau et finitions associées

Créer si nécessaire deux petites normales répétables originales par code. Préparer un masque de contact dérivé de notre relief, et des masques de rides originaux. Un pack téléchargé ne connaît ni notre profondeur ni les trajectoires des poissons. Garder le shader de la scène et ses contrats d’événements.

Utiliser A01 pour une base d’ambiance/reflet de ciel ; préfiltrer en format adapté au moteur installé. Un environnement HDRI ne reflète pas automatiquement nos arbres ou le ponton : conserver/adapter le système de réflexion de scène existant avec son budget. Si le jeu simule plusieurs heures, synchroniser ciel/soleil/eau ou limiter ce HDRI au profil diurne ; ne pas laisser un soleil de midi se refléter en pleine nuit.

F01 apporte des masques génériques : ne déclencher un splash que pour un contact réel avec la surface. Un poisson qui nage profond ne produit pas une gerbe d’eau permanente. Les rides suivent l’impact et diminuent ; éviter les effets de magie ou l’écume océanique au bord de l’étang. Contrôler la lisibilité du fil et du poisson au premier plan.

## 7. Validation

1. Charger la carte à froid sans erreur ; tous les GLB, textures et éventuels décodeurs répondent et proviennent du projet.
2. Contrôler les six postes en portrait et paysage, même heure/profil ; garder captures avant/après.
3. Faire lancer, attente, combat, réception et ouverture/retour des menus ; aucune caméra, profondeur ou collision altérée involontairement.
4. Vérifier contacts au sol/eau, absence de z-fighting, alpha propre de profil et pas d’ombres noires sur la végétation.
5. Vérifier bois mat, terre non métallique, texture à bonne échelle et aucune répétition géante visible.
6. Contrôler eau avec ciel/soleil, poissons profonds et impacts ; pas de reflets incohérents avec l’heure.
7. Répéter dix changements de poste ; pas de multiplication des meshes/textures ni croissance de mémoire non expliquée.
8. Mesurer une session réelle de plusieurs minutes sur iPhone, relever appareil, navigateur, profil, chauffe et frame times ; garder les contrôles de disposition de bureau séparés.
9. Comparer mode économique/standard/élevé : mêmes rôles de décor, niveaux de détail adaptés ; aucun téléchargement doublé sans nécessité.
10. Vérifier sauvegarde, captures et droits d’accès existants ; régénérer les previews des postes depuis le jeu.

La recette du jeu n’est pas exécutée par le présent dossier. Toute mesure devra être remplie par Codex après intégration.
