#!/usr/bin/env python3
"""Reconstruit les fichiers dérivés depuis les recherches locales. Python 3 standard uniquement."""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
DOCS = ROOT / 'docs'
DATA.mkdir(exist_ok=True)
DOCS.mkdir(exist_ok=True)
DATE = '2026-10-02'
ATTRS = ['burst', 'endurance', 'agility', 'head_shakes', 'cover_seeking', 'slack_pressure']

def split(value):
    return [v.strip() for v in value.split(',') if v.strip()]

def read(name):
    with (ROOT / 'recherche' / f'{name}.tsv').open(encoding='utf-8', newline='') as f:
        rows = list(csv.DictReader(f, delimiter='|'))
    assert all(None not in r and all(v is not None for v in r.values()) for r in rows), name
    return rows

def write(name, entries, **extra):
    value = dict(schema_version='1.0.0', research_date=DATE,
                 implementation_status='catalogued_not_verified_in_game',
                 numerical_parameters_origin='provisional_game_design_not_biological_measurement',
                 **extra, entries=entries)
    (DATA / f'{name}.json').write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return value

sources = read('sources')
for s in sources:
    s['consulted_on'] = DATE
    s['access_type'] = 'web_search_or_open'
write('sources', sources, reference_policy='Une référence peut documenter une famille, sans valider tous les détails de chaque recette. Lire coverage et research_status.')
SOURCE = {s['id']: s for s in sources}

def links(ids):
    return ', '.join(f"[{SOURCE[s]['publisher']} — {s}]({SOURCE[s]['url']})" for s in ids)

methods = read('methodes')
for m in methods:
    for k in ['rod_types', 'required_slots', 'source_ids', 'context']:
        m[k] = split(m[k])
    m['requires_reel'] = m['requires_reel'] == 'true'
    m['core_slots'] = ['rod'] + [s for s in m['required_slots'] if s in ['reel','elastic','main_line','backing','fly_line']]
    m['required_slots_scope'] = 'suggested_default_layout_recipe_overrides_terminal_slots'
    m['availability'] = dict(catalogued=True, playable=False, purchase_enabled=False, reason='Vérifier les systèmes et les lieux du dépôt avant activation.')
    m['kind'] = 'approach' if m['family'] == 'approche' else 'method'
write('methodes', methods, note='Les approches ultraléger, stalking et carpodrome peuvent réutiliser une méthode moteur ; éviter de dupliquer ses règles.')

rigs = read('montages')
for r in rigs:
    for k in ['method_ids', 'required_slots', 'source_ids']:
        r[k] = split(r[k])
    r['playable'] = False
    r['game_use_origin'] = 'design_proposal'
    r['method_slot_overrides'] = {}
    if r['id'] == 'nymphe':
        r['method_slot_overrides']['nymphe_fil'] = ['main_line', 'indicator', 'leader', 'tippet', 'fly']
    # Les composants de la méthode (canne, moulinet, etc.) s'ajoutent aux slots propres à la recette.
    r['slot_resolution'] = 'method_core_plus_recipe_with_overrides'
    r['optional_slots'] = []
    if 'carpe' in r['method_ids'] and 'pva' not in r['required_slots']:
        r['optional_slots'].append('pva')
    if 'leurre' in r['method_ids'] and 'snap' not in r['required_slots'] and r['id'] not in ['texas','carolina','drop_shot','wacky','neko','tokyo']:
        r['optional_slots'].append('snap')
    r['constraints_origin'] = 'design_validation_to_complete_per_recipe'
    r['reference_scope'] = 'family_or_recipe_see_research_status'
write('montages', rigs)

baits = read('appats')
for b in baits:
    for k in ['presentation_tags', 'diet_tags', 'method_ids', 'source_ids']:
        b[k] = split(b[k])
    b['playable'] = False
    b['price_coins'] = None
    b['reference_scope'] = 'family_or_food_group_not_a_product_specification'
    b['game_proposal_origin'] = 'design_proposal'
    b['properties_to_define'] = ['size_mm', 'portion_mass_g', 'density_relative_to_water', 'hook_retention', 'decay_seconds']
    if b['family'].startswith('leurre') or b['family'] in ['mouche', 'artificiel']:
        b['properties_to_define'] += ['integrated_hook', 'action_profile', 'immersion_profile']
write('appats_leurres_amorces', baits,
      note='Les esches naturelles/particules sont des consommables par portion ; artificiels réutilisables jusqu’à perte ou usure explicitement implémentée. Une amorce ne se choisit pas comme esche.')

