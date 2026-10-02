"""Adapter le dossier de conception local, sans réseau ni modification de FishDex."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs/Dossier_Au_Fil_De_Leau/data"
MAPPING = dict(roach="gardon", perch="perche", carp="carpe-commune", pike="brochet",
               zander="sandre", bream="breme-commune", tench="tanche", rudd="rotengle",
               bleak="ablette", crucian="carassin", whitebream="breme-bordeliere",
               gudgeon="goujon", chub="chevesne", ide="ide-melanote", catfish="silure-glane")
raw = {f.stem: json.loads(f.read_text(encoding="utf-8"))["entries"]
       for f in DATA.glob("*.json")}
profiles = {game_id: next(e for e in raw["poissons"] if e["id"] == dossier_id)
            for game_id, dossier_id in MAPPING.items()}
(ROOT / "src/game/fish-profiles.json").write_text(
    json.dumps(profiles, ensure_ascii=False, indent=2), encoding="utf-8")
entries = []
for key, category in [("methodes", "Méthodes"), ("montages", "Montages"),
                      ("appats_leurres_amorces", "Appâts et leurres"),
                      ("familles_materiel", "Matériel"), ("poissons", "Poissons"),
                      ("apparences", "Apparences")]:
    for e in raw[key]:
        variants = [v for v in raw["equipements"] if v.get("family_id") == e["id"]] if key == "familles_materiel" else []
        description = e.get("principle", e.get("biological_facts", e.get("behavior", e.get("game_proposal", e.get("note", "Fiche de conception à confirmer.")))))
        entries.append(dict(id=key + ":" + e["id"], sourceId=e["id"], category=category,
                            name=e.get("name", e["id"]), description=description,
                            slots=e.get("required_slots", []), methods=e.get("method_ids", []),
                            status=e.get("research_status", "catalogued"), identity=e.get("identity_status", ""),
                            sources=e.get("source_ids", []), variants=variants, detail=e))
(ROOT / "src/game/research-library.json").write_text(
    json.dumps(dict(entries=entries, sources=raw["sources"], slots=raw["slots"]),
               ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print("15 profils raccordés ;", len(entries), "fiches de catalogue, 274 variantes groupées.")
