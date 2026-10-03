# Eau — Rendu, événements et profils mobile

Spécification de production. Les fréquences, dimensions et durées sont des réglages initiaux de jeu, à ajuster en test. Le module utilise les événements et unités du dépôt ; il ne remplace pas la simulation de pêche.

## 1. Ce que signifie « meilleure eau possible »

Une eau crédible depuis les six postes, animée, intégrée aux berges et lisible en combat. Les reflets doivent valoriser le lieu sans transformer le lac en miroir métallique. La finesse du rendu augmente seulement dans le budget disponible.

Priorité : signaux de pêche → cohérence des berges et profondeur → lumière/reflets → rides → détails supplémentaires. Les effets spectaculaires ne doivent pas rendre l’état du montage incompréhensible ni occuper la moitié de l’écran.

Comparer une scène au repos, un lancer, un combat, la réception et plusieurs effets simultanés. Ne pas choisir le matériau sur une seule capture de l’eau au soleil.

## 2. Surface au repos

Deux couches de normales animées de taille/direction/vitesse différentes, ou équivalent procédural, pour éviter un défilement uniforme. Ajouter des variations lentes et bornées sans mouvements d’océan. Fréquences initiales distinctes et directions peu alignées, à adapter selon l’échelle du lac.

Petites rides visuelles à l’échelle centimétrique. Une éventuelle déformation géométrique est faible et partagée avec les objets qui flottent ; ne pas ajouter une houle de plusieurs mètres sur un étang abrité. Le vent peut avoir une force locale réduite dans l’anse si une telle source existe dans le jeu.

Réponse à l’angle de vue par réflexion et transparence cohérentes : davantage de réflexion aux angles rasants, davantage de lecture du fond près du bord. Rugosité suffisante pour éviter le chrome liquide. Contraste du soleil contrôlé, avec antialiasing visuel des hautes lumières si disponible.

## 3. Profondeur, turbidité et berges

Profondeur provenant de la ressource commune de la carte. Transition graduelle peu profond/plein eau, teinte plus sombre avec profondeur et absorption apparente. Pas d’eau de piscine uniformément transparente à 8 m.

Turbidité de milieu configurable et continue ; elle définit jusqu’où les fonds et poissons sont lisibles. Ne pas la modifier arbitrairement pour cacher un bug d’animation. Les caustiques, si implémentées, sont discrètes et réservées au fond très proche ; elles sont optionnelles dans les profils.

Masque de rivage pour atténuation des vagues, humidité de berge et contact avec les objets. Sur cet étang, le contact ne produit pas un anneau de mousse blanche autour de toute la rive. Une mousse de remous ou d’impact est locale et temporaire.

Éviter fuites sous le terrain, lac visible au-delà de son contour, surfaces imbriquées et z-fighting. Les éléments partiellement immergés montrent une limite de contact cohérente, avec matériaux adaptés sur leur partie mouillée.

Le calcul de profondeur depuis une texture de scène, si utilisé, doit gérer les conventions du moteur, la linéarisation et le backend. Prévoir un fallback fondé sur la bathymétrie si cette voie n’est pas disponible. Pas de shader noir sur un appareil qui ne possède pas le chemin de rendu prévu.

## 4. Reflets et réfraction

Réflexion d’environnement comme base stable ; réflexion planaire sélective pour les profils qui peuvent la payer. Choisir une liste d’objets utile : rive visible, grandes silhouettes, ponton et éléments proches pertinents. Ne pas rerendre tous les objets décoratifs ou l’interface dans le miroir.

Rendu réfléchi à résolution limitée, cadence réduite si la caméra et les objets le permettent, mise à jour immédiate lors d’un changement de poste/ambiance. Masquer l’eau dans sa propre passe ; traiter le plan de clipping et éviter les objets retournés sous la surface. Mesurer le coût de la seconde passe.

Réfraction simplifiée par distorsion contrôlée des éléments sous l’eau, ou rendu dédié uniquement s’il est justifié. Ne pas déformer les berges opaques ou le fil hors de l’eau comme s’ils étaient immergés. Filtrer et limiter les décalages sur silhouettes pour éviter les doubles contours.

La surface, le fond et les poissons doivent avoir un ordre de rendu transparent/depth correct. Le matériel de jeu reste identifiable. Un profil faible peut simplifier la réfraction et conserver une perception de profondeur crédible.

## 5. Contrat partagé pour la surface

Prévoir une fonction de niveau/surface consultable par flotteur, éléments flottants, poissons qui émergent, impacts et épuisette. Le niveau moyen est commun ; les déformations physiques optionnelles sont distinctes des micro-rides de normale uniquement visuelles.

Un shader de normale ne soulève pas automatiquement le flotteur de 20 cm. Si une déformation géométrique existe, utiliser le même modèle mathématique et temps pour le flotteur ou une approximation bornée visuellement équivalente.

Le passage à une qualité inférieure ne modifie pas la tension, la flottabilité utile, la profondeur de l’appât, les rencontres ou la réussite. Pour les événements essentiels, conserver un retour simple même lorsque les particules décoratives sont réduites.

