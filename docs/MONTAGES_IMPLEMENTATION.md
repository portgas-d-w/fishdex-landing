# Canne, stock et profils — intégration du 2 octobre 2026

## Accessible

Matériel ouvre Ma canne ; canne possédée → méthode compatible → montage. Six repères sur un schéma SVG léger, choix contextuels possédés, bouchon/lests/fixation/terminal dépendant de la méthode. Mon sac affiche les possessions, stock libre et réservé ; filtres famille, compatibilité, faible stock. Ensembles enregistre jusqu’à douze recettes nommées, sans créer de stock ; application atomique après contrôle de tous les manques et de la canne. Les trois cannes déjà achetées sont polyvalentes et restent compatibles avec les trois méthodes.

Boutique et sac utilisent COMPONENTS dans src/game/rig.ts. Achats de lots avec quantité, solde et confirmation. Kit complet illimité et non revendable ; aucune revente ni conversion. Les composants payants mélangés au kit restent exposés à leur perte normale. Mon montage affiche l’ordre des pièces sur le fil ; armement du leurre intégré, pas d’hameçon ou d’esche ajouté. Choix d’une autre méthode conserve les composants compatibles et explique le remplacement par le kit, sans supprimer les achats.

Les 22 méthodes, 55 recettes, 80 esches/leurres/amorces, 84 familles avec 274 variantes, 62 profils et 27 apparences sont consultables dans le catalogue partagé de la boutique et du FishDex. Les 91 sources restent accessibles dans les fiches. Bibliothèque chargée au premier accès, sans modèle 3D. Catalogue ne vaut pas mécanique activée. Les identités douteuses et observation restent présentes, sans nouvelle prise possible.

## Simulation raccordée

Flotteur : profondeur choisie entre 0,2 et 4 m, limitée par le fond du poste ; descente selon masse et distribution ; portance nominale distincte du lest intégré. Approximation hameçon + esche 0,15 g, toutes masses internes des prototypes de jeu. Surcharge visible par immersion du bouchon et rencontre moins lisible. Fond utilise la profondeur du poste ; leurre utilise sa masse et exige récupération/animation pour rencontrer un poisson. Ces deux méthodes existantes sont préservées.

La liste d’espèces locales est préfiltrée par habitat (aucun silure dans la bordure de roselière, aucun sandre sous le saule), puis strate de présentation, régime documenté et calibre. Pondérations, strates et temps de touche sont des hypothèses de jeu. Le profil sert à filtrer une rencontre plausible, sans pourcentage scientifique affiché. Pas de saison, température ou courant inventé ; matin et eau calme conservés. Le taux par seconde intègre un budget exponentiel après latence ; nombre de frames indépendant à pas fixe.

Quinze profils reliés aux taxons existants, variations individuelles bornées, intensité des départs, durée d’effort, changements de direction, secousses, retour créant du mou et refuge accessible. Force liée au gabarit, fatigue sous pression modérée et récupération limitée du petit poisson ; fil/reel/bas de ligne modifient le contrôle. Notes normalisées originales, jamais mesurées biologiquement. Anti-dents protège dans le modèle de jeu ; aucune invisibilité ou résistance absolue annoncée.

## Transactions et migration

Version 4, même clé localStorage. Versions 1/2/3 acceptées ; journal, photos IndexedDB, records, formes, récompenses, XP, monnaie, favoris et achats conservés. Kit ajouté sans retirer une possession ; méthodes anciennes converties en recette valide ; ancien cercle forcé à appui. Les IDs des quinze poissons ne changent pas. À zéro écus, une action explicite rééquipe le kit complet.

Lancer valide : configuration copiée en instance active, ID UUID et graphe fiable, réservation atomique sans débit. Moulinet réservé durable ; fil réserve au maximum 45 m pour couvrir le combat ; le reste de la bobine reste libre. Bas de ligne engagé 0,6 m. Retour/capture/décrochage : une esche utilisée consommée ; composants réutilisables libérés. Rupture : parcours des liaisons et branches ; bas de ligne/hameçon/esche seulement sur rupture terminale, ou fil engagé et éléments aval sur rupture principale. Stop retient le coulissant ; sortie ouverte peut perdre le lest ; clip détache seulement sa branche. Canne et moulinet restent conservés. Lien faible déterminé par résistances simplifiées et coefficients de nœud déclarés dans le code, pas par le prix.

Résolution idempotente par ID et état de l’instance active. La dernière transaction reste consultable. Pas de dommage invisible cumulatif. Reload/import pendant une ligne non résolue : retour conservateur sans capture, composants récupérables préservés, esche utilisée débitée une fois, réservation libérée puis état écrit avant reprise. Aucune modification du montage en service via un panneau, même en pause.

## Partiel et futur

Trois méthodes de base seulement ; pas de feeder/mouche/toc/clonk/traîne activés. Pas de mécanique d’observation, de nouveaux habitats, d’animation squelettique, ni de nouveaux GLB. Les 274 exemples conservent leurs prix et résistances inconnus, sans bouton d’achat. Atelier graphique schématique ; réglages de frein manuels, positions libres de chaque plomb et usure sont futurs. La politique de retour après reload est volontairement conservatrice, sans restauration du combat.

Les forces/résistances sont encore normalisées en unités de jeu ; les masses et mètres ont leurs unités séparées. Aucun rapprochement entre poids d’un poisson et charge de rupture physique réelle. Les tarifs et le rythme économique doivent être testés par le propriétaire. Contrôles Safari/iPhone réel, chauffe et autonomie non réalisés.

## Extension

Ajouter un profil confirmé dans le dossier puis scripts/import-design.py, un ID/GLB/habitat dans les catalogues existants et les tests de rencontre ; ne pas activer un modèle de substitution. Ajouter un composant dans COMPONENTS avec unité, pack/prix, compatibilités et propriétés concrètes ; UI boutique/sac le reprend. Ajouter une recette après validation des slots et de son graphe, pas en activant simplement playable dans un JSON. Tester manque de stock, perte, événement répété et import avant activation.

## Vérifications locales

Dossier : PASS 6 151 contrôles. npm ci : zéro vulnérabilité. npm run check : 47 tests + TypeScript/build réussis. Navigateur : 48 réussis / 2 exclusions prévues, 4,2 min ; complément atelier après correction des cases de filtre 6/6. Smoke build sans QA : 8/8, 1,8 min ; capture/photo/export/import, 15 GLB, favoris/décor/achats, atelier/lots/ensembles/catalogue. Portrait 390×844 et bureau inspectés. Avertissement de taille Babylon conservé : bundle principal 1,81 Mo / 442 Ko gzip, bibliothèque différée 511 Ko / 50 Ko gzip. Aucun résultat iPhone réel.

Publication : commit c4731a3, preview protégée 8/8 puis domaine public www.fishdex.fr 8/8, 1,8 min chaque. Domaines/projet conservés ; retour avant montages disponible. Voir docs/VERCEL.md pour IDs, empreintes et limites de retour des sauvegardes.
