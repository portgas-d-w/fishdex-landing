# Carte et eau 0.12 — état du 3 octobre 2026

Agent : Codex. Source de conception : ZIP `CHANTIER_CARTE_COMPLETE_EAU_FISHDEX_CODEX`, les quatre consignes et leurs JSON archivés dans ce dossier. Les JSON proposés ont été adaptés aux identifiants, droits et interactions réellement présents. La référence est main `e72ad2b`, jeu 0.11. Publication et résultats définitifs consignés en fin de chantier.

## Carte réellement livrée

Un étang irrégulier commun de 125 × 92 m dans un terrain de 180 × 140 m, six ancrages et une bathymétrie continue de 0,05 à 8 m. `src/game/pond-map.json` contient le contour, les six postes, les secteurs, la réception, les habitats et le dégagement arrière. `pond-map.ts` fournit les coordonnées réversibles, la rive, la profondeur, le sol et les microzones ; sondage, présentation, rendu du fond et couleurs de l’eau consultent cette même source. Le niveau physique est zéro ; les rides de normales sont visuelles.

La translation de conception de +39 m en Z conserve exactement la caméra du ponton historique : [0, 4.2, -8.5], cible [0, 0.1, 5.5]. Les autres ancrages ont été rapprochés du contour réel, orientés vers l’étang et placés à environ 2 m à l’intérieur du bord. La caméra à 4,2 m conserve la lisibilité des commandes et du fil déjà vérifiée ; la hauteur indicative du dossier n’a pas été appliquée aveuglément. Les six postes sont des vues du même terrain, sans déplacement libre. Les méthodes conservent leur portée actuelle ; les angles de la carte et les couloirs en mètres se cumulent.

| ID conservé | Fonction réelle | Décor et contrainte |
| --- | --- | --- |
| jetty / P01 | Départ normal, dépôt au coup, réception dégagée | Ponton de quatre modules et quatre piles, secteur ouvert, progression initiale |
| cove / P02 | Abri et présentation peu profonde | Nénuphars, roseaux et obstacle de fil effectivement simulé |
| bank / P03 | Rive ouverte et présentation à distance | Roches et herbes proches, fond continu variable |
| reed-bank / P04 | Ouverture acquise par initiation | Couloir étroit, deux volumes de roseaux, pêcheur existant et droit permanent |
| point / P05 | Exploration de la cassure | Roche repère, profondeur issue du bassin commun, vent latéral simulé existant |
| timber / P06 | Approche d’abris | Tronc et deux volumes de branches, abrasion et accrochage existants |

Les trois accès initiaux restent jetty/cove/bank. Le profil TEST ouvre les six. Les neuf autres contextes et leurs anciens identifiants restent accessibles : rivière, lac profond, bateau et parcours spécialisés. Leurs sols réutilisés sont reconstruits depuis leur fonction de profondeur existante, sans substituer le fond de l’étang. Aucun poisson d’un autre continent n’est ajouté à l’étang. Les 66 identités, 52 captures, 14 observations, 29 formes, 22 méthodes et 55 recettes restent ceux de 0.11 ; l’esturgeon gold reste confirmé.

## Eau et événements

Matériau local Babylon 9.28 : deux mouvements de normales procédurales, Fresnel, couleur olive selon profondeur et rive, petites irrégularités, transparence bornée et reflet d’environnement. Standard/haut ajoutent une réflexion plane sélective ; aucune réfraction avec deuxième rendu du lac. La transparence laisse lire le fond proche, sans distordre les berges ou la ligne hors de l’eau. L’alternative `@babylonjs/materials` 9.28 a été extraite dans `.migration` pour comparaison locale uniquement ; aucune dépendance de production ajoutée.

| Profil | Rides / gouttes disponibles | Reflet plane | Cadence réelle |
| --- | --- | --- | --- |
| Économe, défaut | 12 / 16 | Environnement seulement | Aucune passe supplémentaire |
| Standard | 20 / 32 | 256 px, au plus 48 objets | Une passe toutes les 6 images rendues |
| Élevé | 28 / 48 | 512 px, au plus 48 objets | Une passe toutes les 3 images rendues |

