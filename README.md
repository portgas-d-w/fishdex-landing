# Au fil de l’eau — 0.9.0

Jeu de pêche 3D solo pour navigateur mobile, Babylon.js + TypeScript + Vite. Nom, décor et équilibrage provisoires. Sans compte, paiement, backend ni clé API.

## Jouer et reprendre

Production normale : [www.fishdex.fr](https://www.fishdex.fr), projet existant fishdex-landing. [Revue V2 avec Mode test](https://fishdex-landing-3dta83925-portgas-d-ws-projects.vercel.app) : Menu → Réglages et aide → Mode test → Ouvrir mon profil de test. Profil séparé, ∞, stock/casse et compatibilités conservés. Procédure téléphone : [ESSAIS_TELEPHONE_V2.md](docs/ESSAIS_TELEPHONE_V2.md). Publication et retour : [PUBLICATION_V2.md](docs/PUBLICATION_V2.md) et RELAIS_PROJET.md. Le projet FishDex de référence reste inchangé.

Partir du tiers inférieur, projeter vers l’eau puis relâcher au centre ou plus haut. La vitesse récente et le matériel bornent la distance. En combat : canne glissée à gauche et, si le montage en possède un, moulinet à droite par appui maintenu au second doigt. Sur PC : glissement et molette simultanés. Relâcher arrête immédiatement la récupération. Accompagner le fil, surveiller la tension et ajuster le frein : une tension utile fatigue le poisson. Le coup n'a pas de moulinet ; grande canne/carpodrome déboîtent jusqu'au kit. Après rapprochement réel, toucher Recevoir pour la petite prise, l'épuisette ou le tapis. Photo, gains et souvenir suivent une réception réussie, une seule fois.

Menu compact : FishDex principal, Ma canne/montage/Mon sac/Ensembles, carnet, lieux, aquarium, Boutique, progression et réglages. Les écrans ont un retour ; le menu suspend la pêche. Les champs restent sélectionnables et les panneaux défilables. Les **22 pratiques et 55 recettes** sont jouables avec préparation/signaux/actions propres ; six postes d'étang, rivière à courant, lac profond et embarcation mobile bornée. Disponibilité progressive dans la partie normale, accès libre dans le bac à sable de revue. Couverture et limites : [MATRICE_V2.md](docs/MATRICE_V2.md).

Quinze espèces du pack, carnet individuel avec photos, records, robes et Mirage. Encyclopédie issue des fichiers FishDex : 96 fiches regroupées en 59 binômes déclarés ; les espèces sans asset restent prévues. XP, maîtrises, badges, écus, cannes et composants spécialisés, secours gratuit. Aquarium personnalisable avec cinq favoris, nage procédurale et fiches personnelles.

La sauvegarde v6 appartient au navigateur et au domaine, lit v1–v5 et conserve les droits/records/stock/captures. Original pré-migration exportable. Normal et TEST ont clés/photos séparées et imports croisés refusés. Export/import JSON pour le transfert ; photos locales IndexedDB non incluses dans le JSON, régénérables depuis les souvenirs. Pas de synchronisation ni PWA hors connexion.

## Installation et commandes

Node.js 24 LTS recommandé, minimum 22.12. Ouvrir le dossier dans Codex ou Claude, lire AGENTS.md puis RELAIS_PROJET.md. Ne pas ouvrir index.html par double-clic.

```sh
node scripts/setup.mjs
npm run dev
```

| Commande | Rôle |
| --- | --- |
| npm ci | Installer les versions verrouillées |
| npm run dev | Serveur Vite et adresse réseau pour essai Wi-Fi |
| npm run check | TypeScript strict, tests de logique et build |
| npx playwright install chromium | Navigateur des vérifications automatisées |
| npm run test:e2e | Bureau 1440×900 et Chromium tactile 390×844, serveur dédié 5174 |
| npm run preview | Servir dist localement après build |
| npm run test:smoke | Vraie partie sur build servi, sans QA ; GAME_URL pour cible distante |

Exécuter E2E et smoke successivement. V2 : **97 tests Node + TypeScript/build**, chaînes naturelles 22 pratiques/55 recettes ; navigateur initial avec échecs repris, 38/38 puis 10/10 ; preview hébergée sans QA **14/14**. Banc naturel fini : 235 captures/264 lancers avec contrôleur idéal. Historique, références et mesures dans [IMPLEMENTATION_V2.md](docs/IMPLEMENTATION_V2.md). Les mesures Chromium/SwiftShader PC ne garantissent pas 30 FPS téléphone ; Safari, gestes humains, chauffe et autonomie restent à tester physiquement.

## Organisation et ressources

Règles indépendantes dans src/game/, scènes dans src/render/, photos et audio dans src/ui/. Quinze GLB et 88 miniatures dans public/. Conversion, inventaire et import reproductible dans scripts/. Tests et documents de reprise dans tests/ et docs/.

Pack River fish / TricksUp fourni sous sa licence d'origine. Archive privée assets-source/ exclue de Git et Vercel, jamais envoyée à un générateur. Quinze GLB optimisés 1,73 Mo, chargés à la demande. Les 50 FBX n'ont pas de rig livré ; présentation et réception utilisent des animations procédurales provisoires. Aucun nouveau modèle généré. Voir docs/ASSETS_POISSONS.md.

Pas de test iPhone réel annoncé, pas de nouvelle souscription, pas de modification du dépôt FishDex de référence. Lire et actualiser RELAIS_PROJET.md à chaque session ; suivre docs/BACKLOG.md.

Structure : docs/STRUCTURE_COMPLETE.md. DA Basalte & Turquoise : docs/QUALITE_VISUELLE.md et docs/BASALTE_TURQUOISE.md. Ces rapports historiques restent des preuves de leurs versions ; la V2 remplace les anciennes limites de méthodes et la commande circulaire. Reprise courante : RELAIS_PROJET.md et docs/BACKLOG.md.
