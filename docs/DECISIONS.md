## 4 octobre 2026 — Refonte des menus par lots
Les quatre dossiers UI sont réalisés séquentiellement. Socle léger TypeScript/DOM et dialogues natifs conservés : les sous-fiches utilisent un dialogue propre pour préserver filtres, scroll et focus. Tokens Basalte & Turquoise existants réutilisés, interfaces mobiles pleine hauteur ; filtres et conseils interrogent les règles actuelles sans rééquilibrage. Publication unique après validation transversale demandée par le propriétaire. Aucun shader ni modèle modifié.

# Journal des décisions

| Date | Décision | Motif / statut |
| --- | --- | --- |
| 2026-10-03 | Carte commune 0.12, six anciens IDs, translation Z +39 et caméra historique du ponton | Une source pour fond, couleurs, sondages et rencontres ; comparaison avant/après et droits acquis conservés. |
| 2026-10-03 | Eau olive, normales procédurales, reflets sélectifs 256/512 et profil économe par défaut | Comparaison avec matériau simple et WaterMaterial 9.28 ; limiter passes et dépendances. Cadences en images rendues, performance appareil à mesurer. |
| 2026-10-03 | Journal d’eau sur l’horloge de simulation, effets isolés sans récompense et non-applicabilité explicite | Éviter impacts à chaque image et faux sauts/pluie ; qualités visuelles sans changement de pêche. |
| 2026-10-03 | Familles substituables après validation, racine glTF conservée sous parent d’instance | Dimensions/pivots/collisions/raccords indépendants ; lightmaps explicites sur UV2 et désactivées hors ambiance correspondante. |
| 2026-10-01 | Mouliner par appui maintenu, arrêt au relâchement | Dernière demande utilisateur ; remplace le geste circulaire. Canne indépendante et molette PC conservées ; même commande au leurre. |
| 2026-10-01 | Gestes natifs bloqués seulement sur la scène/commandes | Dernière demande : user-select/WebKit/callout, contextmenu/selectstart ; menus défilables et champs sélectionnables. Images sans glissement natif. |
| 2026-10-01 | Fil disponible, flexion amortie, fatigue causale et frein automatique | Mission jointe remplace les règles 0.3 : ne pas détendre automatiquement au relâchement ; effets progressifs des angles et force relative au matériel. Capture proche sous contrôle, sans minuteur de victoire. |
| 2026-10-01 | Départ du lancer dans le tiers inférieur ; projection puis relâchement central/haut | Vitesse récente dominante, amplitude secondaire et portée liée au matériel ; préparation continue, annulation/restauration sur interruption. |
| 2026-09-30 | Solo, navigateur, priorité mobile | Direction exprimée par l’utilisateur |
| 2026-09-30 | Codex commence, Claude reprend ensuite | Quota Claude temporairement épuisé ; document commun de relais |
| 2026-09-30 | Babylon.js + TypeScript + Vite | Projet statique 3D, déploiement Vercel simple |
| 2026-09-30 | Nom provisoire « Au fil de l’eau » | Proposition pour donner une identité au prototype ; modifiable |
| 2026-09-30 | Étang, 3 postes, 2 appâts, 5 espèces | Périmètre de départ limité et vérifiable |
| 2026-09-30 | Carnet, tailles records, remise à l’eau | Récompense immédiatement lisible sans boutique ni économie prématurée |
| 2026-09-30 | LocalStorage + export/import | Pas de coût backend ni compte joueur ; synchronisation manuelle assumée |
| 2026-09-30 | Blender pour 5 exports GLB, textures 512² | Réutiliser le pack acheté, alléger le téléchargement |
| 2026-09-30 | Vercel préparé, cible à identifier | Le compte existe, mais aucun site précis n’a été désigné |
| 2026-09-30 | Cible confirmée : `portgas-d-ws-projects/fishdex-landing` ; remplacement autorisé après préproduction | Instruction explicite du propriétaire, remplace la cible à identifier |
| 2026-09-30 | Conserver le dépôt GitHub et `main`, remplacer Next.js par le jeu Vite à la racine | Préserver projet Vercel, domaines et déploiement Git |
| 2026-09-30 | Tag Git, bundle local et ancien déploiement FishDex conservés | Retour arrière sans supprimer de projet ni réécrire l’historique |
| 2026-09-30 | Suspendre le rendu de l’étang pendant modales/pause | Éviter le rendu inutile, notamment derrière le poisson ; gain FPS téléphone non mesuré |
| 2026-09-30 | E2E sur 5174, 1 worker ; smoke du build sans hook QA | Éviter le serveur normal sans QA et la concurrence du rendu logiciel Windows |
| 2026-09-30 | Signaler le poisson prêt après matériaux WebGL et première image | Les captures smoke ont révélé un canvas vide malgré le fichier GLB chargé |
| 2026-10-01 | Mission autonome P0–P4, économie virtuelle et aquarium autorisés | Remplace l’attente de retour téléphone pour poursuivre ; appareil réel toujours non validé |
| 2026-10-01 | Lancer libre, canne/fil comme indices du combat, bouchon immergé | Correction prioritaire explicite ; victoire liée à proximité et contrôle |
| 2026-10-01 | Sauvegarde v2 avec même clé, photos Blob séparées et récompenses uniques | Préserve v1 sans inventer d’individus ni rejouer les gains |
| 2026-10-01 | 96 fiches FishDex, 59 binômes déclarés, 15 espèces du pack jouables | Contenu réel inspecté, variétés et ressources absentes marquées prévues |
| 2026-10-01 | Trois méthodes effectives, nage procédurale provisoire | Flotteur, récupération du leurre, fond ; aucun rig livré dans les 50 FBX |

