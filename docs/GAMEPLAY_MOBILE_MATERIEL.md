# Gameplay mobile et matériel — 0.11.0

3 octobre 2026 — Codex. Demande version 2 archivée dans CHANTIER_GAMEPLAY_MOBILE_MATERIEL_CODEX.md. Base main 46301ec ; branche codex/gameplay-mobile-materiel. Catalogue, identifiants, modèles, 15 postes, 22 techniques, 55 recettes, 52 captures/14 observations conservés. Aucun abonnement, dépendance, moteur ou modèle ajouté. DEMARRER_AVEC_CODEX.md préexistant exclu des commits.

## Audit et limites du remplacement

Sources de vérité : AGENTS.md, RELAIS_PROJET.md, BACKLOG.md, dossier matériel existant, techniques-data.json/techniques.ts, rig/progression, fish-registry/profiles/posts. Les documents antérieurs conservent les explications des distributions, droits permanents, raretés, économie et appareils non testés. Le chantier ne réimporte pas les poissons et ne remplace pas ces systèmes.

Le combat ancien mélangeait angle abstrait, récupération, fatigue et distance ; les anciennes réceptions étaient automatiques ou validées par délai/bouton. Le moteur unique combat.ts calcule maintenant géométrie en mètres, nage/vitesse, fil disponible, compliance, charge et frein. Les constantes sont des coefficients de jeu, pas des Newtons ou des garanties biologiques. COMBAT_CONFIG centralise sous-pas 1/120 s, reprise maximale 50 ms, tolérances, mécanique et gestes. Les événements seeded et six attributs existants sont conservés. Aucun bonus du bon côté, compteur de dégâts de bouton, raccourcissement de ligne par déboîtement ou victoire par fatigue.

La traction est nulle avec du mou. Le moulinet retire du fil à vitesse réduite sous charge ; le frein en rend aussi pendant l’appui, jusqu’à la réserve engagée de 45 m. La canne rend la pose géométrique au rendu. Le poisson dépense son énergie par nage/effort et peut revenir, repartir, secouer ou rechercher un obstacle réellement présent. Surcharge cumulée, perte de contact, accrochage et abrasion ont des compteurs distincts, avec pertes sur le maillon prévu par rig.ts. L’abrasion des obstacles reste un modèle commun de prototype, sans textures de fond ou coefficients biologiques par roche/plante.

Canne et action secondaire sont deux zones de 142 × 140 px. Déplacement relatif : 76 px latéralement, 130 px verticalement, pose conservée, inertie temporelle courte. Ferrage par relevage >18 px, >0,1 de pose et <1,5 s ; bouton accessible conservé. Inversion et un doigt séquentiel sont des préférences, sans assistance de pêche. Chaque pointeur se libère indépendamment ; transitions, modales, pause, blur, pagehide, resize et annulations arrêtent les commandes. Le jeu ne rattrape pas le temps d’absence.

Grande canne : recul proportionnel borné à 1,3 m/s, jonction après 1,6 m, axe verrouillé jusqu’au relâchement, retrait de sections réelles de 1,6 m jusqu’au kit de 2,4 m, posé sur six supports réutilisés. Avancée/réemboîtement possibles. Le scion est continu au déboîtement ; aucune modification de la longueur fixe du fil. Télescopique : aucun retrait de sections. Aucun tire-élastique universel ajouté. Collision de la canne avec le corps/sol derrière le pêcheur non simulée.

Réception : accès explicite à portée, jamais volé au maintien de moulinet. Canne conservée, tête déplacée dans l’eau puis relevée. Tolérances de position 0,9 m, gabarit de l’équipement, orientation, profondeur, charge et vitesse réelle ; aucun seuil obligatoire de fatigue ni délai gagnant. Une prise peut repartir et la commande Retour au fil reste disponible. Un petit poisson peut être reçu rapidement. Cette action existe aussi dans les anciens montages sans identifiant de technique.

Les dix moteurs de présentation restent distincts. Coup/grande canne et verticales déposent ; les autres projettent. Feeder chargé, soie préparée, couches/potences, retenue, animations/pauses, parcours/vitesse du bateau et clonk sont conservés. La pause du topwater conserve une courte activité au lieu de refuser à cause d’une impulsion de récupération découpée par les sous-pas.