À 30 images rendues/s, ces cadences donnent environ 5 et 10 mises à jour/s ; elles sont adaptées au budget mesuré, pas annoncées comme 10–30 Hz garantis. Poste, ambiance et famille remplacée rafraîchissent le reflet. Le retour au profil faible rebranche une texture valide avant suppression du miroir. Les qualités ne changent aucune conséquence de pêche. Tous les pools sont alloués une fois ; le journal garde 64 événements, avec IDs croissants et lecteurs indépendants. Les traces continues sont espacées d’au moins 0,35 s de simulation. La pause fige la source commune de temps et de vent.

| Événements | Raccordement réel / limite |
| --- | --- |
| cast_impact, line_deposit | Passage casting → waiting ; dépôt discret pour les moteurs de dépôt, impact pour le lancer |
| float_enter, float_motion, bite_float | Entrée, déplacement réel du terminal et force de touche au flotteur |
| float_submerge, float_resurface | Franchissement de profondeur du terminal ; aucun seuil de fatigue |
| strike_surface | Ferrage et terminal à moins de 35 cm de la surface ; absent si contact profond |
| lure_surface, lure_submerge | Récupération proche de surface et franchissement d’immersion du leurre |
| bait_sink | Début de descente au contact du montage ; retour très discret, aucune piste de bulles permanente |
| feeder_impact | Impact d’une cage effectivement présente dans le montage |
| groundbait_impact | Validation et débit réels des portions au point choisi |
| fish_near_surface, fish_surface_turn | Mouvement du poisson à moins de 35 cm de la surface, orientation et traction réelles |
| fish_surface_break, fish_dive | Non applicables : le combat actuel ne simule pas de saut ni émergence suivie de replongée ; démonstrations visuelles isolées seulement |
| line_surface_drag | Déplacement du point de contact de la ligne pendant le combat |
| obstacle_disturbance | Contact avec un véritable volume de végétation/bois sous tension ; un accrochage TEST forcé sans volume ne produit pas de faux contact |
| net_enter, net_capture, net_exit | Entrée en réception, critères géométriques de capture et relevage/sortie ; aucun événement de victoire anticipé |
| fish_release | Bouton Relâcher de la prise courante, une seule fois par individu, contact puis départ bref de l’acteur existant |
| ambient_surface | Contact explicite du clonk existant ; aucune touche ambiante aléatoire inventée dans l’étang |
| rain_surface | Non applicable : aucune pluie simulée ; démonstration isolée seulement |
| wind_change | Source de vent existante, commune aux rides et aux végétaux ; variantes d’ambiance sans nouvelle météo |
| boat_wake | Vitesse réelle du contexte bateau ; non applicable aux six rives de l’étang sans bateau |
| spot_transition | Changement validé au repos, nettoyage des émetteurs locaux et actualisation du reflet |

Le son conserve l’AudioContext existant, déverrouillé par geste, avec un bref son synthétique de contact et une limite de simultanéité. Les enregistrements de filet, égouttement et impacts différenciés sont à produire ultérieurement. Le jeu reste lisible son coupé.

## Décor, éclairage et remplacement

Terrain de 2 m par cellule, terre granuleuse 256 px, bois proche 256 × 128, pierres, végétation opaque et arbres de formes irrégulières. Groupes par famille/matériau et cellule de 24 m ; couronnes réduites loin des ancrages fixes. Il s’agit d’un détail spatial adapté aux six caméras, pas d’un LOD dynamique complet ni d’un déplacement libre. Matin doux principal ; couvert et soirée sont des réglages visuels TEST, sans effets supplémentaires sur les poissons. Vent de shader partagé avec la simulation. Une lumière directionnelle et une lumière d’environnement ; ombres de 512 px réservées à la qualité générale élevée et aux objets importants.

`src/render/environment-registry.json` définit les familles placées, versions, dimensions, pivots, matériaux, contrats LOD, collisions et raccords. Les ressources finales sont nulles : le jeu emploie donc les représentations procédurales. Les futurs chemins sont limités à `/models/environment/*.glb` ; dimensions et chargement sont validés avant substitution d’une famille. Les racines glTF conservent la conversion de coordonnées du chargeur, sous un parent d’instance. Les requêtes périmées sont libérées. Fichier invalide : ressource précédente conservée. Retour au provisoire : instances/conteneur libérés et maillages existants réactivés. Les collisions et la réception restent définies dans les règles de jeu.

