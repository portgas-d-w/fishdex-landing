# Vercel — migration de FishDex vers Au fil de l’eau

## Poissons et Mode test public 0.10.0 — 3 octobre 2026

Production 0.10.0 : application 3fb679b, main contrôlé 97dc37b7faf0f0a4c2b8b8a16b0b57cb633dc519, READY dpl_9qqqx1AiUxmP8EbZxdRWbd3jiEkC, https://fishdex-landing-ohfzzo5hv-portgas-d-ws-projects.vercel.app. Domaine fishdex.fr → https://www.fishdex.fr/ HTTP 200 ; entrée /assets/index-BHh5qZXP.js SHA256 8b2c282524727ada755bc346d7a649cce0dc53eb3b25d11270f1f83360bcd2bd. Mode test accessible publiquement, profil normal par défaut et sauvegardes/photos séparés.

Projet conservé prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, portgas-d-ws-projects/fishdex-landing, GitHub portgas-d-w/fishdex-landing et main ; Vite/dist/npm ci/Node24. CLI 62.0.0 déjà installée. Préproduction initiale 3f67fb9 vérifiée sur 18 scénarios par lots ; correction du propriétaire 3fb679b, preview READY dpl_33MMEbs4q16KRSEenqFwtBA3mBE3, https://fishdex-landing-4frsu8mpj-portgas-d-ws-projects.vercel.app : 4/4 après gold/Mode test public et comparaison de tous les fichiers. Puis fusion en avance rapide et push main. La décision Mode test public remplace les anciennes consignes de désactivation en production.

Smoke public sans token, sans API QA : **10/10 (2,5 min)**, bureau 1440×900 et Chromium mobile 390×844. Mode test ∞/achat/reload/retour au profil normal isolé, fiche gold, 66/52/14, captures réelles au coup et au moulinet, réception/photo/carnet/export/import, 33 GLB intacts et sources privées exclues. Les contrôles prolongés de quatre poissons et trois observations par vue, atelier et aquarium ont été exécutés sur la revue initiale (18 scénarios vérifiés par lots), pas répétés dans ce lot public ciblé. Aucun essai physique sur téléphone.

263 JS/CSS, 33 GLB et 196 WebP identiques octet par octet au build public local ; manifeste JSON et SVG placeholder identiques après seule normalisation CRLF→LF. Preuves : docs/apercus/poissons/production-fingerprints.json et heberge-production/. Aucun secret ni source privée publié. Tag de retour 0.9 conservé archive/au-fil-de-leau-before-poissons-2026-10-03 ; v7 et export original avant-v7 à conserver avant rollback.

Détails : poissons/PUBLICATION.md, VERIFICATION.md, PERFORMANCES.md et ESSAIS_TELEPHONE.md. Check final 174/174 + TypeScript/build ; 81 scénarios navigateur applicables contrôlés par lots avant les deux dernières corrections ciblées. Serveurs temporaires arrêtés, autres projets/services inchangés. La clôture documentaire conserve le même build et son identité publique est revérifiée après push.


## Progression/postes/pratiques 0.8.0 — 2 octobre 2026

Projet prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, portgas-d-ws-projects/fishdex-landing, GitHub portgas-d-w/fishdex-landing et production main revérifiés via métadonnées filtrées ; Vite/dist/npm ci/Node24. CLI 62.0.0 réellement installée. Aucun projet, domaine ou réglage de protection ajouté/modifié.

Préproduction READY dpl_HmnPXNX7Y1LbyRBh617f7UWpmMoj, https://fishdex-landing-80wspd47l-portgas-d-ws-projects.vercel.app, application 743cda81109653f32f45f9f1e574a50729db90e9, build 28,9 s. Smoke protégé : 9/10 dans la première passe, lancer bureau refusé avant engagement ; reprise 1/1 (52,9 s), donc tous les dix scénarios vérifiés, incluant vraie prise au coup et avec moulinet. OIDC limité à cette origine ; token non committé, traces désactivées. Tag archive/au-fil-de-leau-before-progression-2026-10-02 publié sur e300814. Domaines et protection conservés.

Local : check 58 tests + TypeScript/build, navigateur complet 56 réussis/3 exclusions/un relâchement bureau repris avec 14/14 ciblés ; build sans QA 10/10 (2,4 min). Format v5, original v4 conservé/exportable ; ancien lecteur incompatible avec v5, export préalable et préservation des deux carnets nécessaires pour retour.

