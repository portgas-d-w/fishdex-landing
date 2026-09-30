# Vercel — migration de FishDex vers Au fil de l’eau

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
- Production du jeu : en cours ; lire la clôture avant reprise.
- Build distant réussi avec `npm ci`, TypeScript, Vite ; avertissement chunk Babylon conservé.
- `vercel curl` : HTTP 200 ; la CLI a créé son bypass officiel pour cet accès.
- Windows : `npm run check` réussi (9 tests), E2E 6/6 (16,9 s), smoke build local 4/4 (51,9 s).
- Préproduction protégée : smoke 4/4 (55,6 s), avec token OIDC court de développement.

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
$env:GAME_URL = 'https://fishdex-landing-3nj1ud5e4-portgas-d-ws-projects.vercel.app'
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