Sondage : point choisi, fond et microzone mesurés, aucune espèce révélée. Amorçage : point, produit du sac et 1–3 portions, débit immédiat des portions payantes libres, rayon 1,8 m pendant 45 s. Attire les candidats déjà autorisés par habitat/régime/présentation ; ne crée ni espèce ni capture. Les effets de feeder existants restent distincts.

## Matériel et sauvegardes

Ma canne → méthode compatible avec la canne → montage détaillé. Mon sac, Ensembles et Boutique séparée conservés. Cinq repères sur la canne ; pièces du montage regroupées, avancé repliable mais complet. Variantes possédées regroupées par famille ; incompatibles masqués et motif consultable. Fiches : rôle, effets effectivement utilisés, contexte, compromis et paramètres avancés. Mon sac garde quantité libre/engagée, filtres/recherche. Ensembles : favoris, état prêt/manquant et équipement sans duplication.

Le bouton de secours est explicite et conserve technique/recette et réglages de profondeur. Aucun achat automatique. Les manques indiquent quantités/prix par lots ; le coût exposé exclut les durables conservés à la casse. L’aperçu SVG utilise stepPresentation, les composants et le fond sondé/courant ; première descente de 6 s au repos, sans vent/courant. Ce n’est pas une seconde scène ni une prédiction d’une touche.

v7 conservée : préférences controls et favoris optionnels, valeurs par défaut pour anciens JSON. Ancienne valeur combatMode conservée à la lecture mais sans avantage ni pilote automatique. Aucun combat en cours sérialisé. Carnets, droits, fonds, stock, photos et identités inchangés ; TEST et NORMAL gardent leurs clés séparées et photos distinctes. Un retour au lecteur 0.10 peut perdre seulement ces nouvelles préférences/favoris, pas les prises. Exporter les carnets avant tout retour arrière.

## Matrice des méthodes

« Navigateur » signifie événements de commande/réception, rendu, photo et sauvegarde sur Chromium bureau 1440×900 et mobile 390×844. La préparation et rencontre naturelles sont contrôlées dans le moteur Node ; les combats du banc navigateur sont scénarisés et accélérés avant la réception manuelle. Ce banc ne mesure pas les distributions ni la facilité au toucher.

| Méthode / identifiant conservé | Moteur | État livré | Contrôles | Toucher |
| --- | --- | --- | --- | --- |
| Coup à canne télescopique (`coup`) | fixed | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Grande canne à emmanchements (`grande_canne`) | fixed | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Anglaise au waggler (`anglaise`) | fixed | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Bolognaise (`bolognaise`) | drift | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Fond / plombée (`fond`) | bottom | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Feeder à cage (`feeder`) | feeder | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Method feeder (`method_feeder`) | feeder | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Carpe au posé (`carpe`) | bottom | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Approche de bordure / stalking (`stalking`) | surface | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Carpe et poissons blancs en surface (`surface`) | surface | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Lancer aux leurres (`leurre`) | retrieve | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Leurre en verticale (`verticale`) | vertical | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Poisson mort manié (`mort_manie`) | retrieve | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Toc aux appâts naturels (`toc`) | drift | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Mouche (`mouche`) | fly | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Nymphe au fil (`nymphe_fil`) | drift | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Bombette (`bombette`) | retrieve | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Gambe / train de nymphes (`gambe`) | vertical | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Traîne (`traine`) | troll | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Silure au clonk (`clonk`) | clonk | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Leurre ultraléger (`ultraleger`) | retrieve | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |
| Carpodrome à grande canne (`carpodrome`) | fixed | Fonctionnel : rencontre, ferrage, combat et réception ; stock/carnet/photo raccordés | Node naturel + navigateur 2 formats | À tester sur téléphone réel |

## Matrice des systèmes