Production READY dpl_FF3R2gxwrp3sAQVaEDEnJyxoXsJh, https://fishdex-landing-po0uh5j96-portgas-d-ws-projects.vercel.app, commit main 2045dce7513fe18188dda82df977920b3d704ec1, build 24,2 s. Sources applicatives 743cda8 inchangées. Smoke public https://www.fishdex.fr sans token : 10/10 (3,5 min), bureau et mobile, captures réelles au coup et au moulinet, photos/transfert, atelier/achats/favoris et quinze GLB. Domaine nu redirigé vers www, HTTP final 200 ; 45 JS/CSS identiques octet par octet au dist et manifeste JSON identique. Principal index-DD79opKe.js SHA256 ab55843a8779b6138b6cd64472b601a1c0b3281e617db113a68fa40c5c1d2f63. Preuves : apercus/progression/production-files.json et production-*.png. Scan Vercel erreurs 15 min : aucun événement renvoyé ; ce site statique ne fournit aucune télémétrie appareil. Serveur temporaire 4175 arrêté ; serveur utilisateur préservé. Les commits de clôture ne changent que ces preuves et la documentation ; le workflow contrôle READY et l’identité des fichiers après leur push. Rapport PROGRESSION_POSTES_METHODES.md ; aucun résultat appareil physique annoncé.

## Basalte & Turquoise 0.7.0 — 2 octobre 2026

Projet, dépôt et branche de production revérifiés : portgas-d-ws-projects/fishdex-landing, ID prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, GitHub portgas-d-w/fishdex-landing, main, Vite/dist/npm ci/Node24. CLI 62.0.0 réellement disponible. Domaines et protection conservés.

Application af889954e1f77234e93ddb9eed085d87ee7f955a. Preview READY dpl_7M3iQRWsYSwdXtNz2QnGdKMFWmNh : https://fishdex-landing-dieyn27kj-portgas-d-ws-projects.vercel.app, build 27 s ; smoke protégé **8/8 (1,7 min)**, vraie prise, transferts/photos, quinze modèles, atelier/presets/stock et favoris. OIDC obtenu par env pull/node --env-file, header limité à cette origine, traces désactivées, token jamais affiché ou committé. Puis fusion fast-forward et push main.

Tag de retour publié archive/au-fil-de-leau-before-basalte-2026-10-02, base d511384 ; ancienne production READY dpl_9SusEzAY2H3PNR4Jy2ft4jdjhuW1, https://fishdex-landing-2g1v53yn5-portgas-d-ws-projects.vercel.app. Sauvegarde v4 commune aux deux versions : aucun changement de schéma ni migration nouvelle. Aucun déploiement supprimé.

Production READY dpl_DhSAgCTqwhWHNKckfJTmDifVL7w7 : https://fishdex-landing-3wfnaw27u-portgas-d-ws-projects.vercel.app, build **33 s**, domaine public https://www.fishdex.fr. Smoke public sans token **8/8 (1,7 min)**, bureau et 390×844, console sans erreur détectée. Domaine nu redirige vers www, HTTP final 200. Les 45 JS/CSS référencés sont identiques octet par octet au dist vérifié ; manifeste JSON identique. Principal index-DTjLNFbt.js SHA256 2e7f7418c56e28834ce0760c9f62d473a3976f9778d486de95ae3479150714a5 ; détail docs/apercus/basalte-turquoise/production-files.json. Scan erreurs 15 min : aucun événement renvoyé. Aucun drain ; pas de télémétrie appareil. La clôture documentaire conserve les mêmes sources applicatives ; son déploiement et les fichiers sont contrôlés avant fin de session.

Clôture documentaire 0f746f8 : READY dpl_DNKz7zTNJzPs8C6ZnxEC6giavB1J, https://fishdex-landing-27bdhxc19-portgas-d-ws-projects.vercel.app, build 26 s. www.fishdex.fr résout vers ce SHA, HTTP 200 ; 45 fichiers et manifeste revérifiés identiques. Sources applicatives inchangées depuis les smoke publics. La présente précision ne change que les relais et ce journal.

Contrôles locaux : check **47 tests + TypeScript/build**, navigateur **51 réussis / 3 exclusions prévues**, smoke build sans QA **8/8 (1,6 min)**. Mesures et captures avant/après : BASALTE_TURQUOISE.md. Aucun résultat Safari/iPhone physique, chauffe/autonomie ou réseau mobile annoncé.

