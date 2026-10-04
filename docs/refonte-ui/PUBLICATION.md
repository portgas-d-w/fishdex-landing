# Publication de la refonte UI 0.14.0

4 octobre 2026 · Codex. Quatre lots successifs : d4d2d95 (matériel), df0f70e (FishDex), aa91fc8 (progression), 4a1d9d7 (souvenirs). Dépôt/projet confirmés par .vercel et API : portgas-d-w/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, équipe team_5BFwQHD6LvVeOSgmKAj7QoTv, Vite/Node24, main.

## Revue initiale validée

Git branch codex/refonte-ui, app 4a1d9d7f27039313eaade7ee937800a3cd27c603. READY dpl_9mCzSM81pSfwfvba4pwszkfZ1wmU : https://fishdex-landing-icwk126g4-portgas-d-ws-projects.vercel.app.

Empreintes : 262 JS/CSS, 33 modèles de poissons, 197 illustrations, ressources de carte/décor conformes au dist. Entrée /assets/index-Dzxnz3ck.js, 2 295 332 octets, SHA256 049ceef624a57d1ce8992d738f04f4e85f0193bcecf91ef77015a3510722df42. Manifeste et SVG normalisés uniquement pour CRLF existants. Sources privées exclues, aucune API QA dans le build public.

Smoke hébergé : carte/eau et capture naturelle→réception→photo→recharge→export/import passent sur bureau et mobile (4/4). Nouveau scénario transversal : sélecteur de poste initialement ambigu entre deux dialogues, corrigé dans le test ; 2/2 passent ensuite, dont aller/retour FishDex/préparation/lieux/carnet/aquarium/sauvegarde et TEST ∞ séparé. Application inchangée par cette correction de test.

## Mesures et limites

Chunk principal final : avant 2 250 662 octets, après 2 295 424 : +44 762 octets (+1,99 %), gzip final 570,91 Ko. CSS 51,96 Ko / gzip 10,49 Ko. Aucune ressource 3D supplémentaire de gestion ; une scène aquarium de cinq individus au maximum, suspension sous ses panneaux et retour à un moteur de scène après fermeture des présentations (testé). Nouvelles vignettes différées et pagination carnet/sélecteur.

public-avant/chargement.json : quatre profils de revue, bureau 1440×900 et mobile Chromium 390×844. Premier chargement vierge : 100 ressources, 6 747 169 octets décodés hors HTML, sept GLB de décor, zéro GLB de poisson ; point de relevé environ 2,87 s bureau/2,61 s mobile, incluant 1 s d’attente volontaire après disponibilité. Ces points ne sont pas des benchmarks de chargement iPhone. Même script/profils exécutés en public-apres sur la version finale, sans erreur de page. Comparaisons UI vierge et trois souvenirs/une favorite ; fixtures locales produites par recordCatch, aucune progression utilisateur modifiée.

Contrastes du socle calculés : texte/surface 12,79:1, secondaire 7,39:1, action 7,73:1 ; tokens identiques sur les fiches et réglages. Dispositions 320/390/430/paysage et bureau contrôlées, erreurs WebGL/modèles/portraits et réduction des mouvements exercées. iPhone 14 Pro réel, Safari, clavier virtuel, safe areas matérielles, lecteur d’écran, gestes physiques, chauffe/mémoire/FPS restent à mesurer. Pas de promesse de 30/60 FPS sur téléphone.

## Production

Production finale applicative : d8bc99823a2283d95bf5f2873784685cefd9aed5, READY dpl_CJfhWpktzjLXzSG2Rk7kQJumHXs7, https://fishdex-landing-nuc3lrpfr-portgas-d-ws-projects.vercel.app. fishdex.fr redirige vers https://www.fishdex.fr/ (HTTP200), entrée /assets/index-DUJ0WJre.js, SHA256 210a5c15743e451225332e5639e6ad3c9b40ddfcadc2ed0cd0dbdc8ee51e9f17, conforme au dist. Contrôle public sans token ni QA.

Le correctif d8bc998 suspend immédiatement le bassin lors de sa reconstruction sous les panneaux et évite un frame forcé masqué. Check 211/211 + TS/build, quatre scénarios ciblés et compteur de frames stable ; revue finale READY dpl_8ZBRJHA4mxwpcn8wy1BkimFwCSFW https://fishdex-landing-gfqhscoqy-portgas-d-ws-projects.vercel.app, empreintes complètes et 2/2 parcours transversaux passent. Après publication finale : mêmes empreintes complètes et 2/2 publics en 28,7 s. Les six smoke complets (carte/eau, capture naturelle/photo/transfert, refonte/TEST sur deux formats) passent en revue et public sur la version précédant ce seul correctif de suspension ; ils ne sont pas annoncés comme six nouveaux essais sur d8bc998. Les contrôles concernés par la suspension ont été rejoués.

Retour conservé : tag archive/au-fil-de-leau-before-ui-2026-10-04 sur 59d63c8 et déploiement dpl_6i1SBuKs8A3whQv2NGBKAFTuRfrz. Projet/domaines/protection conservés ; main avancée par fast-forward, aucun force-push. Clôture documentaire ultérieure : aucun fichier applicatif modifié, même empreinte attendue et recontrôlée.

## Essayer sur téléphone

Ouvrir https://fishdex.fr, Menu. Matériel : Ma canne/Montage/Mon sac/Ensembles ; Boutique pour acheter. FishDex : indices ou noms découverts→Préparer une rencontre, puis application explicite. Progression : suivre un objectif ou consulter les 22 techniques. Lieux et carte : voir un poste, puis S’installer quand accessible. Carnet : Prises/Observations, recherche, fiche→Favori. Aquarium : Mes poissons pour ajouter/remplacer, Décorer pour les choix immédiats ; achats séparés. Réglages : commandes/qualités/sauvegarde. Aide : guides contextuels et espace de développement→Mode test→Ouvrir mon profil de test ; ∞ affiché, sauvegarde normale et photos séparées. Dans Mode test, préparer un kit et son milieu, choisir poisson/robe/longueur, lancer ou utiliser les scénarios. Revenir à ma partie normale rétablit le profil normal.

## Relevé public avant/après final

| Format Chromium | Ressources initiales | Octets décodés hors HTML | Point de relevé |
|---|---|---|---|
| desktop | 100 → 100 | 6 747 169 → 6 800 798 | 2.87 → 4.47 s |
| mobile | 100 → 100 | 6 747 169 → 6 800 798 | 2.61 → 3.55 s |

Sept GLB de décor, zéro GLB de poisson au démarrage dans les deux versions. Le point de relevé inclut 1 s d’attente volontaire ; autres tests et navigateurs ont fonctionné en concurrence. Réseau/cache/charge PC non contrôlés : ces temps ne démontrent ni gain ni régression de performances, et ne prédisent pas le téléphone. Les différences d’octets et de ressources sont mesurées ; FPS/GPU/chauffe iPhone non mesurés. Sources brutes dans les deux chargement.json.

36 captures publiques avant et 36 après : neuf écrans × deux profils × deux formats. Archives de lots et captures ciblées conservées. `scripts/capture-ui-review.mjs` permet de reproduire les profils. Voir [BILAN.md](BILAN.md) pour les passations, captures et matrice par lot.
