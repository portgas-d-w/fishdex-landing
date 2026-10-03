# Mesures carte/eau 0.12 — 3 octobre 2026

Windows, Chromium ANGLE SwiftShader, DPR1, qualité générale économe. Aucun Safari/iPhone/Android physique. FPS calculés sur les images réellement rendues, CPU de scène distinct du GPU et des délais de présentation. Les valeurs de quelques secondes varient ; aucune amélioration statistiquement garantie.

## Référence à cadrage identique

Caméra du ponton [0, 4.2, -8.5], cible [0, 0.1, 5.5], matin et profil faible.

| Vue | FPS avant → après | Maillages alloués avant → après | Draws au repos avant → après | Résolution interne |
| --- | --- | --- | --- | --- |
| desktop | 22.19 → 22.78 | 72 → 431 | 28 → 116 | 1024 × 640 |
| mobile | 23.37 → 22.49 | 72 → 431 | 24 → 46 | 390 × 844 |

Aucun GLB de poisson chargé au démarrage dans les deux références. La scène nouvelle est un terrain complet avec pools fixes ; le total inclut les maillages désactivés. Les 281 placements sont regroupés ; 431 maillages de scène restent identiques après dix transitions, avec quatre textures résidentes en profil faible, un moteur/scène et aucun listener de poste ajouté.

## Échantillonnage par image

3 s par ligne, 12 échantillons au total. Combat : individu TEST gardon10cm, technique leurre, pilote DEV exécutant les mêmes règles et commandes ; aucun automate de réception/capture. Le GPU reste SwiftShader PC. Triangles de la passe principale, lignes exclues ; les draws comprennent reflets/effets.

| Vue / état | Qualité | FPS | Draws min–max | Triangles visibles max | CPU médiane / P95 ms |
| --- | --- | ---: | --- | ---: | --- |
| mobile / repos | low | 23.31 | 46–46 | 17868 | 0.80 / 1.40 |
| mobile / repos | standard | 22.64 | 46–94 | 17868 | 0.70 / 1.30 |
| mobile / repos | high | 22.95 | 46–94 | 17868 | 0.80 / 1.30 |
| mobile / combat contrôlé | low | 22.91 | 47–53 | 25738 | 0.70 / 1.20 |
| mobile / combat contrôlé | standard | 24.63 | 53–109 | 35738 | 0.70 / 1.00 |
| mobile / combat contrôlé | high | 24.32 | 57–108 | 34488 | 0.70 / 1.10 |
| desktop / repos | low | 22.63 | 113–113 | 22804 | 1.80 / 2.90 |
| desktop / repos | standard | 21.92 | 113–161 | 22804 | 1.80 / 2.80 |
| desktop / repos | high | 22.63 | 113–161 | 22804 | 1.60 / 2.70 |
| desktop / combat contrôlé | low | 23.51 | 114–120 | 30674 | 1.00 / 2.10 |
| desktop / combat contrôlé | standard | 22.60 | 121–175 | 40674 | 1.00 / 1.50 |
| desktop / combat contrôlé | high | 23.99 | 124–176 | 40674 | 1.00 / 1.30 |

Au plus 17 maillages transparents actifs dans ce combat échantillonné ; ce nombre ne mesure pas les pixels d’overdraw. Pools maximaux 28 rides/48 gouttes, limites réduites selon qualité. Les textures créées localement (terre256, bois2×256×128, masque128) n’ajoutent aucun téléchargement propre à la carte. Le reflet ajoute une cible256 ou512 ; la taille de ces textures ne représente pas toute la VRAM, attachments et coût du pilote inclus. La résolution générale est limitée à1024×640 sur bureau et390×844 pour ce mobile DPR1.

## Comparaison de matériaux sur la même scène

4 s par matériau/vue, terrain, caméra et éclairage identiques. Alternative WaterMaterial9.28 extraite temporairement, normal map64 et deux rendus256 avec48 objets, jamais ajoutée aux dépendances de production.

| Vue | Variante | FPS observés | CPU médiane / P95 ms | Draws dernière image |
| --- | --- | ---: | --- | ---: |
| mobile | low | 23.33 | 0.80 / 1.20 | 46 |
| mobile | standard | 23.31 | 0.90 / 1.40 | 94 |
| mobile | high | 23.31 | 0.70 / 1.00 | 94 |
| mobile | simple | 22.89 | 0.80 / 1.20 | 46 |
| mobile | WaterMaterial_9.28_256 | 23.30 | 1.30 / 1.60 | 142 |
| desktop | low | 24.50 | 0.90 / 2.80 | 113 |
| desktop | standard | 23.76 | 0.90 / 2.80 | 113 |
| desktop | high | 23.53 | 1.20 / 3.20 | 161 |
| desktop | simple | 23.30 | 1.70 / 2.80 | 113 |
| desktop | WaterMaterial_9.28_256 | 22.99 | 2.80 / 3.20 | 209 |

Le shader local permet un masque partagé de profondeur/rive et une seule passe sélective, avec des signaux inchangés en profil faible. Le matériau de bibliothèque atteint209 draws sur la dernière image bureau ; le shader atteint161 dans cette comparaison. L’écart de FPS seul n’est pas probant sur ce banc. Aucun rendu de réfraction supplémentaire retenu.

Tenue au repos : 126.8 s échantillonnées, plus pauses de mesure, FPS par fenêtre4s 22.01–24.16, ressources inchangées et aucune erreur JS. Cet essai PC ne mesure pas chauffe, batterie ou tenue GPU téléphone.

Sources brutes : before/after-measurements.json, water-comparison-performance.json, frame-metrics.json et six captures de postes. Les timings réseau présents dans la comparaison sont ceux du serveur DEV avec modules de test ; ils ne sont pas le poids froid de production. Reproduction : PowerShell VITE_E2E=1, npm run dev -- --port5179 --strictPort, puis node scripts/map-water-reference.mjs et node scripts/map-water-frame-metrics.mjs. La comparaison de bibliothèque demande l’extraction locale de npm pack @babylonjs/materials@9.28.0 dans .migration/water-library/package, sans installation de production.
