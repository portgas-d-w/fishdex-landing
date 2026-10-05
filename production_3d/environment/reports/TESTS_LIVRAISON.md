# Vérifications de livraison — 5 octobre 2026

- `npm run check` : 227/227 tests unitaires, TypeScript et build Vite réussis (état final).
- Suite Playwright complète (bureau 1440×900 + mobile 390×844, Chromium SwiftShader) sur la branche : 116 réussis, 31 échoués, 3 ignorés (1 h 30).
- Mêmes 31 tests rejoués sur l'état d'origine `d2ffa28` (avant ce chantier) : **25 échouent déjà** (progression, export de migration, textes de parcours, contraste d'en-tête, gestes, atelier…) — échecs préexistants, hors décor.
- 6 échecs propres à la branche (bureau) rejoués isolément : 5 réussissent (lenteur ponctuelle pendant la longue suite) ; `techniques.spec.ts:15` (22 chaînes complètes en 180 s) dépasse aussi son délai sur l'état d'origine (189 s mesurées) : test à la limite sur cette machine en rendu logiciel.
- Correctif de test : `fish-finishes.spec.ts` exclut les GLB de décor (`/models/environment/`) de son contrôle « aucun modèle de poisson au démarrage », comme `models.spec.ts` et le smoke de production.
- Après le rejeu, allègement des shaders (spéculaire coupé sur matières mates, normal map d'écorce retirée, détail du sol en multiplicateur) : rendu visuellement identique, +2 FPS logiciel au bureau ; la passe ciblée finale a été interrompue à la demande du propriétaire avant résultat.
- Aucun test sur iPhone physique.
