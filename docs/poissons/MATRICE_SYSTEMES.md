# Méthodes et systèmes — poissons 0.10.0

La matrice détaillée des 22 méthodes/55 recettes demeure `../MATRICE_V2.md` ; ses restrictions anciennes aux quinze poissons sont remplacées par `MATRICE_POISSONS.md/json`. Les méthodes disponibles sont : coup, grande canne, anglaise, bolognaise, fond, feeder, method feeder, carpe, stalking, surface, leurre, verticale, mort manié, toc, mouche, nymphe au fil, bombette, gambe, traîne, clonk, ultraléger et carpodrome. Chacune conserve sa présentation, sa touche, son ferrage et son adaptateur de combat.

| Système | Fonctionnel | Contrôlé | Toucher / limite |
|---|---|---|---|
| 22 méthodes, 55 recettes, 10 moteurs | Oui, pas de simple bouton À venir | Régressions V2, chaînes UI et banc fini 264 lancers | Sensations humaines à tester |
| Identités et alias | 64 espèces, 2 hybrides, 29 formes/écotypes | Unicité, parents, sources, IDs historiques, faux records écartés | Placeholder hors objectifs |
| Populations et microzones | 15 postes, milieux/continents séparés | Aucun taxon nord-américain/asiatique dans l’étang ; 52 rencontres naturelles avec présentation valide | Fréquences à équilibrer après essais |
| Six attributs de combat | Départs, retours, fatigue, angles, coups de tête, obstacles réels | Tests causaux à un attribut modifié, cadence 30/60/120, replay déterministe | Valeurs de jeu, pas mesures biologiques |
| Profondeur, courant, matériel | Présentation/traction, compatibilités et pertes | Scénarios V2 et rencontres dans les milieux nouveaux | Température/météo non simulées |
| Capture, réception, photo | Identité/robe/graine conservées | 52 identités et 27 robes UI avec acteur 3D/photo/stockage/recharge, deux vues | Réception simplifiée, appareil à tester |
| Observation | 14 identités et 2 robes ; suivi 12 s + photo | Effort réel interrompable, découverte unique, zéro écu/prise/favori | Observation de prototype ; confort à tester |
| FishDex/progression | Dénominateur réalisable 66, formes séparées, maîtrise | Alias/records ne gonflent pas le compteur ; capture et observation y contribuent | Économie humaine non validée |
| Carnet | Photos réelles, infos et filtres combinés | Quatre ouvertures sans gain ; parent/robe/recette/poste | Photos Blob locales, régénérables |
| Aquarium | Cinq captures favorites, rapports de taille et nage de famille | Cinq gabarits/robes, 81 positions orbitales, reload et retour à un moteur | Pas de simulation d’écosystème ni preuve de non-collision entre poissons |
| Matériel et Boutique | Sections et tokens existants conservés | Prix/packs/compatibilité, stock fini, casse idempotente et secours | Schémas neutres pour images absentes/trompeuses |
| Normal/Test | Sauvegardes et photos séparées, solde ∞ affiché | Texte/données normales conservés, reset/règles finies, pas d’Infinity JSON | Mode test en revue seulement |
| Migration | v1–v6 vers v7, historique inconnu conservé/exportable | Individus, droits, stocks, cinq favoris, gains et aliases | Retour vers 0.9 exige sauvegarde avant-v7 |
| Assets | Import local à la demande, 33 exacts + 33 provisoires | Six fichiers source et quinze GLB inchangés, images normalisées/inspectées | 29 robes procédurales provisoires |
| Performance | Budget maîtrisé et scènes suspendues hors vue | Captures identiques, aucun GLB initial, libération et mesures PC | FPS/appareil/chauffe/autonomie non certifiés |

Aucune identité confirmée bloquée. Aucun gameplay biologique inventé pour un poisson qui doit être observé. Les contrôles browser avec rencontre forcée prouvent les chaînes de présentation et stockage ; les distributions naturelles ont leurs contrôles séparés.

## Chaque méthode après intégration

La chaîne contrôlée comprend préparation, présentation propre, touche/ferrage, combat avec son adaptateur, réception, photo et sauvegarde. Les chaînes UI forcent une rencontre ; le banc ci-dessous conserve rencontres, argent et stock normaux. Les 55 recettes passent aussi la chaîne naturelle dans les tests du moteur. Toucher physique : à tester pour chaque ligne. Aucun blocage connu.

| Méthode | Moteur de présentation | Recettes compatibles | Captures naturelles / 12 lancers | UI/photo/recharge bureau et mobile | Toucher |
|---|---|---:|---:|---|---|
| Coup à canne télescopique (coup) | fixed | 3 | 11 | Contrôlé | À tester |
| Grande canne à emmanchements (grande_canne) | fixed | 3 | 11 | Contrôlé | À tester |
| Anglaise au waggler (anglaise) | fixed | 4 | 12 | Contrôlé | À tester |
| Bolognaise (bolognaise) | drift | 3 | 12 | Contrôlé | À tester |
| Fond / plombée (fond) | bottom | 3 | 12 | Contrôlé | À tester |
| Feeder à cage (feeder) | feeder | 3 | 12 | Contrôlé | À tester |
| Method feeder (method_feeder) | feeder | 2 | 12 | Contrôlé | À tester |
| Carpe au posé (carpe) | bottom | 11 | 12 | Contrôlé | À tester |
| Approche de bordure / stalking (stalking) | surface | 2 | 12 | Contrôlé | À tester |
| Carpe et poissons blancs en surface (surface) | surface | 2 | 12 | Contrôlé | À tester |
| Lancer aux leurres (leurre) | retrieve | 15 | 4 | Contrôlé | À tester |
| Leurre en verticale (verticale) | vertical | 2 | 12 | Contrôlé | À tester |
| Poisson mort manié (mort_manie) | retrieve | 1 | 7 | Contrôlé | À tester |
| Toc aux appâts naturels (toc) | drift | 2 | 12 | Contrôlé | À tester |
| Mouche (mouche) | fly | 4 | 12 | Contrôlé | À tester |
| Nymphe au fil (nymphe_fil) | drift | 2 | 12 | Contrôlé | À tester |
| Bombette (bombette) | retrieve | 2 | 11 | Contrôlé | À tester |
| Gambe / train de nymphes (gambe) | vertical | 1 | 12 | Contrôlé | À tester |
| Traîne (traine) | troll | 2 | 12 | Contrôlé | À tester |
| Silure au clonk (clonk) | clonk | 1 | 12 | Contrôlé | À tester |
| Leurre ultraléger (ultraleger) | retrieve | 7 | 7 | Contrôlé | À tester |
| Carpodrome à grande canne (carpodrome) | fixed | 2 | 11 | Contrôlé | À tester |
