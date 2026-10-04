import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='assets-source/free-map-01';await mkdir(root,{recursive:true});
const records=[];
async function json(url){const r=await fetch(url);if(!r.ok)throw Error(`${url}: ${r.status}`);return r.json();}
async function download(id,url,name){
 const path=`${root}/${name}`;
 try{let b;try{b=await readFile(path);}catch{const r=await fetch(url,{signal:AbortSignal.timeout(120_000)});if(!r.ok)throw Error(`HTTP ${r.status}`);b=Buffer.from(await r.arrayBuffer());await writeFile(path,b);}records.push({id,url,path,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),date:'2026-10-03',status:'downloaded'});console.log(id,name,b.length);}catch(e){records.push({id,url,name,status:'blocked',reason:String(e)});console.log(id,'blocked',String(e));}
 await writeFile(`${root}/downloads.json`,JSON.stringify(records,null,2)+'\n');
}
const names=['forest_ground_04','brown_mud_02','leafy_grass','pebble_ground_01','wood_planks_dirt','bark_willow_02'];
for(let i=0;i<names.length;i++){
 const slug=names[i],id='T0'+(i+1),files=await json(`https://api.polyhaven.com/files/${slug}`),info=await json(`https://api.polyhaven.com/info/${slug}`);await writeFile(`${root}/${slug}-api.json`,JSON.stringify({files,info},null,2)+'\n');
 const color=files.Diffuse??files.diffuse??files.diff;const maps=[['color',color?.['1k']?.jpg??color?.['1k']?.png],['normal',files.nor_gl?.['1k']?.png],['orm',files.arm?.['1k']?.png]];
 for(const [kind,data]of maps){if(!data){records.push({id,kind,status:'missing_map',available:Object.keys(files)});console.log(id,kind,'MISSING',Object.keys(files));continue;}await download(id,data.url,`${slug}-${kind}.${data.url.endsWith('.jpg')?'jpg':'png'}`);}
}
const sky='kloofendal_48d_partly_cloudy_puresky',files=await json(`https://api.polyhaven.com/files/${sky}`);await writeFile(`${root}/${sky}-api.json`,JSON.stringify(files,null,2)+'\n');await download('A01',files.hdri['1k'].hdr.url,'sky-1k.hdr');
// Links observed on the authors' official pages, not constructed file URLs.
await download('M02','https://opengameart.org/sites/default/files/reed.zip','reed.zip');
await download('M03','https://opengameart.org/sites/default/files/waterlily.zip','waterlily.zip');
await writeFile(`${root}/downloads.json`,JSON.stringify(records,null,2)+'\n');
