# Vercel — migration de FishDex vers Au fil de l’eau

## Gestes et combat 0.4.0 — préproduction vérifiée

Projet et liaison revérifiés : portgas-d-ws-projects/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, dépôt portgas-d-w/fishdex-landing, Vite/Node 24/npm ci/build/dist. CLI disponible 62.0.0. Aucun changement de domaines ou de protection.

Application 3a2d06b19b27dec74cab8728e6952dc6cdf0ae42 sur codex/gestes-combat. Preview READY https://fishdex-landing-561eij874-portgas-d-ws-projects.vercel.app, dpl_7BHB69jgcKBK7x26wiW9DcjyQ4MC, build 27 s. Smoke protégé 6/6 (2,9 min), vraie capture souris/tactile, photos, sauvegarde/export/import, quinze GLB et achats/bassin. Token local limité à l’origine de la preview, traces désactivées ; aucun token affiché ou committé.

Retour 0.3.1 publié : tag archive/au-fil-de-leau-before-touch-combat-2026-10-01, base a6ef66b52b2a9cfe7e540e638d4f1d58a34074f6 ; ancien déploiement READY https://fishdex-landing-52juimmn5-portgas-d-ws-projects.vercel.app, dpl_EjnkbkyJA9GibQ7H7ZHatzyRjr5x. Sauvegarde v2 inchangée. Fusion fast-forward vers main après ce contrôle ; validation publique à consigner ensuite.

## Jauge 0.3.1 — publiée et vérifiée

Précision utilisateur : jauge compacte entre les commandes, même tension que la canne ; aucun descriptif de comportement. Build local vérifié index-D2VdAQ0C.js SHA256 afa1e0b368ddd2d564cb45af53cfc7e4539e96d6887d648b30936674b1263a3f ; check 23 tests, 9 E2E ciblés / 1 ignoré, smoke build 6/6 (1,5 min).

Retour avant jauge : tag archive/au-fil-de-leau-before-gauge-2026-10-01, base bd335a6b235b585a3b3cd35814dfba4aaea8ea0f ; production 0.3 READY https://fishdex-landing-krqp4rbrw-portgas-d-ws-projects.vercel.app. Sauvegarde v2 inchangée. Même projet/main/domaines/protection. Preview e2af6e7688901cf59271b1ed3dad3fafb90132ef READY : https://fishdex-landing-f8xmkxn5u-portgas-d-ws-projects.vercel.app, dpl_Dm6dVWPsknzwA4qF2JPJYZzTzGmy, build 18 s + post-build 14 s. Smoke protégé 6/6 (2,0 min), jauge visible, captures réelles et progression conservée. Production main 6431fb23742d0409f4ad5f31ecf603489e375993, fusion fast-forward après validation : https://fishdex-landing-n1kgqi4fm-portgas-d-ws-projects.vercel.app, dpl_5pZsvDXk4HwvcFjsWibzvz55M6iG, READY, build 24 s. **Smoke public 6/6 (1,7 min)** sur https://www.fishdex.fr, jauge visible, captures et fonctions conservées ; aucune QA ni token en production. Bundle et manifeste identiques au build local vérifié. Clôture documentaire ensuite, dernier déploiement READY et identité des fichiers contrôlés avant fin de session.


## Correction immersive 0.3 — publiée et vérifiée

Cible revérifiée par CLI 62.0.0 : portgas-d-ws-projects/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, Node 24, Vite, npm ci/build/dist ; même dépôt et main. Publication via intégration Git après preview protégée vérifiée. Aucun changement de domaines/protection.

Préproduction applicative : commit 9347d750e8f5f0cc1709e5e095e5fe3466fb603d, https://fishdex-landing-j1s16fb54-portgas-d-ws-projects.vercel.app, ID dpl_2RG6wgaLULPseUF5PXrXjEZN1v9q, READY, build 19 s. Smoke protégé 6/6 (1,7 min), vraie capture et deux commandes, portraits, sauvegarde/import/export, achats et bassin. Token OIDC local limité à cette origine, traces désactivées et valeur jamais affichée/committée. Production Git main dae5e9371fee6e1ba3d2c3b89b3ec04d2a52dcf9, après fusion fast-forward : https://fishdex-landing-q9hvlj65k-portgas-d-ws-projects.vercel.app, ID dpl_GSB2NcKv2ApQsswD8WMvgEeVXycs, READY, build 19 s. **Smoke public 6/6 (1,5 min)** sur https://www.fishdex.fr, sans token ; captures réelles souris/deux commandes tactiles et fonctionnalités. HTTP 200, domaine nu redirigé vers www. Application inchangée depuis la preview (diff src/public/package/config vide). Bundle public et manifeste identiques au dist local, SHA256 ci-dessous.