| 2026-10-01 | Correction 0.3 : scène entière, menu en pause, lancer par geste uniquement | Demande explicite ; fonctions et sauvegardes conservées |
| 2026-10-01 | Deux commandes rondes selon image utilisateur : canne glissée à gauche, moulinet circulaire à droite | Précision utilisateur pendant exécution ; aucun état du poisson ni jauge |
| 2026-10-01 | Orientation et hauteur déterminent récupération, contact et tension ; tours par mouvement | Supprime le maintien/relâchement dominant ; comparaison contrôlée documentée |
| 2026-10-01 | Sauvegarde v2 inchangée, conseils par clé locale distincte | Aucun risque de migration inutile ; photos et récompenses préservées |

| 2026-10-01 | Cadrage de canne adapté au champ horizontal, sans modifier les forces | Pointe visible aux extrêmes portrait/bureau ; indication de tension préservée |

| 2026-10-01 | Précision 0.3.1 : rétablir une jauge compacte comme sur l’image, entre les deux commandes | Dernière instruction utilisateur remplace le retrait de jauge en 0.3 ; aucun descriptif de poisson |

La plaisance du combat, la direction artistique et la longévité de la boucle
doivent encore être validées par l’utilisateur. Ne pas confondre un prototype
fonctionnel avec un jeu prêt à diffuser largement.

- 1 octobre 2026, structure 0.5.0 : document unique prioritaire ; FishDex cœur de navigation, sauvegarde v3 migrée, catalogues communs, achats confirmés et niveau 2 pour précision, modes appui/cercle, contenu futur explicitement non jouable. Détails DECISIONS_JEU.md.

