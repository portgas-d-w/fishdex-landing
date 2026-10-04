# Reproduire les contrôles

Node24.15.0 ; npm ci au Lot0. Aucun navigateur mobile physique utilisé.

```powershell
npm run check
node --experimental-strip-types scripts/gameplay-progression-simulation.mjs
node --experimental-strip-types scripts/normal-progression-simulation.mjs
node --experimental-strip-types scripts/learning-events-simulation.mjs
```

Pour la logique, les55recettes se vérifient dans les tests du projet ; Node pilote les événements, ce n’est pas un test au toucher. La suite de contrôleurs dans tests/browser utilise le serveur QA uniquement pour ses scénarios diagnostiques ; ne pas confondre avec les suites ci-dessous.

```powershell
$env:GAME_URL='https://www.fishdex.fr'
node node_modules/@playwright/test/cli.js test --config playwright.progression.config.ts
node node_modules/@playwright/test/cli.js test --config playwright.smoke.config.ts --grep 'vraie prise|Nouvelle partie|conserve les favoris'
node scripts/verify-deployment.mjs https://www.fishdex.fr dist docs/gameplay-progression/INTEGRITE_PUBLIC.json
Remove-Item Env:GAME_URL
```

Le build local se vérifie de même avec GAME_URL=http://127.0.0.1:4173 après npm run build et npm run preview. Les suites publiques n’emploient pas __fishingQA. Des profils sont initialisés via stockage et Math.random est fixé dans les prises pour reproductibilité ; lancement/attente/ferrage/combat/réception sont effectués par commandes publiques, sans avance accélérée. Le pilote suit les indications relatives du filet.

La revue protégée utilise le même contrat, avec .env.local ignoré obtenu par `vercel env pull .env.local --environment=development --yes --scope portgas-d-ws-projects`. Node --env-file=.env.local charge le jeton court et les tests limitent le header à l’origine précise. Aucun jeton n’est requis/chargé pour le domaine public. Résultats récapitulés dans CONTROLES.json, empreintes complètes dans INTEGRITE_REVUE/PUBLIC.json. Captures mobiles à390×844 et bureau1440×900, Chromium/SwiftShader ; ni Safari ni FPS iPhone.
