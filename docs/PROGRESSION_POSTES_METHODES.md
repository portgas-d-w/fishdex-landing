# Progression, postes et pratiques — prototype 0.8.0

2 octobre 2026, Codex. Cahier fourni archivé dans SPEC_PROGRESSION_SPOTS_METHODES.md. Base applicative e300814 (0.7), branche codex/progression-postes-methodes. Direction Basalte & Turquoise conservée. Aucun moteur, abonnement, backend, modèle généré, pack ou dépendance ajouté. La modification utilisateur de DEMARRER_AVEC_CODEX.md reste hors des commits de cette mission.

## Audit et correspondances

Babylon core/loaders réellement installés : 9.28.0 ; Node 24.15.0 ; Vite 8.3.1 ; TypeScript 5.9.3 ; Playwright 1.58.2. npm ci : 24 paquets, zéro vulnérabilité. Quinze GLB existants, différés au portrait ; aucun poisson supplémentaire activé. Les références FishDex, photos IndexedDB, catalogue de conception et leur statut futur restent en place.

| Concept | Identifiants conservés ou ajoutés |
| --- | --- |
| Espèces jouables, inchangées | roach, perch, carp, pike, zander, bream, tench, rudd, bleak, crucian, whitebream, gudgeon, chub, ide, catfish |
| Plan d’eau | willow-pond ; running-river reste futur |
| Habitats des profils existants | reeds, open, willow ; ils ne deviennent pas des postes |
| Postes | jetty, cove, bank, reed-bank, point, timber |
| Pratiques | pole ajouté ; float, bottom, lure conservés ; feeder/fly futurs |
| Cannes possédées | starter, balanced, precision ; pole-starter/pole-elastic ajoutées ; plants/rocks restent décorations |
| Montage | composants et stock existants ; slot elastic avec kit-elastic/soft-elastic ajouté au coup ; aucun reel sur pole |
| Sauvegarde | même clé au-fil-de-leau.save.v1, format v5 ; lecture v1/v2/v3/v4 migrée |
| Raretés éditoriales | common, uncommon, rare, exceptional, legendary ; aucun légendaire aléatoire activé |

L’atelier possédait déjà Ma canne, montage détaillé, Mon sac, Ensembles et Boutique. Il est adapté et étendu, pas reconstruit. Réservations, graphe de détachement, résolution idempotente, gains de découverte/record et cinq favoris restent les systèmes existants.

## Ce qui fonctionne

Une nouvelle partie possède le kit gratuit au coup et trois postes. Après une première capture, une courte initiation explicite ouvre le kit leurres. Flotteur avec moulinet et fond restent réellement jouables : droits conservés pour les profils anciens, niveau 3 OU trois prises au coup pour un nouveau profil. Les recettes précédentes et la canne compatible sont mémorisées au changement de pratique ; aucune copie de consommables ni dépense cachée.

Les six repères de carte déplacent les ancrages dans une seule scène. Trois sont initialement ouverts. Un pêcheur stylisé donne la condition des roseaux : niveau 3 (320 XP dans la courbe existante) OU deux captures au coup dans le cercle du ponton. L’objectif est accessible avec le kit gratuit ; le droit est permanent. Texte lors de la prise, dialogue de départ et retrait du personnage annoncent l’ouverture. La pointe et le bois sont définis mais fermés « À venir », même avec beaucoup d’XP. Vent, dérive et branches n’y sont pas prétendus actifs.

Chaque poste définit position, orientation, secteur, réception, profondeur et indices. L’anse limite le fond à 1,6 m ; les roseaux restreignent le couloir et ajoutent des accrochages. Les obstacles visibles utilisent un maillage regroupé et un test de segment de ligne. Un accrochage se libère en baissant la canne et en changeant son angle ; une fenêtre de quatre secondes permet de ramener/replacer. Insister trois secondes provoque une vraie rupture du maillon faible. Le lieu ne multiplie jamais la force intrinsèque du poisson.

Les rencontres réutilisent les quinze profils habitat/strate/régime, puis une population locale et une affinité de microzone. Une présentation impossible pèse zéro ; aucune espèce n’est choisie au lancer. L’amorçage local agit 45 secondes dans 1,8 m autour du dépôt, sans prise garantie ; il réutilise les rides/gouttes existantes. Les populations et distributions de taille sont des paramètres de jeu versionnés, pas des relevés biologiques.

