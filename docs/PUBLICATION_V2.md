# Publication V2 — version 0.9.0

2 octobre 2026, Codex. Version 0.9.0 publiée et contrôlée sur le domaine public.
Les limites appareil restent celles de la matrice ; aucun essai physique annoncé.

## Cible et procédure

Projet confirmé par liaison locale et API Vercel :
`portgas-d-ws-projects/fishdex-landing`, ID `prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x`,
équipe `team_5BFwQHD6LvVeOSgmKAj7QoTv`, GitHub `portgas-d-w/fishdex-landing`,
branche de production `main`. Domaines vérifiés : `fishdex.fr` redirige vers
`www.fishdex.fr`, alias `fishdex-landing.vercel.app`. Aucun nouveau projet créé.

La CLI locale est effectivement présente (62.0.0) malgré la notice générique
d'absence de CLI du plugin. Aucun outil ni abonnement installé pour publier.
Les réponses d'API contenant des informations de protection ne sont ni affichées
ni versionnées. Le token OIDC reste dans `.env.local` ignoré ; requêtes limitées
à l'origine de la préproduction, traces Playwright désactivées pour ces contrôles.

La branche `codex/catalogue-complet-v2` déclenche le build de préproduction par
l'intégration Git existante. Il propose **Mode test**, sans API QA.
Après contrôle, `main` déclenche son propre build normal avec Mode test masqué.
Le binaire de preview ne doit pas être promu en production.

## Contrôles et URL

Préproduction **READY** : [version V2 avec Mode test](https://fishdex-landing-3dta83925-portgas-d-ws-projects.vercel.app),
déploiement `dpl_63b76Ty5mYxPbMUxjc8XcJLEYfuL`, commit applicatif
`134f41351dc817583ce7084d95c95ee06970216d`. Smoke protégé sans API QA :
**14/14 réussis en 4,6 min**, bureau et 390×844. Achats ∞ et coût théorique,
stock/profil isolés, retour normal, feeder/mouche/traîne forcés puis commandes
réelles jusqu'à réception/photo/reload ; prises naturelles coup/moulinet,
photos/transfert, atelier/lots/ensembles/catalogue, favoris et quinze GLB.

Comparaison du build de revue : **263 fichiers JS/CSS et 15 GLB identiques octet
par octet**. Manifeste identique après normalisation CRLF Windows → LF Linux,
différence de fins de ligne seulement. Entrée `/assets/index-D2n8AP19.js`,
SHA256 `19ba43c4973e3b71d7773d7d547d951197a4730b991380885a3b2f8d862380d3`.
Preuves : `apercus/v2/heberge/preview-fingerprints.json` et trois captures mobiles.
La première comparaison brute du manifeste a signalé cette différence textuelle ;
aucune différence de données ou de binaire n'a été masquée.

Production applicative **READY** : `dpl_D23Cw4keGbrr99W58qefeLCw1fDP`,
`https://fishdex-landing-jixyx0mdc-portgas-d-ws-projects.vercel.app`, `main`
`a7b17e46b1d48481a3dd5f1f43d56ce90ee147a2` (code applicatif 134f413 inchangé).
[fishdex.fr](https://fishdex.fr) redirige vers [www.fishdex.fr](https://www.fishdex.fr/),
HTTP 200. Contrôles publics **sans token et sans API QA** : **12 réussis en
2,7 min**, deux scénarios réservés au build de test exclus. Version normale sans
entrée Mode test, prise au coup et avec moulinet par commandes réelles, réception,
modèle différé/photo/transfert, sauvegarde v6, ateliers/stock/achats/favoris,
quinze GLB et exclusion de l'archive source.

Entrée normale `/assets/index-BnHuyJcz.js`, SHA256
`2a1d6ada494476fd34dd3127f207cbdd7b01fce208b58e1eb371666ff07145c0`.
**263 JS/CSS et 15 GLB identiques octet par octet** au build normal contrôlé ;
manifeste identique après normalisation de fins de ligne, détaillée dans le JSON.
Preuves : `apercus/v2/heberge/production-fingerprints.json` et captures publiques
mobiles ponton/capture/aquarium. Les commits de clôture suivants sont documentaires,
ne changent pas le code et conservent cette empreinte applicative ; leur dernier
déploiement READY et l'entrée publique sont revérifiés avant fin de session.

Contrôles locaux documentés dans `IMPLEMENTATION_V2.md` ; tests du build dans
`tests/smoke/`, commandes `GAME_URL=... FISHING_TEST_AVAILABLE=1 npm run test:smoke`
pour la preview et `FISHING_TEST_AVAILABLE=0` pour la production normale.
En PowerShell, définir ces variables avec `$env:GAME_URL` et
`$env:FISHING_TEST_AVAILABLE` avant la commande.

Comparer les fichiers servis au build local :
`node scripts/verify-deployment.mjs https://www.fishdex.fr dist verification.json`.
Le script vérifie l'entrée HTML, toutes les empreintes JS/CSS/GLB et les seules
fins de ligne admises pour le manifeste. Pour une preview protégée, charger
localement l'OIDC avec `node --env-file=.env.local` avant le même script ; il
limite l'en-tête au seul domaine passé en argument et n'écrit aucun secret.
Ne pas charger ce token pour les contrôles publics.

## Retour à 0.8 et sauvegardes

Référence Git avant V2 : `3b928346a72a4042921c441be2eb00a264aa6187`.
Production précédente conservée : `dpl_CUePjNdB2zTS8yDro7p4kXoUofDs`,
`https://fishdex-landing-fc5v36rr5-portgas-d-ws-projects.vercel.app`.
Tag poussé : `archive/au-fil-de-leau-before-v2-2026-10-02` à cette référence.
Aucun force-push ni suppression d'ancien déploiement.

Exporter le carnet v6 courant et l'original **avant-v6** depuis Réglages avant
un retour à 0.8. La version 0.8 lit v5, pas v6 ; garder les deux exports et
réimporter l'ancien sur 0.8. Le carnet v6 servira à reprendre 0.9.
L'export JSON ne remplace pas les photos locales Blob : garder le navigateur
et son stockage. Les profils normal/TEST ne s'importent pas l'un dans l'autre.

Procédure téléphone et limites : `ESSAIS_TELEPHONE_V2.md` et `MATRICE_V2.md`.
