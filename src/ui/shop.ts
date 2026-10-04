import {SHOP_DEPARTMENTS,SHOP_PRODUCTS,shopProducts,shopGroups,shopCompatible,shopMethods,shopDepartmentName,shopBenefit,shopFamilyName,type ShopDepartment,type ShopProduct} from '../game/shop';
import {ITEMS,levelFor} from '../game/economy';
import {component,available} from '../game/rig';
import {componentAdvice} from '../game/gear-advice';
import {purchase} from '../game/save';
import {purchaseComponent,equipRod,itemCondition} from '../game/progression';
import {wallet} from '../game/development';
import {escapeUI as esc,quantityText,emptyState,unlockReason} from './presentation';
import {componentArt} from './asset-art';
import {gearArt,type ScreenHooks} from './structure';
import './shop.css';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
type Shelf={group:string;family:string;compatible:boolean;limit:number;scroll:number};
const fresh=():Shelf=>({group:'all',family:'all',compatible:false,limit:24,scroll:0});

/** Présentation seulement : achats, accès, réserve et compatibilité viennent du jeu. */
export class ShopScreen {
 private department?:ShopDepartment;
 private shelves=new Map<string,Shelf>();
 private query='';
 private detailId?:string;
 private detailDialog='item-sheet';
 private originScroll=0;
 private originCard?:string;
 private get shelf(){const key=this.query?'search':this.department??'home';if(!this.shelves.has(key))this.shelves.set(key,fresh());return this.shelves.get(key)!;}
 constructor(private h:ScreenHooks){
  const panel=el('shop');panel.classList.add('shop-modal');
  panel.querySelector('.eyebrow')!.remove();
  panel.querySelector('.modal-header>div')!.append(el('shop-balance'));
  el('shop-balance').className='shop-wallet';
  el('shop-list').insertAdjacentHTML('beforebegin','<select id="shop-family" hidden aria-hidden="true" tabindex="-1"><option value="all">Accueil</option>'+[...SHOP_DEPARTMENTS,{id:'decor',name:'Aquarium'}].map(d=>`<option value="${d.id}">${d.name}</option>`).join('')+'</select><div class="shop-search"><label for="shop-query">Rechercher dans toute la boutique</label><div><input id="shop-query" type="search" placeholder="Nom ou usage"><button id="shop-search-clear" class="secondary" aria-label="Effacer la recherche" hidden>×</button></div></div><div id="shop-navigation"></div>');
  panel.querySelector('.modal-footnote')!.textContent='Écus du jeu · Un achat ajoute à votre réserve. Équiper reste un choix dans Matériel.';
  el('shop-query').oninput=()=>{this.query=el<HTMLInputElement>('shop-query').value;this.shelf.limit=24;this.render();};
  el('shop-search-clear').onclick=()=>{this.query='';el<HTMLInputElement>('shop-query').value='';this.render();el('shop-query').focus();};
  el('shop-family').onchange=()=>this.go(el<HTMLSelectElement>('shop-family').value);
  panel.addEventListener('click',event=>{
   const b=(event.target as HTMLElement).closest<HTMLElement>('[data-shop-department],[data-shop-back],[data-shop-group],[data-shop-product],[data-shop-more],[data-shop-reset]');if(!b)return;
   if(b.dataset.shopDepartment)this.go(b.dataset.shopDepartment);
   if(b.hasAttribute('data-shop-back'))this.go('all');
   if(b.dataset.shopGroup){this.shelf.group=b.dataset.shopGroup;this.shelf.family='all';this.shelf.limit=24;this.render();}
   if(b.dataset.shopProduct)this.detail(b.dataset.shopProduct);
   if(b.hasAttribute('data-shop-more')){this.shelf.limit+=24;this.render();}
   if(b.hasAttribute('data-shop-reset')){this.shelves.set(this.query?'search':this.department??'home',fresh());this.query='';el<HTMLInputElement>('shop-query').value='';this.render();}
  });
  document.addEventListener('shop-refresh',()=>this.render());
  for(const id of ['item-sheet','component-detail'])el(id).addEventListener('close',()=>{if(this.detailDialog===id&&this.detailId){this.detailId=undefined;el(id+'-body').replaceChildren();this.restoreOrigin();}});
 }
 opened(){const requested=el<HTMLSelectElement>('shop-family').value;if(requested!==(this.department??'all'))this.go(requested);else this.render();}
 go(id:string){const previous=this.department;this.shelf.scroll=el('shop').scrollTop;this.department=id==='all'?undefined:id as ShopDepartment;this.query='';el<HTMLInputElement>('shop-query').value='';el<HTMLSelectElement>('shop-family').value=id;this.render();const scroll=this.shelf.scroll;el('shop').scrollTop=scroll;requestAnimationFrame(()=>{const target=this.department?el('shop-navigation').querySelector<HTMLElement>('h3'):el('shop-list').querySelector<HTMLElement>(`[data-shop-department="${previous??'rod'}"]`);target?.focus({preventScroll:true});el('shop').scrollTop=scroll;});}
 render(){
  const focused=document.activeElement as HTMLElement,focusId=['shop-compatible','shop-subfamily'].includes(focused.id)?focused.id:undefined,focusGroup=focused.dataset.shopGroup;
  const s=this.h.save(),shelf=this.shelf,search=!!this.query.trim(),home=!this.department&&!search;
  el('shop-balance').textContent=`${s.development?'TEST · ':''}${wallet(s)} écus · Niveau ${levelFor(s.xp)}`;
  el('shop-search-clear').hidden=!this.query;
  el('shop-navigation').innerHTML=home?'':`<div class="shop-heading"><button class="secondary" data-shop-back>← Rayons</button><h3 tabindex="-1">${search?'Résultats dans tous les rayons':shopDepartmentName(this.department!)}</h3></div>`;
  const list=el('shop-list');list.className=home?'shop-home':'shop-products';
  if(home){list.innerHTML='<div class="shop-departments">'+SHOP_DEPARTMENTS.map(d=>`<button class="shop-department" data-shop-department="${d.id}"><span class="shop-art">${this.departmentArt(d.id)}</span><strong>${d.name}</strong><small>${d.hint}</small></button>`).join('')+'</div><section class="shop-aquarium"><button class="secondary" data-shop-department="decor"><span>'+gearArt('decor')+'</span><span><strong>Aquarium</strong><small>Décorations du bassin · rayon séparé</small></span><span aria-hidden="true">→</span></button></section>';return;}
  if(!search){const groups=shopGroups(this.department!);if(groups.length>1)el('shop-navigation').insertAdjacentHTML('beforeend','<nav class="shop-groups" aria-label="Sous-rayons">'+['all',...groups].map(g=>`<button class="secondary" data-shop-group="${esc(g)}" aria-pressed="${shelf.group===g}">${g==='all'?'Tout le rayon':esc(g)}</button>`).join('')+'</nav>');}
  if(this.department!=='decor'||search)el('shop-navigation').insertAdjacentHTML('beforeend','<label class="shop-compatible"><input id="shop-compatible" type="checkbox" '+(shelf.compatible?'checked':'')+'> Compatible avec ma canne <small>Technique et montage actuels</small></label>');
  const familyProducts=shopProducts(s,{department:search?undefined:this.department,group:search?'all':shelf.group});
  const families=[...new Set(familyProducts.map(p=>p.family))];
  if(!search&&this.department==='bait'&&shelf.group!=='all'&&families.length>1)el('shop-navigation').insertAdjacentHTML('beforeend','<label class="shop-family-label">Famille<select id="shop-subfamily"><option value="all">Toutes les familles</option>'+families.map(f=>`<option value="${esc(f)}" ${shelf.family===f?'selected':''}>${esc(shopFamilyName(f))}</option>`).join('')+'</select></label>');
  if(el('shop-compatible'))el('shop-compatible').onchange=()=>{shelf.compatible=el<HTMLInputElement>('shop-compatible').checked;shelf.limit=24;this.render();};
  if(el('shop-subfamily'))el('shop-subfamily').onchange=()=>{shelf.family=el<HTMLSelectElement>('shop-subfamily').value;shelf.limit=24;this.render();};
  const products=shopProducts(s,{department:search?undefined:this.department,group:search?'all':shelf.group,family:search?'all':shelf.family,query:this.query,compatible:shelf.compatible});
  el('shop-navigation').insertAdjacentHTML('beforeend',`<p class="shop-results" role="status">${products.length} article${products.length>1?'s':''}${search?' · chaque résultat indique son rayon':''}</p>`);
  list.innerHTML=products.length?products.slice(0,shelf.limit).map(p=>this.card(p,search)).join(''):emptyState('Aucun article dans cette sélection','Retirez le filtre de compatibilité ou essayez un autre mot.')+'<button class="secondary" data-shop-reset>Réinitialiser la sélection</button>';
  if(products.length>shelf.limit)list.insertAdjacentHTML('beforeend',`<button class="secondary shop-more" data-shop-more>Voir la suite · ${Math.min(shelf.limit,products.length)} / ${products.length}</button>`);
  if(focusId)el(focusId)?.focus({preventScroll:true});else if(focusGroup)[...el('shop-navigation').querySelectorAll<HTMLElement>('[data-shop-group]')].find(b=>b.dataset.shopGroup===focusGroup)?.focus({preventScroll:true});
 }
 private departmentArt(id:ShopDepartment){return id==='rod'?gearArt('rod'):id==='bait'?componentArt('corn','bait'):id==='rig'?componentArt('loaded-float','float'):id==='accessories'?componentArt('soft-elastic','elastic'):gearArt(id==='line'?'line':id);}
 private art(p:ShopProduct){return p.component?componentArt(p.id,p.component.slot):gearArt(p.item!.kind==='rod'?'rod':'decor');}
 private status(p:ShopProduct){const s=this.h.save(),i=p.component,equipped=i?Object.values(s.tackle.config.components).includes(p.id):s.equipped===p.id;return equipped?'Équipé':i&&(s.tackle.stock[p.id]??0)>0?`En stock · ${quantityText(available(s.tackle,p.id),i.unit)}`:p.item&&s.inventory.includes(p.item.id)?'Possédé':itemCondition(s,p.id)?'Verrouillé':p.price===0?'Gratuit':'Disponible';}
 private card(p:ShopProduct,search:boolean){return `<button class="shop-product" data-shop-product="${p.id}"><span class="shop-art">${this.art(p)}</span>${search?'<small class="shop-rayon">'+esc(shopDepartmentName(p.department))+'</small>':''}<strong>${esc(p.name)}</strong><span class="shop-benefit">${esc(shopBenefit(p))}</span><span class="shop-price">${p.price===0?'Gratuit':p.price+' écus'}${p.component?'<small>/ '+quantityText(p.component.pack,p.component.unit)+'</small>':''}</span><span class="shop-status">${esc(this.status(p))}</span></button>`;}
 private restoreOrigin(){requestAnimationFrame(()=>{if(!el<HTMLDialogElement>('shop').open)return;el('shop').scrollTop=this.originScroll;const target=[...el('shop').querySelectorAll<HTMLButtonElement>('[data-shop-product]')].find(b=>b.dataset.shopProduct===this.originCard);target?.focus({preventScroll:true});});}
 detail(id:string){
  const p=SHOP_PRODUCTS.find(p=>p.id===id);if(!p)return;
  this.detailId=id;this.originScroll=el('shop').scrollTop;this.originCard=id;this.detailDialog=p.component?'component-detail':'item-sheet';
  this.renderDetail(p);this.h.open(this.detailDialog);
 }
 private renderDetail(p:ShopProduct){
  const s=this.h.save(),i=p.component,dialog=p.component?'component-detail':'item-sheet',lock=unlockReason(s,p.id),fits=shopCompatible(p,s),owned=!!p.item&&s.inventory.includes(p.item.id),solvent=!!s.development?.unlimitedMoney||s.coins>=p.price;
  el(dialog+'-title').textContent=p.name;
  const methods=shopMethods(p);
  const a=i?componentAdvice(i):undefined,current=i?component(s.tackle.config.components[i.slot]??''):undefined,rod=ITEMS.find(r=>r.id===s.equipped)!;
  const compare=i&&current&&current.id!==i.id?`<details class="shop-comparison"><summary>Comparer à ${esc(current.name)}</summary><p>${esc(a!.trade)}</p>${i.diet&&current.diet&&i.diet!==current.diet?'<p>Régime : '+({plants:'végétaux',invertebrates:'invertébrés',fish:'poissons'})[current.diet]+' → '+({plants:'végétaux',invertebrates:'invertébrés',fish:'poissons'})[i.diet]+'. Habitat et profondeur restent déterminants.</p>':''}${(['strength','control','mass','capacity'] as const).filter(k=>i[k]!==undefined&&current[k]!==undefined).map(k=>`<p>${({strength:'Résistance de jeu',control:'Contrôle de jeu',mass:'Masse (g)',capacity:i.slot==='landing'?'Gabarit maximal (cm)':'Portance (g)'})[k]} : ${current[k]} → ${i[k]}</p>`).join('')}</details>`:p.item?.kind==='rod'&&rod.id!==p.id&&fits?`<details class="shop-comparison"><summary>Comparer à ${esc(rod.name)}</summary><p>Contrôle de jeu : ${rod.power} → ${p.item.power}. La technique, la portée et la réception restent celles de votre montage.</p></details>`:'';
  const utility=a?.role??shopBenefit(p),diet=i?.diet?({plants:'Végétaux et graines',invertebrates:'Insectes et invertébrés',fish:'Poissons et alevins'})[i.diet]:undefined;
  const compatibility=p.department==='decor'?'<p class="intro">Personnalisation visuelle de l’aquarium.</p>':'<p class="'+(fits?'intro':'warning-line')+'">'+(fits?'Compatible avec votre canne, technique et montage actuels.':'Incompatible avec le montage actuel. Choisissez sa technique dans Matériel ; un achat ne change pas votre montage.')+'</p>';
  const action=lock?'<p class="warning-line">Verrouillé : '+esc(lock)+'</p><button class="secondary" data-ui-unlock>Voir ma progression</button>':!owned?'<div class="shop-purchase">'+(i?'<label class="preset-label">Nombre de lots<input id="shop-quantity" type="number" min="1" max="20" step="1" value="1"></label>':'')+'<p id="shop-detail-total" role="status"></p><button id="shop-detail-buy" class="action">Acheter</button><p class="intro">Ajout à la réserve, sans équipement automatique.</p></div>':p.item?.kind==='rod'&&s.equipped!==p.id?'<button id="shop-detail-equip" class="action" '+(!fits||this.h.game.phase!=='idle'?'disabled':'')+'>Équiper cette canne</button>':'';
  el(dialog+'-body').innerHTML=`<div class="shop-detail-art">${this.art(p)}</div><span class="state-pill">${esc(this.status(p))}</span><p class="intro">${esc(utility)}${diet?' Régime : '+diet+'.':''}</p>${compatibility}${action}<p id="shop-detail-error" class="warning-line" role="status">${!solvent&&!lock&&!owned?'Argent insuffisant pour un lot. Le kit gratuit reste disponible.':''}</p>${compare}<details><summary>Utilité, effets et compromis</summary><p>${esc(p.description)}</p>${a?'<p>'+esc(a.effects.join(' '))+'</p><p>'+esc(a.trade)+'</p>':''}${i?'<p>'+quantityText(available(s.tackle,p.id),i.unit)+' libres · '+p.price+' écus / '+quantityText(i.pack,i.unit)+'</p>':''}</details>${p.department==='decor'?'':'<details><summary>Méthodes compatibles · '+methods.length+'</summary><p>'+methods.map(t=>esc(t.name)).join(' · ')+'</p></details>'}`;
  if(el('shop-detail-buy')){
   const update=()=>{const n=i?Number(el<HTMLInputElement>('shop-quantity').value):1,valid=Number.isSafeInteger(n)&&n>=1&&n<=20,total=n*p.price;el('shop-detail-total').textContent=valid?`${i?quantityText(n*i.pack,i.unit)+' · ':''}Total ${total} écus · Solde ${wallet(s)} écus`:'Choisissez entre 1 et 20 lots entiers.';el<HTMLButtonElement>('shop-detail-buy').disabled=!valid||!s.development?.unlimitedMoney&&s.coins<total;el('shop-detail-buy').textContent='Acheter · '+(valid?total+' écus':'quantité invalide');el('shop-detail-error').textContent=valid&&!s.development?.unlimitedMoney&&s.coins<total?'Argent insuffisant pour cette quantité.':'';};update();
   if(i)el('shop-quantity').oninput=update;el('shop-detail-buy').onclick=()=>this.confirm(p.id,i?Number(el<HTMLInputElement>('shop-quantity').value):1);
  }
  if(el('shop-detail-equip'))el('shop-detail-equip').onclick=()=>{const error=equipRod(s,p.item!.id);if(error){el('shop-detail-error').textContent=error;return;}this.h.game.equipment=s.equipped;this.h.game.equipmentPower=p.item!.power;this.h.persist();this.h.refresh();this.renderDetail(p);this.render();};
 }
 confirm(id:string,count=1){
  const p=SHOP_PRODUCTS.find(p=>p.id===id),s=this.h.save();if(!p||itemCondition(s,id)||p.item&&s.inventory.includes(p.item.id))return;
  const n=p.component?count:1;if(!Number.isSafeInteger(n)||n<1||n>20)return;
  const total=n*p.price,solvent=!!s.development?.unlimitedMoney||s.coins>=total;
  el('purchase-confirm-title').textContent='Confirmer mon achat';el('purchase-confirm-body').innerHTML=`<h3>${esc(p.name)}</h3><p>${p.component?quantityText(n*p.component.pack,p.component.unit)+' · ':''}${total} écus · Solde ${wallet(s)} écus</p><p class="intro">L’achat ajoute à votre réserve et conserve votre montage.</p><p id="shop-purchase-error" class="warning-line" role="status">${solvent?'':'Argent insuffisant.'}</p><button id="${p.component?'component-confirm':'purchase-yes'}" class="action" ${solvent?'':'disabled'}>Confirmer · ${total} écus</button>`;
  const button=el<HTMLButtonElement>(p.component?'component-confirm':'purchase-yes');button.onclick=()=>{if(button.disabled)return;button.disabled=true;const error=p.component?purchaseComponent(this.h.save(),id,n):purchase(this.h.save(),p.item!.id);if(error){el('shop-purchase-error').textContent=error;return;}this.h.persist();this.h.toast('Achat ajouté à votre réserve.');this.h.close('purchase-confirm');if(this.detailId===id&&el<HTMLDialogElement>(this.detailDialog).open)this.h.close(this.detailDialog);this.h.refresh();this.render();this.restoreOrigin();};this.h.open('purchase-confirm');
 }
}
