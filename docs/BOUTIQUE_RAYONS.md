# Boutique FishDex 0.14.1 — 4 octobre 2026, Codex

La boutique commence par six rayons illustrés : Cannes, Moulinets, Fils, Montages, Appâts et leurres, Accessoires. Aquarium est une section distincte. En-tête titre/solde compact, recherche générale permanente et retour Rayons. Sur mobile : deux colonnes ; bureau : trois. Surfaces Basalte mates, schémas sobres, turquoise pour sélections/actions. Assets existants et schémas réutilisés ; aucun nouveau modèle, service ou dépendance.

## Catalogue et règles conservés

142 articles achetables/inclus : 12 cannes, 2 moulinets, 9 fils/terminaux/soies, 27 composants de montage, 86 appâts/leurres/amorce, 4 accessoires et 2 décorations. Le catalogue gratuit de secours reste dans Matériel. Aucune entrée dupliquée ou supprimée. Les rayons n’inventent ni Tresse ni Fluorocarbone : aucun article existant n’est explicitement classé ainsi. Les corps de ligne génériques gardent leur intitulé, sans nouvelle promesse de matériau.

Sous-rayons construits sur les vrais produits ; Montages finit par Autres composants. Appâts et leurres possède deux sous-rayons et un seul sélecteur de familles lorsqu’une sélection le justifie. Pagination de 24 cartes ; images différées, aucune scène supplémentaire. Carte entière interactive : illustration, nom, bénéfice court, prix/lot, possession/stock/équipement/verrou ; aucun trio de boutons redondants.

Fiche : utilité/compatibilité, quantité et achat en premier ; descriptions/compromis/statistiques repliés ensuite. Comparaison explicite du régime des appâts sans promesse de prise. Méthodes issues des 22 techniques et des emplacements effectivement fournis par `slotsFor`, comparaison des valeurs existantes avec le composant actuellement choisi lorsque pertinente. Prix élevé ne constitue pas une recommandation universelle. Filtre Compatible avec ma canne = technique/recette/emplacement, distinct du verrou de progression et du solde. Conditions issues de `itemCondition`/`unlockReason` ; pas de promo ou d’urgence inventée.

Lots entre 1 et 20 selon la limite existante : quantité vendue, coût total et confirmation explicite. `purchase`/`purchaseComponent` restent les seuls services de transaction ; réservations, consommation/casse, secours, prix, droits et v7 intacts. Achat n’équipe pas ; fiche de canne possédée offre un équipement explicite via `equipRod`. Bouton de confirmation bloqué synchroniquement pour empêcher une double transaction. Aucun ajout au schéma de sauvegarde.

Retour fiche : sous-rayon, famille, compatibilité, recherche, nombre de cartes chargées, position et focus conservés. L’entrée par Menu revient aux catégories ; le lien Aquarium ouvre uniquement son décor et revient à Décorer après achat. Documentation de conception reste repliée et secondaire. Fiches fermées libèrent leurs contrôles pour éviter des IDs concurrents entre canne et composant.

## Fichiers

- `src/game/shop.ts` : correspondance des IDs et sélecteurs purs ; règles référencées, sans nouvelle économie.
- `src/ui/shop.ts`, `shop.css` : navigation, cartes, fiches, quantités, retours et transactions.
- `src/ui/structure.ts`, `tackle.ts`, `src/main.ts` : intégration aux hooks/dialogues et suppression des deux anciens catalogues affichés ensemble. Matériel conserve ses fiches et achats contextuels.
- `tests/shop.test.ts`, `tests/browser/shop.spec.ts`, `playwright.shop.config.ts` : couverture catalogue/compatibilités et parcours utilisables aussi contre une URL publique sans QA.
- Helpers et anciens scénarios d’achat adaptés au trajet fiche→achat ; contrôles de fonds/stock/acquis gardés.
- `scripts/capture-shop.mjs` : références vierges, bureau1440×900/mobile Chromium390×844, même poste et ambiance par défaut. Revue protégée : en-tête limité à son origine, jeton privé ignoré.

## Vérifications locales réellement exécutées

Node24.15.0 ; npm ci sans nouvelle dépendance. `npm run check` : 214/214, TypeScript/build passent. Comparaison exhaustive du filtre sur 22 préparations ; toutes leurs compatibilités figurent également dans la fiche, y compris moulinet/élastique/réception ajoutés par `slotsFor`.

