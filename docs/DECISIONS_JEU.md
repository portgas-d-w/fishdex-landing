# Décisions de gameplay — 1 octobre 2026

- Mission autonome explicite prioritaire sur l’ancien backlog : économie virtuelle, aquarium et trois familles de pêche autorisés, sans compte ni paiement.
- Lancer : delta du geste normalisé par viewport, portée 23 unités, eau jouable x ±11 et z 1,5–22. Le bouton conserve un lancer accessible rapide. Les habitats dérivent des coordonnées.
- Combat : coordonnées de poisson causent le tracé du fil ; départs déterministes par espèce, amortissement et récupération par orientation et équipement ; avertissement avant casse (0,8 s à tension maximale), décrochage après 4 s de mou. Capture à proximité sous tension contrôlée.
- Catalogue : 96 fiches statiques retrouvées, 59 groupes par binôme scientifique, pas 92 espèces biologiques vérifiées. Les seeds ne sont jamais exécutés, aucune base FishDex n’est consultée. Les variétés prévues ne sont pas capturables.
- Poids : W = a × L^b, L en cm, W en grammes ; coefficients récupérés dans la migration FishDex 029 (perche : coefficient Perca fluviatilis). Paramètres de gameplay, pas mesure scientifique d’un spécimen.
- Identité : cinq espèces initiales, forme commune, coloration naturelle ou reflets dorés (4 %), variante exceptionnelle Mirage (0,5 %). Les reflets dorés sont une teinte procédurale du jeu, pas une fausse identification de koï ou carpe miroir. Ces variétés restent prévues.
- Progression : photo de capture rémunérée une seule fois, même si stockage image impossible ; bonus distincts découverte et record. Idempotence par ID de capture, aucune récompense rejouée à l’import.
- Version 2 conserve la clé locale version 1 et migre les agrégats en records historiques, sans inventer des captures individuelles. Photos en Blob IndexedDB (480×240, ≤100 Ko chacune, 128 dernières), métadonnées dans la sauvegarde JSON. Export JSON conserve progression/identités ; les photos sont régénérables localement à l’ouverture d’un souvenir, elles ne sont pas transportées dans le JSON.
- Matériel : canne gratuite et appâts réutilisables ; aucune impasse sans monnaie. Trois cannes (0/70/160 écus, puissance 1/1,18/1,32), pas de barrière XP pour racheter le même contenu. Niveau = 1 + floor(sqrt(XP/80)). Badges liés à espèce, contrôle, méthode et records.

À revoir après test propriétaire : sensibilité des gestes, lisibilité du fil, plaisir du combat, vitesse de progression et couleurs provisoires. Safari/iPhone 14 Pro réel non mesuré.
