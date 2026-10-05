# Au fil de l’eau — Basalte & Turquoise

Guide de direction artistique et chantier d’amélioration visuelle

Version 1.0 · 2 octobre 2026 · Référence de travail pour Codex et Claude

## 1. Décision et portée

La direction artistique choisie est **Basalte & Turquoise**. La référence validée est l’image générée titrée « BASALTE & TURQUOISE » : scène de pêche naturelle à gauche, FishDex anthracite avec accents turquoise à droite.

Ce guide formalise cette identité et donne un chantier réalisable sur les ressources actuelles. Il couvre le rendu du monde, les matériaux, les effets visuels et les interfaces. L’image est une référence artistique : sa densité de végétation et son niveau de détail photographique ne constituent pas une promesse de rendu mobile.

Le jeu s’adresse à des pêcheurs de toutes techniques et à des joueurs découvrant la pêche. Son identité repose sur l’eau, les poissons, le matériel et la collection. Étangs, rivières et littoral doivent pouvoir partager le même langage graphique.

**Périmètre d’intégration :** évolution visuelle progressive du projet existant. Respecter les contrats de gameplay, les interactions et les données déjà présents dans le dépôt. Cette tâche n’autorise pas une refonte des règles de jeu.

Le diagnostic initial de ce guide s’appuie sur les captures partagées dans la conversation. Le code, les ressources et les performances de la version actuellement déployée n’ont pas été audités ici. Codex doit établir cet état des lieux dans le dépôt avant d’appliquer les recommandations.

## 2. Intention artistique

**Trois mots : naturel, précis, immersif.**

- Le monde conserve des couleurs crédibles, des volumes lisibles et des matières identifiables.
- L’interface évoque un équipement soigneusement conçu : surfaces mates, lignes fines, chiffres sobres, commandes lisibles.
- Le turquoise signale ce qui est actif, sélectionné ou en progression.
- Les poissons constituent les pièces maîtresses du FishDex. Leur anatomie et leur robe restent fidèles.
- Les paysages possèdent une lumière et une palette propres à leur habitat, sans teinte turquoise imposée à toute la scène.
- Les menus détaillés sont accueillants sur téléphone ; la vue de pêche laisse la place au monde.

À écarter : néons généralisés, glow autour de chaque élément, textures métalliques lourdes sur les menus, flous plein écran, vitrages transparents empilés, tableaux de statistiques permanents, titres démesurés et listes de cartes très hautes.

## 3. Palette de production

Ces couleurs constituent la base commune. Les valeurs sont des choix de production pour traduire la référence en composants utilisables.

| Rôle | Couleur | Usage |
|---|---|---|
| Fond basalte | `#171F22` | Fond des écrans de gestion |
| Surface | `#232D31` | Panneaux, navigation, fiches |
| Surface relevée | `#2C393D` | Sélecteurs, fenêtre contextuelle |
| Fond de spécimen | `#1D282C` | Cadres des poissons |
| Bordure | `#415255` | Séparation fine, contour neutre |
| Texte principal | `#F0F5F4` | Titres, noms, valeurs utiles |
| Texte secondaire | `#AFBFBE` | Catégorie, explication courte |
| Turquoise principal | `#4CC6C2` | Sélection, progression, action principale |
| Turquoise clair | `#68D9D4` | Survol sur PC, accent ponctuel |
| Surface turquoise douce | `#203E3F` | État sélectionné discret |
| Texte sur turquoise | `#102526` | Texte d’un bouton rempli turquoise |
| Focus | `#9DEBE7` | Indicateur de navigation clavier |
| Succès | `#82C99A` | Confirmation ponctuelle |
| Attention | `#E5C785` | Information à vérifier |
| Erreur | `#E68181` | Erreur ou action impossible |

Règles :

