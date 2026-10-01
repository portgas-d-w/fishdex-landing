# Mission autonome — suivi du 1 octobre 2026

Agent : Codex. Mission source : `MISSION_CODEX_AUTONOME_AU_FIL_DE_LEAU.md`.
Autorisation explicite de réaliser P0 à P4 et de publier sur la cible existante après validation. FishDex reste en lecture seule.

| Étape | État | Validation attendue |
| --- | --- | --- |
| Inspection et point de reprise | En cours, branche codex/mission-autonome-2026-10-01 | Installation, check et E2E existants |
| P0 gestes et combat spatial | Implémenté, check 12/12, E2E 8/8 | Captures 390×844 et bureau inspectées ; test synthétique de capture de pointeur remplacé par un vrai pointeur pour éviter une erreur du test |
| P1 catalogue, spécimens, photos, migration | Implémenté, validation en cours | 96 fiches / 59 groupes selon fichiers réels, 88 miniatures WebP 557 Ko, cinq espèces jouables ; v2, journal, photos IndexedDB séparées |
| P2 économie et équipement | Implémenté, validation en cours | XP, sept badges, écus, trois cannes et deux décorations ; achats et équipement effectifs |
| P3 aquarium | À faire | Cinq individus maximum, décoration persistée, scènes suspendues |
| P4 méthodes et animations | À faire | Différences effectives, animation anatomique légère, ressources à la demande |
| Publication | À faire | Cible vérifiée, preview puis production testées |

État initial : seul le document de mission est non suivi ; sources propres. Node 24.15.0 et npm 11.12.1 disponibles. FishDex possède des changements préexistants qui ne seront pas modifiés.