fish = read('poissons')
for f in fish:
    for k in ['asset_stems', 'habitats', 'diet_tags', 'bait_ids', 'method_ids', 'source_ids']:
        f[k] = split(f[k])
    f['attributes'] = dict(zip(ATTRS, map(float, f['attributes'].split(','))))
    f['attribute_origin'] = 'provisional_game_balance'
    f['gameplay_is_proposal'] = True
    f['identity_status'] = 'unresolved' if f['discovery_mode']=='identity_pending' else 'source_taxon_candidate_needs_app_match'
    f['candidate_bait_affinities'] = [dict(bait_id=b, affinity=0.65, origin='game_proposal_not_observed_bite_probability') for b in f['bait_ids']]
    f['combat_variation'] = dict(individual_variation=True, weights=None, depends_on=['body_size', 'temperature', 'current', 'health_and_fatigue', 'rig_and_rod'])
    f['playable'] = False
    f['activation_requirement'] = 'Taxon confirmé, modèle du pack disponible, habitat présent, mécanique et affinités testées ; capture seulement si mode admissible.'
    f['feeding_rules'] = []
    if f['id'] in ['alose-feinte', 'grande-alose', 'saumon-atlantique']:
        f['feeding_rules'].append(dict(stage='adult_reproductive_return', hunger_bite_rate=0, reaction_to_artificial='separate_specialist_system_needs_validation'))
    if f['id'] == 'lamproie-de-planer':
        f['feeding_rules'] += [dict(stage='larva', feeding='filtering'), dict(stage='adult', hunger_bite_rate=0)]
    if f['id'] == 'lamproie-fluviatile':
        f['feeding_rules'].append(dict(stage='adult', feeding='parasitic_not_standard_bait_search'))
    if f['id'] in ['amour-argente', 'amour-marbre']:
        f['feeding_rules'].append(dict(stage='adult', feeding='filtering', standard_hook_bait_system=False))
    if f['id'] == 'amour-blanc':
        f['feeding_rules'].append(dict(stage='juvenile_vs_adult', rule='Ne pas appliquer le régime végétal adulte à tous les juvéniles.'))
    if f['id'] == 'esturgeon-siberien':
        f['feeding_rules'].append(dict(stage='managed_pond', rule='Pellet d’élevage lié au contexte géré, pas préférence sauvage automatique.'))
write('poissons', fish, attribute_order=ATTRS,
      note='Les profils sont des espèces/complexes et quelques identités en attente. Une apparence ou un record ne crée pas automatiquement une nouvelle espèce. Les habitats et régimes sont indicatifs ; les actions de combat et affinités sont proposées.')

