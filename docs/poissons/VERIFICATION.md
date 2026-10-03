# Vérifications — poissons 0.10.0

Codex, 3 octobre 2026. Node 24.15.0, Babylon core/loaders 9.28.0, Vite 8.3.1, TypeScript 5.9.3 et Playwright 1.58.2. Les versions et dépendances sont inchangées.

## Logique, migration et données

`npm ci` et contrôle de la base 0.9 : 97 tests réussis. Après intégration, `npm run check` : **174 tests réussis, zéro échec**, TypeScript et build réussis. Le build signale le gros chunk principal ; cet avertissement est conservé, pas masqué. Journaux locaux ignorés : `.migration/fish-check-release.log` et `fish-build-{preview,normal}.log`.

- Chaque identité capturable traverse une **rencontre naturelle**, présentation et matériel compatibles, ferrage, combat, réception, enregistrement/rechargement et dédoublonnage. Ni Mode test ni tirage forcé dans ces 52 contrôles de logique.
- Les 14 identités observables traversent l'effort interrompable de 12 secondes, la découverte et la persistance, sans capture, écu ou favori fictif. Les 29 formes ont des parents valides ; prime unique et identité conservées.
- Six attributs : tests causaux modifiant un seul paramètre à la fois, replay déterministe, pas de temps 30/60/120 Hz, retour/traction/fatigue ; chercher une cache n'a aucun effet sans obstacle réel. Taille absolue, variation individuelle et courant effectivement simulé ont des effets distincts.
- Migration v1–v6 vers v7 : gains, droits, stock, spécimens, favoris et historique inconnus conservés. Alias d'espèce, clés de records et anciens IDs de robe normalisés sans nouvelle récompense. Profils/Blob normaux et test séparés ; original `avant-v7` exportable.
- Régressions des 22 méthodes/55 recettes, compatibilités, stocks, casse, réparation et secours gratuit. Les règles restent indépendantes du DOM et de Babylon.

`node --experimental-strip-types scripts/fish-audit.ts` contrôle **six fichiers sources FishDex et quinze GLB historiques inchangés**. Inventaire, correspondances et matrice détaillée : `ASSETS_INVENTAIRE.json`, `CORRESPONDANCES.json`, `MATRICE_POISSONS.json`.

## Navigateur : ce qui est réellement contrôlé

Chromium Windows avec ANGLE SwiftShader, **1440 × 900** et **390 × 844**. La seconde vue est une émulation, pas un iPhone physique.

`tests/browser/fish-registry.spec.ts` : six scénarios réussis, trois par vue. Chaque vue déroule **79 captures** (52 identités naturelles + 27 formes), acteur 3D au combat/réception portant le même UUID, photo 3D, Blob IndexedDB, robe/graine/taille et rechargement. Puis **16 observations** (14 identités + deux formes), maintien réellement chronométré/interruption, photo, découverte sans écu et rechargement. Enfin FishDex 66/52/14, habitats, binômes/sources et absence de débordement.

Ces scénarios UI forcent l'identité de la rencontre et emploient le contrôleur QA pour terminer les combats. Ils prouvent la chaîne visuelle et persistante ; ils ne prouvent ni la fréquence naturelle, ni le plaisir humain. Les tests du moteur et le banc fini traitent la distribution séparément. Preuves : `../apercus/poissons/{desktop,mobile}-{capture,observation}-chains.json` et captures associées.

`tests/browser/fish-finishes.spec.ts` : quatre scénarios réussis, deux par vue. Aquarium à cinq gabarits/robes, **81 positions orbitales** : parois respectées et rapports de longueur vérifiés ; retour à un moteur et quatre ouvertures de photo sans gain. Comparateur accessible par les commandes de l'interface, taille refusée explicitement et aucune mutation de partie.

Première passe de la suite globale : **69 réussis / 12 échecs / 3 exclusions**. Échecs anciens : nombres de postes/version de sauvegarde, sélecteur devenu ambigu et lancers chronométrés par la charge du PC. Assertions actualisées ; les gestes de test passent par les vrais événements avec timestamps monotones fournis par le protocole Chromium, après fermeture effective de la modale. Aucun seuil de lancer ni règle de jeu n'a été changé pour accepter le test. Reprise ciblée : 11 réussis/3 échecs, puis **4/4** pour les derniers parcours concernés (nouvelle partie et fond/leurre sur les deux vues). La passe suivante a été interrompue pour corriger les silhouettes et le texte tiger après inspection visuelle ; elle ne constitue pas un résultat final.

Après ces corrections, lot de rendu `npx playwright test tests/browser/fish-finishes.spec.ts tests/browser/fish-registry.spec.ts -g "Aquarium|chaînes UI forcées"` : **4/4** (3,8 min). Complément `npx playwright test --grep-invert "Aquarium : cinq identités|Poissons confirmés : chaînes"` : **76 réussis / une interruption par navigation / trois exclusions** (16,8 min). Cette interruption du contexte Chromium survient pendant la préparation de l’environnement Vercel qui modifie `.env.local` surveillé par Vite ; reprise isolée, sans changement applicatif, `npx playwright test tests/browser/methods.spec.ts --project desktop` : **1/1** (26,6 s). Les **81 scénarios applicables sur 84** sont donc contrôlés au fil de ces lots ; ce bilan ne prétend pas à une suite unique sans échec. Exclusions prévues : lisibilité mobile sur le projet bureau, multitouch sur bureau et atlas des modèles sur mobile. Les chaînes complètes des nouveaux poissons tournent sur les deux vues.

Les anciens clichés 0.9 sont conservés ; les nouvelles preuves des 22 méthodes se trouvent dans `../apercus/poissons/techniques/` et les régressions dans `../apercus/poissons/regression/`.

## Banc naturel et limites

`node --experimental-strip-types scripts/techniques-bench.ts docs/apercus/poissons/natural-economy.json` : **264 lancers, 242 captures**, au moins une par méthode, sans rencontre forcée, argent illimité ni stock illimité. Contrôleur idéal ; préparation/photo supposées à huit secondes. **15,49–54,71 écus nets/minute**, pas un revenu humain mesuré ni une cible d'équilibre.

Les vérifications du build sans API QA et des versions hébergées sont consignées dans `PUBLICATION.md`. Aucun essai physique Safari/iPhone/Android, réseau mobile, chauffe, batterie ou toucher humain n'a été exécuté. Les silhouettes/robes provisoires et valeurs de comportement de prototype sont marquées comme telles ; température et météo ne sont pas simulées. Suivre `ESSAIS_TELEPHONE.md` pour ces essais.

## Corrections finales demandées par le propriétaire

Illustration esturgeon gold rétablie pour la robe du parent esturgeon-siberien ; image, parent et habitat compatibles contrôlés en logique et dans la fiche sur les deux vues. Mode test désormais accessible aussi dans le build public, profil normal par défaut, sauvegardes/photos séparées. `npm run check` après ces corrections : 174/174, TypeScript et build réussis (`.migration/fish-check-public-test.log`). Build public local sans API QA : 4/4, catalogue/illustration et achat ∞/reload/retour au profil normal sur bureau et mobile (`fish-smoke-public-build.log`). Les 18 scénarios de la préproduction initiale sont vérifiés par lots ; détails dans PUBLICATION.md.
