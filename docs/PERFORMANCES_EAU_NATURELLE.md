# Performances de l’eau naturelle 0.12.1 — 3 octobre 2026

Mesures locales sur Windows, Chromium/WebGL2 **SwiftShader logiciel**, DPR1. Aucun iPhone physique. Format mobile 390 × 844 ; bureau 1440 × 900 avec framebuffer économe 1024 × 640. Matin, ponton, même caméra et scène. Le but d’au moins 30 FPS stables sur le téléphone cible reste **non validé sur appareil**.

## Avant et protocole

Référence ancienne 0.12 : trois secondes par profil, quatre lignes par vue, incluant une ligne en mouvement. Changement de qualité puis attente courte ; ne mesure ni compilation froide ni coût thermique. Ce protocole court sert de diagnostic du limiteur et de référence visuelle ; il n’a pas la même durée que le banc final.

| Vue | État / qualité avant | FPS | Intervalle P95 (ms) |
| --- | --- | ---: | ---: |
| mobile | low-rest | 22.92 | 50.40 |
| mobile | standard-rest | 22.96 | 50.40 |
| mobile | high-rest | 22.96 | 50.50 |
| mobile | moving | 22.62 | 50.50 |
| desktop | low-rest | 23.31 | 51.80 |
| desktop | standard-rest | 23.88 | 51.20 |
| desktop | high-rest | 23.96 | 51.60 |
| desktop | moving | 22.90 | 50.80 |

Le limiteur perdait le reliquat des 33,33 ms et produisait souvent des intervalles d’environ 50 ms. La conservation de l’échéance fractionnaire corrige cette cause ; la simulation reste à 1/60. Une scène plus coûteuse peut toujours manquer cette échéance.

## Banc final après échauffement

Deux secondes d’échauffement puis dix secondes de mesure par ligne, 12 lignes, sans autre banc navigateur simultané. FPS = images réellement rendues / durée, pas RAF moteur. Mouvement = contacts TEST isolés injectés toutes les 0,5 s avec progression de simulation à 1/60 ; ce n’est pas un combat humain ni une mesure de pêche naturelle. Les scripts visuels de captures ne servent pas à certifier les FPS : leur dernière exécution a partagé le PC avec un contrôle de build.

| Vue | Eau | État | FPS | Intervalle P95 ms | Soumission scène CPU P95 ms | Draws min–max | Recalculs reflet |
| --- | --- | --- | ---: | ---: | ---: | --- | ---: |
| mobile | low | repos | 29.98 | 34.50 | 1.00 | 46–46 | 0 |
| mobile | low | contacts TEST | 30.07 | 34.50 | 1.10 | 46–46 | 0 |
| mobile | standard | repos | 29.98 | 35.00 | 1.10 | 46–90 | 50 |
| mobile | standard | contacts TEST | 29.97 | 34.30 | 0.90 | 46–90 | 50 |
| mobile | high | repos | 30.00 | 34.30 | 1.00 | 46–90 | 100 |
| mobile | high | contacts TEST | 30.00 | 34.50 | 1.00 | 46–90 | 100 |
| desktop | low | repos | 22.20 | 50.30 | 1.40 | 113–113 | 0 |
| desktop | low | contacts TEST | 22.17 | 50.60 | 1.40 | 113–113 | 0 |
| desktop | standard | repos | 21.89 | 53.70 | 1.20 | 113–161 | 36 |
| desktop | standard | contacts TEST | 21.86 | 80.00 | 1.30 | 113–161 | 36 |
| desktop | high | repos | 18.40 | 61.80 | 1.50 | 113–161 | 61 |
| desktop | high | contacts TEST | 18.40 | 62.60 | 1.20 | 113–161 | 62 |

Le format mobile émulé reste autour de 30 FPS en moyenne, avec P95 de 34,3–35 ms : ce n’est pas une garantie de minimum stable. Le bureau logiciel reste à 18–22 FPS, donc ne satisfait pas l’objectif. L’eau couvre une grande portion de ce framebuffer ; le coût de fragments domine le CPU. Le niveau élevé coûte davantage et doit être choisi après mesure appareil.

Les soumissions CPU du matériau ont un P95 de 0,10 ms sur ces lignes. Le P95 de la dernière soumission de reflet vaut environ 0,4–1,4 ms ; en mode cache sans recalcul ce nombre est une ancienne mesure, pas un nouveau coût par image. Ces observations CPU n’incluent pas l’exécution GPU.

