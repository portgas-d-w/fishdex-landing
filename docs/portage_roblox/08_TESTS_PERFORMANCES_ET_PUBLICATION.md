# 08 — Validation, performances et publication

## Tests significatifs

| Domaine | Cas à vérifier |
| --- | --- |
| Commandes | Tout le parcours sans souris ; déclencheur relâché après changement de contexte ; manette déconnectée ; retour de focus ; icônes du dispositif |
| Combat | Retour vers soi, sprint, virage, obstacles, mou significatif, surcharge, petit poisson récupéré, réception ratée |
| Méthodes | Cycle complet de chaque méthode ; lignes fixes/kit/moulinet/manuelles ; rivière et bateau disponibles pour les méthodes concernées |
| Atelier | Position réelle après zoom ; compatible/incompatible ; réservation ; annuler ; recharger ; changer méthode ; casse à plusieurs endroits |
| Économie | Solde insuffisant ; double achat ; double récompense ; kit non revendable ; ressources dev interdites en profil normal |
| Progression | Niveau seul, quête seule, aucun ; exercice prêté ; récompense une fois ; ancien droit si import ; variante par maîtrise |
| Sauvegarde | Reconnexion ; chargement en erreur ; arrêt serveur ; sessions concurrentes ; migration de version ; carnet/favoris/recettes préservés |
| UI | Focus partout ; retour au bon élément ; pages longues ; fiche désactivée ; texte depuis canapé ; recherche facultative |
| Assets | Lecture des IDs dans jeu publié ; textures/animations/droits ; piscine de FX nettoyée ; ouverture/fermeture aquarium répétée |
| Réseau | Délai et jitter simulés, faible FPS, messages doublés ; récompenses validées sans contrôle client arbitraire |

Tester logique, intégration et parcours réellement manipulables. Les tests doivent détecter des pertes, duplications ou erreurs de contrôle, pas simplement recopier un tableau de configuration. Les tests automatisés ne prouvent pas que le combat est agréable.

## Matrice matérielle

- Studio : tests moteur rapides, émulateurs de manette et taille d'écran.
- PC avec une vraie manette : ergonomie, caméra, interfaces et captures.
- PS5 réelle : objectif principal dès qu'un appareil est disponible ; compléter Xbox si accessible.
- iPhone 14 Pro réel : compatibilité secondaire, commandes tactiles et profil de rendu réduit.

Ne pas déclarer Xbox validé uniquement parce que PS5 fonctionne, ni PS5 validé parce que le PC utilise une DualSense. Studio sert aux rapports et contrôles, mais ne reproduit pas fidèlement les performances/mémoire d'un téléphone. Voir S11/S12.

## Objectifs de performance proposés

Viser 60 FPS sur console récente dans le spot et le combat ordinaires ; fournir un profil graphique moins coûteux si les mesures montrent une limite. Sur mobile secondaire, viser 30 FPS stables. Ce sont des cibles de projet, pas une garantie ou une demande de changer le cap Roblox par une API supposée.

Rapporter appareil, version client, build, profil, résolution/viewport observé, moyenne et percentiles de temps de frame si disponibles, pics, mémoire, temps d'entrée, ressources et réseau. Mesurer exploration, combat chargé, atelier, collection et aquarium, puis dix minutes de changements de scènes. Une moyenne de FPS seule peut masquer des saccades.

Le PC du propriétaire est puissant ; un bon résultat sur sa RX 7900 XTX n'est pas une preuve de performance console. Les anciens chiffres Chromium sont historiques. Les budgets se règlent à partir d'observations Roblox, pas d'un nombre universel de triangles copié sur Internet.

## Publication test et stable

File → Publish to Roblox envoie une version. L'audience se règle dans Creator Dashboard → Configure → Settings → Audience. Private est le point de départ. Pour des personnes disposant seulement de Playtest, vérifier Limited → Playtesters et les conditions requises. La documentation présente une formulation générale et une section Private plus précise ; appliquer les permissions réellement indiquées dans le Dashboard. Voir S09.

Au 5 octobre 2026, Public/Limited impose des conditions de compte, vérification d'âge et questionnaire. L'accès à tous les âges ajoute des conditions, notamment 2FA et abonnement éligible deux mois ou frais unique de 1 000 Robux par jeu, avec évaluation et remboursement conditionnel. Ce n'est pas un coût à chaque update. Recontrôler avant publication ; aucun paiement ni abonnement supplémentaire ne fait partie de l'exécution autonome.

Remplir honnêtement maturité, contenu et plateformes supportées. La compatibilité console est configurée seulement après vérification des entrées et parcours. Le portage est distribué dans Roblox, pas une soumission PS5 autonome. Ne pas promettre découverte, joueurs ou revenus automatiques.

Version test publiée → identifiant de build visible dans Réglages → nouveau serveur test → parcours enregistré. Les serveurs existants peuvent conserver l'ancienne version ; les redémarrer au besoin pour les essais. Ne pas redémarrer des serveurs publics pendant une vérification privée. Voir S10.

## Retour arrière et versionnement

Pour chaque version stable, conserver commit, scène, IDs d'assets, configuration et schemaVersion. Un retour à l'ancien code doit rester compatible avec les données déjà écrites ; privilégier les migrations additives au début. Restaurer le code seul ne restaure pas une sauvegarde utilisateur ni un asset supprimé.

La sortie publique est préparée : build stable privé, recette, checklist de contenu, captures, icône/description, conditions d'audience, limites connues et plan de rollback. Le propriétaire décide l'ouverture publique et toute dépense à partir de cette version concrète. Le développement et les tests privés continuent sans attendre cette décision finale.
