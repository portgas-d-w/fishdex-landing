#!/usr/bin/env python3
"""Vérifie la cohérence du catalogue, pas le jeu. Aucun paquet tiers."""
import csv
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
errors = []
checks = 0

def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)

def load(name):
    obj = json.loads((DATA / f'{name}.json').read_text(encoding='utf-8'))
    check(obj.get('schema_version')=='1.0.0', name+': version')
    check(isinstance(obj.get('entries'),list), name+': entries')
    return obj['entries']

catalogs={n:load(n) for n in ['sources','poissons','apparences','methodes','montages','appats_leurres_amorces','familles_materiel','equipements','slots','kit_gratuit','graphe_montage_exemples','regimes_et_imitation']}
ids={}
for name,rows in catalogs.items():
    ids[name]={r['id'] for r in rows}
    check(len(ids[name])==len(rows), name+': IDs dupliqués')
    for row in rows:
        check(bool(re.fullmatch(r'[a-z0-9_-]+',row['id'])), name+': ID invalide '+row['id'])
        for source in row.get('source_ids',[]):
            check(source in ids.get('sources',set()), row['id']+': source inconnue '+source)

for s in catalogs['sources']:
    u=urlparse(s['url'])
    check(u.scheme=='https' and bool(u.netloc), s['id']+': URL invalide')
    check(bool(s['coverage']), s['id']+': portée absente')

method_index={r['id']:r for r in catalogs['methodes']}
family_index={r['id']:r for r in catalogs['familles_materiel']}
fish_index={r['id']:r for r in catalogs['poissons']}
for name in ['poissons','montages','appats_leurres_amorces','familles_materiel','equipements']:
    for r in catalogs[name]:
        for m in r.get('method_ids',[]):
            check(m in ids['methodes'], r['id']+': méthode inconnue '+m)
for name in ['methodes','montages']:
    for r in catalogs[name]:
        for slot in r['required_slots']+r.get('optional_slots',[])+r.get('core_slots',[]):
            check(slot in ids['slots'], r['id']+': slot inconnu '+slot)
        for m,slots in r.get('method_slot_overrides',{}).items():
            check(m in r['method_ids'], r['id']+': override hors méthode')
            check(all(s in ids['slots'] for s in slots), r['id']+': override invalide')
for m in catalogs['methodes']:
    check(('reel' in m['core_slots']) == m['requires_reel'], m['id']+': moulinet incohérent')
    check(not m['availability']['playable'], m['id']+': activation sans audit')

attributes={'burst','endurance','agility','head_shakes','cover_seeking','slack_pressure'}
for f in catalogs['poissons']:
    check(set(f['attributes'])==attributes, f['id']+': attributs')
    check(all(isinstance(v,(int,float)) and 0<=v<=1 for v in f['attributes'].values()), f['id']+': bornes')
    check(f['gameplay_is_proposal'] and f['attribute_origin']=='provisional_game_balance', f['id']+': provenance des notes')
    for b in f['bait_ids']:
        check(b in ids['appats_leurres_amorces'], f['id']+': appât inconnu '+b)
    check(not f['playable'], f['id']+': jouabilité externe non vérifiée')
    if f['discovery_mode'] in ['identity_pending','observation']:
        check(not f['bait_ids'], f['id']+': appât classique attribué à une découverte non classique')
    if f['discovery_mode']=='identity_pending':
        check(not f['scientific_name'] and all(v==0 for v in f['attributes'].values()), f['id']+': taxon/combat inventé')
    else:
        check(bool(f['source_ids']) and bool(f['scientific_name']), f['id']+': documentation absente')
for fid in ['alose-feinte','grande-alose','saumon-atlantique','lamproie-de-planer']:
    check(any(r.get('hunger_bite_rate')==0 for r in fish_index[fid]['feeding_rules']), fid+': stade non alimentaire omis')
for fid in ['amour-argente','amour-marbre']:
    check(any(r.get('standard_hook_bait_system') is False for r in fish_index[fid]['feeding_rules']), fid+': filtration traitée comme esche ordinaire')

