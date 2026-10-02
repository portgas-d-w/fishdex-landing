# Catalogue complet et Mode test — chantier version 2

2 octobre 2026, Codex. Base 3b92834 (0.8 publiée), branche codex/catalogue-complet-v2. La consigne utilisateur et SPEC_PROGRESSION_SPOTS_METHODES_V2.md remplacent les restrictions anciennes à deux pratiques. Aucun modèle généré, abonnement ou moteur ajouté. DEMARRER_AVEC_CODEX.md préexistant reste hors des commits.

## Audit

Validation du dossier matériel : PASS, 6 151 contrôles, 22 méthodes/approches, 55 recettes, 80 appâts/amorce/leurres, 84 familles et 274 exemples de SKU sans paramètres complets. Quinze espèces possèdent un GLB ; les espèces non représentées ne deviennent pas capturables par ajout d'une technique. Babylon core/loaders 9.28.0, Node 24.15.0, Vite 8.3.1 conservés. npm ci : zéro vulnérabilité. Référence npm run check : 58 tests, TypeScript et build réussis.

Les IDs historiques pole/float/bottom/lure restent les quatre familles de moteur et les captures anciennes restent identiques. Les 22 IDs du dossier sont des techniques/approches explicitement sélectionnées ; les 55 IDs de recette sont conservés. Les paramètres supplémentaires constituent une configuration de jeu versionnée, jamais une mesure biologique.

## Lot 1 : profil de développement

Mode test disponible dans Réglages des builds de développement et préproductions, contrôlé par __TEST_MODE_ENABLED__ (VERCEL_ENV=preview ou FISHING_TEST_BUILD=1) et import.meta.env.DEV. Il ne s'active jamais automatiquement pour une partie normale. Clé normale au-fil-de-leau.save.v1 intacte ; profil séparé au-fil-de-leau.test.save.v1 et photos dans au-fil-de-leau.test.photos. Le retour à la partie normale ne transfère aucune capture, monnaie ou possession. Imports croisés refusés.

Portefeuille ∞ via indicateur, nombres JSON finis. Prix et quantités conservés ; coût théorique cumulé. Stock consommé/perdu par défaut, réapprovisionnement explicite et stock illimité indépendant. Profil de test neuf « règles normales » conserve les verrous et le solde limité. Scénarios de touche/combat à graine et individu fixes, casse locale/décrochage/accroche et diagnostics repliables ; les forçages annoncent habitat/appât/attente contournés. Les achats ne créent ni XP ni objectifs réalisés.

Contrôles lot 1 : npm run check 64 tests + TypeScript/build PASS ; navigateur development.spec.ts 4/4 bureau et 390×844. Achat de précision avec 0 écus et ∞, coût de 160, reload, égalité octet par octet du carnet normal et retour sans achat de test ; combat au coup sans moulinet, casse réelle et profil neuf limité contrôlés. Première passe Node a signalé une syntaxe TypeScript non prise en charge par strip-only, corrigée avant la passe complète. Aucun téléphone physique testé.

## Lot 2 : chaînes complètes et contextes

Version 0.9.0, sauvegarde v6, lecture v1–v5 et original pré-migration conservé. Les 22 IDs canoniques et 55 recettes sont raccordés aux moteurs présentation/ferrage/combat/réception. La matrice détaillée est dans [MATRICE_V2.md](MATRICE_V2.md), les recherches complémentaires dans [RECHERCHE_TECHNIQUES_V2.md](RECHERCHE_TECHNIQUES_V2.md). Les captures anciennes et les quatre familles historiques restent lisibles ; les maîtrises de technique ne sont pas attribuées rétroactivement aux captures sans technique connue.

La présentation tient compte des composants : masse, portance, descente, tenue d'esche, diffusion, PVA, esche équilibrée/surélevée, corps porteur de bombette, soie/pointe, potences gambe et branches détachées. Les stocks sont réservés et résolus une seule fois ; une ligne refusée avant l'eau ne consomme pas sa portion. Les variantes de recette modifient les mêmes variables physiques partagées, sans créer 55 moteurs parallèles.

Le coup reste sans récupération par moulinet. Grande canne et carpodrome déboîtent progressivement sous contrôle de tension. Le feeder doit être garni ; la mouche demande une préparation de soie ; dérive/retenue, animation et contact sont causaux. La traîne exige un bateau en mouvement ; le clonk produit une attraction temporaire avec délai, sans réaction garantie. Une arrivée réelle à moins de 1,81 m ouvre une étape de réception séparée : même individu, aucune récompense anticipée, petite prise/épuisette/tapis et kit selon gabarit et sections. Frein réglable sur les ensembles à moulinet ; assistance toujours expérimentale.

Les six postes existants de l'étang sont complétés par rivière à courant, lac à profondeur réellement accessible de 6–18 m et embarcation procédurale mobile sur parcours borné. Caméra et point de pêche suivent le bateau ; même scène et moteur. Microzones/présences restent explicites. Aucun poisson sans asset n'est ajouté implicitement : mouche sur espèces compatibles actuelles, gambe sur perche et une prise par branche ferrée. Les truites/corégones absents du pack restent prévus.