# Les familles sont originales au jeu. Les marques consultées ne sont pas reproduites comme produits/licences.
# variants = exemples de tailles ou configurations, pas spécifications commerciales relevées.
FAMILIES_TEXT = '''id|name|slot|method_ids|variants|dimension|source_ids|behavior
canne_polyvalente|Canne polyvalente|rod|anglaise,fond,feeder,stalking,leurre|2.4,2.7,3.0|length_m|tech_coup|Un seul blank, plusieurs approches compatibles ; puissance à vérifier par recette.
canne_telescopique|Canne télescopique de coup|rod|coup|3,4,5|length_m|tech_coup|Sans moulinet ; portée bornée par canne et ligne.
canne_grande|Grande canne à emmanchements|rod|grande_canne,carpodrome|7,9,11|length_m|tech_elastic|Élastique remplace le frein d'un moulinet.
canne_match|Canne anglaise|rod|anglaise,surface,stalking,bombette|3.6,3.9,4.2|length_m|tech_anglaise_fixe|Portée au waggler ; plage de lancer déclarée séparément.
canne_bolo|Canne bolognaise|rod|bolognaise|5,6,7|length_m|tech_bolo|Contrôle de la dérive avec anneaux.
canne_fond|Canne de fond|rod|fond,carpe|2.7,3.0,3.3|length_m|tech_coup|Tenue au posé et amortissement.
canne_feeder|Canne feeder|rod|feeder,method_feeder|3.0,3.3,3.6|length_m|tech_feeder|Scion sensible et plage de masse au lancer.
canne_carpe|Canne carpe|rod|carpe,stalking,surface,fond|3.0,3.6,3.9|length_m|tech_carp_rigs|Courbe de test et masse de lancer distinctes de poids du poisson.
canne_spinning|Canne spinning|rod|leurre,ultraleger,verticale,mort_manie|1.8,2.1,2.4|length_m|tech_soft_rigs|Moulinet à tambour fixe.
canne_casting|Canne casting|rod|leurre,verticale,mort_manie|1.9,2.1,2.3|length_m|tech_soft_rigs|Moulinet casting et commandes futures adaptées.
canne_toc|Canne au toc|rod|toc|3.3,3.6,3.9|length_m|tech_toc|Dérive et gestion du contact avec le fil.
canne_mouche|Canne à mouche|rod|mouche,nymphe_fil|2.4,2.7,3.0|length_m|tech_fly|Numéro de soie et action à définir séparément.
canne_nymphe|Canne à nymphe|rod|nymphe_fil|3.0,3.3,3.6|length_m|tech_fly|Ligne et dérive propres à la recette.
canne_silure|Canne silure|rod|clonk,fond|2.4,2.7,3.0|length_m|bio_silure|Ensemble fort à activer après combats des grands poissons.
canne_gambe|Canne gambe|rod|gambe|1.8,2.1,2.4|length_m|bio_coregone|Catalogue spécialiste futur.
canne_traine|Canne de traîne|rod|traine|1.8,2.1,2.4|length_m|tech_lures|Usage bateau futur.
moulinet_fixe|Moulinet à tambour fixe|reel|anglaise,bolognaise,fond,feeder,method_feeder,carpe,stalking,surface,leurre,verticale,toc,bombette,ultraleger,gambe,mort_manie|2000,3000,4000|size_code|tech_coup|Taille commerciale abstraite ; frein en newtons et récupération réelle à définir.
moulinet_casting|Moulinet casting|reel|leurre,verticale,mort_manie|100,200,300|size_code|tech_soft_rigs|Compatibilité canne casting explicite.
moulinet_carpe|Moulinet carpe|reel|carpe,fond,stalking,surface|4000,5000,6000|size_code|tech_carp_rigs|Capacité de ligne et frein séparés du code de taille.
moulinet_mouche|Moulinet mouche|reel|mouche,nymphe_fil|3,5,7|line_class_example|tech_fly|Classe de soie proposée ; capacité à définir.
moulinet_silure|Moulinet fort|reel|fond,clonk,traine|5000,6000,8000|size_code|bio_silure|Limites de frein à équilibrer explicitement.
nylon|Nylon de corps de ligne|main_line|coup,grande_canne,anglaise,bolognaise,fond,feeder,method_feeder,carpe,stalking,surface,leurre,toc,bombette,carpodrome|0.14,0.18,0.22,0.28,0.35|diameter_mm|tech_coup|Élasticité et immersion ; diamètre ne fixe pas universellement la résistance.
tresse|Tresse de corps de ligne|main_line|leurre,verticale,carpe,clonk,traine,feeder,mort_manie|0.10,0.14,0.18,0.24,0.30|diameter_mm|tech_noeuds|Faible élasticité proposée ; raccord et abrasion dépendent du produit.
fluorocarbone|Fluorocarbone terminal|leader|leurre,verticale,toc,fond,anglaise,carpe,bombette,mort_manie|0.16,0.20,0.25,0.35,0.50|diameter_mm|tech_noeuds|Rigidité et immersion ; jamais protection universelle contre dents du brochet.
bas_nylon|Bas de ligne nylon|leader|coup,grande_canne,anglaise,bolognaise,fond,feeder,method_feeder,toc,carpodrome|0.10,0.14,0.18,0.22,0.28|diameter_mm|tech_coup|Section consommable en cas de rupture.
bas_tresse|Terminal souple tressé|leader|carpe,clonk,fond|0.20,0.25,0.30|diameter_mm|tech_carp_rigs|Souplesse et résistance déclarées séparément.
bas_gaine|Terminal gainé|leader|carpe|0.25,0.30,0.35|diameter_mm|tech_carp_rigs|Rigidité réglée par sections dénudées dans une recette validée.
bas_acier|Avançon métallique|leader|leurre,mort_manie,fond|20,30,40|length_cm|tech_lures|Protection contre coupe à documenter ; encombrement/discrétion compromis.
bas_titane|Avançon titane|leader|leurre,mort_manie|20,30,40|length_cm|tech_lures|Famille future, ne pas attribuer invincibilité.
soie_flot|Soie flottante|fly_line|mouche|3,5,7|line_class_example|tech_fly|Classe et densité différentes.
soie_inter|Soie intermédiaire|fly_line|mouche|3,5,7|line_class_example|tech_fly|Immersion lente, valeur spécifique à régler.
soie_plong|Soie plongeante|fly_line|mouche|5,7,9|line_class_example|tech_fly|Immersion plus rapide ; profondeur par simulation.
backing|Backing|backing|mouche|50,75,100|length_m|tech_fly|Réserve distincte de la soie.
pointe|Pointe de bas de ligne mouche|tippet|mouche,nymphe_fil,toc|0.12,0.16,0.20|diameter_mm|tech_fly|Section remplaçable du terminal.
flotteur_fusiforme|Flotteur fusiforme|float|coup,grande_canne,carpodrome|0.3,0.6,1.0|buoyancy_g|tech_coup|Portance et masse propre séparées.
flotteur_trapu|Flotteur trapu|float|coup,grande_canne,bolognaise,carpodrome|1,2,3|buoyancy_g|tech_coup,tech_bolo|Stabilité et sensibilité à équilibrer.
waggler|Waggler non préplombé|float|anglaise|2,4,6|buoyancy_g|tech_anglaise_fixe|Fixation par base et lest externe.
waggler_preplombe|Waggler préplombé|float|anglaise|3,5,8|buoyancy_g|tech_waggler|Masse interne doit être renseignée avant activation.
flotteur_coulissant|Flotteur coulissant|float|anglaise,bolognaise|2,4,6|buoyancy_g|tech_anglaise_coulissant|Stop et perle selon recette.
controleur_surface|Contrôleur de surface|float|surface,stalking|5,10,15|mass_g|tech_carp_rigs|Portée ; recette encore à documenter.
bombette_flot|Bombette flottante|bombette|bombette|10,15,20|mass_g|tech_bombette|Masse de lancer et flottabilité indépendantes.
bombette_inter|Bombette intermédiaire|bombette|bombette|10,15,20|mass_g|tech_bombette|Vitesse d'immersion à définir.
bombette_plong|Bombette plongeante|bombette|bombette|10,15,20|mass_g|tech_bombette|Immersion déclarée séparément du grammage.
plombs_fendus|Lests fendus|weight|coup,grande_canne,anglaise,bolognaise,toc,carpodrome|0.05,0.10,0.20,0.40|mass_g|tech_float_weights,tech_toc|Chaque lest a une position le long du fil.
olivette|Olivette percée|weight|coup,bolognaise,anglaise|0.5,1,2,4|mass_g|tech_anglaise_coulissant|Masse principale coulissante ou immobilisée selon recette.
plomb_poire|Lest poire|weight|fond,carpe|20,40,60,80|mass_g|tech_carp_rigs|Forme et substrat influencent tenue.
plomb_plat|Lest plat|weight|fond,carpe|30,50,70,90|mass_g|tech_carp_rigs|Tenue au fond et traînée à régler.
plomb_inline|Lest inline|weight|carpe|30,50,70,90|mass_g|tech_carp_rigs|Passage de ligne et système de libération explicites.
plomb_balle|Lest balle|weight|leurre|3,5,10,15|mass_g|tech_texas|Forme adaptée au montage Texas ou Carolina.
plomb_drop|Lest drop-shot|weight|leurre,ultraleger,verticale|3,5,10,15|mass_g|tech_drop_shot|Fixation de branche terminale distincte du leurre.
insert_neko|Insert de lest|nail_weight|leurre|0.5,1,2|mass_g|tech_soft_rigs|Famille prévue ; recette Neko à documenter.
cage_feeder|Cage feeder ouverte|feeder|feeder|20,30,45,60|mass_g|tech_feeder|Capacité d'amorce et masse pleine calculées séparément.
feeder_ferme|Feeder fermé|feeder|feeder|20,30,45|mass_g|tech_feeder|Contenu et trous conditionnent dispersion proposée.
feeder_method|Method feeder|feeder|method_feeder|20,30,45,60|mass_g|tech_feeder|Poids à vide plus amorce pour masse au lancer.
tete_ronde|Tête plombée ronde|jig_head|leurre,verticale,ultraleger|2,5,10,15|mass_g|tech_soft_rigs|Hameçon intégré à la tête, pas facturé une seconde fois.
tete_ned|Tête Ned|jig_head|leurre,ultraleger|1,3,5|mass_g|tech_ned|Face plate ; taille d'hameçon à déclarer.
jig_jupe|Jig à jupe|jig_head|leurre|5,10,15|mass_g|tech_lures|Armement intégré, trailer optionnel.
hamecon_fin|Hameçon fin sans ardillon|hook|coup,grande_canne,anglaise,bolognaise,feeder,toc,carpodrome|18,16,14,12|hook_size_label|tech_coup|Numéro non universel entre modèles ; ouverture réelle à définir.
hamecon_fond|Hameçon de fond sans ardillon|hook|fond,feeder,method_feeder,bombette|12,10,8,6|hook_size_label|tech_coup|Ouverture et force mécaniques distinctes.
hamecon_carpe|Hameçon carpe sans ardillon|hook|carpe,stalking,surface|8,6,4|hook_size_label|tech_carp_rigs|Forme de recette et équilibre avec l'esche.
hamecon_offset|Hameçon offset sans ardillon|hook|leurre|1,1/0,2/0,3/0|hook_size_label|tech_texas,tech_soft_rigs|Taille adaptée à l'épaisseur du souple.
hamecon_drop|Hameçon drop-shot sans ardillon|hook|leurre,ultraleger,verticale|8,6,4,2|hook_size_label|tech_drop_shot|Orientation sur le terminal.
hamecon_fort|Hameçon fort sans ardillon|hook|clonk,fond|1/0,3/0,5/0|hook_size_label|bio_silure|Résistance à déclarer, pas déduite du poids du poisson.
emerillon|Émerillon|swivel|anglaise,bolognaise,fond,feeder,carpe,leurre,bombette,mort_manie|petit,moyen,fort|variant_label|tech_noeuds|Connexion tournante ; résistance du raccord explicite.
agrafe|Agrafe|snap|leurre,verticale,ultraleger,traine|petite,moyenne,forte|variant_label|tech_noeuds|Forme et résistance influencent mobilité du leurre.
perle|Perle amortissante|bead|anglaise,fond,feeder,carpe,bombette|2,4,6|diameter_mm|tech_anglaise_coulissant|Protège un raccord selon montage, pas multiplicateur de résistance.
stop|Stop de ligne|stop|anglaise,bolognaise,carpe|petit,moyen,grand|variant_label|tech_anglaise_coulissant,tech_chod|Position explicite ; serrage et coulissement.
clip_plomb|Clip-plomb|lead_clip|carpe|leger,standard,fort|variant_label|tech_lead_clip|Seuil de libération à configurer après choix des connexions.
tube|Tube anti-emmêleur|tube|fond,feeder,carpe|10,20,30|length_cm|tech_feeder|Géométrie du montage et discrétion proposées.
potence|Potence feeder|boom|feeder|5,10,15|length_cm|tech_feeder_potence|Branche du lest ; casse localisable.
cheveu|Cheveu et stop-esche|hair|carpe,method_feeder|court,moyen,long|variant_label|tech_carp_rigs|Attaché au terminal ; perte suit le graphe réel.
elastique|Élastique de grande canne|elastic|grande_canne,carpodrome|fin,moyen,fort|variant_label|tech_elastic|Limite d'allongement et amortissement, pas moulinet obligatoire.
indicateur|Indicateur de dérive|indicator|toc,nymphe_fil|leger,visible,contrasté|variant_label|tech_toc|Aide visuelle sur la ligne, pas bouchon de combat.
sac_pva|Sac PVA|pva|carpe|petit,moyen,grand|variant_label|tech_pva|Consommable à dissolution, une seule unité par lancer validé.
filet_pva|Filet PVA|pva|carpe|fin,moyen,large|variant_label|tech_pva_mesh|Consommable par portion de filet, pas perte de tout le rouleau.
monture_mort|Monture à poisson mort|harness|mort_manie|petite,moyenne,grande|variant_label|tech_coup|Catalogue réservé jusqu'à validation des connexions.
tige_tokyo|Tige Tokyo|wire_arm|leurre|courte,moyenne,longue|variant_label|tech_tokyo|Branche de lest séparée de l'hameçon.
clonk|Clonk|clonk|clonk|petit,moyen,grand|variant_label|bio_silure|Accessoire hors fil ; pas perdu quand le terminal casse.
epuisette|Épuisette|landing|coup,grande_canne,anglaise,bolognaise,fond,feeder,carpe,leurre,toc,mouche|petite,moyenne,grande|variant_label|tech_coup|Limite de réception à définir ; hors graphe de rupture du fil.
tapis|Tapis de réception|landing|fond,feeder,carpe,leurre,clonk|compact,standard,specimen|variant_label|tech_carp_rigs|Accessoire de réception hors eau, conservé lors d'une casse.
pinces|Pinces de décrochage|tool|leurre,fond,carpe,mouche|courte,longue,renforcée|variant_label|tech_lures|Outil hors montage ; aucun bonus de touche.
fronde|Fronde d'amorçage|tool|coup,anglaise,carpe|proche,moyenne,lointaine|variant_label|tech_coup|Distribution d'amorce à implémenter plus tard.
support|Support de canne|tool|fond,feeder,carpe|simple,double,reglable|variant_label|tech_feeder|Usage au posé ; ne multiplie pas le nombre de cannes actives sans système dédié.
boite|Boîte de rangement|storage|coup,leurre,carpe|compacte,standard,grande|variant_label|tech_coup|Cosmétique / rangement ; pas de blocage artificiel du kit gratuit.
'''