for e in catalogs['equipements']:
    check(e['family_id'] in ids['familles_materiel'], e['id']+': famille inconnue')
    check(e['slot'] in ids['slots'], e['id']+': slot inconnu')
    check(e['inventory_unit'] in ['piece','meter'], e['id']+': unité de stock')
    check(e['price_coins'] is None and not e['purchase_enabled'], e['id']+': prix/achat sans validation')
    check(e['specs']['declared_break_strength_N'] is None, e['id']+': résistance non sourcée ajoutée')
    check(e['specification_origin']=='original_design_example_not_manufacturer_product', e['id']+': provenance')
for f in catalogs['familles_materiel']:
    check(sum(e['family_id']==f['id'] for e in catalogs['equipements'])==f['variant_count'], f['id']+': variantes')
for a in catalogs['apparences']:
    check(a['candidate_species_id'] in ids['poissons'], a['id']+': parent inconnu')
    check(a['rarity_weight'] is None and not a['playable'], a['id']+': rareté/activation non vérifiée')

images=json.loads((ROOT/'recherche/images_fishdex.json').read_text(encoding='utf-8'))
with (DATA/'correspondances_images.csv').open(encoding='utf-8',newline='') as f:
    mapping=list(csv.DictReader(f))
check({r['asset_path'] for r in mapping}=={r['path'] for r in images},'Couverture des images incomplète')
check(len(mapping)==len(images)==101,'Nombre d’images attendu du lot reçu')
check(len({r['asset_path'] for r in mapping})==len(mapping),'Correspondance image dupliquée')
hashes={r['path']:r['sha256'] for r in images}
for r in mapping:
    check(r['candidate_species_id'] in ids['poissons'],r['asset_path']+': parent image inconnu')
    check(r['sha256']==hashes[r['asset_path']],r['asset_path']+': empreinte d’audit altérée')
for graph in catalogs['graphe_montage_exemples']:
    check(graph['rig_id'] in ids['montages'],graph['id']+': recette inconnue')
kit=catalogs['kit_gratuit'][0]
check(kit['method_id'] in ids['methodes'] and kit['rig_id'] in ids['montages'],'Kit : méthode/recette')
check(kit['kit_bait'] in ids['appats_leurres_amorces'],'Kit : esche')
check(kit['infinite_source'] and not kit['allows_resale'],'Kit : sortie d’impasse / anti-revente')
check(all(c['ownership']=='starter_unlimited' for c in kit['components']),'Kit : ownership')

counts=dict(profils_poissons=len(catalogs['poissons']),identites_en_attente=sum(f['discovery_mode']=='identity_pending' for f in catalogs['poissons']),
 methodes_et_approches=len(catalogs['methodes']),recettes_montage=len(catalogs['montages']),appats_leurres_amorces=len(catalogs['appats_leurres_amorces']),
 familles_materiel=len(catalogs['familles_materiel']),exemples_equipements=len(catalogs['equipements']),correspondances_images=len(mapping),
 apparences_additionnelles_cataloguees=len(catalogs['apparences']),sources=len(catalogs['sources']))
check(load('manifest')[0]==counts,'Comptages du manifeste')
for name in ['README.md','DEMARRER_AVEC_CODEX.md','RELAIS_CODEX_CLAUDE.md','DOSSIER_MONTAGES_MATERIEL_POISSONS.md','docs/PROFILS_POISSONS.md','docs/CATALOGUES_CONTENU.md','docs/SOURCES_ET_LIMITES.md','docs/FORMAT_DONNEES.md']:
    path=ROOT/name
    check(path.is_file() and path.stat().st_size>0,'Document manquant : '+name)
    text=path.read_text(encoding='utf-8')
    for target in re.findall(r'\]\(([^)]+)\)',text):
        if not target.startswith(('https://','http://','#')):
            check((path.parent/target).exists(),'Lien local cassé : '+target)
main=(ROOT/'DOSSIER_MONTAGES_MATERIEL_POISSONS.md').read_text(encoding='utf-8')
check('simple appui, jamais des cercles' in main,'Consigne de moulinage absente')
check('kit gratuit' in main.lower(),'Kit absent')
check('touch-action: none' in main,'Correctifs tactiles absents')

report=dict(status='PASS' if not errors else 'FAIL',checked_scope='Dossier uniquement ; jeu non testé',checks=checks,counts=counts,errors=errors)
(ROOT/'VERIFICATION_DOSSIER.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(1 if errors else 0)