- 2 octobre 2026 : nouvelle consigne remplace l’ordre méthode/canne et annule tout mode circulaire. Canne → méthode compatible → montage ; Ma canne par défaut, Mon sac uniquement possessions, Ensembles références sans copie de stock.
- 2 octobre 2026 : version 4 et même clé de sauvegarde ; anciens durables conservés, kit virtuel illimité, composants payants en quantités séparées. Ligne valide réserve avant lancement ; esche débitée à la résolution, réutilisables libérés ; événement unique par instance active. Rechargement ramène la ligne sans nouvelle capture et consomme une portion utilisée une fois.
- 2 octobre 2026 : catalogues riches chargés à la demande, 274 exemples regroupés dans 84 familles et sans achat ; seuls prototypes fonctionnels ont des paramètres/prix originaux de jeu. Trois méthodes seulement et aucun nouveau modèle. Taxons douteux restent en attente.
- 2 octobre 2026 : rencontres par présence locale, strate et régime ; notes de combat, strates, variations, tarifs et coefficients de nœud sont des hypothèses d’équilibrage, jamais des faits scientifiques. Forces encore normalisées ; masses en g et stocks de fil en m distincts.

- 2 octobre 2026, DA 0.7 : Basalte & Turquoise selon guide du propriétaire. Palette réservée aux interfaces ; monde naturel, poissons fidèles. Police système, headers opaques sans flou plein écran. Aucun changement de gameplay, de caméra, de taxons ou de sauvegarde v4.
- 2 octobre 2026 : conserver matériaux Standard, regroupement statique, quatre roseaux animés et pools de trois rides/quatre gouttes ; textures procédurales 256²/512×128 calculées une fois. Reflets analytiques mobiles, détail spéculaire optionnel en haute qualité ; aucun miroir de scène ajouté.
- 2 octobre 2026 : plafond éco grand écran 1024 au lieu de 1280 après baisse mesurée sur le rendu logiciel ; mobile portrait et DOM natif conservés. Mesures CPU de soumission distinguées de la cadence rendue ; aucun chiffre GPU/iPhone inventé.

- 2 octobre 2026, progression 0.8 : pole est une nouvelle pratique sans reel ; float/bottom/lure restent réelles. V5 même clé, droits anciens conservés, copie v4 locale exportable pour retour. Rareté dérivée distincte de l’accès et des forces.
- Six postes / une scène, trois ouverts, roseaux permanents par niveau 3 OU deux prises au coup dans un cercle accessible. Point/timber restent futurs jusqu’à contraintes implémentées. Aucun multiplicateur de force lié au poste.
- Distribution par populations + profils + microzones ; amorçage et trajet du leurre influencent la rencontre au moment réel. Configs et tailles sont des hypothèses de jeu versionnées. Aucun trophée garanti.
- Combat assisté reste expérimental et commandé par l’appui, ignoré au coup. Kit de secours sans gain/vente ; pertes aval et réserve conservées. Banc et émulation ne remplacent pas une session humaine au toucher.

## 2 octobre 2026 — périmètre V2 et profil de test

La demande V2 remplace les limites historiques à deux pratiques. Les quatre familles historiques restent des adaptateurs de moteur, les 22 identifiants de techniques et 55 recettes du dossier sont conservés séparément. Mode test explicite et contrôlé par build, sauvegarde/photo séparées, portefeuille illimité par indicateur et coûts théoriques finis ; achats, incompatibilités et pertes restent réels. Aucun transfert vers le profil normal.

## 2 octobre 2026 — catalogue V2 fonctionnel, version 0.9.0