Le commit de clôture ne change que documents/captures. Son déploiement Git de la même application est contrôlé READY et fichiers identiques avant fin de session ; le smoke complet concerne dae5e93 exact.

Local : npm run check (23 tests), E2E 20/20 + 11 ciblés après cadrage, smoke final sans QA 6/6 (1,2 min). Bundle index-CX0qA7ip.js SHA256 104b4e5a1ad703ddfec262791acc566b443fb6acbb52817494c8851d9eb3406e.

Retour 0.2 conservé avant mise en production : tag archive/au-fil-de-leau-before-immersion-2026-10-01, base 8b2ea0f4806b396cfc24aa32f3489360b5abad11. Déploiement antérieur READY : https://fishdex-landing-6tlapyvw9-portgas-d-ws-projects.vercel.app, dpl_BXmZ3LgpdKPrkZjDs9uegmFfVPGy. Même sauvegarde v2 ; ancien FishDex et retour 0.1 restent conservés ci-dessous.


## Mission autonome 0.2.0 — 1 octobre 2026

Cible et liaison revérifiées : `portgas-d-ws-projects/fishdex-landing`, même ID, dépôt et main, Vite/Node 24/npm ci/dist. Aucun domaine ni paramètre de protection modifié.

- Application : commit P4 `3319536`, préproduction Git `b77a4ee4a8dfd6f067d3b920821bf1f1dbd1d76b`.
- Deux uploads CLI échouent `fetch failed` avant création de déploiement ; publication par l’intégration Git existante.
- Preview : https://fishdex-landing-9jbp3yk7v-portgas-d-ws-projects.vercel.app
- ID `dpl_6oo2HHjwRyLiT2FPELsTXyKK7q4e`, READY, build 1 min 14 s.
- Smoke protégé : **6/6 (1,2 min)**, partie réelle, souris/tactile Chromium, quinze GLB, portraits, achats, aquarium, persistance et transfert du carnet. OIDC local limité à l’origine ; token non affiché/non committé, traces désactivées.
- Production 0.2 publiée par Git main `affa933cc0443f14d45c594863a486006e5fb178` après validation ; application identique à b77a4ee (diff src/public/package/config vide).
- URL testée : https://fishdex-landing-3xmhe25e1-portgas-d-ws-projects.vercel.app, ID `dpl_2h16DCV5MDADobzftFbXxeuYzxtu`, READY, build 44 s, post-build 18 s.
- https://www.fishdex.fr : **smoke public 6/6 (1,1 min)** sans token, vrai combat/capture, progression, équipement et aquarium sur bureau/tactile. Captures production inspectées. HTTP 200 ; https://fishdex.fr redirige vers www. Bundle index-r9Mmjvib.js identique au build local et manifeste quinze modèles.
- Le commit de clôture ne modifie que documentation/captures ; le push main déclenche un déploiement Git de la même application, dont état et fichiers servis sont contrôlés avant fin de session. Les tests complets ci-dessus concernent le déploiement applicatif exact affa933.
- Contrôle d’identité de l’application publique : SHA256 du bundle principal `b0b1cfbfbf5504ac8b1a7dcf1762d12423dcaf2239c63e949cbcc3da5aafd258`, égal octet par octet au dist vérifié ; manifeste également identique.
- Retour 0.1 conservé : tag publié `archive/au-fil-de-leau-before-mission-2026-10-01`, commit `f21c700`, déploiement `dpl_Gp7gow3AekUDTWVL9FDBbnmrANse`, https://fishdex-landing-ziwssiubj-portgas-d-ws-projects.vercel.app. Les sauvegardes v2 peuvent s’exporter mais ne sont pas lisibles par l’ancienne application v1 : sauvegarder le JSON avant retour applicatif.

Les quinze GLB restent publics pour le rendu ; ZIP source, .env et archive FishDex exclus. Ancien FishDex et instructions de promotion/restauration conservés ci-dessous.

## Historique de la livraison 0.1

