# Publication et retour — poissons 0.10.0

## Identité vérifiée

Projet autorisé conservé : **portgas-d-ws-projects/fishdex-landing**, projet `prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x`, organisation `team_5BFwQHD6LvVeOSgmKAj7QoTv`, dépôt `portgas-d-w/fishdex-landing`, production `main`. `.vercel/project.json`, remote Git et production précédente revérifiés. Aucun autre projet ou service n'est choisi.

Base de retour 0.9 : `d4bb80feae03cfd70f175e2d468bcffc49363aa6`, tag poussé `archive/au-fil-de-leau-before-poissons-2026-10-03`, déploiement `dpl_Figquwg5ezcuGab7UksNjMFtE8qs`, entrée `/assets/index-BnHuyJcz.js`, SHA256 `2a1d6ada494476fd34dd3127f207cbdd7b01fce208b58e1eb371666ff07145c0`.

## Workflow

1. Vérifier les règles, chaînes navigateur et build sans API QA.
2. Commit cohérent sur `codex/poissons-assets-fishdex`, excluant la modification utilisateur de `DEMARRER_AVEC_CODEX.md` ; push vers l'intégration Git existante. Garder le tag et le déploiement de retour.
3. Préproduction : build avec Mode test, jamais API QA. Tester les commandes réelles, photos, migrations, stock/isolation et fichiers servis.
4. Après ces contrôles, avance rapide de `main` et rebuild public sans API QA, Mode test disponible à la demande explicite du propriétaire. **Ne pas promouvoir le binaire de revue en production.**
5. Vérifier `fishdex.fr` → `www.fishdex.fr`, les contrôles sans token et les SHA du build normal. Consigner les URLs exactes et résultats ci-dessous.

CLI locale réellement disponible : 62.0.0. Aucune installation ajoutée. `.env.local` ignoré et jeton OIDC limité à l'origine de préproduction, traces désactivées ; aucun secret dans les fichiers publics ou `VITE_*`.

## Résultats

Application `3f67fb974376a1095fcf8a73022d449dc9b78528`, commit des ressources/règles/rendus/interfaces/tests. Préproduction **READY** : `dpl_8GvYnQPMZsArU6Ef6TEVxeijxc72`, [revue poissons avec Mode test](https://fishdex-landing-q7f1dj4ea-portgas-d-ws-projects.vercel.app). Résultats des lots et de la production ci-dessous. La procédure téléphone est `ESSAIS_TELEPHONE.md`.

Environnement de contrôle récupéré avec `vercel env pull .env.local --yes --environment preview --git-branch codex/poissons-assets-fishdex --scope portgas-d-ws-projects`. L'option `--id` proposée dans l'aide locale a été refusée pour un déploiement READY ; la récupération explicite par environnement/branche fonctionne. L'ajout automatique `.env*` à `.gitignore` a été annulé, `.env.local` étant déjà ignoré par les règles existantes.

## Retour à 0.9

Exporter le profil v7 et son original avant-v7 dans Réglages et aide avant retour. 0.9 ne lit pas v7 ; restaurer l'export avant-v7 sur l'ancienne version et conserver le v7 pour une reprise ultérieure. Les photos Blob sont locales et séparées du JSON. Garder la production 0.9 et le tag de retour, ne jamais effectuer de force-push. Une restauration Vercel doit porter sur le déploiement **normal** connu, sur le déploiement 0.9 identifié ci-dessus.

Comparaison de la revue réussie : **263 JS/CSS, 33 GLB et 196 WebP identiques octet par octet**. Le manifeste JSON et le SVG placeholder diffèrent seulement par CRLF→LF ; égalité après cette seule normalisation prouvée, SHA bruts conservés dans `../apercus/poissons/preview-fingerprints.json` et `svg-line-endings.json`. Entrée `/assets/index-BM7PIUdZ.js`. Scénarios hébergés sans QA contrôlés par lots, détaillés ci-dessous.

Revue initiale 3f67fb9 : 18 scénarios applicables vérifiés par lots, 15/18 à la première passe, 3/4 lors de la reprise et 1/1 pour le dernier parcours bureau. Deux captures normales échouaient sur une assertion GLB inadaptée à une robe procédurale, corrigée. Les poissons plus forts au bureau dépassaient le budget de 85 s du contrôleur : reprise réussie avec 180 s par combat, sans accélération ni modification des règles. Preuves dans `../apercus/poissons/heberge-preview`.

Correction finale du propriétaire : illustration esturgeon gold acceptée et Mode test public. Nouveau build et vérifications consignés ci-dessous.

Préproduction corrigée 3fb679b : READY `dpl_33MMEbs4q16KRSEenqFwtBA3mBE3`, https://fishdex-landing-4frsu8mpj-portgas-d-ws-projects.vercel.app. Contrôles sans QA : 4/4 (19,5 s), illustration gold et achat ∞/isolation/reload sur les deux vues. 263 JS/CSS, 33 GLB et 197 images vérifiés contre le build public ; seule normalisation CRLF→LF des deux textes déjà documentés. Entrée `/assets/index-BHh5qZXP.js`, SHA256 `8b2c282524727ada755bc346d7a649cce0dc53eb3b25d11270f1f83360bcd2bd`. Preuves `preview-final-fingerprints.json` et `heberge-preview/correction`. Vérification de fichiers par lots de huit requêtes indépendantes, mêmes empreintes strictes.

## Production vérifiée

Production 0.10.0 : application 3fb679b, main contrôlé 97dc37b7faf0f0a4c2b8b8a16b0b57cb633dc519, READY dpl_9qqqx1AiUxmP8EbZxdRWbd3jiEkC, https://fishdex-landing-ohfzzo5hv-portgas-d-ws-projects.vercel.app. Domaine fishdex.fr → https://www.fishdex.fr/ HTTP 200 ; entrée /assets/index-BHh5qZXP.js SHA256 8b2c282524727ada755bc346d7a649cce0dc53eb3b25d11270f1f83360bcd2bd. Mode test accessible publiquement, profil normal par défaut et sauvegardes/photos séparés.

Smoke public sans token, sans API QA : **10/10 (2,5 min)**, bureau 1440×900 et Chromium mobile 390×844. Mode test ∞/achat/reload/retour au profil normal isolé, fiche gold, 66/52/14, captures réelles au coup et au moulinet, réception/photo/carnet/export/import, 33 GLB intacts et sources privées exclues. Les contrôles prolongés de quatre poissons et trois observations par vue, atelier et aquarium ont été exécutés sur la revue initiale (18 scénarios vérifiés par lots), pas répétés dans ce lot public ciblé. Aucun essai physique sur téléphone.

263 JS/CSS, 33 GLB et 196 WebP identiques octet par octet au build public local ; manifeste JSON et SVG placeholder identiques après seule normalisation CRLF→LF. Preuves : docs/apercus/poissons/production-fingerprints.json et heberge-production/. Aucun secret ni source privée publié. Tag de retour 0.9 conservé archive/au-fil-de-leau-before-poissons-2026-10-03 ; v7 et export original avant-v7 à conserver avant rollback.

Clôture : preuves et relais committés/poussés sur main ; aucun changement applicatif après les contrôles publics. Les déploiements et l’entrée publique sont revérifiés après le push documentaire. Serveurs temporaires 5177 et 4178 arrêtés ; serveurs du propriétaire préservés.
