# Relais — lot 01 Matériel et boutique

4 octobre 2026 · Codex · branche codex/refonte-ui · départ 59d63c8.
Statut : implémenté et contrôlé localement. Publication commune après les quatre lots, conformément à la demande actuelle.

Ma canne : illustration sans moulinet au coup, usages/présentation/réserve, réception séparée. Techniques regroupées ; toutes consultables, seules les compatibles sélectionnables. Montage : schéma léger, composants essentiels, graphique facultatif, application immédiate expliquée. Sac : familles, recherche, seuils historiques de stock faible, kit gratuit replié sans fusion des IDs, unités pluralisées. Ensembles : consultation, renommage, suppression annulable tant que le panneau reste ouvert, secours compatible explicite en cas de manque ; original conservé. Boutique : recherche et vues catalogue/disponible/équipement, prix et quantités, causes de verrou, lien progression, attente de confirmation. Documentation de conception repliée dans un espace identifié.

Socle : src/ui/presentation.ts et presentation.css ; quantité, état vide, familles, compatibilité issue des slots, causes issues des services, regroupement et remplacement des illustrations en erreur. Tokens déjà corrects conservés. Aucun second rendu 3D. Dialogues natifs : seule la couche supérieure accepte le focus et les interactions ; une fiche de composant possède désormais son propre dialogue et retrouve le sélecteur inchangé (scroll/focus compris). Conserver les hooks ScreenHooks et les IDs existants.

Données : schéma v7 et IDs conservés, aucune migration. Consultation sans débit ; modifications enregistrées immédiatement ; engagement au lancer inchangé. Aucun changement d’eau, d’assets de carte ou de règle économique. Le conseil conserve la recette et propose explicitement son kit gratuit, sans achat automatique. Les esches indiquent le régime et les découvertes éligibles calculées par le filtre réel, jamais les poissons cachés.

Contrôles : Node 24.15.0, npm ci (0 vulnérabilité), npm run check : TypeScript, 205/205 tests et build passent. Playwright ui-refonte + tackle : 12/12 scénarios desktop/mobile passent (achat 2 lots avec solde/stock persistés, réparation, ensemble incomplet, réserve engagée/rechargée sans duplication, retour esche, consultation sans consommation, recherche vide). Débordement d’en-tête à 320 px détecté et corrigé. Dispositions 320/390/430 px, paysage 844×390 et bureau 1440×900. Captures docs/apercus/refonte-ui/avant et 01-apres ; état vierge et état avancé matériel/monnaie. Contrastes calculés texte/surface 12,79:1, secondaire 7,39:1, action 7,73:1, accent 8,10:1, attention 8,61:1.

Limites : aucun iPhone réel, Safari, clavier virtuel iOS ou performance GPU sur appareil contrôlé. Avancé de ce lot = droits/matériel/monnaie ; les souvenirs seront exercés au lot 02/04. Pas de nouveau benchmark eau demandé pour une refonte de menus ; avertissement de taille du bundle existant conservé. Recette 01-F : bouton de confirmation désactivé synchroniquement ; contrôles des transactions du moteur dans npm test, double toucher physique à tester sur appareil. Erreurs d’image disposent d’un libellé de remplacement. Catalogue futur demeure une documentation sans faux achat.

À réutiliser : fonctions presentation, styles de section, dialogue de détail séparé, contrats de retour natifs. Lots 02 puis 03 puis 04 ; publication finale sur le projet confirmé fishdex-landing avec préproduction et vérification publique.

## Clôture commune publiée

Commit du lot : d4d2d95. Les quatre lots sont livrés en production 0.14.0 sur fishdex.fr après revue Vercel ; source applicative finale main d8bc998. Version et empreinte vérifiées sans token ni QA. Voir ../PUBLICATION.md et ../BILAN.md pour les IDs de déploiement, mesures, captures publiques identiques et résultats réels. Aucun blocage UI connu ; les essais physiques iPhone/Safari restent non exécutés. Prochaine tâche : essai propriétaire sur iPhone 14 Pro, gestes/clavier/rotation/audio/import-export et mesures FPS/chauffe, sans garantie issue de l’émulation.

## Complément boutique par rayons — 4octobre2026,0.14.1

La demande actuelle remplace la présentation du catalogue par six catégories compactes et un rayon aquarium distinct.142articles, grille deux colonnes, fiches/quantités, recherche générale, filtre technique/recette, retours complets ; Matériel et services économiques restent ceux du lot01. Check214/214,16scénarios ciblés et10régressions passent. Rapport et procédure : ../../BOUTIQUE_RAYONS.md. Publication en cours de revue ; essais iPhone physiques non exécutés.