families = list(csv.DictReader(FAMILIES_TEXT.splitlines(), delimiter='|'))
equipment = []
for f in families:
    f['method_ids'] = split(f['method_ids'])
    f['source_ids'] = split(f['source_ids'])
    values = split(f.pop('variants'))
    f['variant_count'] = len(values)
    f['reference_scope'] = 'generic_family_not_exact_item'
    f['research_status'] = 'design_examples_family_referenced'
    for index, v in enumerate(values, 1):
        try:
            numeric = float(v)
            if numeric.is_integer():
                numeric = int(numeric)
        except ValueError:
            numeric = v
        specs = {f['dimension']: numeric, 'declared_break_strength_N': None, 'mass_g': None}
        if f['dimension'] == 'mass_g':
            specs['mass_g'] = numeric
        if f['slot'] == 'rod':
            specs.update(casting_mass_range_g=None, bend_curve=None, line_system=None)
        if f['slot'] == 'reel':
            specs.update(max_drag_N=None, recovery_m_per_turn=None, capacity_m=None)
        if f['slot'] == 'float':
            specs.update(internal_ballast_g=None, buoyancy_g=specs.get('buoyancy_g'))
        display_unit = {'length_m':' m','length_cm':' cm','diameter_mm':' mm','mass_g':' g','buoyancy_g':' g de portance','hook_size_label':'','line_class_example':' (classe proposée)'}.get(f['dimension'],'')
        stock_unit = 'meter' if f['slot'] in ['main_line','fly_line','backing','tippet'] or f['id'] in ['fluorocarbone','bas_nylon','bas_tresse','bas_gaine','filet_pva'] else 'piece'
        equipment.append(dict(id=f"{f['id']}__{index:02d}", name=f"{f['name']} — {v}{display_unit}",
            family_id=f['id'], slot=f['slot'], method_ids=f['method_ids'], specs=specs,
            specification_origin='original_design_example_not_manufacturer_product',
            source_ids=f['source_ids'], price_coins=None, purchase_enabled=False,
            availability='catalogued', prototype=True, inventory_unit=stock_unit,
            loss_policy='detached_connected_component' if f['slot'] not in ['rod', 'reel', 'landing', 'tool', 'storage', 'clonk'] else 'not_lost_by_line_break',
            required_before_purchase=['physics_parameters', 'compatibility_validation', 'price_and_quantity', 'functional_use', 'tested_presentation']))