Au coup, portée de placement 6,4 m, ligne fixe pendant le combat, amortissement, orientation et hauteur ; aucune récupération ou frein fictif. Profondeur et plombée restent réglables. Aux leurres, descente selon masse/profondeur, vitesse lente/normale/rapide, trajectoire, animations et pauses récentes influencent les rencontres. Un leurre jamais récupéré ne provoque pas de touche. Sans flotteur, fil/scion et signal sonore portent l’information.

Le noyau de combat reste commun. Le mode « Récupération assistée », explicitement expérimental dans les réglages, module seulement un appui réel sur un ensemble avec moulinet. Au coup, l’adaptateur ignore toute récupération. Aucun minuteur de victoire. Les commandes cessent sur relâchement, annulation, perte de capture, pause, pagehide et blur.

Rareté d’espèce, rareté du spécimen et rareté de catalogue sont séparées de l’accès et des capacités. Un grand commun peut être exceptionnel ; aucune nouvelle anatomie n’est produite. Le carnet, les fiches et le matériel montrent les libellés. Mon sac contient possessions/réserve et recherche ; les achats restent dans Boutique avec conditions exactes et confirmation. Ensembles explique pièces manquantes, réparation avec réserve au prochain lancer et kit gratuit compatible. Les pertes aval ne touchent pas canne, moulinet, élastique ou réserve non engagée. Le secours ne rapporte ni écus ni XP et ne peut pas être revendu.

## Sauvegardes et retour arrière

Le format v5 ajoute progression (droits permanents, initiation, précision, maîtrises), poste préparé, pratique pole, recettes par pratique et mode de combat. Les nouvelles prises peuvent enregistrer poste/microzone ; les prises anciennes restent identiques. Toutes les pratiques antérieurement ouvertes sont reconnues lors de la migration, y compris les achats spécialistes. Monnaie, XP, records, journal, variantes, favoris et stock ne sont pas recalculés pour inventer des gains.

Sur migration locale, l’original est conservé sous au-fil-de-leau.save.before-v5 et exportable dans Réglages. Si cette copie échoue faute d’espace, l’ancienne sauvegarde n’est pas écrasée ; exporter la progression est nécessaire. Une ligne encore réservée lors du rechargement est ramenée sans capture et consomme l’esche utilisée une seule fois.

Le lecteur 0.7 ne sait pas lire v5. Avant un retour applicatif, exporter le carnet courant et le carnet avant progression ; reprendre sur 0.7 avec ce dernier via son import. Les prises réalisées en 0.8 restent dans le JSON v5 pour une reprise ultérieure. Aucun rollback ne doit écraser ces données.

## Mesures disponibles

Captures dans apercus/progression : avant issu du build 0.7 vérifié, après 0.8, même caméra de ponton et viewport. Les nouveaux postes et interfaces ont leurs captures dédiées. Les fichiers 0.7 historiques ne sont pas écrasés.

Chromium Windows avec ANGLE/SwiftShader, qualité éco ; 20 échantillons par poste, un worker. Les chiffres CPU sont la soumission Babylon et ne mesurent pas le GPU. Mobile est une fenêtre 390×844, pas un iPhone testé. Le relâchement automatisé d’un geste est sensible aux délais du runner ; un refus observé au bureau a été repris avec succès, sans engagement de montage ni perte. Ce confort reste à tester humainement.

| Poste | Mobile : FPS / draw calls | Bureau : FPS / draw calls |
| --- | --- | --- |
| Ponton | 23,2 / 23 | 23,1 / 27 |
| Anse | 23,3 / 26 | 22,6 / 32 |
| Rive | 22,8 / 26 | 23,6 / 32 |

Référence 0.7 mobile au ponton : 23,3 FPS, 21 draw calls, 55 294 sommets. Prototype : 57 000 sommets (+3,1 %), mêmes deux textures procédurales 256² et 512×128. Dernier relevé : CPU médian mobile 0,5–0,6 ms, P95 0,6–1,2 ms ; bureau 0,6–0,9 ms, P95 1,5–5,9 ms, rendu interne 1024×640. Les déplacements successifs conservent moteur, scène et nombre total de meshes. Les fluctuations et pointes de soumission observées ne démontrent aucun gain de performance sur appareil.

Banc reproductible : node --experimental-strip-types scripts/progression-bench.ts ; détail apercus/progression/simulation-bench.json. Trois individus (gardon/perche/carpe), trois ensembles à moulinet, deux environnements, graine 127 identique : 18 situations par mode. Contrôleur parfait sur la direction et régulation de tension ; les obstacles sont volontairement dégagés. Capture 18/18 dans chaque mode ; manuel 11,08–67,48 s, assisté 11,63–71,63 s. L’assistance n’accélère donc pas uniformément cette stratégie. Six cas au coup : deux captures du gardon ; perche 27 cm et carpe 54 cm rompent avec les deux cannes. Limite de réserve/amortissement visible du prototype, pas une promesse de facilité.