- Les 22 techniques et 55 recettes partagent des moteurs et variables physiques ; chaque approche modifie présentation, contexte ou équipement. Les recherches complétées et limites sont dans RECHERCHE_TECHNIQUES_V2.md ; les SKU incomplets ne deviennent pas des achats paramétrés arbitrairement.
- Sauvegarde v6 à même clé, lecture v1–v5, original avant-v6 exportable. Droits acquis conservés ; les captures historiques sans ID de technique n'obtiennent pas une maîtrise rétroactive inventée. Profil TEST et photos distincts, disponibilité dev/preview, production normale sans entrée test.
- Réception après arrivée réelle, séparée de la récompense ; même poisson, petite prise/épuisette/tapis, sections ramenées au kit. Le coup ne récupère jamais au moulinet ; grande canne et carpodrome déboîtent graduellement sous tension.
- Six postes d'étang désormais implémentés, plus rivière/lac profond/embarcation, même scène/moteur ; courant/vent, profondeur accessible, obstacles et parcours borné du bateau effectifs. Aucun multiplicateur de puissance d'espèce par difficulté du poste.
- 33 emplacements de montage, 80 appâts/amorce/leurres, portance/masse, diffusion/PVA/tenue, soie/pointe/potences et pertes localisées. Mon sac filtre les composants compatibles avec le montage actif. Les kits gratuits sont renouvelables sans argent/XP ; pièces payantes et réserves restent finies.
- Quinze espèces actuelles uniquement. Mouche sur espèces compatibles du pack ; gambe perche avec une branche ferrée/une prise. Truite/corégone sans modèle restent futurs. Bateau, soie et réception procéduraux/simplifiés, aucun nouvel asset 3D généré.
- Assistance de récupération toujours expérimentale. Banc naturel à contrôleur idéal et rendu SwiftShader distinguent vérification de logique, équilibre humain et performance téléphone. Aucune garantie de 30 FPS ni test iPhone physique.
- Préproduction reconstruite avec Mode test ; production reconstruite depuis main avec Mode test désactivé. Ne pas promouvoir le binaire preview en production. Retour à 0.8 : préserver les exports v6 et original avant-v6, car la version ancienne ne lit pas v6.

## 3 octobre 2026 — collection poissons 0.10.0

- Le chantier du ZIP remplace la restriction ancienne aux quinze GLB : un poisson confirmé sans modèle exact reçoit une silhouette légère procédurale de sa morphologie, explicitement provisoire. 33 naturels exacts, 33 naturels provisoires et 29 formes provisoires ; aucune génération externe. Conversion de 18 FBX existants localement, originaux privés conservés.
- Une identité canonique par taxon/hybride ; formes/écotypes, alias et records séparés. 64 espèces et deux hybrides, 29 formes, compteur réalisable 66. Le placeholder sans identité reste hors progression. Binômes et sources clarifiés avant activation ; correction du texte tiger propagée, texte source brut traçable.
- Quatorze poissons ont une découverte par observation avec effort interrompable/photo, plutôt qu'une attaque ou un combat biologique inventé. Première découverte XP unique, aucun écu répétable ni favori d'aquarium. Les 52 capturables ont au moins un parcours naturel démontré avec préparation réelle.
- Les milieux continentaux et domestiques sont séparés en six postes supplémentaires réutilisant la scène. Courant/profondeur/obstacles simulés ; température et météo informatives. Les valeurs de jeu/profils proches clonés restent des propositions, pas des coefficients biologiques mesurés.
- UUID, graine, gabarit et robe persistent sans reroll entre combat/réception/photo/carnet/aquarium. Pas de puissance par coloration. Tirages fictifs Dorée/Mirage anciens gardés pour les quinze historiques, sans extension aux nouvelles espèces.
- Sauvegarde v7 à mêmes clés, original avant-v7 exportable, aliases normalisés et inconnus conservés comme historique explicite. Droits/gains/stocks/favoris préservés ; profil et Blob TEST séparés. Retour à 0.9 avec export pré-migration, jamais abandon du v7.
- Mesures PC et banc à contrôleur idéal restent distincts de FPS téléphone, équilibre humain et toucher physique. Timings du banc déclarés ; gestes automatisés passent par les vrais événements et des timestamps monotones sans modifier les seuils du jeu.
- Déploiement sur le projet Vercel et domaines déjà autorisés ; revue avec Mode test contrôlée avant rebuild normal depuis main. Conserver le déploiement et tag 0.9 de retour, ne pas promouvoir un build TEST en production.

- Correction explicite du propriétaire (03/10) : l’illustration esturgeon gold est bien celle de cette robe et reste affichée. Le Mode test est aussi disponible sur fishdex.fr pour essayer de partout ; profil normal par défaut et stockage/photos TEST séparés. Cette décision remplace la désactivation du Mode test en production décrite dans les décisions antérieures. Aucune API QA dans le build public.

