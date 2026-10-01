# Mission autonome — 1 octobre 2026

Agent : Codex. Version 0.2.0. Mission source : MISSION_CODEX_AUTONOME_AU_FIL_DE_LEAU.md. Autorisation explicite de réaliser P0 à P4 et de publier sur la cible existante après validation. FishDex est resté en lecture seule.

| Étape | État réel | Validation |
| --- | --- | --- |
| Inspection et reprise | Terminé | Sources initiales propres sauf mission fournie ; Node 24.15.0, npm 11.12.1, npm ci réussi, zéro vulnérabilité ; branche codex/mission-autonome-2026-10-01 |
| P0 gestes et combat spatial | Terminé | Cible libre, refus/annulation, habitats, fil/canne liés aux mouvements, deux doigts réels dans Chromium, capture contrôlée, casse et décrochage |
| P1 catalogue et progression | Terminé dans le périmètre jouable | 96 fiches regroupées en 59 binômes déclarés ; 88 illustrations ; 15 espèces jouables. Journal individuel, poids cohérent, robes/Mirage, photos locales, migration v1/v2, export/import |
| P2 économie et matériel | Terminé | Récompenses uniques, niveaux, sept badges, trois cannes et deux décorations achetables, équipement effectif, base gratuite réutilisable |
| P3 aquarium | Terminé | Cinq individus maximum, tailles/robes, nage, décor personnalisable persistant, fiches, remplacement, chargement différé, moteurs libérés et scène cachée suspendue |
| P4 méthodes et pack | Terminé pour trois méthodes et quinze modèles | Flotteur avec touche/ferrage ; leurre avec récupération/animation nécessaires ; fond avec touche de canne sans bouchon. 50 FBX inventoriés, 15 convertis/optimisés et inspectés |
| P4 animations et présentation | Partiel et provisoire | Déformation continue corps/queue sans rig, vitesse variable, débattement intermittent, tapis à partir de 60 cm. Respiration bouche/opercules, suspension au fil et arrivée à l’épuisette absentes |
| Publication | Préproduction vérifiée, production autorisée en cours | Preview Git b77a4ee READY, smoke distant 6/6 (1,2 min). Deux envois CLI avaient échoué fetch failed avant création. Même application vers main après cette validation |

## Vérifications finales locales

- npm run check : TypeScript strict, **19 tests de logique réussis**, build 0.2.0 réussi.
- npm run test:e2e : **20 réussis, 2 ignorés volontairement, 1 min 30 s**. Atlas des quinze modèles testé au bureau ; test CDP à deux doigts sur viewport tactile uniquement. Autres scénarios sur 1440×900 et 390×844.
- Captures inspectées dans docs/apercus/, y compris poissons-atlas.jpg.
- Mesures de trois secondes : étang 22,1 FPS bureau / 23,5 mobile ; aquarium cinq poissons 23,3 / 22,5 FPS. Chromium headless ANGLE SwiftShader sur Windows, qualité eco. Aucun rendu de l’étang pendant l’aquarium. Ces chiffres ne sont pas des mesures iPhone.
- Aucun test Safari ou iPhone 14 Pro physique disponible. Objectif 30 FPS appareil, chauffe et autonomie restent non validés.
- Chunk principal 1 672,35 Ko brut / 405,31 Ko gzip : avertissement Vite de taille, pas erreur de build. Aucun GLB téléchargé au démarrage ; quinze fichiers totalisent 1 731 232 octets.

## À reprendre après essai propriétaire

Tester Safari/iPhone réel (gestes, verrouillage, audio, import/export, portrait/paysage), mesurer fluidité/chauffe et ajuster combat/récompenses. Les 35 modèles restants et les variétés prévues ne sont pas annoncés jouables. Prévoir un rig ou des régions anatomiques vérifiées pour la respiration, puis une présentation suspendue et une arrivée à l’épuisette sans rallonger la boucle.

Même clé locale, version 2 ; anciens agrégats historiques sans fabrication de spécimens. Export JSON sans photos ; portraits régénérables depuis l’identité sauvegardée. Photos IndexedDB limitées à 128, ≤100 Ko, erreurs non bloquantes. Stockage local fini ; journal/import limités à 10 000 captures et 5 Mo, archivage durable à prévoir avant un usage de très longue durée.

## Jalons conservés

P0 : c103bc6, check 12/12, E2E 8/8. P1/P2 : 3734312, check 16/16, E2E 10/10. P3 : d32369e, check 17/17, E2E 14/14. Les erreurs intermédiaires (rechargement Vite pendant E2E, capture synthétique de pointeur, sémantique touchEnd CDP) ont été corrigées puis les scénarios relancés ; aucune couverture supprimée pour masquer un échec.
