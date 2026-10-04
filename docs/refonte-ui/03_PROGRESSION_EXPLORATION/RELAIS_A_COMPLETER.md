# Relais — lot 03 terminé localement

4 octobre 2026 · Codex · branche codex/refonte-ui · départ df0f70e.

Progression : objectif suivi persistant, chemins alternatifs affichés avec leurs seuils réels, conséquence et action suivante ; trois vues Parcours/22 techniques/Badges. Carte : six postes locaux, habitats et obstacles du moteur, consultation sans trajet, installation explicite avec revalidation des droits et de la ligne en service. Lieux : neuf destinations, contexte embarcation intégré au lac, aperçus photographiques indisponibles signalés. Observation : états vides et liens vers des postes réellement observables, identités inconnues masquées. Accueil : prochaine étape compacte. Navigation native : promotion des dialogues déjà ouverts, retours contextuels et une seule couche interactive.

## Architecture et données
src/game/objectives.ts : sélecteurs purs de conseils et destinations. progression.ts : lecture des conditions de postes ; aucune modification des seuils ni récompenses. save.ts : champ facultatif ui.trackedObjective validé à l’import, schéma v7 et clés inchangés. structure.ts : libellé du badge record aligné sur la règle déjà existante (première prise comprise). src/ui/journey.ts, structure.ts, observations.ts, presentation.ts/css et main.ts : affichage et navigation. Le suivi ne change ni stock, ni monnaie, ni expérience, ni trajet. Les moteurs aquarium/capture/observation gardent leurs cycles de vie.

## Validation réelle
npm run check : TypeScript, 210 tests/210 et build passent. Chromium : 14 scénarios mobile 390×844 et bureau passent (références vierge/avancée, nouvelle partie trois postes, migration v4, deux captures par gestes et simulation accélérée QA, accès permanent roseaux, initiation et leurre, achat confirmé, parcours lieux et observation, persistance du suivi). Les scénarios de capture ne sont pas des mesures de durée humaine. Conditions alternatives vérifiées contre refreshRights/postAccess ; sauvegarde v7 et conseils sans mutation testés.

Captures : docs/apercus/refonte-ui/avant et 03-apres, mêmes profils/cadrages ; sous-dossier parcours pour la régression existante. Aucun changement des ressources eau/décor ni des anciens justificatifs. Pas de nouveau moteur ou dépendance. Aucun FPS appareil mesuré ; iPhone/Safari et clavier virtuel non exécutés. Les scènes étrangères restent les contextes simulés existants, pas de nouveau monde 3D produit.

## Publication et suite
Publication commune après les quatre lots, sur le projet autorisé après revue. Prochain lot : 04 Carnet/Aquarium/Aide. Réutiliser objectifs, destinations, onglets accessibles, dialogues et tokens ; conserver l’observation distincte des captures.

## Clôture commune publiée

Commit du lot : aa91fc8. Les quatre lots sont livrés en production 0.14.0 sur fishdex.fr après revue Vercel ; source applicative finale main d8bc998. Version et empreinte vérifiées sans token ni QA. Voir ../PUBLICATION.md et ../BILAN.md pour les IDs de déploiement, mesures, captures publiques identiques et résultats réels. Aucun blocage UI connu ; les essais physiques iPhone/Safari restent non exécutés. Prochaine tâche : essai propriétaire sur iPhone 14 Pro, gestes/clavier/rotation/audio/import-export et mesures FPS/chauffe, sans garantie issue de l’émulation.