| Système | État et preuve | À tester / limites |
| --- | --- | --- |
| Géométrie, frein, mou, fatigue et poses | Tests physiques, 30/60 Hz, 52 captures naturelles | Équilibre humain, lisibilité des faibles charges |
| Deux doigts, inversion, un doigt, annulation | Événements Chromium : pose retenue, caméra fixe, libération indépendante | Safari/Android, vraie perte de capture par navigateur |
| Grande canne, kit, sections | Continuité scion/fil, recul latéral/réversible ; 3 individus × 2 adaptateurs × 2 postes | Confort des gestes répétés, volume derrière le pêcheur |
| Épuisette et petite réception | 44 parcours méthode/photo + ferrage par geste ; aucun bouton de capture automatique | Reprises pendant un départ, lecture du gabarit/orientation |
| Profils/obstacles/risques | Six attributs et milieu conservés, passage par géométrie immergée ; casse localisée | Équilibre de l’abrasion commune aux obstacles |
| Sondage / amorçage | Point mesuré, portions payantes débitées, candidats locaux, contrôles UI et stock | Lisibilité de la carte schématique, durée/bonus 1–3 portions |
| Matériel/compatibilité/coûts/aperçu | Conseils sur propriétés, secours sans achat, SVG du même moteur, tests UI et prix | Usage débutant ; définitions et regroupements après retour |
| Économie/XP/maîtrises/FishDex/photos/aquarium | Tests existants conservés ; identité unique et recharge contrôlées | Aucun nouveau test appareil de l’aquarium dans ce lot |
| Sauvegardes/profils | Ancien carnet migré, photo/export/import, TEST ∞ isolé | Sauvegarde locale à chaque navigateur : pas de synchronisation |

## Vérifications et mesures

Base : npm ci, Node24.15, Babylon9.28/Core+Loaders cohérents, TS5.9, Vite8.3. Check de référence 174/174. Après changements : check 186/186 + TypeScript/build, puis 6 tests d’adaptateurs supplémentaires réussis ; check final 193/193 + TypeScript/build réussi. Régressions navigateur existantes : 30 cas distincts contrôlés par lots (22 réussis initialement, puis 6 et 2 reprises ; physique 2/2 également revérifiée). Les anciennes attentes de capture automatique, six repères, pose absolue et le délai de dégagement après dépôt ont été adaptées aux gestes et délais réels, sans modifier les risques pour faire passer les tests. Banc mobile : 6/6 (44 captures méthode, fiches, favoris, sondage), commandes 2/2, ferrage/réception 2/2. Build public sans QA : 6 parcours réussis puis reprise 2/2 de l’ancien carnet après raccordement de la réception des montages legacy. Les premières reprises ont également corrigé le pilote CDP (annulation sans touche active, pose initiale et retour au fil) ; ne pas présenter ces échecs comme des mesures de fluidité.

 Préproduction initiale refusée par TypeScript : import QA depuis tests/ exclu par .vercelignore. Pilote partagé déplacé dans src/testing/combat-driver.ts, chargé seulement en DEV/E2E et absent du build public ; check193/193 relancé et 4 parcours navigateur reprise validés. Aucun changement de mécanique pour cette réparation.

