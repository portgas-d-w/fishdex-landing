import registry from '../game/fish-assets.json';
const aliases:Record<string,string>={'kit-worm':'ver-terre',corn:'mais','kit-lure':'petit-leurre',minnow:'jerkbait','kit2:bread':'pain','kit2:deadfish':'mort-manie','kit2:dry-fly':'mouche-seche','kit2:streamer':'streamer','kit2:topwater':'popper','kit2:feeder':'feeder','v2:feeder':'feeder'};
export function assetURL(id:string,role='techniques'){
 const stem=aliases[id]??id.replace(/^bait:/,'').replaceAll('_','-');
 // Ces trois illustrations changeraient à tort le montage ; schéma neutre à leur place.
 if(['toc','clonk','canne-coup'].includes(stem))return undefined;
 return registry.assets.find(a=>a.role===role&&a.stem===stem)?.url;
}
export function componentArt(id:string,family:string){
 const url=assetURL(id);if(url)return `<img class="component-art" src="${url}" alt="Illustration de l’appât ou du composant" loading="lazy">`;
 const shape=family==='clonk'?'M22 65Q48 70 46 45L55 12M42 64L60 65':family==='hook'?'M55 15V65Q55 85 30 68L36 55':family==='float'?'M40 7V28M40 64V85M40 27C22 27 22 64 40 64C58 64 58 27 40 27Z':family==='feeder'?'M20 25H60V70H20ZM30 25V70M40 25V70M50 25V70':'M14 66Q22 22 57 24Q76 35 51 67Q28 80 14 66';
 return `<svg class="component-art" viewBox="0 0 80 90" role="img" aria-label="Schéma neutre du composant"><path d="${shape}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;
}