## 6. Bus d’événements proposé

Adapter l’API au dépôt. Payload conceptuel : ID unique, type, heure de simulation, position monde, direction, amplitude normalisée, source poisson/montage/objet, durée, importance et graine éventuelle.

Séparer événements ponctuels (impact, immersion, saut) et émetteurs continus (sillage, trajet de leurre, pluie). Le propriétaire démarre/met à jour/arrête son émetteur ; pas d’événement d’impact à chaque frame. Les IDs empêchent les doublons de relecture, pause ou changement de scène.

Déclencher depuis la simulation et les contacts réels avec la surface. Une animation cosmétique ne choisit pas un poisson, une touche ou une récompense. Les scénarios de développement peuvent déclencher des événements isolés, sans les présenter comme une capture réelle.

## 7. Matrice des événements à raccorder

| ID | Déclencheur réel | Retour attendu | Importance |
| --- | --- | --- | --- |
| cast_impact | Montage traverse la surface au point final du lancer | Petit impact, rides qui s’élargissent, son selon masse/vitesse | Essentiel |
| line_deposit | Dépôt contrôlé au coup ou posé proche | Contact discret et une petite ride, distinct d’un lancer puissant | Essentiel |
| float_enter | Flotteur entre dans l’eau | Contact bref puis stabilisation selon sa flottabilité | Essentiel |
| float_motion | Déplacement de flotteur en surface | Petit sillage et oscillation cohérents avec courant/traction | Essentiel |
| bite_float | Force de touche agit sur flotteur | Enfoncement/remontée/déplacement selon montage ; rides seulement si contact | Essentiel |
| float_submerge | Flotteur passe sous la surface | Disparition progressive crédible, petite perturbation de contact | Essentiel |
| float_resurface | Flotteur remonte réellement | Réapparition, gouttes/ride brève ; pas un indicateur automatique de fatigue | Essentiel |
| strike_surface | Ferrage produit un mouvement près de surface | Perturbation liée à la ligne/objet, pas explosion systématique | Essentiel |
| lure_surface | Leurre traverse ou travaille près de surface | Sillage, splash ou remous selon type/animation du leurre | Essentiel |
| lure_submerge | Leurre entre sous l’eau | Impact léger et atténuation ; pas un sillage permanent en profondeur | Important |
| bait_sink | Esche/lest/feeder descend | Descente lisible près du bord, bulles très limitées si justifiées | Important |
| feeder_impact | Cage ou method touche la surface | Impact gradué par masse/vitesse, rides et son différenciés | Essentiel |
| groundbait_impact | Portion d’amorce est réellement délivrée | Impacts groupés/localisés et diffusion visuelle discrète | Essentiel |
| fish_near_surface | Poisson nage proche de la surface | Remous orientés si profondeur permet une perturbation perceptible | Important |
| fish_surface_turn | Virage/secousse proche de surface | Remous et rides correspondant au mouvement | Essentiel |
| fish_surface_break | Poisson traverse la surface ou saute, si son profil le permet | Splash, gouttes et réentrée au contact réel | Essentiel |
| fish_dive | Poisson replonge après émergence | Réentrée et résorption, jamais splash supplémentaire à chaque frame | Essentiel |
| line_surface_drag | Segment de ligne réellement en contact/glissement | Trace très subtile, sans gros sillage d’embarcation | Important |
| obstacle_disturbance | Contact réel avec végétation flottante/branche | Mouvement local, eau perturbée si objet bouge | Important |
| net_enter | Tête d’épuisette entre dans l’eau | Ride large légère et son, pas jet de particules énorme | Essentiel |
| net_capture | Poisson entre réellement dans l’épuisette | Perturbation liée à poisson/filet, retour de réussite discret | Essentiel |
| net_exit | Épuisette sort de l’eau | Égouttement court et rides résiduelles | Important |
| fish_release | Relâcher remet le spécimen au contact de l’eau | Contact, nage de départ, perturbation puis arrêt | Essentiel si relâcher existe |
| ambient_surface | Activité ambiante réellement simulée ou événement décoratif explicite | Petite ride localisée ; aucun faux signal de touche à répétition | Décoratif |
| rain_surface | Pluie active dans météo/ambiance implémentée | Rides éparses, pas une particule par goutte du lac entier | Conditionnel |
| wind_change | Source commune de vent change | Transition progressive des rides et des végétaux | Conditionnel |
| boat_wake | Embarcation existante se déplace dans ce plan d’eau | Sillage lié à vitesse/direction et arrêt au repos | Conditionnel |
| spot_transition | Nouveau poste actif | Réinitialiser émetteurs locaux, actualiser reflet, conserver ambiance commune | Technique |

Conditionnel signifie : brancher sur la fonction existante si elle est applicable, et proposer un scénario de développement isolé si utile. Cela ne demande pas une nouvelle météo complète ni un bateau artificiel sur l’étang. Documenter les cas non applicables. Pas de vagues d’océan, crues ou fluides volumétriques requis.