## Passes GPU disponibles

Requêtes WebGL2 EXT_disjoint_timer_query_webgl2, quatre secondes par profil après 1,5 s d’échauffement. Séries distinctes du banc FPS ; interrogation asynchrone des requêtes disponibles, résultats disjoints écartés. Instrumentation de mesure uniquement dans le script, aucune requête GPU permanente dans le jeu. Il s’agit de temps **GPU logiciel SwiftShader**, sans extrapolation au GPU d’un téléphone. Repos uniquement ; coût GPU d’un combat complet restant à mesurer.

| Vue | Profil | Surface médiane / P95 ms | Échantillons surface | Reflet médiane / P95 ms | Échantillons reflet |
| --- | --- | --- | ---: | --- | ---: |
| mobile | low | 9.97 / 10.59 | 120 | 1.05 / 1.05 | 1 |
| mobile | standard | 10.03 / 10.95 | 120 | 2.03 / 2.46 | 20 |
| mobile | high | 13.79 / 14.60 | 121 | 5.19 / 5.66 | 41 |
| desktop | low | 20.19 / 21.14 | 47 | 1.07 / 1.07 | 1 |
| desktop | standard | 20.22 / 20.84 | 37 | 1.73 / 1.86 | 8 |
| desktop | high | 28.07 / 28.61 | 24 | 3.77 / 4.14 | 8 |

Économe : reflet 128² en cache, un recalcul explicitement demandé pour mesurer cette passe, donc un seul échantillon et P95 non statistique. Standard : 256² toutes les six images rendues. Élevé : 512² toutes les trois images. La surface est rendue chaque image ; ne pas additionner directement ses temps à ceux d’un reflet qui n’est pas recalculé à chaque image. Aucun GL error dans ces six séries, aucune erreur page dans le banc final.

## Bornes et chargement

Tuile normales 128² avec mipmaps, atlas profondeur/contacts 256², une seule cible miroir, liste réfléchie limitée à 48 objets (44 mobile et 48 bureau au ponton), huit perturbations locales au maximum. Pools existants 28 anneaux / 48 gouttes au total, activation selon qualité. Aucun modèle chargé pour la nouvelle eau. Dix transitions et neuf cycles de qualité testés sans croissance des maillages ni accumulation de cibles miroir ; disponibilité du matériau et du cache vérifiée. Le banc ne constitue pas une mesure de VRAM.

Le build conserve un gros chunk principal Babylon et le catalogue existant : avertissement de taille Vite conservé. Aucun nouveau paquet de production ni chargement initial des 33 GLB. Le chargement froid public est consigné après publication avec ResourceTiming ; c’est un transfert observé sur le réseau du PC, pas une mesure de réseau mobile.

## Preuves et reproduction

- Données : apercus/eau-naturelle/before-measurements.json, after-measurements.json (protocole visuel court), performance-steady.json (banc final isolé), gpu-passes.json, contact-details.json.
- Captures avant/après : repos des trois profils, vrai lancer au leurre à 0,7 s, contacts isolés à âges 0,15/0,65/1,4 s, vidéos mobiles. Même ponton/caméra/matin. Vues complémentaires cove/reed-bank/timber/jetty et fond clair ; ces vues ne sont pas des paires avant/après.
- Serveur DEV E2E sur 5179 ; scripts water-natural-reference.mjs before/after, water-natural-performance.mjs, water-natural-gpu.mjs, water-natural-details.mjs. Les exécuter séparément pour mesurer les performances. Le script before doit s’exécuter sur le code de référence 170ca34, pas sur la version actuelle.
- Tests : npm run check 205/205 + TypeScript/build ; 18 scénarios navigateur distincts par lots, puis les quatre cas eau repris après le dernier changement de shader. Logs réels dans apercus/eau-naturelle/controles. Publication et parcours publics : PUBLICATION_EAU_NATURELLE.md.

## À tester sur véritable appareil

Safari iPhone14Pro et Chrome Android : compilation/chargement froid, les trois qualités au repos et pendant pêche/combat sur plusieurs minutes, FPS et pauses longues, scintillement à l’horizon, fil/flotteur et lisibilité, contexte perdu/reprise après verrouillage, réseau mobile, mémoire, chauffe et autonomie. Aucun de ces contrôles physiques n’a pu être exécuté. Pas de résultat appareil déduit d’une émulation Chromium ni d’un temps GPU logiciel.
