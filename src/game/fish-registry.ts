import raw from './fish-registry.json' with {type:'json'};
export const FISH_REGISTRY=raw;
export const APPEARANCES=raw.appearances;
export const fishIdentity=(id:string)=>raw.species.find(s=>s.id===id);
export function canonicalFishId(id:string):string|undefined {
 return raw.species.find(s=>s.id===id)?.id??raw.entries.find(e=>e.id===id)?.parent;
}
export function appearanceFor(id:string,appearance:string|undefined){
 return appearance?APPEARANCES.find(a=>a.id===appearance&&a.parent===id):undefined;
}
export function chooseAppearance(id:string,post:string,random:()=>number){
 const entries=APPEARANCES.filter(a=>a.parent===id&&(!a.post||a.post===post));
 let roll=random();for(const a of entries){roll-=a.weight;if(roll<0)return a.id;}return undefined;
}
export const appearanceName=(id:string|undefined)=>APPEARANCES.find(a=>a.id===id)?.name;
export const profileFor=(id:string)=>fishIdentity(id)?.profile;
