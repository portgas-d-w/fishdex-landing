# Eau naturelle — version 0.12.1, 3 octobre 2026

Demande exécutée dans le jeu existant, depuis main `170ca34`, branche `codex/eau-naturelle`. Babylon core/loaders 9.28.0, TypeScript 5.9.3, Vite 8.3.1 et Node24.15 conservés. Aucun modèle, abonnement, dépendance de production ou moteur ajouté. La modification utilisateur de DEMARRER_AVEC_CODEX.md est préservée et exclue. Les règles, prix, poissons, méthodes, droits, sauvegardes v7 et photos ne sont pas modifiés.

## Audit et solution

L’ancien shader additionnait deux cosinus de plusieurs mètres de longueur, dont les phases étaient communes à toute la surface. Le bruit ne déphasait qu’une couche ; les bandes restaient visibles. La déformation du reflet était `normal.xz × 0.008`, donc souvent inférieure à un pixel. MirrorTexture produisait des mipmaps mais utilisait son filtrage bilinéaire par défaut. La couleur shallow olive et l’alpha 0.78 minimum cachaient largement le fond. Les torus/gouttes des événements restaient au-dessus d’un matériau d’eau qui ne lisait pas ces événements.

Le rendu reste un ShaderMaterial et une surface physique plane. Une tuile technique RGBA128 produite localement par du bruit périodique contient gradients et hauteur, sans couture de hauteur ou de normale. Trois couches décalées ont des échelles, rotations et vitesses différentes ; un vent dominant utilise la source existante. Le niveau élevé ajoute une quatrième couche. Les mipmaps, le filtrage trilineaire, l’anisotropie2 et l’atténuation selon distance/angle réduisent le détail lointain. Aucun déplacement géométrique de l’eau, FFT, réfraction avec seconde scène ou texture de modèle générée.

Les normales déforment le reflet en coordonnées de caméra, donc aussi depuis les autres rives. Fresnel progressif : plus de ciel/décor aux angles rasants, plus de transmission vers le bas. Standard utilise un reflet filtré et déformé ; élevé ajoute un adoucissement à trois échantillons. Le ciel réel fait partie du reflet. Les objets sont filtrés par le frustum de la caméra réfléchie, classés par distance puis limités à48. Les reflets des végétaux suivent la cadence de leur profil ; les rides et événements déforment le résultat à chaque image.

## Profils et coûts bornés

| Profil | Base naturelle | Reflet du décor | Actualisation | Effets disponibles |
| --- | --- | --- | --- | --- |
| Économe | Trois échelles, profondeur, contacts et perturbations | 128px, mipmaps et trilineaire | En cache ; recalcul à changement de poste/ambiance/qualité/famille | 12 rides, 16 gouttes, 8 perturbations de shader |
| Standard | Même base, détail proche renforcé | 256px, mipmaps et trilineaire | Toutes les6 images rendues | 20 rides, 32 gouttes, 8 perturbations |
| Élevé | Quatrième couche proche et reflet adouci | 512px, mipmaps et trilineaire | Toutes les3 images rendues | 28 rides, 48 gouttes, 8 perturbations |

Une seule cible de réflexion allouée à la fois, aucune passe de réfraction ni blur hors écran. Le cache économe reflète les éléments de décor fixes ; il ne reproduit pas le mouvement continu des feuilles. Les niveaux supérieurs actualisent ces mouvements. Cadence exprimée en images rendues, pas une garantie de fréquence sur un téléphone lent.

L’atlas technique passe de128 à256px : profondeur depuis `pondDepth`, distance à la rive, contacts et variation de substrat. Clamp aux limites, filtrage bilinéaire, gamma désactivé. Les autres contextes existants gardent leur approximation de profondeur de contexte ; ce chantier n’ajoute pas de bathymétrie détaillée pour ces cartes.

## Fond et contacts

Transmission exponentielle selon la profondeur du fond et une estimation du trajet oblique. Le mélange alpha conserve le terrain déjà présent derrière l’eau, puis absorbe progressivement ses détails. Ce n’est pas une simulation de dispersion spectrale ou une profondeur par rayon de scène. Couleurs de suspension naturelles, petites variations de substrat et mélange avec ciel/décor ; aucun filtre turquoise global.

L’atlas des contacts vient des placements du ponton, des roseaux, des nénuphars et du tronc existants. Il fournit un assombrissement local de contact et une petite variation de normales, sans anneau blanc permanent. La rive atténue les rides sans supprimer totalement la surface. La grille reste une approximation : elle ne représente pas individuellement tous les brins de roseau ou des ménisques de quelques millimètres.

Menu → Aide et réglages → Mode test → Carte et eau : **Turbidité visuelle**, de0.35 à2.50, défaut0.85. Réglage de session TEST, sans modification des rencontres ou du FishDex ; retour à la valeur de base quand le monde/profil est rechargé. Les préférences existantes de qualité d’eau restent sauvegardées.

