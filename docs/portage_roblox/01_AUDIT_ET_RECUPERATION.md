# 01 — Audit et récupération

## Audit avant écriture

Identifier le dépôt du jeu et celui de l'app, lire les consignes, inspecter Git et les relais, puis les sources. Produire `AUDIT_PORTAGE.md` et compléter les matrices du dossier. Les identifiants sont récupérés depuis les données réelles. Réconcilier les différences entre la version déployée, main et les branches de travail.

Ne pas traiter un fichier `RELAIS` comme preuve unique de fonctionnement. Retrouver les fonctions, parcourir les boucles et conserver un résultat de référence. Ne pas rejouer systématiquement une longue suite web sans besoin : effectuer des contrôles ciblés pour qualifier l'extraction et noter les résultats historiques séparément.

## Points à inventorier

| Domaine | Informations attendues |
| --- | --- |
| Contrôles et combat | États, paramètres, tension, fatigue, distance, hameçon, obstacles, gestes, aide |
| Méthodes et cannes | IDs, capacités, recettes, présentation, touche, contextes nécessaires |
| Poissons | Profils biologiques, variantes visuelles, habitats, horaires, appâts, images, modèle et animations |
| Matériel | Stock, raccords, résistance, masses, tailles, montage actif et réservations |
| Progression | XP, niveaux, disponibilité, quêtes, maîtrise, anciens droits |
| Économie | Prix, récompenses, photo, vente éventuelle, anti-duplication et kit gratuit |
| Collection | Capture/specimen/profile/appearance IDs distincts, records, filtres, favoris |
| Carte | Topologie, spots, profondeurs, habitats, contraintes et sources des placements |
| Assets | Sources Blender, textures, matériaux, dimensions, licences, formats, rigs |
| Sauvegardes | Formats, versions, stockage, exports, profils dev, identité des joueurs |

## État signalé par le propriétaire

Le propriétaire dit que les poissons et méthodes ont déjà été implémentés. Un retour de Claude cite la branche `claude/fishdex-first-map-visuals-7815a5` au-dessus de `main` d2ffa28 : quai, berges, arbres, végétation, bois, eau et FX. Le retour décrit des tests encore en cours, une preview Vercel et un ralentissement mesuré sur Chromium en rendu logiciel. C'est une piste d'audit, pas une photographie certifiée du dépôt actuel ni un benchmark console.

Récupérer également le dossier `CHANTIER_CLAUDE_POISSONS_3D_ANIMATIONS_FISHDEX.zip` s'il a été transmis : fiches, anatomy references, queue et animations. Ses anciens comptes de candidats ne définissent pas le nombre actuel de poissons jouables.

## Classification de chaque élément

Utiliser : réutiliser directement ; convertir ; réimplémenter ; adapter au gameplay console ; reporter avec raison ; écarter car obsolète. Chaque ligne cite le chemin source, son commit ou sa provenance, son ID métier, le propriétaire du travail et la preuve d'intégration prévue.

Ne pas extraire les secrets, cookies, clés Supabase privées ou jetons Vercel dans le nouveau projet. Seuls les contenus et paramètres nécessaires sont transférés. Les assets commerciaux doivent avoir un usage Roblox vérifié ; un achat sur une boutique ne suffit pas à affirmer une licence universelle.

## Sauvegardes existantes

La connexion Roblox ne reconnaît pas automatiquement les comptes ou sauvegardes web. Séparer deux travaux : conservation complète des fichiers/export existants ; mécanisme éventuel d'import de progression. Pour la première boucle, créer une sauvegarde Roblox neuve de test sans toucher aux originaux.

Une reprise de progression peut utiliser un export existant après validation de format, authentification du lien entre comptes et règles anti-duplication. Un code ou jeton d'import doit être signé/validé côté serveur, lié au compte et utilisable une fois. Ne jamais accepter un JSON client contenant librement argent ou espèces comme preuve. S'il n'y a pas encore de solution sûre, conserver l'export et documenter l'import en attente ; cela ne bloque pas le portage du jeu.

## Fin du lot 0

Les deux agents ont un état de reprise clair. Une branche/commit ou sauvegarde explicitement identifiée conserve les travaux courants. Un inventaire réel des fonctionnalités, poissons, méthodes, assets et données existe. Le nouveau projet dispose d'une stratégie de récupération et d'une liste de blocages précise.
