// Manifest des ressources du chantier visuel : source, export, import moteur, intégration, licences.
// node production_3d/environment/tools/build-manifest.mjs  (vérifie que chaque chemin déclaré existe)
import {readFile,writeFile,stat,readdir} from 'node:fs/promises';import {existsSync} from 'node:fs';
const json=async p=>JSON.parse(await readFile(p,'utf8'));const registry=await json('src/render/environment-registry.json');
const exportsDir='production_3d/environment/reports/export',engineDir='production_3d/environment/reports/engine-import';
const exportsById=Object.fromEntries(await Promise.all((await readdir(exportsDir)).filter(f=>f.endsWith('.json')).map(async f=>[f.replace('.json',''),await json(`${exportsDir}/${f}`)])));
const provenance=await json('production_3d/environment/textures/source/PROVENANCE.json');
const runtimeExtra={pier_jetty:[],bank_earth:[],ground:['public/map-assets/ground-macro.jpg','public/map-assets/ground-detail.png']};
const entries=[];
for(const e of registry.entries.filter(e=>e.resource?.includes('/fdx-'))){
 const ex=exportsById[e.id],runtime='public'+e.resource,engine=existsSync(`${engineDir}/${e.id}/report.json`)?await json(`${engineDir}/${e.id}/report.json`):null;
 entries.push({id:e.id,status:existsSync(runtime)&&engine&&!engine.errors.length?'poste_integre':'export_valide',source:e.source,script:e.script,runtime,runtimeBytes:existsSync(runtime)?(await stat(runtime)).size:null,
  triangles:ex?.export?.triangles??null,perLod:ex?.export?.per_lod??ex?.export?.per_mesh_triangles??null,materials:ex?.export?.materials??null,images:ex?.export?.images??null,pivot:e.pivot,lod:e.lod,variants:e.variants??null,replacesFamilies:e.replacesFamilies??null,
  engineImport:engine?{report:`${engineDir}/${e.id}/report.json`,errors:engine.errors.length}:null,previews:ex?.previews??[],licence:'Géométrie produite par script FishDex ; textures CC0 Poly Haven (voir textures/source/PROVENANCE.json)'});
}
entries.push({id:'ground_macro_detail',status:'poste_integre',source:'production_3d/environment/tools/ground-fields.mts + bake_ground.py',runtime:runtimeExtra.ground,runtimeBytes:await Promise.all(runtimeExtra.ground.map(async p=>(await stat(p)).size)),licence:'Couleurs cuites depuis la carte ; détail CC0 leafy_grass + forest_ground_04 (Poly Haven)',integration:'src/render/map-materials.ts ground() : diffuse macro + detailMap 3 m'});
for(const e of entries)for(const p of [e.source,e.runtime].flat().filter(p=>p&&!p.includes(' ')))if(!existsSync(p))throw Error('chemin manquant '+p);
await writeFile('production_3d/environment/manifest.json',JSON.stringify({generated:new Date().toISOString().slice(0,10),map:'willow-pond (Étang des Saules)',registryVersion:registry.version,statusScale:['source_prete','export_valide','import_moteur_valide','poste_integre'],entries,textureSources:provenance.files.map(f=>({file:f.file,author:f.author,page:f.page,license:f.license,sha256:f.sha256}))},null,2)+'\n');
console.log(entries.map(e=>e.id+':'+e.status).join(' '));
