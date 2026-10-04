# Assets gratuits carte 01 — version 0.13.0

Le chantier améliore **Étang des Saules / willow-pond**. Les six postes (`jetty`, `cove`, `bank`, `reed-bank`, `point`, `timber`), leurs caméras, bathymétrie, collisions, accès, poissons, méthodes et événements restent ceux de 0.12.1. Pas de migration, dépendance, abonnement, nouveau moteur ni génération de modèle.

## Ressources réellement retenues

- T01–T04 Poly Haven : quatre photographies mélangées hors ligne dans un atlas1024 depuis le vrai contour, les profondeurs et les chemins. Sol mat sur le matériau Standard existant; aucune passe PBR par pixel. Le sol emploie une rugosité uniforme approximée; les cartes de rugosité préparées restent hors runtime. Les détails fins sont limités par la résolution de l’atlas.
- T05/T06 : bois du ponton et écorce, textures512. UV métriques sur planches et cylindres. Normales OpenGL linéaires et spéculaire/glossiness dérivées du canal vert ARM; aucun métal. Ponton, pieux, branches et tronc existants conservés; M04/M07 ne sont pas nécessaires.
- A01 : ciel diurne JPG avec conversion AgX, environnement128 préfiltré hors runtime (`HDRFiltering quality64`), lumière existante conservée. Réservé au matin; couvert/soir retrouvent leur ciel procédural et n’utilisent pas ce cube. Ancien disque solaire masqué au matin lorsque la photo charge pour éviter deux soleils. Alignement photométrique exact du soleil du HDR non revendiqué.
- M01 Quaternius2022 : BirchTree_1 (4 598 triangles), Bush (400), Grass_Small (58), Rock_1/2 (228/202). Quatre fichiers source du miroir autorisé, sept exports au total avec M02/03. Aucun palmier ni pack complet au démarrage. Feuillu générique provisoire, sans prétendre fournir un aulne/chêne exact.
- M02 Aredon : deux touffes de massettes par groupe,760 triangles; dépassement de dix triangles du budget indicatif750 conservé pour la silhouette. Trois groupes existants, mêmes obstacles.
- M03 Aredon : feuille waterlily_half,252 triangles,36 placements existants et pivot à la surface. Teinte verte modérée; pas de nouvelle population de poissons.

Les modèles sont instanciés. Dix-huit arbres proches au maximum peuvent utiliser le GLB, sélectionné réellement à plus de110pixels projetés en économie /70 en élevé; leurs proxies spatiaux prennent le relais au loin. Le même AssetContainer est partagé entre les rôles `tree_alder` et `tree_oak`; relâcher une famille garde les matériaux de l’autre. Matrices statiques gelées, matériaux mats, alpha-test pour les feuilles, textures locales partagées par hash. Les arbres GLB n’ont pas de vent de branches dédié; le vent procédural ancien et les rides d’eau restent actifs. Pas de lightmap UV2 produite.

**27 nouveaux fichiers runtime, 3 285 163octets au moment de l’inventaire; 3 176 346octets essentiels et six previews lazy.** Le registre final peut faire varier les derniers octets après régénération des previews. Voir [ASSETS_INTEGRES.json](ASSETS_INTEGRES.json) pour les octets/hashes exacts, auteurs,25 téléchargements réussis, sept exports, triangles et contrats. Sources conservées dans `assets-source/free-map-01/`, ignorées par Git et Vercel. Couverture des40 rôles et limites spécifiques : [COUVERTURE_REELLE.md](COUVERTURE_REELLE.md).

## Téléchargement bloqué puis résolu