## Canne et montages 0.6.0 — 2 octobre 2026

Projet portgas-d-ws-projects/fishdex-landing, ID prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, dépôt portgas-d-w/fishdex-landing et main revérifiés. Domaines et protection conservés. CLI 62.0.0 disponible ; aucune installation ou nouveau service.

Application c4731a366df7e437db9e95ae412c8a2c90117c4d, Vite/Node24. Preview READY dpl_34hLQuHZBhbpfjFxELwV3WWzMdTR : https://fishdex-landing-lb8daqmwh-portgas-d-ws-projects.vercel.app, build 27 s, smoke protégé 8/8 (1,8 min). Sur Windows env run n’a pas accepté les arguments du runner ; env pull puis node --env-file ont fourni l’accès OIDC limité à cette origine, traces désactivées et token jamais affiché/committé.

Après validation, fusion fast-forward et push main. Production READY dpl_2a3os5G1xDbnUkhiYWpkjNejrfv8 : https://fishdex-landing-50au3tgze-portgas-d-ws-projects.vercel.app, build 24 s, domaine public https://www.fishdex.fr ; smoke public sans token **8/8 (1,8 min)**, captures réelles bureau/mobile, atelier, photos, progression et sauvegardes. Domaine nu redirigé vers www (HTTP final 200).

Les JS et CSS référencés dans index.html sont identiques octet par octet au build local ; principal index-D62PN8yx.js SHA256 f78e9904e5ddfdac50edbb513fc3ad6a1c6dc00e50fad43ac0d902a19fd7ee7d. Manifeste identique en contenu JSON ; fins de ligne Windows/Linux distinctes. Détail : docs/apercus/montages/production-files.json. Scan erreurs 15 min : aucun événement renvoyé. Drains : aucun configuré ; site statique, console navigateur contrôlée par smoke, aucune télémétrie des appareils.

Retour conservé et tag publié archive/au-fil-de-leau-before-montages-2026-10-02, base 8b646ad ; production précédente READY dpl_668C9o4wZNaKFtskyRQ9qR21saFP. Le schéma v4 n’est pas lu par l’ancienne application v3 : exporter la sauvegarde avant un retour applicatif, préserver ce JSON pour la reprise v4. Aucun déploiement supprimé.

Validation locale : npm run check (47 tests + TypeScript/build), suite navigateur 48 réussis / 2 exclusions prévues, atelier final 6/6, smoke sans QA 8/8 et complément visuel 2/2. Aucun résultat Safari/iPhone physique, chauffe ou réseau mobile annoncé. Le commit de clôture concerne seulement documentation et preuves ; son dernier état READY et les fichiers seront contrôlés après push.

## Structure complète 0.5.0 — publiée et vérifiée

Projet confirmé : `portgas-d-ws-projects/fishdex-landing`, Vite/Node 24, dépôt
`portgas-d-w/fishdex-landing`, production `main`. Commit `be65152f623de8f6d109c957ff0c128697360bfb` après validation de la preview ; déploiement production READY `dpl_3xuUNgMLk5D8FV1M6QqXpyDkD1qR`, URL de déploiement `https://fishdex-landing-c67y0vcte-portgas-d-ws-projects.vercel.app`, alias `https://www.fishdex.fr`. Domaines, protection et paramètres existants conservés.

Preview protégée du même commit : `https://fishdex-landing-ocqxwh3cu-portgas-d-ws-projects.vercel.app`, READY, smoke **6/6 (2,2 min)** avec OIDC limité à l'origine. Production publique : smoke **6/6 (2,1 min)** sans token. Vérification octet par octet de `dist` contre `www.fishdex.fr` : `/assets/index-CNngu06Z.js`, SHA256 `62a4bbae2be4bd6325f982c1885e114b3daa7a36385fd114be9f60c493917886`, manifeste et quinze GLB identiques. Le commit documentaire `02ebbf0` a ensuite produit le dernier déploiement READY `dpl_A4bYbGcRyVfTD7B5AyzXAvHX3App`, sans changement applicatif. Le retour avant mission reste disponible via `archive/au-fil-de-leau-before-structure-2026-10-01`.

## Appui maintenu 0.4.1 — publiée et vérifiée

