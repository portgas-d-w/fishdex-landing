# Correction immersive — 0.3.0, 1 octobre 2026

Demande explicite : retirer les panneaux de pêche, lancer uniquement par geste, rendre la canne causalement nécessaire et remplacer le maintien du moulinet. Précision utilisateur par image : deux commandes rondes en bas, canne à gauche / moulinet à droite ; aucun encadré sur le comportement du poisson, aucune jauge de tension.

## Diagnostic et corrections

La version 0.2 conservait un bouton de lancer prédéfini et de larges panneaux ; le moulinage était un booléen maintenu. L’orientation contribuait à la simulation mais ne conditionnait pas suffisamment la récupération. La canne avait une excursion trop grande dans le cadrage portrait, corrigée par amplitude visuelle adaptée au champ horizontal sans modifier les forces. Les quatre orientations extrêmes sont contrôlées par projection de la pointe et captures.

En 0.3, seuls Menu et Matériel sont présents au repos. Les méthodes/appâts sont dans la préparation ; carnet, FishDex, boutique, bassin, progression et réglages restent disponibles dans le menu. Ouvrir un écran suspend le combat, annule les gestes et bloque les actions sur la scène. Les retours passent par l’écran parent. Les conseils de début sont transitoires, les découvertes/records/récompenses après la prise. Aucun panneau/jauge/compteur permanent de combat.

Lancer : glissement de scène, trajectoire/cible pendant le geste, coordonnées réelles au relâchement. Gestes courts, hors eau/portée, interruption, rotation ou pause sont refusés/annulés sans lancer. Ni bouton ni poste automatique ; espace ferre seulement à la touche.

Combat : canne glissée dans quatre directions avec la commande gauche ou la scène. Second doigt circulaire à droite ; sur PC, glissement et molette simultanés. La commande gauche suit le doigt sans retour automatique des règles ; relâcher garde l’orientation. Un cercle immobile, le moyeu ou un saut angulaire ne récupèrent rien. Les tours s’épuisent rapidement, sans maintien latent. Pointercancel, perte de capture, pause, resize, blur, pagehide et page cachée annulent les commandes.

Les règles pures de combat produisent tension, alignement, récupération et échappée selon hauteur/orientation, résistance et départ. Le rendu utilise le même état : poisson spatial, entrée du fil, mou, courbure et orientation. Le bouchon flotteur est immergé jusqu’à proximité ; fond/leurre n’ajoutent pas de bouchon. L’équivalent accessible du fil (angle/tension) reste non visuel ; aucune flèche de solution. Pas de changement du schéma v2 ni de la clé de sauvegarde ; photos et unicité des récompenses conservées.

## Comparaison contrôlée

[Résultats complets](apercus/immersion-combat-comparison.json), reproductibles par `node --experimental-strip-types scripts/compare-combat.mts`. Quinze rencontres naturelles sélectionnées avec taille médiane identique, point/méthode identiques pour chaque paire, pas 1/60 s, puissance 1,32. Même stratégie de moulinage : 1,6 tours/s hors départ, 0,1 pendant départ, suspendu au-dessus de tension 0,72. Seules orientation et hauteur diffèrent.

| Même poisson, après 2 s | Canne fixe (yaw 0, hauteur 0,5) | Canne suivant le fil (hauteur 0,2 départ / 0,68 repos) |
| --- | --- | --- |
| Gardon : récupération / tension | 0 % / 54,5 % | 71,6 % / 40,1 % |
| Brochet : récupération / tension | 0 % / 60,6 % | 36,0 % / 50,1 % |
| Silure : récupération / tension | 0 % / 60,9 % | 32,5 % / 52,1 % |
| Captures sur les quinze scénarios | 0/15 ; refuges à 90 s | 15/15 ; 2,2–9,82 s avec suivi parfait |

Ces contrôleurs de simulation parfaits démontrent les conséquences réelles des actions ; ils ne prédisent pas la durée ni le ressenti d’un joueur sur téléphone. Les tests de logique comparent aussi orientation opposée, canne basse/contact, épuisement de tours et casse.

## Images avant / après

Les vues avant sont celles du commit de production 0.2 `8b2ea0f`, conservées. Les vues après sont produites par Chromium, puis inspectées, à 390×844 (DPR 3), 1440×900 et paysage 844×390. Voir aussi les scènes de smoke en temps réel.

| Vue | Avant 0.2 | Après 0.3 |
| --- | --- | --- |
| Pêche portrait | [Avant](apercus/mobile-lake.png) | [Après](apercus/immersion-mobile-lake.png) |
| Combat portrait | [Avant](apercus/mobile-fight.png) | [Après](apercus/immersion-mobile-fight.png) |
| Pêche bureau | [Avant](apercus/desktop-lake.png) | [Après](apercus/immersion-desktop-lake.png) |
| Combat bureau | [Avant](apercus/desktop-fight.png) | [Après](apercus/immersion-desktop-fight.png) |
| Combat paysage | — | [Deux commandes](apercus/immersion-mobile-landscape-fight.png) |

## Validation / publication

Validation locale : npm run check réussi, 23 tests + TypeScript + build. Smoke local final 6/6 (1,2 min), vraies captures souris + deux doigts CDP, aucune QA dans le build ; sauvegarde/export/import, quinze GLB servis intacts, aucun modèle au démarrage, achats, portraits, bassin et progression conservés. Suite E2E complète 20 réussis / 2 ignorés selon viewport (4,3 min). Après correction du cadrage : 11 contrôles ciblés réussis / 1 ignoré (1,1 min), incluant quatre orientations extrêmes sur les deux formats, menu, annulations et deux doigts. Pointe projetée à l’intérieur du viewport, captures inspectées.

Rendu logiciel Chromium/SwiftShader Windows ; profil mobile émulé, aucun test Safari/iPhone physique. Appareil réel, FPS/chauffe et ressenti restent à mesurer. Mesures E2E sur échantillons de 3 s : étang 23,2–23,8 FPS ; bassin 6,9 FPS bureau / 22,2 FPS mobile. Variabilité du rendu logiciel Windows, aucun gain téléphone revendiqué ; zéro frame de pêche derrière le bassin.

Projet Vercel confirmé : fishdex-landing, même dépôt/main/domaines/protection. Preview applicative 9347d75 READY, smoke protégé 6/6 (1,7 min) ; production main dae5e93 READY, smoke public 6/6 (1,5 min) sur [www.fishdex.fr](https://www.fishdex.fr), même application que la preview et le dist local. Résultats définitifs dans VERCEL.md et RELAIS_PROJET.md.
