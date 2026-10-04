# Mesures des assets gratuits0.13.0

Windows Chromium / ANGLE SwiftShader, DPR1, renderer économie. Aucune mesure iPhone/Safari/Android physique. Baseline0.12.1 et rendu final0.13.0 : même poste, caméra/cible, matin et eau Standard. Après2s d’échauffement,3s de frames rendues par poste; ces petites fenêtres ne prouvent pas une stabilité de plusieurs minutes. Les comparaisons de matrices caméra/cible sont exactes. Aucun autre navigateur de test pendant la dernière passe.

## mobile — viewport 390×844

Résolution réelle 390×844.

| Poste | FPS avant | FPS après | Médiane après ms | P95 après ms | Draw calls après (dernière frame) | Triangles actifs après |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| jetty | 30.26 | 30.17 | 33.30 | 46.30 | 86 | 18680 |
| cove | 30.09 | 30.25 | 33.40 | 34.80 | 97 | 23536 |
| bank | 30.00 | 30.22 | 33.40 | 34.80 | 94 | 17246 |
| reed-bank | 30.43 | 30.22 | 33.40 | 34.70 | 104 | 24526 |
| point | 30.13 | 30.01 | 33.30 | 34.50 | 93 | 17528 |
| timber | 30.11 | 30.27 | 33.40 | 34.30 | 110 | 23414 |

Maillages totaux : 431→798; textures : 6→13 dans Scene.textures, plus5 images partagées des AssetContainers. Estimation RGBA8+mips, cubes×6 : 1.42→24.09Mio, inclut scène/pools/cibles et cinq images512² du registre ajoutées à l’estimation car absentes de Scene.textures, approximation des formats. Ce n’est ni une mesure VRAM ni la mémoire du processus. Les triangles sont ceux des meshes actifs; instancing et passes RTT ne sont pas additionnés à ce chiffre. Draw calls et CPU accessibles comprennent les passes et varient avec la cadence du miroir; ne pas prendre une dernière frame pour une moyenne. Dix transitions et remplacement/restauration ont conservé exactement le nombre de meshes, textures, matériaux et moteurs dans les tests. Zéro erreur de page ou HTTP≥400 dans les références finales.

## desktop — viewport 1440×900

Résolution réelle 1024×640.

| Poste | FPS avant | FPS après | Médiane après ms | P95 après ms | Draw calls après (dernière frame) | Triangles actifs après |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| jetty | 18.13 | 22.04 | 46.80 | 82.60 | 121 | 30648 |
| cove | 23.91 | 24.17 | 41.20 | 49.20 | 147 | 32370 |
| bank | 24.99 | 23.47 | 43.10 | 50.10 | 156 | 31850 |
| reed-bank | 24.22 | 24.09 | 40.40 | 49.50 | 170 | 35506 |
| point | 23.47 | 24.55 | 39.40 | 49.10 | 123 | 28590 |
| timber | 22.65 | 22.89 | 44.50 | 51.70 | 155 | 37780 |

Maillages totaux : 431→798; textures : 6→13 dans Scene.textures, plus5 images partagées des AssetContainers. Estimation RGBA8+mips, cubes×6 : 1.42→24.09Mio, inclut scène/pools/cibles et cinq images512² du registre ajoutées à l’estimation car absentes de Scene.textures, approximation des formats. Ce n’est ni une mesure VRAM ni la mémoire du processus. Les triangles sont ceux des meshes actifs; instancing et passes RTT ne sont pas additionnés à ce chiffre. Draw calls et CPU accessibles comprennent les passes et varient avec la cadence du miroir; ne pas prendre une dernière frame pour une moyenne. Dix transitions et remplacement/restauration ont conservé exactement le nombre de meshes, textures, matériaux et moteurs dans les tests. Zéro erreur de page ou HTTP≥400 dans les références finales.

## Profils et passes séparées

