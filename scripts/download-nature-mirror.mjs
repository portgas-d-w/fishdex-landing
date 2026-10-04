import {readFile,writeFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';
const dir='assets-source/free-map-01/nature';await mkdir(dir,{recursive:true});const records=[];
for(const [name,page]of [['birch','R7qMWzb7nk'],['rocks','gYhoEOKItJ'],['bush','J2h3HrO356'],['grass','UGTOzcO3P2']]){
 const source=`https://poly.pizza/m/${page}`;let url;
 try{const html=await(await fetch(source)).text();await writeFile(`${dir}/${name}-page.html`,html);const found=html.match(/https:\/\/static\.poly\.pizza\/[^"&\s<>]+\.glb(?=&|"|\s|<)/);if(!found)throw Error('Observed GLB URL unavailable');url=found[0];const r=await fetch(url,{signal:AbortSignal.timeout(120_000)});if(!r.ok)throw Error(`HTTP${r.status}`);const b=Buffer.from(await r.arrayBuffer());if(b.readUInt32LE(0)!==0x46546c67)throw Error('Not a GLB');const path=`${dir}/${name}.glb`;await writeFile(path,b);records.push({id:'M01',name,path,source,url,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),author:'Quaternius',license:'CC0',date:'2026-10-03',status:'downloaded'});console.log(name,b.length);}catch(e){records.push({id:'M01',name,source,url,status:'blocked',reason:String(e)});console.log(name,'blocked',String(e));}
 await writeFile('assets-source/free-map-01/nature-mirror-downloads.json',JSON.stringify(records,null,2)+'\n');
}