Les dix fichiers ciblés du [dossier glTF Google Drive officiel](https://drive.google.com/drive/folders/1-ob9Aade1RIM3A_XKoQAOG6XqF2IDAIC) renvoyaient du HTML au lieu des fichiers. La [fiche Quaternius](https://quaternius.com/packs/ultimatestylizednature.html) et le [miroir Poly Pizza fourni](https://poly.pizza/bundle/Ultimate-Stylized-Nature-Pack-zyIyYd9yGr) ont été vérifiés : CC0 / Quaternius. Les quatre groupes utiles du miroir ont effectivement été récupérés. Aucun fichier essentiel à fournir manuellement désormais; aucune substitution de licence payante. Liens de fichier, erreurs primaires et SHA256 sources dans le registre.

Poly Haven : [licence CC0](https://polyhaven.com/license), [T01](https://polyhaven.com/a/forest_ground_04), [T02](https://polyhaven.com/a/brown_mud_02), [T03](https://polyhaven.com/a/leafy_grass), [T04](https://polyhaven.com/a/pebble_ground_01), [T05](https://polyhaven.com/a/wood_planks_dirt), [T06](https://polyhaven.com/a/bark_willow_02), [A01](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky). [M02](https://opengameart.org/content/lowpoly-reed) / [M03](https://opengameart.org/content/lowpoly-waterlily) : Aredon, CC0. Les liens de téléchargement viennent des fiches/API observées; pas de moissonnage.

## Pipeline reproductible local

Node24.15.0; Babylon core/loaders9.28.0; Vite8.3.1; Blender5.1.2. Installation du jeu `npm ci`; aucune modification des versions de dépendances.

1. `node scripts/download-free-map-assets.mjs`, puis `node scripts/download-nature-mirror.mjs`. `download-nature-subset.mjs` permet de constater/reprendre la voie officielle Drive bloquée.
2. `blender --background --python scripts/inventory-free-map.py` puis `blender --background --python scripts/export-free-map.py`. Originals inchangés; axes/pivots appliqués avant normalisation des dimensions du registre, sans effacer la rotation d’import.
3. Avec Python/Pillow local : `python scripts/prepare-map-textures.py`, `node --experimental-strip-types scripts/ground-map-mask.mjs`, `python scripts/bake-map-ground.py`, `python scripts/pack-free-map.py`.
4. `node scripts/prefilter-map-sky.mjs` : bundle Babylon séparé,128px/quality64. Les premières tentatives de mélanger modules Vite optimisés et modules bruts échouaient; script final reproduit avec succès. Aucune préfiltration au chargement du jeu.
5. Serveur QA local5179 avec `VITE_E2E=1` : `node scripts/free-map-reference.mjs after`, `node scripts/free-map-passes.mjs`; `python scripts/prepare-map-previews.py` depuis les captures finales; `node scripts/free-map-manifest.mjs` actualise les preuves.

Les images glTF sont placées dans `/models/environment/`, avec URI locale simple. Les versions absolues puis contenant `..` étaient rejetées par le loader; corrigé et chargement réel contrôlé. Ne pas conserver les copies de préparation inutilisées dans `public/`.

## Contrôles et mesures

Les sources de données/règles/sauvegardes n’ont pas été modifiées. `npm run check` :205 tests Node, TypeScript et build réussis, avertissement de taille du chunk principal conservé. Six scénarios navigateur ciblés (chargement/partage/qualités/dix transitions/repli/substitution valide-rejet-restauration) sur bureau1440×900 et Chromium mobile390×844; résultats finaux dans le relais. Premières reprises nécessaires pour attendre la réinstallation de l’API QA après changement de profil, puis cliquer Carte depuis le HUD et non sous un menu modal; problèmes des scripts de contrôle, pas des règles du jeu.

Référence0.12.1 et captures après, caméra/cible/heure/profil identiques, eau standard,12 images par état : `docs/apercus/assets-gratuits/`. Métriques et limites : [PERFORMANCES.md](PERFORMANCES.md). Les premiers matériaux PBR, puis le terrain avec plusieurs lectures de textures, ont été écartés après mesures. Les données rejetées restent locales `.migration/`; seules mesures finales publiées dans le rapport. Pas de promesse de30FPS stables sur un iPhone à partir de SwiftShader.

## Essayer sur téléphone

1. Ouvrir [fishdex.fr](https://fishdex.fr), recharger après publication si nécessaire. Profil normal par défaut.
2. Menu → Réglages et aide → Mode test → Ouvrir mon profil de test. Vérifier TEST et ∞; la sauvegarde normale reste séparée.
3. Retour à la pêche → Carte. Choisir chacun des six postes; les fiches montrent leurs nouveaux aperçus et les vrais droits. Le profil TEST ouvre les postes pour les essais.
4. Menu → Réglages et aide : comparer Économie mobile / Qualité élevée, et eau Économe / Standard / Élevé. Conserver Standard si le téléphone le permet; il n’y a pas de mesure appareil établissant encore ce choix.
5. Mode test → Carte et eau · essais visuels : comparer matin/couvert/soir, puis fermer tous les panneaux. Le ciel photo est réservé au matin. Lancer réellement et regarder la surface au contact du montage; essayer un combat/réception/photo et revenir au carnet.
6. Répéter dix changements de poste, verrouiller/déverrouiller le téléphone, reprendre le jeu. Relever FPS/frame times après quelques minutes et la chauffe; photographier toute anomalie en notant appareil/navigateur/profil.
7. Revenir au profil normal; vérifier carnet et droits acquis. Aucun essai Safari/iPhone/Android physique effectué par Codex.

Publication, identité autorisée, empreintes, revue et retour arrière : [PUBLICATION.md](PUBLICATION.md).
