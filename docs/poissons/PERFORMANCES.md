# Mesures et budgets — poissons 0.10.0

Codex, 3 octobre 2026. Windows Chromium, ANGLE SwiftShader, qualité éco, DPR 1. Rendu logiciel PC : **aucun FPS GPU mobile, chauffe, autonomie, réseau mobile ou appareil physique mesuré**. Une autre application du propriétaire tourne sur le PC ; la charge n’est pas isolée. Les petites différences de cadence ne démontrent pas un gain.

## Ponton à cadrage identique

`node scripts/fish-reference.mjs after`, référence 0.9 conservée dans `.migration/dist-before-fishes`. Caméra `[0, 4.2, -8.5]`, graine visuelle constante, simulation de pêche suspendue, même taille de viewport et résolution interne. Comptage des frames pendant environ 3,5 secondes après stabilisation.

| Vue | FPS avant → après | Draw calls avant → après | Sommets avant → après | Meshes présents avant → après | Moteurs | GLB au démarrage |
|---|---:|---:|---:|---:|---:|---:|
| desktop 1440 × 900 | 23.09 → 22.73 | 27 → 27 | 58023 → 57792 | 65 → 64 | 1 | 0 |
| mobile 390 × 844 | 23.37 → 23.32 | 23 → 23 | 58023 → 57792 | 65 → 64 | 1 | 0 |

Le retrait de la sphère de réception générique explique un mesh et 231 sommets en moins au repos ; le vrai poisson est chargé seulement pendant son action. Résolution interne bureau 1024 × 640, mobile 390 × 844. CPU de soumission échantillonné : bureau 1,3 → 0,7 ms, mobile 1,9 → 0,5 ms ; ce n’est ni le coût GPU, ni une série statistique. Draw calls du ponton inchangés. Une erreur console détectée dans ces références : aucune.

Preuves : [JSON avant](../apercus/poissons/before-measurements.json), [JSON final](../apercus/poissons/after-measurements.json), [ponton mobile avant](../apercus/poissons/before-mobile-jetty.png), [après](../apercus/poissons/after-mobile-jetty.png), [FishDex avant](../apercus/poissons/before-mobile-fishdex.png), [après](../apercus/poissons/after-mobile-fishdex.png). Les deux mêmes cadrages bureau sont conservés dans le même dossier.

## Chargement et ressources

Principal normal minifié : 1 940 953 → 2 184 950 octets. 263 fichiers JS/CSS de build (4 954 288 octets bruts au total, chargement fractionné par Vite/Babylon). Le principal dépasse le seuil d’avertissement de 900 Ko ; avertissement conservé. Les octets bruts ne sont pas un temps réseau ni la taille transférée compressée. Détail : [budgets](../apercus/poissons/build-budgets.json).

33 GLB naturels : **3 718 016 octets** dans le manifeste, dont quinze anciens inchangés ; aucun téléchargement de la collection au démarrage. 197 ressources d’archives normalisées : **5 253 670 octets**, sans en faire des textures de scène. Alpha/proportions, poissons limités à 512 × 384 et fonds à 960 pixels. Le FishDex utilise le chargement différé des images ; les illustrations ne constituent pas un second jeu de modèles 3D.

Silhouettes provisoires : corps à 32 anneaux/16 côtés et détails spécifiques, regroupés en un maillage/matériau par poisson ; aucune génération externe. Acteur de pêche unique, conteneurs disposés lors des transitions, aucun modèle de poisson permanent au repos. Photos locales 480 × 240 WebP, plafond 100 Ko et éviction de miniatures après 128 ; pas de reroll ou gain lors de leur régénération.

Aquarium : cinq favoris maximum. Deux essais à cinq gabarits/robes vérifient 81 positions orbitales, parois et longueurs relatives, puis retour à un moteur. Les scènes de pêche sont suspendues derrière les panneaux concernés. Cela ne prouve pas une absence de collisions entre poissons ni une cadence garantie sur téléphone.

## Économie et prochaines mesures

Banc des 22 méthodes : 264 lancers, 242 captures, 15,49–54,71 écus nets/minute, matériel/stock/argent finis et rencontres naturelles. Contrôleur idéal, préparation/photo supposées huit secondes ; économie humaine à mesurer. Rapport [banc brut](../apercus/poissons/natural-economy.json).

Suivre `ESSAIS_TELEPHONE.md` : appareil/OS/navigateur, rendu éco/haut, réseau et échauffement de quinze minutes, gestes simultanés, combats forts et cinq favoris. Les nouveaux modèles/robes restent provisoires ; leur lisibilité et le plaisir ne sont pas certifiés par un test de stockage.