write('familles_materiel', families, note='Familles originales pour le jeu ; exemples de tailles, aucune spécification commerciale ni prix réel. Exiger les fiches exactes pour une reproduction réaliste de produits.')
write('equipements', equipment, note='Les exemples sont réservés au catalogue. Compléter résistances et physique avant activation. Les futurs produits ont une fiche, mais pas de bouton d’achat trompeur.')

SLOTS = {
    'rod':'Canne', 'reel':'Moulinet', 'elastic':'Élastique', 'main_line':'Corps de ligne',
    'backing':'Backing', 'fly_line':'Soie', 'leader':'Bas de ligne', 'tippet':'Pointe',
    'float':'Flotteur', 'weight':'Lest / plombée', 'feeder':'Feeder', 'bombette':'Bombette',
    'hook':'Hameçon', 'bait':'Esche', 'lure':'Leurre', 'fly':'Mouche', 'groundbait':'Amorce',
    'swivel':'Émerillon', 'snap':'Agrafe', 'stop':'Stop', 'bead':'Perle', 'lead_clip':'Clip-plomb',
    'tube':'Tube', 'boom':'Potence', 'hair':'Cheveu', 'pva':'PVA', 'indicator':'Indicateur',
    'jig_head':'Tête lestée / jig', 'nail_weight':'Insert de lest', 'wire_arm':'Tige',
    'harness':'Monture', 'clonk':'Clonk', 'landing':'Réception', 'tool':'Outil', 'storage':'Rangement'}
write('slots', [dict(id=k, name=v) for k,v in SLOTS.items()])

# Ces exemples servent à la spécification ; ce script ne modifie aucune sauvegarde du jeu.
starter = dict(id='kit_initiation', name='Kit d’initiation toujours disponible', method_id='anglaise', rig_id='waggler_fixe',
    status='design_to_reconcile_with_current_starter_kit', allows_resale=False, infinite_source=True,
    components=[dict(id='starter_'+slot, slot=slot, ownership='starter_unlimited', quantity_policy='virtual_no_depletion')
                for slot in ['rod','reel','main_line','float','weight','leader','hook','bait']],
    kit_bait='asticot', free_components_have_no_resale_value=True,
    mixing_paid_and_free='Les objets payants réellement perdus le restent ; seul le composant gratuit est renouvelé.')
write('kit_gratuit', [starter])