Captures avant/après : apercus/mobile-materiel/*, script mobile-reference.mjs, caméra [0,4.2,-8.5], seed0, qualité eco/DPR1. Même poste/FishDex/Matériel/montage, 8 vues par état. Chromium Windows ANGLE SwiftShader, fenêtre de 3,5 s ; aucune extrapolation téléphone.

| Vue | FPS avant → après | Meshes total | Draw calls observés | CPU frame courant Babylon |
| --- | --- | --- | --- | --- |
| Bureau | 22,18 → 22,66 | 64 → 72 | 27 → 28 | 0,4 → 0,8 ms |
| Mobile émulé | 22,79 → 22,79 | 64 → 72 | 23 → 24 | 0,9 → 1,0 ms |

Ces compteurs CPU de soumission ne sont pas le temps GPU ni un percentile. 57 792 → 57 976 vertices total ; huit meshes réutilisés pour sections/élastique/manche. Aucun GLB au démarrage ; ressources à la demande conservées. Le bundle principal dépasse encore 900 kB (avertissement Vite), sans nouvelle dépendance. Pas de mesure de batterie/chauffe ni test iPhone/Android physique.

Rejeux réels 0.10/0.11 : mobile, même canne/recette/individu/graine127, seul appui moulinet pendant 5 s, sans réception. replays.json conserve la configuration exacte, diagnostic et temps réellement écoulé. Gardon15 : distance 6,86 → 4,29 m, charge 0,78 → 0,58 ; carpe60 : rupture à 3,88 s dans l’ancien modèle, toujours en combat après 5,18 s avec charge 0,30 dans le nouveau. C’est un scénario, pas une promesse de réussite ; les sorties de fil et retours expliquent le résultat. Captures before/after-replay-* au même cadrage. Ancien build conservé dans .migration/dist-before-mobile uniquement pour revue, hors distribution.

## Procédure téléphone

1. Ouvrir https://www.fishdex.fr puis Menu → Aide → Mode test → Ouvrir mon profil de test. ∞ s’affiche ; la partie normale reste séparée. Un autre téléphone/navigateur possède son propre profil local.
2. Dans Mode test, choisir une des 22 techniques, sa recette, Préparer le kit et son milieu. Feeder doit être garni ; préparer la soie à la mouche. Pour la traîne choisir vitesse/parcours du bateau ; pour clonk espacer les séries.
3. Pour un essai naturel, revenir au jeu, sonder/amorcage si pertinent, Matériel → montage : regarder la descente, régler profondeur, choisir une pièce compatible ou monter le secours. Glisser du tiers bas vers l’eau et relâcher au centre. Coup et verticales déposent. Observer la touche ; relever brièvement la canne ou toucher Ferrez.
4. Essai rapide reproductible : Mode test → espèce/taille/graine → Combat direct. Gardon15/127, carpe55/33 et tanche28/4242 permettent de comparer. Départ/Retour/Accalmie de 5 s et Fuite vers un obstacle sont des intentions forcées, sans supprimer risques ni inventaire ; choisir l’anse/roseaux pour un obstacle.
5. Canne à gauche : glisser horizontalement pour orienter, verticalement pour relever/baisser ; la pose reste après relâchement. À droite maintenir pour récupérer avec un moulinet. Un départ peut en rendre malgré l’appui. Lire courbure, mou, sortie et point d’entrée. Menu → Aide permet inversion/un doigt, petit indicateur de tension et conseils ; aucune option ne pêche à votre place.
6. Grande canne : à droite glisser vers soi, relâcher/reprendre si nécessaire jusqu’à Jonction accessible, puis glisser latéralement pour retirer une section. Répéter jusqu’au kit ; glisser en sens inverse permet de réemboîter après réavancée. Aucun moulinet ; ligne fixe. Telescopique ne déboîte pas.
7. À portée, toucher Préparer la petite réception ou Prendre l’épuisette. À droite déplacer la tête sous la prise ; quand Relever apparaît, relâcher puis effectuer un court glissement vers le haut. La canne reste à gauche. Si la prise repart ou si le fil se détend, Revenir au fil puis reprendre la récupération. Photo/carnet sont enregistrés une seule fois après la réception.
8. Relâcher une prise, consulter FishDex/carnet et favorites/aquarium, recharger la page et vérifier l’identité/photo. Tester rupture de chaque segment, stock épuisé, kit gratuit et réparation dans Mode test. Ne pas réinitialiser le profil normal pour un essai. Exporter vos carnets pour les conserver hors de ce navigateur.

## Sources et prochaines étapes

Sources déjà documentées dans RECHERCHE_TECHNIQUES_V2.md et le dossier fourni. Compléments primaires lus : Decathlon « Comment choisir son moulinet » (frein sous charge), « monter son kit avec un passe-élastique externe » (élasticité/dispositif), Garbolino peche-a-deboiter (recul, rouleau, support). Le PDF fédération Calvados cité par le cahier n’a pas été exploité : lecteur web refusant sa taille. Aucun chiffre de matériel commercial transféré comme coefficient physique.

Essais physiques obligatoires pour valider le confort réel : deux pouces, un doigt, inversion, sorties/pause, recul du kit, visibilité du mou, épuisette, montage débutant, coût/casse, chaleur et reprise de sauvegarde. Ajuster les constantes après ces retours ; ne pas annoncer 60 FPS appareil. Publication et empreintes : VERCEL.md et apercus/mobile-materiel/publication.json après contrôles hébergés.
