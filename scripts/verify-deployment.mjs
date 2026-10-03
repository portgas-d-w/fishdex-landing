import {readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const [originArg,distArg,outputArg]=process.argv.slice(2);
const origin=new URL(originArg).origin,dist=resolve(distArg);
const digest=b=>createHash('sha256').update(b).digest('hex');
const token=process.env.VERCEL_OIDC_TOKEN;
async function remote(path){
 const url=new URL(path,origin);if(url.origin!==origin)throw Error('Origin mismatch');
 const response=await fetch(url,{redirect:'error',headers:token?{'x-vercel-trusted-oidc-idp-token':token}:{}});
 if(!response.ok)throw Error(`${path}: HTTP ${response.status}`);
 return Buffer.from(await response.arrayBuffer());
}
const manifest=JSON.parse(await readFile(join(dist,'models/manifest.json'),'utf8'));
const paths=(await readdir(join(dist,'assets'))).filter(f=>/\.(js|css)$/.test(f)).map(f=>`assets/${f}`);
paths.push(...(await readdir(join(dist,'fishdex-assets'))).map(f=>`fishdex-assets/${f}`));
paths.push('models/manifest.json',...manifest.models.map(m=>`models/${m.model}.glb`));
const rows=[];
for(let offset=0;offset<paths.length;offset+=8){
 const batch=await Promise.all(paths.slice(offset,offset+8).map(async path=>{
 const local=await readFile(join(dist,path)),hosted=await remote(`/${path}`);
 const row={path,bytes:local.length,sha256:digest(local),hostedSha256:digest(hosted),sameBytes:digest(local)===digest(hosted)};
 // Git normalizes text to LF on Vercel. Retain both raw hashes and prove that
 // replacing CRLF alone gives the remote bytes; never relax binary comparisons.
 if(path==='models/manifest.json'||/^fishdex-assets\/[^/]+\.svg$/.test(path))row.onlyLineEndingDifference=digest(Buffer.from(local.toString('utf8').replaceAll('\r\n','\n')))===digest(hosted);
 if(!row.sameBytes&&!row.onlyLineEndingDifference)throw Error(`Different content: ${path}`);
 return row;
 }));
 rows.push(...batch);
}
const html=(await remote('/')).toString('utf8');
const entry=(html.match(/src="(\/assets\/index-[^"]+\.js)"/)||[])[1];
if(!entry||!rows.some(r=>`/${r.path}`===entry))throw Error('HTML entry does not match local build');
const summary={origin,entry,jsCss:rows.filter(r=>/\.(js|css)$/.test(r.path)).length,models:manifest.models.length,images:paths.filter(p=>p.startsWith('fishdex-assets/')).length,allMatch:true,rows};
await writeFile(outputArg,JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({origin,entry,jsCss:summary.jsCss,models:summary.models,images:summary.images,allMatch:true,entrySha256:rows.find(r=>`/${r.path}`===entry).sha256}));
