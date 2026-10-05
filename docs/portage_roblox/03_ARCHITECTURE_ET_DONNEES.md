# 03 — Architecture, données et réseau

## Règle structurante

La préparation, les capacités du matériel, la présentation, la simulation de combat et les récompenses utilisent les mêmes catalogues et unités. Pas de montage purement décoratif ni de poissons définis différemment dans la boutique, le FishDex et le combat.

Séparer : RodCapabilities ; MethodDefinition ; RigGraph ; SpeciesProfile ; AppearanceDefinition ; Habitat/Spot ; CombatState ; Inventory ; Quest/Mastery/Unlock ; CaptureRecord ; PlayerProfile. Les noms de modules sont indicatifs. Un poisson biologique, une apparence et un spécimen capturé ont des identifiants différents.

## Répartition client/serveur

| Client réactif | Serveur responsable |
| --- | --- |
| Lecture des sticks et gâchettes ; contextes d'entrée | Validation des actions, séquences, permissions et cadence |
| Caméra, animations canne, fil visuel et sons | État de session, simulation/règles déterminantes du combat |
| Présentation locale interpolée du poisson et effets | Sélection plausible de la rencontre et fin de capture |
| Prévisualisation de montage | Compatibilité finale, réservation/consommation et perte de stock |
| Fiches, descriptions et progression affichée | XP, argent, quêtes, collection et sauvegarde |

Le client envoie une intention bornée, pas « j'ai capturé une carpe de 30 kg » ou « ajoute 10 000 pièces ». Le serveur valide IDs, état de pêche, temps, distance et valeurs finies. Limiter fréquence et charge des messages ; rejeter doublons/récompenses rejouées. Voir S07.

La canne réagit immédiatement localement. Synchroniser des états de simulation, interpoler les retours et corriger sans sauts brutaux. Ne pas diffuser chaque image, chaque sommet de fil ou chaque particule. La cadence fixe, la fréquence réseau et les tolérances seront choisies après mesure ; elles ne dépendent pas du nombre de frames rendu. Tester jitter, faible FPS et pertes transitoires sans fausse casse.

## Contrôleurs de fond

Quatre systèmes : ligne fixe ; moulinet ; kit/élastique/grande canne ; ligne récupérée à la main avec moulinet éventuel. Le contrôleur provient des capacités physiques de l'ensemble. La méthode détermine surtout présentation et lecture de touche. La qualité du matériel change les marges, pas la famille de gameplay.

Un même poisson peut mordre sur plusieurs méthodes plausibles. Le profil de spot, la couche, la taille de l'appât, sa présentation et les préférences de l'espèce influencent la probabilité. Un poisson ne s'affiche pas systématiquement parce que le joueur a équipé une canne au même nom.

## États de session

Explorer → préparer/choisir spot → viser/déposer → ligne présentée → touche → ferré → combat → réception → résultat → prêt. Les sorties annulation, casse, décrochage et déconnexion sont traitées. La touche n'implique pas toujours un ferrage identique : montage et armement déterminent la transition.

Préparer UI/atelier ne reçoit pas simultanément les actions de lancer. Les menus solo peuvent suspendre proprement la simulation de la session selon les règles existantes ; ouvrir un menu, débrancher la manette ou reconnecter ne réinitialise pas la tension ni ne génère de récompense. Le système doit avoir une politique explicite de pause et de déconnexion.

## Inventaire et transactions

L'atelier édite un brouillon. Ajouter réserve le stock ; annuler le libère ; appliquer valide et consomme une fois. Repositionner une pièce déjà équipée ne la duplique pas. Toute consommation, achat, perte et récompense a une transition atomique et un identifiant d'opération pour l'idempotence.

Le point de rupture et le graphe de montage décident des composants perdus. Canne, moulinet et équipement de réception restent possédés. Un kit permanent non revendable permet de reprendre avec zéro argent. Les recettes favorites mémorisent réglages et IDs ; leur remontage exige le stock réel, sans achat silencieux.

## Sauvegardes Roblox

Profils versionnés par Roblox UserId, avec schemaVersion et migrations explicites. Enregistrer XP, droits, monnaie de jeu, stock, quêtes, maîtrise, captures, apparences découvertes, cinq favoris et recettes. Ne pas conserver uniquement la dernière prise ou seulement le niveau affiché.

Chargement, concurrence entre sessions, autosave et arrêt serveur doivent être gérés. Si le chargement échoue, ne pas enregistrer un profil neuf par-dessus l'ancien ; proposer attente/réessai ou session de test clairement non persistante. Utiliser mises à jour transactionnelles et protection contre deux écrivains du même profil. Limiter la taille du carnet et paginer/archiver les historiques si nécessaire sans tout charger au démarrage.

La version de test est une autre expérience, avec mode dev validé côté serveur pour une allowlist du propriétaire. Trois modes : progression normale neuve ; progression accélérée de test ; bac à sable illimité. Un simple bouton local ou attribut client ne donne pas les privilèges dev. Le mode est stocké explicitement ; captures forcées et ressources illimitées ne vont pas dans le profil normal.

## Photo du spécimen

Conserver le sens du système : une prise est présentée et « photographiée », puis rapporte selon les règles existantes. La fiche du carnet peut être une mise en scène locale reproductible du modèle, associée à des métadonnées sauvegardées. Ne pas supposer que chaque prise peut automatiquement uploader une nouvelle image personnalisée sur Roblox. Auditer les API réellement disponibles avant de promettre une galerie d'images générées côté serveur. Le prix se calcule sur le spécimen validé, pas sur un fichier image client.
