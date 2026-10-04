# Chantier — Habiller la première carte avec des assets gratuits

Lis `CATALOGUE_ASSETS_GRATUITS_FISHDEX.md`, `COUVERTURE_40_FAMILLES.md`, `selection_assets.json` et `INTEGRATION_ET_RECETTE.md`, puis le fichier de passation et les instructions du dépôt actuel.

Réalise une amélioration visuelle de la première carte livrée à partir de cette sélection. Audit puis téléchargement ciblé des ressources gratuites sous CC0, préparation des textures/modèles et intégration progressive dans le jeu. Respecte la DA naturelle du monde et Basalte & Turquoise pour l’interface. Aucun achat ni abonnement supplémentaire. Pas de génération Tripo obligatoire ; Blender est utilisable pour importer, nettoyer, réduire et exporter les ressources existantes s’il est disponible.

La carte proposée précédemment s’appelait Étang des Aulnes ; la version visitée porte Étang des Saules. Vérifie le nom/ID actuels, ne recrée pas une carte ni ne la renomme pour suivre un ancien document. Réutilise le terrain, les profondeurs, six postes ou leur équivalent actuel, ancrages de caméra, accès et événements d’eau. Les 40 familles servent de couverture de besoins, pas d’ordre de charger 40 fichiers.

Procède dans cet ordre :
1. État initial et captures depuis chaque poste, assets existants, moteur/version/loader, coûts de rendu et transfert.
2. T01–T06 selon les matériaux réellement utiles, avec UV à l’échelle, transitions de berge et roughness crédible.
3. A01 : environnement léger et soleil cohérent ; préserver le cycle horaire déjà actif.
4. M01, M02, M03 : silhouettes végétales et nénuphars ; sélection restreinte, instances et niveaux de détail.
5. M04 si le ponton existant exige un remplacement ; sinon le texturer avec T05. M06/M07 et accessoires seulement si le résultat/budget les justifie.
6. Reconnecter effets au contact, contrôler les volumes de jeu, produire captures in-game des postes et validation mobile.

Pour chaque ressource externe, ouvrir la fiche officielle et télécharger via le lien réellement proposé ; ne pas inventer une URL, ne pas installer un plugin payant. Kenney permet de continuer sans don. Quaternius : choisir le téléchargement gratuit du pack 2022, pas un bundle payant. Ne pas faire de moissonnage du site Poly Haven ; utiliser les téléchargements autorisés ciblés. Si la récupération est bloquée, poursuivre les autres assets et inscrire le fichier précis à fournir manuellement dans la passation.

Ne conserver au runtime que les ressources nécessaires. Les fichiers sources, licences et scripts restent dans un emplacement exclu du bundle public autant que le projet le permet. Pour les sources trop grandes, utiliser le stockage d’assets déjà présent plutôt que grossir le dépôt git sans vérifier le workflow.

Complète le registre des assets intégrés : auteur, URL, licence, date, hash, variantes, triangles exportés, texture(s), taille transférée et localisations sur carte. N’annoncer aucun fichier téléchargé, intégré ou validé sur iPhone sans preuve. Exécute les vérifications adaptées et la recette. Mets à jour la passation Claude/Codex. Déploie sur le projet Vercel du jeu déjà autorisé une fois son identité vérifiée.