État au 30 septembre 2026, Codex Windows. Le propriétaire a autorisé le remplacement
après contrôles de préproduction. Ne pas redemander la cible.

## Configuration réellement utilisée

| Élément | Valeur |
| --- | --- |
| Compte / équipe | `portgas-d-w` / `portgas-d-ws-projects` (Hobby) |
| Projet conservé | `fishdex-landing`, `prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x` |
| Dépôt conservé | https://github.com/portgas-d-w/fishdex-landing |
| Branche de production | `main` |
| Racine | `.`, `rootDirectory: null` ; jeu à la racine du dépôt |
| Framework / Node | `vite` / `24.x` |
| Installation / build / sortie | `npm ci` / `npm run build` / `dist` |
| Variables applicatives | Aucune ; aucune variable Vercel existante trouvée |
| Domaine principal | https://www.fishdex.fr |
| Domaine nu | https://fishdex.fr redirige vers www |
| Alias Vercel | https://fishdex-landing.vercel.app |
| Protection conservée | Vercel Authentication `all_except_custom_domains` |

CLI officielle 62.0.0 installée avec `npm i -g vercel`, connexion device officielle,
sans jeton dans la conversation. `.vercel/project.json` lie ce dossier au projet.
Paramètres mis à jour par `vercel api /v9/projects/fishdex-landing -X PATCH` :
framework, build, installation, sortie et Node seulement. Git, domaines et protection conservés.
Avant mutation, vérifier `vercel project inspect --non-interactive`.

## Déploiements et résultats

- Préproduction CLI : https://fishdex-landing-3nj1ud5e4-portgas-d-ws-projects.vercel.app
- ID `dpl_2uxax1Q97qz5s1uhMvsfxgtQDSsK`, READY, build 19 s.
- Inspecteur : https://vercel.com/portgas-d-ws-projects/fishdex-landing/2uxax1Q97qz5s1uhMvsfxgtQDSsK
- Production publique du jeu : **https://www.fishdex.fr**, READY, depuis `main`.
- Déploiement du code testé : `dpl_97wFheK6unbYaN84pT9of1oP7XUG`,
  https://fishdex-landing-4pju52c45-portgas-d-ws-projects.vercel.app ; build 19 s.
- Commit applicatif testé : `ffe65508436c882e7e056ef8b893d82214217c11`.
- Production publique : smoke 4/4 (52,2 s), sans token ni authentification.
- HTTP 200, redirection du domaine nu vers www et titre du jeu confirmés.
- Logs Vercel : requête limitée aux erreurs des 15 dernières minutes, aucun événement renvoyé.
  Site statique : ce n’est pas une télémétrie des navigateurs ; leur console est contrôlée par smoke.
- Build distant réussi avec `npm ci`, TypeScript, Vite ; avertissement chunk Babylon conservé.
- `vercel curl` : HTTP 200 ; la CLI a créé son bypass officiel pour cet accès.
- Windows : `npm run check` réussi (9 tests), E2E 6/6 (16,9 s), smoke build local 4/4 (51,9 s).
- Préproduction protégée : smoke 4/4 (55,6 s), avec token OIDC court de développement.
- Préproduction Git définitive, commit `ffe65508436c882e7e056ef8b893d82214217c11` :
  https://fishdex-landing-i6hgrro7f-portgas-d-ws-projects.vercel.app
- ID `dpl_HvX3f8fhR1ozxzw6jugttRjfDjME`, READY, build 19 s, smoke 4/4 (56,2 s).
  Les captures bureau/mobile montrent les poissons ; correction du premier rendu incluse.
- Le push de cette version sur `main` a été effectué après validation, sans force-push.

La clôture du relais est ensuite poussée dans un commit de documentation : elle ne
modifie ni les sources, ni le lockfile, ni les ressources du jeu. Les prochains pushes
sur main utilisent la même intégration Git ; les branches de travail génèrent des previews.
L’affectation automatique des domaines est active et leur protection est conservée.

Le smoke joue en temps réel sans QA : souris sur bureau, événements tactiles Chromium
sur mobile, relâchement hors bouton, capture, vrai aperçu GLB, sauvegarde/rechargement,
export/import confirmé et absence d’erreurs JS/console. Viewports 1440 × 900 et 390 × 844.
Les cinq GLB sont servis avec signature/version/taille conformes au manifeste :
aucun au démarrage, un à la capture. Archive originale non servie.
Captures sous `test-results/smoke-*.png` (local, ignoré).