## 3 octobre 2026 — Gameplay mobile version 2

Le « oui » du propriétaire lance le cahier complet mobile/matériel. Un seul combat géométrique remplace le scalaire et l’assistance ; les préférences anciennes restent lisibles sans procurer d’avantage. Les adaptateurs ne changent pas les droits, les captures ni les recettes. Réception explicite pour tout montage, y compris historique ; déboîtement change la canne mais jamais le fil. Contrôles inversés/un doigt sont ergonomiques. Sondage et amorçage sont des actions ciblées avec stock réel. Aperçu matériel = moteur de présentation existant en SVG. Coefficients centralisés de prototype à mesurer ; appareils physiques et collision du corps/sol derrière la canne hors contrôle actuel. v7 conservée avec champs facultatifs compatibles. Publication autorisée seulement sur le projet existant confirmé après revue, Mode test public conservé.

## 3 octobre 2026 — Eau naturelle 0.12.1

- ShaderMaterial existant conservé, surface physique plane. Tuile périodique128² plutôt que grands cosinus synchronisés ; mipmaps/trilineaire et atténuation lointaine. Profondeur réelle de l’étang via atlas256², transmission exponentielle approximative, fond déjà rendu et Fresnel. Turbidité visuelle de session TEST, sans modifier sauvegarde/poissons ni appliquer un filtre turquoise au monde.
- Base naturelle à tous les niveaux ; un seul MirrorTexture à la fois, frustum réfléchi/cap48. Économe128² en cache (décor fixe), Standard256²/6images, Élevé512²/3images et détails supplémentaires. Pas de passe de réfraction ou effets coûteux ajoutés sans mesure.
- Huit perturbations shader recyclées depuis vrais événements, position/âge/profondeur/vitesse/direction ; aucun impact ambiant permanent. Contacts du décor dans atlas, pas de mousse. Démos TEST restent isolées de captures/récompenses.
- Échéance fractionnaire économe conserve33,33ms, aucune accélération de simulation ni rafale de rattrapage. FPS mesurés sur images rendues ; CPU soumission et GPU logiciel séparés. Environ30FPS à390×844 SwiftShader ne certifie pas le minimum stable sur iPhone ; essais physiques requis avant toute garantie.

| 2026-10-04 | Assets gratuits0.13 : CC0 ciblé, sources hors runtime, matériaux Standard mats et sol précalculé | Première passe PBR puis multi-lectures trop coûteuses sur SwiftShader; conserver palette naturelle et variantes proches utiles. |
| 2026-10-04 | 18 feuillus proches au plus, source glTF partagée/instances gelées et proxies selon pixels | LOD effectif110/70px; silhouettes génériques provisoires, collisions/habitats et IDs inchangés. |
| 2026-10-04 | HDR128 préfiltré hors jeu, matin uniquement; six previews in-game dans les fiches existantes | Pas de mélange HDR diurne au soir ni autre système de carte; mesures appareil restent à faire. |

## 4 octobre 2026 — Refonte UI progression

Objectif suivi facultatif dans v7, sans gains ni changement de règle ; conseils dérivés des seuils existants avec chemins OR explicites. Carte locale et destinations séparées ; embarcation = contexte du lac. Consultation sans déplacement, installation revalidée. Dialogues de gestion peuvent être remis au premier plan, sans redémarrer les scènes de capture/aquarium/observation.

## 4 octobre 2026 — Refonte UI souvenirs

Contrôles et transactions existants déplacés dans des panneaux natifs, sans nouveau service. Prises et observations restent distinctes ; illustration, photo locale et aperçu régénéré ont des libellés explicites. Décor immédiat déclaré, achat distinct, sixième favori remplacé seulement après choix. Réglages et apprentissage séparés ; Mode test public dans un espace de développement distinct. Une scène aquarium, libération des moteurs de présentation à la fermeture ; menus accessibles après échec WebGL.