Projet, liaison et dépôt revérifiés : portgas-d-ws-projects/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, Vite/Node 24/npm ci/build/dist ; CLI disponible 62.0.0. Aucun domaine ou paramètre de protection modifié.

Application 882035b86373c4f419f00a18b6fbdc217f80910e sur codex/mouliner-appui. Preview READY https://fishdex-landing-n7hk9lqag-portgas-d-ws-projects.vercel.app, dpl_2uQcvDbThTWFPdFNcHG9oSktXkfE. Smoke ciblé protégé **2/2 (2,0 min)**, capture réelle bureau/mobile, modèle différé, photo et sauvegarde/transfert. Fusion fast-forward main a815a10f755e611300add63a897237168c3237cb après ce contrôle. Production READY https://fishdex-landing-80jc171um-portgas-d-ws-projects.vercel.app, dpl_8vfANFSZkN3qvZbt4SjN7e2XQFnz ; **smoke public ciblé 2/2 (2,1 min)** sur www.fishdex.fr, sans QA ni token. Captures en temps réel bureau/mobile, appui tactile immobile, modèle différé, photo et sauvegarde/transfert. Bundle public index-C3HMXfaE.js SHA256 1829019d1e0f6d2aeca81d545f837a80bacf9f065a69fa21c5b78b43384b187c et manifeste quinze modèles identiques au dist vérifié. Application identique à la preview, diff src/public/package/config vide. Clôture documentaire seule ensuite ; dernier déploiement READY et fichiers servis identiques contrôlés avant fin. Serveur temporaire 4175 arrêté, serveurs utilisateur conservés. Token local non affiché, traces désactivées, accès limité à cette origine.

Retour 0.4 préservé : tag publié archive/au-fil-de-leau-before-hold-2026-10-01, base d6d9f907352297b39c685e2e9705ba816af7f728 ; précédent déploiement READY https://fishdex-landing-d5rsa5wmx-portgas-d-ws-projects.vercel.app, dpl_2PorgPdmwgH1qgEwVkqoA7xUqn7j. Même sauvegarde v2, anciens retours conservés.

## Gestes et combat 0.4.0 — publiée et vérifiée

Projet et liaison revérifiés : portgas-d-ws-projects/fishdex-landing, prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, dépôt portgas-d-w/fishdex-landing, Vite/Node 24/npm ci/build/dist. CLI disponible 62.0.0. Aucun changement de domaines ou de protection.

Application 3a2d06b19b27dec74cab8728e6952dc6cdf0ae42 sur codex/gestes-combat. Preview READY https://fishdex-landing-561eij874-portgas-d-ws-projects.vercel.app, dpl_7BHB69jgcKBK7x26wiW9DcjyQ4MC, build 27 s. Smoke protégé 6/6 (2,9 min), vraie capture souris/tactile, photos, sauvegarde/export/import, quinze GLB et achats/bassin. Token local limité à l’origine de la preview, traces désactivées ; aucun token affiché ou committé.

Retour 0.3.1 publié : tag archive/au-fil-de-leau-before-touch-combat-2026-10-01, base a6ef66b52b2a9cfe7e540e638d4f1d58a34074f6 ; ancien déploiement READY https://fishdex-landing-52juimmn5-portgas-d-ws-projects.vercel.app, dpl_EjnkbkyJA9GibQ7H7ZHatzyRjr5x. Sauvegarde v2 inchangée. Fusion fast-forward vers main après ce contrôle : 2dd0c5ab242088da316af70dcf5bd133d9e71099. Production READY https://fishdex-landing-m21grnm16-portgas-d-ws-projects.vercel.app, dpl_9y5pAom2WLtKxdZhEP3Xxq4qDKco. **Smoke public 6/6 (2,7 min)** sur www.fishdex.fr, sans token ni QA. JavaScript index-DkrQEhJk.js SHA256 111776c16a88eed3f2fec3c331b6e9d7c0a184c4cccb7a5c27346d82e065163c et manifeste quinze modèles identiques au dist testé. Aucun fichier d’application modifié depuis la preview ; clôture documentaire seule ensuite, dernier déploiement READY/fichiers identiques contrôlés avant fin. HTTP 200 sur www ; domaine nu HTTP 307 vers www. Serveur temporaire 4175 arrêté, serveurs utilisateur conservés.

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