Lightmaps préparées : fournir un fichier PNG linéaire et TEXCOORD_1/UV2 sur les maillages concernés, renseigner `lightmap` dans le registre ; le code affecte explicitement `lightmapTexture`, `coordinatesIndex=1` et `useLightmapAsShadowmap`. La lightmap du matin est désactivée pour couvert/soirée et rétablie au matin. Aucun précalcul réel ou export Blender n’a été produit ; cette branche reste à tester avec un asset final disposant d’UV2. Les fichiers LOD finaux ne sont pas chargés tant qu’ils sont absents : leur sélection dynamique fera partie de la livraison de ces fichiers.

L’inventaire `assets_manifest.json` et la liste `ASSETS_A_CONCEVOIR_BLENDER.md` sont actualisés selon les objets réellement placés. Chaque référence de poste vient du jeu, interface masquée. Les arbres, berges, plantes et sons restent provisoires et embellissables sans migration des captures.

## Essayer sur téléphone

1. Ouvrir fishdex.fr, actualiser la page après publication. Partie normale par défaut ; sauvegardes locales liées au navigateur/appareil.
2. Menu → Aide et réglages → Mode test → Activer le profil TEST. Le badge TEST et ∞ confirment le profil séparé ; prix, stock, compatibilité, usure et casse restent ceux du jeu.
3. Dans Mode test, préparer le kit d’une technique existante, choisir le poste puis l’individu, la taille et la graine. « Combat direct » contourne l’attente pour vérifier les gestes ; « Touche rapide » conserve le ferrage. Pour la distribution naturelle, fermer les menus et déposer/lancer normalement.
4. « Carte et eau · essais visuels » ouvre le panneau fermé par défaut : six postes, trois qualités, trois ambiances, graine visuelle, profondeur/habitats/obstacles/secteurs, effets isolés et ressources. Les effets isolés ne modifient ni la capture ni les récompenses. Le menu pause la simulation ; Voir cet effet ferme les menus pour reprendre l’horloge.
5. Déposer au coup depuis le bas, ferrer à la touche, guider la canne ; au moulinet, maintenir la récupération avec l’autre doigt. Réception : placer la tête sous le poisson puis relever par un geste court. Vérifier photo, carnet TEST et conservation après actualisation.
6. Régler Rendu de l’eau dans Aide pour une préférence persistante. Tester les six rives, les trois lumières, la lisibilité du flotteur/fil, les champs, le paysage et dix transitions au repos. Revenir au profil normal dans Mode test pour retrouver la partie normale.

## Contrôles, mesures et limites

Référence avant modification : `npm ci`, check 193/193, huit captures et mesures dans `docs/apercus/carte-eau/before-*`. Contrôles après changement : TypeScript, tests Node de carte/événements/réception, bancs naturels des 52 poissons et 22 méthodes/55 recettes, build public ; navigateurs Chromium desktop 1440 × 900 et mobile émulé 390 × 844. Les rencontres forcées des tests UI sont signalées comme telles ; une photo sauvegardée et une réception réelle sont vérifiées, pas seulement un bouton ou une entrée JSON.

Les mesures avant/après du ponton conservent caméra, qualité générale, DPR, graine et cadrage. Comparaison du matériau simple, du shader local et du WaterMaterial Babylon sur le même terrain. Les fichiers JSON contiennent résolutions internes, nombre d’images, CPU de scène, appels de dessin, textures, pools et ressources après transitions. Le CPU de scène n’est pas une mesure GPU ; les FPS SwiftShader sont une émulation sur PC. Les mesures de transfert du serveur de développement sont distinguées du build livré. Aucun objectif de 30/60 FPS, VRAM, batterie ou chauffe appareil n’est garanti.

À tester sur appareil : Safari iPhone 14 Pro, Android, deux pouces et un doigt, réception/grande canne, visibilité et son après verrouillage/reprise, chauffe et autonomie après plusieurs minutes, réseau froid et mémoire GPU. À faire ensuite : assets finaux prioritaires à partir de l’inventaire, lightmaps/LOD livrés et contrôlés, équilibrage humain du nouveau relief.