## Événements et cadence

Les événements existants alimentent huit perturbations locales du shader au maximum, buffers recyclés. Position réelle, âge de simulation, intensité et direction ; sillages orientés avec les positions consécutives. Le journal reçoit des métadonnées transitoires de profondeur et de vitesse ; aucun changement des comportements, forces, touches ou récompenses. Le mouvement lent et l’immersion réduisent l’effet, les contacts profonds ne créent plus de couronne minimale visible. Les gouttes et torus existants sont réutilisés et rendus plus discrets. Les perturbations expirent en2.4s, la pause les fige et un changement de poste les nettoie. Pluie et sauts non simulés restent des démonstrations isolées, sans faux événement de pêche.

Le limiteur économe remettait son horloge à chaque image et perdait le reliquat des33.33ms, donnant régulièrement50ms entre images à RAF60Hz. `render-clock.ts` conserve l’échéance fractionnaire, saute le retard après pause et ne déclenche aucun rattrapage d’images. Le pas de simulation reste1/60. Le diagnostic distingue maintenant images effectivement rendues et fréquence RAF du moteur.

## Validation et comparaisons

`npm ci` :24 paquets, zéro vulnérabilité signalée. `npm run check` :205/205, TypeScript et build. Tests de couture/déterminisme de la tuile, atténuation profondeur/vitesse et cadence30 malgré le jitter. Chromium desktop1440×900 et mobile390×844 ; matrice navigateur par lots, textures/mipmaps, pixels de l’eau avec/sans perturbation à scène identique, extinction/pause, qualité/cache/turbidité, dix transitions, six vraies réceptions avec photo/reload et sauvegarde isolée, substitution/repli GLB, rendu élevé/économe et comportements de frein/moulinet. Les rencontres de ces tests DEV sont forcées ; les contrôles hébergés vérifient aussi les parcours publics sans pilote QA.

`docs/apercus/eau-naturelle/` : avant/après du même ponton, camera `[0,4.2,-8.5]`, cible `[0,0.1,5.5]`, même matin, DPR1 et qualité générale économe. Trois profils au repos ; vrai geste de lancer au leurre arrêté à0.7s (trajectoire), puis séquence à âges0.15/0.65/1.4s avec contacts TEST explicitement isolés. Les captures montrent aussi le contact du lancer réel à la fin de sa trajectoire. Vidéos mobiles et vues complémentaires des berges/nénuphars/bois. Ces vues complémentaires ne sont pas revendiquées comme des paires avant/après.

Mesures brutes et rapport : `PERFORMANCES_EAU_NATURELLE.md`. Comparaisons courtes, mesures après échauffement, soumission CPU du matériau et de la réflexion, requêtes GPU WebGL lorsqu’elles répondent. SwiftShader est un GPU logiciel sur Windows, pas un iPhone. Les mesures CPU ne remplacent pas les temps GPU.

## Téléphone et limites

1. Ouvrir fishdex.fr et actualiser après publication. Partie normale par défaut, profils/carnets propres au navigateur.
2. Aide et réglages → Rendu de l’eau : essayer Économe, Standard et Élevé, puis revenir au premier niveau ; contrôler le premier affichage et dix changements de qualité/poste.
3. Mode test public → profil TEST ∞ → Carte et eau : choisir un poste, matin, qualité ; observer au repos, régler turbidité puis fermer les menus.
4. Préparer une technique, lancer normalement et suivre touche/combat/réception. Les commandes, photo, sauvegarde et contrôles d’équipement restent ceux du jeu. Pour isoler un effet visuel, utiliser le panneau TEST ; cela ne crée ni touche ni capture.
5. iPhone14Pro/Safari réel : comparer les trois qualités pendant plusieurs minutes, au repos et en combat ; contrôler lisibilité du flotteur/fil/fond, reflets lointains, double doigt, bruit scintillant, reprise après verrouillage, mémoire et chauffe/autonomie.

**Objectif : au moins30 FPS stables sur le téléphone cible. Cet objectif n’est pas validé sur un véritable iPhone.** Aucun appareil physique accessible dans cette session ; pas de test Safari réel, chauffe, batterie, VRAM ou stabilité mobile prolongée revendiqué. Le niveau élevé reste à choisir après mesure appareil. Aucun équilibrage de pêche modifié pour atteindre une mesure graphique.

Publication, identités, empreintes et retour arrière : PUBLICATION_EAU_NATURELLE.md. Instructions techniques vérifiées dans les sources locales Babylon9.28 (`mirrorTexture.pure.js`, `rawTexture.d.ts`, `shaderMaterial.pure.d.ts`, `engine.query.pure.js`) ; référence officielle : https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture.