1. Un groupe d’actions possède au maximum une action principale remplie de turquoise.
2. Les boutons secondaires restent basalte, avec un contour fin.
3. Les barres de progression utilisent un fond discret et un remplissage turquoise ; leur bordure n’est pas décorative.
4. Un statut est indiqué par un mot ou un pictogramme, en plus de sa couleur.
5. Les textes sur une surface turquoise utilisent le texte sombre prévu à cet effet.
6. Les couleurs de rareté restent secondaires et accompagnées d’un libellé. Elles ne recolorent pas l’ensemble de la fiche.
7. Les graduations fines de la référence peuvent servir aux fiches de matériel. Elles doivent représenter une information réelle lorsqu’elles ressemblent à une mesure.

### Base de variables CSS

À intégrer au système de thème déjà en place ; adapter le sélecteur racine au projet. Ce bloc est une spécification de tokens, pas un remplacement automatique des feuilles de style.

```css
.fishdex-game {
  --fd-bg: #171f22;
  --fd-surface: #232d31;
  --fd-surface-raised: #2c393d;
  --fd-specimen-bg: #1d282c;
  --fd-border: #415255;
  --fd-text: #f0f5f4;
  --fd-text-muted: #afbfbe;
  --fd-accent: #4cc6c2;
  --fd-accent-hover: #68d9d4;
  --fd-accent-soft: #203e3f;
  --fd-on-accent: #102526;
  --fd-focus: #9debe7;
  --fd-success: #82c99a;
  --fd-warning: #e5c785;
  --fd-danger: #e68181;
  --fd-radius-control: 8px;
  --fd-radius-card: 12px;
  --fd-radius-panel: 16px;
  --fd-space-1: 4px;
  --fd-space-2: 8px;
  --fd-space-3: 12px;
  --fd-space-4: 16px;
  --fd-space-5: 24px;
  --fd-motion-fast: 120ms;
  --fd-motion-normal: 180ms;
}
```

## 4. Typographie, volumes et lisibilité