Quatre sessions naturelles de 12 lancers, graine 127, kits gratuits et coût hypothétique de 8 s pour photo/préparation : coup ponton/rive 12/12, 5 espèces, 58,49 écus/min ; leurres ponton 10/12, 3 espèces, 34,91 écus/min ; leurres rive 11/12, 3 espèces, 35,95 écus/min. Au coup, attente 4,38–13,30 s et combat 4,38–27,67 s. Ces revenus comprennent premières découvertes/records, contrôleur automatisé et hypothèse de préparation ; ils ne sont pas des revenus humains mesurés. Écart économique à réduire après essais, sans modifier arbitrairement la biologie ou ajouter une aide de trophée cachée.

## Vérifications et limites

npm run check : TypeScript, 58 tests et build réussis. Première suite navigateur complète : 56 réussis, 3 exclusions prévues, un échec de relâchement lent bureau résolu lors de la reprise ciblée (14/14 : gestes, progression, migration et accrochages). Scénarios 0.7 utilisent un profil migré avec droits anciens ; tests journey partent d’un profil réellement neuf. Build sans QA : 10/10, vraies captures au coup et avec moulinet par souris/tactile, photo/transfert, quinze modèles, achats et favoris. Préproduction READY dpl_HmnPXNX7Y1LbyRBh617f7UWpmMoj, https://fishdex-landing-80wspd47l-portgas-d-ws-projects.vercel.app, application 743cda81109653f32f45f9f1e574a50729db90e9, build 28,9 s. Smoke protégé : 9/10 dans la première passe, lancer bureau refusé avant engagement ; reprise 1/1 (52,9 s), donc tous les dix scénarios vérifiés, incluant vraie prise au coup et avec moulinet. OIDC limité à cette origine ; token non committé, traces désactivées. Tag archive/au-fil-de-leau-before-progression-2026-10-02 publié sur e300814. Domaines et protection conservés. Production READY dpl_FF3R2gxwrp3sAQVaEDEnJyxoXsJh, https://fishdex-landing-po0uh5j96-portgas-d-ws-projects.vercel.app, commit main 2045dce7513fe18188dda82df977920b3d704ec1, build 24,2 s. Sources applicatives 743cda8 inchangées. Smoke public https://www.fishdex.fr sans token : 10/10 (3,5 min), bureau et mobile, captures réelles au coup et au moulinet, photos/transfert, atelier/achats/favoris et quinze GLB. Domaine nu redirigé vers www, HTTP final 200 ; 45 JS/CSS identiques octet par octet au dist et manifeste JSON identique. Principal index-DD79opKe.js SHA256 ab55843a8779b6138b6cd64472b601a1c0b3281e617db113a68fa40c5c1d2f63. Preuves : apercus/progression/production-files.json et production-*.png. Scan Vercel erreurs 15 min : aucun événement renvoyé ; ce site statique ne fournit aucune télémétrie appareil. Serveur temporaire 4175 arrêté ; serveur utilisateur préservé. Les commits de clôture ne changent que ces preuves et la documentation ; le workflow contrôle READY et l’identité des fichiers après leur push.

À tester humainement sur Safari/iPhone et téléphone modeste : portée/lecture du cercle, ferrage, rapprochement au coup, confort du pouce, signal des leurres, libération des herbiers, comparaison manuel/assisté, économie, clavier/scroll et reprise après interruption ; chauffe/autonomie/réseau/GPU non mesurés. Pas de 30 FPS garanti.

Partiel : forces normalisées de jeu, amortissement simplifié, déplacement instantané de caméra, pêcheur procédural sans animation de départ, signal du flotteur surtout immersion/oscillation et touches non typées par espèce. Déboîtement, sondage interactif, réception avancée, auto-ferrage, dérive et réglage manuel du frein restent des extensions. Feeder/mouche/rivière et pointe/bois restent futurs. Équilibre de rareté et économie à ajuster ; le kit au coup ne domine pas tous les poissons, mais son revenu actuel doit être évalué.

Fichiers principaux : game/posts.ts, progression.ts, rarity.ts ; adaptations save/rig/economy/specimens/structure/fishing/combat/casting ; render/world.ts ; ui/journey.ts et journey.css, structure.ts/tackle.ts ; main.ts ; package*.json ; tests/journey.test.ts, browser/journey.spec.ts, support/legacy.ts et régressions/smoke ; script de banc, ce rapport, spec, captures/JSON, relais/backlog/décisions.