write('graphe_montage_exemples', [
    dict(id='float_serial', rig_id='waggler_fixe', semantics='graph_example_requires_port_and_position_model',
         serial_nodes=['rod','reel','main_line','leader','hook','bait'],
         attachments=[dict(component='float', carrier='main_line', position='variable'), dict(component='weight', carrier='main_line', position='array')],
         scenarios=[dict(break_at='leader', outcome='Hook, bait et segment détaché ; flotteur et plombs fixés au corps de ligne conservés.'),
                    dict(break_at='main_line_above_float', outcome='Portion terminale et composants attachés en aval perdus ; canne, moulinet et ligne restante conservés.')]),
    dict(id='drop_shot_branch', rig_id='drop_shot', semantics='hook_on_leader_and_weight_below',
         connections=[['main_line','leader_top'],['leader_top','hook'],['hook','lure'],['leader_top','leader_bottom'],['leader_bottom','weight']],
         scenarios=[dict(break_at='leader_bottom', outcome='Lest et segment aval perdus ; hameçon et leurre conservés si raccord supérieur intact.')]),
    dict(id='lead_clip_release', rig_id='carpe_clip', semantics='release_threshold_on_weight_branch',
         scenarios=[dict(break_at='release_weight', outcome='Plomb détaché seulement ; terminal intact si aucune autre rupture.')])
], note='Un graphe binaire aval n’est pas suffisant pour un composant coulissant : prévoir ports, stops, orientation, libération et segments. Les textes décrivent les résultats attendus sous les conditions indiquées.')

images = json.loads((ROOT / 'recherche' / 'images_fishdex.json').read_text(encoding='utf-8'))
stem_to_fish = {stem:f['id'] for f in fish for stem in f['asset_stems']}
FORM_MAP = {
 'carpe-cuir':('carpe-commune','scalation','candidate', 'Écaillure ; conserver même espèce.'),
 'carpe-fully-scaled':('carpe-commune','scalation','candidate','Écaillure à confirmer sur la fiche FishDex.'),
 'carpe-lineaire':('carpe-commune','scalation','candidate','Forme d’écaillure.'),
 'carpe-miroir':('carpe-commune','scalation','candidate','Forme d’écaillure, pas nouvelle espèce.'),
 'carpe-ghost':('carpe-commune','domestic_form','needs_identity_review','Forme domestique ; taxon et origine à confirmer.'),
 'carpe-koi':('carpe-commune','ornamental_group','needs_identity_review','Groupe ornemental ; taxon exact des koïs à confirmer dans l’app, ne pas forcer la nomenclature.'),
 'carassin-dore':('carassin-dore','species','needs_image_review','Carassius auratus si confirmé ; pas simple recoloration de C. carassius.'),
 'gardon-rouge':('gardon','appearance_or_alias','needs_identity_review','Nom pouvant être ambigu avec rotengle ; lire fiche source.'),
 'gros-gardon':('gardon','size_class','candidate','Spécimen de taille, pas nouvelle espèce.'),
 'gros-rotengle':('rotengle','size_class','candidate','Spécimen de taille.'),
 'ide-dore':('ide-melanote','ornamental_form','candidate','Forme dorée ; identification source à vérifier.'),
 'rotengle-gold':('rotengle','color_form','needs_image_review','Couleur et caractère naturel/fictionnel à qualifier.'),
 'tanche-doree':('tanche','ornamental_form','candidate','Forme dorée ; même taxon si confirmé.'),
 'carpe-amour-blanc-albinos':('amour-blanc','color_form','candidate','Albinos ; pas bonus comportemental automatique.'),
 'carpe-ghost-miroir':('carpe-commune','domestic_form','needs_identity_review','Couleur et écaillure sont deux axes différents.'),
 'esturgeon-albinos':('esturgeon-siberien','color_form','needs_identity_review','Espèce d’esturgeon non déduite de la couleur.'),
 'esturgeon-gold':('esturgeon-siberien','unresolved_image','needs_identity_review','Image visuellement suspecte dans l’audit ; vérifier qu’elle représente un esturgeon.'),
 'silure-albinos':('silure-glane','color_form','candidate','Vérifier taxon sur source.'),
 'silure-gold':('silure-glane','color_form','needs_image_review','Ne pas inventer un taxon doré.'),
 'truite-albinos':('truite-arc-en-ciel','color_form','needs_identity_review','Espèce parent à confirmer.'),
 'truite-jaune':('truite-arc-en-ciel','color_form','needs_identity_review','Forme golden/palomino possible ; fiche à contrôler.'),
 'truite-tiger':('truite-fario','possible_hybrid','needs_identity_review','Hybride possible fario × omble de fontaine ; ne pas intégrer comme couleur de fario.')}
for pattern in ['kohaku','sanke','showa','ogon','platinum']:
    FORM_MAP['carpe-koi-'+pattern] = ('carpe-commune','ornamental_pattern','needs_identity_review','Motif de koï ; conserver groupe koï et confirmer taxon parent.')

mapping = []
appearances = []
fish_by_id = {f['id']:f for f in fish}
for img in images:
    stem = Path(img['path']).stem
    if stem in FORM_MAP:
        parent, kind, status, note = FORM_MAP[stem]
        appearances.append(dict(id=stem, candidate_species_id=parent, kind=kind, research_status=status,
            asset_path=img['path'], playable=False, rarity_weight=None,
            rarity_origin='game_balance_pending', note=note))
    elif stem in stem_to_fish:
        parent = stem_to_fish[stem]
        kind = 'base_or_alias'
        status = 'identity_pending' if fish_by_id[parent]['discovery_mode']=='identity_pending' else 'candidate'
        note = 'Rattachement basé sur le nom et les références ; vérifier la fiche FishDex et l’image avant migration.'
        if 'record' in stem or 'geant' in stem or 'trophee' in stem:
            kind='size_class'
            note='Record / trophée : même espèce, poids individuel différent.'
        if stem in ['truite-lacustre','truite-de-mer']:
            kind='ecological_form'
            status='needs_context_research'
            note='Salmo trutta ; fiche de contexte lac/mer à compléter avant activation.'
    else:
        raise ValueError('Image sans correspondance : '+img['path'])
    mapping.append(dict(asset_path=img['path'], candidate_species_id=parent, kind=kind, status=status, note=note, sha256=img['sha256']))
