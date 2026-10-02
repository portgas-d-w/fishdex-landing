// Lecture de contenus statiques uniquement ; aucun script de seed ni accès réseau.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = process.argv[2];
if (!root) throw new Error('Usage : node scripts/import-fishdex.mjs <dossier FishDex>');
const sources = [];
function read(file) { const text = fs.readFileSync(path.join(root, file), 'utf8'); sources.push({ file, sha256: createHash('sha256').update(text).digest('hex') }); return text; }
function array(file, name) {
  const source = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  let literal;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) literal = node.initializer?.getText(source); ts.forEachChild(node, visit); }
  visit(source); if (!literal) throw new Error(`Table absente : ${file}`);
  return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
}
const rows = new Map([...array('data/fishes.ts', 'SPECIES'), ...array('src/scripts/seed-new-species.ts', 'NEW_SPECIES')].map(row => [row.slug, row]));
const mapping = read('supabase/scripts/seed-species-collections.sql');
for (const match of mapping.matchAll(/\('([^']+)',\s*'(paisibles|predateurs|eaux-vives)'\)/g)) {
  const row = rows.get(match[1]); if (row) row.collections = [...new Set([...(row.collections ?? []), match[2]])];
}
// Appliquer les enrichissements déclarés, sans exécuter SQL.
for (const file of ['024_species_seed.sql', '025_species_enrichment_complet.sql', '029_species_weight_formula_all.sql']) {
  const sql = read(`supabase/migrations/${file}`);
  for (const match of sql.matchAll(/UPDATE public\.species SET([\s\S]*?)WHERE slug\s*=\s*'([^']+)'\s*;/g)) {
    const row = rows.get(match[2]); if (!row) continue;
    for (const key of ['nom_fr', 'nom_scientifique', 'description', 'rarete', 'conseil_fishdex']) {
      const v = match[1].match(new RegExp(`\\b${key}\\s*=\\s*'((?:[^']|'')*)'`)); if (v) row[key] = v[1].replaceAll("''", "'");
    }
    for (const key of ['taille_min_cm', 'taille_max_cm', 'poids_max_kg', 'weight_formula_a', 'weight_formula_b']) {
      const v = match[1].match(new RegExp(`\\b${key}\\s*=\\s*([\\d.]+)`)); if (v) row[key] = Number(v[1]);
    }
    const techniques = match[1].match(/techniques\s*=\s*ARRAY\[([^\]]*)\]/);
    if (techniques) row.techniques = [...techniques[1].matchAll(/'((?:[^']|'')*)'/g)].map(x => x[1].replaceAll("''", "'"));
  }
}
const aliases = { 'carpe-commune': 'carp', gardon: 'roach', perche: 'perch', brochet: 'pike', sandre: 'zander', 'breme-commune': 'bream', tanche: 'tench', rotengle: 'rudd', ablette: 'bleak', carassin: 'crucian', 'breme-bordeliere': 'whitebream', goujon: 'gudgeon', chevesne: 'chub', 'ide-melanote': 'ide', 'silure-glane': 'catfish' };
const groups = new Map();
const entries = [...rows.values()].map(row => {
  const latin = row.nom_scientifique.split(/\s+/).slice(0, 2).join(' ');
  const biologicalId = latin.toLowerCase().replace(/[^a-z]+/g, '-');
  if (!groups.has(biologicalId)) groups.set(biologicalId, []); groups.get(biologicalId).push(row.slug);
  const candidate = row.image_url ?? `/fishes/${row.slug}.png`;
  const imageSource = path.join(root, 'public', candidate);
  const hasImage = fs.existsSync(imageSource);
  return { id: row.slug, biologicalId, name: row.nom_fr, latin: row.nom_scientifique, category: row.collections?.[0] ?? (row.regime === 'carnivore' ? 'predateurs' : 'paisibles'),
    rarity: row.rarete === 'shiny' ? 'mirage' : row.rarete, description: row.description ?? '', hint: row.conseil_fishdex ?? '',
    min: row.taille_min_cm ?? null, max: row.taille_max_cm ?? null, maxWeight: row.poids_max_kg ?? null,
    techniques: row.techniques ?? [], gameId: aliases[row.slug] ?? null,
    image: hasImage ? `/encyclopedia/${row.slug}.webp` : null,
    weightA: row.weight_formula_a ?? null, weightB: row.weight_formula_b ?? null,
    sourceImage: hasImage ? imageSource : null };
});
const auditOnly = process.env.FISHDEX_AUDIT_ONLY === '1';
fs.mkdirSync('public/encyclopedia', { recursive: true });
fs.mkdirSync('.migration', { recursive: true });
fs.writeFileSync('.migration/illustrations.json', JSON.stringify(entries.filter(e => e.sourceImage).map(e => ({ source: e.sourceImage, target: path.resolve(`public/encyclopedia/${e.id}.webp`) }))));
const images = auditOnly ? {status:0,stdout:'images non modifiées (audit)',stderr:''} : spawnSync(process.env.FISHDEX_PYTHON ?? 'python', ['scripts/resize-illustrations.py', '.migration/illustrations.json'], { encoding: 'utf8' });
if (images.status !== 0) throw new Error(images.stderr);
const output = { provenance: { project: 'FishDex — fichiers locaux du propriétaire, lecture seule', sources, sourceEntries: entries.length, biologicalGroups: groups.size, note: 'Catalogue déclaré dans les fichiers ; état de la base distante non consulté. Variétés regroupées par binôme scientifique.' }, entries: entries.map(({ sourceImage, ...entry }) => entry) };
fs.writeFileSync(auditOnly ? '.migration/fishdex-source.json' : 'src/game/fishdex.json', JSON.stringify(output, null, 2) + '\n');
console.log(`${entries.length} fiches, ${groups.size} groupes biologiques ; ${images.stdout.trim()}`);