## Répéter les contrôles

```powershell
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
# Dans un autre terminal : npm run preview -- --port 4173 --strictPort
npm run test:smoke
# Préproduction protégée ; token jamais affiché ni committé.
vercel env pull .env.local --yes --scope portgas-d-ws-projects
$env:GAME_URL = 'https://fishdex-landing-i6hgrro7f-portgas-d-ws-projects.vercel.app'
node --env-file=.env.local node_modules/@playwright/test/cli.js test --config playwright.smoke.config.ts
# Production publique : ne pas charger le token de développement.
$env:GAME_URL = 'https://www.fishdex.fr'
npm run test:smoke
```

Le header OIDC du navigateur est limité à l’origine de préproduction.
Les traces sont désactivées avec token pour éviter de l’enregistrer.
Les E2E démarrent leur serveur sur 5174, distinct du serveur utilisateur sur 5173.
Un worker évite deux rendus logiciels lourds simultanés sur ce PC.
Exécuter E2E et smoke successivement : ils partagent le dossier d’artefacts et le GPU.

## FishDex conservé

- Ancien main : `00613d1e72fba5291e50c568cad6f3e976a57bb4`.
- Tag publié : `archive/fishdex-before-au-fil-de-leau-2026-09-30`.
- Bundle complet vérifié : `.migration/fishdex-before-2026-09-30.bundle`, privé sur ce PC.
- Paramètres antérieurs : `.vercel/project-before-migration.json`, privés sur ce PC.
- Ancien déploiement exact : `dpl_DhwVxfAjFKwy1TsbCddjPoG1iiTk`.
- URL conservée : https://fishdex-landing-k57x1nwcl-portgas-d-ws-projects.vercel.app
- Ancien build : Next.js, Node 24.x, racine `.`, commandes/sortie par défaut.

L’ancien déploiement portait `gitDirty: 1` : le tag conserve les sources committées,
le déploiement conserve le site effectivement publié. Aucun déploiement supprimé.

## Retour arrière (préparé, pas exécuté)

Vérifier le compte et le projet. Sur Hobby, Instant Rollback vise seulement la
production immédiatement précédente. Si elle correspond encore à FishDex :

```powershell
vercel project inspect --non-interactive
vercel rollback dpl_DhwVxfAjFKwy1TsbCddjPoG1iiTk --scope portgas-d-ws-projects --yes
```

Si d’autres productions ont eu lieu, utiliser la promotion du déploiement conservé :
`vercel promote dpl_DhwVxfAjFKwy1TsbCddjPoG1iiTk --scope portgas-d-ws-projects`.
Contrôler ensuite https://www.fishdex.fr. Aucun rebuild pour cette promotion.
Instant Rollback suspend l’affectation automatique des domaines ; une promotion la réactive.

Pour un retour durable des sources, restaurer le contenu du tag par un **nouveau commit**
sur `main`, sans force-push, et rétablir les paramètres `framework: nextjs`,
`buildCommand: null`, `outputDirectory: null`, `installCommand: null`, racine inchangée,
Node 24.x. Construire/tester le retour en préproduction avant publication.
Ne pas repousser une branche ancienne sur main ni réintroduire le ZIP.

## Sauvegardes et limites

Le carnet appartient à l’origine du navigateur : préproduction, localhost et production
ont des carnets distincts ; export/import testé pour le transfert.
Seul dist est servi. Exclusions : assets-source, ZIP, .migration, .git, .env*, tests,
docs, logs, dist local et node_modules. Les cinq GLB restent publics par nécessité.
Pas de service supplémentaire ni nouvel abonnement.
Le chunk principal Babylon reste ~1,57 Mo brut / 373 Ko gzip.

À tester sur téléphone réel : Safari/Chrome Android, réseau mobile, chauffe/autonomie,
verrouillage/reprise, audio, portrait/paysage et sensation du combat.
Le rendu logiciel Chromium ne certifie pas la fluidité sur appareil.

## Références officielles consultées

- https://vercel.com/docs/frameworks/frontend/vite
- https://vercel.com/docs/rest-api/projects/update-an-existing-project
- https://vercel.com/docs/deployments/promoting-a-deployment
- https://vercel.com/docs/instant-rollback
- https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/trusted-sources