Ma canne, montage, Mon sac, Ensembles et Boutique restent les sections existantes. Choix compatible, recettes mémorisées, 33 emplacements, 80 composants d'appâts/amorce/leurres et pièces de secours/payantes raccordés. XP, droits permanents niveau OU objectif, 22 maîtrises, badges, FishDex, carnet, photo locale et aquarium cinq favoris suivent les vrais événements de capture. Le Mode test ne crée aucun droit dans le profil normal ; ses outils changent explicitement kit/milieu, vent/courant/heure, graine/individu, pertes ou réserves. Le changement de scénario remet à zéro les anciennes surcharges de milieu.

## Vérifications exécutées

- `npm run check` final : **97 tests Node, TypeScript et build réussis**. Les tests exécutent 22 chaînes naturelles, puis les 55 recettes avec présentation adaptée, combat, réception, gain unique et sauvegarde. Contrôles causaux de masse/soie/profondeur/diffusion/rotation/tenue, frein/sections, pertes/pointe/branche/lest, droit d'accès et dt 30/60/120 Hz. Le build signale toujours le gros chunk Babylon, pas une erreur.
- Navigateur Chromium/SwiftShader, un worker, bureau 1440×900 et mobile émulé 390×844 : première suite 59 réussis, 10 échecs et 3 exclusions. Les échecs de gestes/attentes et les anciennes assertions de contenus futurs ont été corrigés ; reprise **38/38**, puis contrôles finaux **10/10**. Cela couvre 71 scénarios distincts au fil des passes, pas une exécution unique « 71/71 ». Les 22 chaînes UI avec rencontre forcée incluent photo et reload ; les 44 preuves portent l'ID réel de pratique.
- Banc sans forçage ni monnaie/stock illimités : **264 lancers, 235 captures**, au moins une par pratique. Échecs et coûts inclus ; écus/min de 15,61 à 52,21 selon pratique. Contrôleur parfait, fixture normale de haut niveau et hypothèse de 8 s photo/préparation : aucune conclusion d'équilibre humain. Résultats reproductibles dans `apercus/v2/natural-economy.json`.
- Build normal sans API QA : première passe 10 réussis, deux échecs d'assertion « À venir » pour le waggler devenu jouable, deux scénarios de test exclus. Assertion adaptée et reprise atelier **2/2**. Les captures naturelles au coup et avec moulinet, réception, photos/import/export, quinze GLB, atelier/achats/favoris et absence de Mode test passent. Les contrôles hébergés finaux sont consignés dans `PUBLICATION_V2.md`.
- Build de revue local sans API QA : **12 scénarios réussis**, deux assertions d'égalité textuelle au retour normal échouées car le validateur réordonne les clés JSON au redémarrage. Vérification corrigée : texte normal identique pendant TEST, données profondément identiques après retour. Reprise **2/2**, sans changement applicatif. Feeder/mouche/traîne utilisent les commandes réelles jusqu'à réception/photo/reload, sur bureau et mobile émulé ; rencontre forcée explicitement par outil de scénario.

## Référence et mesures disponibles

`scripts/techniques-reference.mjs` compare la base 0.8.0 à la nouvelle version, graine, caméra et dimensions égales, DPR 1, mode éco, 20 échantillons de 150 ms après échauffement. Les images et JSON sont dans `apercus/v2/reference/`. Premier essai du script corrigé (body de hauteur nulle, attente sur attribut ready), passe finale réussie et cadrages identiques.

| Ponton | Avant / après FPS | Draw calls avant / après | CPU médian avant / après | CPU P95 avant / après |
| --- | --- | --- | --- | --- |
| Bureau, rendu 1024×640 | 22,80 / 22,35 | 27 / 27 | 0,5 / 0,5 ms | 2,3 / 0,9 ms |
| Mobile émulé, rendu 390×844 | 22,63 / 23,21 | 23 / 23 | 0,4 / 0,5 ms | 0,8 / 1,1 ms |

La scène passe de 55 à 65 meshes, dix objets réutilisés pour bateau/réception/potences ; 57 000 → 58 023 sommets au ponton. Rivière/lac/embarcation : environ 22,75–23,84 FPS, 19–20 draw calls, un moteur et une scène, aucun GLB au démarrage, aucune erreur JavaScript dans cette mesure. Le CPU mesure la soumission du rendu, pas le GPU. Chromium logiciel sur PC n'est pas un téléphone ni une garantie de 30 FPS.

## Limites et prochaine étape

Projection de soie, bateau et réception sont procéduraux et simplifiés. Les paramètres sont versionnés de prototype ; les profils d'espèce ne sont pas des séquences biologiques garanties. Les SKU incomplets restent documentaires. **Aucun appareil physique testé** : Safari/iOS, Android modeste, gestes humains à deux doigts, chauffe, autonomie, GPU, réseau mobile, durée et agrément des combats restent à mesurer. La procédure est dans [ESSAIS_TELEPHONE_V2.md](ESSAIS_TELEPHONE_V2.md). Publication et retour arrière : [PUBLICATION_V2.md](PUBLICATION_V2.md).
