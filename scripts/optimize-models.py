"""Optimisation locale des textures embarquées ; géométrie et coordonnées inchangées."""
from pathlib import Path
import json
import struct
import io
from PIL import Image
root = Path(__file__).resolve().parents[1] / 'public' / 'models'
manifest = json.loads((root / 'manifest.json').read_text())
for entry in manifest['models']:
    path = root / (entry['model'] + '.glb')
    raw = path.read_bytes()
    size = struct.unpack_from('<I', raw, 12)[0]
    data = json.loads(raw[20:20+size])
    binary = raw[28+size:]
    image_views = {im['bufferView']: im for im in data.get('images', []) if 'bufferView' in im}
    rebuilt = bytearray()
    for index, view in enumerate(data['bufferViews']):
        chunk = binary[view.get('byteOffset', 0):view.get('byteOffset', 0)+view['byteLength']]
        if index in image_views:
            with Image.open(io.BytesIO(chunk)) as image:
                out = io.BytesIO()
                image.convert('RGB').save(out, 'JPEG', quality=85, optimize=True)
                chunk = out.getvalue()
            image_views[index]['mimeType'] = 'image/jpeg'
        while len(rebuilt) % 4: rebuilt.append(0)
        view['byteOffset'] = len(rebuilt); view['byteLength'] = len(chunk)
        rebuilt.extend(chunk)
    data['buffers'][0]['byteLength'] = len(rebuilt)
    while len(rebuilt) % 4: rebuilt.append(0)
    encoded = json.dumps(data, separators=(',', ':')).encode()
    while len(encoded) % 4: encoded += b' '
    output = struct.pack('<III', 0x46546c67, 2, 12+8+len(encoded)+8+len(rebuilt)) + struct.pack('<II', len(encoded), 0x4e4f534a) + encoded + struct.pack('<II', len(rebuilt), 0x004e4942) + rebuilt
    path.write_bytes(output)
    entry['bytes'] = len(output); entry['texture'] = '512x512 JPEG embedded, quality 85'
    print(entry['model'], len(raw), '->', len(output))
(root / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