with (DATA / 'correspondances_images.csv').open('w', encoding='utf-8', newline='') as f:
    writer=csv.DictWriter(f, fieldnames=list(mapping[0]))
    writer.writeheader(); writer.writerows(mapping)
write('apparences', appearances, note='Rattachements candidats, pas taxonomie forcée ; la colonne de statut prime sur le parent proposé. Aucun taux de rareté présenté comme fréquence biologique.')

# Une table de tags évite de comparer directement un mot de régime et un mot d’appât.
write('regimes_et_imitation', [
    dict(id='poissons', biological_terms=['poissons','alevins'], offered_terms=['poissons','imitation_poissons']),
    dict(id='invertebres', biological_terms=['invertebres','petits_invertebres','invertebres_benthiques','vers','larves','insectes'], offered_terms=['invertebres','invertebres_benthiques','insectes','imitation_invertebres','imitation_insectes']),
    dict(id='crustaces', biological_terms=['crustaces','ecrevisses'], offered_terms=['crustaces','imitation_crustaces']),
    dict(id='vegetaux', biological_terms=['vegetaux','graines','algues'], offered_terms=['vegetaux','graines','imitation_graines']),
    dict(id='plancton', biological_terms=['plancton','phytoplancton','zooplancton'], offered_terms=[], rule='Pas de conversion automatique en esche à hameçon.'),
    dict(id='opportuniste', biological_terms=[], offered_terms=['opportuniste'], rule='Doit être validé par affinité d’espèce et contexte ; pas accepté par toute espèce automatiquement.')
], note='Ontology simplifiée de jeu ; le régime indique une plausibilité, pas une garantie de capture ni une exclusivité.')

counts = dict(profils_poissons=len(fish), identites_en_attente=sum(f['discovery_mode']=='identity_pending' for f in fish),
    methodes_et_approches=len(methods), recettes_montage=len(rigs), appats_leurres_amorces=len(baits),
    familles_materiel=len(families), exemples_equipements=len(equipment), correspondances_images=len(mapping),
    apparences_additionnelles_cataloguees=len(appearances), sources=len(sources))
write('manifest', [counts], scope='Catalogue et spécification ; aucun nombre ne représente le contenu déjà jouable sur fishdex.fr.')

fish_doc = ['# Profils des poissons — biologie et propositions de jeu', '',
 f'Recherche du {DATE}. {len(fish)} profils, dont {counts["identites_en_attente"]} identités non résolues. Toutes les entrées restent à confronter au catalogue du dépôt.', '',
 'Les faits et leur source figurent séparément des actions proposées. Les six notes 0–1 sont des réglages de gameplay : elles ne sont pas des mesures scientifiques ni des probabilités de capture.', '',
 '| Attribut | Signification dans le jeu |', '|---|---|',
 '| burst | Intensité relative d’un départ brusque |', '| endurance | Persistance relative d’un effort |',
 '| agility | Fréquence/amplitude relative des changements de direction |', '| head_shakes | Poids relatif des séquences de secousses |',
 '| cover_seeking | Tendance proposée à viser un abri accessible |', '| slack_pressure | Tendance proposée à créer du mou par retour vers le joueur |', '',
 'Ces réglages se combinent au poids, au stade, aux conditions, à la fatigue et au matériel. Un barbeau de 500 g ne tire pas plus fort qu’un silure de 30 kg à cause d’un score d’endurance. Les événements ne se répètent pas à chaque combat.', '',
 'Les taxons d’observation restent présents dans le FishDex et peuvent se découvrir sans capture. Le nom d’une image ne prouve pas l’espèce : voir correspondances_images.csv.', '']
for f in fish:
    fish_doc += [f"## {f['name']} — `{f['id']}`", '', f"**Taxon :** {f['scientific_name'] or 'À identifier'}. **Recherche :** {f['research_status']}. **Découverte proposée :** {f['discovery_mode']}.", '',
        '**Faits documentés / limite :** '+f['biological_facts'], '',
        'Habitat indicatif : '+(', '.join(f['habitats']) or 'À préciser')+'. Activité : '+(f['activity'] or 'À préciser')+'.', '',
        '**Proposition de comportement en jeu :** '+f['combat_proposal'], '',
        'Réglages provisoires : '+ ' · '.join(f'{k}={v:.2f}' for k,v in f['attributes'].items())+'.', '',
        'Appâts/leurres candidats : '+(', '.join(f['bait_ids']) or 'Aucun attribué')+'. Méthodes candidates : '+(', '.join(f['method_ids']) or 'À définir')+'.', '',
        '**Ces affinités sont des hypothèses de jeu**, pas un classement scientifique d’appâts. Une proie compatible ne suffit pas : lieu, profondeur, taille, saison et présentation doivent permettre la rencontre.', '',
        'Sources : '+(links(f['source_ids']) or 'Identification nécessaire avant recherche de comportement.')+'.', '']
    if f['feeding_rules']:
        fish_doc += ['Règles de stade à préserver : '+json.dumps(f['feeding_rules'], ensure_ascii=False)+'.', '']
(DOCS / 'PROFILS_POISSONS.md').write_text('\n'.join(fish_doc)+'\n', encoding='utf-8')