Pendant un combat au flotteur, l’eau ne doit pas faire réapparaître le flotteur pour informer artificiellement le joueur. Son état dépend de sa position et du montage. Les mouvements du poisson restent principalement lisibles dans le fil/canne.

## 8. Effets légers et relation à la scène

Rides locales : petit pool de quads/maillages ou perturbations shader dans un buffer borné. Positionner sur la surface avec offset minimal. Durée indicative 0,8–3 s, amplitude décroissante, expansion graduelle. Varier taille/orientation selon l’objet et la graine, sans ajouter d’immenses cercles identiques à chaque contact.

Splashes : particles/sprites sobres ou petits maillages instanciés, jamais une simulation fluide volumétrique obligatoire. Les gouttes tombent/expirent et ne suivent pas la caméra. La petite goutte d’un flotteur diffère de la réentrée d’un grand poisson.

Diffusion d’amorce : indication locale et brève ; les effets de nourrissage sont portés par la logique d’amorçage réelle. Le nuage ne fait pas apparaître automatiquement un poisson ni ne révèle tout le fond.

Bulles : uniquement un événement ou un objet qui les justifie, avec parcimonie. Un poisson passant en profondeur ne laisse pas systématiquement une piste de bulles jusqu’au joueur.

Sons : familles impact léger/lourd, rides, plongée, filet, égouttement, ambiance. Variation de volume/vitesse légère, distance et simultanéité bornées. Utiliser les sons existants ; à défaut fallback simple et liste de production. Ne pas lancer un nouvel AudioContext par événement. Déverrouiller le son selon les règles du navigateur ; aucun son obligatoire pour réussir.

## 9. Profils initiaux de qualité

| Paramètre | Bas | Standard | Haut |
| --- | --- | --- | --- |
| Surface | Normales animées et teinte/profondeur commune | Même base + détails proches | Détails supplémentaires si mesurés utiles |
| Reflet | Environnement ; pas de seconde passe obligatoire | Planaire sélectif 256 ou 512 px | Sélectif 512 px ; 1024 seulement si coût justifié |
| Actualisation reflet | Sur changements pour environnement | Env. 10–15 Hz, adaptation caméra | Env. 20–30 Hz ou selon mouvement |
| Réfraction | Approximation bathymétrique/simple | Distorsion contrôlée près de rive | Passe dédiée uniquement après mesure |
| Rides actives | 12 | 24 | 40 |
| Gouttes actives | 32 | 80 | 128 |
| Caustiques / détails fond | Facultatifs | Proches et discrets si utiles | Proches, sans visibilité irréaliste |

Ces limites concernent les effets visibles actifs, pas toute l’activité simulée. Les coefficients de gameplay et niveaux physiques restent identiques. Chiffres de prototype à mesurer, pas exigences absolues du matériel.

Réserver des slots aux signaux essentiels. Quand un pool est plein, réduire/retirer d’abord décor et effets anciens ; fusionner des impacts voisins quand cela reste compréhensible. Conserver au minimum un contact/ride/son ou signal visuel simple pour un ferrage, une touche et une réception. Les événements importants n’attendent pas plusieurs secondes leur tour.

Dégrader d’abord détails secondaires et résolution de reflet, puis résolution interne. Éviter des changements constants : délai/hystérésis, reprise lente de qualité et réglage manuel. Détecter les capacités du navigateur avant de créer un chemin avancé ; ne pas rendre WebGPU obligatoire si le jeu possède un fallback WebGL compatible.

## 10. Scénarios et preuves

Scénarios répétables : eau calme sans événements ; lancer léger puis feeder ; déplacement/immersion/réapparition du flotteur ; leurre surface puis profond ; poisson proche puis profond ; sortie/réentrée ; amorçage ; entrée/capture/sortie d’épuisette ; relâcher si fonctionnel ; pluie et bateau si applicables ; 30 impacts de test ; transition de poste ; pause/reprise.

Dans chaque scénario, vérifier position, début/fin, échelle, son, absence de doublon et niveau de qualité. Trois profils, trois ambiances, plusieurs angles de rive. Le scénario à 30 impacts sert à vérifier la réduction des effets, pas à justifier 30 grosses explosions simultanées en jeu.

Contrôler : pas de shader noir, de bord blanc géant, de texture glissante sur les objets, de reflet d’UI, de poisson fantôme dupliqué, de lac transparent jusqu’à la fosse, ni d’effets sur la terre. Aucun changement de qualité ne produit une capture, casse ou immersion différente.

Pause gèle l’heure de simulation et les événements associés. Reprise/chargement nettoie les émetteurs périmés. Changer de poste ne rejoue pas les impacts déjà consommés. Si contexte GPU perdu, suivre le mécanisme de restauration du moteur sans dupliquer la scène ni attribuer une récompense.

La matrice finale indique pour chaque événement : branché sur jeu, contrôlé en scénario, qualité bas/standard/haut, à tester sur appareil ou non applicable avec raison. Fournir captures et mesures réellement obtenues.
