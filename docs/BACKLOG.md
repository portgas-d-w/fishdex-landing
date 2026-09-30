# Priorités du chantier

## P0 — Mettre le prototype entre les mains du propriétaire

- [x] Installer et lancer le dossier sur son PC (Node 24.15.0, npm ci, check).
- [x] Identifier Vercel et son dépôt (`portgas-d-w/fishdex-landing`, `main`).
- [x] Publier la préproduction (30/09, voir docs/VERCEL.md).
- [ ] Vérifier la préproduction, remplacer la production autorisée et confirmer le déploiement Git.
- [x] Arrêter le moulinet sur pagehide et suspendre le rendu pendant les modales/pauses.
- [x] Isoler les E2E sur 5174 ; vérifier le vrai build et les appuis tactiles Chromium.
- [ ] Tester Safari sur iPhone réel : lancer, touche, maintien, relâchement hors bouton,
      verrouillage/reprise, audio après geste, import/export, portrait et paysage.
- [ ] Relever fluidité, chauffe et temps de chargement sur vrai téléphone.

## P1 — Améliorer la sensation et le rendu à partir du test

- [ ] Demander un retour concret : combat lisible ? trop lent ? trop facile ? décor agréable ?
- [ ] Donner plus de poids aux départs : flexion de canne, mouvement de ligne, son de moulinet.
- [ ] Distinguer les comportements des cinq espèces au-delà du simple coefficient de force.
- [ ] Optimiser les draw calls et le rendu selon les mesures, avant d’ajouter des effets.
- [ ] Préparer une animation de nage locale sur un poisson, puis valider le résultat.

## P2 — Une raison de revenir, une fois la pêche agréable

- [ ] Petits objectifs de collection non quotidiens : première carpe, cinq espèces,
      record personnel. Récompenses déterministes et compréhensibles.
- [ ] Une amélioration de matériel avec effet tangible et équilibré.
- [ ] Deuxième lieu seulement après avoir rendu le premier intéressant.
- [ ] Choisir progressivement d’autres poissons du pack selon les lieux.

## Hors périmètre actuel

Multijoueur, comptes, classement serveur, boutique réelle, lootboxes, publicités,
abonnement, Steam, monde ouvert, moteur alternatif, génération d’assets à la volée.

## Règle de priorité

Un bug qui empêche une prise ou une sauvegarde passe avant un nouveau contenu.
Un rendu fluide et un combat plaisant passent avant les 50 espèces.