- Police sans empattement nette. Utiliser la police locale du projet si elle convient ; à défaut, commencer avec `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Corps : 14–16 px. Champs de saisie sur mobile : au moins 16 px. Informations secondaires : 12–13 px. Petites annotations exceptionnelles : au moins 11 px.
- Titres de panneau : 20–24 px. Titres de cartes : 14–16 px. Une graisse moyenne ou semi-grasse suffit pour créer la hiérarchie.
- Une ligne de titre, une ligne de contexte lorsque nécessaire ; détails longs dans la fiche.
- Espacements fondés sur 4, 8, 12, 16 et 24 px. Éviter les grandes marges qui repoussent l’action principale sous l’écran.
- Contours généralement de 1 px. Angles légèrement arrondis. Une ombre légère est réservée aux panneaux qui passent au-dessus d’un autre contenu.
- Cibles tactiles d’au moins 44 × 44 px, y compris les boutons à pictogramme.
- Viser un contraste d’au moins 4,5:1 pour le texte courant, 3:1 pour le grand texte au sens WCAG. Tester chaque couple réellement utilisé, notamment les états sélectionnés et les textes sur portraits.
- Garder les indicateurs de focus visibles. Respecter la préférence de réduction des animations.

## 5. Système de composants

Construire ces éléments une fois, puis les réutiliser. Employer les conventions et bibliothèques déjà installées.

| Composant | Contrat visuel et comportement de présentation |
|---|---|
| Bouton principal | Turquoise, texte sombre, états actif / attente / indisponible |
| Bouton secondaire | Surface mate et contour neutre |
| Navigation de section | Libellé court, sélection visible sans multiplication des cadres |
| En-tête de panneau | Titre compact, fermeture ou retour, fond opaque |
| Fiche de poisson | Portrait dominant, numéro, nom ou silhouette, statut court |
| Fiche de matériel | Image compacte, nom, bénéfice utile, statut unique |
| Sélecteur de composant | Choix compatibles, élément équipé clairement identifié |
| Progression | Valeur réelle, piste discrète, couleur turquoise |
| Badge de maîtrise | Signe identifiable et nom ; rester lisible en petit |
| Message bref | Confirmation ponctuelle, sans couvrir le centre du jeu |
| État vide | Cause compréhensible et action utile lorsqu’elle existe |
| Contenu futur | Emplacement prévu et libellé « À venir », sans faux achat utilisable |

Les états « Possédé », « Équipé » et « À venir » ne doivent pas créer des boutons redondants. Afficher un statut et l’action qui a un sens dans le contexte.

## 6. Organisation des écrans

| Écran | Priorité visuelle | Organisation |
|---|---|---|
| Pêche | Eau, canne, fil, mouvement | Accès discrets en périphérie ; retours brefs liés à la situation |
| Menu principal | Choisir sa prochaine activité | FishDex mis en avant ; accès de taille régulière aux autres sections |
| FishDex | Compléter la collection | Progression compacte, filtres accessibles, grille de spécimens |
| Fiche d’espèce | Reconnaître et approfondir | Portrait, découverte, variétés, records, maîtrise ; détails repliables |
| Ma canne | Préparer son équipement | Canne centrale, repères vers les composants, détail du montage au second niveau |
| Mon sac | Consulter les réserves possédées | Familles, recherche si utile, listes compactes ; détails au toucher |
| Ensembles | Retrouver une préparation | Résumé du montage, nom de l’ensemble et action contextuelle |
| Boutique | Comprendre et comparer | Mêmes familles et visuels que l’inventaire, statut et prix lisibles |
| Carnet | Revoir les prises | Photos et filtres pratiques ; cette section reste distincte du FishDex |
| Aquarium | Observer ses favoris | Vue dominante, réglages regroupés, cinq poissons favoris maximum |
| Capture / photo | Apprécier le spécimen | Poisson dominant, nom et données principales, découverte mise en valeur |
| Progression | Comprendre les prochains objectifs | Niveau et badges, objectifs lisibles, détails à la demande |
| Lieux | Comprendre les habitats | Identité du lieu, conditions et disponibilité |
| Réglages et aide | Trouver rapidement une option | Groupes courts, libellés clairs, état actuel visible |

### Principes mobiles

- Une navigation cohérente avec une profondeur raisonnable : section, détail, retour.
- Les panneaux de gestion occupent la surface nécessaire à leur contenu. Privilégier un écran dédié quand une petite fenêtre force un long défilement.
- Les cartes de collection sont en deux colonnes si les noms et les commandes tiennent correctement. Basculer en une colonne lorsqu’une contrainte de largeur l’exige.
- Les listes de matériel utilisent des lignes compactes : visuel, nom, statut et action. Les descriptions complètes vivent dans la fiche.
- Le titre reste lisible pendant le défilement : en-tête opaque, contenu décalé sous cet en-tête, aucune carte visible derrière les boutons.
- Une seule région de défilement principale par panneau. Éviter l’empilement de listes qui défilent indépendamment.
- Prendre en compte les zones de sécurité iOS, les changements d’orientation et le clavier virtuel.
- La pause ou la poursuite du jeu lorsque les menus sont ouverts suit le comportement existant du projet.

## 7. FishDex : traduire la référence en jeu

La référence montre de grands portraits et des progressions. Dans le produit, il faut garder cette force visuelle en donnant une signification aux indicateurs.

1. Afficher le nom après la découverte selon les règles existantes ; avant celle-ci, silhouette et indice autorisé.
2. Produire la silhouette à partir du portrait de l’espèce lorsqu’il est disponible. Éviter une silhouette générique identique pour tout le catalogue.
3. Utiliser les images déjà fournies par FishDex. Préparer des fonds homogènes, une taille de portrait cohérente et une marge qui protège toutes les nageoires.
4. Les indicateurs doivent refléter les vraies données : découverte, variétés ou maîtrise. Les segments décoratifs de l’image ne deviennent pas des valeurs inventées.
5. La rareté ajoute une petite marque et un libellé. Le portrait du poisson demeure naturel.
6. Mettre en évidence la nouvelle découverte avec un effet bref : révélation de silhouette, accent turquoise et marque « Nouveau ».
7. L’effet le plus visible accompagne une découverte importante. Une prise courante bénéficie d’un retour plus court.
8. Le catalogue futur conserve son emplacement, avec son état réel. La progression des espèces jouables et celle des contenus prévus sont présentées séparément lorsqu’elles diffèrent.

## 8. Identité du monde 3D

### Eau

La couleur dépend du milieu : brun-vert ou olive dans certains étangs, gris-bleu dans une rivière, bleu-vert sur un littoral. Conserver une différence entre eau proche et eau profonde lorsqu’elle est pertinente.

Chercher des reflets sobres, de petites variations de surface et des réactions locales : lancer, contact du flotteur, mouvement proche du poisson. La lisibilité de ces événements prime sur la multiplication des effets.

### Sols et berges

Rompre les frontières droites entre terre et eau. Alterner les masses : une portion dégagée, une zone végétalisée, quelques pierres ancrées, un accès de pêche plausible. Organiser le premier plan, le plan jouable et l’arrière-plan.

### Végétation

Varier les silhouettes, les hauteurs et les densités. Réutiliser les ressources actuelles, leur donner des orientations et des échelles mesurées, créer des bouquets plutôt qu’une rangée uniforme. Les troncs et les pierres reposent sur le sol.

### Matériaux et lumière

Faire lire les différences entre bois, roche, métal, liège et végétation. Définir une lumière principale cohérente, une lumière ambiante suffisante et des couleurs naturelles. Les poissons et le matériel proches méritent davantage de soin que les objets à l’horizon.

La lumière doit rester utile au jeu : ligne, silhouette de la canne et événements proches restent perceptibles aux différentes heures proposées.

## 9. Chantier immédiat sur les ressources actuelles

**Cette phase utilise les meshes, poissons, images et textures déjà présents, ainsi que des effets ou textures procédurales simples. Elle ne demande ni nouvelle génération Tripo, ni nouvelle production Blender, ni pack payant.**

L’ordre ci-dessous est recommandé après l’audit du dépôt. Les niveaux de coût sont des estimations de chantier, à confronter au code.

| Priorité | Intervention | Résultat attendu | Coût prévu |
|---|---|---|---|
| P0 | Captures et mesures avant modification | Comparaison fiable et état de référence | Faible |
| P1 | Lumière, exposition, couleurs et profondeur | Volumes plus lisibles, monde moins plat | Faible à moyen |
| P1 | Surface de l’eau et effets locaux | Eau vivante, événements de pêche plus clairs | Moyen |
| P1 | Forme des berges et placement du décor | Composition naturelle et meilleure profondeur | Moyen |
| P1 | Tokens et composants Basalte & Turquoise | Cohérence immédiate des interfaces | Moyen |
| P2 | Matériaux et raccords terre / eau / ponton | Matières crédibles, moins de répétitions visibles | Moyen |
| P2 | Variations de végétation et mouvements ciblés | Scène moins uniforme sans nouveaux assets | Moyen |
| P2 | Présentation des poissons actuels | Meilleure collection et meilleur écran de capture | Faible à moyen |
| P3 | Effets atmosphériques optionnels | Finition du paysage et ambiances | Variable |

### Lot A — Lumière et composition

- Vérifier le traitement des couleurs et l’exposition déjà utilisés par le moteur. Ne pas cumuler des corrections gamma ou des effets équivalents.
- Régler une lumière principale et l’ambiance pour séparer les volumes, avec une teinte naturelle.
- Ajouter une profondeur atmosphérique légère par brouillard de distance si elle sert la composition.
- Améliorer le cadrage : premier plan identifiable, zone de lancer dégagée, paysage lisible et espace pour les commandes périphériques.
- Vérifier que la nouvelle caméra n’altère pas les projections et coordonnées employées par le jeu.
- Préférer un éclairage cohérent à une accumulation de sources lumineuses.

**Vérification :** mêmes lieu et heure avant / après ; aucune eau surexposée ni canne perdue dans l’ombre ; repères du jeu correctement alignés.

### Lot B — Eau vivante

- Améliorer le matériau d’eau existant : variations de couleur modérées, détail de surface à deux échelles et mouvement lent.
- Utiliser une normale ou un motif de surface animé léger lorsque le moteur installé le permet. Ne pas importer une solution lourde sans mesure préalable.
- Donner un aspect plus profond aux zones éloignées ou profondes, en s’appuyant sur les données disponibles plutôt que sur une nouvelle simulation.
- Réutiliser un ciel ou une texture d’environnement pour les reflets du profil mobile ; réserver une réflexion de scène plus coûteuse à un profil testé.
- Créer des rides locales via quelques éléments réutilisables. Leur durée est courte ; les objets sont recyclés ou libérés.
- Relier les effets aux événements réellement émis par le jeu. Les indices visuels doivent correspondre à l’état du poisson et de la ligne.
- Mesurer le coût des superpositions transparentes et des effets de rive.

**Vérification :** mouvement perceptible au repos, lancer visuellement lisible, effets nettoyés, absence d’indices qui contredisent le comportement réel.

### Lot C — Berges et végétation

- Réorganiser les objets actuels en masses naturelles, avec des zones vides utiles à la lecture.
- Varier échelle et orientation à l’intérieur de plages plausibles. Les placements procéduraux utilisent une graine stable.
- Exploiter les géométries existantes pour varier les silhouettes, en évitant une explosion du nombre de sous-objets.
- Masquer les raccords de terrain avec les éléments du décor déjà présents : quelques roseaux, herbes, pierres ou nénuphars.
- Faire bouger seulement des éléments choisis : une partie des roseaux ou des feuilles proches. Garder le mouvement faible et cohérent avec le vent.
- Utiliser les mécanismes d’instanciation adaptés à la version du moteur pour les objets répétés.
- Réduire le détail au loin et cacher ce qui est hors champ lorsque cela est compatible avec la scène.
- Contrôler l’ancrage au sol et la continuité des berges depuis tous les cadrages accessibles.

**Vérification :** absence de rangées artificielles, de pierres flottantes, de troncs suspendus et de passages incohérents entre ponton, sol et eau.

### Lot D — Matières du décor et matériel

- Réutiliser les textures disponibles et homogénéiser leur échelle.
- Corriger les UV répétitifs ou les étirements les plus visibles, particulièrement sur le ponton et les sols proches.
- Si le projet utilise des matériaux PBR, régler avec mesure la rugosité et les reflets. S’il utilise une autre famille de matériaux, adapter ses propriétés sans imposer une migration globale.
- Donner au bois, au métal et à la pierre des réponses lumineuses distinctes.
- Définir quelques variations de couleur subtiles pour éviter des copies visuellement identiques.
- Une texture procédurale simple peut être calculée une fois au chargement ; ne pas recalculer du bruit sur le CPU à chaque image.

**Vérification :** aucune texture étirée au premier plan ; pas de bois brillant comme du plastique ; exposition cohérente entre objets.

### Lot E — Poissons actuels et présentation des prises

- Harmoniser échelle, orientation, matériau et éclairage du pack existant, en respectant les données du jeu.
- Améliorer les mouvements déjà disponibles lorsqu’une animation existe, sans annoncer un nouveau rig complet.
- Si un modèle ne possède pas d’animation, employer seulement un mouvement global discret qui ne déforme pas artificiellement son anatomie.
- Préparer une caméra de présentation et un éclairage sobre pour les spécimens sortis de l’eau.
- Utiliser les portraits FishDex pour les cartes de collection. Un portrait statique suffit dans les listes ; la 3D reste réservée aux vues où elle apporte un bénéfice réel.
- Prévoir un point de remplacement clair pour les futurs modèles, sans coupler chaque fiche UI à un mesh spécifique.

**Vérification :** taille crédible, nageoires non coupées dans les cartes, source de données inchangée, chargement 3D limité aux vues nécessaires.

### Lot F — Interfaces et finitions

- Appliquer les tokens à l’ensemble des écrans accessibles, puis vérifier chaque état visible.
- Remplacer les descriptions répétées par une information courte et une fiche détaillée.
- Mettre les statuts au bon endroit et supprimer les actions redondantes.
- Harmoniser les portraits et les miniatures sans ajouter un décor différent derrière chaque catégorie.
- Ajouter des transitions de 120–180 ms pour la sélection et les panneaux ; une découverte peut employer 250–350 ms.
- Privilégier des transformations et variations d’opacité localisées. Réduire ou supprimer les effets selon les préférences d’accessibilité.
- Utiliser les sons déjà disponibles si une confirmation sonore est pertinente. Le chantier ne requiert pas une nouvelle bibliothèque audio.

**Vérification :** aucun panneau ne masque son contenu par un en-tête transparent ; actions accessibles sur téléphone ; pas de retour au style vert / doré dans les sections secondaires.

## 10. Performance : objectifs à mesurer

Les nombres ci-dessous sont des points de départ proposés, pas des garanties ni des performances déjà constatées.

| Profil | Objectif de départ | Politique visuelle |
|---|---|---|
| Éco | Jouabilité stable sur appareil modeste | Résolution 3D réduite, reflets simplifiés, peu d’effets locaux |
| Standard mobile | 30 images/s stables après échauffement sur les appareils de référence | Eau légère, décor mesuré, interface nette |
| Qualité | Jusqu’à 60 images/s si les mesures l’autorisent | Détail et ombres supplémentaires dans un budget mesuré |

- L’iPhone 14 Pro du propriétaire est un appareil de référence, pas le minimum garanti.
- Tester aussi un téléphone plus modeste quand il est disponible. Une émulation de taille d’écran ne remplace pas une mesure GPU sur un vrai téléphone.
- Distinguer poids téléchargé, mémoire consommée et temps de rendu. Un petit fichier peut devenir coûteux une fois décompressé ou affiché.
- Limiter la résolution interne du canvas indépendamment de la netteté des menus DOM lorsque l’architecture le permet. Ne pas forcer systématiquement le ratio de pixels maximal du téléphone.
- Compresser et redimensionner les textures selon leur taille réellement visible. Charger les ressources utiles au lieu actif et les portraits à la demande.
- Réduire les appels de rendu par réutilisation de matériaux, regroupement ou instanciation selon le cas.
- Contrôler les ombres, les transparences et les post-traitements séparément. Garder seulement les effets dont le bénéfice visuel justifie le coût.
- Recycler les petits effets fréquents ; libérer les ressources des scènes remplacées.
- Si des optimisations figent les matrices ou la liste des meshes actifs, les appliquer uniquement aux objets et ensembles effectivement statiques. Ne pas figer les poissons ou les objets apparaissant pendant le jeu.

### Comparaison avant / après

1. Même lieu, heure, caméra et profil graphique.
2. Scène au repos, lancer, combat, capture et aquarium chargé jusqu’à sa limite prévue.
3. Mesurer les temps d’image, les pointes de ralentissement et le nombre d’appels de rendu ; estimer les ressources chargées quand le moteur le permet.
4. Évaluer le téléphone après plusieurs minutes de jeu, pas uniquement lors d’une ouverture à froid.
5. Tester portrait, paysage, retour d’arrière-plan et réouverture des menus.
6. Documenter séparément les contrôles exécutés automatiquement et les tests réels sur appareil.

## 11. Critères d’acceptation

- La palette Basalte & Turquoise est cohérente dans toutes les sections accessibles.
- L’action principale et la sélection sont faciles à identifier.
- Les interfaces sont lisibles à 320, 390 et 430 px de large, ainsi qu’en paysage et sur PC.
- Les poissons de la collection sont bien cadrés et reconnaissables.
- L’eau possède un mouvement subtil et des effets locaux pertinents.
- Les berges et la végétation sont moins régulières, avec des objets ancrés au sol.
- Le premier plan affiche des matières lisibles, sans étirement majeur des textures.
- Le rendu de la scène progresse visuellement à cadrage égal.
- Le profil mobile atteint son budget mesuré ou réduit les effets pour le respecter. Aucun résultat de test n’est inventé.
- Les données, les sauvegardes et les flux existants passent leurs vérifications de non-régression.
- Les changements sont organisés en étapes réversibles et restent compatibles avec les futurs modèles.

## 12. Prompt à donner à Codex

Copier cette section avec le guide, ou demander à Codex de lire le fichier entier.

> Lis `GUIDE_DA_BASALTE_TURQUOISE_CODEX_CLAUDE.md` et applique cette direction artistique au jeu existant. La DA choisie est Basalte & Turquoise. Travaille sur les ressources actuelles, sans nouvelle production Tripo ou Blender, sans pack payant et sans changer de moteur.
>
> Commence par lire les instructions du dépôt et examiner le rendu, les assets, les interfaces et la version du moteur réellement installée. Crée un état de référence avec des captures et les mesures accessibles. Vérifie ce qui est déjà réalisé pour éviter de le refaire ou de le dégrader.
>
> Implémente ensuite, dans cet ordre adapté aux dépendances réelles : lumière et composition ; eau et effets locaux ; berges, placement et variation du décor ; matériaux proches ; tokens et composants Basalte & Turquoise ; présentation des poissons et finitions des interfaces. Une fois les tokens en place, applique-les aussi aux écrans secondaires. Respecte l’organisation des sections décrite dans le guide et celle déjà définie par le projet.
>
> Les comportements de pêche, contrats d’interaction, données et sauvegardes restent ceux du dépôt. Évite les changements de règles induits par une amélioration graphique. Les effets visuels liés à une action ou à un poisson suivent les vrais événements du jeu.
>
> Privilégie les solutions mobiles mesurées : eau et reflets simples, ressources réutilisées, nombre d’objets maîtrisé, détail réduit au loin et effets recyclés. Une nouvelle dépendance n’est ajoutée que si l’existant ne suffit pas et si son intérêt est explicite. Les valeurs proposées dans le guide doivent être adaptées après mesure.
>
> Avance par étapes réversibles. Exécute les vérifications pertinentes du projet et vérifie les parcours touchés. Produis des captures avant / après à cadrage identique et un compte rendu des performances disponibles. Signale clairement les tests sur appareil qui n’ont pas pu être exécutés.
>
> Si le dépôt confirme le projet Vercel du jeu déjà autorisé, exécute les contrôles puis déploie sur ce projet selon le workflow existant. Vérifie que `fishdex.fr` sert la nouvelle version. Si l’identité de déploiement n’est pas vérifiable, termine le travail et prépare une version de revue sans choisir arbitrairement un autre projet.
>
> Mets à jour le fichier de passation existant pour Claude et Codex : fichiers modifiés, choix artistiques, contrôles exécutés, mesures, limitations et prochaines étapes. Termine par les résultats concrets, sans présenter des réglages non testés comme des garanties de performance.

## 13. Sources techniques et statut

Les choix artistiques de ce guide sont des spécifications de projet. Les sources ci-dessous appuient les principes de rendu et d’accessibilité, pas une estimation garantie des performances du jeu.

- [MDN — WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) : résolution de rendu, budgets mémoire, compression des textures et regroupement des appels de rendu.
- [Babylon.js — Optimizing Your Scene](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene) et [source officielle de la documentation](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/scene/optimize_your_scene.md) : pistes à adapter uniquement si le moteur du projet est Babylon.js.
- [W3C — Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) : contrastes de texte et conditions du grand texte.

**Statut :** guide prêt pour intégration. Aucun changement du jeu ni déploiement n’a été effectué lors de la rédaction de ce document.
