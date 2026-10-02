"""Inventaire local et normalisation des archives du propriétaire, sans génération."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets-source' / 'fishdex-images'
OUT = ROOT / 'public' / 'fishdex-assets'
REPORT = ROOT / 'docs' / 'poissons'
OUT.mkdir(parents=True, exist_ok=True)
REPORT.mkdir(parents=True, exist_ok=True)
rows, hashes = [], {}
for file in sorted(SOURCE.rglob('*')):
    if not file.is_file(): continue
    raw = file.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    relative = file.relative_to(SOURCE).as_posix()
    role = relative.split('/')[0]
    row = dict(source=relative, stem=file.stem, role=role, sha256=digest, bytes=len(raw))
    if file.suffix.lower() == '.svg':
        target = OUT / (digest[:16] + '.svg')
        target.write_bytes(raw)
        row.update(url='/fishdex-assets/' + target.name, dimensions=None, crop=None)
    else:
        with Image.open(file) as image:
            image = image.convert('RGBA')
            row['dimensions'] = list(image.size)
            box = image.getchannel('A').getbbox() or (0, 0, *image.size)
            # Marge autour de la silhouette ; jamais d'étirement ni de fond ajouté.
            if role != 'backgrounds':
                margin = round(max(box[2]-box[0], box[3]-box[1]) * .04)
                box = (max(0,box[0]-margin), max(0,box[1]-margin), min(image.width,box[2]+margin), min(image.height,box[3]+margin))
            else: box = (0,0,*image.size)
            row['crop'] = list(box)
            image = image.crop(box)
            image.thumbnail((960,960) if role == 'backgrounds' else (512,384))
            target = OUT / (digest[:16] + '.webp')
            if digest not in hashes and not target.exists(): image.save(target, 'WEBP', quality=83, method=6)
            row.update(url='/fishdex-assets/' + target.name, normalizedBytes=target.stat().st_size)
    hashes[digest] = row['url']
    rows.append(row)

inventory = dict(version=1, date='2026-10-02', files=len(rows), uniqueFiles=len(hashes), assets=rows)
(REPORT / 'ASSETS_INVENTAIRE.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(ROOT / 'src' / 'game' / 'fish-assets.json').write_text(json.dumps(inventory, ensure_ascii=False, separators=(',',':'))+'\n', encoding='utf-8')
fish = [r for r in rows if r['role'] in ('fishes','mutations','varieties') and r['dimensions']]
for page in range((len(fish)+23)//24):
    sheet = Image.new('RGB',(1000,900),'#29383c')
    draw = ImageDraw.Draw(sheet)
    for index,row in enumerate(fish[page*24:(page+1)*24]):
        image = Image.open(OUT / Path(row['url']).name).convert('RGBA')
        image.thumbnail((230,112))
        x,y = (index%4)*250, (index//4)*150
        sheet.paste(image,(x+(250-image.width)//2,y+(120-image.height)//2),image)
        draw.text((x+6,y+123),row['stem'][:34],fill='white')
    sheet.save(REPORT / f'assets-contact-{page+1}.jpg', quality=86)
print(json.dumps(dict(files=len(rows), unique=len(hashes), fishIllustrations=len(fish), normalizedBytes=sum(p.stat().st_size for p in OUT.iterdir()))))