Ponton, renderer économie,2s d’échauffement puis6s par qualité d’eau. Timer WebGL2 EXT_disjoint_timer_query dans SwiftShader. Main exclut les RTT; surface et terrain sont déjà inclus dans main : **ne pas additionner ces trois colonnes**. Elles sont mesurées sur des frames alternées afin d’éviter des queries imbriquées. Bas reflet cache forcé une fois pour mesurer son coût initial, pas un reflet recalculé chaque frame. Aucune passe d’ombre active dans le renderer économie; coût ombres élevées non mesuré.

| Vue | Eau | FPS | Frame P50/P95 ms | Main GPU logiciel ms | Surface ms | Terrain ms | Reflet ms / échantillons |
| --- | --- | ---: | --- | ---: | ---: | ---: | --- |
| mobile | low | 30.13 | 33.30/44.00 | 23.03 | 7.93 | 6.87 | 1.39 / 1 |
| mobile | standard | 30.15 | 33.20/43.20 | 22.82 | 8.12 | 6.84 | 2.56 / 31 |
| mobile | high | 30.16 | 33.30/40.60 | 25.44 | 10.90 | 6.89 | 7.06 / 61 |
| desktop | low | 21.83 | 44.90/53.10 | 44.90 | 15.55 | 14.47 | 1.14 / 1 |
| desktop | standard | 21.80 | 45.00/51.50 | 41.53 | 15.25 | 14.72 | 1.99 / 8 |
| desktop | high | 18.27 | 54.70/63.60 | 48.14 | 26.55 | 14.52 | 4.90 / 11 |

Le terrain est un atlas couleur, matériau Standard mat et rugosité uniforme approximée. Les premières variantes PBR et terrain multi-lectures ont été rejetées pour coût excessif; matrices statiques et matériau simplifié ont rétabli le budget du rendu logiciel. L’eau0.12.1 garde ses échelles de reflet128/256/512 et son journal d’événements. Le mode élevé du renderer complet (DPR supérieur, ombres) a été chargé/commuté par les contrôles de rendu existants; cette table mesure uniquement les trois qualités d’eau au renderer économie. Aucune garantie pour le renderer élevé sur téléphone.

## Téléchargement et limites

Inventaire exact et hashes : ASSETS_INTEGRES.json. Nouveaux fichiers essentiels3 176 346octets, hors previews et transport HTTP; pas15Mo. Ce nombre est la somme des fichiers, pas un transfert réseau mesuré. Deux scènes successives normal→TEST demandent les mêmes assets avec cache HTTP; les deux rôles d’arbres d’une scène partagent un seul chargement source. Aucun poisson GLB initial ajouté. Les valeurs ResourceTiming du chargement froid public avant/après et le transport compressé réel sont consignés après publication dans PUBLICATION.md. Les sources1K/HDR/packs ne sont pas publiées.

Restent à mesurer sur vrai iPhone :30FPS après plusieurs minutes, Safari/WebGL/alpha, portrait/paysage/DPR, chauffe/autonomie, réseau mobile, mémoire réelle et reprise/gestes. Les captures et chiffres courts PC ne remplacent pas ces essais.

Chargement froid final public :100ressources,3 892 299octets transférés horsHTML contre873 747 avant; encodé logique4 187 548 contre851 547. Sept GLB de décor, aucun GLB de poisson initial; zéro erreur, QA absente. Le PNG partagé des deux pierres a deux lectures GLTF : première325 549octets réseau, seconde300octets (cache/revalidation), mêmeURI/dataURL et cache de texture interne Babylon. La somme encodedBodySize répète son corps325 249octets; elle ne mesure pas le réseau. Registre de textures dérivé : cinq images512² distinctes partagées, ajoutées au totalRGBA8 car les AssetContainers sont absents de Scene.textures. Scripts futurs dédupliquent aussi les wrappers par uniqueId du backing GPU. Source du comportement cache : texture.delayLoad/_getFromCache et glTFLoader.loadImageAsync/updateURL de9.28 installés.

Le partage du backing GPU de la pierre est déduit des URI/samplers identiques et du cache du chargeur installé; ce relevé ne mesure pas la VRAM physique. Les futurs scripts consultent les textures actives des matériaux et dédupliquent les uniqueId internes.
