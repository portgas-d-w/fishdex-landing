# Relais — lot 04 terminé localement

4 octobre 2026 · Codex · branche codex/refonte-ui · départ aa91fc8 · version 0.14.0.

## Écrans et contrats
Carnet : onglets Prises/Observations, recherche, vues et tri indépendants, filtres combinés et retirables, métadonnées présentes seulement, illustrations réservées puis photos locales, état vierge distinct du résultat vide, anciennes données en volet secondaire. Fiche : événements enregistrés, date/poste/technique, favori réel, lien FishDex ; secours illustré si aperçu 3D indisponible. Une photo de nouvelle prise et un aperçu régénéré sont explicitement distingués.

Aquarium : une seule scène existante, bassin central ; panneaux Mes poissons et Décorer. Cinq individus identifiables par longueur/poids/date, cinq emplacements, sélection par vignettes paginées avec sélecteur compact secondaire, revalidation des transactions existantes. Sixième individu : remplacement explicitement choisi ; retrait/remplacement ne supprime aucune prise. Décor immédiat annoncé, possession/prix/déblocage visibles, achat séparé et retour au décor. Erreur WebGL/modèle : réessai et favoris 2D conservés. Scène suspendue sous les panneaux puis reprise ; moteur libéré à la fermeture, aperçu de capture désormais libéré aussi.

Réglages séparés : audio Marche/Arrêt, graphismes/eau avec compromis réels, côté/un doigt/repère/conseils, sauvegarde locale et transfert. Import validé avant mutation, remplacement confirmé avec conséquences ; invalide et annulation préservent la partie. Sauvegarde v7 et profils normaux/TEST inchangés. Ancien export et récupération conservés. Aide : cinq entrées courtes, gestes SVG, 22 leçons dérivées des profils réels, côté actuel et lien d’aide d’une pièce avec retour/focus. Espace de développement distinct, accessible dans Aide ; Mode test public conservé.

Accueil : FishDex principal, quatre groupes d’intentions avec accès directs, prochaine étape et informations utiles ; marque Nouveau issue des découvertes réelles de session seulement. Rendu eau/décor et systèmes de pêche conservés.

## Fichiers
src/ui/memories.ts crée les panneaux et réorganise les contrôles existants. main.ts raccorde photos, erreurs, navigation et cycles de vie ; structure.ts adapte les filtres et remplacement ; tackle.ts ajoute l’aide de pièce ; observations.ts réutilise les illustrations ; fishdex.ts reflète les découvertes non lues dans l’accueil. presentation.css harmonise tous les contrôles. Seul sélecteur de recherche ajouté dans src/game/structure.ts ; aucun seuil ou gain changé. Version package/lock 0.14.0, aucune dépendance ajoutée.

## Contrôles exécutés
npm run check final : TypeScript, 211/211 tests et build passent. Série transversale 32/32 Chromium mobile/bureau ; après finitions visuelles, 18/18 ciblés ; après dernier accès TEST/texte photo, 4/4 profil TEST et assets/eau (dix changements de poste, ressources partagées et qualités) passent. Deux échecs initiaux du nouveau contrôle de moteur ont révélé l’aperçu gardé en mémoire : fermeture corrigée, retour à un moteur vérifié. Une assertion de recherche corrigée pour sa fixture historique au flotteur.

04-A/B : vide, recherche, vues, tri, prises et observation contrôlés. 04-C : parser/migrations existants et explication secondaire, pas de capture fictive. 04-D/E/F : six individus dont cinq gardons, remplacement/retrait/recharge et carnet intact. 04-G : prix, verrouillage/non-possession, achat de plantes puis retour et persistance. 04-H : WebGL désactivé, réessai, cinq favoris 2D ; modèle Sandre bloqué. 04-I : clavier/contrôles HTML, réduction des mouvements et persistance ; clavier virtuel physique non exécuté. 04-J : export, import valide confirmé/annulé et version invalide sans mutation ; récupération corrompue contrôlée. 04-K : 22 guides, Bolognaise spécifique, côté droit/un doigt, aide ver et restauration du focus. 04-L : parcours des lots 01–03 rejoués ; liens carnet/aquarium/boutique/aide et sous-fiches contrôlés.

Captures : avant, public-avant (profils vierge et trois spécimens/une favorite), 04-apres ; mêmes formats 1440×900 et 390×844, plus 320/430/paysage. Captures et erreurs inspectées, contrôles blancs et position des filtres corrigés. Aucune vérification réelle iPhone/Safari, clavier virtuel, safe areas physiques, chauffe ou fluidité téléphone. Aucun FPS garanti. Le bassin conserve ses assets et nage procédurale existants.

## Publication et suite
Identité confirmée par API et .vercel : prj_nOUkHjJpybWCDpBHnEh2TTWKYK6x, team_5BFwQHD6LvVeOSgmKAj7QoTv, portgas-d-w/fishdex-landing, Vite/Node24, main. Revue puis production commune à réaliser maintenant ; preuves définitives dans ../PUBLICATION.md. Après publication : essais physiques iPhone 14 Pro, pas de fonctionnalité UI laissée bloquée connue.
