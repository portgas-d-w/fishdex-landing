# Publication de l’eau naturelle 0.12.1 — 3 octobre 2026

Projet autorisé relu par API : `prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x`, équipe `team_5BFwQHD6LvVeOSgmKAj7QoTv`, `portgas-d-ws-projects/fishdex-landing`, GitHub `portgas-d-w/fishdex-landing`, production `main`, Vite et Node24. CLI62.0.0 présente et utilisée, sans installation supplémentaire. Domaines, projet et protections conservés.

Sources de référence : `170ca34ee366eda6cd03d671801011dfdcb51897`. Tag de retour préparé : `archive/au-fil-de-leau-before-eau-naturelle-2026-10-03`. Production précédente conservée : `dpl_D9Hg93cSkcNQwEgXvwT6mEM8vDh6`. Aucun déploiement supprimé. La sauvegarde v7 reste inchangée ; exporter le carnet avant tout retour durable.

## Contrôles locaux exécutés

- `npm ci` : 24 paquets, zéro vulnérabilité signalée.
- `npm run check` : 205/205, TypeScript et build, avertissement de taille du chunk principal conservé.
- Navigateur : 18 scénarios distincts par lots, puis les quatre nouveaux cas eau repris après l’ultime optimisation du shader (4/4 en 19,1 s). Détails dans EAU_NATURELLE.md et logs dans apercus/eau-naturelle/controles.
- Build public local : `GAME_URL=http://127.0.0.1:4181`, `FISHING_TEST_AVAILABLE=1`, `npx playwright test --config playwright.smoke.config.ts tests/smoke/map-water.spec.ts` : 2/2 en 15,2 s, sans QA ; six postes, qualités, ambiances, cache et turbidité.
- Référence visuelle, contacts, banc final et mesures GPU : scripts water-natural-*.mjs ; mesures et limites dans PERFORMANCES_EAU_NATURELLE.md. Scripts de mesure exclus du build public.

## Workflow de publication

Branche `codex/eau-naturelle`, commit cohérent des sources contrôlées et preuves ; modification préexistante DEMARRER_AVEC_CODEX.md exclue. Push de la branche déclenche la préproduction Git. Contrôler READY sur le SHA exact ; tests hébergés sans QA, avec OIDC limité à l’origine de revue et traces désactivées. Vérifier tous les fichiers JS/CSS, 33 GLB et 197 images avec `scripts/verify-deployment.mjs` depuis le dist local figé. Seules fins de ligne CRLF→LF du manifeste/SVG sont tolérées, jamais une différence de binaire.

Après revue validée : fusion en avance rapide vers `main` et push, sans force-push. Rebuild de production depuis main, contrôles publics sans OIDC, empreintes complètes et redirection fishdex.fr vers www.fishdex.fr. Puis clôture documentaire et nouvelle vérification READY/entrée publique.

## Résultat hébergé et consigne finale du propriétaire

Application 62b17a7bb8590949ef2cf9d3cb8332bd6fce4533. Préproduction READY dpl_ETfVWw58fsbDaraJtgGZQaUs7b5s : https://fishdex-landing-5i5o959nu-portgas-d-ws-projects.vercel.app. Les262 JS/CSS,33GLB et197images correspondent au dist figé ; seuls manifeste/SVG peuvent différer par CRLF→LF, preuve conservée. Entrée index-44mvFxXQ.js SHA25653e58e56fd82ca03be9a2f1d266831c77a808834d6813c9f779e2838b80f5c64.

La série smoke hébergée avait achevé **quatre scénarios bureau avec succès** : Mode test/isolation, feeder/mouche/traîne jusqu’à réception/photo/reload, FishDex66 et carte/eau/turbidité. Le propriétaire a demandé de publier sans poursuivre les tests ; série interrompue volontairement, dix autres cas non exécutés dans cette passe. Aucun résultat14/14 revendiqué. La vérification locale mobile/bureau et le contrôle complet des fichiers avaient déjà réussi.

Fusion en avance rapide versmain puis push. Production READY dpl_9ExFY6xrgpw3B2q2fRqL7aTq7sPp : https://fishdex-landing-88m6wospf-portgas-d-ws-projects.vercel.app, même SHA applicatif. Domaine nu → https://www.fishdex.fr/ HTTP200 ; entréeJS et hash strictement conformes au dist revu, nouvelle version confirmée. Aucune nouvelle suite de test production lancée, selon la demande finale. Contrôle d’identité public dans production-identity.json ; il ne prouve pas une session physique mobile.

Tag archive/au-fil-de-leau-before-eau-naturelle-2026-10-03 poussé sur170ca34, ancienne production conservée. Réversion par nouveau commit des sources du tag ou promotion explicite de l’ancienne production sur le même projet, jamais force-push. Export du carnet conseillé avant retour. OIDC uniquement en revue ; aucune protection ou domaine modifié. Serveurs temporaires5179/4181 arrêtés, sources privées exclues, modification utilisateurDEM conservée.

Le chantier suivant reçu est ASSETS_GRATUITS_CARTE_01_FISHDEX.zip ; ses consignes et téléchargements sont traités séparément de cette livraison d’eau. Les essais réels iPhone restent à faire.