catalog_doc=['# Catalogues de contenu', '',
 'Inventaire large d’eau douce, avec extensions spécialistes. Ce n’est pas l’ensemble de toutes les pratiques mondiales. Les règles de jeu sont proposées ; les références documentent l’existence d’une famille ou une recette selon le statut.', '',
 '**documented** : principe ou famille documenté ; pas tous les paramètres validés. **partial** : principe seulement / référence indirecte. **needs_research** : entrée réservée nécessitant recherche dédiée avant activation.', '',
 'Aucune entrée n’est déclarée déjà jouable : l’agent doit auditer le dépôt, conserver les fonctionnalités présentes et activer uniquement du contenu fonctionnel.', '',
 '## Méthodes et approches', '', '| ID / nom | Famille | Principe | Recherche / sources |', '|---|---|---|---|']
for m in methods:
    catalog_doc.append(f"| `{m['id']}` — {m['name']} | {m['family']} | {m['principle']} | {m['research_status']} ; {links(m['source_ids'])} |")
catalog_doc += ['', 'Les approches sont des déclinaisons de présentation ou de poste. Une grande canne sans moulinet utilise l’élastique ; les gestes de lancer et de combat doivent être adaptés à cette mécanique avant d’activer la méthode.', '',
 '## Recettes de montage', '', 'Slots traduits dans data/slots.json. Canne et composants centraux de la méthode s’ajoutent à la recette. Les recettes à la nymphe possèdent un remplacement de slots pour la nymphe au fil.', '',
 '| Montage | Méthodes | Composants de recette | Principe | Proposition de jeu / statut |', '|---|---|---|---|---|']
for r in rigs:
    catalog_doc.append(f"| `{r['id']}` — {r['name']} | {', '.join(r['method_ids'])} | {', '.join(SLOTS[k] for k in r['required_slots'])} | {r['principle']} | {r['game_use']} **{r['research_status']}**. {links(r['source_ids'])} |")
catalog_doc += ['', '## Esches, leurres et amorces', '',
 'Les tags de présentation sont des pistes pour les paramètres de jeu, pas les propriétés certifiées d’un produit. Choisir variante et densité avant activation. Les consommables naturels se débitent par portion ; les artificiels restent jusqu’à perte/usure définie. Les amorces disposent d’un emplacement séparé.', '',
 '| ID / nom | Famille | Présentation candidate | Utilisation proposée | Recherche / sources |', '|---|---|---|---|---|']
for b in baits:
    catalog_doc.append(f"| `{b['id']}` — {b['name']} | {b['family']} | {', '.join(b['presentation_tags'])} | {b['game_proposal']} | {b['research_status']} ; {links(b['source_ids'])} |")
catalog_doc += ['', '## Familles de matériel et variantes de conception', '',
 f'{len(families)} familles et {len(equipment)} exemples de variantes. Ce sont des références originales au jeu, pas des reproductions de produits des fabricants cités. Tailles, longueurs et grammages sont des exemples proposés. Les résistances, plages de lancer et prix restent volontairement à compléter ; aucune fausse relation diamètre/résistance n’est codée.', '',
 '| Famille | Emplacement | Variantes | Effet proposé / limite | Sources de famille |', '|---|---|---|---|---|']
for f in families:
    catalog_doc.append(f"| `{f['id']}` — {f['name']} | {SLOTS[f['slot']]} | {f['variant_count']} | {f['behavior']} | {links(f['source_ids'])} |")
catalog_doc += ['', '## Activation progressive', '',
 'À chaque activation : compléter fiche, visuel existant, quantités, prix virtuel, compatibilité et paramètres physiques ; tester achat/équipement/lancer/combat/casse/sauvegarde ; puis permettre achat. Les méthodes prévues ont déjà une place, un aperçu et un statut « À venir », mais ne prennent pas des pièces contre une fonctionnalité absente.', '',
 'La pêche maritime et des méthodes spécialisées peu documentées ici sont des extensions à rechercher. Ne pas réutiliser automatiquement les régimes d’une espèce de rivière pour un taxon marin ou une forme migratrice.', '']
(DOCS / 'CATALOGUES_CONTENU.md').write_text('\n'.join(catalog_doc)+'\n', encoding='utf-8')

bibliography=['# Sources et portée des recherches', '',
 'Consultation le 2 octobre 2026. Liens conservés pour contrôler les fiches. Les fiches DORIS et les synthèses FishBase sont des références naturalistes secondaires ; FAO, NOAA, FWS et organismes de pêche fournissent des profils institutionnels. Les guides de fabricants décrivent leurs pratiques ou systèmes et ne constituent pas des preuves de supériorité d’un produit.', '',
 'Les chiffres de combat, affinités, raretés et économie sont des choix originaux à équilibrer. Une source sur une famille ne valide pas toutes les recettes de cette famille. Certains profils taxonomiques/historiques et méthodes spécialistes sont incomplets ; les statuts les signalent.', '',
 'Aucun règlement territorial n’est repris comme règle universelle du jeu. Aucun manuel complet, photographie tierce, schéma ou texte de fabricant n’est recopié. Les images appartiennent au catalogue fourni par l’utilisateur et ne sont pas incluses dans cette archive.', '']
for s in sources:
    bibliography += [f"- **{s['id']}** — [{s['title']}]({s['url']}), {s['publisher']}. Portée : {s['coverage']}."]
(DOCS / 'SOURCES_ET_LIMITES.md').write_text('\n'.join(bibliography)+'\n', encoding='utf-8')
print(json.dumps(counts, ensure_ascii=False, indent=2))