Playwright : 14/14 boutique après réparation des contrôles conservés dans un dialogue fermé ; configuration mobile corrigée vers Chromium installé. Puis16/16 (les sept scénarios boutique × deux formats et retour Matériel/fiche × deux). Finition de la fiche ensuite :14/14 rejoués sur la dernière application (achat remonté, comparaison à la demande). Régressions avant cette seule finition de disposition :10/10 carnet/photo, TEST, bassin, progression et atelier. Achats répétés de maïs 3+2 lots =75 portions/40 écus ; double confirmation ne double pas le stock. Achat canne sans équipement puis équipement explicite ; annulation conserve le solde, recharge conserve les droits. TEST achète une canne160 et20 lots8, coût théorique320,300 portions, sauvegarde normale inchangée.

Dispositions : 320×740,390×844,430×932,844×390 et1440×900 sans débordement de boutique ; deux colonnes étroites/trois au bureau. Erreurs vides, quantité0/non entière, argent insuffisant, incompatible et verrouillage distincts contrôlés. Aquarium n’affiche que deux décors, achat revient au panneau d’origine sans changer journal/favoris. Images et fiches consultées visuellement sur les captures.

Captures : `docs/apercus/boutique-rayons/avant` (version publique0.14.0), `apres` (préproduction finale puis domaine public) et `controle` ; retours Matériel dans `docs/apercus/refonte-ui/boutique-controles`. Les historiques des quatre lots précédents sont conservés. Avant/après = profils de navigateur isolés, pas les données du propriétaire.

Pas d’essai physique iPhone/Safari, clavier virtuel, VoiceOver, gestes réels, chauffe ou FPS. Les dimensions Chromium sont des contrôles de disposition, pas une garantie sur téléphone. Avertissement de gros chunk Babylon déjà présent ; pas de nouveau benchmark 3D pour cette UI.

## Publication

Identité confirmée le4octobre : prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, team_5BFwQHD6LvVeOSgmKAj7QoTv, portgas-d-ws-projects/fishdex-landing ; GitHub portgas-d-w/fishdex-landing, main, Vite, Node24. Branche de revue `codex/boutique-rayons`. Revue finale READY dpl_HQ2GxrZMEoHwm4BvV3R7DjDhoPGr, https://fishdex-landing-65vqbyenm-portgas-d-ws-projects.vercel.app, application351ce649c9077b0f481a71f393b4db3f5b6adaea.14/14scénarios hébergés passent (1,1min), sans API QA.262JS/CSS,33GLBpoissons,197illustrations et carte/décor correspondent au dist. Entrée /assets/index-9cxLGp54.js, SHA2564d297c9d6e6b8250bcc74edc30cb1058b8fad7edbe01d3b2218969d8176ad59b. Preuve : boutique-rayons-preview-integrite.json. Publication sur main après cette validation. Tag archive/au-fil-de-leau-before-boutique-2026-10-04 conservé sur b975a67 ; aucune protection, domaine ni projet remplacé.

## Essayer sur téléphone

Ouvrir fishdex.fr→Menu→Boutique. Choisir un des six rayons ; Montages→Flotteurs ou Appâts et leurres→Appâts ; cocher Compatible avec ma canne. Toucher un produit, lire ses usages, changer le nombre de lots puis confirmer. Revenir retrouve le rayon ; Matériel→Mon sac montre la réserve achetée. Aquarium→Décorer→Décorations du bassin ouvre le rayon séparé. Pour essayer librement : Menu→Aide→Mode test→Ouvrir mon profil de test ; ∞ garde prix/stock/compatibilité/casse et un profil séparé.

Prochaine tâche Claude : tests tactiles iPhone, notamment champ quantité/clavier, retour/focus/rotation et relecture des compromis. Ajouter un futur produit via le catalogue réel, puis vérifier son rayon ; ne pas reclasser une ligne générique comme tresse ou fluoro sans données ni effets correspondants.

Coût mesuré du build final : entréeJS2 306 038octets contre2 295 424 (10 614octets,0,46 %),gzip573,46Ko contre570,91 ; CSS56 136octets/gzip11,17Ko. Aucun nouveau modèle ou texture ;24cartes au maximum avant Voir la suite. Aucune mesure FPS/appareil tirée de ces poids. Commits : d1c5348 (rayons) et351ce64 (fiche à informations essentielles en premier) ; clôtures de preuves ultérieures sans changement applicatif.
